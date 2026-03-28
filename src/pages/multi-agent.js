// ============================================================
//  MULTI-AGENT AI PAGE
//  Simulasi sistem agen konsorsium: Struktur, Arsitektur, Keselamatan
// ============================================================
import { supabase } from '../lib/supabase.js';

export async function multiAgentPage() {
  const root = document.getElementById('page-root');
  if (root) {
    const html = buildHtml();
    root.innerHTML = html;
    initAgents();
  }
  return '';
}

function buildHtml() {
  const agents = [
    { id: 'struktur', name: 'Agent Struktur', role: 'SNI 9273:2025 Expert', icon: 'fa-cubes', color: 'hsl(0,70%,55%)' },
    { id: 'keselamatan', name: 'Agent Keselamatan', role: 'Fire Safety & Evacuation', icon: 'fa-shield-heart', color: 'hsl(160,65%,46%)' },
    { id: 'arsitektur', name: 'Agent MEP & Utilitas', role: 'PUIL & Plumbing', icon: 'fa-bolt', color: 'hsl(40,80%,55%)' },
  ];

  return `
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
        ${agents.map(a => `
          <div class="agent-card" id="card-${a.id}">
            <div class="ac-header">
              <div class="ac-avatar" style="background:${a.color}"><i class="fas ${a.icon}"></i></div>
              <div class="ac-info">
                <div class="ac-name">${a.name}</div>
                <div class="ac-role">${a.role}</div>
              </div>
            </div>
            <div class="ac-body" id="body-${a.id}">
              <div class="typing-indicator" style="display:none" id="typing-${a.id}">
                <div class="ti-dot"></div><div class="ti-dot"></div><div class="ti-dot"></div>
              </div>
              <div class="agent-output" id="output-${a.id}">Menunggu instruksi...</div>
            </div>
          </div>
        `).join('')}
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
  `;
}

function initAgents() {
  window._startSimulation = async () => {
    document.getElementById('btn-simulate').style.display = 'none';
    document.getElementById('agent-grid').style.display = 'grid';
    
    // reset outputs
    ['struktur', 'keselamatan', 'arsitektur'].forEach(id => {
       document.getElementById(`output-${id}`).innerHTML = '';
       document.getElementById(`card-${id}`).classList.add('thinking');
       document.getElementById(`typing-${id}`).style.display = 'inline-flex';
    });

    // Simulate Agent Struktur thinking
    await sleep(2000);
    finishAgentOutput('struktur', `
      <p style="margin-bottom:8px"><b><i class="fas fa-search"></i> Analisis Struktur:</b></p>
      <ul style="padding-left:16px;margin:0">
        <li style="margin-bottom:6px">Memproses data dari kolom eksisting... Rasio deformasi 0.05% pada lantai 2. Masih dalam ambang batas aman SNI.</li>
        <li style="margin-bottom:6px"><i>Warning:</i> Fondasi tidak dirancang untuk penambahan beban mati lantai 4 ke atas.</li>
        <li><b>Rekomendasi:</b> Tidak perlu retrofit, status <b>Aman</b>.</li>
      </ul>
    `);

    // Simulate Agent MEP thinking
    await sleep(1500);
    finishAgentOutput('arsitektur', `
      <p style="margin-bottom:8px"><b><i class="fas fa-bolt"></i> Analisis Utilitas (MEP):</b></p>
      <ul style="padding-left:16px;margin:0">
        <li style="margin-bottom:6px">Distribusi daya utama tidak menggunakan arde standar (PUIL 2011).</li>
        <li style="margin-bottom:6px">Kapasitas ELCB tercatat under-spec untuk beban AC sentral yang baru dipasang.</li>
        <li><b>Rekomendasi:</b> Perombakan panel MDP wajib dilakukan segera. Status <b>Kritis</b>.</li>
      </ul>
    `);

    // Simulate Agent Keselamatan thinking
    await sleep(2500);
    finishAgentOutput('keselamatan', `
      <p style="margin-bottom:8px"><b><i class="fas fa-fire"></i> Analisis Proteksi Kebakaran:</b></p>
      <ul style="padding-left:16px;margin:0">
        <li style="margin-bottom:6px">Jumlah APAR memenuhi rasio per m², namun tanggal kadaluasa lewat 6 bulan.</li>
        <li style="margin-bottom:6px">Pintu darurat tangga bebas asap tidak ditutup rapat (tidak memiliki self-closing hinge).</li>
        <li><b>Rekomendasi:</b> Perawatan komponen keselamatan minor. Status <b>Bersyarat</b>.</li>
      </ul>
    `);

    // Coordinator
    await sleep(1000);
    const cCard = document.getElementById('coord-card');
    cCard.style.display = 'block';
    cCard.scrollIntoView({ behavior: 'smooth', block: 'center' });

    let tDots = '<div class="typing-indicator"><div class="ti-dot" style="background:white"></div><div class="ti-dot" style="background:white"></div><div class="ti-dot" style="background:white"></div></div>';
    document.getElementById('coord-output').innerHTML = tDots + '<span style="margin-left:8px">Menimbang pendapat dari para ahli...</span>';

    await sleep(3500);
    document.getElementById('coord-output').innerHTML = `
      <h3 style="font-size:1.1rem;font-weight:700;margin-bottom:8px;color:var(--warning-400)"><i class="fas fa-balance-scale"></i> Kesimpulan Evaluasi Kelaikan</h3>
      <p style="margin-bottom:12px">Setelah mengkonsolidasikan data dari Agent Struktur, Utilitas, dan Kebakaran, saya merekomendasikan status bangunan di level:</p>
      
      <div style="background:hsla(0,0%,0%,0.3);padding:16px;border-radius:8px;font-size:1.5rem;font-weight:800;text-align:center;margin-bottom:16px;border:1px solid hsla(0,0%,100%,0.2);color:var(--warning-400)">
        LAIK FUNGSI BERSYARAT
      </div>

      <div style="font-size:0.9rem;opacity:0.8">
        <b>Justifikasi:</b> Kekuatan struktur (Aman) tidak mampu menutupi bahaya laten operasional dari utilitas kelistrikan (Kritis) dan proteksi kebakaran pasif (Bersyarat). Bangunan masih boleh beroperasi karena integritas fisik kokoh, namun wajib mematuhi <b>Tenggat Perbaikan 30 Hari</b> untuk pembaharuan panel listrik sesuai arahan Agent MEP, serta resertifikasi APAR dari Agent Keselamatan.
      </div>
      
      <button class="btn btn-sm" style="background:white;color:black;margin-top:16px;border-radius:20px" onclick="window.navigate('dashboard')">Selesai & Kembali ke Utama</button>
    `;
  };
}

function finishAgentOutput(id, text) {
  document.getElementById(`card-${id}`).classList.remove('thinking');
  document.getElementById(`typing-${id}`).style.display = 'none';
  
  const el = document.getElementById(`output-${id}`);
  el.style.opacity = '0';
  el.innerHTML = text;
  
  // Fade in
  let fade = 0;
  const timer = setInterval(() => {
    fade += 0.1;
    el.style.opacity = fade;
    if (fade >= 1) clearInterval(timer);
  }, 30);
}

const sleep = ms => new Promise(r => setTimeout(r, ms));
