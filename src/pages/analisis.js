// ============================================================
//  ANALISIS AI PAGE
//  Rule-Based Engine — SNI 9273:2025 & NSPK
//  Output: Skor per aspek, Risk Level, Status SLF, Rekomendasi
// ============================================================
import { supabase } from '../lib/supabase.js';
import { navigate } from '../lib/router.js';
import { showSuccess, showError, showInfo } from '../components/toast.js';
import { APP_CONFIG } from '../lib/config.js';
import { runAspectAnalysis, runFinalConclusion } from '../lib/ai-router.js';
import { marked } from 'marked';

// ── Bobot Penilaian Per Aspek (%) ─────────────────────────────
const BOBOT_ASPEK = {
  administrasi: 10,
  struktur:     25,
  arsitektur:   10,
  mep:          15,
  keselamatan:  20,
  kesehatan:     8,
  kenyamanan:    6,
  kemudahan:     6,
};

// ── Helper Formatting ─────────────────────────────────────────
// Fungsi helper formatTanggal & escHtml sudah ada di bagian bawah file ini.

// ── Nilai Status → Skor (0-100) ───────────────────────────────
const NILAI_STATUS_ADMIN = {
  ada_sesuai:         100,
  ada_tidak_sesuai:    40,
  tidak_ada:            0,
  pertama_kali:        80,
  tidak_wajib:        100,
  tidak_ada_renovasi: 100,
  '':                   0,
};
const NILAI_STATUS_TEKNIS = {
  baik:     100,
  sedang:    65,
  buruk:     30,
  kritis:     0,
  tidak_ada: 90,
  '':         0,
};

// ── Aspek → kode checklist mapping ───────────────────────────
const ASPEK_MAP = {
  administrasi: ['A01','A02','A03','A04','A05','A06','A07','A08','A09','A10'],
  struktur:     ['S01','S02','S03','S04','S05','S06','S07'],
  arsitektur:   ['AR01','AR02','AR03','AR04','AR05','AR06'],
  mep:          ['M01','M02','M03','M04','M05','M06'],
  keselamatan:  ['K01','K02','K03','K04','K05','K06'],
  kesehatan:    ['KH01','KH02','KH03','KH04'],
  kenyamanan:   ['KN01','KN02','KN03'],
  kemudahan:    ['KM01','KM02','KM03'],
};

// ── Page Entry ────────────────────────────────────────────────
export async function analisisPage(params = {}) {
  const id = params.id;
  if (!id) { navigate('proyek'); return ''; }

  window._analisisProyekId = id; // Set global ID for modular functions

  const root = document.getElementById('page-root');
  if (root) root.innerHTML = renderSkeleton();

  await loadData(id);
}

async function loadData(id) {
  const root = document.getElementById('page-root');

  const [proyek, checklistData, lastAnalisis] = await Promise.all([
    fetchProyek(id),
    fetchChecklist(id),
    fetchLastAnalisis(id),
  ]);

  if (!proyek) { navigate('proyek'); showError('Proyek tidak ditemukan.'); return ''; }

  // Jalankan engine jika ada data checklist
  let result = lastAnalisis;
  const hasChecklist = checklistData.length > 0;

  const html = buildHtml(proyek, checklistData, result, hasChecklist);
  if (root) {
    root.innerHTML = html;
    if (hasChecklist && result) {
      initRadarChart(result);
    }
    initAnalysisBtn(proyek, checklistData, id); // Re-initialize buttons
  }
}

// ── HTML Builder ──────────────────────────────────────────────
function buildHtml(proyek, checklistData, result, hasChecklist) {
  return `
    <div id="analisis-page">
      <!-- Header -->
      <div class="page-header">
        <div class="flex-between">
          <div>
            <button class="btn btn-ghost btn-sm" onclick="window.navigate('proyek-detail',{id:'${proyek.id}'})" style="margin-bottom:8px">
              <i class="fas fa-arrow-left"></i> ${escHtml(proyek.nama_bangunan)}
            </button>
            <h1 class="page-title">Analisis AI — Kelaikan Fungsi</h1>
            <p class="page-subtitle">Engine rule-based berbasis NSPK & SNI 9273:2025 — Status: ${hasChecklist ? `${checklistData.length} item checklist` : 'Checklist belum diisi'}</p>
          </div>
          <div class="flex gap-3">
            ${hasChecklist ? `
              <button class="btn btn-secondary" onclick="window.navigate('checklist',{id:'${proyek.id}'})">
                <i class="fas fa-clipboard-check"></i> Edit Checklist
              </button>
              <button class="btn btn-primary" id="btn-analyze" onclick="window._runAnalysis()">
                <i class="fas fa-brain"></i> Jalankan Analisis
              </button>
            ` : `
              <button class="btn btn-primary" onclick="window.navigate('checklist',{id:'${proyek.id}'})">
                <i class="fas fa-clipboard-check"></i> Isi Checklist Dulu
              </button>
            `}
          </div>
        </div>
      </div>

      ${!hasChecklist ? renderNoDataPanel(proyek.id) : result ? renderResultPanel(result, proyek) : renderReadyPanel(proyek.id)}
    </div>
  `;
}

