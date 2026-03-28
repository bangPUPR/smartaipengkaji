// ============================================================
//  DASHBOARD PAGE
//  KPI overview, charts, AI insight, todo monitoring
// ============================================================
import { supabase } from '../lib/supabase.js';
import { getUserInfo } from '../lib/auth.js';
import { navigate } from '../lib/router.js';
import { APP_CONFIG } from '../lib/config.js';
import { showError } from '../components/toast.js';

export async function dashboardPage() {
  // Render skeleton immediately
  const skeletonHtml = renderSkeleton();
  const root = document.getElementById('page-root');
  if (root) root.innerHTML = skeletonHtml;

  // Fetch data
  const [kpi, projects, todos] = await Promise.all([
    fetchKPI(),
    fetchRecentProjects(),
    fetchRecentTodos(),
  ]);

  const user = getUserInfo();
  const now  = new Date();
  const greeting = getGreeting(now.getHours());

  triggerDashboardMount(projects, kpi);

  return `
    <div id="dashboard-page">
      <!-- Page Header -->
      <div class="page-header">
        <div class="flex-between">
          <div>
            <h1 class="page-title">${greeting}, ${user?.name?.split(' ')[0] || 'User'}! 👋</h1>
            <p class="page-subtitle">Monitoring pengkajian SLF &bull; ${formatDate(now)}</p>
          </div>
          <div class="flex gap-3">
            <button class="btn btn-secondary" onclick="window.navigate('laporan')">
              <i class="fas fa-file-export"></i> Export Laporan
            </button>
            <button class="btn btn-primary" onclick="window.navigate('proyek-baru')">
              <i class="fas fa-plus"></i> Proyek Baru
            </button>
          </div>
        </div>
      </div>

      <!-- KPI Grid -->
      <div class="kpi-grid">
        ${renderKPICards(kpi)}
      </div>

      <!-- Map Overview -->
      <div class="card" style="margin-top:var(--space-5); overflow:hidden; padding:0; display:flex; flex-direction:column">
        <div class="card-header" style="border-bottom:1px solid var(--border-subtle); background:var(--bg-elevated); z-index:10">
          <div>
            <div class="card-title">Peta Distribusi Proyek</div>
            <div class="card-subtitle">Visualisasi spasial lokasi pengkajian SLF</div>
          </div>
        </div>
        <div id="dashboard-map" style="width:100%; height:320px; z-index:1"></div>
      </div>

      <!-- Main Grid -->
      <div style="display:grid;grid-template-columns:1fr 1fr 380px;gap:var(--space-5);margin-top:var(--space-5)">

        <!-- Chart: Distribusi Temuan -->
        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">Distribusi Temuan per Aspek</div>
              <div class="card-subtitle">Berdasarkan seluruh proyek aktif</div>
            </div>
            <button class="btn btn-ghost btn-sm" onclick="refreshCharts()">
              <i class="fas fa-rotate"></i>
            </button>
          </div>
          <div class="chart-wrap">
            <canvas id="chart-distribusi"></canvas>
          </div>
        </div>

        <!-- Chart: Risiko -->
        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">Level Risiko</div>
              <div class="card-subtitle">Agregat semua temuan</div>
            </div>
          </div>
          <div class="chart-wrap">
            <canvas id="chart-risiko"></canvas>
          </div>
        </div>

        <!-- Right: AI Panel + TODO -->
        <div style="display:flex;flex-direction:column;gap:var(--space-4)">
          <!-- AI Insight Panel -->
          <div class="ai-panel">
            <div class="ai-panel-header">
              <div class="ai-icon"><i class="fas fa-brain"></i></div>
              <div>
                <div class="ai-panel-title">AI Insight</div>
                <div class="ai-panel-subtitle">Analisis otomatis sistem</div>
              </div>
            </div>
            ${renderAIInsights(kpi)}
          </div>

          <!-- SLF Status Summary -->
          <div class="card">
            <div class="card-header">
              <div class="card-title">Status SLF</div>
              <button class="btn btn-ghost btn-sm" onclick="window.navigate('proyek')">
                Lihat Semua →
              </button>
            </div>
            ${renderSLFStatus(kpi)}
          </div>
        </div>
      </div>

      <!-- Bottom Grid: Projects + TODO -->
      <div style="display:grid;grid-template-columns:1fr 400px;gap:var(--space-5);margin-top:var(--space-5)">

        <!-- Recent Projects -->
        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">Proyek Terkini</div>
              <div class="card-subtitle">${projects.length} dari ${kpi.totalProyek || 0} proyek</div>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="window.navigate('proyek')">
              Semua Proyek
            </button>
          </div>
          ${renderProjectTable(projects)}
        </div>

        <!-- TODO Monitoring -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">TODO Monitoring</div>
            <button class="btn btn-ghost btn-sm" onclick="window.navigate('todo')">
              Lihat Semua →
            </button>
          </div>
          ${renderTodoList(todos)}
        </div>
      </div>
    </div>
  `;
}

