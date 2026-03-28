// ============================================================
//  MAIN APPLICATION ENTRY POINT
//  Orchestrates: auth, layout, router, pages
// ============================================================
import './styles/main.css';
import { initAuth, onAuthChange, isAuthenticated } from './lib/auth.js';
import { route, startRouter, navigate } from './lib/router.js';
import { renderAppShell, getPageRoot, onRouteChange, destroyAppShell } from './components/layout.js';
import { loginPage } from './pages/login.js';
import { dashboardPage } from './pages/dashboard.js';
import { proyekListPage, afterProyekListRender } from './pages/proyek-list.js';
import { proyekFormPage } from './pages/proyek-form.js';
import { proyekDetailPage } from './pages/proyek-detail.js';
import { checklistPage } from './pages/checklist.js';
import { analisisPage } from './pages/analisis.js';
import { laporanPage } from './pages/laporan.js';
import { todoPage } from './pages/todo.js';
import { todoDetailPage } from './pages/todo-detail.js';
import { executivePage } from './pages/executive.js';
import { multiAgentPage } from './pages/multi-agent.js';
import { filesPage } from './pages/files.js';
import { placeholderPage } from './pages/placeholder.js';
import { getUserInfo, signOut } from './lib/auth.js';
import { showSuccess, showError } from './components/toast.js';
import { confirm } from './components/modal.js';
import { APP_CONFIG } from './lib/config.js';

// Make navigate globally accessible for onclick handlers
window.navigate = (path, params = {}) => navigate(path, params);

// ── Loading Progress ──────────────────────────────────────────
const loadingEl   = document.getElementById('loading-screen');
const progressEl  = document.getElementById('loading-progress');
let _initialized  = false;

function updateProgress(pct) {
  if (progressEl) progressEl.style.width = `${pct}%`;
}

function hideLoading() {
  setTimeout(() => {
    loadingEl?.classList.add('hidden');
  }, 400);
}

// ── Chart.js Lazy Load ────────────────────────────────────────
async function loadChartJS() {
  if (window.Chart) return;
  return new Promise((resolve) => {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
    s.onload = resolve;
    document.head.appendChild(s);
  });
}

// ── Register Routes ───────────────────────────────────────────
function registerRoutes() {
  // Public
  route('login', async () => {
    if (isAuthenticated()) { navigate('dashboard'); return ''; }
    await loginPage(); // renders directly to body
    return '';
  });

  // Protected - Dashboard
  route('dashboard', async () => {
    await loadChartJS();
    const html = await dashboardPage();
    // After render, initialize charts
    setTimeout(async () => {
      const { fetchKPI } = await import('./pages/dashboard.js');
      // charts are initialized inside dashboardPage
    }, 50);
    return html;
  });

  // Protected - Proyek
  route('proyek', async () => {
    const html = await proyekListPage();
    setTimeout(afterProyekListRender, 50);
    return html;
  });

  route('proyek-baru', async () => {
    return await proyekFormPage();
  });

  route('proyek-edit', async (params) => {
    return await proyekFormPage(params);
  });

  route('proyek-detail', async (params) => {
    return await proyekDetailPage(params);
  });

  // Protected - Checklist
  route('checklist', async (params) => {
    return await checklistPage(params);
  });

  // Protected - Files
  route('files', async () => {
    return await filesPage();
  });

  // Protected - Analisis
  route('analisis', async (params) => {
    return await analisisPage(params);
  });

  route('multi-agent', async () => {
    return await multiAgentPage();
  });

  // Protected - Laporan
  route('laporan', async (params) => {
    return await laporanPage(params);
  });

  // Protected - TODO
  route('todo', async () => {
    return await todoPage();
  });

  route('todo-detail', async (params) => {
    return await todoDetailPage(params);
  });

  // Protected - Executive
  route('executive', async () => {
    return await executivePage();
  });

  // Protected - Settings
  route('settings', async () => renderSettingsPage());

  // 404
  route('404', async () => placeholderPage({
    title: 'Halaman Tidak Ditemukan', icon: 'fa-map-signs',
    description: 'Halaman yang Anda tuju tidak ada.',
  }));
}

