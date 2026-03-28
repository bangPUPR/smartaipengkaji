// ============================================================
//  MULTI-MODEL AI ROUTER - ASPECT BASED (CHUNKED)
//  Menjalankan analisa mendalam Deep Reasoning per bidang NSPK
// ============================================================

const env = import.meta.env;

// Model Router Config
const MODELS = {
  GEMINI: {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.VITE_GEMINI_API_KEY}`,
    vendor: 'google'
  },
  OPENAI: {
    id: 'gpt-4o',
    name: 'OpenAI GPT-4o',
    url: 'https://api.openai.com/v1/chat/completions',
    key: env.VITE_OPENAI_API_KEY,
    vendor: 'openai'
  },
  CLAUDE: {
    id: 'claude-3-5-sonnet-20241022',
    name: 'Claude 3.5 Sonnet',
    url: 'https://api.anthropic.com/v1/messages', 
    key: env.VITE_CLAUDE_API_KEY,
    vendor: 'anthropic'
  }
};

/**
 * Menghasilkan Deep Reasoning Prompt berdasarkan Aspek dan NSPK terkait
 */
function getPromptForAspek(aspek, items) {
  const a = aspek.toLowerCase();

  // ── KHUSUS ASPEK ADMINISTRASI (Engineering Auditor Prompt) ──────
  if (a.includes('administrasi')) {
    const dataBlock = items.map(i => {
      const statusLabel = {
        'ada_sesuai': 'Ada & Sesuai',
        'ada_tidak_sesuai': 'Ada Tapi Tidak Sesuai',
        'tidak_ada': 'Tidak Ada / Kosong',
        'pertama_kali': 'Pengajuan Pertama Kali',
        'tidak_wajib': 'Tidak Wajib',
        'tidak_ada_renovasi': 'Tidak Ada Renovasi'
      }[i.status] || i.status;
      return `${i.kode} – ${i.nama}: ${statusLabel} ${i.catatan ? `\n   Catatan: ${i.catatan}` : ''}`;
    }).join('\n');

    return `Anda adalah AI Engineering Auditor yang berperan sebagai Ahli Bangunan Gedung, Auditor Kepatuhan Regulasi, dan Konsultan Teknis NSPK PUPR.

Tugas Anda adalah melakukan ANALISIS MENDALAM terhadap aspek ADMINISTRASI bangunan gedung.

Gunakan pendekatan:
- Rule-based (NSPK Indonesia)
- Risk-based assessment
- Compliance scoring
- Evidence-based reasoning (Deep Reasoning Engineering)

Acuan regulasi WAJIB:
- PP No. 16 Tahun 2021 tentang Bangunan Gedung
- UU No. 28 Tahun 2002 tentang Bangunan Gedung
- Permen PUPR terkait SLF, PBG, dan penyelenggaraan bangunan gedung.

---

### 📊 DATA INPUT:
[DATA]
${dataBlock}

---

### 🔍 INSTRUKSI ANALISIS (WAJIB):
Untuk setiap item (A01–A10), lakukan analisis mendalam mencakup:
1. STATUS KEPATUHAN (Sesuai/Tidak Sesuai/Tidak Ada/Kedaluwarsa/Parsial)
2. ANALISIS TEKNIS (Interpretasi kondisi, validitas legalitas, kesesuaian fungsi)
3. DASAR REGULASI (Wajib sebutkan PASAL spesifik, misal: PP 16/2021 Pasal xxx)
4. RISIKO TEKNIS & HUKUM (Dampak keselamatan, sanksi administrasi, risiko operasional)
5. TINGKAT RISIKO (Rendah/Sedang/Tinggi/Kritis)
6. REKOMENDASI TEKNIS (Tindakan spesifik & Prioritas)

### 📈 ANALISIS GLOBAL:
1. SKOR KEPATUHAN ADMINISTRASI (%)
2. KATEGORI KELAYAKAN ADMINISTRASI (Laik / Laik Bersyarat / Tidak Laik)
3. TEMUAN KRITIS (Critical Findings)
4. HUBUNGAN ANTAR DOKUMEN (Dependency analysis)
5. PREDIKSI RISIKO KEDEPAN

Anda WAJIB memberikan balasan strictly berupa format JSON MURNI tanpa markdown blok (\` \` \`json).

STRUKTUR JSON:
{
  "skor_aspek": (Nilai Integer 0-100),
  "narasi_teknis": "(Seluruh Analisis Mendalam per item, Tabel Ringkasan, dan Analisis Global dikemas dalam format Markdown yang sangat rapi dan profesional)",
  "rekomendasi": [
     {
       "aspek": "Administrasi",
       "prioritas": "kritis | tinggi | sedang | rendah",
       "judul": "...",
       "tindakan": "...",
       "standar": "PP 16/2021"
     }
  ]
}`;
  }

  // ── ASPEK TEKNIS LAINNYA (Struktur, Arsitektur, MEP, dll) ────────
  let roleTitle = '';
  let standard = '';
  let instruction = '';

  if (a.includes('struktur')) {
    roleTitle = 'Ahli Rekayasa Fundamental (Insinyur Sipil/Struktur)';
    standard  = 'SNI 9273:2025 (Evaluasi dan rehabilitasi seismik eksisting) dan ASCE/SEI 41-17';
    instruction = 'Gunakan kerangka pikir Deep Reasoning untuk menghitung probabilitas kegagalan elemen struktur secara deterministik. Fokus pada stabilitas, distribusi gaya lintang, dan dekomposisi material (seperti karbonasi/korosi).';
  } else if (a.includes('arsitektur')) {
    roleTitle = 'Principal Architect & Penilai Estetika Fungsional';
    standard  = 'NSPK Bangunan Gedung (Estetika, Tata Ruang, Kulit Bangunan)';
    instruction = 'Telaah secara komprehensif anomali pada selubung/fasad bangunan, integritas batas visual ruang, serta degradasi fungsional arsitektural.';
  } else if (a.includes('mep') || a.includes('mekanikal')) {
    roleTitle = 'Insinyur Utilitas (Mekanikal, Elektrikal, Plumbing)';
    standard  = 'SNI PUIL 2011 (Ketenagalistrikan), SNI Plumbing, dan Standar Udara ASHRAE';
    instruction = 'Lakukan forensik operasional. Cek risiko short-circuit, bahaya kebocoran (leakage), serta kegagalan sistem pengondisian tata udara. Jangan berasumsi, fokus pada data mentah.';
  } else if (a.includes('kebakaran') || a.includes('proteksi')) {
    roleTitle = 'Fire Safety & Risk Mitigation Engineer';
    standard  = 'Permen PU 26/2008 & SNI Proteksi Kebakaran Aktif/Pasif';
    instruction = 'Bedah secara ekstrem probabilitas evakuasi mandiri (Life Safety), kinerja sprinkler/hydrant, dan resistensi material terhadap suhu tinggi.';
  } else {
    // Kesehatan, Kenyamanan, Kemudahan
    roleTitle = 'Auditor Kesehatan, Kenyamanan, dan Kemudahan Gedung';
    standard  = 'Permen PUPR No 14/PRT/M/2017 (Persyaratan Kemudahan Bangunan)';
    instruction = 'Analisislah indikator sirkulasi inklusif (akses disabilitas), tata udara dan pencahayaan alami (kesehatan ruang), serta akustik/vibrasi (kenyamanan ruang).';
  }

  const criticalItems = items.filter(i => i.status === 'buruk' || i.status === 'kritis' || i.status === 'tidak_ada' || i.status === 'ada_tidak_sesuai');
  const skorPecahan = criticalItems.length > 0 ? (100 - (criticalItems.length * 15)) : 100;
  const estimasiSkor = Math.max(0, Math.min(100, skorPecahan));

  const contextData = {
    aspek_yang_dinilai: aspek,
    total_data_komponen: items.length,
    komponen_cacat: criticalItems.map(c => `[${c.kode}] ${c.nama} - Status: ${c.status} - Catatan AI/Klien: ${c.catatan || 'N/A'}`),
    semua_komponen: items.map(c => `[${c.kode}] ${c.status}`)
  };

  return `Anda adalah seorang ${roleTitle} profesional Tingkat Lanjut.
Tugas Anda adalah merumuskan Laporan Partial SLF (Sertifikat Laik Fungsi) khusus bidang: "${aspek.toUpperCase()}".

Metodologi Analisis (Wajib Diikuti):
1. Gunakan algoritma [Deep Reasoning Engineering] sesuai standar teknis acuan: ${standard}.
2. ${instruction}
3. AKTIFKAN MODE: [WORD_SAFE_EXPORT]
   - Penulisan: Bahasa formal Indonesia (Engineering Report Style).
   - Struktur Per Item (WAJIB): Jika menganalisis komponen spesifik, gunakan urutan: 
     * STATUS: [Isi] 
     * ANALISIS: [Isi] 
     * DASAR HUKUM: [PP 16/2021 / SNI] 
     * RISIKO: [Dampak] 
     * REKOMENDASI: [Solusi]
   - Tipografi: DILARANG emoji. Gunakan penomoran linear (1., 1.1, 1.2).
   - Justifikasi: Setiap temuan wajib memiliki dasar regulasi yang jelas.
4. Saya mendeteksi ${criticalItems.length} masalah spesifik dalam observasi as-built. Evaluasi rasionalitas dari temuan tersebut.

Data Mentah Komponen Pengecekan Lapangan:
${JSON.stringify(contextData, null, 2)}

Anda WAJIB memberikan balasan strictly berupa format JSON MURNI tanpa markdown blok (\` \` \`json) atau perkenalan apapun.

STRUKTUR JSON YANG DIHARAPKAN:
{
  "skor_aspek": (Nilai Integer dari 0-100 secara rasional. Estimasi kasarnya adalah ${estimasiSkor}, sesuaikan jika Anda menganggap lebih kritis),
  "narasi_teknis": "Abstraksi teknis setajam mata pakar berdasarkan standar ${standard} dan aturan WORD_SAFE_EXPORT di atas (Maksimal 250 kata, tata bahasa formal, lugas, non-retoris, IDENTIK untuk format Word).",
  "rekomendasi": [
     {
       "aspek": "${aspek}",
       "prioritas": "kritis | tinggi | sedang | rendah",
       "judul": "Judul tindakan direktif spesifik (max 6 kata)",
       "tindakan": "Deskripsi teknokratis mengenai intervensi yang wajib diberlakukan.",
       "standar": "${standard}"
     }
  ]
}`;
}

