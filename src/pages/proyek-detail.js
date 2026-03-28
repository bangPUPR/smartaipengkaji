// ============================================================
//  PROYEK DETAIL PAGE
//  Hub navigasi per proyek — info, workflow, tab navigasi
// ============================================================
import { supabase } from '../lib/supabase.js';
import { navigate }  from '../lib/router.js';
import { showSuccess, showError } from '../components/toast.js';
import { confirm }   from '../components/modal.js';
import { APP_CONFIG } from '../lib/config.js';

export async function proyekDetailPage(params = {}) {
  const id = params.id;
  if (!id) { navigate('proyek'); return ''; }

  const root = document.getElementById('page-root');
  if (root) root.innerHTML = renderSkeleton();

  const proyek = await fetchProyek(id);
  if (!proyek) {
    navigate('proyek');
    showError('Proyek tidak ditemukan.');
    return '';
  }

  const [checklistStats, analisisData] = await Promise.all([
    fetchChecklistStats(id),
    fetchLastAnalisis(id),
  ]);

  const html = buildHtml(proyek, checklistStats, analisisData);
  if (root) {
    root.innerHTML = html;
    initAfterRender(proyek, checklistStats, analisisData);
  }
  return html;
}

// ── HTML Builder ─────────────────────────────────────────────
function buildHtml(p, stats, analisis) {
  const statusMap = {
    LAIK_FUNGSI:           { label: 'Laik Fungsi',       cls: 'badge-laik',       icon: 'fa-circle-check' },
    LAIK_FUNGSI_BERSYARAT: { label: 'Laik Bersyarat',    cls: 'badge-bersyarat',  icon: 'fa-triangle-exclamation' },
    TIDAK_LAIK_FUNGSI:     { label: 'Tidak Laik Fungsi', cls: 'badge-tidak-laik', icon: 'fa-circle-xmark' },
    DALAM_PENGKAJIAN:      { label: 'Dalam Pengkajian',  cls: 'badge-proses',     icon: 'fa-clock' },
  };
  const st = statusMap[p.status_slf] || statusMap['DALAM_PENGKAJIAN'];
  const prog = p.progress || 0;

  const workflowSteps = [
    { label: 'Input Data',          icon: 'fa-file-pen',          key: 'input' },
    { label: 'Checklist',           icon: 'fa-clipboard-check',   key: 'checklist' },
    { label: 'Analisis AI',         icon: 'fa-brain',             key: 'analisis' },
    { label: 'Laporan Draft',       icon: 'fa-file-alt',          key: 'laporan' },
    { label: 'Finalisasi SLF',      icon: 'fa-certificate',       key: 'final' },
  ];

  const currentStep = prog < 20 ? 0 : prog < 40 ? 1 : prog < 60 ? 2 : prog < 80 ? 3 : 4;

  return `
    <div id="proyek-detail-page">

      <!-- Back + Actions -->
      <div class="page-header">
        <div class="flex-between">
          <div>
            <button class="btn btn-ghost btn-sm" onclick="window.navigate('proyek')" style="margin-bottom:8px">
              <i class="fas fa-arrow-left"></i> Semua Proyek
            </button>
            <h1 class="page-title" style="margin-bottom:4px">${escHtml(p.nama_bangunan)}</h1>
            <div class="flex gap-3" style="align-items:center;flex-wrap:wrap">
              <span class="badge ${st.cls}"><i class="fas ${st.icon}" style="margin-right:4px"></i>${st.label}</span>
              <span class="text-sm text-tertiary"><i class="fas fa-map-marker-alt" style="margin-right:4px"></i>${escHtml(p.alamat || '-')}</span>
              ${p.nomor_pbg ? `<span class="text-sm text-tertiary"><i class="fas fa-file-certificate" style="margin-right:4px"></i>PBG: ${escHtml(p.nomor_pbg)}</span>` : ''}
            </div>
          </div>
          <div class="flex gap-3">
            <button class="btn btn-ghost btn-sm" onclick="window.navigate('proyek-edit', {id:'${p.id}'})">
              <i class="fas fa-pen"></i> Edit
            </button>
            <button class="btn btn-danger btn-sm" onclick="window._hapusProyek('${p.id}')">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Workflow Timeline -->
      <div class="card" style="margin-bottom:var(--space-5);padding:var(--space-5)">
        <div class="card-title" style="margin-bottom:var(--space-4)">
          <i class="fas fa-route" style="color:var(--brand-400);margin-right:8px"></i>Alur Pengkajian SLF
        </div>
        <div class="workflow-timeline">
          ${workflowSteps.map((s, i) => `
            <div class="workflow-step ${i < currentStep ? 'done' : i === currentStep ? 'active' : ''}">
              <div class="wf-icon"><i class="fas ${s.icon}"></i></div>
              <div class="wf-label">${s.label}</div>
              ${i < workflowSteps.length - 1 ? '<div class="wf-connector"></div>' : ''}
            </div>
          `).join('')}
        </div>
        <div style="margin-top:var(--space-4)">
          <div class="flex-between mb-1">
            <span class="text-sm text-secondary">Progress Keseluruhan</span>
            <span class="text-sm font-semibold text-primary">${prog}%</span>
          </div>
          <div class="progress-wrap" style="height:8px">
            <div class="progress-fill ${prog >= 80 ? 'green' : prog >= 40 ? 'blue' : 'yellow'}"
                 style="width:${prog}%;transition:width 1s ease"></div>
          </div>
        </div>
      </div>

      <!-- Main Grid -->
      <div style="display:grid;grid-template-columns:1fr 340px;gap:var(--space-5)">

        <!-- Left: Tab Navigasi Fitur -->
        <div style="display:flex;flex-direction:column;gap:var(--space-4)">

          <!-- Quick Nav Cards -->
          <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:var(--space-4)">

            <!-- Checklist -->
            <div class="feature-nav-card" onclick="window.navigate('checklist',{id:'${p.id}'})">
              <div class="fnc-icon" style="background:linear-gradient(135deg,hsl(220,70%,45%),hsl(220,70%,60%))">
                <i class="fas fa-clipboard-check"></i>
              </div>
              <div class="fnc-body">
                <div class="fnc-title">Checklist Pemeriksaan</div>
                <div class="fnc-desc">Administrasi · Teknis · Lapangan</div>
                <div class="fnc-meta">
                  <div style="display:flex;align-items:center;gap:8px;margin-top:8px">
                    <div class="progress-wrap" style="flex:1;height:5px">
                      <div class="progress-fill blue" style="width:${stats.pct}%"></div>
                    </div>
                    <span class="text-xs text-tertiary">${stats.done}/${stats.total}</span>
                  </div>
                </div>
              </div>
              <i class="fas fa-arrow-right fnc-arrow"></i>
            </div>

            <!-- Analisis -->
            <div class="feature-nav-card" onclick="window.navigate('analisis',{id:'${p.id}'})">
              <div class="fnc-icon" style="background:linear-gradient(135deg,hsl(258,70%,45%),hsl(258,70%,60%))">
                <i class="fas fa-brain"></i>
              </div>
              <div class="fnc-body">
                <div class="fnc-title">Analisis AI</div>
                <div class="fnc-desc">Rule-based · Risk Scoring · Rekomendasi</div>
                <div class="fnc-meta">
                  ${analisis
                    ? `<span class="badge badge-laik" style="margin-top:8px;font-size:0.7rem">Skor ${analisis.skor_total}/100</span>`
                    : `<span class="text-xs text-tertiary" style="margin-top:8px;display:block">Belum dianalisis</span>`
                  }
                </div>
              </div>
              <i class="fas fa-arrow-right fnc-arrow"></i>
            </div>

            <!-- Laporan -->
            <div class="feature-nav-card" onclick="window.navigate('laporan',{id:'${p.id}'})">
              <div class="fnc-icon" style="background:linear-gradient(135deg,hsl(160,65%,35%),hsl(160,65%,50%))">
                <i class="fas fa-file-contract"></i>
              </div>
              <div class="fnc-body">
                <div class="fnc-title">Laporan Kajian SLF</div>
                <div class="fnc-desc">Preview · Export PDF · Word</div>
                <div class="fnc-meta">
                  <span class="text-xs text-tertiary" style="margin-top:8px;display:block">
                    ${analisis ? 'Data analisis tersedia' : 'Lengkapi analisis terlebih dahulu'}
                  </span>
                </div>
              </div>
              <i class="fas fa-arrow-right fnc-arrow"></i>
            </div>

            <!-- TODO -->
            <div class="feature-nav-card" onclick="window.navigate('todo',{proyekId:'${p.id}'})">
              <div class="fnc-icon" style="background:linear-gradient(135deg,hsl(40,80%,40%),hsl(40,80%,55%))">
                <i class="fas fa-list-check"></i>
              </div>
              <div class="fnc-body">
                <div class="fnc-title">TODO & Tindak Lanjut</div>
                <div class="fnc-desc">Task management per proyek</div>
                <div class="fnc-meta">
                  <span class="text-xs text-tertiary" style="margin-top:8px;display:block">Segera hadir</span>
                </div>
              </div>
              <i class="fas fa-arrow-right fnc-arrow"></i>
            </div>
          </div>

          <!-- Data Teknis Bangunan -->
          <div class="card">
            <div class="card-title" style="margin-bottom:var(--space-4)">
              <i class="fas fa-building" style="color:var(--brand-400);margin-right:8px"></i>Data Teknis Bangunan
            </div>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-3)">
              ${[
                ['Jenis Bangunan',   p.jenis_bangunan   || '-', 'fa-tag'],
                ['Jenis Konstruksi', p.jenis_konstruksi || '-', 'fa-layer-group'],
                ['Jumlah Lantai',    p.jumlah_lantai ? `${p.jumlah_lantai} lantai` : '-', 'fa-stairs'],
                ['Luas Bangunan',    p.luas_bangunan ? `${Number(p.luas_bangunan).toLocaleString('id-ID')} m²` : '-', 'fa-ruler-combined'],
                ['Luas Lahan',       p.luas_lahan ? `${Number(p.luas_lahan).toLocaleString('id-ID')} m²` : '-', 'fa-expand'],
                ['Tahun Dibangun',   p.tahun_dibangun || '-', 'fa-calendar'],
                ['Fungsi Bangunan',  p.fungsi_bangunan || '-', 'fa-building-columns'],
                ['Nomor PBG/IMB',    p.nomor_pbg || '-', 'fa-file-certificate'],
                ['Kota/Provinsi',    [p.kota, p.provinsi].filter(Boolean).join(', ') || '-', 'fa-location-dot'],
              ].map(([k, v, ic]) => `
                <div style="background:var(--bg-elevated);border-radius:var(--radius-md);padding:var(--space-3) var(--space-4)">
                  <div class="text-xs text-tertiary" style="margin-bottom:2px">
                    <i class="fas ${ic}" style="margin-right:4px;opacity:0.6"></i>${k}
                  </div>
                  <div class="text-sm font-semibold text-primary truncate">${escHtml(v)}</div>
                </div>
              `).join('')}
            </div>
            ${p.kondisi_umum ? `
              <div style="margin-top:var(--space-4);padding:var(--space-4);background:var(--bg-elevated);border-radius:var(--radius-md);border-left:3px solid var(--brand-400)">
                <div class="text-xs text-tertiary" style="margin-bottom:4px">Kondisi Umum</div>
                <div class="text-sm text-secondary">${escHtml(p.kondisi_umum)}</div>
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Right: Info Panel -->
        <div style="display:flex;flex-direction:column;gap:var(--space-4)">

          <!-- Pemilik -->
          <div class="card">
            <div class="card-title" style="margin-bottom:var(--space-4)">
              <i class="fas fa-user" style="color:var(--brand-400);margin-right:8px"></i>Pemilik / Pemohon
            </div>
            <div style="display:flex;flex-direction:column;gap:var(--space-2)">
              ${[
                ['fa-user-tie',    p.pemilik || '-'],
                ['fa-id-card',     p.penanggung_jawab || '-'],
                ['fa-phone',       p.telepon || '-'],
                ['fa-envelope',    p.email_pemilik || '-'],
              ].map(([ic, val]) => `
                <div class="flex gap-3" style="align-items:center">
                  <i class="fas ${ic}" style="color:var(--text-tertiary);width:16px;text-align:center"></i>
                  <span class="text-sm text-secondary">${escHtml(val)}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Jadwal -->
          <div class="card">
            <div class="card-title" style="margin-bottom:var(--space-4)">
              <i class="fas fa-calendar-days" style="color:var(--brand-400);margin-right:8px"></i>Jadwal Pengkajian
            </div>
            ${[
              ['Mulai',   p.tanggal_mulai,   'fa-play'],
              ['Target',  p.tanggal_target,  'fa-flag-checkered'],
            ].map(([lbl, tgl, ic]) => `
              <div class="flex-between" style="margin-bottom:10px">
                <span class="text-sm text-secondary"><i class="fas ${ic}" style="margin-right:6px;opacity:0.7"></i>${lbl}</span>
                <span class="text-sm font-semibold text-primary">${tgl ? formatTanggal(tgl) : '-'}</span>
              </div>
            `).join('')}
            ${p.tanggal_mulai && p.tanggal_target ? (() => {
              const start = new Date(p.tanggal_mulai);
              const end   = new Date(p.tanggal_target);
              const now   = new Date();
              const total = end - start;
              const elapsed = Math.max(0, now - start);
              const daysLeft = Math.ceil((end - now) / 86400000);
              const timePct = Math.min(100, Math.round((elapsed / total) * 100));
              return `
                <div style="margin-top:var(--space-3)">
                  <div class="flex-between mb-1">
                    <span class="text-xs text-tertiary">Waktu berjalan</span>
                    <span class="text-xs ${daysLeft < 7 ? 'text-danger' : 'text-tertiary'}">${daysLeft > 0 ? `${daysLeft} hari tersisa` : 'Melewati target'}</span>
                  </div>
                  <div class="progress-wrap" style="height:5px">
                    <div class="progress-fill ${daysLeft < 7 ? 'red' : 'blue'}" style="width:${timePct}%"></div>
                  </div>
                </div>
              `;
            })() : ''}
          </div>

          <!-- AI Result -->
          ${analisis ? `
            <div class="ai-panel">
              <div class="ai-panel-header">
                <div class="ai-icon"><i class="fas fa-brain"></i></div>
                <div>
                  <div class="ai-panel-title">Hasil Analisis AI</div>
                  <div class="ai-panel-subtitle">${formatTanggal(analisis.created_at)}</div>
                </div>
              </div>
              <div class="ai-finding ${analisis.status_slf === 'LAIK_FUNGSI' ? 'success' : analisis.status_slf === 'LAIK_FUNGSI_BERSYARAT' ? 'warning' : 'critical'}">
                <i class="fas ${analisis.status_slf === 'LAIK_FUNGSI' ? 'fa-circle-check' : analisis.status_slf === 'LAIK_FUNGSI_BERSYARAT' ? 'fa-triangle-exclamation' : 'fa-circle-xmark'}" style="margin-right:6px"></i>
                ${analisis.status_slf === 'LAIK_FUNGSI' ? 'Bangunan Laik Fungsi' : analisis.status_slf === 'LAIK_FUNGSI_BERSYARAT' ? 'Laik Fungsi Bersyarat' : 'Tidak Laik Fungsi'}
              </div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:var(--space-3)">
                <div style="text-align:center;background:hsla(0,0%,0%,0.2);border-radius:var(--radius-md);padding:var(--space-3)">
                  <div class="text-xs text-tertiary">Skor Total</div>
                  <div style="font-size:1.6rem;font-weight:800;color:var(--brand-400)">${analisis.skor_total}</div>
                </div>
                <div style="text-align:center;background:hsla(0,0%,0%,0.2);border-radius:var(--radius-md);padding:var(--space-3)">
                  <div class="text-xs text-tertiary">Level Risiko</div>
                  <div style="font-size:1.1rem;font-weight:700;color:${riskColor(analisis.risk_level)};margin-top:4px">${riskLabel(analisis.risk_level)}</div>
                </div>
              </div>
              <button class="btn btn-secondary btn-sm" style="width:100%;margin-top:var(--space-3)"
                      onclick="window.navigate('analisis',{id:'${analisis.proyek_id}'})">
                <i class="fas fa-eye"></i> Lihat Detail Analisis
              </button>
            </div>
          ` : `
            <div class="ai-panel">
              <div class="ai-panel-header">
                <div class="ai-icon"><i class="fas fa-brain"></i></div>
                <div>
                  <div class="ai-panel-title">AI Engine</div>
                  <div class="ai-panel-subtitle">Belum ada data analisis</div>
                </div>
              </div>
              <div class="ai-finding">
                <i class="fas fa-circle-info" style="margin-right:6px"></i>
                Lengkapi checklist pemeriksaan terlebih dahulu untuk memulai analisis AI.
              </div>
              <button class="btn btn-primary btn-sm" style="width:100%;margin-top:var(--space-3)"
                      onclick="window.navigate('checklist',{id:'${p.id}'})">
                <i class="fas fa-clipboard-check"></i> Mulai Checklist
              </button>
            </div>
          `}

          <!-- Catatan -->
          ${p.catatan ? `
            <div class="card">
              <div class="card-title" style="margin-bottom:var(--space-3)">
                <i class="fas fa-note-sticky" style="color:var(--brand-400);margin-right:8px"></i>Catatan
              </div>
              <p class="text-sm text-secondary" style="line-height:1.6">${escHtml(p.catatan)}</p>
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}

// ── After Render ──────────────────────────────────────────────
function initAfterRender(p) {
  window._hapusProyek = async (id) => {
    const ok = await confirm({
      title: 'Hapus Proyek',
      message: `Yakin ingin menghapus proyek "${p.nama_bangunan}"? Semua data terkait akan ikut terhapus.`,
      confirmText: 'Hapus',
      danger: true,
    });
    if (!ok) return;
    try {
      const { error } = await supabase.from('proyek').delete().eq('id', id);
      if (error) throw error;
      showSuccess('Proyek berhasil dihapus.');
      navigate('proyek');
    } catch (e) {
      showError('Gagal menghapus: ' + e.message);
    }
  };
}

// ── Data Fetchers ─────────────────────────────────────────────
async function fetchProyek(id) {
  try {
    const { data } = await supabase.from('proyek').select('*').eq('id', id).single();
    return data;
  } catch { return null; }
}

async function fetchChecklistStats(proyekId) {
  try {
    const { data } = await supabase
      .from('checklist_items')
      .select('id, status')
      .eq('proyek_id', proyekId);
    const total = data?.length || 0;
    const done  = data?.filter(d => d.status && d.status !== 'belum').length || 0;
    return { total, done, pct: total > 0 ? Math.round((done / total) * 100) : 0 };
  } catch { return { total: 0, done: 0, pct: 0 }; }
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

// ── Skeleton ──────────────────────────────────────────────────
function renderSkeleton() {
  return `
    <div class="page-header">
      <div class="skeleton" style="height:20px;width:160px;margin-bottom:8px"></div>
      <div class="skeleton" style="height:36px;width:400px;margin-bottom:8px"></div>
      <div class="skeleton" style="height:22px;width:300px"></div>
    </div>
    <div class="skeleton" style="height:120px;border-radius:var(--radius-lg);margin-bottom:var(--space-5)"></div>
    <div style="display:grid;grid-template-columns:1fr 340px;gap:var(--space-5)">
      <div>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:var(--space-4);margin-bottom:var(--space-4)">
          ${Array(4).fill(0).map(() => `<div class="skeleton" style="height:120px;border-radius:var(--radius-lg)"></div>`).join('')}
        </div>
        <div class="skeleton" style="height:280px;border-radius:var(--radius-lg)"></div>
      </div>
      <div style="display:flex;flex-direction:column;gap:var(--space-4)">
        <div class="skeleton" style="height:160px;border-radius:var(--radius-lg)"></div>
        <div class="skeleton" style="height:140px;border-radius:var(--radius-lg)"></div>
        <div class="skeleton" style="height:160px;border-radius:var(--radius-lg)"></div>
      </div>
    </div>
  `;
}

// ── Helpers ───────────────────────────────────────────────────
function escHtml(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
function formatTanggal(s) {
  return new Date(s).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}
function riskColor(r) {
  return r === 'low' ? 'hsl(160,65%,46%)' : r === 'medium' ? 'hsl(40,80%,55%)' : r === 'high' ? 'hsl(0,70%,58%)' : 'hsl(330,70%,50%)';
}
function riskLabel(r) {
  return { low: 'Rendah', medium: 'Sedang', high: 'Tinggi', critical: 'Kritis' }[r] || r;
}
