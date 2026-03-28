const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/supabase-Cc4bjHTr.js","assets/rolldown-runtime-lhHHWwHU.js"])))=>i.map(i=>d[i]);
import{t as e}from"./rolldown-runtime-lhHHWwHU.js";import{t}from"./supabase-Cc4bjHTr.js";(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var n={name:`Smart AI Pengkaji SLF`,version:`1.0.0`,baseUrl:``,base:`/smartaipengkaji`,gasApiUrl:``,features:{aiEnabled:!0,gasIntegration:!1},statusSLF:[{value:`LAIK_FUNGSI`,label:`Laik Fungsi`,badge:`badge-laik`},{value:`LAIK_FUNGSI_BERSYARAT`,label:`Laik Fungsi Bersyarat`,badge:`badge-bersyarat`},{value:`TIDAK_LAIK_FUNGSI`,label:`Tidak Laik Fungsi`,badge:`badge-tidak-laik`},{value:`DALAM_PENGKAJIAN`,label:`Dalam Pengkajian`,badge:`badge-proses`}],riskLevels:[{value:`low`,label:`Rendah`,badge:`badge-low`},{value:`medium`,label:`Sedang`,badge:`badge-medium`},{value:`high`,label:`Tinggi`,badge:`badge-high`},{value:`critical`,label:`Kritis`,badge:`badge-critical`}],roles:{admin:`Admin`,pemeriksa:`Pemeriksa`,reviewer:`Reviewer`,viewer:`Viewer`},aspekSLF:[{id:`administrasi`,name:`Administrasi`,icon:`fa-clipboard-list`,color:`kpi-blue`},{id:`arsitektur`,name:`Arsitektur`,icon:`fa-drafting-compass`,color:`kpi-purple`},{id:`struktur`,name:`Struktur`,icon:`fa-building`,color:`kpi-red`},{id:`mep`,name:`MEP / Utilitas`,icon:`fa-bolt`,color:`kpi-yellow`},{id:`keselamatan`,name:`Keselamatan Kebakaran`,icon:`fa-fire-extinguisher`,color:`kpi-red`},{id:`kesehatan`,name:`Kesehatan`,icon:`fa-heart-pulse`,color:`kpi-green`},{id:`kenyamanan`,name:`Kenyamanan`,icon:`fa-sun`,color:`kpi-yellow`},{id:`kemudahan`,name:`Kemudahan`,icon:`fa-universal-access`,color:`kpi-cyan`}]},r=null,i=new Set;function a(e){i.forEach(t=>t(e))}async function o(){t.auth.onAuthStateChange((e,t)=>{r=t?.user||null,a(r)});let{data:{session:e}}=await t.auth.getSession();return r=e?.user||null,r}function s(e){return i.add(e),e(r),()=>i.delete(e)}async function c(){let e=`${window.location.origin}${n.base}/`,{data:r,error:i}=await t.auth.signInWithOAuth({provider:`google`,options:{redirectTo:e,queryParams:{access_type:`offline`,prompt:`consent`}}});if(i)throw i;return r}async function l(){let{error:e}=await t.auth.signOut();if(e)throw e;r=null,a(null)}function u(){return!!r}function d(){if(!r)return null;let e=r.user_metadata||{};return{id:r.id,email:r.email,name:e.full_name||e.name||r.email?.split(`@`)[0]||`User`,avatar:e.avatar_url||e.picture||null,initials:f(e.full_name||e.name||r.email)}}function f(e=``){return e.split(` `).slice(0,2).map(e=>e[0]?.toUpperCase()).join(``)||`?`}var p=new Map,ee=null,m=null,te=new Set([`login`]);function h(e,t){p.set(e,t)}function g(e,t={}){let n=new URLSearchParams(t).toString(),r=n?`#/${e}?${n}`:`#/${e}`;window.location.hash=r}function ne(){let[e,t]=window.location.hash.slice(1).split(`?`),n={};return t&&new URLSearchParams(t).forEach((e,t)=>{n[t]=e}),n}function re(){return ee}function ie(){return(window.location.hash.slice(2)||``).split(`?`)[0]||`dashboard`}function _(e){async function t(){let t=ie();if(ee=t,!te.has(t)&&!u()){g(`login`);return}if(t===`login`&&u()){g(`dashboard`);return}if(m&&await m(t)===!1)return;let n=p.get(t)||p.get(`404`);if(!n){e.innerHTML=ae();return}try{let r=await n(ne());typeof r==`string`?e.innerHTML=r:r instanceof HTMLElement&&(e.innerHTML=``,e.appendChild(r)),window.scrollTo(0,0),window.dispatchEvent(new CustomEvent(`route-changed`,{detail:{path:t}}))}catch(n){console.error(`[Router] Error rendering route "${t}":`,n),e.innerHTML=oe(n)}}return window.addEventListener(`hashchange`,t),t(),()=>window.removeEventListener(`hashchange`,t)}function ae(){return`
    <div class="empty-state" style="min-height:100vh">
      <div class="empty-icon"><i class="fas fa-map-signs"></i></div>
      <h2 class="empty-title">Halaman Tidak Ditemukan</h2>
      <p class="empty-desc">Route yang Anda tuju tidak tersedia.</p>
      <button class="btn btn-primary mt-4" onclick="navigate('dashboard')">
        <i class="fas fa-home"></i> Kembali ke Dashboard
      </button>
    </div>
  `}function oe(e){return`
    <div class="empty-state" style="min-height:100vh">
      <div class="empty-icon" style="color:var(--danger-400)"><i class="fas fa-triangle-exclamation"></i></div>
      <h2 class="empty-title">Terjadi Kesalahan</h2>
      <p class="empty-desc">${e.message}</p>
      <button class="btn btn-secondary mt-4" onclick="window.location.reload()">
        <i class="fas fa-rotate"></i> Muat Ulang
      </button>
    </div>
  `}var v=null;function se({title:e=``,body:t=``,footer:n=``,size:r=`md`,onClose:i}={}){y();let a={sm:`400px`,md:`520px`,lg:`720px`,xl:`900px`},o=document.createElement(`div`);return o.className=`modal-overlay`,o.innerHTML=`
    <div class="modal" style="max-width:${a[r]||a.md}">
      <div class="modal-header">
        <h3 class="modal-title">${e}</h3>
        <button class="modal-close" id="modal-close-btn">
          <i class="fas fa-xmark"></i>
        </button>
      </div>
      <div class="modal-body">${t}</div>
      ${n?`<div class="modal-footer">${n}</div>`:``}
    </div>
  `,document.body.appendChild(o),v=o,requestAnimationFrame(()=>o.classList.add(`open`)),o.querySelector(`#modal-close-btn`).addEventListener(`click`,()=>{y(),i?.()}),o.addEventListener(`click`,e=>{e.target===o&&(y(),i?.())}),document.addEventListener(`keydown`,e=>{e.key===`Escape`&&(y(),i?.())},{once:!0}),o}function y(){v&&=(v.classList.remove(`open`),v.addEventListener(`transitionend`,()=>v?.remove(),{once:!0}),null)}function b({title:e=`Konfirmasi`,message:t=`Apakah Anda yakin?`,confirmText:n=`Ya`,danger:r=!1}={}){return new Promise(i=>{se({title:e,body:`<p style="color:var(--text-secondary)">${t}</p>`,footer:`
        <button class="btn btn-secondary" id="confirm-cancel">Batal</button>
        <button class="btn ${r?`btn-danger`:`btn-primary`}" id="confirm-ok">${n}</button>
      `,onClose:()=>i(!1)}),document.getElementById(`confirm-cancel`)?.addEventListener(`click`,()=>{y(),i(!1)}),document.getElementById(`confirm-ok`)?.addEventListener(`click`,()=>{y(),i(!0)})})}var x=null;function ce(){return x||(x=document.createElement(`div`),x.className=`toast-container`,document.body.appendChild(x)),x}var S={success:`fa-circle-check`,error:`fa-circle-xmark`,warning:`fa-triangle-exclamation`,info:`fa-circle-info`};function C(e,t=`info`,n=3500){let r=ce(),i=document.createElement(`div`);i.className=`toast toast-${t}`,i.innerHTML=`
    <div class="toast-icon"><i class="fas ${S[t]||S.info}"></i></div>
    <div>
      <div class="toast-title">${ue(t)}</div>
      <div class="toast-msg">${e}</div>
    </div>
    <button onclick="this.closest('.toast').remove()"
            style="margin-left:auto;background:none;border:none;cursor:pointer;color:var(--text-tertiary);font-size:0.8rem;align-self:flex-start;">
      <i class="fas fa-xmark"></i>
    </button>
  `,r.appendChild(i),requestAnimationFrame(()=>i.classList.add(`show`)),setTimeout(()=>{i.classList.add(`hide`),i.addEventListener(`transitionend`,()=>i.remove(),{once:!0})},n)}var w=e=>C(e,`success`),T=e=>C(e,`error`),le=e=>C(e,`info`);function ue(e){return e.charAt(0).toUpperCase()+e.slice(1)}var de=[{section:`Utama`},{path:`dashboard`,label:`Dashboard`,icon:`fa-gauge-high`},{path:`proyek`,label:`Proyek SLF`,icon:`fa-folder-open`},{path:`checklist`,label:`Checklist`,icon:`fa-clipboard-check`},{section:`Analisis`},{path:`analisis`,label:`Analisis AI`,icon:`fa-brain`,badge:`Baru`},{path:`multi-agent`,label:`Multi-Agent`,icon:`fa-network-wired`},{path:`laporan`,label:`Laporan SLF`,icon:`fa-file-contract`},{section:`Monitoring`},{path:`todo`,label:`TODO Board`,icon:`fa-list-check`},{path:`executive`,label:`Executive Dashboard`,icon:`fa-chart-line`},{section:`Sistem`},{path:`settings`,label:`Pengaturan`,icon:`fa-gear`}];function fe(){let e=d(),t=de.map(e=>{if(e.section)return`<div class="nav-section-label">${e.section}</div>`;let t=re()===e.path?`active`:``,n=e.badge?`<span class="nav-badge">${e.badge}</span>`:``;return`
      <a class="nav-item ${t}" data-route="${e.path}" role="button" tabindex="0">
        <i class="fas ${e.icon} nav-icon"></i>
        <span>${e.label}</span>
        ${n}
      </a>
    `}).join(``),r=e?.avatar?`<img src="${e.avatar}" style="width:32px;height:32px;border-radius:50%;object-fit:cover;" alt="avatar">`:`<div class="user-avatar">${e?.initials||`?`}</div>`;return`
    <aside class="sidebar" id="app-sidebar">
      <div class="sidebar-header">
        <div class="sidebar-logo"><i class="fas fa-building"></i></div>
        <div>
          <div class="sidebar-title">${n.name.split(` `).slice(0,3).join(` `)}</div>
          <div class="sidebar-subtitle">v${n.version}</div>
        </div>
      </div>

      <nav class="sidebar-nav" id="sidebar-nav">
        ${t}
      </nav>

      <div class="sidebar-footer">
        <div class="user-card" id="user-card-btn" title="Klik untuk logout">
          ${r}
          <div style="overflow:hidden">
            <div class="user-name truncate">${e?.name||`User`}</div>
            <div class="user-role truncate">${e?.email||``}</div>
          </div>
          <i class="fas fa-right-from-bracket" style="margin-left:auto;color:var(--text-tertiary);font-size:0.8rem;flex-shrink:0"></i>
        </div>
      </div>
    </aside>
  `}function pe(){document.querySelectorAll(`.nav-item[data-route]`).forEach(e=>{e.addEventListener(`click`,()=>g(e.dataset.route)),e.addEventListener(`keydown`,t=>{(t.key===`Enter`||t.key===` `)&&g(e.dataset.route)})}),document.getElementById(`user-card-btn`)?.addEventListener(`click`,async()=>{if(await b({title:`Keluar Akun`,message:`Anda akan keluar dari akun <strong>${d()?.email}</strong>. Lanjutkan?`,confirmText:`Keluar`,danger:!0}))try{await l(),w(`Berhasil keluar.`),g(`login`)}catch{T(`Gagal keluar. Coba lagi.`)}})}function me(e){document.querySelectorAll(`.nav-item[data-route]`).forEach(t=>{t.classList.toggle(`active`,t.dataset.route===e)})}function he(){document.getElementById(`app-sidebar`)?.classList.toggle(`open`)}var ge={dashboard:{title:`Dashboard`,icon:`fa-gauge-high`},proyek:{title:`Daftar Proyek SLF`,icon:`fa-folder-open`},"proyek-baru":{title:`Proyek Baru`,icon:`fa-plus-circle`},"proyek-detail":{title:`Detail Proyek`,icon:`fa-building`},checklist:{title:`Checklist Pemeriksaan`,icon:`fa-clipboard-check`},analisis:{title:`Analisis AI`,icon:`fa-brain`},"multi-agent":{title:`Multi-Agent Analysis`,icon:`fa-network-wired`},laporan:{title:`Laporan Kajian SLF`,icon:`fa-file-contract`},todo:{title:`TODO Board`,icon:`fa-list-check`},executive:{title:`Executive Dashboard`,icon:`fa-chart-line`},settings:{title:`Pengaturan`,icon:`fa-gear`}};function _e(e=`dashboard`){let t=ge[e]||{title:`Smart AI SLF`,icon:`fa-building`};return`
    <header class="app-header" id="app-header">
      <div class="header-left">
        <!-- Mobile hamburger -->
        <button class="btn-icon" id="sidebar-toggle" aria-label="Toggle sidebar" style="display:none">
          <i class="fas fa-bars"></i>
        </button>

        <div>
          <div class="header-page-title">
            <i class="fas ${t.icon}" style="margin-right:8px;color:var(--brand-400)"></i>
            ${t.title}
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
  `}function ve(){let e=document.getElementById(`sidebar-toggle`);e&&(e.style.display=window.innerWidth<=768?`flex`:`none`,e.addEventListener(`click`,he)),document.getElementById(`btn-quick-add`)?.addEventListener(`click`,()=>{g(`proyek-baru`)});let t=document.getElementById(`global-search`),n;t?.addEventListener(`input`,e=>{clearTimeout(n),n=setTimeout(()=>{let t=e.target.value.trim();t.length>=2&&window.dispatchEvent(new CustomEvent(`global-search`,{detail:{q:t}}))},350)}),document.getElementById(`btn-notif`)?.addEventListener(`click`,()=>{window.dispatchEvent(new CustomEvent(`open-notifications`))})}function ye(e){let t=ge[e]||{title:`Smart AI SLF`,icon:`fa-building`},n=document.querySelector(`.header-page-title`);n&&(n.innerHTML=`<i class="fas ${t.icon}" style="margin-right:8px;color:var(--brand-400)"></i>${t.title}`)}var E=!1;function D(e){E||(E=!0,e.innerHTML=`
    <div class="app-layout" id="app-layout">
      ${fe()}
      ${_e(`dashboard`)}
      <main class="main-content" id="main-content">
        <div class="page-container" id="page-root">
          <!-- Page content rendered here by router -->
        </div>
      </main>
    </div>
  `,pe(),ve())}function O(){return document.getElementById(`page-root`)}function be(e){me(e),ye(e),document.getElementById(`main-content`)?.scrollTo(0,0)}function xe(e){E=!1,e.innerHTML=``}async function k(){let e=[{icon:`fa-brain`,text:`AI Engine terintegrasi (SNI 9273:2025, ASCE 41-17)`},{icon:`fa-shield-halved`,text:`Penilaian Laik Fungsi otomatis berbasis standar`},{icon:`fa-file-contract`,text:`Laporan kajian SLF profesional otomatis`},{icon:`fa-chart-line`,text:`Dashboard analitik & executive report`},{icon:`fa-database`,text:`Database terintegrasi Google Workspace`}],t=new Date().getFullYear(),r=`
    <div class="auth-page" id="login-page">
      <!-- Visual Side -->
      <div class="auth-visual">
        <div class="auth-visual-content">
          <div class="auth-logo-big">
            <i class="fas fa-building"></i>
          </div>
          <h1 class="auth-visual-title">Smart AI Konsultan<br>Pengkaji SLF</h1>
          <p class="auth-visual-subtitle">
            Sistem berbasis AI untuk pengkajian teknis bangunan gedung
            sesuai standar NSPK, SNI, dan ASCE/SEI
          </p>

          <div class="auth-features">
            ${e.map(e=>`
              <div class="auth-feature-item">
                <i class="fas ${e.icon}"></i>
                <span>${e.text}</span>
              </div>
            `).join(``)}
          </div>

          <!-- Standards badges -->
          <div style="display:flex;gap:8px;margin-top:32px;flex-wrap:wrap;justify-content:center">
            ${[`PP No. 16/2021`,`SNI 9273:2025`,`ASCE/SEI 41-17`,`NSPK`].map(e=>`
              <span style="background:hsla(220,70%,48%,0.15);border:1px solid hsla(220,70%,48%,0.3);color:var(--brand-400);padding:4px 10px;border-radius:var(--radius-full);font-size:0.72rem;font-weight:600">
                ${e}
              </span>
            `).join(``)}
          </div>
        </div>
      </div>

      <!-- Form Side -->
      <div class="auth-form-panel">
        <div class="auth-form-wrap">
          <h2 class="auth-form-title">Selamat Datang</h2>
          <p class="auth-form-subtitle">
            Masuk ke sistem Smart AI Pengkaji SLF menggunakan akun Google Anda.
          </p>

          <!-- Google Sign In Button -->
          <button class="btn-google" id="btn-google-signin" type="button">
            <svg class="google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Masuk dengan Google
          </button>

          <div class="auth-divider"><span>atau</span></div>

          <!-- Email/Password placeholder (coming soon) -->
          <div style="background:var(--bg-card);border:1px solid var(--border-subtle);border-radius:var(--radius-md);padding:16px;text-align:center">
            <i class="fas fa-lock" style="color:var(--text-disabled);margin-bottom:8px"></i>
            <p style="color:var(--text-tertiary);font-size:0.8rem">
              Login email/password akan tersedia setelah setup Supabase Auth
            </p>
          </div>

          <div class="auth-disclaimer">
            Dengan masuk, Anda menyetujui Syarat & Ketentuan penggunaan sistem.<br>
            &copy; ${t} Smart AI Pengkaji SLF &bullet; v${n.version}
          </div>
        </div>
      </div>
    </div>
  `;document.body.innerHTML=r,document.getElementById(`btn-google-signin`)?.addEventListener(`click`,Se)}async function Se(){let e=document.getElementById(`btn-google-signin`);if(e){e.disabled=!0,e.innerHTML=`
    <i class="fas fa-circle-notch fa-spin"></i>
    Menghubungkan ke Google...
  `;try{le(`Membuka jendela login Google...`),await c()}catch(t){console.error(`[Login] Google sign-in error:`,t),T(`Gagal masuk dengan Google. `+(t.message||`Periksa koneksi Anda.`)),e.disabled=!1,e.innerHTML=`
      <svg class="google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
      Masuk dengan Google
    `}}}var Ce=e({dashboardPage:()=>A});async function A(){let e=ke(),t=document.getElementById(`page-root`);t&&(t.innerHTML=e);let[n,r,i]=await Promise.all([Ae(),je(),Me()]),a=d(),o=new Date;return`
    <div id="dashboard-page">
      <!-- Page Header -->
      <div class="page-header">
        <div class="flex-between">
          <div>
            <h1 class="page-title">${Ne(o.getHours())}, ${a?.name?.split(` `)[0]||`User`}! 👋</h1>
            <p class="page-subtitle">Monitoring pengkajian SLF &bull; ${Pe(o)}</p>
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
        ${we(n)}
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
            ${Te(n)}
          </div>

          <!-- SLF Status Summary -->
          <div class="card">
            <div class="card-header">
              <div class="card-title">Status SLF</div>
              <button class="btn btn-ghost btn-sm" onclick="window.navigate('proyek')">
                Lihat Semua →
              </button>
            </div>
            ${Ee(n)}
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
              <div class="card-subtitle">${r.length} dari ${n.totalProyek||0} proyek</div>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="window.navigate('proyek')">
              Semua Proyek
            </button>
          </div>
          ${De(r)}
        </div>

        <!-- TODO Monitoring -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">TODO Monitoring</div>
            <button class="btn btn-ghost btn-sm" onclick="window.navigate('todo')">
              Lihat Semua →
            </button>
          </div>
          ${Oe(i)}
        </div>
      </div>
    </div>
  `}function we(e){return[{label:`Total Proyek`,value:e.totalProyek||0,icon:`fa-folder-open`,color:`kpi-blue`,trend:null},{label:`Proyek Aktif`,value:e.proyekAktif||0,icon:`fa-play-circle`,color:`kpi-green`,trend:null},{label:`Laik Fungsi`,value:e.laikFungsi||0,icon:`fa-circle-check`,color:`kpi-green`,trend:`+2`},{label:`Laik Bersyarat`,value:e.laikBersyarat||0,icon:`fa-triangle-exclamation`,color:`kpi-yellow`,trend:null},{label:`Tidak Laik`,value:e.tidakLaik||0,icon:`fa-circle-xmark`,color:`kpi-red`,trend:null},{label:`Task Selesai`,value:e.taskSelesai||0,icon:`fa-check-double`,color:`kpi-purple`,trend:`+5`},{label:`Task Terlambat`,value:e.taskTerlambat||0,icon:`fa-clock`,color:`kpi-red`,trend:null},{label:`Analisis AI`,value:e.totalAnalisis||0,icon:`fa-brain`,color:`kpi-purple`,trend:null}].map(e=>`
    <div class="kpi-card" onclick="window.navigate('proyek')">
      <div class="kpi-icon-wrap ${e.color}">
        <i class="fas ${e.icon}"></i>
      </div>
      <div class="kpi-value" style="color:inherit">${e.value}</div>
      <div class="kpi-label">${e.label}</div>
      ${e.trend?`<div class="kpi-trend up"><i class="fas fa-arrow-trend-up"></i> ${e.trend} bulan ini</div>`:``}
    </div>
  `).join(``)}function Te(e){let t=e.totalProyek||0,n=e.laikFungsi||0,r=t>0?Math.round(n/t*100):0,i=[];return e.taskTerlambat>0&&i.push({type:`critical`,text:`${e.taskTerlambat} task melewati batas waktu. Tindak segera.`}),e.tidakLaik>0&&i.push({type:`warning`,text:`${e.tidakLaik} bangunan berstatus Tidak Laik Fungsi — perlu rehabilitasi.`}),i.push({type:`success`,text:`Tingkat kelulusan SLF: ${r}% dari total proyek.`}),e.proyekAktif>0&&i.push({type:``,text:`${e.proyekAktif} proyek sedang dalam proses pengkajian.`}),i.length?i.slice(0,4).map(e=>`
    <div class="ai-finding ${e.type}">
      <i class="fas ${e.type===`critical`?`fa-triangle-exclamation`:e.type===`warning`?`fa-exclamation`:e.type===`success`?`fa-circle-check`:`fa-circle-info`}" style="margin-right:6px"></i>
      ${e.text}
    </div>
  `).join(``):`<div class="ai-finding">Belum ada data proyek untuk dianalisis.</div>`}function Ee(e){let t=[{label:`Laik Fungsi`,value:e.laikFungsi||0,cls:`kpi-green`,bar:`green`},{label:`Laik Bersyarat`,value:e.laikBersyarat||0,cls:`kpi-yellow`,bar:`yellow`},{label:`Tidak Laik`,value:e.tidakLaik||0,cls:`kpi-red`,bar:`red`},{label:`Dalam Pengkajian`,value:e.proyekAktif||0,cls:`kpi-blue`,bar:`blue`}],n=t.reduce((e,t)=>e+t.value,0)||1;return`<div style="display:flex;flex-direction:column;gap:10px">
    ${t.map(e=>`
      <div>
        <div class="flex-between mb-1">
          <span class="text-sm text-secondary">${e.label}</span>
          <span class="text-sm font-semibold text-primary">${e.value}</span>
        </div>
        <div class="progress-wrap">
          <div class="progress-fill ${e.bar}" style="width:${Math.round(e.value/n*100)}%"></div>
        </div>
      </div>
    `).join(``)}
  </div>`}function De(e){if(!e.length)return`<div class="empty-state"><div class="empty-icon"><i class="fas fa-folder-open"></i></div><p class="empty-title">Belum ada proyek</p><button class="btn btn-primary mt-4" onclick="window.navigate('proyek-baru')"><i class="fas fa-plus"></i> Buat Proyek</button></div>`;let t={LAIK_FUNGSI:{label:`Laik Fungsi`,cls:`badge-laik`},LAIK_FUNGSI_BERSYARAT:{label:`Laik Bersyarat`,cls:`badge-bersyarat`},TIDAK_LAIK_FUNGSI:{label:`Tidak Laik`,cls:`badge-tidak-laik`},DALAM_PENGKAJIAN:{label:`Dalam Pengkajian`,cls:`badge-proses`}};return`
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
          ${e.map(e=>{let n=t[e.status_slf]||{label:e.status_slf,cls:`badge-proses`},r=e.progress||0;return`
              <tr style="cursor:pointer" onclick="window.navigate('proyek-detail', { id: '${e.id}' })">
                <td>
                  <div class="font-semibold text-primary truncate" style="max-width:180px">${e.nama_bangunan||`-`}</div>
                  <div class="text-xs text-tertiary truncate" style="max-width:180px">${e.alamat||``}</div>
                </td>
                <td class="text-secondary truncate" style="max-width:120px">${e.pemilik||`-`}</td>
                <td style="min-width:100px">
                  <div class="flex-between mb-1">
                    <span class="text-xs text-tertiary">${r}%</span>
                  </div>
                  <div class="progress-wrap">
                    <div class="progress-fill ${r>=80?`green`:r>=40?`blue`:`yellow`}" style="width:${r}%"></div>
                  </div>
                </td>
                <td><span class="badge ${n.cls}">${n.label}</span></td>
                <td>
                  <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();window.navigate('proyek-detail', {id:'${e.id}'})">
                    <i class="fas fa-arrow-right"></i>
                  </button>
                </td>
              </tr>
            `}).join(``)}
        </tbody>
      </table>
    </div>
  `}function Oe(e){if(!e.length)return`<div class="empty-state"><div class="empty-icon"><i class="fas fa-list-check"></i></div><p class="empty-title">Tidak ada task</p></div>`;let t={critical:`badge-critical`,high:`badge-high`,medium:`badge-medium`,low:`badge-low`};return`<div style="display:flex;flex-direction:column;gap:8px">
    ${e.slice(0,8).map(e=>`
      <div style="background:var(--bg-elevated);border:1px solid var(--border-subtle);border-radius:var(--radius-md);padding:10px 12px;display:flex;align-items:center;gap:10px;cursor:pointer;transition:all var(--transition-fast)"
           onmouseenter="this.style.borderColor='var(--border-default)'"
           onmouseleave="this.style.borderColor='var(--border-subtle)'"
           onclick="window.navigate('todo-detail', {id:'${e.id}'})">
        <div style="width:3px;height:36px;border-radius:2px;background:${e.priority===`critical`?`var(--danger-400)`:e.priority===`high`?`var(--warning-400)`:`var(--brand-400)`};flex-shrink:0"></div>
        <div style="flex:1;overflow:hidden">
          <div class="text-sm font-semibold text-primary truncate">${e.judul||e.title||`-`}</div>
          <div class="text-xs text-tertiary truncate">${e.proyek_nama||`Umum`}</div>
        </div>
        <span class="badge ${t[e.priority]||`badge-medium`}" style="font-size:0.65rem">${e.priority||`medium`}</span>
      </div>
    `).join(``)}
  </div>`}function ke(){return`
    <div class="page-header">
      <div class="skeleton" style="height:36px;width:300px;margin-bottom:8px"></div>
      <div class="skeleton" style="height:20px;width:200px"></div>
    </div>
    <div class="kpi-grid">
      ${Array(8).fill(0).map(()=>`
        <div class="kpi-card">
          <div class="skeleton" style="height:44px;width:44px;border-radius:10px;margin-bottom:12px"></div>
          <div class="skeleton" style="height:40px;width:60px;margin-bottom:8px"></div>
          <div class="skeleton" style="height:16px;width:100px"></div>
        </div>
      `).join(``)}
    </div>
  `}async function Ae(){try{let[{count:e},{count:n},{count:r},{count:i},{count:a},{count:o},{count:s},{count:c}]=await Promise.all([t.from(`proyek`).select(`*`,{count:`exact`,head:!0}),t.from(`proyek`).select(`*`,{count:`exact`,head:!0}).eq(`status_slf`,`DALAM_PENGKAJIAN`),t.from(`proyek`).select(`*`,{count:`exact`,head:!0}).eq(`status_slf`,`LAIK_FUNGSI`),t.from(`proyek`).select(`*`,{count:`exact`,head:!0}).eq(`status_slf`,`LAIK_FUNGSI_BERSYARAT`),t.from(`proyek`).select(`*`,{count:`exact`,head:!0}).eq(`status_slf`,`TIDAK_LAIK_FUNGSI`),t.from(`todo_tasks`).select(`*`,{count:`exact`,head:!0}).eq(`status`,`Done`),t.from(`todo_tasks`).select(`*`,{count:`exact`,head:!0}).lt(`due_date`,new Date().toISOString()).neq(`status`,`Done`),t.from(`hasil_analisis`).select(`*`,{count:`exact`,head:!0})]);return{totalProyek:e,proyekAktif:n,laikFungsi:r,laikBersyarat:i,tidakLaik:a,taskSelesai:o,taskTerlambat:s,totalAnalisis:c}}catch{return{totalProyek:0,proyekAktif:0,laikFungsi:0,laikBersyarat:0,tidakLaik:0,taskSelesai:0,taskTerlambat:0,totalAnalisis:0}}}async function je(){try{let{data:e}=await t.from(`proyek`).select(`id, nama_bangunan, alamat, pemilik, status_slf, progress, updated_at`).order(`updated_at`,{ascending:!1}).limit(6);return e||[]}catch{return[]}}async function Me(){try{let{data:e}=await t.from(`todo_tasks`).select(`id, judul, title, priority, status, due_date, proyek_nama`).neq(`status`,`Done`).order(`priority`,{ascending:!1}).limit(8);return e||[]}catch{return[]}}function Ne(e){return e<11?`Selamat Pagi`:e<15?`Selamat Siang`:e<18?`Selamat Sore`:`Selamat Malam`}function Pe(e){return e.toLocaleDateString(`id-ID`,{weekday:`long`,day:`numeric`,month:`long`,year:`numeric`})}window.navigate=g,window.refreshCharts=()=>window.location.reload();async function Fe(){return`
    <div id="proyek-list-page">
      <div class="page-header flex-between">
        <div>
          <h1 class="page-title">Daftar Proyek SLF</h1>
          <p class="page-subtitle">Kelola seluruh proyek pengkajian Sertifikat Laik Fungsi</p>
        </div>
        <div class="flex gap-3">
          <button class="btn btn-secondary" onclick="exportProyek()">
            <i class="fas fa-file-export"></i> Export
          </button>
          <button class="btn btn-primary" onclick="window.navigate('proyek-baru')">
            <i class="fas fa-plus"></i> Proyek Baru
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="card" style="padding:var(--space-4);margin-bottom:var(--space-5)">
        <div style="display:grid;grid-template-columns:1fr auto auto auto;gap:var(--space-3);align-items:center">
          <div style="position:relative">
            <i class="fas fa-search" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--text-tertiary);font-size:0.8rem"></i>
            <input type="text" id="search-proyek" class="form-input" placeholder="Cari nama bangunan, pemilik, alamat..."
                   style="padding-left:36px" oninput="filterProyek(this.value)" />
          </div>
          <select class="form-select" id="filter-status" onchange="filterProyek()" style="width:180px">
            <option value="">Semua Status</option>
            <option value="DALAM_PENGKAJIAN">Dalam Pengkajian</option>
            <option value="LAIK_FUNGSI">Laik Fungsi</option>
            <option value="LAIK_FUNGSI_BERSYARAT">Laik Bersyarat</option>
            <option value="TIDAK_LAIK_FUNGSI">Tidak Laik Fungsi</option>
          </select>
          <select class="form-select" id="filter-sort" onchange="sortProyek(this.value)" style="width:160px">
            <option value="updated_at">Terbaru</option>
            <option value="nama_bangunan">Nama A-Z</option>
            <option value="status_slf">Status</option>
          </select>
          <div id="proyek-count" class="text-sm text-tertiary"></div>
        </div>
      </div>

      <!-- Loading -->
      <div id="proyek-loading">
        ${[,,,,,].fill(0).map(()=>`
          <div class="card" style="margin-bottom:12px;display:flex;gap:16px;padding:20px">
            <div class="skeleton" style="width:48px;height:48px;border-radius:10px;flex-shrink:0"></div>
            <div style="flex:1">
              <div class="skeleton" style="height:20px;width:60%;margin-bottom:8px"></div>
              <div class="skeleton" style="height:16px;width:40%"></div>
            </div>
          </div>
        `).join(``)}
      </div>

      <!-- Proyek Cards -->
      <div id="proyek-list-container"></div>
    </div>
  `}async function Ie(){await Le()}var j=[];async function Le(){try{let{data:e,error:n}=await t.from(`proyek`).select(`*`).order(`updated_at`,{ascending:!1});if(n)throw n;j=e||[],M(j)}catch(e){T(`Gagal memuat data proyek: `+e.message),document.getElementById(`proyek-loading`).innerHTML=`
      <div class="empty-state">
        <div class="empty-icon"><i class="fas fa-triangle-exclamation"></i></div>
        <p class="empty-title">Gagal memuat proyek</p>
        <p class="empty-desc">${e.message}</p>
        <button class="btn btn-secondary mt-4" onclick="location.reload()">Coba Lagi</button>
      </div>
    `}}function M(e){let t=document.getElementById(`proyek-loading`),n=document.getElementById(`proyek-list-container`),r=document.getElementById(`proyek-count`);if(t&&(t.style.display=`none`),r&&(r.textContent=`${e.length} proyek`),!n)return;if(!e.length){n.innerHTML=`
      <div class="empty-state">
        <div class="empty-icon"><i class="fas fa-folder-open"></i></div>
        <h3 class="empty-title">Belum ada proyek</h3>
        <p class="empty-desc">Mulai dengan membuat proyek SLF pertama Anda.</p>
        <button class="btn btn-primary mt-4" onclick="window.navigate('proyek-baru')">
          <i class="fas fa-plus"></i> Buat Proyek Pertama
        </button>
      </div>
    `;return}let i={LAIK_FUNGSI:{label:`Laik Fungsi`,cls:`badge-laik`,icon:`fa-circle-check`},LAIK_FUNGSI_BERSYARAT:{label:`Laik Bersyarat`,cls:`badge-bersyarat`,icon:`fa-triangle-exclamation`},TIDAK_LAIK_FUNGSI:{label:`Tidak Laik`,cls:`badge-tidak-laik`,icon:`fa-circle-xmark`},DALAM_PENGKAJIAN:{label:`Dalam Pengkajian`,cls:`badge-proses`,icon:`fa-clock`}};n.innerHTML=e.map(e=>{let t=i[e.status_slf]||{label:e.status_slf||`-`,cls:`badge-proses`,icon:`fa-circle`},n=e.progress||0,r=e.updated_at?new Date(e.updated_at).toLocaleDateString(`id-ID`):`-`;return`
      <div class="card" style="margin-bottom:12px;cursor:pointer;display:flex;gap:var(--space-4);align-items:center"
           onclick="window.navigate('proyek-detail', {id:'${e.id}'})"
           onmouseenter="this.style.transform='translateY(-1px)';this.style.borderColor='var(--border-brand)'"
           onmouseleave="this.style.transform='';this.style.borderColor=''">

        <!-- Icon -->
        <div style="width:48px;height:48px;border-radius:var(--radius-lg);background:var(--gradient-brand);display:flex;align-items:center;justify-content:center;color:white;font-size:1.1rem;flex-shrink:0">
          <i class="fas fa-building"></i>
        </div>

        <!-- Info -->
        <div style="flex:1;overflow:hidden">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:4px">
            <h3 class="font-semibold text-primary" style="font-size:0.95rem">${e.nama_bangunan||`Tanpa Nama`}</h3>
            <span class="badge ${t.cls}">
              <i class="fas ${t.icon}"></i> ${t.label}
            </span>
          </div>
          <div class="text-xs text-tertiary" style="margin-bottom:8px">
            <i class="fas fa-location-dot" style="margin-right:4px;color:var(--brand-400)"></i>${e.alamat||`-`}
            &bull;
            <i class="fas fa-user" style="margin-left:6px;margin-right:4px;color:var(--brand-400)"></i>${e.pemilik||`-`}
          </div>
          <div style="display:flex;align-items:center;gap:10px">
            <div class="progress-wrap" style="flex:1;max-width:200px">
              <div class="progress-fill ${n>=80?`green`:n>=40?`blue`:`yellow`}" style="width:${n}%"></div>
            </div>
            <span class="text-xs text-tertiary">${n}%</span>
          </div>
        </div>

        <!-- Meta -->
        <div style="text-align:right;flex-shrink:0">
          <div class="text-xs text-tertiary">${r}</div>
          <div class="text-xs text-brand mt-1">${e.jenis_bangunan||`Bangunan Gedung`}</div>
        </div>

        <!-- Actions -->
        <div class="flex gap-2" onclick="event.stopPropagation()">
          <button class="btn btn-ghost btn-sm" title="Checklist" onclick="event.stopPropagation();window.navigate('checklist',{id:'${e.id}'})">
            <i class="fas fa-clipboard-check"></i>
          </button>
          <button class="btn btn-ghost btn-sm" title="Analisis AI" onclick="event.stopPropagation();window.navigate('analisis',{id:'${e.id}'})">
            <i class="fas fa-brain"></i>
          </button>
          <button class="btn btn-ghost btn-sm text-danger" title="Hapus" onclick="event.stopPropagation();deleteProyek('${e.id}','${e.nama_bangunan}')">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `}).join(``)}window.filterProyek=function(e=``){let t=(e||document.getElementById(`search-proyek`)?.value||``).toLowerCase(),n=document.getElementById(`filter-status`)?.value||``;M(j.filter(e=>{let r=!t||(e.nama_bangunan||``).toLowerCase().includes(t)||(e.alamat||``).toLowerCase().includes(t)||(e.pemilik||``).toLowerCase().includes(t),i=!n||e.status_slf===n;return r&&i}))},window.sortProyek=function(e){M([...j].sort((t,n)=>e===`nama_bangunan`?(t.nama_bangunan||``).localeCompare(n.nama_bangunan||``):e===`status_slf`?(t.status_slf||``).localeCompare(n.status_slf||``):new Date(n.updated_at)-new Date(t.updated_at)))},window.deleteProyek=async function(e,n){if(await b({title:`Hapus Proyek`,message:`Yakin ingin menghapus proyek <strong>${n}</strong>? Semua data terkait akan ikut terhapus.`,confirmText:`Hapus Permanen`,danger:!0}))try{let{error:n}=await t.from(`proyek`).delete().eq(`id`,e);if(n)throw n;j=j.filter(t=>t.id!==e),M(j),w(`Proyek berhasil dihapus.`)}catch(e){T(`Gagal menghapus proyek: `+e.message)}},window.exportProyek=function(){if(!j.length)return;let e=[`ID,Nama Bangunan,Alamat,Pemilik,Status SLF,Progress,Tanggal Update`,...j.map(e=>[e.id,`"${e.nama_bangunan}"`,`"${e.alamat}"`,`"${e.pemilik}"`,e.status_slf,e.progress,e.updated_at].join(`,`))].join(`
`),t=new Blob([e],{type:`text/csv`}),n=URL.createObjectURL(t),r=document.createElement(`a`);r.href=n,r.download=`proyek-slf-${Date.now()}.csv`,r.click(),URL.revokeObjectURL(n)};async function Re(e={}){let r=!!e.id,i={};if(r){let{data:n}=await t.from(`proyek`).select(`*`).eq(`id`,e.id).single();i=n||{}}return`
    <div id="proyek-form-page">
      <div class="page-header flex-between">
        <div>
          <button class="btn btn-ghost btn-sm" onclick="window.navigate('proyek')" style="margin-bottom:8px">
            <i class="fas fa-arrow-left"></i> Kembali
          </button>
          <h1 class="page-title">${r?`Edit Proyek`:`Proyek SLF Baru`}</h1>
          <p class="page-subtitle">${r?`Perbarui data proyek pengkajian SLF`:`Isi data bangunan yang akan dikaji Sertifikat Laik Fungsinya`}</p>
        </div>
      </div>

      <form id="proyek-form" onsubmit="submitProyek(event)">
        <div style="display:grid;grid-template-columns:2fr 1fr;gap:var(--space-5)">

          <!-- Left Column -->
          <div style="display:flex;flex-direction:column;gap:var(--space-5)">

            <!-- Data Bangunan -->
            <div class="card">
              <div class="card-title" style="margin-bottom:var(--space-5)">
                <i class="fas fa-building" style="color:var(--brand-400);margin-right:8px"></i>
                Data Bangunan
              </div>

              <div class="form-group">
                <label class="form-label">Nama Bangunan <span class="required">*</span></label>
                <input type="text" class="form-input" name="nama_bangunan"
                       value="${i.nama_bangunan||``}" placeholder="Gedung Perkantoran XYZ" required />
              </div>

              <div class="grid-2">
                <div class="form-group">
                  <label class="form-label">Jenis Bangunan <span class="required">*</span></label>
                  <select class="form-select" name="jenis_bangunan" required>
                    <option value="">Pilih Jenis</option>
                    ${[`Bangunan Gedung`,`Hunian`,`Komersial`,`Industri`,`Pendidikan`,`Kesehatan`,`Ibadah`,`Pemerintahan`,`Campuran`].map(e=>`<option value="${e}" ${i.jenis_bangunan===e?`selected`:``}>${e}</option>`).join(``)}
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Konstruksi Utama</label>
                  <select class="form-select" name="jenis_konstruksi">
                    <option value="">Pilih Konstruksi</option>
                    ${[`Beton Bertulang`,`Baja`,`Kayu`,`Bata`,`Komposit`].map(e=>`<option value="${e}" ${i.jenis_konstruksi===e?`selected`:``}>${e}</option>`).join(``)}
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Alamat Lengkap <span class="required">*</span></label>
                <textarea class="form-textarea" name="alamat" rows="2" placeholder="Jl. Contoh No. 123, Kelurahan, Kecamatan, Kota" required>${i.alamat||``}</textarea>
              </div>

              <div class="grid-2">
                <div class="form-group">
                  <label class="form-label">Kota/Kabupaten</label>
                  <input type="text" class="form-input" name="kota" value="${i.kota||``}" placeholder="Jakarta Selatan" />
                </div>
                <div class="form-group">
                  <label class="form-label">Provinsi</label>
                  <input type="text" class="form-input" name="provinsi" value="${i.provinsi||``}" placeholder="DKI Jakarta" />
                </div>
              </div>
            </div>

            <!-- Data Teknis -->
            <div class="card">
              <div class="card-title" style="margin-bottom:var(--space-5)">
                <i class="fas fa-ruler-combined" style="color:var(--brand-400);margin-right:8px"></i>
                Data Teknis Bangunan
              </div>

              <div class="grid-2">
                <div class="form-group">
                  <label class="form-label">Luas Bangunan (m²)</label>
                  <input type="number" class="form-input" name="luas_bangunan" value="${i.luas_bangunan||``}" placeholder="1000" min="0" />
                </div>
                <div class="form-group">
                  <label class="form-label">Luas Lahan (m²)</label>
                  <input type="number" class="form-input" name="luas_lahan" value="${i.luas_lahan||``}" placeholder="2000" min="0" />
                </div>
              </div>

              <div class="grid-2">
                <div class="form-group">
                  <label class="form-label">Jumlah Lantai</label>
                  <input type="number" class="form-input" name="jumlah_lantai" value="${i.jumlah_lantai||``}" placeholder="5" min="1" />
                </div>
                <div class="form-group">
                  <label class="form-label">Tahun Dibangun</label>
                  <input type="number" class="form-input" name="tahun_dibangun" value="${i.tahun_dibangun||``}" placeholder="2000" min="1900" max="${new Date().getFullYear()}" />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Nomor PBG / IMB</label>
                <input type="text" class="form-input" name="nomor_pbg" value="${i.nomor_pbg||``}" placeholder="No. IMB/PBG jika ada" />
                <span class="form-hint">Persetujuan Bangunan Gedung / Izin Mendirikan Bangunan</span>
              </div>

              <div class="form-group">
                <label class="form-label">Fungsi Utama Bangunan</label>
                <textarea class="form-textarea" name="fungsi_bangunan" rows="2" placeholder="Deskripsi fungsi utama bangunan...">${i.fungsi_bangunan||``}</textarea>
              </div>
            </div>

            <!-- Catatan / Kondisi Awal -->
            <div class="card">
              <div class="card-title" style="margin-bottom:var(--space-5)">
                <i class="fas fa-note-sticky" style="color:var(--brand-400);margin-right:8px"></i>
                Catatan Awal
              </div>
              <div class="form-group">
                <label class="form-label">Kondisi Umum Bangunan</label>
                <textarea class="form-textarea" name="kondisi_umum" rows="3" placeholder="Deskripsi kondisi umum bangunan saat ini...">${i.kondisi_umum||``}</textarea>
              </div>
              <div class="form-group">
                <label class="form-label">Catatan Khusus</label>
                <textarea class="form-textarea" name="catatan" rows="2" placeholder="Catatan tambahan untuk pengkaji...">${i.catatan||``}</textarea>
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div style="display:flex;flex-direction:column;gap:var(--space-5)">

            <!-- Pemilik -->
            <div class="card">
              <div class="card-title" style="margin-bottom:var(--space-5)">
                <i class="fas fa-user" style="color:var(--brand-400);margin-right:8px"></i>
                Data Pemilik / Pemohon
              </div>

              <div class="form-group">
                <label class="form-label">Nama Pemilik <span class="required">*</span></label>
                <input type="text" class="form-input" name="pemilik" value="${i.pemilik||``}" placeholder="PT Contoh atau Nama Pribadi" required />
              </div>
              <div class="form-group">
                <label class="form-label">Penanggung Jawab</label>
                <input type="text" class="form-input" name="penanggung_jawab" value="${i.penanggung_jawab||``}" placeholder="Nama PIC" />
              </div>
              <div class="form-group">
                <label class="form-label">Telepon / HP</label>
                <input type="tel" class="form-input" name="telepon" value="${i.telepon||``}" placeholder="08xx-xxxx-xxxx" />
              </div>
              <div class="form-group">
                <label class="form-label">Email</label>
                <input type="email" class="form-input" name="email_pemilik" value="${i.email_pemilik||``}" placeholder="email@domain.com" />
              </div>
            </div>

            <!-- Status SLF -->
            <div class="card">
              <div class="card-title" style="margin-bottom:var(--space-5)">
                <i class="fas fa-shield-halved" style="color:var(--brand-400);margin-right:8px"></i>
                Status SLF
              </div>

              <div class="form-group">
                <label class="form-label">Status Awal</label>
                <select class="form-select" name="status_slf">
                  ${n.statusSLF.map(e=>`
                    <option value="${e.value}" ${(i.status_slf||`DALAM_PENGKAJIAN`)===e.value?`selected`:``}>${e.label}</option>
                  `).join(``)}
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Tanggal Mulai Pengkajian</label>
                <input type="date" class="form-input" name="tanggal_mulai" value="${i.tanggal_mulai||new Date().toISOString().split(`T`)[0]}" />
              </div>
              <div class="form-group">
                <label class="form-label">Target Selesai</label>
                <input type="date" class="form-input" name="tanggal_target" value="${i.tanggal_target||``}" />
              </div>
            </div>

            <!-- AI Configuration -->
            <div class="ai-panel">
              <div class="ai-panel-header">
                <div class="ai-icon"><i class="fas fa-brain"></i></div>
                <div>
                  <div class="ai-panel-title">AI Engine</div>
                  <div class="ai-panel-subtitle">Konfigurasi analisis otomatis</div>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label" style="color:hsla(258,60%,80%,0.8)">Fokus Analisis</label>
                <select class="form-select" name="ai_focus" style="background:hsla(0,0%,0%,0.3);border-color:hsla(258,60%,50%,0.3)">
                  <option value="komprehensif">Komprehensif (Semua Aspek)</option>
                  <option value="struktur">Prioritas Struktur</option>
                  <option value="kebakaran">Prioritas Keselamatan Kebakaran</option>
                  <option value="seismik">Analisis Seismik (ASCE 41-17)</option>
                </select>
              </div>
              <div class="ai-finding success">
                <i class="fas fa-circle-check" style="margin-right:6px"></i>
                AI Engine siap menganalisis setelah checklist diisi
              </div>
            </div>

            <!-- Submit -->
            <button type="submit" class="btn btn-primary" style="width:100%;padding:14px" id="btn-submit-proyek">
              <i class="fas ${r?`fa-save`:`fa-plus`}"></i>
              ${r?`Simpan Perubahan`:`Buat Proyek`}
            </button>
          </div>
        </div>
      </form>
    </div>
  `}window.submitProyek=async function(e){e.preventDefault();let n=e.target,r=document.getElementById(`btn-submit-proyek`),i=Object.fromEntries(new FormData(n)),a=!!new URLSearchParams(window.location.hash.split(`?`)[1]).get(`id`),o=new URLSearchParams(window.location.hash.split(`?`)[1]).get(`id`);if(!i.nama_bangunan||!i.pemilik||!i.alamat){T(`Lengkapi field yang wajib diisi (*)`);return}r.disabled=!0,r.innerHTML=`<i class="fas fa-circle-notch fa-spin"></i> Menyimpan...`;try{let e=d(),n={...i,progress:0,luas_bangunan:i.luas_bangunan?Number(i.luas_bangunan):null,luas_lahan:i.luas_lahan?Number(i.luas_lahan):null,jumlah_lantai:i.jumlah_lantai?Number(i.jumlah_lantai):null,tahun_dibangun:i.tahun_dibangun?Number(i.tahun_dibangun):null,created_by:e?.email,updated_at:new Date().toISOString()},r;if(a&&o?{error:r}=await t.from(`proyek`).update(n).eq(`id`,o):{error:r}=await t.from(`proyek`).insert(n),r)throw r;w(a?`Proyek berhasil diperbarui!`:`Proyek SLF berhasil dibuat!`),setTimeout(()=>g(`proyek`),800)}catch(e){T(`Gagal menyimpan: `+e.message),r.disabled=!1,r.innerHTML=`<i class="fas fa-save"></i> ${a?`Simpan Perubahan`:`Buat Proyek`}`}};async function ze(e={}){let t=e.id;if(!t)return g(`proyek`),``;let n=document.getElementById(`page-root`);n&&(n.innerHTML=Ge());let r=await He(t);if(!r)return g(`proyek`),T(`Proyek tidak ditemukan.`),``;let[i,a]=await Promise.all([Ue(t),We(t)]),o=Be(r,i,a);return n&&(n.innerHTML=o,Ve(r,i,a)),o}function Be(e,t,n){let r={LAIK_FUNGSI:{label:`Laik Fungsi`,cls:`badge-laik`,icon:`fa-circle-check`},LAIK_FUNGSI_BERSYARAT:{label:`Laik Bersyarat`,cls:`badge-bersyarat`,icon:`fa-triangle-exclamation`},TIDAK_LAIK_FUNGSI:{label:`Tidak Laik Fungsi`,cls:`badge-tidak-laik`,icon:`fa-circle-xmark`},DALAM_PENGKAJIAN:{label:`Dalam Pengkajian`,cls:`badge-proses`,icon:`fa-clock`}},i=r[e.status_slf]||r.DALAM_PENGKAJIAN,a=e.progress||0,o=[{label:`Input Data`,icon:`fa-file-pen`,key:`input`},{label:`Checklist`,icon:`fa-clipboard-check`,key:`checklist`},{label:`Analisis AI`,icon:`fa-brain`,key:`analisis`},{label:`Laporan Draft`,icon:`fa-file-alt`,key:`laporan`},{label:`Finalisasi SLF`,icon:`fa-certificate`,key:`final`}],s=a<20?0:a<40?1:a<60?2:a<80?3:4;return`
    <div id="proyek-detail-page">

      <!-- Back + Actions -->
      <div class="page-header">
        <div class="flex-between">
          <div>
            <button class="btn btn-ghost btn-sm" onclick="window.navigate('proyek')" style="margin-bottom:8px">
              <i class="fas fa-arrow-left"></i> Semua Proyek
            </button>
            <h1 class="page-title" style="margin-bottom:4px">${N(e.nama_bangunan)}</h1>
            <div class="flex gap-3" style="align-items:center;flex-wrap:wrap">
              <span class="badge ${i.cls}"><i class="fas ${i.icon}" style="margin-right:4px"></i>${i.label}</span>
              <span class="text-sm text-tertiary"><i class="fas fa-map-marker-alt" style="margin-right:4px"></i>${N(e.alamat||`-`)}</span>
              ${e.nomor_pbg?`<span class="text-sm text-tertiary"><i class="fas fa-file-certificate" style="margin-right:4px"></i>PBG: ${N(e.nomor_pbg)}</span>`:``}
            </div>
          </div>
          <div class="flex gap-3">
            <button class="btn btn-ghost btn-sm" onclick="window.navigate('proyek-edit', {id:'${e.id}'})">
              <i class="fas fa-pen"></i> Edit
            </button>
            <button class="btn btn-danger btn-sm" onclick="window._hapusProyek('${e.id}')">
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
          ${o.map((e,t)=>`
            <div class="workflow-step ${t<s?`done`:t===s?`active`:``}">
              <div class="wf-icon"><i class="fas ${e.icon}"></i></div>
              <div class="wf-label">${e.label}</div>
              ${t<o.length-1?`<div class="wf-connector"></div>`:``}
            </div>
          `).join(``)}
        </div>
        <div style="margin-top:var(--space-4)">
          <div class="flex-between mb-1">
            <span class="text-sm text-secondary">Progress Keseluruhan</span>
            <span class="text-sm font-semibold text-primary">${a}%</span>
          </div>
          <div class="progress-wrap" style="height:8px">
            <div class="progress-fill ${a>=80?`green`:a>=40?`blue`:`yellow`}"
                 style="width:${a}%;transition:width 1s ease"></div>
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
            <div class="feature-nav-card" onclick="window.navigate('checklist',{id:'${e.id}'})">
              <div class="fnc-icon" style="background:linear-gradient(135deg,hsl(220,70%,45%),hsl(220,70%,60%))">
                <i class="fas fa-clipboard-check"></i>
              </div>
              <div class="fnc-body">
                <div class="fnc-title">Checklist Pemeriksaan</div>
                <div class="fnc-desc">Administrasi · Teknis · Lapangan</div>
                <div class="fnc-meta">
                  <div style="display:flex;align-items:center;gap:8px;margin-top:8px">
                    <div class="progress-wrap" style="flex:1;height:5px">
                      <div class="progress-fill blue" style="width:${t.pct}%"></div>
                    </div>
                    <span class="text-xs text-tertiary">${t.done}/${t.total}</span>
                  </div>
                </div>
              </div>
              <i class="fas fa-arrow-right fnc-arrow"></i>
            </div>

            <!-- Analisis -->
            <div class="feature-nav-card" onclick="window.navigate('analisis',{id:'${e.id}'})">
              <div class="fnc-icon" style="background:linear-gradient(135deg,hsl(258,70%,45%),hsl(258,70%,60%))">
                <i class="fas fa-brain"></i>
              </div>
              <div class="fnc-body">
                <div class="fnc-title">Analisis AI</div>
                <div class="fnc-desc">Rule-based · Risk Scoring · Rekomendasi</div>
                <div class="fnc-meta">
                  ${n?`<span class="badge badge-laik" style="margin-top:8px;font-size:0.7rem">Skor ${n.skor_total}/100</span>`:`<span class="text-xs text-tertiary" style="margin-top:8px;display:block">Belum dianalisis</span>`}
                </div>
              </div>
              <i class="fas fa-arrow-right fnc-arrow"></i>
            </div>

            <!-- Laporan -->
            <div class="feature-nav-card" onclick="window.navigate('laporan',{id:'${e.id}'})">
              <div class="fnc-icon" style="background:linear-gradient(135deg,hsl(160,65%,35%),hsl(160,65%,50%))">
                <i class="fas fa-file-contract"></i>
              </div>
              <div class="fnc-body">
                <div class="fnc-title">Laporan Kajian SLF</div>
                <div class="fnc-desc">Preview · Export PDF · Word</div>
                <div class="fnc-meta">
                  <span class="text-xs text-tertiary" style="margin-top:8px;display:block">
                    ${n?`Data analisis tersedia`:`Lengkapi analisis terlebih dahulu`}
                  </span>
                </div>
              </div>
              <i class="fas fa-arrow-right fnc-arrow"></i>
            </div>

            <!-- TODO -->
            <div class="feature-nav-card" onclick="window.navigate('todo',{proyekId:'${e.id}'})">
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
              ${[[`Jenis Bangunan`,e.jenis_bangunan||`-`,`fa-tag`],[`Jenis Konstruksi`,e.jenis_konstruksi||`-`,`fa-layer-group`],[`Jumlah Lantai`,e.jumlah_lantai?`${e.jumlah_lantai} lantai`:`-`,`fa-stairs`],[`Luas Bangunan`,e.luas_bangunan?`${Number(e.luas_bangunan).toLocaleString(`id-ID`)} m²`:`-`,`fa-ruler-combined`],[`Luas Lahan`,e.luas_lahan?`${Number(e.luas_lahan).toLocaleString(`id-ID`)} m²`:`-`,`fa-expand`],[`Tahun Dibangun`,e.tahun_dibangun||`-`,`fa-calendar`],[`Fungsi Bangunan`,e.fungsi_bangunan||`-`,`fa-building-columns`],[`Nomor PBG/IMB`,e.nomor_pbg||`-`,`fa-file-certificate`],[`Kota/Provinsi`,[e.kota,e.provinsi].filter(Boolean).join(`, `)||`-`,`fa-location-dot`]].map(([e,t,n])=>`
                <div style="background:var(--bg-elevated);border-radius:var(--radius-md);padding:var(--space-3) var(--space-4)">
                  <div class="text-xs text-tertiary" style="margin-bottom:2px">
                    <i class="fas ${n}" style="margin-right:4px;opacity:0.6"></i>${e}
                  </div>
                  <div class="text-sm font-semibold text-primary truncate">${N(t)}</div>
                </div>
              `).join(``)}
            </div>
            ${e.kondisi_umum?`
              <div style="margin-top:var(--space-4);padding:var(--space-4);background:var(--bg-elevated);border-radius:var(--radius-md);border-left:3px solid var(--brand-400)">
                <div class="text-xs text-tertiary" style="margin-bottom:4px">Kondisi Umum</div>
                <div class="text-sm text-secondary">${N(e.kondisi_umum)}</div>
              </div>
            `:``}
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
              ${[[`fa-user-tie`,e.pemilik||`-`],[`fa-id-card`,e.penanggung_jawab||`-`],[`fa-phone`,e.telepon||`-`],[`fa-envelope`,e.email_pemilik||`-`]].map(([e,t])=>`
                <div class="flex gap-3" style="align-items:center">
                  <i class="fas ${e}" style="color:var(--text-tertiary);width:16px;text-align:center"></i>
                  <span class="text-sm text-secondary">${N(t)}</span>
                </div>
              `).join(``)}
            </div>
          </div>

          <!-- Jadwal -->
          <div class="card">
            <div class="card-title" style="margin-bottom:var(--space-4)">
              <i class="fas fa-calendar-days" style="color:var(--brand-400);margin-right:8px"></i>Jadwal Pengkajian
            </div>
            ${[[`Mulai`,e.tanggal_mulai,`fa-play`],[`Target`,e.tanggal_target,`fa-flag-checkered`]].map(([e,t,n])=>`
              <div class="flex-between" style="margin-bottom:10px">
                <span class="text-sm text-secondary"><i class="fas ${n}" style="margin-right:6px;opacity:0.7"></i>${e}</span>
                <span class="text-sm font-semibold text-primary">${t?Ke(t):`-`}</span>
              </div>
            `).join(``)}
            ${e.tanggal_mulai&&e.tanggal_target?(()=>{let t=new Date(e.tanggal_mulai),n=new Date(e.tanggal_target),r=new Date,i=n-t,a=Math.max(0,r-t),o=Math.ceil((n-r)/864e5),s=Math.min(100,Math.round(a/i*100));return`
                <div style="margin-top:var(--space-3)">
                  <div class="flex-between mb-1">
                    <span class="text-xs text-tertiary">Waktu berjalan</span>
                    <span class="text-xs ${o<7?`text-danger`:`text-tertiary`}">${o>0?`${o} hari tersisa`:`Melewati target`}</span>
                  </div>
                  <div class="progress-wrap" style="height:5px">
                    <div class="progress-fill ${o<7?`red`:`blue`}" style="width:${s}%"></div>
                  </div>
                </div>
              `})():``}
          </div>

          <!-- AI Result -->
          ${n?`
            <div class="ai-panel">
              <div class="ai-panel-header">
                <div class="ai-icon"><i class="fas fa-brain"></i></div>
                <div>
                  <div class="ai-panel-title">Hasil Analisis AI</div>
                  <div class="ai-panel-subtitle">${Ke(n.created_at)}</div>
                </div>
              </div>
              <div class="ai-finding ${n.status_slf===`LAIK_FUNGSI`?`success`:n.status_slf===`LAIK_FUNGSI_BERSYARAT`?`warning`:`critical`}">
                <i class="fas ${n.status_slf===`LAIK_FUNGSI`?`fa-circle-check`:n.status_slf===`LAIK_FUNGSI_BERSYARAT`?`fa-triangle-exclamation`:`fa-circle-xmark`}" style="margin-right:6px"></i>
                ${n.status_slf===`LAIK_FUNGSI`?`Bangunan Laik Fungsi`:n.status_slf===`LAIK_FUNGSI_BERSYARAT`?`Laik Fungsi Bersyarat`:`Tidak Laik Fungsi`}
              </div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:var(--space-3)">
                <div style="text-align:center;background:hsla(0,0%,0%,0.2);border-radius:var(--radius-md);padding:var(--space-3)">
                  <div class="text-xs text-tertiary">Skor Total</div>
                  <div style="font-size:1.6rem;font-weight:800;color:var(--brand-400)">${n.skor_total}</div>
                </div>
                <div style="text-align:center;background:hsla(0,0%,0%,0.2);border-radius:var(--radius-md);padding:var(--space-3)">
                  <div class="text-xs text-tertiary">Level Risiko</div>
                  <div style="font-size:1.1rem;font-weight:700;color:${qe(n.risk_level)};margin-top:4px">${Je(n.risk_level)}</div>
                </div>
              </div>
              <button class="btn btn-secondary btn-sm" style="width:100%;margin-top:var(--space-3)"
                      onclick="window.navigate('analisis',{id:'${n.proyek_id}'})">
                <i class="fas fa-eye"></i> Lihat Detail Analisis
              </button>
            </div>
          `:`
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
                      onclick="window.navigate('checklist',{id:'${e.id}'})">
                <i class="fas fa-clipboard-check"></i> Mulai Checklist
              </button>
            </div>
          `}

          <!-- Catatan -->
          ${e.catatan?`
            <div class="card">
              <div class="card-title" style="margin-bottom:var(--space-3)">
                <i class="fas fa-note-sticky" style="color:var(--brand-400);margin-right:8px"></i>Catatan
              </div>
              <p class="text-sm text-secondary" style="line-height:1.6">${N(e.catatan)}</p>
            </div>
          `:``}
        </div>
      </div>
    </div>
  `}function Ve(e){window._hapusProyek=async n=>{if(await b({title:`Hapus Proyek`,message:`Yakin ingin menghapus proyek "${e.nama_bangunan}"? Semua data terkait akan ikut terhapus.`,confirmText:`Hapus`,danger:!0}))try{let{error:e}=await t.from(`proyek`).delete().eq(`id`,n);if(e)throw e;w(`Proyek berhasil dihapus.`),g(`proyek`)}catch(e){T(`Gagal menghapus: `+e.message)}}}async function He(e){try{let{data:n}=await t.from(`proyek`).select(`*`).eq(`id`,e).single();return n}catch{return null}}async function Ue(e){try{let{data:n}=await t.from(`checklist_items`).select(`id, status`).eq(`proyek_id`,e),r=n?.length||0,i=n?.filter(e=>e.status&&e.status!==`belum`).length||0;return{total:r,done:i,pct:r>0?Math.round(i/r*100):0}}catch{return{total:0,done:0,pct:0}}}async function We(e){try{let{data:n}=await t.from(`hasil_analisis`).select(`*`).eq(`proyek_id`,e).order(`created_at`,{ascending:!1}).limit(1).single();return n||null}catch{return null}}function Ge(){return`
    <div class="page-header">
      <div class="skeleton" style="height:20px;width:160px;margin-bottom:8px"></div>
      <div class="skeleton" style="height:36px;width:400px;margin-bottom:8px"></div>
      <div class="skeleton" style="height:22px;width:300px"></div>
    </div>
    <div class="skeleton" style="height:120px;border-radius:var(--radius-lg);margin-bottom:var(--space-5)"></div>
    <div style="display:grid;grid-template-columns:1fr 340px;gap:var(--space-5)">
      <div>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:var(--space-4);margin-bottom:var(--space-4)">
          ${[,,,,].fill(0).map(()=>`<div class="skeleton" style="height:120px;border-radius:var(--radius-lg)"></div>`).join(``)}
        </div>
        <div class="skeleton" style="height:280px;border-radius:var(--radius-lg)"></div>
      </div>
      <div style="display:flex;flex-direction:column;gap:var(--space-4)">
        <div class="skeleton" style="height:160px;border-radius:var(--radius-lg)"></div>
        <div class="skeleton" style="height:140px;border-radius:var(--radius-lg)"></div>
        <div class="skeleton" style="height:160px;border-radius:var(--radius-lg)"></div>
      </div>
    </div>
  `}function N(e){return String(e||``).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`)}function Ke(e){return new Date(e).toLocaleDateString(`id-ID`,{day:`numeric`,month:`short`,year:`numeric`})}function qe(e){return e===`low`?`hsl(160,65%,46%)`:e===`medium`?`hsl(40,80%,55%)`:e===`high`?`hsl(0,70%,58%)`:`hsl(330,70%,50%)`}function Je(e){return{low:`Rendah`,medium:`Sedang`,high:`Tinggi`,critical:`Kritis`}[e]||e}var P=[{kode:`A01`,nama:`PBG / IMB (Persetujuan Bangunan Gedung)`,options:[`ada_sesuai`,`ada_tidak_sesuai`,`tidak_ada`]},{kode:`A02`,nama:`Sertifikat Laik Fungsi Sebelumnya`,options:[`ada_sesuai`,`ada_tidak_sesuai`,`tidak_ada`,`pertama_kali`]},{kode:`A03`,nama:`Gambar As-Built Drawing`,options:[`ada_sesuai`,`ada_tidak_sesuai`,`tidak_ada`]},{kode:`A04`,nama:`Gambar Rencana Teknis (DED)`,options:[`ada_sesuai`,`ada_tidak_sesuai`,`tidak_ada`]},{kode:`A05`,nama:`Dokumen RKS / Spesifikasi Teknis`,options:[`ada_sesuai`,`ada_tidak_sesuai`,`tidak_ada`]},{kode:`A06`,nama:`Dokumen K3 Konstruksi`,options:[`ada_sesuai`,`ada_tidak_sesuai`,`tidak_ada`]},{kode:`A07`,nama:`Ijin Penggunaan Air/Listrik (PLN/PDAM)`,options:[`ada_sesuai`,`ada_tidak_sesuai`,`tidak_ada`]},{kode:`A08`,nama:`Sertifikat Laik Operasi (SLO) Instalasi`,options:[`ada_sesuai`,`ada_tidak_sesuai`,`tidak_ada`]},{kode:`A09`,nama:`Dokumen AMDAL / UKL-UPL`,options:[`ada_sesuai`,`ada_tidak_sesuai`,`tidak_ada`,`tidak_wajib`]},{kode:`A10`,nama:`IMB Perubahan / Renovasi (jika ada)`,options:[`ada_sesuai`,`ada_tidak_sesuai`,`tidak_ada`,`tidak_ada_renovasi`]}],F=[{aspek:`Struktur`,items:[{kode:`S01`,nama:`Kondisi Pondasi`},{kode:`S02`,nama:`Kondisi Kolom Struktur`},{kode:`S03`,nama:`Kondisi Balok Struktur`},{kode:`S04`,nama:`Kondisi Pelat Lantai`},{kode:`S05`,nama:`Kondisi Rangka Atap`},{kode:`S06`,nama:`Kondisi Dinding Struktural / Shear Wall`},{kode:`S07`,nama:`Kesesuaian Konstruksi dengan PBG`}]},{aspek:`Arsitektur`,items:[{kode:`AR01`,nama:`Kondisi Dinding Non-Struktural`},{kode:`AR02`,nama:`Kondisi Pintu dan Jendela`},{kode:`AR03`,nama:`Kondisi Penutup Lantai`},{kode:`AR04`,nama:`Kondisi Plafon`},{kode:`AR05`,nama:`Kondisi Fasad / Eksterior Bangunan`},{kode:`AR06`,nama:`Kesesuaian Tata Letak dengan Gambar`}]},{aspek:`MEP (Mekanikal, Elektrikal, Plumbing)`,items:[{kode:`M01`,nama:`Instalasi Listrik (Panel, Kabel, ELCB)`},{kode:`M02`,nama:`Instalasi Air Bersih`},{kode:`M03`,nama:`Instalasi Air Kotor & Sanitasi`},{kode:`M04`,nama:`Instalasi Gas (jika ada)`},{kode:`M05`,nama:`Sistem HVAC / Ventilasi`},{kode:`M06`,nama:`Instalasi Lift / Eskalator (jika ada)`}]},{aspek:`Keselamatan Kebakaran`,items:[{kode:`K01`,nama:`Alat Pemadam Api Ringan (APAR)`},{kode:`K02`,nama:`Sistem Sprinkler`},{kode:`K03`,nama:`Sistem Hidran Gedung`},{kode:`K04`,nama:`Alarm Kebakaran & Detektor Asap`},{kode:`K05`,nama:`Tangga Darurat & Pintu Kebakaran`},{kode:`K06`,nama:`Jalur Evakuasi & Tanda Darurat`}]},{aspek:`Kesehatan`,items:[{kode:`KH01`,nama:`Ventilasi Udara Memadai`},{kode:`KH02`,nama:`Pencahayaan Alami & Buatan`},{kode:`KH03`,nama:`Fasilitas Sanitasi (Toilet, Wastafel)`},{kode:`KH04`,nama:`Pengelolaan Sampah`}]},{aspek:`Kenyamanan`,items:[{kode:`KN01`,nama:`Kenyamanan Termal (Suhu Ruang)`},{kode:`KN02`,nama:`Kenyamanan Visual (Silau, Pencahayaan)`},{kode:`KN03`,nama:`Pengendalian Kebisingan`}]},{aspek:`Kemudahan / Aksesibilitas`,items:[{kode:`KM01`,nama:`Fasilitas Difabel (Ramp, Toilet Difabel)`},{kode:`KM02`,nama:`Lebar Koridor & Sirkulasi Memadai`},{kode:`KM03`,nama:`Area Parkir Cukup`}]}],Ye=[{value:``,label:`— Pilih Status —`},{value:`ada_sesuai`,label:`✓ Ada & Sesuai`},{value:`ada_tidak_sesuai`,label:`⚠ Ada Tapi Tidak Sesuai`},{value:`tidak_ada`,label:`✗ Tidak Ada`},{value:`pertama_kali`,label:`○ Pengajuan Pertama`},{value:`tidak_wajib`,label:`— Tidak Wajib`},{value:`tidak_ada_renovasi`,label:`— Tidak Ada Renovasi`}],Xe=[{value:``,label:`— Pilih Status —`},{value:`baik`,label:`✓ Baik / Sesuai`},{value:`sedang`,label:`⚠ Sedang / Minor Issue`},{value:`buruk`,label:`⚠ Buruk / Perlu Perbaikan`},{value:`kritis`,label:`✗ Kritis / Tidak Laik`},{value:`tidak_ada`,label:`— Tidak Ada / N/A`}];async function Ze(e={}){let t=e.id;if(!t)return g(`proyek`),``;let n=document.getElementById(`page-root`);n&&(n.innerHTML=rt());let[r,i]=await Promise.all([tt(t),nt(t)]);if(!r)return g(`proyek`),T(`Proyek tidak ditemukan.`),``;let a={};(i||[]).forEach(e=>{a[e.kode]=e}),window._checklistProyekId=t,window._checklistDataMap=a;let o=Qe(r,a);return n&&(n.innerHTML=o,$e(),et(t)),o}function Qe(e,t){let n=P.filter(e=>t[e.kode]?.status).length,r=F.flatMap(e=>e.items).filter(e=>t[e.kode]?.status).length,i=F.flatMap(e=>e.items).length;return`
    <div id="checklist-page">
      <!-- Header -->
      <div class="page-header">
        <div class="flex-between">
          <div>
            <button class="btn btn-ghost btn-sm" onclick="window.navigate('proyek-detail',{id:'${e.id}'})" style="margin-bottom:8px">
              <i class="fas fa-arrow-left"></i> ${z(e.nama_bangunan)}
            </button>
            <h1 class="page-title">Checklist Pemeriksaan SLF</h1>
            <p class="page-subtitle">Pengisian data pemeriksaan sesuai standar NSPK — perubahan tersimpan otomatis</p>
          </div>
          <div class="flex gap-3">
            <div style="text-align:right">
              <div class="text-xs text-tertiary">Progress</div>
              <div class="text-sm font-semibold text-primary">${n+r}/${P.length+i} item</div>
            </div>
            <button class="btn btn-primary" onclick="window._saveChecklist()">
              <i class="fas fa-save"></i> Simpan Semua
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Strip -->
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-4);margin-bottom:var(--space-5)">
        ${[{label:`Administrasi`,done:n,total:P.length,color:`kpi-blue`,icon:`fa-clipboard-list`},{label:`Teknis`,done:r,total:i,color:`kpi-purple`,icon:`fa-building`},{label:`Lapangan`,done:0,total:3,color:`kpi-green`,icon:`fa-camera`}].map(e=>`
          <div class="card" style="padding:var(--space-4)">
            <div class="flex gap-3" style="align-items:center;margin-bottom:var(--space-3)">
              <div class="kpi-icon-wrap ${e.color}" style="width:36px;height:36px;margin:0">
                <i class="fas ${e.icon}"></i>
              </div>
              <div>
                <div class="text-sm font-semibold text-primary">${e.label}</div>
                <div class="text-xs text-tertiary">${e.done}/${e.total} item</div>
              </div>
            </div>
            <div class="progress-wrap">
              <div class="progress-fill ${e.color===`kpi-blue`||e.color===`kpi-purple`?`blue`:`green`}"
                   style="width:${e.total>0?Math.round(e.done/e.total*100):0}%"></div>
            </div>
          </div>
        `).join(``)}
      </div>

      <!-- Tab Bar -->
      <div class="tab-bar" id="checklist-tabs">
        <button class="tab-btn active" onclick="switchTab('admin')" id="tab-btn-admin">
          <i class="fas fa-clipboard-list"></i> Administrasi
          <span style="background:hsla(220,70%,48%,0.2);color:var(--brand-400);padding:1px 7px;border-radius:999px;font-size:0.7rem">${n}/${P.length}</span>
        </button>
        <button class="tab-btn" onclick="switchTab('teknis')" id="tab-btn-teknis">
          <i class="fas fa-building"></i> Teknis
          <span style="background:hsla(220,70%,48%,0.2);color:var(--brand-400);padding:1px 7px;border-radius:999px;font-size:0.7rem">${r}/${i}</span>
        </button>
        <button class="tab-btn" onclick="switchTab('lapangan')" id="tab-btn-lapangan">
          <i class="fas fa-camera"></i> Lapangan
        </button>
      </div>

      <!-- Tab: Administrasi -->
      <div class="tab-content active" id="tab-admin">
        <div class="card" style="padding:0;overflow:hidden">
          <div class="card-header" style="padding:var(--space-5);border-bottom:1px solid var(--border-subtle)">
            <div>
              <div class="card-title">Checklist Dokumen Administrasi</div>
              <div class="card-subtitle">Verifikasi kelengkapan dan kesesuaian dokumen perizinan bangunan</div>
            </div>
          </div>
          <div style="overflow-x:auto">
            <table class="checklist-table">
              <thead>
                <tr>
                  <th style="width:60px">Kode</th>
                  <th>Item Pemeriksaan</th>
                  <th style="width:200px">Status</th>
                  <th style="width:240px">Catatan Teknis</th>
                </tr>
              </thead>
              <tbody>
                ${P.map(e=>`
                  <tr>
                    <td><span class="cl-kode">${e.kode}</span></td>
                    <td class="text-secondary">${z(e.nama)}</td>
                    <td>
                      <select class="cl-status-select" id="cl-${e.kode}-status"
                              onchange="window._markDirty('${e.kode}')"
                              data-kode="${e.kode}" data-kategori="administrasi">
                        ${Ye.map(n=>`<option value="${n.value}" ${(t[e.kode]?.status||``)===n.value?`selected`:``}>${n.label}</option>`).join(``)}
                      </select>
                    </td>
                    <td>
                      <textarea class="cl-catatan" id="cl-${e.kode}-catatan" rows="2"
                                placeholder="Catatan..." onchange="window._markDirty('${e.kode}')">${z(t[e.kode]?.catatan||``)}</textarea>
                    </td>
                  </tr>
                `).join(``)}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Tab: Teknis -->
      <div class="tab-content" id="tab-teknis">
        <div class="card" style="padding:0;overflow:hidden">
          <div class="card-header" style="padding:var(--space-5);border-bottom:1px solid var(--border-subtle)">
            <div>
              <div class="card-title">Checklist Teknis per Aspek SLF</div>
              <div class="card-subtitle">Evaluasi kondisi eksisting setiap komponen bangunan</div>
            </div>
          </div>
          <div style="overflow-x:auto">
            <table class="checklist-table">
              <thead>
                <tr>
                  <th style="width:60px">Kode</th>
                  <th>Item Pemeriksaan</th>
                  <th style="width:200px">Kondisi</th>
                  <th style="width:240px">Catatan Teknis</th>
                </tr>
              </thead>
              <tbody>
                ${F.map(e=>`
                  <tr class="aspek-header">
                    <td colspan="4">
                      <i class="fas fa-layer-group" style="margin-right:6px"></i>${z(e.aspek)}
                    </td>
                  </tr>
                  ${e.items.map(n=>`
                    <tr>
                      <td><span class="cl-kode">${n.kode}</span></td>
                      <td class="text-secondary">${z(n.nama)}</td>
                      <td>
                        <select class="cl-status-select" id="cl-${n.kode}-status"
                                onchange="window._markDirty('${n.kode}')"
                                data-kode="${n.kode}" data-kategori="teknis" data-aspek="${z(e.aspek)}">
                          ${Xe.map(e=>`<option value="${e.value}" ${(t[n.kode]?.status||``)===e.value?`selected`:``}>${e.label}</option>`).join(``)}
                        </select>
                      </td>
                      <td>
                        <textarea class="cl-catatan" id="cl-${n.kode}-catatan" rows="2"
                                  placeholder="Catatan teknis..." onchange="window._markDirty('${n.kode}')">${z(t[n.kode]?.catatan||``)}</textarea>
                      </td>
                    </tr>
                  `).join(``)}
                `).join(``)}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Tab: Lapangan -->
      <div class="tab-content" id="tab-lapangan">
        <div class="card" style="text-align:center;padding:var(--space-12)">
          <div style="width:70px;height:70px;background:var(--gradient-brand);border-radius:var(--radius-xl);display:flex;align-items:center;justify-content:center;margin:0 auto var(--space-5);font-size:1.8rem;color:white">
            <i class="fas fa-camera"></i>
          </div>
          <h3 style="font-size:1.1rem;font-weight:700;margin-bottom:var(--space-2)">Dokumentasi Lapangan</h3>
          <p style="color:var(--text-secondary);max-width:400px;margin:0 auto var(--space-5)">
            Upload foto kondisi eksisting per komponen bangunan sebagai bukti dokumentasi pemeriksaan lapangan SLF.
          </p>
          <div class="ai-finding" style="max-width:440px;margin:0 auto;text-align:left">
            <i class="fas fa-circle-info" style="margin-right:6px"></i>
            Fitur upload foto per komponen akan tersedia. Saat ini, gunakan form teknis di tab Teknis untuk mencatat kondisi lapangan.
          </div>
        </div>
      </div>

      <!-- Action Bar -->
      <div style="margin-top:var(--space-5);display:flex;gap:var(--space-3);justify-content:flex-end">
        <button class="btn btn-secondary" onclick="window.navigate('proyek-detail',{id:'${e.id}'})">
          <i class="fas fa-arrow-left"></i> Kembali
        </button>
        <button class="btn btn-primary" onclick="window._saveChecklist()">
          <i class="fas fa-save"></i> Simpan & Lanjut ke Analisis
        </button>
      </div>
    </div>
  `}function $e(){window.switchTab=e=>{document.querySelectorAll(`.tab-content`).forEach(e=>e.classList.remove(`active`)),document.querySelectorAll(`.tab-btn`).forEach(e=>e.classList.remove(`active`)),document.getElementById(`tab-${e}`)?.classList.add(`active`),document.getElementById(`tab-btn-${e}`)?.classList.add(`active`)}}var I=new Set,L=null;function et(e){window._markDirty=t=>{I.add(t),clearTimeout(L),L=setTimeout(()=>R(e,!1),2e3)},window._saveChecklist=async()=>{await R(e,!0)}}async function R(e,n){let r=d(),i=[...P.map(e=>e.kode),...F.flatMap(e=>e.items.map(e=>e.kode))].map(t=>{let n=document.getElementById(`cl-${t}-status`),i=document.getElementById(`cl-${t}-catatan`);return n?{proyek_id:e,kode:t,kategori:n.dataset.kategori||`teknis`,aspek:n.dataset.aspek||``,nama:n.closest(`tr`)?.cells[1]?.textContent?.trim()||t,status:n.value||null,catatan:i?.value||null,created_by:r?.email,updated_at:new Date().toISOString()}:null}).filter(Boolean);try{let{error:r}=await t.from(`checklist_items`).upsert(i,{onConflict:`proyek_id,kode`});if(r)throw r;let a=i.filter(e=>e.status).length,o=i.length,s=Math.round(a/o*100),c=Math.min(40,Math.round(s*.4));await t.from(`proyek`).update({progress:c}).eq(`id`,e),I.clear(),n&&(w(`Checklist tersimpan! (${a}/${o} item diisi)`),setTimeout(()=>g(`analisis`,{id:e}),1e3))}catch(e){T(`Gagal menyimpan: `+e.message)}}async function tt(e){try{let{data:n}=await t.from(`proyek`).select(`id,nama_bangunan`).eq(`id`,e).single();return n}catch{return null}}async function nt(e){try{let{data:n}=await t.from(`checklist_items`).select(`*`).eq(`proyek_id`,e);return n||[]}catch{return[]}}function rt(){return`
    <div class="page-header">
      <div class="skeleton" style="height:20px;width:200px;margin-bottom:8px"></div>
      <div class="skeleton" style="height:36px;width:400px;margin-bottom:8px"></div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-4);margin-bottom:var(--space-5)">
      ${[,,,].fill(0).map(()=>`<div class="skeleton" style="height:80px;border-radius:var(--radius-lg)"></div>`).join(``)}
    </div>
    <div class="skeleton" style="height:56px;border-radius:var(--radius-lg);margin-bottom:var(--space-5)"></div>
    <div class="skeleton" style="height:400px;border-radius:var(--radius-lg)"></div>
  `}function z(e){return String(e||``).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`)}var it={administrasi:10,struktur:25,arsitektur:10,mep:15,keselamatan:20,kesehatan:8,kenyamanan:6,kemudahan:6},at={ada_sesuai:100,ada_tidak_sesuai:40,tidak_ada:0,pertama_kali:80,tidak_wajib:100,tidak_ada_renovasi:100,"":0},ot={baik:100,sedang:65,buruk:30,kritis:0,tidak_ada:90,"":0},st={administrasi:[`A01`,`A02`,`A03`,`A04`,`A05`,`A06`,`A07`,`A08`,`A09`,`A10`],struktur:[`S01`,`S02`,`S03`,`S04`,`S05`,`S06`,`S07`],arsitektur:[`AR01`,`AR02`,`AR03`,`AR04`,`AR05`,`AR06`],mep:[`M01`,`M02`,`M03`,`M04`,`M05`,`M06`],keselamatan:[`K01`,`K02`,`K03`,`K04`,`K05`,`K06`],kesehatan:[`KH01`,`KH02`,`KH03`,`KH04`],kenyamanan:[`KN01`,`KN02`,`KN03`],kemudahan:[`KM01`,`KM02`,`KM03`]};async function ct(e={}){let t=e.id;if(!t)return g(`proyek`),``;let n=document.getElementById(`page-root`);n&&(n.innerHTML=yt());let[r,i,a]=await Promise.all([gt(t),_t(t),vt(t)]);if(!r)return g(`proyek`),T(`Proyek tidak ditemukan.`),``;let o=a,s=i.length>0,c=lt(r,i,o,s);return n&&(n.innerHTML=c,s&&o&&H(o),V(r,i,t)),c}function lt(e,t,n,r){return`
    <div id="analisis-page">
      <!-- Header -->
      <div class="page-header">
        <div class="flex-between">
          <div>
            <button class="btn btn-ghost btn-sm" onclick="window.navigate('proyek-detail',{id:'${e.id}'})" style="margin-bottom:8px">
              <i class="fas fa-arrow-left"></i> ${U(e.nama_bangunan)}
            </button>
            <h1 class="page-title">Analisis AI — Kelaikan Fungsi</h1>
            <p class="page-subtitle">Engine rule-based berbasis NSPK & SNI 9273:2025 — Status: ${r?`${t.length} item checklist`:`Checklist belum diisi`}</p>
          </div>
          <div class="flex gap-3">
            ${r?`
              <button class="btn btn-secondary" onclick="window.navigate('checklist',{id:'${e.id}'})">
                <i class="fas fa-clipboard-check"></i> Edit Checklist
              </button>
              <button class="btn btn-primary" id="btn-analyze" onclick="window._runAnalysis()">
                <i class="fas fa-brain"></i> Jalankan Analisis
              </button>
            `:`
              <button class="btn btn-primary" onclick="window.navigate('checklist',{id:'${e.id}'})">
                <i class="fas fa-clipboard-check"></i> Isi Checklist Dulu
              </button>
            `}
          </div>
        </div>
      </div>

      ${r?n?B(n,e):dt(e.id):ut(e.id)}
    </div>
  `}function ut(e){return`
    <div class="card" style="text-align:center;padding:var(--space-12)">
      <div style="width:70px;height:70px;background:var(--gradient-brand);border-radius:var(--radius-xl);display:flex;align-items:center;justify-content:center;margin:0 auto var(--space-5);font-size:1.8rem;color:white">
        <i class="fas fa-clipboard-list"></i>
      </div>
      <h3 style="font-size:1.1rem;font-weight:700;margin-bottom:var(--space-2)">Checklist Belum Diisi</h3>
      <p style="color:var(--text-secondary);max-width:400px;margin:0 auto var(--space-6)">
        AI Engine membutuhkan data checklist pemeriksaan untuk melakukan analisis. Isi checklist administrasi dan teknis terlebih dahulu.
      </p>
      <button class="btn btn-primary" onclick="window.navigate('checklist',{id:'${e}'})">
        <i class="fas fa-clipboard-check"></i> Mulai Isi Checklist
      </button>
    </div>
  `}function dt(e){return`
    <div class="ai-panel" style="text-align:center;padding:var(--space-10)">
      <div class="ai-icon" style="width:60px;height:60px;margin:0 auto var(--space-5);font-size:1.6rem">
        <i class="fas fa-brain"></i>
      </div>
      <div class="ai-panel-title" style="font-size:1.1rem;margin-bottom:var(--space-2)">AI Engine Siap</div>
      <div class="ai-panel-subtitle" style="font-size:0.875rem;margin-bottom:var(--space-6)">
        Data checklist terdeteksi. Klik "Jalankan Analisis" untuk memulai evaluasi kelaikan fungsi berbasis rule-based SNI 9273:2025.
      </div>
      <button class="btn btn-primary btn-lg" onclick="window._runAnalysis()">
        <i class="fas fa-play"></i> Jalankan Analisis Sekarang
      </button>
    </div>
  `}function B(e,t){let n=[{key:`skor_administrasi`,label:`Administrasi`,icon:`fa-clipboard-list`,color:`hsl(220,70%,55%)`,kpiColor:`kpi-blue`},{key:`skor_struktur`,label:`Struktur`,icon:`fa-building`,color:`hsl(0,70%,55%)`,kpiColor:`kpi-red`},{key:`skor_arsitektur`,label:`Arsitektur`,icon:`fa-drafting-compass`,color:`hsl(258,70%,60%)`,kpiColor:`kpi-purple`},{key:`skor_mep`,label:`MEP`,icon:`fa-bolt`,color:`hsl(40,80%,55%)`,kpiColor:`kpi-yellow`},{key:`skor_kebakaran`,label:`Kebakaran`,icon:`fa-fire-extinguisher`,color:`hsl(0,74%,52%)`,kpiColor:`kpi-red`},{key:`skor_kesehatan`,label:`Kesehatan`,icon:`fa-heart-pulse`,color:`hsl(160,65%,46%)`,kpiColor:`kpi-green`},{key:`skor_kenyamanan`,label:`Kenyamanan`,icon:`fa-sun`,color:`hsl(40,80%,50%)`,kpiColor:`kpi-yellow`},{key:`skor_kemudahan`,label:`Kemudahan`,icon:`fa-universal-access`,color:`hsl(200,75%,52%)`,kpiColor:`kpi-cyan`}],r={LAIK_FUNGSI:{label:`LAIK FUNGSI`,badge:`badge-laik`,icon:`fa-circle-check`,color:`hsl(160,65%,46%)`},LAIK_FUNGSI_BERSYARAT:{label:`LAIK FUNGSI BERSYARAT`,badge:`badge-bersyarat`,icon:`fa-triangle-exclamation`,color:`hsl(40,85%,55%)`},TIDAK_LAIK_FUNGSI:{label:`TIDAK LAIK FUNGSI`,badge:`badge-tidak-laik`,icon:`fa-circle-xmark`,color:`hsl(0,74%,52%)`}},i=r[e.status_slf]||r.DALAM_PENGKAJIAN,a=e.rekomendasi?JSON.parse(typeof e.rekomendasi==`string`?e.rekomendasi:JSON.stringify(e.rekomendasi)):[];return`
    <!-- Status Banner -->
    <div class="ai-panel" style="margin-bottom:var(--space-5);display:flex;align-items:center;gap:var(--space-6);padding:var(--space-6)">
      <div style="text-align:center;flex-shrink:0">
        <div style="width:90px;height:90px;border-radius:50%;background:hsla(220,70%,48%,0.15);border:3px solid ${i.color};display:flex;align-items:center;justify-content:center;margin:0 auto">
          <i class="fas ${i.icon}" style="font-size:2rem;color:${i.color}"></i>
        </div>
        <div style="margin-top:var(--space-3);font-size:0.75rem;font-weight:700;color:${i.color}">${i.label}</div>
      </div>
      <div style="flex:1">
        <div style="display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-2)">
          <div style="font-size:3rem;font-weight:800;letter-spacing:-0.05em;color:var(--brand-400)">${e.skor_total}</div>
          <div style="color:var(--text-tertiary);font-size:1.5rem">/100</div>
          <div style="margin-left:var(--space-4)">
            <div class="text-xs text-tertiary">Level Risiko</div>
            <div style="font-size:1.1rem;font-weight:700;color:${xt(e.risk_level)}">${St(e.risk_level)}</div>
          </div>
        </div>
        <div style="display:flex;gap:var(--space-4)">
          <div>
            <div class="text-xs text-tertiary">Dianalisis</div>
            <div class="text-sm text-secondary">${bt(e.created_at)}</div>
          </div>
          <div>
            <div class="text-xs text-tertiary">Engine</div>
            <div class="text-sm text-secondary">Rule-Based (NSPK/SNI 9273:2025)</div>
          </div>
        </div>
      </div>
      <div class="flex gap-3">
        <button class="btn btn-secondary btn-sm" onclick="window.navigate('laporan',{id:'${t.id}'})">
          <i class="fas fa-file-contract"></i> Lihat Laporan
        </button>
        <button class="btn btn-primary btn-sm" onclick="window._runAnalysis()">
          <i class="fas fa-rotate"></i> Ulang Analisis
        </button>
      </div>
    </div>

    <!-- Score Grid -->
    <div class="aspek-score-grid">
      ${n.map(t=>{let n=e[t.key]||0,r=n>=80?`hsl(160,65%,46%)`:n>=60?`hsl(40,80%,55%)`:`hsl(0,74%,52%)`;return`
          <div class="aspek-score-card">
            <div class="asc-icon ${t.kpiColor}"><i class="fas ${t.icon}"></i></div>
            <div class="asc-nilai" style="color:${r}">${n}</div>
            <div class="asc-label">${t.label}</div>
            <div class="asc-bar">
              <div class="asc-fill" style="width:${n}%;background:${r}"></div>
            </div>
            <div class="text-xs" style="margin-top:4px;color:${r}">
              ${n>=80?`Baik`:n>=60?`Cukup`:n>=40?`Perlu Perbaikan`:`Kritis`}
            </div>
          </div>
        `}).join(``)}
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
          ${[{label:`≥ 80`,desc:`Laik Fungsi`,color:`hsl(160,65%,46%)`},{label:`60–79`,desc:`Laik Bersyarat`,color:`hsl(40,80%,55%)`},{label:`< 60`,desc:`Tidak Laik / Kritis`,color:`hsl(0,74%,52%)`}].map(e=>`
            <div class="flex gap-3" style="align-items:center;margin-bottom:6px">
              <div style="width:12px;height:12px;border-radius:3px;background:${e.color};flex-shrink:0"></div>
              <span class="text-xs text-tertiary"><b>${e.label}</b> — ${e.desc}</span>
            </div>
          `).join(``)}
        </div>
      </div>

      <!-- Rekomendasi -->
      <div class="card">
        <div class="card-header" style="margin-bottom:var(--space-4)">
          <div>
            <div class="card-title">Rekomendasi Teknis</div>
            <div class="card-subtitle">${a.length} rekomendasi berdasarkan hasil analisis</div>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:var(--space-3)">
          ${a.length===0?`
            <div class="ai-finding success"><i class="fas fa-circle-check" style="margin-right:6px"></i>Tidak ada rekomendasi kritis. Bangunan dalam kondisi baik.</div>
          `:a.map((e,t)=>{let n={kritis:`hsl(0,74%,52%)`,tinggi:`hsl(0,74%,52%)`,sedang:`hsl(40,80%,55%)`,rendah:`hsl(160,65%,46%)`}[e.prioritas?.toLowerCase()]||`hsl(200,75%,52%)`;return`
              <div class="rekom-card">
                <div class="rekom-priority" style="background:${n}"></div>
                <div style="flex:1">
                  <div class="flex gap-3" style="align-items:center;margin-bottom:4px;flex-wrap:wrap">
                    <span class="text-sm font-semibold text-primary">${t+1}. ${U(e.judul||``)}</span>
                    <span class="badge" style="background:hsla(0,0%,50%,0.15);color:var(--text-tertiary);border:1px solid var(--border-subtle);font-size:0.68rem">${U(e.aspek||``)}</span>
                    <span class="badge" style="background:${n}22;color:${n};border:1px solid ${n}44;font-size:0.68rem">${U(e.prioritas||``)}</span>
                  </div>
                  <p class="text-sm text-secondary">${U(e.tindakan||``)}</p>
                  ${e.standar?`<div class="text-xs text-tertiary" style="margin-top:4px"><i class="fas fa-book" style="margin-right:4px"></i>Ref: ${U(e.standar)}</div>`:``}
                </div>
              </div>
            `}).join(``)}
        </div>
      </div>
    </div>

    <!-- Narasi Teknis -->
    ${e.narasi_teknis?`
      <div class="card" style="margin-top:var(--space-5)">
        <div class="card-title" style="margin-bottom:var(--space-4)">
          <i class="fas fa-file-alt" style="color:var(--brand-400);margin-right:8px"></i>Narasi Teknis Analisis
        </div>
        <div style="font-size:0.875rem;color:var(--text-secondary);line-height:1.8;white-space:pre-line">${U(e.narasi_teknis)}</div>
      </div>
    `:``}

    <!-- Action -->
    <div style="margin-top:var(--space-5);display:flex;gap:var(--space-3);justify-content:flex-end">
      <button class="btn btn-secondary" onclick="window.navigate('checklist',{id:'${t.id}'})">
        <i class="fas fa-clipboard-check"></i> Edit Checklist
      </button>
      <button class="btn btn-primary" onclick="window.navigate('laporan',{id:'${t.id}'})">
        <i class="fas fa-file-contract"></i> Lihat Laporan SLF
      </button>
    </div>
  `}function V(e,t,n){window._runAnalysis=async()=>{let r=document.getElementById(`btn-analyze`);r&&(r.disabled=!0,r.innerHTML=`<i class="fas fa-circle-notch fa-spin"></i> Menganalisis...`);try{let r=await ft(n,t),i=document.getElementById(`page-root`);i&&(i.innerHTML=`
          <div id="analisis-page">
            <div class="page-header">
              <div class="flex-between">
                <div>
                  <button class="btn btn-ghost btn-sm" onclick="window.navigate('proyek-detail',{id:'${e.id}'})" style="margin-bottom:8px">
                    <i class="fas fa-arrow-left"></i> ${U(e.nama_bangunan)}
                  </button>
                  <h1 class="page-title">Analisis AI — Kelaikan Fungsi</h1>
                  <p class="page-subtitle">Hasil analisis rule-based selesai</p>
                </div>
                <div class="flex gap-3">
                  <button class="btn btn-secondary" onclick="window.navigate('checklist',{id:'${e.id}'})">
                    <i class="fas fa-clipboard-check"></i> Edit Checklist
                  </button>
                  <button class="btn btn-primary" id="btn-analyze" onclick="window._runAnalysis()">
                    <i class="fas fa-rotate"></i> Ulang Analisis
                  </button>
                </div>
              </div>
            </div>
            ${B(r,e)}
          </div>
        `,V(e,t,n),H(r)),w(`Analisis AI selesai!`)}catch(e){T(`Gagal menjalankan analisis: `+e.message),r&&(r.disabled=!1,r.innerHTML=`<i class="fas fa-brain"></i> Jalankan Analisis`)}}}async function ft(e,n){let r={};n.forEach(e=>{r[e.kode]=e});let i={};for(let[e,t]of Object.entries(st)){let n=t.filter(e=>r[e]);if(n.length===0){i[e]=0;continue}let a=e===`administrasi`?at:ot,o=n.reduce((e,t)=>e+(a[r[t]?.status||``]??0),0);i[e]=Math.round(o/n.length)}let a=0,o=0;for(let[e,t]of Object.entries(it))i[e]!==void 0&&(a+=i[e]*t,o+=t);let s=o>0?Math.round(a/o):0,c;c=i.struktur<50||i.keselamatan<50||s<50?`TIDAK_LAIK_FUNGSI`:s>=80&&i.struktur>=70&&i.keselamatan>=70?`LAIK_FUNGSI`:`LAIK_FUNGSI_BERSYARAT`;let l;l=s>=80?`low`:s>=65?`medium`:s>=45?`high`:`critical`;let u=pt(i,r);generateNarasi(ht,i,s,c);let d={proyek_id:e,skor_administrasi:i.administrasi,skor_struktur:i.struktur,skor_arsitektur:i.arsitektur,skor_mep:i.mep,skor_kebakaran:i.keselamatan,skor_kesehatan:i.kesehatan,skor_kenyamanan:i.kenyamanan,skor_kemudahan:i.kemudahan,skor_total:s,status_slf:c,risk_level:l,rekomendasi:JSON.stringify(u),narasi_teknis:mt(i,s,c),ai_provider:`rule-based`,created_at:new Date().toISOString()},{data:f,error:p}=await t.from(`hasil_analisis`).insert(d).select().single();if(p)throw p;return await t.from(`proyek`).update({status_slf:c,progress:Math.min(80,40+Math.round(s*.4))}).eq(`id`,e),f}function pt(e,t){let n=[];return e.administrasi<80&&n.push({aspek:`Administrasi`,prioritas:e.administrasi<60?`Kritis`:`Sedang`,judul:`Kelengkapan Dokumen Perizinan`,tindakan:`Lengkapi dokumen PBG/IMB dan gambar as-built drawing yang belum tersedia. Proses pemutakhiran dokumen melalui DPMPTSP setempat.`,standar:`PP No. 16/2021 Pasal 24-26`}),e.struktur<80&&n.push({aspek:`Struktur`,prioritas:e.struktur<50?`Kritis`:`Tinggi`,judul:`Evaluasi dan Perkuatan Elemen Struktur`,tindakan:`Lakukan pemeriksaan detail kondisi kolom, balok, dan pondasi oleh tenaga ahli struktur. Pertimbangkan retrofitting sesuai SNI 9273:2025.`,standar:`SNI 9273:2025 / ASCE 41-17`}),e.mep<80&&n.push({aspek:`MEP`,prioritas:e.mep<50?`Tinggi`:`Sedang`,judul:`Pemeriksaan dan Perbaikan Instalasi MEP`,tindakan:`Lakukan audit instalasi listrik, plumbing, dan HVAC. Pastikan instalasi sesuai SNI dan memiliki SLO yang valid.`,standar:`SNI 04-0225-2000 (PUIL) / Permenaker 04/1995`}),e.keselamatan<80&&n.push({aspek:`Keselamatan Kebakaran`,prioritas:e.keselamatan<50?`Kritis`:`Tinggi`,judul:`Perbaikan Sistem Proteksi Kebakaran`,tindakan:`Pasang/perbaiki APAR, sprinkler, hidran, dan detektor asap. Pastikan jalur evakuasi dan tangga darurat berfungsi optimal.`,standar:`Permen PU 26/2008 / SNI 03-3985-2000`}),e.arsitektur<70&&n.push({aspek:`Arsitektur`,prioritas:`Sedang`,judul:`Perbaikan Komponen Arsitektural`,tindakan:`Perbaiki kondisi dinding, pintu, jendela, dan finishing yang mengalami deteriorasi. Sesuaikan dengan gambar as-built.`,standar:`SNI 7832:2012`}),e.kemudahan<70&&n.push({aspek:`Kemudahan/Aksesibilitas`,prioritas:`Rendah`,judul:`Peningkatan Aksesibilitas`,tindakan:`Sediakan ramp dan fasilitas difabel sesuai standar. Perlebar koridor dan pastikan area parkir memadai.`,standar:`Permen PU 30/2006`}),n}function mt(e,t,n){let r={LAIK_FUNGSI:`Laik Fungsi`,LAIK_FUNGSI_BERSYARAT:`Laik Fungsi Bersyarat`,TIDAK_LAIK_FUNGSI:`Tidak Laik Fungsi`}[n]||``,i=Object.entries(e).filter(([,e])=>e<60).map(([e])=>e).join(`, `);return`Berdasarkan hasil evaluasi rule-based engine mengacu pada NSPK Bangunan Gedung, SNI 9273:2025, dan PP No. 16 Tahun 2021, bangunan memperoleh skor total ${t}/100.

Status kelaikan fungsi ditetapkan: ${r.toUpperCase()}.

Analisis per aspek menunjukkan: Administrasi (${e.administrasi}/100), Struktur (${e.struktur}/100), Arsitektur (${e.arsitektur}/100), MEP (${e.mep}/100), Keselamatan Kebakaran (${e.keselamatan}/100), Kesehatan (${e.kesehatan}/100), Kenyamanan (${e.kenyamanan}/100), Kemudahan (${e.kemudahan}/100).

${i?`Aspek yang memerlukan perhatian segera: ${i}. Diperlukan tindak lanjut sesuai rekomendasi yang tertera.`:`Semua aspek dalam kondisi memadai.`}

Evaluasi ini bersifat indikatif dan harus dikonfirmasi oleh tenaga ahli pengkaji bangunan gedung yang bersertifikat sebelum diterbitkan Sertifikat Laik Fungsi resmi.`}var ht=``;function H(e){let t=()=>{let t=document.getElementById(`radar-chart`);!t||!window.Chart||new window.Chart(t,{type:`radar`,data:{labels:[`Admin`,`Struktur`,`Arsitektur`,`MEP`,`Kebakaran`,`Kesehatan`,`Kenyamanan`,`Kemudahan`],datasets:[{label:`Skor`,data:[e.skor_administrasi,e.skor_struktur,e.skor_arsitektur,e.skor_mep,e.skor_kebakaran,e.skor_kesehatan,e.skor_kenyamanan,e.skor_kemudahan],backgroundColor:`hsla(220,70%,48%,0.2)`,borderColor:`hsl(220,70%,56%)`,borderWidth:2,pointBackgroundColor:`hsl(220,70%,56%)`,pointRadius:4}]},options:{responsive:!0,maintainAspectRatio:!1,scales:{r:{min:0,max:100,ticks:{stepSize:20,color:`hsl(220,10%,50%)`,font:{size:10},backdropColor:`transparent`},grid:{color:`hsla(220,20%,50%,0.15)`},pointLabels:{color:`hsl(220,12%,70%)`,font:{size:11}},angleLines:{color:`hsla(220,20%,50%,0.15)`}}},plugins:{legend:{display:!1}}}})};if(window.Chart)t();else{let e=document.createElement(`script`);e.src=`https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js`,e.onload=t,document.head.appendChild(e)}}async function gt(e){try{let{data:n}=await t.from(`proyek`).select(`id,nama_bangunan`).eq(`id`,e).single();return n}catch{return null}}async function _t(e){try{let{data:n}=await t.from(`checklist_items`).select(`*`).eq(`proyek_id`,e);return n||[]}catch{return[]}}async function vt(e){try{let{data:n}=await t.from(`hasil_analisis`).select(`*`).eq(`proyek_id`,e).order(`created_at`,{ascending:!1}).limit(1).single();return n||null}catch{return null}}function yt(){return`
    <div class="page-header">
      <div class="skeleton" style="height:20px;width:200px;margin-bottom:8px"></div>
      <div class="skeleton" style="height:36px;width:400px;margin-bottom:8px"></div>
    </div>
    <div class="skeleton" style="height:160px;border-radius:var(--radius-lg);margin-bottom:var(--space-5)"></div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-4);margin-bottom:var(--space-5)">
      ${Array(8).fill(0).map(()=>`<div class="skeleton" style="height:120px;border-radius:var(--radius-lg)"></div>`).join(``)}
    </div>
    <div style="display:grid;grid-template-columns:360px 1fr;gap:var(--space-5)">
      <div class="skeleton" style="height:360px;border-radius:var(--radius-lg)"></div>
      <div class="skeleton" style="height:360px;border-radius:var(--radius-lg)"></div>
    </div>
  `}function U(e){return String(e||``).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`)}function bt(e){try{return new Date(e).toLocaleDateString(`id-ID`,{day:`numeric`,month:`short`,year:`numeric`})}catch{return e||``}}function xt(e){return{low:`hsl(160,65%,46%)`,medium:`hsl(40,80%,55%)`,high:`hsl(0,70%,58%)`,critical:`hsl(330,70%,50%)`}[e]||`hsl(200,80%,58%)`}function St(e){return{low:`Rendah`,medium:`Sedang`,high:`Tinggi`,critical:`Kritis`}[e]||e}async function Ct(e={}){let t=e.id;if(!t)return g(`proyek`),``;let n=document.getElementById(`page-root`);n&&(n.innerHTML=At());let[r,i,a]=await Promise.all([Dt(t),Ot(t),kt(t)]);if(!r)return g(`proyek`),T(`Proyek tidak ditemukan.`),``;let o=wt(r,i,a);return n&&(n.innerHTML=o,Et(r,i)),o}function wt(e,t,n){return t?`
    <div id="laporan-page">
      <!-- Action Bar (No Print) -->
      <div class="page-header no-print">
        <div class="flex-between">
          <div>
            <button class="btn btn-ghost btn-sm" onclick="window.navigate('proyek-detail',{id:'${e.id}'})" style="margin-bottom:8px">
              <i class="fas fa-arrow-left"></i> ${G(e.nama_bangunan)}
            </button>
            <h1 class="page-title">Preview Laporan SLF</h1>
            <p class="page-subtitle">Dokumen laporan kajian kelaikan fungsi bangunan gedung siap cetak.</p>
          </div>
          <div class="flex gap-3">
             <button class="btn btn-secondary" onclick="window._downloadWord()">
              <i class="fas fa-file-word"></i> Download Word
            </button>
            <button class="btn btn-primary" onclick="window.print()">
              <i class="fas fa-file-pdf"></i> Export PDF / Cetak
            </button>
          </div>
        </div>
      </div>

      <!-- Main Layout -->
      <div class="laporan-wrap">
        
        <!-- Left: Nav (No Print) -->
        <div class="no-print" style="position:relative">
          <div class="laporan-nav">
            <div style="font-size:0.75rem;font-weight:700;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:var(--space-2)">Struktur Laporan</div>
            <div style="display:flex;flex-direction:column;gap:4px">
              ${[{id:`cover`,icon:`fa-book`,label:`Cover Laporan`},{id:`bab1`,icon:`fa-building`,label:`Bab I: Gambaran Umum`},{id:`bab2`,icon:`fa-search`,label:`Bab II: Metodologi`},{id:`bab3`,icon:`fa-clipboard-check`,label:`Bab III: Hasil Checklist`},{id:`bab4`,icon:`fa-brain`,label:`Bab IV: Analisis AI`},{id:`bab5`,icon:`fa-certificate`,label:`Bab V: Kesimpulan`},{id:`bab6`,icon:`fa-list-check`,label:`Bab VI: Rekomendasi`}].map((e,t)=>`
                <a href="#lap-${e.id}" class="laporan-nav-item ${t===0?`active`:``}" onclick="document.querySelectorAll('.laporan-nav-item').forEach(el=>el.classList.remove('active')); this.classList.add('active');">
                  <i class="fas ${e.icon} shrink-0" style="width:20px;text-align:center"></i>
                  <span class="truncate">${e.label}</span>
                </a>
              `).join(``)}
            </div>
          </div>
        </div>

        <!-- Right: Content (Printable) -->
        <div class="laporan-content" id="print-area">
          
          <!-- COVER -->
          <div id="lap-cover" class="laporan-cover" style="min-height:297mm;display:flex;flex-direction:column;justify-content:center">
            <div style="font-size:1.2rem;opacity:0.9;margin-bottom:24px;text-transform:uppercase;letter-spacing:2px">Laporan Kajian Teknis</div>
            <h1 style="font-size:2.8rem;line-height:1.2;margin-bottom:32px;text-shadow:0 4px 12px rgba(0,0,0,0.3)">Sertifikat Laik Fungsi<br>(SLF) Bangunan Gedung</h1>
            
            <div style="background:rgba(255,255,255,0.1);backdrop-filter:blur(8px);border-radius:16px;padding:32px;margin:0 auto 48px;max-width:500px;border:1px solid rgba(255,255,255,0.2)">
              <h2 style="font-size:1.4rem;margin-bottom:12px;border:none;padding:0">${G(e.nama_bangunan)}</h2>
              <p style="font-size:1rem;margin:0;opacity:0.9">${G(e.alamat)}</p>
            </div>

            <div style="margin-top:auto;padding-top:60px">
              <p style="font-size:1.1rem;margin-bottom:8px">Diajukan oleh:</p>
              <p style="font-size:1.3rem;font-weight:700;margin-bottom:32px">${G(e.pemilik)}</p>
              
              <div style="width:60px;height:4px;background:rgba(255,255,255,0.3);margin:0 auto 24px;border-radius:2px"></div>
              <p style="font-size:1rem;opacity:0.8">${jt(new Date)}</p>
            </div>
          </div>

          <!-- BAB I: GAMBARAN UMUM -->
          <div id="lap-bab1" class="laporan-section" style="page-break-before:always">
            <h2>BAB I: Gambaran Umum Bangunan</h2>
            <p>Pemeriksaan kelaikan fungsi bangunan gedung ini dilakukan pada:</p>
            <table>
              <tbody>
                <tr><td style="width:30%">Nama Bangunan</td><td><b>${G(e.nama_bangunan)}</b></td></tr>
                <tr><td>Jenis Bangunan</td><td>${G(e.jenis_bangunan||`-`)}</td></tr>
                <tr><td>Fungsi Bangunan</td><td>${G(e.fungsi_bangunan||`-`)}</td></tr>
                <tr><td>Alamat Lokasi</td><td>${G(e.alamat)}, ${G(e.kota)}, ${G(e.provinsi)}</td></tr>
                <tr><td>Nama Pemilik</td><td>${G(e.pemilik)}</td></tr>
                <tr><td>Tahun Dibangun</td><td>${e.tahun_dibangun||`-`}</td></tr>
                <tr><td>Jumlah Lantai</td><td>${e.jumlah_lantai||`-`} Lantai</td></tr>
                <tr><td>Luas Bangunan</td><td>${e.luas_bangunan?Number(e.luas_bangunan).toLocaleString(`id-ID`):`-`} m²</td></tr>
                <tr><td>Luas Lahan</td><td>${e.luas_lahan?Number(e.luas_lahan).toLocaleString(`id-ID`):`-`} m²</td></tr>
                <tr><td>Konstruksi Utama</td><td>${G(e.jenis_konstruksi||`-`)}</td></tr>
                <tr><td>Nomor PBG/IMB</td><td>${G(e.nomor_pbg||`Belum tersedia`)}</td></tr>
              </tbody>
            </table>
          </div>

          <!-- BAB II: METODOLOGI -->
          <div id="lap-bab2" class="laporan-section" style="page-break-before:always">
            <h2>BAB II: Metodologi Pemeriksaan</h2>
            <p>Pengkajian teknis bangunan gedung ini dilakukan menggunakan pendekatan berbasis kinerja <i>(performance-based evaluation)</i> yang mengacu pada standar dan regulasi berikut:</p>
            <ul style="margin-left:20px;margin-bottom:16px;font-size:0.875rem;line-height:1.8">
              <li>Peraturan Pemerintah Nomor 16 Tahun 2021 tentang Peraturan Pelaksanaan UU No. 28 Tahun 2002 tentang Bangunan Gedung.</li>
              <li>SNI 9273:2025 – Evaluasi dan rehabilitasi seismik bangunan gedung eksisting.</li>
              <li>ASCE/SEI 41-17 – Seismic Evaluation and Retrofit of Existing Buildings.</li>
              <li>Standar Nasional Indonesia (SNI) terkait Struktur, Arsitektur, MEP, dan Proteksi Kebakaran.</li>
            </ul>
            <p>Tahapan pemeriksaan meliputi: (1) Verifikasi Dokumen Administrasi, (2) Pemeriksaan Visual Lapangan <i>(Visual Assessment)</i>, dan (3) Evaluasi Kinerja berbasis AI Engine <i>(Smart AI Pengkaji SLF)</i>.</p>
          </div>

          <!-- BAB III: HASIL CHECKLIST -->
          <div id="lap-bab3" class="laporan-section" style="page-break-before:always">
            <h2>BAB III: Hasil Pemeriksaan Checklist</h2>
            <p>Berikut adalah ringkasan hasil pemeriksaan visual dan dokumen yang dilakukan pada elemen bangunan gedung.</p>
            
            <h3>3.1. Dokumen Administrasi</h3>
            ${W(n.filter(e=>e.kategori===`administrasi`))}

            <h3 style="margin-top:24px">3.2. Kondisi Teknis Eksisting</h3>
            ${W(n.filter(e=>e.kategori===`teknis`))}
          </div>

          <!-- BAB IV: ANALISIS AI -->
          <div id="lap-bab4" class="laporan-section" style="page-break-before:always">
            <h2>BAB IV: Hasil Analisis AI SLF</h2>
            <p>Berdasarkan data input pemeriksaan (Checklist), AI Engine (Rule-based SNI 9273:2025) telah melakukan kuantifikasi pembobotan kondisi keandalan bangunan dengan hasil sebagai berikut:</p>

            <div style="display:flex;gap:20px;margin:24px 0">
              <!-- Score Grid Print Version -->
              <div style="flex:1;display:grid;grid-template-columns:1fr 1fr;gap:12px">
                ${[{lbl:`Administrasi`,val:t.skor_administrasi},{lbl:`Struktur`,val:t.skor_struktur},{lbl:`Arsitektur`,val:t.skor_arsitektur},{lbl:`MEP (Utilitas)`,val:t.skor_mep},{lbl:`Keselamatan`,val:t.skor_kebakaran},{lbl:`Kesehatan`,val:t.skor_kesehatan},{lbl:`Kenyamanan`,val:t.skor_kenyamanan},{lbl:`Kemudahan`,val:t.skor_kemudahan}].map(e=>`
                  <div style="padding:10px;border:1px solid #e5e7eb;border-radius:6px;display:flex;justify-content:space-between;align-items:center;background:${e.val<60?`#fef2f2`:`#f9fafb`}">
                    <span style="font-size:0.8rem;font-weight:600">${e.lbl}</span>
                    <span style="font-size:1.1rem;font-weight:800;color:${e.val<60?`#dc2626`:e.val<80?`#d97706`:`#059669`}">${e.val}/100</span>
                  </div>
                `).join(``)}
              </div>
              
              <div style="width:240px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:24px;text-align:center;display:flex;flex-direction:column;justify-content:center">
                <div style="font-size:0.8rem;text-transform:uppercase;letter-spacing:1px;color:#64748b;margin-bottom:8px">Skor Keseluruhan</div>
                <div style="font-size:4rem;font-weight:800;color:#1e3a8a;line-height:1">${t.skor_total}</div>
                <div style="margin-top:16px;font-size:0.9rem;font-weight:700;color:${t.risk_level===`low`?`#059669`:t.risk_level===`medium`?`#d97706`:`#dc2626`}">
                  Risiko ${t.risk_level===`low`?`Rendah`:t.risk_level===`medium`?`Sedang`:t.risk_level===`high`?`Tinggi`:`Kritis`}
                </div>
              </div>
            </div>

            ${t.narasi_teknis?`
              <h3>4.1. Narasi Evaluasi Kinerja</h3>
              <div style="background:#f0f9ff;border-left:4px solid #0284c7;padding:16px;font-size:0.875rem;line-height:1.6;white-space:pre-line">${G(t.narasi_teknis)}</div>
            `:``}
          </div>

          <!-- BAB V: KESIMPULAN -->
          <div id="lap-bab5" class="laporan-section" style="page-break-before:always">
            <h2>BAB V: Kesimpulan Status Kelaikan</h2>
            <p>Berdasarkan kajian teknis lapangan dan hasil analisis sistem terhadap parameter keselamatan, kesehatan, kenyamanan, dan kemudahan, maka disimpulkan bahwa bangunan gedung:</p>
            
            <div style="margin:32px 0;text-align:center">
              <span class="${t.status_slf===`LAIK_FUNGSI`?`status-laik`:t.status_slf===`LAIK_FUNGSI_BERSYARAT`?`status-bersyarat`:`status-tidak-laik`}" style="font-size:1.5rem;padding:16px 32px">
                ${t.status_slf===`LAIK_FUNGSI`?`LAIK FUNGSI`:t.status_slf===`LAIK_FUNGSI_BERSYARAT`?`LAIK FUNGSI BERSYARAT`:`TIDAK LAIK FUNGSI`}
              </span>
            </div>

            <p style="text-align:center;max-width:600px;margin:0 auto;font-weight:600;color:#4b5563">
              ${t.status_slf===`LAIK_FUNGSI`?`Bangunan siap dioperasikan dan dapat diterbitkan Sertifikat Laik Fungsi (SLF).`:t.status_slf===`LAIK_FUNGSI_BERSYARAT`?`Bangunan dapat dioperasikan dengan catatan harus segera menindaklanjuti rekomendasi perbaikan sebelum batas waktu yang ditentukan.`:`Bangunan belum memenuhi standar minimal keselamatan dan belum dapat diterbitkan SLF. Harus dilakukan perbaikan menyeluruh (rehabilitasi/retrofit).`}
            </p>
          </div>

          <!-- BAB VI: REKOMENDASI -->
          <div id="lap-bab6" class="laporan-section" style="page-break-before:always">
            <h2>BAB VI: Rekomendasi Terukur</h2>
            <p>Untuk mempertahankan atau meningkatkan status kelaikan fungsi bangunan, direkomendasikan tindak lanjut sebagai berikut:</p>
            
            ${Tt(t.rekomendasi)}

            <div style="margin-top:60px;page-break-inside:avoid">
              <div style="width:250px;margin-left:auto;text-align:center">
                <p style="margin-bottom:80px">Dianalisis dan disetujui oleh,<br><b>Tim Pengkaji Teknis</b></p>
                <div style="border-bottom:1px solid #1a1a2e;margin-bottom:8px"></div>
                <p style="font-size:0.8rem;color:#64748b">Generated by Smart AI Pengkaji</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  `:`
      <div class="page-container flex-center">
        <div class="card" style="text-align:center;padding:var(--space-12);max-width:500px">
          <div style="width:70px;height:70px;background:var(--gradient-brand);border-radius:var(--radius-xl);display:flex;align-items:center;justify-content:center;margin:0 auto var(--space-5);font-size:1.8rem;color:white">
            <i class="fas fa-file-contract"></i>
          </div>
          <h3 style="font-size:1.1rem;font-weight:700;margin-bottom:var(--space-2)">Laporan Belum Tersedia</h3>
          <p style="color:var(--text-secondary);margin:0 auto var(--space-6)">
            Laporan SLF baru dapat di-generate setelah Anda melengkapi checklist dan melakukan Analisis AI.
          </p>
          <button class="btn btn-primary" onclick="window.navigate('analisis',{id:'${e.id}'})">
            <i class="fas fa-brain"></i> Buka Halaman Analisis
          </button>
        </div>
      </div>
    `}function W(e){if(!e||e.length===0)return`<p style="font-size:0.85rem;font-style:italic">Data tidak tersedia.</p>`;let t=e=>({ada_sesuai:`Sesuai`,ada_tidak_sesuai:`Tdk Sesuai`,tidak_ada:`Tdk Ada`,pertama_kali:`Pertama Kali`,baik:`Baik`,sedang:`Sedang`,buruk:`Buruk`,kritis:`Kritis`,tidak_wajib:`-`})[e]||e||`-`;return`
    <table>
      <thead>
        <tr>
          <th style="width:15%">Aspek</th>
          <th style="width:40%">Item / Komponen</th>
          <th style="width:15%">Kondisi</th>
          <th style="width:30%">Catatan Teknis</th>
        </tr>
      </thead>
      <tbody>
        ${e.map(e=>`
          <tr>
            <td>${G(e.aspek||e.kategori)}</td>
            <td><b>[${e.kode}]</b> ${G(e.nama)}</td>
            <td><span style="font-weight:600;color:${[`baik`,`ada_sesuai`].includes(e.status)?`#059669`:[`buruk`,`kritis`,`tidak_ada`,`ada_tidak_sesuai`].includes(e.status)?`#dc2626`:`#d97706`}">${t(e.status)}</span></td>
            <td>${G(e.catatan||`-`)}</td>
          </tr>
        `).join(``)}
      </tbody>
    </table>
  `}function Tt(e){let t=[];try{t=typeof e==`string`?JSON.parse(e):e}catch{}return!t||t.length===0?`<p>Tidak ada rekomendasi kritis.</p>`:`
    <div style="display:flex;flex-direction:column;gap:16px;margin-top:20px">
      ${t.map((e,t)=>`
        <div style="border:1px solid #e5e7eb;border-left:4px solid ${e.prioritas?.toLowerCase()===`kritis`?`#dc2626`:`#2563eb`};padding:16px;background:#f9fafb;page-break-inside:avoid">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
            <b style="color:#1e3a8a;font-size:0.95rem">${t+1}. ${G(e.judul)} (${G(e.aspek)})</b>
            <span style="font-size:0.75rem;padding:2px 8px;background:${e.prioritas?.toLowerCase()===`kritis`?`#fee2e2`:`#e0f2fe`};color:${e.prioritas?.toLowerCase()===`kritis`?`#991b1b`:`#0369a1`};border-radius:4px;font-weight:700;text-transform:uppercase">${G(e.prioritas)}</span>
          </div>
          <p style="margin:0;font-size:0.875rem">${G(e.tindakan)}</p>
          ${e.standar?`<div style="margin-top:8px;font-size:0.75rem;color:#6b7280"><i>Referensi Standar: ${G(e.standar)}</i></div>`:``}
        </div>
      `).join(``)}
    </div>
  `}function Et(e,t){window._downloadWord=()=>{w(`Fitur export Word (Docx) segera hadir menggunakan library JSZip/Docxtemplater.`)}}async function Dt(e){try{let{data:n}=await t.from(`proyek`).select(`*`).eq(`id`,e).single();return n}catch{return null}}async function Ot(e){try{let{data:n}=await t.from(`hasil_analisis`).select(`*`).eq(`proyek_id`,e).order(`created_at`,{ascending:!1}).limit(1).single();return n||null}catch{return null}}async function kt(e){try{let{data:n}=await t.from(`checklist_items`).select(`*`).eq(`proyek_id`,e);return n||[]}catch{return[]}}function At(){return`
    <div class="page-header">
      <div class="skeleton" style="height:36px;width:300px;margin-bottom:8px"></div>
      <div class="skeleton" style="height:20px;width:400px"></div>
    </div>
    <div style="display:grid;grid-template-columns:240px 1fr;gap:var(--space-5)">
      <div class="skeleton" style="height:400px;border-radius:var(--radius-lg)"></div>
      <div class="skeleton" style="height:800px;border-radius:var(--radius-lg)"></div>
    </div>
  `}function G(e){return String(e||``).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`)}function jt(e){try{return new Date(e).toLocaleDateString(`id-ID`,{day:`numeric`,month:`long`,year:`numeric`})}catch{return e}}async function K(){let e=document.getElementById(`page-root`);e&&(e.innerHTML=Rt());let t=Mt(await Lt());return e&&(e.innerHTML=t,Pt()),t}function Mt(e){return`
    <div id="todo-page">
      <div class="page-header">
        <div class="flex-between">
          <div>
            <h1 class="page-title">Task Management</h1>
            <p class="page-subtitle">Papan Kanban pemantauan tindak lanjut rekomendasi SLF</p>
          </div>
          <button class="btn btn-primary" onclick="window._showNewTaskModal()">
            <i class="fas fa-plus"></i> Task Baru
          </button>
        </div>
      </div>

      <div class="kanban-board">
        ${[{id:`todo`,label:`To Do`,color:`hsl(220,10%,50%)`},{id:`in_progress`,label:`In Progress`,color:`hsl(40,80%,55%)`},{id:`review`,label:`Review`,color:`hsl(258,80%,60%)`},{id:`done`,label:`Done`,color:`hsl(160,65%,46%)`}].map(t=>{let n=e.filter(e=>(e.status||`todo`)===t.id);return`
            <div class="kanban-col" data-status="${t.id}">
              <div class="kanban-col-header" style="border-top: 3px solid ${t.color}">
                <div class="kch-title">
                  <div style="width:10px;height:10px;border-radius:50%;background:${t.color}"></div>
                  ${t.label}
                </div>
                <div class="kch-count" id="count-${t.id}">${n.length}</div>
              </div>
              <div class="kanban-col-body" id="col-${t.id}">
                ${n.map(e=>Nt(e)).join(``)}
              </div>
            </div>
          `}).join(``)}
      </div>

      <!-- Modal Tambah Task -->
      <div class="modal-overlay" id="modal-task">
        <div class="modal">
          <div class="modal-header">
            <div class="modal-title">Tambah Task Baru</div>
            <button class="modal-close" onclick="document.getElementById('modal-task').classList.remove('open')">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body form-grid">
            <div class="form-group" style="grid-column: span 2">
              <label class="form-label">Judul Task</label>
              <input type="text" id="nt-judul" class="form-control" placeholder="Contoh: Perbaikan panel listrik lantai 1">
            </div>
            <div class="form-group">
              <label class="form-label">Prioritas</label>
              <select id="nt-prio" class="form-control">
                <option value="low">Low</option>
                <option value="medium" selected>Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Batas Waktu</label>
              <input type="date" id="nt-date" class="form-control">
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="document.getElementById('modal-task').classList.remove('open')">Batal</button>
            <button class="btn btn-primary" onclick="window._saveNewTask()">Simpan Task</button>
          </div>
        </div>
      </div>
    </div>
  `}function Nt(e){return`
    <div class="task-card" draggable="true" data-id="${e.id}" onclick="window.navigate('todo-detail',{id:'${e.id}'})">
      <div class="tc-header">
        <div class="tc-prio ${e.priority||`medium`}">${e.priority||`medium`}</div>
        <div class="tc-proyek"><i class="fas fa-building"></i> ${q(e.proyek_nama||`General`)}</div>
      </div>
      <div class="tc-title">${q(e.judul||e.title||`Untitled Task`)}</div>
      <div class="tc-footer">
        <div><i class="fas fa-clock"></i> ${e.due_date?new Date(e.due_date).toLocaleDateString():`No date`}</div>
        <div style="background:var(--bg-elevated);width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:1px solid var(--border-subtle)"><i class="fas fa-user" style="font-size:0.6rem"></i></div>
      </div>
    </div>
  `}function Pt(){let e=document.querySelectorAll(`.task-card`),n=document.querySelectorAll(`.kanban-col-body`),r=null;e.forEach(e=>{e.addEventListener(`dragstart`,()=>{r=e,setTimeout(()=>e.classList.add(`dragging`),0)}),e.addEventListener(`dragend`,()=>{e.classList.remove(`dragging`),r=null,It()})}),n.forEach(e=>{e.addEventListener(`dragover`,t=>{t.preventDefault(),e.classList.add(`drag-over`);let n=Ft(e,t.clientY);n==null?e.appendChild(r):e.insertBefore(r,n)}),e.addEventListener(`dragleave`,()=>e.classList.remove(`drag-over`)),e.addEventListener(`drop`,async n=>{if(n.preventDefault(),e.classList.remove(`drag-over`),r){let n=r.dataset.id,i=e.parentElement.dataset.status;await t.from(`todo_tasks`).update({status:i}).eq(`id`,n)}})}),window._showNewTaskModal=()=>document.getElementById(`modal-task`).classList.add(`open`),window._saveNewTask=async()=>{let e=document.getElementById(`nt-judul`).value,n=document.getElementById(`nt-prio`).value,r=document.getElementById(`nt-date`).value;if(!e)return T(`Judul wajib diisi`);try{let{data:i,error:a}=await t.from(`todo_tasks`).insert([{judul:e,title:e,priority:n,due_date:r,status:`todo`}]).select().single();if(a)throw a;document.getElementById(`modal-task`).classList.remove(`open`),w(`Task ditambahkan!`),K()}catch(e){e.message.includes(`relation "todo_tasks" does not exist`)?T(`Tabel todo_tasks belum dibuat di Supabase.`):T(e.message)}}}function Ft(e,t){return[...e.querySelectorAll(`.task-card:not(.dragging)`)].reduce((e,n)=>{let r=n.getBoundingClientRect(),i=t-r.top-r.height/2;return i<0&&i>e.offset?{offset:i,element:n}:e},{offset:-1/0}).element}function It(){[`todo`,`in_progress`,`review`,`done`].forEach(e=>{let t=document.getElementById(`col-${e}`),n=document.getElementById(`count-${e}`);t&&n&&(n.textContent=t.children.length)})}async function Lt(){try{let{data:e}=await t.from(`todo_tasks`).select(`*`).order(`created_at`,{ascending:!1});return e||[]}catch{return[{id:`1`,title:`Perbaikan Retak Kolom K1`,priority:`critical`,status:`todo`,due_date:`2026-04-10`,proyek_nama:`Gedung Sate`},{id:`2`,title:`Pengisian Ulang APAR`,priority:`medium`,status:`todo`,due_date:`2026-04-05`,proyek_nama:`Mall Pusat`},{id:`3`,title:`Review IMB As-Built`,priority:`high`,status:`in_progress`,due_date:`2026-03-30`,proyek_nama:`Puskesmas C`},{id:`4`,title:`Instalasi Grounding`,priority:`high`,status:`review`,proyek_nama:`Gedung Sate`},{id:`5`,title:`Pembersihan Saluran`,priority:`low`,status:`done`,proyek_nama:`Mall Pusat`}]}}function Rt(){return`<div class="page-header"><div class="skeleton" style="height:36px;width:300px"></div></div>
          <div class="kanban-board">
            ${[,,,,].fill(0).map(()=>`<div class="skeleton" style="flex:0 0 320px;height:600px;border-radius:var(--radius-lg)"></div>`).join(``)}
          </div>`}function q(e){return String(e||``).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`)}async function zt(e={}){let t=e.id;if(!t)return g(`todo`),``;let n=document.getElementById(`page-root`);n&&(n.innerHTML=Ht());let r=await Vt(t);if(!r)return g(`todo`),``;let i=Bt(r);return n&&(n.innerHTML=i),i}function Bt(e){let t={todo:{l:`To Do`,c:`hsl(220,10%,50%)`},in_progress:{l:`In Progress`,c:`hsl(40,80%,55%)`},review:{l:`Review`,c:`hsl(258,80%,60%)`},done:{l:`Done`,c:`hsl(160,65%,46%)`}}[e.status||`todo`];return`
    <div id="todo-detail">
      <div class="page-header">
        <button class="btn btn-ghost btn-sm" onclick="window.navigate('todo')" style="margin-bottom:8px">
          <i class="fas fa-arrow-left"></i> Kembali ke Kanban
        </button>
        <div class="flex-between">
          <div>
            <div class="text-sm text-tertiary" style="margin-bottom:4px">
              ID Task: ${e.id} • ${new Date(e.created_at||Date.now()).toLocaleDateString(`id-ID`)}
            </div>
            <h1 class="page-title">${J(e.judul||e.title)}</h1>
          </div>
          <div class="flex gap-3">
             <span class="badge" style="background:${t.c}22;color:${t.c};font-size:0.9rem;border:1px solid ${t.c}44">
               ${t.l}
             </span>
             <button class="btn btn-primary" onclick="alert('Simpan form...')"><i class="fas fa-save"></i> Simpan</button>
          </div>
        </div>
      </div>

      <div class="grid-2">
        <!-- Main Form -->
        <div class="card form-grid">
          <div class="card-title" style="grid-column:span 2"><i class="fas fa-info-circle"></i> Info Task</div>
          
          <div class="form-group" style="grid-column:span 2">
             <label class="form-label">Deskripsi & Catatan</label>
             <textarea class="form-control" rows="5" placeholder="Tuliskan detail pekerjaan...">${J(e.deskripsi||``)}</textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Prioritas</label>
             <select class="form-control" id="td-prio">
               <option value="low" ${e.priority===`low`?`selected`:``}>Low</option>
               <option value="medium" ${e.priority===`medium`?`selected`:``}>Medium</option>
               <option value="high" ${e.priority===`high`?`selected`:``}>High</option>
               <option value="critical" ${e.priority===`critical`?`selected`:``}>Critical</option>
             </select>
          </div>
          <div class="form-group">
            <label class="form-label">Tenggat Waktu / Due Date</label>
            <input type="date" class="form-control" value="${e.due_date?e.due_date.substring(0,10):``}">
          </div>

          <div class="form-group" style="grid-column:span 2">
            <label class="form-label">Bukti Penyelesaian (Lampiran)</label>
            <div style="border:2px dashed var(--border-default);border-radius:var(--radius-md);padding:var(--space-5);text-align:center;color:var(--text-tertiary)">
              <i class="fas fa-cloud-upload-alt" style="font-size:2rem;margin-bottom:8px"></i>
              <div>Drag & Drop file lampiran dokumentasi ke sini</div>
              <button class="btn btn-secondary btn-sm" style="margin-top:var(--space-3)">Pilih File</button>
            </div>
          </div>
        </div>

        <!-- Sidebar / Activity -->
        <div style="display:flex;flex-direction:column;gap:var(--space-4)">
          <div class="card">
            <div class="card-title">Atribut</div>
            <div class="form-group" style="margin-top:var(--space-3)">
              <label class="form-label">Terkait Proyek SLF</label>
              <div class="form-control" style="background:var(--bg-elevated);pointer-events:none">
                <i class="fas fa-building text-brand"></i> ${J(e.proyek_nama||`Tidak ada/Pusat`)}
              </div>
            </div>
            <div class="form-group">
               <label class="form-label">Ditugaskan Kepada</label>
               <div style="display:flex;align-items:center;gap:12px;padding:8px 12px;border:1px solid var(--border-default);border-radius:var(--radius-sm)">
                 <div style="width:32px;height:32px;border-radius:50%;background:var(--bg-elevated);display:flex;align-items:center;justify-content:center"><i class="fas fa-user"></i></div>
                 <div>
                   <div style="font-size:0.875rem;font-weight:600">Admin Pemeliharaan</div>
                   <div style="font-size:0.75rem;color:var(--text-tertiary)">admin@pengkaji-slf.go.id</div>
                 </div>
               </div>
            </div>
          </div>

          <div class="card" style="flex:1">
            <div class="card-title"><i class="fas fa-history"></i> Log Aktivitas</div>
            <div style="margin-top:var(--space-4);display:flex;flex-direction:column;gap:var(--space-4)">
              <div style="display:flex;gap:12px">
                <div style="width:12px;height:12px;border-radius:50%;background:var(--success-400);margin-top:4px"></div>
                <div>
                  <div class="text-sm"><b>Admin</b> membuat task ini.</div>
                  <div class="text-xs text-tertiary">${new Date().toLocaleString()}</div>
                </div>
              </div>
            </div>
            <div style="margin-top:var(--space-5);border-top:1px solid var(--border-subtle);padding-top:var(--space-3);display:flex;gap:var(--space-2)">
              <input type="text" class="form-control" placeholder="Tulis komentar/update log...">
              <button class="btn btn-primary"><i class="fas fa-paper-plane"></i></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `}async function Vt(e){try{let{data:n}=await t.from(`todo_tasks`).select(`*`).eq(`id`,e).single();if(n)return n}catch{}return{id:e,title:`Mock Task #`+e,priority:`critical`,deskripsi:`Analisis mendalam terhadap struktur bangunan gedung untuk menemukan keretakan mikroskopis di kolom utama. Harap tinjau lampiran PDF inspeksi sebelumnya.`,created_at:new Date().toISOString()}}function Ht(){return`<div class="skeleton" style="height:60px;margin-bottom:20px;width:30%"></div>
          <div class="grid-2">
            <div class="skeleton" style="height:600px;border-radius:12px"></div>
            <div class="skeleton" style="height:400px;border-radius:12px"></div>
          </div>`}function J(e){return String(e||``).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`)}async function Ut(){let e=document.getElementById(`page-root`);e&&(e.innerHTML=Jt());let[t,n]=await Promise.all([Kt(),qt()]),r=Wt(t,n);return e&&(e.innerHTML=r,Gt(t,n)),r}function Wt(e,t){let n=e.length,r=0,i=0,a=0,o=0,s=0,c=0;return e.forEach(e=>{e.status_slf===`LAIK_FUNGSI`?r++:e.status_slf===`LAIK_FUNGSI_BERSYARAT`?i++:e.status_slf===`TIDAK_LAIK_FUNGSI`?a++:o++}),t.length>0&&(c=Math.round(t.reduce((e,t)=>e+(t.skor_total||0),0)/t.length),s=t.filter(e=>[`critical`,`high`].includes(e.risk_level)).length),`
    <div id="executive-page">
      <div class="page-header" style="background:var(--bg-elevated);margin:-24px -24px 24px;padding:32px 24px;border-bottom:1px solid var(--border-subtle)">
        <div class="flex-between">
          <div>
            <div class="test-sm text-tertiary font-bold" style="letter-spacing:1px;text-transform:uppercase;margin-bottom:4px"><i class="fas fa-chart-line text-brand"></i> Executive View</div>
            <h1 class="page-title" style="font-size:2rem;margin-bottom:8px">Portofolio SLF Kota/Kabupaten</h1>
            <p class="text-secondary" style="max-width:600px;line-height:1.5">
              Dashboard analitik tingkat manajemen untuk memantau status kelaikan fungsi seluruh gedung yang terdaftar dalam wilayah kerja. Data ditarik real-time dari hasil engine AI.
            </p>
          </div>
          <div style="text-align:right">
             <div class="text-2xl font-bold text-primary">${new Date().toLocaleString(`id-ID`,{month:`long`,year:`numeric`})}</div>
             <div class="text-sm text-tertiary">Live System Update</div>
          </div>
        </div>
      </div>

      <!-- KPI Ribbon -->
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-4);margin-bottom:var(--space-5)">
        ${[{lbl:`Total Bangunan`,count:n,icon:`fa-city`,c:`kpi-blue`},{lbl:`SLF Terbit (Laik)`,count:r,icon:`fa-check-circle`,c:`kpi-green`},{lbl:`Risiko Tinggi/Kritis`,count:s,icon:`fa-triangle-exclamation`,c:`kpi-red`},{lbl:`Rata-Rata Skor AI`,count:c+`/100`,icon:`fa-brain`,c:`kpi-purple`}].map(e=>`
           <div class="card" style="display:flex;align-items:center;gap:16px">
             <div class="kpi-icon-wrap ${e.c}" style="width:48px;height:48px;font-size:1.2rem;margin:0">
               <i class="fas ${e.icon}"></i>
             </div>
             <div>
               <div class="text-xs text-tertiary font-bold" style="text-transform:uppercase">${e.lbl}</div>
               <div style="font-size:1.8rem;font-weight:800;letter-spacing:-1px;line-height:1.2">${e.count}</div>
             </div>
           </div>
        `).join(``)}
      </div>

      <!-- Charts -->
      <div style="display:grid;grid-template-columns:1.5fr 1fr;gap:var(--space-5);margin-bottom:var(--space-5)">
        <div class="card">
          <div class="card-title" style="margin-bottom:var(--space-4)">Status Keseluruhan SLF</div>
          <div class="chart-wrap" style="height:300px">
             <canvas id="bar-chart"></canvas>
          </div>
        </div>
        <div class="card">
          <div class="card-title" style="margin-bottom:var(--space-4)">Sebaran Tingkat Risiko (AI Score)</div>
          <div class="chart-wrap" style="height:300px">
             <canvas id="doughnut-chart"></canvas>
          </div>
        </div>
      </div>

      <!-- Tabel Urgent -->
      <div class="card">
        <div class="card-title" style="margin-bottom:var(--space-4)"><i class="fas fa-exclamation-circle text-danger"></i> Top 5 Bangunan Kritis (Area Prioritas Perbaikan)</div>
        <table class="checklist-table">
          <thead>
            <tr>
              <th>Bangunan</th>
              <th>Status SLF</th>
              <th>Evaluasi Terakhir</th>
              <th>Skor Total AI</th>
            </tr>
          </thead>
          <tbody>
            ${[...e].filter(e=>e.status_slf===`TIDAK_LAIK_FUNGSI`).slice(0,5).map(e=>`
              <tr>
                <td><b>${Y(e.nama_bangunan)}</b><br><span class="text-xs text-tertiary">${Y(e.alamat)}</span></td>
                <td><span class="badge" style="background:var(--danger-bg);color:var(--danger-400)">Tidak Laik Fungsi</span></td>
                <td class="text-tertiary">${new Date().toLocaleDateString(`id-ID`)}</td>
                <td><span class="text-danger font-bold text-lg">${t.find(t=>t.proyek_id===e.id)?.skor_total||0}</span>/100</td>
              </tr>
            `).join(``)}
            ${e.filter(e=>e.status_slf===`TIDAK_LAIK_FUNGSI`).length===0?`<tr><td colspan="4" class="text-center text-tertiary">Tidak ada bangunan berstatus Tidak Laik Fungsi dalam sistem.</td></tr>`:``}
          </tbody>
        </table>
      </div>
    </div>
  `}function Gt(e,t){let n=()=>{if(!window.Chart)return setTimeout(n,100);let r=document.getElementById(`bar-chart`);if(r){let t=0,n=0,i=0,a=0;e.forEach(e=>{e.status_slf===`LAIK_FUNGSI`?t++:e.status_slf===`LAIK_FUNGSI_BERSYARAT`?n++:e.status_slf===`TIDAK_LAIK_FUNGSI`?i++:a++}),new window.Chart(r,{type:`bar`,data:{labels:[`Laik Fungsi`,`Bersyarat`,`Tidak Laik`,`Proses/Belum`],datasets:[{label:`Total Bangunan`,data:[t,n,i,a],backgroundColor:[`hsl(160,65%,46%)`,`hsl(40,80%,55%)`,`hsl(0,74%,52%)`,`hsl(220,10%,50%)`],borderRadius:6}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}}}})}let i=document.getElementById(`doughnut-chart`);if(i){let e=0,n=0,r=0,a=0;t.forEach(t=>{t.risk_level===`critical`?e++:t.risk_level===`high`?n++:t.risk_level===`medium`?r++:a++}),t.length===0&&(a=1),new window.Chart(i,{type:`doughnut`,data:{labels:[`Low Risk`,`Medium`,`High`,`Critical`],datasets:[{data:[a,r,n,e],backgroundColor:[`hsl(160,65%,46%)`,`hsl(40,80%,55%)`,`hsl(20,80%,55%)`,`hsl(0,74%,52%)`],borderWidth:0,cutout:`70%`}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:`bottom`}}}})}};if(window.Chart)n();else{let e=document.createElement(`script`);e.src=`https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js`,e.onload=n,document.head.appendChild(e)}}async function Kt(){try{let{data:e}=await t.from(`proyek`).select(`*`);return e||[]}catch{return[]}}async function qt(){try{let{data:e}=await t.from(`hasil_analisis`).select(`*`);return e||[]}catch{return[]}}function Jt(){return`<div class="skeleton" style="height:200px;margin-bottom:24px;width:100%"></div>
          <div class="grid-2">
            <div class="skeleton" style="height:350px"></div>
            <div class="skeleton" style="height:350px"></div>
          </div>`}function Y(e){return String(e||``).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`)}async function Yt(){let e=document.getElementById(`page-root`);return e&&(e.innerHTML=Xt(),Zt()),``}function Xt(){return`
    <div id="multiagent-page">
      <div class="page-header" style="text-align:center;margin-bottom:var(--space-6)">
        <div style="width:72px;height:72px;border-radius:var(--radius-xl);background:var(--gradient-brand);display:flex;align-items:center;justify-content:center;margin:0 auto var(--space-4);font-size:2rem;color:white;box-shadow:0 10px 25px hsla(258,80%,56%,0.4)">
          <i class="fas fa-network-wired"></i>
        </div>
        <h1 class="page-title" style="font-size:2rem;margin-bottom:8px">Sistem Multi-Agent AI</h1>
        <p class="page-subtitle" style="max-width:600px;margin:0 auto">
          Konsorsium ahli digital yang membedah keandalan bangunan secara spesifik. Setiap agent berfokus pada standar disiplin ilmunya masing-masing sebelum dikonsolidasikan.
        </p>
        <button class="btn btn-primary" id="btn-simulate" style="margin-top:24px;padding:12px 24px;border-radius:30px;font-size:1rem" onclick="window._startSimulation()">
          <i class="fas fa-play"></i> Mulai Diskusi AI Interaktif
        </button>
      </div>

      <div class="agent-grid" id="agent-grid" style="display:none">
        ${[{id:`struktur`,name:`Agent Struktur`,role:`SNI 9273:2025 Expert`,icon:`fa-cubes`,color:`hsl(0,70%,55%)`},{id:`keselamatan`,name:`Agent Keselamatan`,role:`Fire Safety & Evacuation`,icon:`fa-shield-heart`,color:`hsl(160,65%,46%)`},{id:`arsitektur`,name:`Agent MEP & Utilitas`,role:`PUIL & Plumbing`,icon:`fa-bolt`,color:`hsl(40,80%,55%)`}].map(e=>`
          <div class="agent-card" id="card-${e.id}">
            <div class="ac-header">
              <div class="ac-avatar" style="background:${e.color}"><i class="fas ${e.icon}"></i></div>
              <div class="ac-info">
                <div class="ac-name">${e.name}</div>
                <div class="ac-role">${e.role}</div>
              </div>
            </div>
            <div class="ac-body" id="body-${e.id}">
              <div class="typing-indicator" style="display:none" id="typing-${e.id}">
                <div class="ti-dot"></div><div class="ti-dot"></div><div class="ti-dot"></div>
              </div>
              <div class="agent-output" id="output-${e.id}">Menunggu instruksi...</div>
            </div>
          </div>
        `).join(``)}
      </div>

      <div class="coord-card" id="coord-card" style="display:none;margin-top:var(--space-5)">
        <div class="coord-header">
          <div class="coord-avatar"><i class="fas fa-brain"></i></div>
          <div>
            <div class="text-sm" style="color:hsla(0,0%,100%,0.7);font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:4px">KONSOLIDASI FINAL</div>
            <div style="font-size:1.4rem;font-weight:700">Coordinator Agent / Kepala Pengkaji</div>
          </div>
        </div>
        <div style="line-height:1.8;opacity:0.9" id="coord-output">
          Mengumpulkan ringkasan rekomendasi dari ketiga tenaga ahli agent...
        </div>
      </div>
    </div>
  `}function Zt(){window._startSimulation=async()=>{document.getElementById(`btn-simulate`).style.display=`none`,document.getElementById(`agent-grid`).style.display=`grid`,[`struktur`,`keselamatan`,`arsitektur`].forEach(e=>{document.getElementById(`output-${e}`).innerHTML=``,document.getElementById(`card-${e}`).classList.add(`thinking`),document.getElementById(`typing-${e}`).style.display=`inline-flex`}),await Z(2e3),X(`struktur`,`
      <p style="margin-bottom:8px"><b><i class="fas fa-search"></i> Analisis Struktur:</b></p>
      <ul style="padding-left:16px;margin:0">
        <li style="margin-bottom:6px">Memproses data dari kolom eksisting... Rasio deformasi 0.05% pada lantai 2. Masih dalam ambang batas aman SNI.</li>
        <li style="margin-bottom:6px"><i>Warning:</i> Fondasi tidak dirancang untuk penambahan beban mati lantai 4 ke atas.</li>
        <li><b>Rekomendasi:</b> Tidak perlu retrofit, status <b>Aman</b>.</li>
      </ul>
    `),await Z(1500),X(`arsitektur`,`
      <p style="margin-bottom:8px"><b><i class="fas fa-bolt"></i> Analisis Utilitas (MEP):</b></p>
      <ul style="padding-left:16px;margin:0">
        <li style="margin-bottom:6px">Distribusi daya utama tidak menggunakan arde standar (PUIL 2011).</li>
        <li style="margin-bottom:6px">Kapasitas ELCB tercatat under-spec untuk beban AC sentral yang baru dipasang.</li>
        <li><b>Rekomendasi:</b> Perombakan panel MDP wajib dilakukan segera. Status <b>Kritis</b>.</li>
      </ul>
    `),await Z(2500),X(`keselamatan`,`
      <p style="margin-bottom:8px"><b><i class="fas fa-fire"></i> Analisis Proteksi Kebakaran:</b></p>
      <ul style="padding-left:16px;margin:0">
        <li style="margin-bottom:6px">Jumlah APAR memenuhi rasio per m², namun tanggal kadaluasa lewat 6 bulan.</li>
        <li style="margin-bottom:6px">Pintu darurat tangga bebas asap tidak ditutup rapat (tidak memiliki self-closing hinge).</li>
        <li><b>Rekomendasi:</b> Perawatan komponen keselamatan minor. Status <b>Bersyarat</b>.</li>
      </ul>
    `),await Z(1e3);let e=document.getElementById(`coord-card`);e.style.display=`block`,e.scrollIntoView({behavior:`smooth`,block:`center`}),document.getElementById(`coord-output`).innerHTML=`<div class="typing-indicator"><div class="ti-dot" style="background:white"></div><div class="ti-dot" style="background:white"></div><div class="ti-dot" style="background:white"></div></div><span style="margin-left:8px">Menimbang pendapat dari para ahli...</span>`,await Z(3500),document.getElementById(`coord-output`).innerHTML=`
      <h3 style="font-size:1.1rem;font-weight:700;margin-bottom:8px;color:var(--warning-400)"><i class="fas fa-balance-scale"></i> Kesimpulan Evaluasi Kelaikan</h3>
      <p style="margin-bottom:12px">Setelah mengkonsolidasikan data dari Agent Struktur, Utilitas, dan Kebakaran, saya merekomendasikan status bangunan di level:</p>
      
      <div style="background:hsla(0,0%,0%,0.3);padding:16px;border-radius:8px;font-size:1.5rem;font-weight:800;text-align:center;margin-bottom:16px;border:1px solid hsla(0,0%,100%,0.2);color:var(--warning-400)">
        LAIK FUNGSI BERSYARAT
      </div>

      <div style="font-size:0.9rem;opacity:0.8">
        <b>Justifikasi:</b> Kekuatan struktur (Aman) tidak mampu menutupi bahaya laten operasional dari utilitas kelistrikan (Kritis) dan proteksi kebakaran pasif (Bersyarat). Bangunan masih boleh beroperasi karena integritas fisik kokoh, namun wajib mematuhi <b>Tenggat Perbaikan 30 Hari</b> untuk pembaharuan panel listrik sesuai arahan Agent MEP, serta resertifikasi APAR dari Agent Keselamatan.
      </div>
      
      <button class="btn btn-sm" style="background:white;color:black;margin-top:16px;border-radius:20px" onclick="window.navigate('dashboard')">Selesai & Kembali ke Utama</button>
    `}}function X(e,t){document.getElementById(`card-${e}`).classList.remove(`thinking`),document.getElementById(`typing-${e}`).style.display=`none`;let n=document.getElementById(`output-${e}`);n.style.opacity=`0`,n.innerHTML=t;let r=0,i=setInterval(()=>{r+=.1,n.style.opacity=r,r>=1&&clearInterval(i)},30)}var Z=e=>new Promise(t=>setTimeout(t,e));function Qt({title:e,icon:t,description:n,links:r=[]}){return`
    <div>
      <div class="page-header">
        <h1 class="page-title">
          <i class="fas ${t}" style="color:var(--brand-400);margin-right:10px"></i>${e}
        </h1>
        <p class="page-subtitle">${n}</p>
      </div>

      <div class="card" style="text-align:center;padding:var(--space-12)">
        <div style="width:80px;height:80px;background:var(--gradient-brand);border-radius:var(--radius-xl);display:flex;align-items:center;justify-content:center;font-size:2rem;color:white;margin:0 auto var(--space-5);animation:float 4s ease-in-out infinite">
          <i class="fas ${t}"></i>
        </div>
        <h2 style="font-size:1.4rem;font-weight:700;margin-bottom:var(--space-3)">${e}</h2>
        <p style="color:var(--text-secondary);max-width:440px;margin:0 auto var(--space-6)">
          Halaman ini sedang dalam pengembangan aktif. Fitur akan segera tersedia.
        </p>

        ${r.length?`
          <div class="flex gap-3" style="justify-content:center;flex-wrap:wrap">
            ${r.map(e=>`
              <button class="btn btn-secondary" onclick="window.navigate('${e.route}')">
                <i class="fas ${e.icon}"></i> ${e.label}
              </button>
            `).join(``)}
          </div>
        `:`
          <button class="btn btn-primary" onclick="window.navigate('dashboard')">
            <i class="fas fa-home"></i> Kembali ke Dashboard
          </button>
        `}

        <!-- Coming soon features preview -->
        <div style="margin-top:var(--space-8);display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-4);text-align:left;max-width:600px;margin-left:auto;margin-right:auto">
          ${$t(e).map(e=>`
            <div style="background:var(--bg-elevated);border:1px solid var(--border-subtle);border-radius:var(--radius-md);padding:var(--space-4)">
              <i class="fas ${e.icon}" style="color:var(--brand-400);margin-bottom:8px;font-size:1.1rem"></i>
              <div style="font-size:0.8rem;font-weight:600;color:var(--text-primary);margin-bottom:4px">${e.title}</div>
              <div style="font-size:0.75rem;color:var(--text-tertiary)">${e.desc}</div>
            </div>
          `).join(``)}
        </div>
      </div>
    </div>
  `}function $t(e){return{Checklist:[{icon:`fa-clipboard-list`,title:`Checklist Administrasi`,desc:`Dokumen perizinan & legalitas`},{icon:`fa-building`,title:`Checklist Teknis`,desc:`Struktur, Arsitektur, MEP`},{icon:`fa-camera`,title:`Dokumentasi Foto`,desc:`Upload bukti lapangan`}],"Analisis AI":[{icon:`fa-brain`,title:`Rule-based AI`,desc:`Berbasis NSPK & SNI`},{icon:`fa-chart-pie`,title:`Risk Scoring`,desc:`Low/Medium/High/Critical`},{icon:`fa-file-alt`,title:`Auto Rekomendasi`,desc:`Saran tindak perbaikan`}],"Multi-Agent Analysis":[{icon:`fa-network-wired`,title:`Agent Struktur`,desc:`ASCE/SEI 41-17 analysis`},{icon:`fa-fire-extinguisher`,title:`Agent Keselamatan`,desc:`Fire safety analysis`},{icon:`fa-sync`,title:`Aggregator`,desc:`Konsolidasi hasil AI`}],"Laporan Kajian SLF":[{icon:`fa-file-pdf`,title:`Export PDF`,desc:`Laporan siap cetak`},{icon:`fa-file-word`,title:`Google Docs`,desc:`Template profesional`},{icon:`fa-presentation-screen`,title:`Presentasi`,desc:`Slide eksekutif`}],"TODO Board":[{icon:`fa-columns`,title:`Kanban Board`,desc:`Drag & drop tasks`},{icon:`fa-bell`,title:`Reminder`,desc:`Notifikasi deadline`},{icon:`fa-link`,title:`Link ke Proyek`,desc:`Tasks per proyek`}],"Executive Dashboard":[{icon:`fa-chart-line`,title:`Analytics`,desc:`Tren & statistik`},{icon:`fa-gauge`,title:`KPI Overview`,desc:`Ringkasan eksekutif`},{icon:`fa-clock-rotate-left`,title:`Timeline`,desc:`Histori pengkajian`}]}[e]||[{icon:`fa-wrench`,title:`Sedang Dikembangkan`,desc:`Fitur segera hadir`},{icon:`fa-rocket`,title:`Coming Soon`,desc:`Stay tuned`},{icon:`fa-stars`,title:`Premium Feature`,desc:`Eksklusif AI engine`}]}var en=`modulepreload`,tn=function(e){return`/smartaipengkaji/`+e},nn={},rn=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e=document.getElementsByTagName(`link`),i=document.querySelector(`meta[property=csp-nonce]`),a=i?.nonce||i?.getAttribute(`nonce`);function o(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}r=o(t.map(t=>{if(t=tn(t,n),t in nn)return;nn[t]=!0;let r=t.endsWith(`.css`),i=r?`[rel="stylesheet"]`:``;if(n)for(let n=e.length-1;n>=0;n--){let i=e[n];if(i.href===t&&(!r||i.rel===`stylesheet`))return}else if(document.querySelector(`link[href="${t}"]${i}`))return;let o=document.createElement(`link`);if(o.rel=r?`stylesheet`:en,r||(o.as=`script`),o.crossOrigin=``,o.href=t,a&&o.setAttribute(`nonce`,a),document.head.appendChild(o),r)return new Promise((e,n)=>{o.addEventListener(`load`,e),o.addEventListener(`error`,()=>n(Error(`Unable to preload CSS for ${t}`)))})}))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})};window.navigate=(e,t={})=>g(e,t);var an=document.getElementById(`loading-screen`),on=document.getElementById(`loading-progress`),Q=!1;function $(e){on&&(on.style.width=`${e}%`)}function sn(){setTimeout(()=>{an?.classList.add(`hidden`)},400)}async function cn(){if(!window.Chart)return new Promise(e=>{let t=document.createElement(`script`);t.src=`https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js`,t.onload=e,document.head.appendChild(t)})}function ln(){h(`login`,async()=>u()?(g(`dashboard`),``):(await k(),``)),h(`dashboard`,async()=>{await cn();let e=await A();return setTimeout(async()=>{let{fetchKPI:e}=await rn(async()=>{let{fetchKPI:e}=await Promise.resolve().then(()=>Ce);return{fetchKPI:e}},void 0)},50),e}),h(`proyek`,async()=>{let e=await Fe();return setTimeout(Ie,50),e}),h(`proyek-baru`,async()=>await Re()),h(`proyek-edit`,async e=>await Re(e)),h(`proyek-detail`,async e=>await ze(e)),h(`checklist`,async e=>await Ze(e)),h(`analisis`,async e=>await ct(e)),h(`multi-agent`,async()=>await Yt()),h(`laporan`,async e=>await Ct(e)),h(`todo`,async()=>await K()),h(`todo-detail`,async e=>await zt(e)),h(`executive`,async()=>await Ut()),h(`settings`,async()=>un()),h(`404`,async()=>Qt({title:`Halaman Tidak Ditemukan`,icon:`fa-map-signs`,description:`Halaman yang Anda tuju tidak ada.`}))}function un(){let e=d();return`
    <div>
      <div class="page-header">
        <h1 class="page-title">Pengaturan</h1>
        <p class="page-subtitle">Konfigurasi akun dan sistem Smart AI Pengkaji SLF</p>
      </div>

      <div style="display:grid;grid-template-columns:280px 1fr;gap:var(--space-5)">
        <!-- Profil Card -->
        <div>
          <div class="card" style="text-align:center">
            ${e?.avatar?`<img src="${e.avatar}" style="width:80px;height:80px;border-radius:50%;margin:0 auto var(--space-4);display:block;border:3px solid var(--brand-400)">`:`<div style="width:80px;height:80px;background:var(--gradient-brand);border-radius:50%;margin:0 auto var(--space-4);display:flex;align-items:center;justify-content:center;font-size:2rem;color:white;font-weight:700">${e?.initials||`?`}</div>`}
            <h3 style="font-weight:700;margin-bottom:4px">${e?.name||`User`}</h3>
            <p class="text-sm text-tertiary">${e?.email||``}</p>
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
              ${[[`Nama Aplikasi`,n.name],[`Versi`,n.version],[`Domain Deploy`,`bangpupr.github.io/smartaipengkaji`],[`Database`,`Supabase PostgreSQL`],[`Authentication`,`Google OAuth 2.0`],[`AI Engine`,`Rule-based + Gemini AI`],[`Standar Acuan`,`SNI 9273:2025, ASCE/SEI 41-17`],[`Regulasi`,`PP No. 16 Tahun 2021`]].map(([e,t])=>`
                <div style="background:var(--bg-elevated);border-radius:var(--radius-md);padding:var(--space-3) var(--space-4)">
                  <div class="text-xs text-tertiary">${e}</div>
                  <div class="text-sm font-semibold text-primary">${t}</div>
                </div>
              `).join(``)}
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
              ${[{key:`aiEnabled`,label:`AI Engine`,desc:`Analisis AI otomatis`},{key:`gasIntegration`,label:`Google Workspace`,desc:`Integrasi Docs/Slides/Drive`}].map(e=>`
                <div style="display:flex;align-items:center;justify-content:space-between;padding:12px;background:var(--bg-elevated);border-radius:var(--radius-md)">
                  <div>
                    <div class="text-sm font-semibold text-primary">${e.label}</div>
                    <div class="text-xs text-tertiary">${e.desc}</div>
                  </div>
                  <span class="badge ${n.features[e.key]?`badge-laik`:`badge-tidak-laik`}">
                    ${n.features[e.key]?`Aktif`:`Nonaktif`}
                  </span>
                </div>
              `).join(``)}
            </div>
          </div>
        </div>
      </div>
    </div>
  `}window.doSignOut=async function(){if(await b({title:`Keluar`,message:`Yakin ingin keluar?`,confirmText:`Keluar`,danger:!0}))try{await l(),w(`Berhasil keluar.`)}catch{T(`Gagal keluar.`)}},window.checkDBStatus=async function(){let{supabase:e}=await rn(async()=>{let{supabase:e}=await import(`./supabase-Cc4bjHTr.js`).then(e=>e.n);return{supabase:e}},__vite__mapDeps([0,1])),t=document.getElementById(`db-status`);if(t)try{let{error:n}=await e.from(`proyek`).select(`id`).limit(1);t.innerHTML=n?`<span class="badge badge-tidak-laik"><i class="fas fa-circle-xmark"></i> Koneksi gagal: ${n.message}</span>`:`<span class="badge badge-laik"><i class="fas fa-circle-check"></i> Terhubung ke Supabase</span>`}catch(e){t.innerHTML=`<span class="badge badge-tidak-laik">Gagal: ${e.message}</span>`}};async function dn(){$(20),ln(),$(40);let e=await o();$(70);let t=document.getElementById(`app`);if(s(e=>{if(e&&!Q){Q=!0,D(t);let e=O();e&&_(e)}else e||(Q=!1,xe(t),k())}),window.addEventListener(`route-changed`,e=>{be(e.detail.path)}),$(90),!e){$(100),sn(),await k();return}D(t);let n=O();n&&_(n),$(100),sn()}dn().catch(e=>{console.error(`[App] Bootstrap error:`,e),document.getElementById(`loading-screen`)?.classList.add(`hidden`),document.getElementById(`app`).innerHTML=`
    <div style="display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:Inter,sans-serif;background:#0a0c12;color:#e2e8f0">
      <div style="text-align:center;padding:2rem">
        <div style="font-size:3rem;margin-bottom:1rem">⚠️</div>
        <h2 style="font-size:1.4rem;margin-bottom:0.5rem">Terjadi Kesalahan Sistem</h2>
        <p style="color:#718096;margin-bottom:1.5rem">${e.message}</p>
        <button onclick="location.reload()" style="background:linear-gradient(135deg,#3b5fd9,#7c5ce7);color:white;border:none;padding:10px 24px;border-radius:8px;cursor:pointer;font-size:0.9rem">
          Muat Ulang
        </button>
      </div>
    </div>
  `});