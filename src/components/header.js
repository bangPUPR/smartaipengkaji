// ============================================================
//  HEADER COMPONENT
// ============================================================
import { navigate } from '../lib/router.js';
import { toggleMobileSidebar } from './sidebar.js';

const PAGE_TITLES = {
  dashboard:   { title: 'Dashboard',          icon: 'fa-gauge-high' },
  proyek:      { title: 'Daftar Proyek SLF',  icon: 'fa-folder-open' },
  'proyek-baru':{ title: 'Proyek Baru',       icon: 'fa-plus-circle' },
  'proyek-detail':{ title: 'Detail Proyek',   icon: 'fa-building' },
  checklist:   { title: 'Checklist Pemeriksaan', icon: 'fa-clipboard-check' },
  analisis:    { title: 'Analisis AI',         icon: 'fa-brain' },
  'multi-agent':{ title: 'Multi-Agent Analysis', icon: 'fa-network-wired' },
  laporan:     { title: 'Laporan Kajian SLF',  icon: 'fa-file-contract' },
  todo:        { title: 'TODO Board',           icon: 'fa-list-check' },
  executive:   { title: 'Executive Dashboard', icon: 'fa-chart-line' },
  settings:    { title: 'Pengaturan',           icon: 'fa-gear' },
};

export function renderHeader(route = 'dashboard') {
  const info = PAGE_TITLES[route] || { title: 'Smart AI SLF', icon: 'fa-building' };

  return `
    <header class="app-header" id="app-header">
      <div class="header-left">
        <!-- Mobile hamburger -->
        <button class="btn-icon" id="sidebar-toggle" aria-label="Toggle sidebar" style="display:none">
          <i class="fas fa-bars"></i>
        </button>

        <div>
          <div class="header-page-title">
            <i class="fas ${info.icon}" style="margin-right:8px;color:var(--brand-400)"></i>
            ${info.title}
          </div>
        </div>
      </div>

      <div class="header-right">
        <!-- Search -->
        <div class="header-search">
          <i class="fas fa-search search-icon"></i>
          <input type="text"
                 id="global-search"
                 placeholder="Cari proyek, dokumen..."
                 autocomplete="off" />
        </div>

        <!-- Quick Add -->
        <button class="btn btn-primary btn-sm" id="btn-quick-add">
          <i class="fas fa-plus"></i>
          <span>Baru</span>
        </button>

        <!-- Notifications -->
        <button class="btn-icon" id="btn-notif" aria-label="Notifikasi" title="Notifikasi">
          <i class="fas fa-bell"></i>
          <span class="notif-dot"></span>
        </button>

        <!-- AI Status -->
        <button class="btn-icon" id="btn-ai-status" title="AI Engine Status">
          <i class="fas fa-circle" style="color:var(--success-400);font-size:0.5rem"></i>
        </button>
      </div>
    </header>
  `;
}

export function bindHeaderEvents() {
  // Mobile sidebar toggle
  const toggleBtn = document.getElementById('sidebar-toggle');
  if (toggleBtn) {
    toggleBtn.style.display = window.innerWidth <= 768 ? 'flex' : 'none';
    toggleBtn.addEventListener('click', toggleMobileSidebar);
  }

  // Quick add
  document.getElementById('btn-quick-add')?.addEventListener('click', () => {
    navigate('proyek-baru');
  });

  // Global search
  const searchEl = document.getElementById('global-search');
  let debounceTimer;
  searchEl?.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const q = e.target.value.trim();
      if (q.length >= 2) {
        window.dispatchEvent(new CustomEvent('global-search', { detail: { q } }));
      }
    }, 350);
  });

  // Notifications placeholder
  document.getElementById('btn-notif')?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('open-notifications'));
  });
}

export function updateHeaderTitle(route) {
  const info = PAGE_TITLES[route] || { title: 'Smart AI SLF', icon: 'fa-building' };
  const el = document.querySelector('.header-page-title');
  if (el) {
    el.innerHTML = `<i class="fas ${info.icon}" style="margin-right:8px;color:var(--brand-400)"></i>${info.title}`;
  }
}
