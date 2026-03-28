// ============================================================
//  SIDEBAR COMPONENT
// ============================================================
import { navigate, getCurrentRoute } from '../lib/router.js';
import { getUserInfo, signOut } from '../lib/auth.js';
import { APP_CONFIG } from '../lib/config.js';
import { confirm } from './modal.js';
import { showSuccess, showError } from './toast.js';

const NAV_ITEMS = [
  { section: 'Utama' },
  { path: 'dashboard',    label: 'Dashboard',          icon: 'fa-gauge-high' },
  { path: 'proyek',       label: 'Proyek SLF',         icon: 'fa-folder-open' },
  { path: 'files',        label: 'Manajemen File',     icon: 'fa-folder-tree' },
  { path: 'checklist',    label: 'Checklist',           icon: 'fa-clipboard-check' },

  { section: 'Analisis' },
  { path: 'analisis',     label: 'Analisis AI',         icon: 'fa-brain', badge: 'Baru' },
  { path: 'multi-agent',  label: 'Multi-Agent',         icon: 'fa-network-wired' },
  { path: 'laporan',      label: 'Laporan SLF',         icon: 'fa-file-contract' },

  { section: 'Monitoring' },
  { path: 'todo',         label: 'TODO Board',          icon: 'fa-list-check' },
  { path: 'executive',    label: 'Executive Dashboard', icon: 'fa-chart-line' },

  { section: 'Sistem' },
  { path: 'settings',     label: 'Pengaturan',          icon: 'fa-gear' },
];

export function renderSidebar() {
  const user = getUserInfo();

  const navHtml = NAV_ITEMS.map(item => {
    if (item.section) {
      return `<div class="nav-section-label">${item.section}</div>`;
    }
    const active = getCurrentRoute() === item.path ? 'active' : '';
    const badge  = item.badge ? `<span class="nav-badge">${item.badge}</span>` : '';
    return `
      <a class="nav-item ${active}" data-route="${item.path}" role="button" tabindex="0">
        <i class="fas ${item.icon} nav-icon"></i>
        <span>${item.label}</span>
        ${badge}
      </a>
    `;
  }).join('');

  const avatarHtml = user?.avatar
    ? `<img src="${user.avatar}" style="width:32px;height:32px;border-radius:50%;object-fit:cover;" alt="avatar">`
    : `<div class="user-avatar">${user?.initials || '?'}</div>`;

  return `
    <aside class="sidebar" id="app-sidebar">
      <div class="sidebar-header">
        <div class="sidebar-logo"><i class="fas fa-building"></i></div>
        <div>
          <div class="sidebar-title">${APP_CONFIG.name.split(' ').slice(0,3).join(' ')}</div>
          <div class="sidebar-subtitle">v${APP_CONFIG.version}</div>
        </div>
      </div>

      <nav class="sidebar-nav" id="sidebar-nav">
        ${navHtml}
      </nav>

      <div class="sidebar-footer">
        <div class="user-card" id="user-card-btn" title="Klik untuk logout">
          ${avatarHtml}
          <div style="overflow:hidden">
            <div class="user-name truncate">${user?.name || 'User'}</div>
            <div class="user-role truncate">${user?.email || ''}</div>
          </div>
          <i class="fas fa-right-from-bracket" style="margin-left:auto;color:var(--text-tertiary);font-size:0.8rem;flex-shrink:0"></i>
        </div>
      </div>
    </aside>
  `;
}

export function bindSidebarEvents() {
  // Navigation clicks
  document.querySelectorAll('.nav-item[data-route]').forEach(el => {
    el.addEventListener('click', () => navigate(el.dataset.route));
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') navigate(el.dataset.route);
    });
  });

  // Logout
  document.getElementById('user-card-btn')?.addEventListener('click', async () => {
    const ok = await confirm({
      title: 'Keluar Akun',
      message: `Anda akan keluar dari akun <strong>${getUserInfo()?.email}</strong>. Lanjutkan?`,
      confirmText: 'Keluar',
      danger: true,
    });
    if (ok) {
      try {
        await signOut();
        showSuccess('Berhasil keluar.');
        navigate('login');
      } catch {
        showError('Gagal keluar. Coba lagi.');
      }
    }
  });
}

// Update active nav state
export function updateActiveNav(path) {
  document.querySelectorAll('.nav-item[data-route]').forEach(el => {
    el.classList.toggle('active', el.dataset.route === path);
  });
}

// Mobile sidebar toggle
export function toggleMobileSidebar() {
  document.getElementById('app-sidebar')?.classList.toggle('open');
}