/**
 * Menjalankan Evaluasi PER ASPEK (Chunked API Call)
 */
export async function runAspectAnalysis(aspek, items) {
  let targetModel;
  const criticalCount = items.filter(i => i.status === 'buruk' || i.status === 'kritis').length;

  if (aspek.toLowerCase().includes('struktur') || aspek.toLowerCase().includes('kebakaran')) {
    targetModel = MODELS.CLAUDE;
  } else if (aspek.toLowerCase().includes('arsitektur') || aspek.toLowerCase().includes('mep') || criticalCount > 2) {
    targetModel = MODELS.OPENAI; // Fallback to OpenAI
  } else {
    targetModel = MODELS.GEMINI;
  }

  const systemPrompt = getPromptForAspek(aspek, items);
  console.log(`[AI Router] Menganalisis Aspek: ${aspek} -> Menggunakan Model: ${targetModel.name}`);

  // Fetch Logic
  let aiResultText = "";
  let usedModelName = targetModel.name;

  try {
    if (targetModel.vendor === 'google') aiResultText = await fetchGemini(targetModel, systemPrompt);
    else if (targetModel.vendor === 'openai') aiResultText = await fetchOpenAI(targetModel, systemPrompt);
    else if (targetModel.vendor === 'anthropic') {
      try {
        aiResultText = await fetchClaude(targetModel, systemPrompt);
      } catch (anthropicErr) {
        console.warn('CORS Anthropic memblokir koneksi dari Klien UI! Fallback ke OpenAI...', anthropicErr);
        aiResultText = await fetchOpenAI(MODELS.OPENAI, systemPrompt);
        usedModelName = MODELS.OPENAI.name + ' (Fallback)';
      }
    }
  } catch (error) {
    throw new Error(`Gagal memanggil AI ${usedModelName}: ${error.message}`);
  }

  // Parse output
  let parsedJson;
  try {
    const raw = aiResultText.replace(/```json/gi, '').replace(/```/g, '').trim();
    parsedJson = JSON.parse(raw);
  } catch(e) {
    console.error("Gagal parsing JSON AI:", aiResultText); // Log raw output for debugging
    throw new Error(`Output JSON ${usedModelName} invalid untuk aspek ${aspek}`);
  }

  return {
    skor_aspek: parsedJson.skor_aspek || 0,
    narasi_teknis: parsedJson.narasi_teknis || '',
    rekomendasi: Array.isArray(parsedJson.rekomendasi) ? parsedJson.rekomendasi : [],
    ai_provider: usedModelName
  };
}