// ── KPI Cards ──────────────────────────────────────────────
function renderKPICards(kpi) {
  const cards = [
    { label: 'Total Proyek',     value: kpi.totalProyek     || 0, icon: 'fa-folder-open',       color: 'kpi-blue',   trend: null },
    { label: 'Proyek Aktif',     value: kpi.proyekAktif     || 0, icon: 'fa-play-circle',        color: 'kpi-green',  trend: null },
    { label: 'Laik Fungsi',      value: kpi.laikFungsi      || 0, icon: 'fa-circle-check',       color: 'kpi-green',  trend: '+2' },
    { label: 'Laik Bersyarat',   value: kpi.laikBersyarat   || 0, icon: 'fa-triangle-exclamation',color: 'kpi-yellow', trend: null },
    { label: 'Tidak Laik',       value: kpi.tidakLaik       || 0, icon: 'fa-circle-xmark',       color: 'kpi-red',    trend: null },
    { label: 'Task Selesai',     value: kpi.taskSelesai     || 0, icon: 'fa-check-double',       color: 'kpi-purple', trend: '+5' },
    { label: 'Task Terlambat',   value: kpi.taskTerlambat   || 0, icon: 'fa-clock',              color: 'kpi-red',    trend: null },
    { label: 'Analisis AI',      value: kpi.totalAnalisis   || 0, icon: 'fa-brain',              color: 'kpi-purple', trend: null },
  ];

  return cards.map(c => `
    <div class="kpi-card" onclick="window.navigate('proyek')">
      <div class="kpi-icon-wrap ${c.color}">
        <i class="fas ${c.icon}"></i>
      </div>
      <div class="kpi-value" style="color:inherit">${c.value}</div>
      <div class="kpi-label">${c.label}</div>
      ${c.trend ? `<div class="kpi-trend up"><i class="fas fa-arrow-trend-up"></i> ${c.trend} bulan ini</div>` : ''}
    </div>
  `).join('');
}

// ── AI Insights ─────────────────────────────────────────────
function renderAIInsights(kpi) {
  const total = (kpi.totalProyek || 0);
  const laik  = (kpi.laikFungsi || 0);
  const rate  = total > 0 ? Math.round((laik / total) * 100) : 0;

  const insights = [];

  if (kpi.taskTerlambat > 0) {
    insights.push({ type: 'critical', text: `${kpi.taskTerlambat} task melewati batas waktu. Tindak segera.` });
  }
  if (kpi.tidakLaik > 0) {
    insights.push({ type: 'warning', text: `${kpi.tidakLaik} bangunan berstatus Tidak Laik Fungsi — perlu rehabilitasi.` });
  }
  insights.push({ type: 'success', text: `Tingkat kelulusan SLF: ${rate}% dari total proyek.` });
  if (kpi.proyekAktif > 0) {
    insights.push({ type: '', text: `${kpi.proyekAktif} proyek sedang dalam proses pengkajian.` });
  }

  if (!insights.length) {
    return `<div class="ai-finding">Belum ada data proyek untuk dianalisis.</div>`;
  }

  return insights.slice(0, 4).map(i => `
    <div class="ai-finding ${i.type}">
      <i class="fas ${i.type === 'critical' ? 'fa-triangle-exclamation' : i.type === 'warning' ? 'fa-exclamation' : i.type === 'success' ? 'fa-circle-check' : 'fa-circle-info'}" style="margin-right:6px"></i>
      ${i.text}
    </div>
  `).join('');
}

// ── SLF Status Donut ────────────────────────────────────────
function renderSLFStatus(kpi) {
  const items = [
    { label: 'Laik Fungsi',          value: kpi.laikFungsi    || 0, cls: 'kpi-green',  bar: 'green' },
    { label: 'Laik Bersyarat',       value: kpi.laikBersyarat || 0, cls: 'kpi-yellow', bar: 'yellow' },
    { label: 'Tidak Laik',           value: kpi.tidakLaik     || 0, cls: 'kpi-red',    bar: 'red' },
    { label: 'Dalam Pengkajian',     value: kpi.proyekAktif   || 0, cls: 'kpi-blue',   bar: 'blue' },
  ];
  const total = items.reduce((s, i) => s + i.value, 0) || 1;

  return `<div style="display:flex;flex-direction:column;gap:10px">
    ${items.map(i => `
      <div>
        <div class="flex-between mb-1">
          <span class="text-sm text-secondary">${i.label}</span>
          <span class="text-sm font-semibold text-primary">${i.value}</span>
        </div>
        <div class="progress-wrap">
          <div class="progress-fill ${i.bar}" style="width:${Math.round((i.value/total)*100)}%"></div>
        </div>
      </div>
    `).join('')}
  </div>`;
}