function renderNoDataPanel(proyekId) {
  return `
    <div class="card" style="text-align:center;padding:var(--space-12)">
      <div style="width:70px;height:70px;background:var(--gradient-brand);border-radius:var(--radius-xl);display:flex;align-items:center;justify-content:center;margin:0 auto var(--space-5);font-size:1.8rem;color:white">
        <i class="fas fa-clipboard-list"></i>
      </div>
      <h3 style="font-size:1.1rem;font-weight:700;margin-bottom:var(--space-2)">Checklist Belum Diisi</h3>
      <p style="color:var(--text-secondary);max-width:400px;margin:0 auto var(--space-6)">
        AI Engine membutuhkan data checklist pemeriksaan untuk melakukan analisis. Isi checklist administrasi dan teknis terlebih dahulu.
      </p>
      <button class="btn btn-primary" onclick="window.navigate('checklist',{id:'${proyekId}'})">
        <i class="fas fa-clipboard-check"></i> Mulai Isi Checklist
      </button>
    </div>
  `;
}

function renderReadyPanel(proyekId) {
  return `
    <div class="ai-panel" style="text-align:center;padding:var(--space-10)">
      <div class="empty-state">
      <div class="empty-icon"><i class="fas fa-robot"></i></div>
      <h3 style="font-size:1.25rem;font-weight:700;margin-bottom:var(--space-2)">Mulai Analisis Modular (Per Aspek)</h3>
      <p style="color:var(--text-secondary);max-width:500px;margin:0 auto var(--space-5)">
        Untuk mencegah kelebihan beban (_Timeout_) dan memaksimalkan Deep Reasoning, silakan menganalisis setiap modul parameter satu persatu secara manual, kemudian Tarik Kesimpulan Akhir.
      </p>
      
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(140px, 1fr));gap:var(--space-3);max-width:800px;margin:0 auto var(--space-5)">
        ${['Administrasi','Struktur','Arsitektur','MEP','Kebakaran','Kesehatan','Kenyamanan','Kemudahan'].map(a => `
          <button class="btn btn-outline btn-sm" style="display:flex;flex-direction:column;gap:8px;padding:var(--space-4)" onclick="window._runAspect('${a}')">
            <i class="fas fa-microchip" style="font-size:1.5rem;color:var(--brand-400)"></i>
            <span>Analisis ${a}</span>
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

function renderResultPanel(result, proyek) {
  const aspekDefs = [
    { key: 'skor_administrasi', label: 'Administrasi',   icon: 'fa-clipboard-list',    color: 'hsl(220,70%,55%)', kpiColor: 'kpi-blue'   },
    { key: 'skor_struktur',     label: 'Struktur',        icon: 'fa-building',           color: 'hsl(0,70%,55%)',   kpiColor: 'kpi-red'    },
    { key: 'skor_arsitektur',   label: 'Arsitektur',      icon: 'fa-drafting-compass',   color: 'hsl(258,70%,60%)', kpiColor: 'kpi-purple' },
    { key: 'skor_mep',          label: 'MEP',             icon: 'fa-bolt',               color: 'hsl(40,80%,55%)',  kpiColor: 'kpi-yellow' },
    { key: 'skor_kebakaran',    label: 'Kebakaran',       icon: 'fa-fire-extinguisher',  color: 'hsl(0,74%,52%)',   kpiColor: 'kpi-red'    },
    { key: 'skor_kesehatan',    label: 'Kesehatan',       icon: 'fa-heart-pulse',        color: 'hsl(160,65%,46%)', kpiColor: 'kpi-green'  },
    { key: 'skor_kenyamanan',   label: 'Kenyamanan',      icon: 'fa-sun',                color: 'hsl(40,80%,50%)',  kpiColor: 'kpi-yellow' },
    { key: 'skor_kemudahan',    label: 'Kemudahan',       icon: 'fa-universal-access',   color: 'hsl(200,75%,52%)', kpiColor: 'kpi-cyan'   },
  ];

  const statusInfo = {
    LAIK_FUNGSI:           { label: 'LAIK FUNGSI',          badge: 'badge-laik',       icon: 'fa-circle-check', color: 'hsl(160,65%,46%)' },
    LAIK_FUNGSI_BERSYARAT: { label: 'LAIK FUNGSI BERSYARAT', badge: 'badge-bersyarat', icon: 'fa-triangle-exclamation', color: 'hsl(40,85%,55%)' },
    TIDAK_LAIK_FUNGSI:     { label: 'TIDAK LAIK FUNGSI',   badge: 'badge-tidak-laik', icon: 'fa-circle-xmark', color: 'hsl(0,74%,52%)' },
    DALAM_PENGKAJIAN:      { label: 'DALAM PENGKAJIAN',    badge: 'badge-info',       icon: 'fa-hourglass-half', color: 'hsl(200,75%,52%)' },
  };
  const si = statusInfo[result.status_slf] || statusInfo['DALAM_PENGKAJIAN'];

  const rekomendasi = result.rekomendasi ? JSON.parse(typeof result.rekomendasi === 'string' ? result.rekomendasi : JSON.stringify(result.rekomendasi)) : [];

  return `
    <!-- Status Banner -->
    <div class="ai-panel" style="margin-bottom:var(--space-5);display:flex;align-items:center;gap:var(--space-6);padding:var(--space-6)">
      <div style="text-align:center;flex-shrink:0">
        <div style="width:90px;height:90px;border-radius:50%;background:hsla(220,70%,48%,0.15);border:3px solid ${si.color};display:flex;align-items:center;justify-content:center;margin:0 auto">
          <i class="fas ${si.icon}" style="font-size:2rem;color:${si.color}"></i>
        </div>
        <div style="margin-top:var(--space-3);font-size:0.75rem;font-weight:700;color:${si.color}">${si.label}</div>
      </div>
      <div style="flex:1">
        <div style="display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-2)">
          <div style="font-size:3rem;font-weight:800;letter-spacing:-0.05em;color:var(--brand-400)">${result.skor_total || '-'}</div>
          <div style="color:var(--text-tertiary);font-size:1.5rem">/100</div>
          <div style="margin-left:var(--space-4)">
            <div class="text-xs text-tertiary">Level Risiko</div>
            <div style="font-size:1.1rem;font-weight:700;color:${riskColor(result.risk_level)}">${riskLabel(result.risk_level)}</div>
          </div>
        </div>
        <div style="display:flex;gap:var(--space-4)">
          <div>
            <div class="text-xs text-tertiary">Dianalisis</div>
            <div class="text-sm text-secondary">${formatTanggal(result.created_at)}</div>
          </div>
          <div>
            <div class="text-xs text-tertiary">Engine Utama</div>
            <div class="text-sm text-secondary" style="color:var(--brand-400);font-weight:600">
              <i class="fas fa-robot"></i> ${escHtml(result.ai_provider || 'Modular AI Router')}
            </div>
          </div>
        </div>
      </div>
      <div class="flex gap-3">
        <button class="btn btn-secondary btn-sm" onclick="window.navigate('laporan',{id:'${proyek.id}'})">
          <i class="fas fa-file-contract"></i> Lihat Laporan
        </button>
        <button class="btn btn-primary btn-sm" style="background:var(--gradient-brand)" onclick="window._runFinalConclusion()">
          <i class="fas fa-flag-checkered"></i> Buat Kesimpulan Final
        </button>
      </div>
    </div>

    <!-- Score Grid -->
    <div class="aspek-score-grid">
      ${aspekDefs.map(a => {
        const skor = result[a.key] || 0;
        const warna = skor >= 80 ? 'hsl(160,65%,46%)' : skor >= 60 ? 'hsl(40,80%,55%)' : 'hsl(0,74%,52%)';
        return `
          <div class="aspek-score-card" style="padding-bottom:12px">
            <div class="asc-icon ${a.kpiColor}"><i class="fas ${a.icon}"></i></div>
            <div class="asc-nilai" style="color:${warna}">${skor}</div>
            <div class="asc-label">${a.label}</div>
            <div class="asc-bar">
              <div class="asc-fill" style="width:${skor}%;background:${warna}"></div>
            </div>
            <div class="text-xs" style="margin-top:4px;color:${warna};margin-bottom:12px">
              ${skor >= 80 ? 'Baik' : skor >= 60 ? 'Cukup' : skor >= 40 ? 'Perlu Perbaikan' : 'Kritis'}
            </div>
            <button class="btn btn-outline btn-sm" style="width:100%" onclick="window._runAspect('${a.label}')">
              <i class="fas fa-microchip"></i> Ulangi ${a.label}
            </button>
          </div>
        `;
      }).join('')}
    </div>

    <!-- Main Grid: Chart + Rekomendasi -->
    <div style="display:grid;grid-template-columns:360px 1fr;gap:var(--space-5)">

      <!-- Radar Chart -->
      <div class="card">
        <div class="card-title" style="margin-bottom:var(--space-4)">
          <i class="fas fa-chart-radar" style="color:var(--brand-400);margin-right:8px"></i>Radar Skor Aspek
        </div>
        <div class="radar-wrap">
          <canvas id="radar-chart"></canvas>
        </div>
        <div style="margin-top:var(--space-4);padding-top:var(--space-4);border-top:1px solid var(--border-subtle)">
          ${[
            { label: '≥ 80', desc: 'Laik Fungsi', color: 'hsl(160,65%,46%)' },
            { label: '60–79', desc: 'Laik Bersyarat', color: 'hsl(40,80%,55%)' },
            { label: '< 60', desc: 'Tidak Laik / Kritis', color: 'hsl(0,74%,52%)' },
          ].map(l => `
            <div class="flex gap-3" style="align-items:center;margin-bottom:6px">
              <div style="width:12px;height:12px;border-radius:3px;background:${l.color};flex-shrink:0"></div>
              <span class="text-xs text-tertiary"><b>${l.label}</b> — ${l.desc}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Rekomendasi -->
      <div class="card">
        <div class="card-header" style="margin-bottom:var(--space-4)">
          <div>
            <div class="card-title">Rekomendasi Teknis</div>
            <div class="card-subtitle">${rekomendasi.length} rekomendasi berdasarkan hasil analisis</div>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:var(--space-3)">
          ${rekomendasi.length === 0 ? `
            <div class="ai-finding success"><i class="fas fa-circle-check" style="margin-right:6px"></i>Tidak ada rekomendasi kritis. Bangunan dalam kondisi baik.</div>
          ` : rekomendasi.map((r, i) => {
            const priorColors = { kritis: 'hsl(0,74%,52%)', tinggi: 'hsl(0,74%,52%)', sedang: 'hsl(40,80%,55%)', rendah: 'hsl(160,65%,46%)' };
            const col = priorColors[r.prioritas?.toLowerCase()] || 'hsl(200,75%,52%)';
            return `
              <div class="rekom-card">
                <div class="rekom-priority" style="background:${col}"></div>
                <div style="flex:1">
                  <div class="flex gap-3" style="align-items:center;margin-bottom:4px;flex-wrap:wrap">
                    <span class="text-sm font-semibold text-primary">${i+1}. ${escHtml(r.judul || '')}</span>
                    <span class="badge" style="background:hsla(0,0%,50%,0.15);color:var(--text-tertiary);border:1px solid var(--border-subtle);font-size:0.68rem">${escHtml(r.aspek || '')}</span>
                    <span class="badge" style="background:${col}22;color:${col};border:1px solid ${col}44;font-size:0.68rem">${escHtml(r.prioritas || '')}</span>
                  </div>
                  <p class="text-sm text-secondary">${escHtml(r.tindakan || '')}</p>
                  ${r.standar ? `<div class="text-xs text-tertiary" style="margin-top:4px"><i class="fas fa-book" style="margin-right:4px"></i>Ref: ${escHtml(r.standar)}</div>` : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>

    <!-- Narasi Teknis -->
    ${result.narasi_teknis ? `
      <div class="card" style="margin-top:var(--space-5)">
        <div class="card-title" style="margin-bottom:var(--space-4)">
          <i class="fas fa-file-alt" style="color:var(--brand-400);margin-right:8px"></i>Narasi Teknis Analisis
        </div>
        <div class="markdown-content" style="font-size:0.875rem;color:var(--text-secondary);line-height:1.8">${marked.parse(result.narasi_teknis || '')}</div>
      </div>
    ` : ''}

    <!-- Action -->
    <div style="margin-top:var(--space-5);display:flex;gap:var(--space-3);justify-content:flex-end">
      <button class="btn btn-secondary" onclick="window.navigate('checklist',{id:'${proyek.id}'})">
        <i class="fas fa-clipboard-check"></i> Edit Checklist
      </button>
      <button class="btn btn-primary" onclick="window.navigate('laporan',{id:'${proyek.id}'})">
        <i class="fas fa-file-contract"></i> Lihat Laporan SLF
      </button>
    </div>
  `;
}

// ── Init Analysis Button ──────────────────────────────────────
function initAnalysisBtn(proyek, checklistData, proyekId) {
  window._runAnalysis = async () => {
    showInfo("Silakan jalankan analisis per aspek secara modular.");
  };
}

// ── Action Handlers (Modular AI) ──────────────────────────────

window._runAspect = async (aspekTarget) => {
  try {
    showInfo(`Memulai Deep Reasoning Analisis: ${aspekTarget}...`);
    
    // 1. Ambil seluruh data dari DB, filter berdasarkan spesifik kategori/aspek
    let query = supabase.from('checklist_items').select('*').eq('proyek_id', window._analisisProyekId);
    if (aspekTarget.toLowerCase() === 'administrasi') {
      query = query.eq('kategori', 'administrasi');
    } else {
      query = query.eq('kategori', 'teknis').eq('aspek', aspekTarget);
    }
    
    const { data: checklistData, error: clErr } = await query;
    if (clErr) throw clErr;
    if (!checklistData || checklistData.length === 0) {
      showError(`Tidak ada data input yang diisi untuk Aspek ${aspekTarget}.`);
      return;
    }

    // 2. Berikan ke AI
    const result = await runAspectAnalysis(aspekTarget, checklistData);
    
    // 3. Update Database (Parsial Tulis)
    // Ambil baris hasil_analisis existing
    let { data: currentHasilArr, error: hrErr } = await supabase
      .from('hasil_analisis')
      .select('*')
      .eq('proyek_id', window._analisisProyekId)
      .limit(1);

    if (hrErr) throw hrErr;
    let currentHasil = currentHasilArr && currentHasilArr.length > 0 ? currentHasilArr[0] : null;

    // Buat Rekomendasi Array Baru (Hapus yang lama untuk aspek ini, dan gabungkan yang baru)
    let gabungRekomendasi = [];
    if (currentHasil && currentHasil.rekomendasi) {
      let existingRekomedasi = currentHasil.rekomendasi;
      if (typeof existingRekomedasi === 'string') existingRekomedasi = JSON.parse(existingRekomedasi);
      gabungRekomendasi = existingRekomedasi.filter(r => r.aspek !== aspekTarget);
    }
    if (result.rekomendasi && result.rekomendasi.length > 0) {
      gabungRekomendasi = [...gabungRekomendasi, ...result.rekomendasi];
    }

    // Pembuatan Kolom Skor yang akan di update
    const mapKolom = {
      'Administrasi': 'skor_administrasi',
      'Struktur': 'skor_struktur',
      'Arsitektur': 'skor_arsitektur',
      'MEP': 'skor_mep',
      'Kebakaran': 'skor_kebakaran',
      'Kesehatan': 'skor_kesehatan',
      'Kenyamanan': 'skor_kenyamanan',
      'Kemudahan': 'skor_kemudahan'
    };
    const colName = mapKolom[aspekTarget];

    // Gabungkan Narasi Teknis
    let newNarasi = currentHasil?.narasi_teknis || '';
    // Menghapus narasi aspek ini yang lama jika ada (Simple replacement)
    const regexHapus = new RegExp(`### Analisis ${aspekTarget}[\\s\\S]*?(?=### Analisis |$)`);
    newNarasi = newNarasi.replace(regexHapus, '').trim();
    newNarasi += `\n\n### Analisis ${aspekTarget}\n${result.narasi_teknis}\n\n`;

    const payload = {
      proyek_id: window._analisisProyekId,
      [colName]: result.skor_aspek,
      rekomendasi: gabungRekomendasi,
      narasi_teknis: newNarasi.trim(),
      ai_provider: result.ai_provider
    };

    if (currentHasil && currentHasil.id) {
       await supabase.from('hasil_analisis').update(payload).eq('id', currentHasil.id);
    } else {
       await supabase.from('hasil_analisis').insert([payload]);
    }

    showSuccess(`Analisis ${aspekTarget} selesai!`);
    loadData(window._analisisProyekId); // render ulang UI 

  } catch (error) {
    showError(`Gagal menganalisa Aspek ${aspekTarget}: ` + error.message);
  }
};

window._runFinalConclusion = async () => {
  try {
    showInfo("Meramu Kesimpulan Akhir Status Kelaikan SLF...");
    
    // 1. Ambil hasil_analisis skarang
    let { data: currentHasilArr, error: hrErr } = await supabase
      .from('hasil_analisis')
      .select('*')
      .eq('proyek_id', window._analisisProyekId)
      .limit(1);
    
    if (hrErr) throw hrErr;
    if (!currentHasilArr || currentHasilArr.length === 0) throw new Error("Anda harus menganalisis minimal satu aspek terlebih dahulu!");
    let currentHasil = currentHasilArr[0];

    const mapSkor = {
      Administrasi: currentHasil.skor_administrasi,
      Struktur: currentHasil.skor_struktur,
      Arsitektur: currentHasil.skor_arsitektur,
      MEP: currentHasil.skor_mep,
      Kebakaran: currentHasil.skor_kebakaran,
      Kesehatan: currentHasil.skor_kesehatan,
      Kenyamanan: currentHasil.skor_kenyamanan,
      Kemudahan: currentHasil.skor_kemudahan,
    };

    let existingRekomedasi = currentHasil.rekomendasi || [];
    if (typeof existingRekomedasi === 'string') existingRekomedasi = JSON.parse(existingRekomedasi);

    const konklusi = await runFinalConclusion(mapSkor, existingRekomedasi);
    
    // Buat format narasi akhir
    let newNarasi = currentHasil.narasi_teknis || '';
    const regexHapusKesimpulan = new RegExp(`### KESIMPULAN FINAL[\\s\\S]*?$`);
    newNarasi = newNarasi.replace(regexHapusKesimpulan, '').trim();
    newNarasi = `### KESIMPULAN FINAL (EXECUTIVE SUMMARY)\n${konklusi.narasi_kesimpulan_akhir}\n\n---\n\n` + newNarasi;

    const payload = {
      skor_total: konklusi.skor_total,
      status_slf: konklusi.status_slf === 'LAIK_FUNGSI' || konklusi.status_slf === 'LAIK_FUNGSI_BERSYARAT' || konklusi.status_slf === 'TIDAK_LAIK_FUNGSI' ? konklusi.status_slf : 'DALAM_PENGKAJIAN',
      risk_level: konklusi.risk_level,
      narasi_teknis: newNarasi
    };

    await supabase.from('hasil_analisis').update(payload).eq('id', currentHasil.id);

    // Update Proyek Database
    await supabase.from('proyek').update({
      status_slf: payload.status_slf,
      progress: 100
    }).eq('id', window._analisisProyekId);

    showSuccess("Kesimpulan Final SLF berhasil diterbitkan!");
    loadData(window._analisisProyekId); 
  } catch(error) {
    showError("Gagal merumuskan kesimpulan: " + error.message);
  }
};

// ── Rule-Based Engine (Fallback/Initial Score Calculation) ─────────────────────────────────────────
// This function is now primarily for initial score calculation if AI is not used,
// or as a fallback for basic scoring logic.
async function runRuleBasedEngine(proyekId, checklistData) {
  // Build data map
  const dataMap = {};
  checklistData.forEach(d => { dataMap[d.kode] = d; });

  // Hitung skor per aspek
  const skorAspek = {};
  for (const [aspek, kodes] of Object.entries(ASPEK_MAP)) {
    const items = kodes.filter(k => dataMap[k]);
    if (items.length === 0) { skorAspek[aspek] = 0; continue; }
    const isAdmin = aspek === 'administrasi';
    const nilaiMap = isAdmin ? NILAI_STATUS_ADMIN : NILAI_STATUS_TEKNIS;
    const total = items.reduce((sum, k) => {
      const st = dataMap[k]?.status || '';
      return sum + (nilaiMap[st] ?? 0);
    }, 0);
    skorAspek[aspek] = Math.round(total / items.length);
  }

  // Skor total berbobot
  let skorTotal = 0;
  let bobotTotal = 0;
  for (const [aspek, bobot] of Object.entries(BOBOT_ASPEK)) {
    if (skorAspek[aspek] !== undefined) {
      skorTotal  += (skorAspek[aspek] * bobot);
      bobotTotal += bobot;
    }
  }
  const finalScore = bobotTotal > 0 ? Math.round(skorTotal / bobotTotal) : 0;

  // Tentukan status SLF
  let statusSLF;
  if (skorAspek.struktur < 50 || skorAspek.keselamatan < 50 || finalScore < 50) {
    statusSLF = 'TIDAK_LAIK_FUNGSI';
  } else if (finalScore >= 80 && skorAspek.struktur >= 70 && skorAspek.keselamatan >= 70) {
    statusSLF = 'LAIK_FUNGSI';
  } else {
    statusSLF = 'LAIK_FUNGSI_BERSYARAT';
  }

  // Risk level
  let riskLevel;
  if (finalScore >= 80) riskLevel = 'low';
  else if (finalScore >= 65) riskLevel = 'medium';
  else if (finalScore >= 45) riskLevel = 'high';
  else riskLevel = 'critical';

  // Call Multi-Model Router
  let aiData;
  try {
     const checkArray = Object.values(dataMap);
     aiData = await runMultiModelAnalysis(skorAspek, finalScore, statusSLF, checkArray);
  } catch(e) {
     console.warn("AI Router Gagal:", e);
     // Fallback ke Teks Statis Lama jika server AI error
     aiData = {
       rekomendasi: generateRekomendasi(skorAspek, dataMap),
       narasi_teknis: generateNarasiText(skorAspek, finalScore, statusSLF) + '\\n\\n(Perhatian: Dihasilkan oleh Rule-Based Fallback karena Engine AI sedang sibuk)',
       ai_provider: 'Rule-Based Fallback'
     };
  }

  // Simpan ke DB
  const payload = {
    proyek_id:        proyekId,
    skor_administrasi: skorAspek.administrasi,
    skor_struktur:     skorAspek.struktur,
    skor_arsitektur:   skorAspek.arsitektur,
    skor_mep:          skorAspek.mep,
    skor_kebakaran:    skorAspek.keselamatan,
    skor_kesehatan:    skorAspek.kesehatan,
    skor_kenyamanan:   skorAspek.kenyamanan,
    skor_kemudahan:    skorAspek.kemudahan,
    skor_total:        finalScore,
    status_slf:        statusSLF,
    risk_level:        riskLevel,
    rekomendasi:       JSON.stringify(aiData.rekomendasi),
    narasi_teknis:     aiData.narasi_teknis,
    ai_provider:       aiData.ai_provider,
    created_at:        new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('hasil_analisis')
    .insert(payload)
    .select()
    .single();
  if (error) throw error;

  // Update status proyek
  await supabase.from('proyek').update({
    status_slf: statusSLF,
    progress: Math.min(80, 40 + Math.round(finalScore * 0.4)),
  }).eq('id', proyekId);

  return data;
}

function generateRekomendasi(skorAspek, dataMap) {
  const rekoms = [];

  if (skorAspek.administrasi < 80) {
    rekoms.push({
      aspek: 'Administrasi',
      prioritas: skorAspek.administrasi < 60 ? 'Kritis' : 'Sedang',
      judul: 'Kelengkapan Dokumen Perizinan',
      tindakan: 'Lengkapi dokumen PBG/IMB dan gambar as-built drawing yang belum tersedia. Proses pemutakhiran dokumen melalui DPMPTSP setempat.',
      standar: 'PP No. 16/2021 Pasal 24-26',
    });
  }
  if (skorAspek.struktur < 80) {
    rekoms.push({
      aspek: 'Struktur',
      prioritas: skorAspek.struktur < 50 ? 'Kritis' : 'Tinggi',
      judul: 'Evaluasi dan Perkuatan Elemen Struktur',
      tindakan: 'Lakukan pemeriksaan detail kondisi kolom, balok, dan pondasi oleh tenaga ahli struktur. Pertimbangkan retrofitting sesuai SNI 9273:2025.',
      standar: 'SNI 9273:2025 / ASCE 41-17',
    });
  }
  if (skorAspek.mep < 80) {
    rekoms.push({
      aspek: 'MEP',
      prioritas: skorAspek.mep < 50 ? 'Tinggi' : 'Sedang',
      judul: 'Pemeriksaan dan Perbaikan Instalasi MEP',
      tindakan: 'Lakukan audit instalasi listrik, plumbing, dan HVAC. Pastikan instalasi sesuai SNI dan memiliki SLO yang valid.',
      standar: 'SNI 04-0225-2000 (PUIL) / Permenaker 04/1995',
    });
  }
  if (skorAspek.keselamatan < 80) {
    rekoms.push({
      aspek: 'Keselamatan Kebakaran',
      prioritas: skorAspek.keselamatan < 50 ? 'Kritis' : 'Tinggi',
      judul: 'Perbaikan Sistem Proteksi Kebakaran',
      tindakan: 'Pasang/perbaiki APAR, sprinkler, hidran, dan detektor asap. Pastikan jalur evakuasi dan tangga darurat berfungsi optimal.',
      standar: 'Permen PU 26/2008 / SNI 03-3985-2000',
    });
  }
  if (skorAspek.arsitektur < 70) {
    rekoms.push({
      aspek: 'Arsitektur',
      prioritas: 'Sedang',
      judul: 'Perbaikan Komponen Arsitektural',
      tindakan: 'Perbaiki kondisi dinding, pintu, jendela, dan finishing yang mengalami deteriorasi. Sesuaikan dengan gambar as-built.',
      standar: 'SNI 7832:2012',
    });
  }
  if (skorAspek.kemudahan < 70) {
    rekoms.push({
      aspek: 'Kemudahan/Aksesibilitas',
      prioritas: 'Rendah',
      judul: 'Peningkatan Aksesibilitas',
      tindakan: 'Sediakan ramp dan fasilitas difabel sesuai standar. Perlebar koridor dan pastikan area parkir memadai.',
      standar: 'Permen PU 30/2006',
    });
  }

  return rekoms;
}

function generateNarasiText(skorAspek, finalScore, statusSLF) {
  const statusLabel = { LAIK_FUNGSI: 'Laik Fungsi', LAIK_FUNGSI_BERSYARAT: 'Laik Fungsi Bersyarat', TIDAK_LAIK_FUNGSI: 'Tidak Laik Fungsi' }[statusSLF] || '';
  const aspekKritis = Object.entries(skorAspek).filter(([, s]) => s < 60).map(([a]) => a).join(', ');
  return `Berdasarkan hasil evaluasi rule-based engine mengacu pada NSPK Bangunan Gedung, SNI 9273:2025, dan PP No. 16 Tahun 2021, bangunan memperoleh skor total ${finalScore}/100.

Status kelaikan fungsi ditetapkan: ${statusLabel.toUpperCase()}.

Analisis per aspek menunjukkan: Administrasi (${skorAspek.administrasi}/100), Struktur (${skorAspek.struktur}/100), Arsitektur (${skorAspek.arsitektur}/100), MEP (${skorAspek.mep}/100), Keselamatan Kebakaran (${skorAspek.keselamatan}/100), Kesehatan (${skorAspek.kesehatan}/100), Kenyamanan (${skorAspek.kenyamanan}/100), Kemudahan (${skorAspek.kemudahan}/100).

${aspekKritis ? `Aspek yang memerlukan perhatian segera: ${aspekKritis}. Diperlukan tindak lanjut sesuai rekomendasi yang tertera.` : 'Semua aspek dalam kondisi memadai.'}

Evaluasi ini bersifat indikatif dan harus dikonfirmasi oleh tenaga ahli pengkaji bangunan gedung yang bersertifikat sebelum diterbitkan Sertifikat Laik Fungsi resmi.`;
}

// Variabel global sementara untuk narasi (workaround)
let proyek_nominal = '';

// ── Radar Chart ───────────────────────────────────────────────
function initRadarChart(result) {
  // Load Chart.js jika belum ada
  const tryInit = () => {
    const ctx = document.getElementById('radar-chart');
    if (!ctx || !window.Chart) return;

    new window.Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Admin', 'Struktur', 'Arsitektur', 'MEP', 'Kebakaran', 'Kesehatan', 'Kenyamanan', 'Kemudahan'],
        datasets: [{
          label: 'Skor',
          data: [
            result.skor_administrasi,
            result.skor_struktur,
            result.skor_arsitektur,
            result.skor_mep,
            result.skor_kebakaran,
            result.skor_kesehatan,
            result.skor_kenyamanan,
            result.skor_kemudahan,
          ],
          backgroundColor: 'hsla(220,70%,48%,0.2)',
          borderColor:     'hsl(220,70%,56%)',
          borderWidth: 2,
          pointBackgroundColor: 'hsl(220,70%,56%)',
          pointRadius: 4,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            min: 0,
            max: 100,
            ticks: { stepSize: 20, color: 'hsl(220,10%,50%)', font: { size: 10 }, backdropColor: 'transparent' },
            grid:  { color: 'hsla(220,20%,50%,0.15)' },
            pointLabels: { color: 'hsl(220,12%,70%)', font: { size: 11 } },
            angleLines: { color: 'hsla(220,20%,50%,0.15)' },
          },
        },
        plugins: { legend: { display: false } },
      },
    });
  };

  if (window.Chart) {
    tryInit();
  } else {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
    s.onload = tryInit;
    document.head.appendChild(s);
  }
}

// ── Data Fetchers ─────────────────────────────────────────────
async function fetchProyek(id) {
  try {
    const { data } = await supabase.from('proyek').select('id,nama_bangunan').eq('id', id).single();
    return data;
  } catch { return null; }
}
async function fetchChecklist(proyekId) {
  try {
    const { data } = await supabase.from('checklist_items').select('*').eq('proyek_id', proyekId);
    return data || [];
  } catch { return []; }
}
async function fetchLastAnalisis(proyekId) {
  try {
    const { data } = await supabase
      .from('hasil_analisis')
      .select('*')
      .eq('proyek_id', proyekId)
      .order('created_at', { ascending: false })
      .limit(1);
    return data && data.length > 0 ? data[0] : null;
  } catch { return null; }
}

function renderSkeleton() {
  return `
    <div class="page-header">
      <div class="skeleton" style="height:20px;width:200px;margin-bottom:8px"></div>
      <div class="skeleton" style="height:36px;width:400px;margin-bottom:8px"></div>
    </div>
    <div class="skeleton" style="height:160px;border-radius:var(--radius-lg);margin-bottom:var(--space-5)"></div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-4);margin-bottom:var(--space-5)">
      ${Array(8).fill(0).map(()=>`<div class="skeleton" style="height:120px;border-radius:var(--radius-lg)"></div>`).join('')}
    </div>
    <div style="display:grid;grid-template-columns:360px 1fr;gap:var(--space-5)">
      <div class="skeleton" style="height:360px;border-radius:var(--radius-lg)"></div>
      <div class="skeleton" style="height:360px;border-radius:var(--radius-lg)"></div>
    </div>
  `;
}

function escHtml(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function formatTanggal(s) { try { return new Date(s).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'}); } catch { return s||''; } }
function riskColor(r) { return { low:'hsl(160,65%,46%)', medium:'hsl(40,80%,55%)', high:'hsl(0,70%,58%)', critical:'hsl(330,70%,50%)' }[r]||'hsl(200,80%,58%)'; }
function riskLabel(r) { return { low:'Rendah', medium:'Sedang', high:'Tinggi', critical:'Kritis' }[r]||r; }
