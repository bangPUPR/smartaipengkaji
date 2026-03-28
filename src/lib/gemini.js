// ============================================================
//  MULTI-MODAL AI VISION & DOCUMENT ROUTER
//  Menggantikan fungsi asli gemini tunggal menjadi multi-AI
// ============================================================

const env = import.meta.env;

const MODELS = {
  GEMINI: {
    id: 'gemini-2.5-flash',
    url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.VITE_GEMINI_API_KEY}`
  },
  OPENAI: {
    id: 'gpt-4o',
    url: 'https://api.openai.com/v1/chat/completions',
    key: env.VITE_OPENAI_API_KEY
  },
  CLAUDE: {
    id: 'claude-3-5-sonnet-20241022',
    url: 'https://api.anthropic.com/v1/messages',
    key: env.VITE_CLAUDE_API_KEY
  }
};

/**
 * Menganalisis gambar/dokumen (multi-file) berbasis komponen menggunakan AI terpilih.
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

  // 1. Tentukan Provider berdasarkan Kompleksitas / Aspek
  let provider = 'gemini';
  const hasPDF = filesData.some(f => f.mimeType === 'application/pdf');

  if (hasPDF) {
    provider = 'gemini'; // PDF paling stabil dihandle oleh Gemini 2.5
  } else if (kategori === 'administrasi') {
    provider = 'gemini'; // Tugas administratif ringan
  } else {
    // Foto Lapangan Teknis
    const a = aspek.toLowerCase();
    if (a.includes('struktur') || a.includes('kebakaran')) provider = 'claude';
    else if (a.includes('arsitektur') || a.includes('mep')) provider = 'openai';
    else provider = 'gemini';
  }

  console.log(`[Vision Router] Aspek: ${aspek || kategori}. Menugaskan -> ${provider.toUpperCase()}`);

  // 2. Siapkan Prompt Bersama dengan Deep Reasoning Engineering
  let systemPrompt = '';
  if (kategori === 'administrasi') {
    systemPrompt = `Anda adalah seorang Auditor Administrasi Tingkat Lanjut untuk Sertifikat Laik Fungsi (SLF) Bangunan Gedung di Indonesia.
Gunakan mekanisme "Deep Reasoning Engineering" untuk menelaah secara komprehensif, akademis, dan presisi terhadap ${filesData.length} file dokumen/bukti historis berikut pada komponen perizinan: "${componentName}".

INSTRUKSI ANALISIS (WAJIB DIIKUTI TANPA HALUSINASI):
1. Verifikasi silang ontologi dokumen yang dilampirkan. Apakah penerbitnya valid? Apakah masa berlakunya rasional berdasarkan hukum pengadaan dan perizinan Indonesia (PP No. 16 Tahun 2021)?
2. Tuliskan abstraksi/catatan teknis dari isi dokumen tersebut dengan Bahasa Indonesia yang baku, akademis, lugas, dan sama sekali TIDAK retoris. Hindari kata sifat subyektif. Objektifikasi setiap temuan.
3. Tentukan klasifikasi 'status' kepatuhan administratif secara presisi. WAJIB memilih salah satu konklusi tunggal dari daftar berikut: "ada_sesuai", "ada_tidak_sesuai", atau "tidak_ada".

Anda HARUS merespons dalam format JSON Object murni TANPA block markdown.
Format JSON wajib: { "status": "<pilihan status>", "catatan": "<abstraksi teknis 2-3 kalimat akademis padat>" }`;
  } else {
    systemPrompt = `Anda adalah seorang Ahli Rekayasa Fundamental (Insinyur Sipil/Struktur/Arsitektur) dengan spesialisme Audit Keandalan Bangunan Gedung (SNI 9273:2025).
Terapkan metode "Deep Reasoning Engineering" untuk membedah secara fundamental probabilitas kegagalan, degradasi, dan/atau kondisi fisik nyata pada ${filesData.length} sampel visual berikut dari komponen: "${componentName}".

INSTRUKSI EVALUASI FORENSIK (WAJIB DIIKUTI TANPA HALUSINASI):
1. Dekonstruksi visual secara analitis. Jika Anda melihat anomali (misalnya: pola retakan rambut melintang pada pelat, korosi karbonasi pada tulangan, atau kerusakan fungsional kosmetik), jabarkan secara deterministik.
2. Formasikan konklusi ke dalam Bahasa Indonesia yang sangat teknokratis, akademis, ilmiah, profesional, dan non-retoris. Tidak ada narasi pembuka. Fokus langsung pada patologi material bangunan.
3. Ekstraksi status kelayakan struktur/elemen tersebut, lalu WAJIB simpulkan pemodelannya ke DALAM SATU NILAI dari set konstan berikut: "baik", "sedang", "buruk", atau "kritis".

Anda HARUS merespons dalam format JSON Object murni TANPA block markdown.
Format JSON wajib: { "status": "<pilihan status>", "catatan": "<diagnosa teknis/patologi bangunan 1-2 kalimat akademis padat>" }`;
  }

  // 3. Routing Panggilan
  let aiResultText = "";
  let realProvider = provider;

  try {
    if (provider === 'gemini') {
      aiResultText = await callGeminiVision(filesData, systemPrompt);
    } 
    else if (provider === 'openai') {
      aiResultText = await callOpenAIVision(filesData, systemPrompt);
    } 
    else if (provider === 'claude') {
      try {
        aiResultText = await callClaudeVision(filesData, systemPrompt);
      } catch (err) {
        console.warn("Claude Vision diblokir CORS/Error, Fallback ke OpenAI...", err.message);
        aiResultText = await callOpenAIVision(filesData, systemPrompt);
        realProvider = 'openai (fallback)';
      }
    }
  } catch (error) {
    throw new Error(`Gagal memanggil API Vision ${realProvider.toUpperCase()}: ${error.message}`);
  }

  // 4. Parsing Output JSON
  let parsedJson;
  try {
    const raw = aiResultText.replace(/```json/gi, '').replace(/```/g, '').trim();
    parsedJson = JSON.parse(raw);
  } catch(e) {
    console.error("Gagal parsing JSON dari Vision AI: ", aiResultText);
    throw new Error(`AI JSON invalid: ${aiResultText.substring(0,60)}...`);
  }

  return parsedJson;
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
