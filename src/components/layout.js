// ============================================================
//  APP LAYOUT COMPONENT
//  Wraps sidebar + header + main content
// ============================================================
import { renderSidebar, bindSidebarEvents, updateActiveNav } from './sidebar.js';
import { renderHeader, bindHeaderEvents, updateHeaderTitle } from './header.js';

let _layoutInitialized = false;

/**
 * Render the full app shell (sidebar + header + content slot)
 * Called once when user is authenticated.
 */
export function renderAppShell(appEl) {
  if (_layoutInitialized) return;
  _layoutInitialized = true;

  appEl.innerHTML = `
    <div class="app-layout" id="app-layout">
      ${renderSidebar()}
      ${renderHeader('dashboard')}
      <main class="main-content" id="main-content">
        <div class="page-container" id="page-root">
          <!-- Page content rendered here by router -->
        </div>
      </main>
    </div>
  `;

  bindSidebarEvents();
  bindHeaderEvents();
}

/**
 * Get the page root element (where router injects page content)
 */
export function getPageRoot() {
  return document.getElementById('page-root');
}

/**
 * Update layout for route change (active nav + header title)
 */
export function onRouteChange(path) {
  updateActiveNav(path);
  updateHeaderTitle(path);
  // Scroll main content to top
  document.getElementById('main-content')?.scrollTo(0, 0);
}

/**
 * Destroy app shell (used when user logs out)
 */
export function destroyAppShell(appEl) {
  _layoutInitialized = false;
  appEl.innerHTML = '';
}
