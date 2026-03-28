// ============================================================
//  MULTI-MODEL AI ROUTER - CHUNKED PER-ITEM PROCESSING
//  Solusi "Pro Level" - Engineering Reasoning & Deep Research Mode (SNI 9273:2025)
// ============================================================

const env = import.meta.env;

// Model Router Config 
const MODELS = {
  GEMINI: {
    id: 'gemini-1.5-flash', 
    name: 'Gemini 1.5 Flash',
    url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${env.VITE_GEMINI_API_KEY}`,
    vendor: 'google'
  },
  GROQ: {
    id: 'llama-3.3-70b-versatile',
    name: 'Groq Llama 3.3',
    url: env.PROD ? 'https://api.groq.com/openai/v1/chat/completions' : '/api/groq/v1/chat/completions', 
    key: env.VITE_GROQ_API_KEY,
    vendor: 'openai'
  },
  OPENROUTER: {
    id: 'google/gemini-2.0-flash-lite:free',
    name: 'OpenRouter Free',
    url: env.PROD ? 'https://openrouter.ai/api/v1/chat/completions' : '/api/openrouter/v1/chat/completions', 
    key: env.VITE_OPENROUTER_API_KEY,
    vendor: 'openrouter'
  },
  OPENAI: {
    id: 'gpt-4o',
    name: 'OpenAI GPT-4o',
    url: env.PROD ? 'https://api.openai.com/v1/chat/completions' : '/api/openai/v1/chat/completions', 
    key: env.VITE_OPENAI_API_KEY,
    vendor: 'openai'
  },
  CLAUDE: {
    id: 'claude-3-5-sonnet-20241022',
    name: 'Claude 3.5 Sonnet',
    url: env.PROD ? 'https://api.anthropic.com/v1/messages' : '/api/claude/v1/messages', 
    key: env.VITE_CLAUDE_API_KEY,
    vendor: 'anthropic'
  }
};

/**
 * Utilitas Retry Otomatis (safeCall) dengan Exponential Backoff
 */
const delay = (ms) => new Promise(res => setTimeout(res, ms));

async function safeCall(fn, retries = 3, attempt = 1) {
  try {
    return await fn();
  } catch (e) {
    const isRateLimit = e.message.includes('429') || e.message.toLowerCase().includes('quota');
    
    if (isRateLimit && attempt <= retries) {
      const waitTime = attempt * 2000; // 2s, 4s, 6s
      console.warn(`[AI Router] Rate Limit (429). Retry ${attempt}/${retries} dalam ${waitTime}ms...`);
      await delay(waitTime);
      return safeCall(fn, retries, attempt + 1);
    }
    
    if (retries <= 0 || attempt > retries) throw e;
    
    console.warn(`[AI Router] Retry ${attempt}/${retries}. Error: ${e.message}`);
    await delay(1000);
    return safeCall(fn, retries, attempt + 1);
  }
}

/**
 * Smart JSON Extraction - Mencari blok {...} atau [...]
 */
function extractJSON(text) {
  try {
    const match = text.match(/\{[\s\S]*\}/) || text.match(/\[[\s\S]*\]/);
    if (!match) return null;
    const clean = match[0].replace(/\n/g, " "); // Basic cleanup
    return JSON.parse(clean);
  } catch (e) {
    // Fallback: coba bersihkan karakter kontrol
    try {
      const match = text.match(/\{[\s\S]*\}/);
      const sanitized = match[0].replace(/[\x00-\x1F\x7F-\x9F]/g, " ");
      return JSON.parse(sanitized);
    } catch (e2) {
      return null;
    }
  }
}

/**
 * Prompt Granular Per Item - Engineering Reasoning Mode
 */
function getPromptForItem(item, aspek, roleTitle, standard) {
  const statusLabel = {
    'ada_sesuai': 'Ada & Sesuai Standar',
    'ada_tidak_sesuai': 'Penyimpangan Dokumen/Kondisi',
    'tidak_ada': 'Ketidakadaan (Missing Data/Component)',
    'buruk': 'Degradasi Berat',
    'kritis': 'Kegagalan Teknis Kritis',
    'tidak_wajib': 'Pengecualian (N/A)'
  }[item.status] || item.status;

  const standardRef = aspek.toLowerCase().includes('struktur') ? 'SNI 1726, SNI 2847, dan SNI 9273:2025' : standard;

  return `Anda adalah ${roleTitle} - Pakar Audit Forensik Bangunan Gedung.
Tugas: Menyusun LAPORAN KAJIAN TEKNIS FORENSIK (MENDALAM) khusus untuk item berikut:

# INFORMASI ITEM
- ASPEK: ${aspek.toUpperCase()}
- KODE: ${item.kode}
- NAMA PARAMETER: ${item.nama}
- STATUS EKSISTING: ${statusLabel}
- CATATAN LAPANGAN: ${item.catatan || 'Kondisi lapangan memerlukan pengecekan mendalam sesuai SOP.'}
- STANDAR ACUAN UTAMA: ${standardRef}

# INSTRUKSI ANALISIS (ENGINEERING DEEP REASONING):
Jalankan simulasi penalaran teknis dengan struktur bab berikut:

1. [ANALISIS PATOLOGI]: Identifikasi akar masalah (root cause) dari penyimpangan yang ada (fisik maupun administratif). Jelaskan mekanismenya secara teknis.
2. [EVALUASI KINERJA]: Bandingkan kondisi eksisting dengan persyaratan minimum pada ${standardRef}. Berikan persentase deviasi jika memungkinkan.
3. [JUSTIFIKASI REGULASI]: Hubungkan temuan ini dengan pasal-pasal spesifik dalam PP No. 16 Tahun 2021 (Pasal ${aspek.toLowerCase().includes('teknis') ? '211-228' : '24-27'}) dan dampak hukumnya terhadap SLF.
4. [SIMULASI RISIKO & IMPACT]: Apa yang terjadi jika item ini tidak diperbaiki? Skenario kegagalan (Life Safety, Kesehatan, atau Kegagalan Struktur).
5. [MITIGASI & RETROFIT]: Berikan langkah perbaikan (remedial work) atau strategi mitigasi jangka pendek dan panjang.

Output WAJIB format JSON MURNI:
{
  "item_kode": "${item.kode}",
  "risk_score": (Integer 1-100),
  "status_evaluasi": "NORMAL/MINOR_DEVIATION/CRITICAL_FAILURE",
  "technical_sheet": {
    "patologi": "...",
    "evaluasi_kinerja": "...",
    "justifikasi": "...",
    "risiko": "...",
    "rekomendasi": "..."
  },
  "narasi_item_lengkap": "### LAPORAN KAJIAN TEKNIS: ${item.kode}\\n\\n#### A. ANALISIS PATOLOGI & TEMUAN\\n(Minimal 2 paragraf teknis)\\n\\n#### B. EVALUASI KEPATUHAN STANDAR\\n(Sebutkan SNI/Permen terkait secara detail)\\n\\n#### C. ANALISIS RISIKO & KESELAMATAN (LIFE SAFETY)\\n(Simulasikan dampak kegagalan)\\n\\n#### D. JUSTIFIKASI REGULASI PP 16/2021\\n(Sebutkan Pasal dan Ayat terkait)\\n\\n#### E. REKOMENDASI PERBAIKAN & MITIGASI\\n(Gunakan poin-poin teknis)"
}

PENTING: Gunakan terminologi teknik sipil/arsitektur yang presisi. Narasi minimal 300 kata.`;
}

/**
 * Prompt Sintesis Akhir - Deep Research Reporting Mode (7 Chapters)
 */
function getPromptForSynthesis(aspek, itemResults, roleTitle, itemsCount) {
  return `Anda adalah ${roleTitle} - Lead Engineer.
Tugas: Menyusun LAPORAN KAJIAN TEKNIS PROFESIONAL (Full Research Style).
Gunakan data teknis per-item dari ${itemsCount} lembar pemeriksaan berikut:
${JSON.stringify(itemResults, null, 2)}

STRUKTUR LAPORAN (Markdown #):

# 1. TABEL EVALUASI KOMPREHENSIF PER ITEM
Sajikan ringkasan status dan risiko untuk setiap kode item yang diperiksa.

# 2. DETAIL TEMUAN & ANALISIS MENDALAM
Sintesis temuan-temuan kritis menjadi narasi audit teknik yang kohesif. Jangan hanya copy-paste, tapi hubungkan antar temuan.

# 3. TINJAUAN KONDISI FISIK & FUNGSIONAL (MAKRO)
Evaluasi kesehatan sistem secara keseluruhan (System-wide health check).

# 4. VERIFIKASI PEMENUHAN STANDAR (${aspek})
Uji kepatuhan terhadap regulasi berdasarkan data justifikasi yang ada.

# 5. ANALISIS RISIKO & SKENARIO DEGRADASI (AI SIMULATION)
Prediksi masa depan bangunan jika temuan tidak ditangani segera (Scenario modeling).

# 6. RINGKASAN TEMUAN PRIORITAS (RED FLAGS)
Highlight masalah yang mengancam Life Safety.

# 7. KESIMPULAN KELAIKAN & STRATEGI MITIGASI
Pernyataan kelaikan akhir dan langkah strategis (Short/Long term).

PENTING: Gunakan gaya bahasa campuran Indonesia-English Technical yang sangat formal dan mendalam.
Output WAJIB JSON MURNI:
{
  "skor_aspek": (Integer 0-100),
  "insight_kritis": ["...", "..."],
  "narasi_teknis": "(String Markdown 7 Bab SUPER LENGKAP & MENDALAM)",
  "rekomendasi_prioritas": [
    { "judul": "...", "tindakan": "...", "prioritas": "..." }
  ]
}`;
}

/**
 * Menjalankan Evaluasi PER ITEM (Deep Research Pipeline)
 */
export async function runAspectAnalysis(aspek, items, onProgress) {
  const a = aspek.toLowerCase();
  let roleTitle = 'Digital Technical Consultant SLF';
  let standard = 'NSPK & PP No. 16 Tahun 2021';
  let targetModel = MODELS.GEMINI;

  // Penentuan Role & Standar & Model Utama
  if (a.includes('struktur')) {
    roleTitle = 'Chief Structural Engineer & Seismis Expert';
    standard = 'SNI 9273:2025 (Existing Buildings Evaluation)';
    targetModel = MODELS.CLAUDE;
  } else if (a.includes('administrasi')) {
    roleTitle = 'Principal Engineering Auditor';
    standard = 'PP No. 16 Tahun 2021 & Perundangan Bangunan';
    targetModel = MODELS.GEMINI;
  } else if (a.includes('arsitektur')) {
    roleTitle = 'Principal Architect (Building Performance)';
    standard = 'NSPK Arsitektur & Estetika';
    targetModel = MODELS.OPENROUTER; 
  }

  const results = [];
  const blacklistedModels = new Set();

  console.log(`[AI Router] Memulai DEEP RESEARCH Analysis untuk ${aspek} (${items.length} item).`);

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (onProgress) onProgress(i + 1, items.length, `Sedang Menganalisis: ${item.nama}`);
    
    const analyzed = await runSingleItemAnalysis(item, aspek, { roleTitle, standard, targetModel, blacklistedModels });
    results.push(analyzed);
    
    await new Promise(r => setTimeout(r, 400));
  }

  // Synthesis Final
  if (onProgress) onProgress(items.length, items.length, "Lead Engineer sedang menyusun Laporan Final...");
  
  const synthesisPrompt = getPromptForSynthesis(aspek, results, roleTitle, items.length);
  const finalRespText = await safeCall(async () => {
    const synthModels = [MODELS.OPENAI, MODELS.GROQ, MODELS.OPENROUTER, MODELS.GEMINI];
    for (const m of synthModels) {
      if (!blacklistedModels.has(m.name) && (m.vendor === 'google' || m.key)) {
        try {
          if (m.vendor === 'google') return await fetchGemini(m, synthesisPrompt);
          if (m.vendor === 'openai') return await fetchOpenAI(m, synthesisPrompt);
          if (m.vendor === 'openrouter') return await fetchOpenRouter(m, synthesisPrompt);
        } catch(e) {}
      }
    }
    return await fetchGemini(MODELS.GEMINI, synthesisPrompt);
  });
  
  const finalJson = parseAIJson(finalRespText);

  return {
    skor_aspek: Number(finalJson.skor_aspek) || 75,
    narasi_teknis: finalJson.narasi_teknis || 'Gagal menyusun narasi.',
    rekomendasi: (finalJson.rekomendasi_prioritas || []).map(r => ({
      ...r,
      aspek: aspek,
      standar: standard
    })),
    meta: { provider: `Deep Research Engine`, risk_highlights: finalJson.insight_kritis || [] }
  };
}

/**
 * Menjalankan Analisis AI Modular untuk SATU ITEM tunggal
 */
export async function runSingleItemAnalysis(item, aspek, options = {}) {
  const { 
    roleTitle = 'Digital Technical Consultant SLF', 
    standard = 'NSPK & PP No. 16 Tahun 2021', 
    targetModel = MODELS.GEMINI, 
    blacklistedModels = new Set() 
  } = options;

  console.log(`[AI Router] Modular Analysis for: ${item.kode} - ${item.nama}`);

  const itemPrompt = getPromptForItem(item, aspek, roleTitle, standard);
  
  try {
    const respText = await safeCall(async () => {
      const failoverChain = [];
      if (!blacklistedModels.has(targetModel.name)) failoverChain.push(targetModel);
      if (env.VITE_GROQ_API_KEY && !blacklistedModels.has(MODELS.GROQ.name)) failoverChain.push(MODELS.GROQ);
      if (env.VITE_OPENROUTER_API_KEY && !blacklistedModels.has(MODELS.OPENROUTER.name)) failoverChain.push(MODELS.OPENROUTER);
      if (!blacklistedModels.has(MODELS.GEMINI.name)) failoverChain.push(MODELS.GEMINI);

      let lastError = null;
      for (const model of failoverChain) {
        try {
          if (model.vendor === 'google') return await fetchGemini(model, itemPrompt);
          if (model.vendor === 'openai') {
             if (model.key || model.id.includes('llama')) return await fetchOpenAI(model, itemPrompt);
          }
          if (model.vendor === 'anthropic') return await fetchClaude(model, itemPrompt);
          if (model.vendor === 'openrouter') return await fetchOpenRouter(model, itemPrompt);
        } catch (err) {
          lastError = err;
          if (err.message.includes('429') || err.message.includes('quota')) blacklistedModels.add(model.name);
        }
      }
      throw lastError || new Error("Failover Exhausted.");
    });

    const parsed = parseAIJson(respText);
    return parsed;
  } catch (err) {
    console.error(`Gagal Single Item:`, err);
    return { 
      item_kode: item.kode, 
      status_evaluasi: "Error", 
      technical_sheet: { patologi: `Gagal: ${err.message}` },
      narasi_item_lengkap: `Terjadi kendala teknis AI saat menganalisis item ini: ${err.message}` 
    };
  }
}

function parseAIJson(text) {
  const parsed = extractJSON(text);
  if (parsed) return parsed;
  
  // Last resort manual cleanup
  try {
    const raw = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
    return JSON.parse(raw.replace(/\n/g, "\\n"));
  } catch (e) {
    throw new Error("Gagal mengekstrak data JSON dari AI.");
  }
}

/** Fetchers **/

async function fetchGemini(model, prompt) {
  const res = await fetch(model.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.1, maxOutputTokens: 16000 }
    })
  });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
}

async function fetchOpenAI(model, prompt) {
  const res = await fetch(model.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${model.key}` },
    body: JSON.stringify({
      model: model.id,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
      max_tokens: 8192
    })
  });
  if (!res.ok) throw new Error(`OpenAI Error: ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "{}";
}

async function fetchOpenRouter(model, prompt) {
  const res = await fetch(model.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${model.key}`,
      'HTTP-Referer': 'https://smartaipengkaji.app',
      'X-Title': 'Smart AI Pengkaji SLF'
    },
    body: JSON.stringify({
      model: model.id,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1
    })
  });
  if (!res.ok) throw new Error(`OpenRouter Error: ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "{}";
}

async function fetchClaude(model, prompt) {
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
      max_tokens: 8192,
      messages: [{ role: 'user', content: prompt }]
    })
  });
  if (!res.ok) throw new Error(`Claude Error: ${res.status}`);
  const data = await res.json();
  return data.content?.[0]?.text || "{}";
}

export async function runFinalConclusion(skorMap, rekomendasi_gabungan) {
  const systemPrompt = `Anda adalah Ketua Tim Konsultan Pengkaji SLF. 
Berikan ringkasan eksekutif strategis berdasarkan seluruh aspek pengkajian teknis...`;
  const aiResultText = await safeCall(async () => {
    try {
      if (env.VITE_OPENROUTER_API_KEY) return await fetchOpenRouter(MODELS.OPENROUTER, systemPrompt);
      return await fetchGemini(MODELS.GEMINI, systemPrompt);
    } catch(e) { return await fetchGemini(MODELS.GEMINI, systemPrompt); }
  });
  return parseAIJson(aiResultText);
}