// ── Simple Settings Page ──────────────────────────────────────
function renderSettingsPage() {
  const user = getUserInfo();
  return `
    <div>
      <div class="page-header">
        <h1 class="page-title">Pengaturan</h1>
        <p class="page-subtitle">Konfigurasi akun dan sistem Smart AI Pengkaji SLF</p>
      </div>

      <div style="display:grid;grid-template-columns:280px 1fr;gap:var(--space-5)">
        <!-- Profil Card -->
        <div>
          <div class="card" style="text-align:center">
            ${user?.avatar
              ? `<img src="${user.avatar}" style="width:80px;height:80px;border-radius:50%;margin:0 auto var(--space-4);display:block;border:3px solid var(--brand-400)">`
              : `<div style="width:80px;height:80px;background:var(--gradient-brand);border-radius:50%;margin:0 auto var(--space-4);display:flex;align-items:center;justify-content:center;font-size:2rem;color:white;font-weight:700">${user?.initials || '?'}</div>`
            }
            <h3 style="font-weight:700;margin-bottom:4px">${user?.name || 'User'}</h3>
            <p class="text-sm text-tertiary">${user?.email || ''}</p>
            <span class="badge badge-proses" style="margin-top:8px">Admin</span>
          </div>

          <div class="card" style="margin-top:var(--space-4)">
            <div class="card-title" style="margin-bottom:var(--space-4)">Aksi Akun</div>
            <button class="btn btn-secondary w-full" style="margin-bottom:8px" onclick="window.navigate('dashboard')">
              <i class="fas fa-home"></i> Ke Dashboard
            </button>
            <button class="btn btn-danger w-full" onclick="window.doSignOut()">
              <i class="fas fa-right-from-bracket"></i> Keluar
            </button>
          </div>
        </div>

        <!-- Settings Content -->
        <div style="display:flex;flex-direction:column;gap:var(--space-4)">
          <!-- App Version -->
          <div class="card">
            <div class="card-title" style="margin-bottom:var(--space-4)">
              <i class="fas fa-circle-info" style="color:var(--brand-400);margin-right:8px"></i>
              Informasi Sistem
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-4)">
              ${[
                ['Nama Aplikasi', APP_CONFIG.name],
                ['Versi', APP_CONFIG.version],
                ['Domain Deploy', 'bangpupr.github.io/smartaipengkaji'],
                ['Database', 'Supabase PostgreSQL'],
                ['Authentication', 'Google OAuth 2.0'],
                ['AI Engine', 'Rule-based + Gemini AI'],
                ['Standar Acuan', 'SNI 9273:2025, ASCE/SEI 41-17'],
                ['Regulasi', 'PP No. 16 Tahun 2021'],
              ].map(([k, v]) => `
                <div style="background:var(--bg-elevated);border-radius:var(--radius-md);padding:var(--space-3) var(--space-4)">
                  <div class="text-xs text-tertiary">${k}</div>
                  <div class="text-sm font-semibold text-primary">${v}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Supabase Config Status -->
          <div class="card">
            <div class="card-title" style="margin-bottom:var(--space-4)">
              <i class="fas fa-database" style="color:var(--brand-400);margin-right:8px"></i>
              Konfigurasi Database
            </div>
            <div id="db-status">
              <div class="flex gap-3 align-items:center" style="margin-bottom:12px">
                <span class="badge badge-proses">Memeriksa koneksi...</span>
              </div>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="checkDBStatus()">
              <i class="fas fa-rotate"></i> Cek Koneksi
            </button>
          </div>

          <!-- Feature Flags -->
          <div class="card">
            <div class="card-title" style="margin-bottom:var(--space-4)">
              <i class="fas fa-toggle-on" style="color:var(--brand-400);margin-right:8px"></i>
              Feature Flags
            </div>
            <div style="display:flex;flex-direction:column;gap:12px">
              ${[
                { key: 'aiEnabled', label: 'AI Engine', desc: 'Analisis AI otomatis' },
                { key: 'gasIntegration', label: 'Google Workspace', desc: 'Integrasi Docs/Slides/Drive' },
              ].map(f => `
                <div style="display:flex;align-items:center;justify-content:space-between;padding:12px;background:var(--bg-elevated);border-radius:var(--radius-md)">
                  <div>
                    <div class="text-sm font-semibold text-primary">${f.label}</div>
                    <div class="text-xs text-tertiary">${f.desc}</div>
                  </div>
                  <span class="badge ${APP_CONFIG.features[f.key] ? 'badge-laik' : 'badge-tidak-laik'}">
                    ${APP_CONFIG.features[f.key] ? 'Aktif' : 'Nonaktif'}
                  </span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

window.doSignOut = async function() {
  const ok = await confirm({ title: 'Keluar', message: 'Yakin ingin keluar?', confirmText: 'Keluar', danger: true });
  if (!ok) return;
  try { await signOut(); showSuccess('Berhasil keluar.'); } catch { showError('Gagal keluar.'); }
};

window.checkDBStatus = async function() {
  const { supabase } = await import('./lib/supabase.js');
  const el = document.getElementById('db-status');
  if (!el) return;
  try {
    const { error } = await supabase.from('proyek').select('id').limit(1);
    el.innerHTML = error
      ? `<span class="badge badge-tidak-laik"><i class="fas fa-circle-xmark"></i> Koneksi gagal: ${error.message}</span>`
      : `<span class="badge badge-laik"><i class="fas fa-circle-check"></i> Terhubung ke Supabase</span>`;
  } catch (e) {
    el.innerHTML = `<span class="badge badge-tidak-laik">Gagal: ${e.message}</span>`;
  }
};

// ── App Bootstrap ─────────────────────────────────────────────
async function bootstrap() {
  updateProgress(20);

  // Register all routes
  registerRoutes();
  updateProgress(40);

  // Initialize auth
  const user = await initAuth();
  updateProgress(70);

  const appEl = document.getElementById('app');

  // Listen to auth changes - render layout when needed
  onAuthChange((user) => {
    if (user && !_initialized) {
      _initialized = true;
      // Render app shell
      renderAppShell(appEl);
      // Start router with page-root as mount point
      const pageRoot = getPageRoot();
      if (pageRoot) startRouter(pageRoot);
    } else if (!user) {
      _initialized = false;
      destroyAppShell(appEl);
      // Render login directly
      loginPage();
    }
  });

  // Listen to route changes to update layout
  window.addEventListener('route-changed', (e) => {
    onRouteChange(e.detail.path);
  });

  updateProgress(90);

  // If not authenticated at start, show login
  if (!user) {
    updateProgress(100);
    hideLoading();
    await loginPage();
    return;
  }

  // Authenticated: render app shell first then start router
  renderAppShell(appEl);
  const pageRoot = getPageRoot();
  if (pageRoot) {
    startRouter(pageRoot);
  }

  updateProgress(100);
  hideLoading();
}

// Start the app
bootstrap().catch(err => {
  console.error('[App] Bootstrap error:', err);
  document.getElementById('loading-screen')?.classList.add('hidden');
  document.getElementById('app').innerHTML = `
    <div style="display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:Inter,sans-serif;background:#0a0c12;color:#e2e8f0">
      <div style="text-align:center;padding:2rem">
        <div style="font-size:3rem;margin-bottom:1rem">⚠️</div>
        <h2 style="font-size:1.4rem;margin-bottom:0.5rem">Terjadi Kesalahan Sistem</h2>
        <p style="color:#718096;margin-bottom:1.5rem">${err.message}</p>
        <button onclick="location.reload()" style="background:linear-gradient(135deg,#3b5fd9,#7c5ce7);color:white;border:none;padding:10px 24px;border-radius:8px;cursor:pointer;font-size:0.9rem">
          Muat Ulang
        </button>
      </div>
    </div>
  `;
});