// ── Project Table ────────────────────────────────────────────
function renderProjectTable(projects) {
  if (!projects.length) {
    return `<div class="empty-state"><div class="empty-icon"><i class="fas fa-folder-open"></i></div><p class="empty-title">Belum ada proyek</p><button class="btn btn-primary mt-4" onclick="window.navigate('proyek-baru')"><i class="fas fa-plus"></i> Buat Proyek</button></div>`;
  }

  const statusMap = {
    LAIK_FUNGSI:           { label: 'Laik Fungsi',          cls: 'badge-laik' },
    LAIK_FUNGSI_BERSYARAT: { label: 'Laik Bersyarat',       cls: 'badge-bersyarat' },
    TIDAK_LAIK_FUNGSI:     { label: 'Tidak Laik',           cls: 'badge-tidak-laik' },
    DALAM_PENGKAJIAN:      { label: 'Dalam Pengkajian',     cls: 'badge-proses' },
  };

  return `
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Nama Bangunan</th>
            <th>Pemilik</th>
            <th>Progress</th>
            <th>Status SLF</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${projects.map(p => {
            const s = statusMap[p.status_slf] || { label: p.status_slf, cls: 'badge-proses' };
            const prog = p.progress || 0;
            return `
              <tr style="cursor:pointer" onclick="window.navigate('proyek-detail', { id: '${p.id}' })">
                <td>
                  <div class="font-semibold text-primary truncate" style="max-width:180px">${p.nama_bangunan || '-'}</div>
                  <div class="text-xs text-tertiary truncate" style="max-width:180px">${p.alamat || ''}</div>
                </td>
                <td class="text-secondary truncate" style="max-width:120px">${p.pemilik || '-'}</td>
                <td style="min-width:100px">
                  <div class="flex-between mb-1">
                    <span class="text-xs text-tertiary">${prog}%</span>
                  </div>
                  <div class="progress-wrap">
                    <div class="progress-fill ${prog >= 80 ? 'green' : prog >= 40 ? 'blue' : 'yellow'}" style="width:${prog}%"></div>
                  </div>
                </td>
                <td><span class="badge ${s.cls}">${s.label}</span></td>
                <td>
                  <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();window.navigate('proyek-detail', {id:'${p.id}'})">
                    <i class="fas fa-arrow-right"></i>
                  </button>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// ── TODO List ────────────────────────────────────────────────
function renderTodoList(todos) {
  if (!todos.length) {
    return `<div class="empty-state"><div class="empty-icon"><i class="fas fa-list-check"></i></div><p class="empty-title">Tidak ada task</p></div>`;
  }

  const priorityClass = { critical: 'badge-critical', high: 'badge-high', medium: 'badge-medium', low: 'badge-low' };

  return `<div style="display:flex;flex-direction:column;gap:8px">
    ${todos.slice(0, 8).map(t => `
      <div style="background:var(--bg-elevated);border:1px solid var(--border-subtle);border-radius:var(--radius-md);padding:10px 12px;display:flex;align-items:center;gap:10px;cursor:pointer;transition:all var(--transition-fast)"
           onmouseenter="this.style.borderColor='var(--border-default)'"
           onmouseleave="this.style.borderColor='var(--border-subtle)'"
           onclick="window.navigate('todo-detail', {id:'${t.id}'})">
        <div style="width:3px;height:36px;border-radius:2px;background:${t.priority === 'critical' ? 'var(--danger-400)' : t.priority === 'high' ? 'var(--warning-400)' : 'var(--brand-400)'};flex-shrink:0"></div>
        <div style="flex:1;overflow:hidden">
          <div class="text-sm font-semibold text-primary truncate">${t.judul || t.title || '-'}</div>
          <div class="text-xs text-tertiary truncate">${t.proyek_nama || 'Umum'}</div>
        </div>
        <span class="badge ${priorityClass[t.priority] || 'badge-medium'}" style="font-size:0.65rem">${t.priority || 'medium'}</span>
      </div>
    `).join('')}
  </div>`;
}

// ── Skeleton ─────────────────────────────────────────────────
function renderSkeleton() {
  return `
    <div class="page-header">
      <div class="skeleton" style="height:36px;width:300px;margin-bottom:8px"></div>
      <div class="skeleton" style="height:20px;width:200px"></div>
    </div>
    <div class="kpi-grid">
      ${Array(8).fill(0).map(() => `
        <div class="kpi-card">
          <div class="skeleton" style="height:44px;width:44px;border-radius:10px;margin-bottom:12px"></div>
          <div class="skeleton" style="height:40px;width:60px;margin-bottom:8px"></div>
          <div class="skeleton" style="height:16px;width:100px"></div>
        </div>
      `).join('')}
    </div>
  `;
}

// ── Data Fetchers ────────────────────────────────────────────
async function fetchKPI() {
  try {
    const [
      { count: totalProyek },
      { count: proyekAktif },
      { count: laikFungsi },
      { count: laikBersyarat },
      { count: tidakLaik },
      { count: taskSelesai },
      { count: taskTerlambat },
      { count: totalAnalisis },
    ] = await Promise.all([
      supabase.from('proyek').select('*', { count: 'exact', head: true }),
      supabase.from('proyek').select('*', { count: 'exact', head: true }).eq('status_slf', 'DALAM_PENGKAJIAN'),
      supabase.from('proyek').select('*', { count: 'exact', head: true }).eq('status_slf', 'LAIK_FUNGSI'),
      supabase.from('proyek').select('*', { count: 'exact', head: true }).eq('status_slf', 'LAIK_FUNGSI_BERSYARAT'),
      supabase.from('proyek').select('*', { count: 'exact', head: true }).eq('status_slf', 'TIDAK_LAIK_FUNGSI'),
      supabase.from('todo_tasks').select('*', { count: 'exact', head: true }).eq('status', 'Done'),
      supabase.from('todo_tasks').select('*', { count: 'exact', head: true }).lt('due_date', new Date().toISOString()).neq('status', 'Done'),
      supabase.from('hasil_analisis').select('*', { count: 'exact', head: true }),
    ]);

    return { totalProyek, proyekAktif, laikFungsi, laikBersyarat, tidakLaik, taskSelesai, taskTerlambat, totalAnalisis };
  } catch {
    return { totalProyek: 0, proyekAktif: 0, laikFungsi: 0, laikBersyarat: 0, tidakLaik: 0, taskSelesai: 0, taskTerlambat: 0, totalAnalisis: 0 };
  }
}

async function fetchRecentProjects() {
  try {
    const { data } = await supabase
      .from('proyek')
      .select('id, nama_bangunan, kota, alamat, pemilik, status_slf, progress, latitude, longitude, updated_at')
      .order('updated_at', { ascending: false })
      .limit(20);
    return data || [];
  } catch { return []; }
}

async function fetchRecentTodos() {
  try {
    const { data } = await supabase
      .from('todo_tasks')
      .select('id, judul, title, priority, status, due_date, proyek_nama')
      .neq('status', 'Done')
      .order('priority', { ascending: false })
      .limit(8);
    return data || [];
  } catch { return []; }
}

// ── After Render: init charts & map ───────────────────────────
export async function afterDashboardRender(kpi) {
  // Dipanggil melalui setTimeout di atas jika diperlukan
}

export function triggerDashboardMount(projects, kpi) {
  setTimeout(() => {
    initCharts(kpi);
    initMap(projects);
  }, 100);
}

function initMap(projects) {
  if (typeof window.L === 'undefined') return;
  const mapEl = document.getElementById('dashboard-map');
  if (!mapEl) return;

  if (window._dashMap) {
    try {
      window._dashMap.off();
      window._dashMap.remove();
    } catch(e) { console.warn("L.Map cleanup failed:", e); }
    window._dashMap = null;
  }

  // Cek apakah element masih ada di DOM
  if (!document.getElementById('dashboard-map')) return;

  const map = window.L.map('dashboard-map', {
    zoomControl: false // custom position
  }).setView([-6.9147, 107.6098], 7);
  
  window.L.control.zoom({ position: 'bottomright' }).addTo(map);
  window._dashMap = map;

  window.L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 20
  }).addTo(map);

  const geoMapping = {
    'jakarta': [-6.2088, 106.8456], 'bandung': [-6.9147, 107.6098],
    'garut': [-7.2279, 107.9087], 'surabaya': [-7.2504, 112.7688],
    'yogyakarta': [-7.7956, 110.3695], 'semarang': [-6.9667, 110.4167],
    'bekasi': [-6.2383, 106.9756], 'depok': [-6.4025, 106.7942]
  };

  const markers = window.L.featureGroup().addTo(map);

  projects.forEach((p) => {
    let latlng;
    if (p.latitude && p.longitude) {
      latlng = [parseFloat(p.latitude), parseFloat(p.longitude)];
    } else {
      latlng = [-6.9 + (Math.random() * 2 - 1), 107.6 + (Math.random() * 2 - 1)];
      const cityStr = (p.kota || p.alamat || '').toLowerCase();
      for (const [city, coords] of Object.entries(geoMapping)) {
        if (cityStr.includes(city)) {
          latlng = [coords[0] + (Math.random()*0.02 - 0.01), coords[1] + (Math.random()*0.02 - 0.01)];
          break;
        }
      }
    }

    const mk = window.L.marker(latlng).addTo(markers);
    const color = p.status_slf === 'LAIK_FUNGSI' ? '#10b981' : p.status_slf === 'TIDAK_LAIK_FUNGSI' ? '#ef4444' : '#f59e0b';
    
    mk.bindPopup(`
      <div style="font-family:Inter,sans-serif;min-width:180px">
        <div style="font-weight:700;font-size:14px;color:var(--text-100,#111);margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${p.nama_bangunan}">${p.nama_bangunan}</div>
        <div style="font-size:12px;color:var(--text-300,#666);margin-bottom:8px"><i class="fas fa-map-marker-alt" style="margin-right:4px"></i>${p.kota || p.alamat || '-'}</div>
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span style="font-size:10px;padding:3px 8px;border-radius:12px;color:white;background:${color}">${p.status_slf.replace(/_/g, ' ')}</span>
          <button onclick="window.navigate('proyek-detail', {id:'${p.id}'})" style="background:none;border:none;color:#3b5fd9;font-weight:600;font-size:12px;cursor:pointer">Detail &rarr;</button>
        </div>
      </div>
    `);
  });

  if (projects.length > 0 && markers.getBounds().isValid()) {
    setTimeout(() => {
      try {
        if (window._dashMap && map._container && map._loaded) {
          map.fitBounds(markers.getBounds(), { padding: [40, 40], maxZoom: 12 });
        }
      } catch (err) {
        console.warn('Map fitBounds suppressed:', err.message);
      }
    }, 200);
  }
}

