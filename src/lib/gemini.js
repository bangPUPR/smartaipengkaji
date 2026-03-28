// ============================================================
//  MULTI-MODAL AI VISION & DOCUMENT ROUTER
//  Menggantikan fungsi asli gemini tunggal menjadi multi-AI
// ============================================================

const env = import.meta.env;

const MODELS = {
  GEMINI: {
    id: 'gemini-1.5-flash',
    url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${env.VITE_GEMINI_API_KEY}`
  },
  OPENAI: {
    id: 'gpt-4o',
    url: env.PROD ? 'https://api.openai.com/v1/chat/completions' : '/api/openai/v1/chat/completions',
    key: env.VITE_OPENAI_API_KEY
  },
  CLAUDE: {
    id: 'claude-3-5-sonnet-20241022',
    url: env.PROD ? 'https://api.anthropic.com/v1/messages' : '/api/claude/v1/messages',
    key: env.VITE_CLAUDE_API_KEY
  }
};

/**
 * Menganalisis gambar/dokumen (multi-file) berbasis komponen menggunakan AI terpilih (dengan Failover cerdas).
 * @param {Array<{base64: string, mimeType: string}>} filesData
 * @param {string} componentName
 * @param {string} kategori
 * @param {string} aspek
 * @returns {Promise<{status: string, catatan: string}>}
 */
export async function analyzeChecklistImage(filesData, componentName, kategori = 'teknis', aspek = '') {
  if (!filesData || filesData.length === 0) {
    throw new Error('Tidak ada file untuk dianalisis.');
  }

  // 1. Tentukan Urutan Provider (Chain of Responsibility)
  // Default: Gemini (Paling murah/gratis) -> OpenAI -> Claude
  let providerChain = ['gemini', 'openai', 'claude'];
  
  // Custom priority based on complexity
  const a = aspek.toLowerCase();
  if (a.includes('struktur') || a.includes('kebakaran')) {
    providerChain = ['claude', 'openai', 'gemini']; 
  } else if (kategori === 'administrasi') {
    providerChain = ['gemini', 'openai'];
  }

  // 2. Siapkan Prompt Bersama dengan Deep Reasoning Engineering
  let systemPrompt = '';
  if (kategori === 'administrasi') {
    systemPrompt = `Anda adalah seorang Auditor Administrasi Tingkat Lanjut untuk Sertifikat Laik Fungsi (SLF) Bangunan Gedung di Indonesia.
Gunakan mekanisme "Deep Reasoning Engineering" untuk menelaah secara komprehensif terhadap ${filesData.length} file dokumen pada komponen: "${componentName}".
Verifikasi kesesuaian berdasarkan PP No. 16 Tahun 2021.
Format JSON wajib: { "status": "ada_sesuai|ada_tidak_sesuai|tidak_ada", "catatan": "<abstraksi teknis padat>" }`;
  } else {
    systemPrompt = `Anda adalah seorang Insinyur Sipil/Struktur Ahli Audit Keandalan Bangunan (SNI 9273:2025).
Gunakan "Deep Reasoning Engineering" untuk mendiagnosa ${filesData.length} sampel visual dari komponen: "${componentName}".
Analisis patologi material dan risiko kegagalan.
Format JSON wajib: { "status": "baik|sedang|buruk|kritis", "catatan": "<diagnosa teknis padat>" }`;
  }

  // 3. Eksekusi dengan Failover Otomatis
  let lastError = null;
  for (const provider of providerChain) {
    try {
      console.log(`[Vision AI] Mencoba provider: ${provider.toUpperCase()} untuk ${componentName}`);
      let aiResultText = "";
      
      if (provider === 'gemini') {
        aiResultText = await callGeminiVision(filesData, systemPrompt);
      } else if (provider === 'openai') {
        if (!MODELS.OPENAI.key) continue;
        aiResultText = await callOpenAIVision(filesData, systemPrompt);
      } else if (provider === 'claude') {
        if (!MODELS.CLAUDE.key) continue;
        aiResultText = await callClaudeVision(filesData, systemPrompt);
      }

      // 4. Parsing Output JSON
      const raw = aiResultText.replace(/```json/gi, '').replace(/```/g, '').trim();
      return JSON.parse(raw);

    } catch (error) {
      lastError = error;
      console.warn(`[Vision AI] Provider ${provider.toUpperCase()} Gagal:`, error.message);
      // Lanjut ke provider berikutnya di chain...
    }
  }

  throw new Error(`Seluruh AI Vision gagal memproses gambar. Error terakhir: ${lastError?.message}`);
}

/**
 * AI Document Processor - Khusus untuk klasifikasi & OCR dokumen SLF
 * @param {Object} fileData {base64, mimeType}
 * @returns {Promise<{category: string, subcategory: string, extracted_text: string, metadata: Object}>}
 */
export async function analyzeDocument(fileData) {
  const prompt = `Anda adalah AI Dokumentasi Bangunan Gedung (Auditor Teknis).
Analisis gambar/dokumen ini dan tentukan:
1. Kategori (Hanya pilih: "tanah" atau "umum")
2. Sub-kategori sesuai daftar: "Dokumen Kepemilikan Lahan", "Izin Pemanfaatan Tanah", "Gambar Batas Tanah", "Hasil Penyelidikan Tanah", "Siteplan Disetujui", "Andalalin", "Sartek Polres", "Sartek Bina Marga", "AMDAL / UKL-UPL", "Proteksi Kebakaran", "Peil Banjir", "Irigasi", "Intensitas Bangunan (KKPR/KRK)", "Perizinan Bangunan (IMB/PBG/SLF)", "Identitas Pemilik".
3. Ekstrak teks penting (Nomor Dokumen, Tanggal Terbit, Nama Pemilik/Pemohon).
4. Berikan abstraksi singkat isi dokumen.

Output WAJIB JSON murni:
{
  "category": "...",
  "subcategory": "...",
  "extracted_text": "...",
  "metadata": {
    "doc_no": "...",
    "date": "...",
    "owner": "..."
  }
}`;

  try {
    const rawResult = await callGeminiVision([fileData], prompt);
    const cleanJson = rawResult.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (e) {
    console.error("[Document AI] Gagal:", e);
    throw e;
  }
}

// ── IMPLEMENTASI PEMANGGILAN SPESIFIK PROVIDER ──────────────────

async function callGeminiVision(filesData, prompt) {
  if (!env.VITE_GEMINI_API_KEY) throw new Error("API Key Gemini hilang");
  const imageParts = filesData.map(file => ({
    inline_data: { mime_type: file.mimeType, data: file.base64 }
  }));

  const res = await fetch(MODELS.GEMINI.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }, ...imageParts] }],
      generationConfig: { temperature: 0.2 }
    })
  });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
}

async function callOpenAIVision(filesData, prompt) {
  if (!MODELS.OPENAI.key) throw new Error("API Key OpenAI hilang");
  
  const contentArray = [{ type: "text", text: prompt }];
  filesData.forEach(file => {
    contentArray.push({
      type: "image_url",
      image_url: { url: `data:${file.mimeType};base64,${file.base64}` }
    });
  });

  const res = await fetch(MODELS.OPENAI.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${MODELS.OPENAI.key}`
    },
    body: JSON.stringify({
      model: MODELS.OPENAI.id,
      messages: [{ role: 'user', content: contentArray }],
      temperature: 0.2,
      max_tokens: 500
    })
  });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "{}";
}

async function callClaudeVision(filesData, prompt) {
  if (!MODELS.CLAUDE.key) throw new Error("API Key Claude hilang");
  
  const contentArray = [];
  filesData.forEach(file => {
    // Anthropic mengharapkan mimetype tanpa parameter ekstra
    const mime = file.mimeType.split(';')[0];
    contentArray.push({
      type: "image",
      source: {
        type: "base64",
        media_type: mime,
        data: file.base64
      }
    });
  });
  contentArray.push({ type: "text", text: prompt });

  const res = await fetch(MODELS.CLAUDE.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': MODELS.CLAUDE.key,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: MODELS.CLAUDE.id,
      max_tokens: 1024,
      temperature: 0.2,
      messages: [{ role: 'user', content: contentArray }]
    })
  });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return data.content?.[0]?.text || "{}";
}