/**
 * Mengambil Kesimpulan Akhir (Digunakan saat semua skor & aspes selesai dianalisis)
 */
export async function runFinalConclusion(skorMap, rekomendasi_gabungan) {
  const targetModel = MODELS.OPENAI; // Gunakan model paling balance untuk rekonsiliasi

  const systemPrompt = `Anda adalah Ketua Tim Konsultan Pengkaji Teknis (Sertifikat Laik Fungsi) Bangunan Gedung.
Tugas Anda adalah memuntahkan konklusi mutlak berdasarkan gabungan skor komponen (0-100) yang telah dihitung oleh tim Anda:

Skor Saat Ini:
${JSON.stringify(skorMap, null, 2)}
Total Rekomendasi yang akan dicetak: ${rekomendasi_gabungan.length} buah.

Anda WAJIB memberikan balasan strictly berupa format JSON MURNI tanpa markdown blok (\`\`\`json) atau perkenalan.

STRUKTUR JSON WAJIB:
{
  "skor_total": (Hitung rata-rata eksak dari semua skor yang ada di atas, keluarkan dalam Integer 0-100),
  "status_slf": "WAJIB PILIH SATU SAJA: LAIK_FUNGSI | LAIK_FUNGSI_BERSYARAT | TIDAK_LAIK_FUNGSI",
  "risk_level": "low | medium | high | critical",
  "narasi_kesimpulan_akhir": "Abstraksi penutup eksekutif sepanjang \u00b1150 kata yang menyintesiskan kelayakan hukum dan keandalan rekayasa bangunan ini, menjastifikasi tegas mengapa bangunan ini layak atau tidak layak (Non-retoris, gunakan standar baku PP 16/2021)."
}`;

  let aiResultText;
  try {
     aiResultText = await fetchOpenAI(targetModel, systemPrompt);
  } catch(e) {
     throw new Error("Gagal Meramu Kesimpulan: " + e.message);
  }

  let parsedJson;
  try {
    const raw = aiResultText.replace(/```json/gi, '').replace(/```/g, '').trim();
    parsedJson = JSON.parse(raw);
  } catch(e) {
    throw new Error("JSON Gagal Parsed: " + e.message);
  }

  return parsedJson;
}


/** Fetcher Helpers **/

async function fetchGemini(model, prompt) {
  if (!model.url.includes("key=AIza")) throw new Error("API Key Gemini tidak ditemukan. Cek .env");
  const res = await fetch(model.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.2 }
    })
  });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
}

async function fetchOpenAI(model, prompt) {
  if (!model.key || !model.key.startsWith('sk-')) throw new Error("API Key OpenAI tidak ditemukan. Cek .env");
  const res = await fetch(model.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${model.key}`
    },
    body: JSON.stringify({
      model: model.id,
      messages: [
        { role: 'system', content: 'You are a JSON generating system. Return only valid JSON.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.2
    })
  });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "{}";
}

async function fetchClaude(model, prompt) {
  if (!model.key || !model.key.startsWith('sk-ant')) throw new Error("API Key Claude tidak ditemukan. Cek .env");
  const res = await fetch(model.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': model.key,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: model.id,
      max_tokens: 2048,
      temperature: 0.2,
      system: "Return only the exact valid JSON instructed. Omit any extra commentary.",
      messages: [{ role: 'user', content: prompt }]
    })
  });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return data.content?.[0]?.text || "{}";
}