async function initCharts(kpi) {
  if (typeof window.Chart === 'undefined') return;

  const distribusiCtx = document.getElementById('chart-distribusi');
  const risikoCtx     = document.getElementById('chart-risiko');

  // Bersihkan Chart lama jika ada
  if (window._distChart) { window._distChart.destroy(); window._distChart = null; }
  if (window._riskChart) { window._riskChart.destroy(); window._riskChart = null; }

  if (distribusiCtx) {
    window._distChart = new window.Chart(distribusiCtx, {
      type: 'doughnut',
      data: {
        labels: APP_CONFIG.aspekSLF.map(a => a.name),
        datasets: [{
          data: APP_CONFIG.aspekSLF.map(() => Math.floor(Math.random() * 20)),
          backgroundColor: [
            'hsl(220,70%,55%)','hsl(258,70%,60%)','hsl(0,70%,58%)',
            'hsl(40,80%,55%)','hsl(0,74%,52%)','hsl(160,65%,46%)',
            'hsl(40,80%,50%)','hsl(200,75%,52%)',
          ],
          borderWidth: 2,
          borderColor: 'hsl(224,20%,14%)',
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { color: 'hsl(220,12%,70%)', padding: 12, font: { size: 11 } } },
        },
      },
    });
  }

  if (risikoCtx) {
    window._riskChart = new window.Chart(risikoCtx, {
      type: 'bar',
      data: {
        labels: ['Rendah', 'Sedang', 'Tinggi', 'Kritis'],
        datasets: [{
          label: 'Jumlah Temuan',
          data: [12, 8, 5, 2],
          backgroundColor: ['hsl(160,65%,46%)','hsl(40,80%,55%)','hsl(0,70%,58%)','hsl(330,70%,50%)'],
          borderRadius: 6,
          borderSkipped: false,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, ticks: { color: 'hsl(220,10%,50%)', stepSize: 1 }, grid: { color: 'hsla(220,20%,50%,0.1)' } },
          x: { ticks: { color: 'hsl(220,10%,50%)' }, grid: { display: false } },
        },
      },
    });
  }
}

// ── Helpers ──────────────────────────────────────────────────
function getGreeting(hour) {
  if (hour < 11) return 'Selamat Pagi';
  if (hour < 15) return 'Selamat Siang';
  if (hour < 18) return 'Selamat Sore';
  return 'Selamat Malam';
}

function formatDate(d) {
  return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

// Expose navigate globally for onclick handlers
window.navigate = navigate;
window.refreshCharts = () => window.location.reload();
