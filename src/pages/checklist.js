// ============================================================
//  CHECKLIST PAGE
//  3 Tab: Administrasi | Teknis | Lapangan
//  Data disimpan ke Supabase tabel checklist_items
// ============================================================
import { supabase }  from '../lib/supabase.js';
import { navigate }  from '../lib/router.js';
import { showSuccess, showError, showInfo } from '../components/toast.js';
import { getUserInfo } from '../lib/auth.js';
import { analyzeChecklistImage, analyzeDocument } from '../lib/gemini.js';
import { uploadToGoogleDrive } from '../lib/drive.js';
import { openImageEditor }    from '../components/image-editor.js';
import { saveOfflineDrafts }  from '../lib/sync.js';

// ── Template Data Checklist ───────────────────────────────────
const CHECKLIST_ADMIN = [
  { kode: 'A01', nama: 'PBG / IMB (Persetujuan Bangunan Gedung)', options: ['ada_sesuai','ada_tidak_sesuai','tidak_ada'] },
  { kode: 'A02', nama: 'Sertifikat Laik Fungsi Sebelumnya', options: ['ada_sesuai','ada_tidak_sesuai','tidak_ada','pertama_kali'] },
  { kode: 'A03', nama: 'Gambar As-Built Drawing', options: ['ada_sesuai','ada_tidak_sesuai','tidak_ada'] },
  { kode: 'A04', nama: 'Gambar Rencana Teknis (DED)', options: ['ada_sesuai','ada_tidak_sesuai','tidak_ada'] },
  { kode: 'A05', nama: 'Dokumen RKS / Spesifikasi Teknis', options: ['ada_sesuai','ada_tidak_sesuai','tidak_ada'] },
  { kode: 'A06', nama: 'Dokumen K3 Konstruksi', options: ['ada_sesuai','ada_tidak_sesuai','tidak_ada'] },
  { kode: 'A07', nama: 'Ijin Penggunaan Air/Listrik (PLN/PDAM)', options: ['ada_sesuai','ada_tidak_sesuai','tidak_ada'] },
  { kode: 'A08', nama: 'Sertifikat Laik Operasi (SLO) Instalasi', options: ['ada_sesuai','ada_tidak_sesuai','tidak_ada'] },
  { kode: 'A09', nama: 'Dokumen AMDAL / UKL-UPL', options: ['ada_sesuai','ada_tidak_sesuai','tidak_ada','tidak_wajib'] },
  { kode: 'A10', nama: 'IMB Perubahan / Renovasi (jika ada)', options: ['ada_sesuai','ada_tidak_sesuai','tidak_ada','tidak_ada_renovasi'] },
];

const CHECKLIST_TEKNIS = [
  { aspek: 'Pemanfaatan (P216)', items: [
    { kode: 'P216-01', nama: 'Fungsi Bangunan Gedung (Pasal 216 ayat 1)' },
    { kode: 'P216-02', nama: 'Pemanfaatan setiap ruang dalam Bangunan Gedung' },
    { kode: 'P216-03', nama: 'Pemanfaatan ruang luar pada persil Bangunan Gedung' },
  ]},
  { aspek: 'Intensitas (P217)', items: [
    { kode: 'P217-01', nama: 'Luas lantai dasar Bangunan Gedung (Pasal 217 ayat 1)' },
    { kode: 'P217-02', nama: 'Luas dasar basemen' },
    { kode: 'P217-03', nama: 'Luas total lantai Bangunan Gedung' },
    { kode: 'P217-04', nama: 'Jumlah lantai Bangunan Gedung' },
    { kode: 'P217-05', nama: 'Jumlah lantai basemen' },
    { kode: 'P217-06', nama: 'Ketinggian Bangunan Gedung' },
    { kode: 'P217-07', nama: 'Luas daerah hijau dalam persil' },
    { kode: 'P217-08', nama: 'Jarak sempadan terhadap jalan, sungai, rel, dsb' },
    { kode: 'P217-09', nama: 'Jarak Bangunan Gedung dengan batas persil' },
    { kode: 'P217-10', nama: 'Jarak antar bangunan gedung' },
  ]},
  { aspek: 'Arsitektur - Penampilan (P218A)', items: [
    { kode: 'P218A-01', nama: 'Bentuk Bangunan Gedung (Pasal 218 ayat 2)' },
    { kode: 'P218A-02', nama: 'Bentuk denah Bangunan Gedung' },
    { kode: 'P218A-03', nama: 'Tampak bangunan' },
    { kode: 'P218A-04', nama: 'Bentuk dan penutup atap' },
    { kode: 'P218A-05', nama: 'Profil, detail, material, dan warna bangunan' },
    { kode: 'P218A-06', nama: 'Batas fisik atau pagar pekarangan' },
    { kode: 'P218A-07', nama: 'Kulit atau selubung bangunan' },
  ]},
  { aspek: 'Arsitektur - Tata Ruang (P218B)', items: [
    { kode: 'P218B-01', nama: 'Kebutuhan ruang utama (Pasal 218 ayat 4)' },
    { kode: 'P218B-02', nama: 'Bidang-bidang dinding' },
    { kode: 'P218B-03', nama: 'Dinding-dinding Penyekat' },
    { kode: 'P218B-04', nama: 'Pintu atau jendela' },
    { kode: 'P218B-05', nama: 'Tinggi ruang & Tinggi lantai dasar' },
    { kode: 'P218B-06', nama: 'Ruang rongga atap' },
    { kode: 'P218B-07', nama: 'Penutup lantai & penutup langit-langit' },
  ]},
  { aspek: 'Arsitektur - Lingkungan (P218C)', items: [
    { kode: 'P218C-01', nama: 'Tinggi (peil) pekarangan (Pasal 218 ayat 6)' },
    { kode: 'P218C-02', nama: 'Ruang terbuka hijau Pekarangan' },
    { kode: 'P218C-03', nama: 'Pemanfaatan ruang sempadan & daerah hijau' },
    { kode: 'P218C-04', nama: 'Tata tanaman & tata perkerasan pekarangan' },
    { kode: 'P218C-05', nama: 'Sirkulasi manusia dan kendaraan & Jalur pedestrian' },
    { kode: 'P218C-06', nama: 'Perabot lanskap & pertandaan (signage)' },
    { kode: 'P218C-07', nama: 'Pencahayaan ruang luar Bangunan Gedung' },
    { kode: 'P219-01', nama: 'Pengendalian Dampak Lingkungan (Pasal 218 ayat 1 / 215 ayat 4d)' },
  ]},
  { aspek: 'Keselamatan - Struktur (P220A)', items: [
    { kode: 'P220A-01', nama: 'Struktur Fondasi (Struktur Utama - Pasal 220 ayat 2)' },
    { kode: 'P220A-02', nama: 'Struktur Kolom & Struktur Balok' },
    { kode: 'P220A-03', nama: 'Struktur Pelat lantai' },
    { kode: 'P220A-04', nama: 'Struktur Rangka Atap' },
    { kode: 'P220A-05', nama: 'Struktur Dinding inti (Core Wall) & Basemen' },
    { kode: 'P220A-06', nama: 'Dinding pemikul & penahan geser (Bearing/Shear Wall)' },
    { kode: 'P220A-07', nama: 'Struktur pengaku (bracing) & peredam (damper)' },
  ]},
  { aspek: 'Keselamatan - Kebakaran (P220B)', items: [
    { kode: 'P220B-01', nama: 'Akses & Pasokan Air Mobil Damkar (Pasal 220 ayat 5)' },
    { kode: 'P220B-02', nama: 'Sarana Penyelamatan (Eksit, Tangga Darurat, Penandaan, Titik Kumpul)' },
    { kode: 'P220B-03', nama: 'Sistem Proteksi Pasif (Penghalang api/asap, Atrium)' },
    { kode: 'P220B-04', nama: 'Sistem Proteksi Aktif (Sprinkler, APAR, Alarm, Deteksi, Komunikasi)' },
    { kode: 'P220B-05', nama: 'Manajemen Proteksi Kebakaran (Unit/Organisasi, SDM)' },
  ]},
  { aspek: 'Keselamatan - Petir & Listrik (P220CD)', items: [
    { kode: 'P220C-01', nama: 'Sistem Proteksi Petir: Terminasi udara, konduktor, pembumian (Pasal 220)' },
    { kode: 'P220D-01', nama: 'Sumber & Panel Listrik (Pasal 220 ayat 11)' },
    { kode: 'P220D-02', nama: 'Instalasi Listrik & Sistem Pembumian Listrik' },
    { kode: 'P220E-01', nama: 'Jalur Evakuasi (Means of Egress) - Permen PUPR 14/2017 & 26/2008' },
  ]},
  { aspek: 'Kesehatan - Udara & Cahaya (P221AB)', items: [
    { kode: 'P222-01', nama: 'Sistem Penghawaan: Ventilasi alami/mekanis & polutan (Pasal 222)' },
    { kode: 'P222-02', nama: 'Sistem pengkondisian udara (AC)' },
    { kode: 'P223-01', nama: 'Pencahayaan Alami & Buatan (Pasal 223)' },
    { kode: 'P223-02', nama: 'Tingkat luminansi (Kenyamanan Visual)' },
  ]},
  { aspek: 'Kesehatan - Utilitas (P224)', items: [
    { kode: 'P224A-01', nama: 'Sistem Air Bersih: Sumber, Distribusi, Kualitas & Neraca (Pasal 224)' },
    { kode: 'P224B-01', nama: 'Pembuangan Air Kotor/Limbah: Saniter, Jaringan, & Pengolahan' },
    { kode: 'P224C-01', nama: 'Pembuangan Kotoran & Sampah: Inlet, Penampungan, & Pengolahan' },
    { kode: 'P224D-01', nama: 'Pengelolaan Air Hujan: Tangkapan, Drainase, & Peresapan' },
    { kode: 'P225-01', nama: 'Bahan Bangunan: Kandungan B3, Efek Silau, Suhu (Pasal 225)' },
  ]},
  { aspek: 'Kenyamanan (P226)', items: [
    { kode: 'P226A-01', nama: 'Ruang Gerak: Kapasitas Pengguna & Tata Letak Perabot (Pasal 226)' },
    { kode: 'P226B-01', nama: 'Kondisi Udara: Temp, kelembapan, laju aliran' },
    { kode: 'P226C-01', nama: 'Pandangan dari/ke dalam Bangunan Gedung (Pasal 226 ayat 6)' },
    { kode: 'P226D-01', nama: 'Kondisi Getaran dan Kebisingan (Pasal 226 ayat 8)' },
  ]},
  { aspek: 'Kemudahan & Prasarana (P227)', items: [
    { kode: 'P227-01', nama: 'Fasilitas Aksesibilitas Horizontal & Vertikal (Pasal 227)' },
    { kode: 'P226E-01', nama: 'Kelengkapan prasarana & sarana pemanfaatan (Pasal 226 ayat 7)' },
  ]},
];

const STATUS_OPTIONS_ADMIN = [
  { value: '', label: '— Pilih Status —' },
  { value: 'ada_sesuai',    label: '✓ Ada & Sesuai' },
  { value: 'ada_tidak_sesuai', label: '⚠ Ada Tapi Tidak Sesuai' },
  { value: 'tidak_ada',    label: '✗ Tidak Ada' },
  { value: 'pertama_kali', label: '○ Pengajuan Pertama' },
  { value: 'tidak_wajib',  label: '— Tidak Wajib' },
  { value: 'tidak_ada_renovasi', label: '— Tidak Ada Renovasi' },
];

const STATUS_OPTIONS_TEKNIS = [
  { value: '', label: '— Pilih Status —' },
  { value: 'baik',    label: '✓ Baik / Sesuai' },
  { value: 'sedang',  label: '⚠ Sedang / Minor Issue' },
  { value: 'buruk',   label: '⚠ Buruk / Perlu Perbaikan' },
  { value: 'kritis',  label: '✗ Kritis / Tidak Laik' },
  { value: 'tidak_ada', label: '— Tidak Ada / N/A' },
];

// ── Kategori Folder Arsip (Modern) ───────────────────────────
const FILE_CATEGORIES = [
  { 
    id: 'tanah', 
    label: 'DATA TANAH', 
    icon: 'fa-map-marked-alt',
    subs: ['Dokumen Kepemilikan Lahan', 'Izin Pemanfaatan Tanah', 'Gambar Batas Tanah', 'Hasil Penyelidikan Tanah']
  },
  { 
    id: 'umum',  
    label: 'DATA UMUM',  
    icon: 'fa-folder-open',
    subs: [
      'Siteplan Disetujui', 'Andalalin', 'Sartek Polres', 'Sartek Bina Marga', 
      'AMDAL / UKL-UPL', 'Proteksi Kebakaran', 'Peil Banjir', 'Irigasi', 
      'Intensitas Bangunan (KKPR/KRK)', 'Perizinan Bangunan (IMB/PBG/SLF)', 'Identitas Pemilik'
    ]
  }
];

// ── Page Entry ────────────────────────────────────────────────
export async function checklistPage(params = {}) {
  const id = params.id;
  if (!id) { navigate('proyek'); return ''; }

  const root = document.getElementById('page-root');
  if (root) root.innerHTML = renderSkeleton();

  const [proyek, existingData] = await Promise.all([
    fetchProyek(id),
    fetchChecklistData(id),
  ]);

  if (!proyek) { navigate('proyek'); showError('Proyek tidak ditemukan.'); return ''; }

  // Map existing data by kode
  const dataMap = {};
  (existingData || []).forEach(d => { dataMap[d.kode] = d; });

  window._checklistProyekId = id;
  window._checklistDataMap  = dataMap;
  window._dbFotoLinks       = {}; // Penyimpanan real-time URLs per komponen

  // Map foto urls jika sebelumnya sudah ada
  Object.keys(dataMap).forEach(k => {
    // Karena saat ini database Supabase `checklist_items` tidak memiliki kolom JSON array `foto_urls`,
    // untuk keperluan sementara kita membaca link-link foto dari `catatan` via regex
    // [DRIVE_URLS: ... ] 
    // Ataupun array sesungguhnya jika kita sudah alter database
    if (dataMap[k].foto_urls && Array.isArray(dataMap[k].foto_urls)) {
      window._dbFotoLinks[k] = dataMap[k].foto_urls;
    } else {
      window._dbFotoLinks[k] = [];
    }
  });

  const html = buildHtml(proyek, dataMap);
  if (root) {
    root.innerHTML = html;
    initTabs();
    initAutoSave(id);
    renderLapanganGallery();
  }
  return html;
}

// ── HTML Builder ──────────────────────────────────────────────
function buildHtml(proyek, dataMap) {
  const adminDone  = CHECKLIST_ADMIN.filter(i => dataMap[i.kode]?.status).length;
  const teknisDone = CHECKLIST_TEKNIS.flatMap(g => g.items).filter(i => dataMap[i.kode]?.status).length;
  const teknisTotal = CHECKLIST_TEKNIS.flatMap(g => g.items).length;

  return `
    <style>
      .file-manager-layout { display: flex; height: 600px; background: #fff; border: 1px solid var(--border-subtle); border-radius: 12px; overflow: hidden; margin: 20px 0; }
      .fm-sidebar { width: 280px; background: var(--bg-elevated); border-right: 1px solid var(--border-subtle); padding: 15px; overflow-y: auto; }
      .fm-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; background: #fff; color: #1e293b; }
      .fm-toolbar { padding: 15px; border-bottom: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center; background: #fff; }
      .fm-search { position: relative; flex: 1; max-width: 400px; }
      .fm-search i { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #64748b; }
      .fm-search input { width: 100%; padding: 8px 12px 8px 36px; border: 1px solid var(--border-subtle); border-radius: 8px; font-size: 0.9rem; color: #1e293b; background: #f8fafc; }
      .fm-tree-item { padding: 10px 12px; border-radius: 8px; cursor: pointer; color: var(--text-secondary); font-size: 0.9rem; font-weight: 500; display: flex; align-items: center; gap: 10px; transition: 0.2s; }
      .fm-tree-item:hover, .fm-tree-item.active { background: var(--brand-50); color: var(--brand-600); }
      .fm-tree-subs { margin-left: 20px; border-left: 1px dashed var(--border-subtle); padding-left: 5px; margin-top: 5px; }
      .fm-tree-sub { padding: 6px 12px; font-size: 0.85rem; color: var(--text-tertiary); cursor: pointer; border-radius: 6px; }
      .fm-tree-sub:hover, .fm-tree-sub.active { background: var(--brand-50); color: var(--brand-500); }
      .fm-file-list { flex: 1; overflow-y: auto; padding: 0; background: #fff; }
      .fm-table { width: 100%; border-collapse: collapse; font-size: 0.9rem; color: #1e293b; }
      .fm-table th { text-align: left; padding: 12px 15px; background: #f1f5f9; color: #475569; font-weight: 600; font-size: 0.75rem; text-transform: uppercase; border-bottom: 2px solid var(--border-subtle); }
      .fm-table td { padding: 12px 15px; border-bottom: 1px solid #f1f5f9; color: #1e293b; vertical-align: middle; }
      .fm-file-link { color: #1e293b; text-decoration: none; font-weight: 600; display: block; margin-bottom: 2px; }
      .fm-file-link:hover { color: var(--brand-600); }
      .ai-status-indicator { display: inline-flex; align-items: center; padding: 2px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }
      .ai-status-indicator.ready { background: #e6fcf5; color: #0ca678; }
      .ai-status-indicator.processing { background: #fff9db; color: #f59f00; font-family: sans-serif; }
      .ai-status-indicator.error { background: #fff5f5; color: #fa5252; }
      .ai-pulse-dot { width: 8px; height: 8px; background: var(--brand-400); border-radius: 50%; display: inline-block; margin-left: 5px; animation: pulse 1.5s infinite; }
      @keyframes pulse { 0% { transform: scale(0.95); opacity: 0.7; } 70% { transform: scale(1.1); opacity: 1; } 100% { transform: scale(0.95); opacity: 0.7; } }
      .fm-empty { text-align: center; padding: 60px 0; color: var(--text-tertiary); }
      .fm-empty i { font-size: 3rem; margin-bottom: 15px; opacity: 0.2; }
    </style>
    <div id="checklist-page">
      <!-- Header -->
      <div class="page-header">
        <div class="flex-between">
          <div>
            <button class="btn btn-ghost btn-sm" onclick="window.navigate('proyek-detail',{id:'${proyek.id}'})" style="margin-bottom:8px">
              <i class="fas fa-arrow-left"></i> ${escHtml(proyek.nama_bangunan)}
            </button>
            <h1 class="page-title">Checklist Pemeriksaan SLF</h1>
            <p class="page-subtitle">Pengisian data pemeriksaan sesuai standar NSPK — perubahan tersimpan otomatis</p>
          </div>
          <div class="flex gap-3">
            <div style="text-align:right">
              <div class="text-xs text-tertiary">Progress</div>
              <div class="text-sm font-semibold text-primary">${adminDone + teknisDone}/${CHECKLIST_ADMIN.length + teknisTotal} item</div>
            </div>
            <button class="btn btn-primary" onclick="window._saveChecklist()">
              <i class="fas fa-save"></i> Simpan Semua
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Strip -->
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-4);margin-bottom:var(--space-5)">
        ${[
          { label: 'Administrasi',  done: adminDone,  total: CHECKLIST_ADMIN.length,  color: 'kpi-blue',   icon: 'fa-clipboard-list' },
          { label: 'Teknis',        done: teknisDone, total: teknisTotal,              color: 'kpi-purple', icon: 'fa-building' },
          { label: 'Lapangan',      done: 0,           total: 3,                       color: 'kpi-green',  icon: 'fa-camera' },
        ].map(s => `
          <div class="card" style="padding:var(--space-4)">
            <div class="flex gap-3" style="align-items:center;margin-bottom:var(--space-3)">
              <div class="kpi-icon-wrap ${s.color}" style="width:36px;height:36px;margin:0">
                <i class="fas ${s.icon}"></i>
              </div>
              <div>
                <div class="text-sm font-semibold text-primary">${s.label}</div>
                <div class="text-xs text-tertiary">${s.done}/${s.total} item</div>
              </div>
            </div>
            <div class="progress-wrap">
              <div class="progress-fill ${s.color === 'kpi-blue' ? 'blue' : s.color === 'kpi-purple' ? 'blue' : 'green'}"
                   style="width:${s.total > 0 ? Math.round((s.done/s.total)*100) : 0}%"></div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Tab Bar -->
      <div class="tab-bar" id="checklist-tabs">
        <button class="tab-btn active" onclick="switchTab('admin')" id="tab-btn-admin">
          <i class="fas fa-clipboard-list"></i> Administrasi
          <span style="background:hsla(220,70%,48%,0.2);color:var(--brand-400);padding:1px 7px;border-radius:999px;font-size:0.7rem">${adminDone}/${CHECKLIST_ADMIN.length}</span>
        </button>
        <button class="tab-btn" onclick="switchTab('teknis')" id="tab-btn-teknis">
          <i class="fas fa-building"></i> Teknis
          <span style="background:hsla(220,70%,48%,0.2);color:var(--brand-400);padding:1px 7px;border-radius:999px;font-size:0.7rem">${teknisDone}/${teknisTotal}</span>
        </button>
        <button class="tab-btn" onclick="switchTab('files')" id="tab-btn-files">
          <i class="fas fa-folder-tree"></i> Manajemen Berkas
          <span class="ai-pulse-dot" id="ai-status-pulse"></span>
        </button>
        <button class="tab-btn" onclick="switchTab('lapangan')" id="tab-btn-lapangan">
          <i class="fas fa-camera"></i> Foto Lapangan
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
                ${CHECKLIST_ADMIN.map(item => `
                  <tr>
                    <td><span class="cl-kode">${item.kode}</span></td>
                    <td class="text-secondary">${escHtml(item.nama)}</td>
                    <td>
                      <select class="cl-status-select" id="cl-${item.kode}-status"
                              onchange="window._markDirty('${item.kode}')"
                              data-kode="${item.kode}" data-kategori="administrasi">
                        ${STATUS_OPTIONS_ADMIN.map(o =>
                          `<option value="${o.value}" ${(dataMap[item.kode]?.status || '') === o.value ? 'selected' : ''}>${o.label}</option>`
                        ).join('')}
                      </select>
                    </td>
                    <td>
                      <textarea class="cl-catatan" id="cl-${item.kode}-catatan" rows="2"
                                placeholder="Catatan..." onchange="window._markDirty('${item.kode}')">${escHtml(dataMap[item.kode]?.catatan || '')}</textarea>
                      
                      <!-- AI Smart Dropzone untuk Dokumen Administrasi -->
                      <div class="cl-upload-dropzone" style="margin-top:8px;border:1px dashed var(--border-subtle);border-radius:var(--radius-sm);padding:8px;text-align:center;cursor:pointer;color:var(--text-tertiary);background:var(--bg-elevated);transition:all 0.2s"
                           ondragover="event.preventDefault(); this.style.borderColor='var(--brand-400)'; this.style.color='var(--brand-400)'"
                           ondragleave="this.style.borderColor='var(--border-subtle)'; this.style.color='var(--text-tertiary)'"
                           ondrop="window._handleImageDrop(event, '${item.kode}', '${escHtml(item.nama)}', 'administrasi')"
                           onclick="document.getElementById('file-${item.kode}').click()">
                        <div id="dz-content-${item.kode}">
                          <i class="fas fa-file-pdf" style="color:var(--brand-400)"></i> <span style="font-size:0.75rem;font-weight:600;margin-left:4px">AI Audit: Drop Dokumen/Foto</span>
                        </div>
                        <input type="file" id="file-${item.kode}" accept="image/jpeg, image/png, image/webp, application/pdf" multiple style="display:none" onchange="window._handleImageSelect(event, '${item.kode}', '${escHtml(item.nama)}', 'administrasi')">
                      </div>

                    </td>
                  </tr>
                `).join('')}
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
                ${CHECKLIST_TEKNIS.map(grup => `
                  <tr class="aspek-header">
                    <td colspan="4">
                      <i class="fas fa-layer-group" style="margin-right:6px"></i>${escHtml(grup.aspek)}
                    </td>
                  </tr>
                  ${grup.items.map(item => `
                    <tr>
                      <td><span class="cl-kode">${item.kode}</span></td>
                      <td class="text-secondary">${escHtml(item.nama)}</td>
                      <td>
                        <select class="cl-status-select" id="cl-${item.kode}-status"
                                onchange="window._markDirty('${item.kode}')"
                                data-kode="${item.kode}" data-kategori="teknis" data-aspek="${escHtml(grup.aspek)}">
                          ${STATUS_OPTIONS_TEKNIS.map(o =>
                            `<option value="${o.value}" ${(dataMap[item.kode]?.status || '') === o.value ? 'selected' : ''}>${o.label}</option>`
                          ).join('')}
                        </select>
                      </td>
                      <td>
                        <textarea class="cl-catatan" id="cl-${item.kode}-catatan" rows="2"
                                  placeholder="Catatan teknis..." onchange="window._markDirty('${item.kode}')">${escHtml(dataMap[item.kode]?.catatan || '')}</textarea>
                        
                            <!-- AI Smart Dropzone Per Item -->
                            <div class="cl-upload-dropzone" style="margin-top:8px;border:1px dashed var(--border-subtle);border-radius:var(--radius-sm);padding:8px;text-align:center;cursor:pointer;color:var(--text-tertiary);background:var(--bg-elevated);transition:all 0.2s"
                                 ondragover="event.preventDefault(); this.style.borderColor='var(--brand-400)'; this.style.color='var(--brand-400)'"
                                 ondragleave="this.style.borderColor='var(--border-subtle)'; this.style.color='var(--text-tertiary)'"
                                 ondrop="window._handleImageDrop(event, '${item.kode}', '${escHtml(item.nama)}', 'teknis', '${escHtml(grup.aspek)}')"
                                 onclick="document.getElementById('file-${item.kode}').click()">
                              <div id="dz-content-${item.kode}">
                                <i class="fas fa-magic" style="color:var(--brand-400)"></i> <span style="font-size:0.75rem;font-weight:600;margin-left:4px">AI Vision: Drop Dokumen/Foto</span>
                              </div>
                              <input type="file" id="file-${item.kode}" accept="image/jpeg, image/png, image/webp, application/pdf" multiple style="display:none" onchange="window._handleImageSelect(event, '${item.kode}', '${escHtml(item.nama)}', 'teknis', '${escHtml(grup.aspek)}')">
                            </div>
                        
                      </td>
                    </tr>
                  `).join('')}
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Tab: Manajemen File (Modern Split-Screen) -->
      <div class="tab-content" id="tab-files">
        <div class="file-manager-layout">
          <!-- Sidebar: Folder Tree -->
          <div class="fm-sidebar">
            <div class="fm-tree">
              <div class="fm-tree-item active" id="tree-all" onclick="window._filterFiles('all')">
                <i class="fas fa-th-large"></i> Semua Berkas
              </div>
              ${FILE_CATEGORIES.map(cat => `
                <div class="fm-tree-group">
                  <div class="fm-tree-item" id="tree-${cat.id}" onclick="window._filterFiles('${cat.id}')">
                    <i class="fas ${cat.icon}"></i> ${cat.label}
                  </div>
                  <div class="fm-tree-subs">
                    ${cat.subs.map(sub => `
                      <div class="fm-tree-sub" id="tree-sub-${sub}" onclick="window._filterFiles('${cat.id}', '${sub}')">
                        <i class="far fa-file-alt"></i> ${sub}
                      </div>
                    `).join('')}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Main: Content -->
          <div class="fm-main">
            <div class="fm-toolbar">
               <div class="fm-search">
                  <i class="fas fa-search"></i>
                  <input type="text" id="fm-search-input" placeholder="Cari berkas..." oninput="window._renderFileList()">
               </div>
               <div class="flex gap-2">
                 <button class="btn btn-ghost btn-sm" onclick="window._syncDrive()">
                    <i class="fab fa-google-drive"></i> G-Drive
                 </button>
                 <button class="btn btn-primary btn-sm" onclick="document.getElementById('fm-upload-multi').click()">
                    <i class="fas fa-plus"></i> Upload
                 </button>
                 <input type="file" id="fm-upload-multi" multiple style="display:none" onchange="window._handleMultiUpload(event)">
               </div>
            </div>

            <div id="fm-file-list" class="fm-file-list">
               <div class="text-center text-tertiary" style="padding:40px">Memuat berkas...</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab: Lapangan (Dashboard Arsip) -->
      <div class="tab-content" id="tab-lapangan">
        <div class="card" style="padding:0;overflow:hidden">
          <div class="card-header" style="padding:var(--space-5);border-bottom:1px solid var(--border-subtle);background:var(--bg-elevated)">
            <div>
              <div class="card-title"><i class="fas fa-folder-open" style="color:var(--brand-400);margin-right:8px"></i> File Manager / Bukti Lapangan</div>
              <div class="card-subtitle">Semua file PDF & gambar yang diunggah dan tersimpan ke Google Drive Proyek</div>
            </div>
            <button class="btn btn-ghost btn-sm" onclick="window.renderLapanganGallery()"><i class="fas fa-sync"></i> Refresh Berkas</button>
          </div>
          <div id="lapangan-gallery-container" style="padding:var(--space-5);min-height:300px">
            <!-- Di-render oleh Javascript -->
          </div>
        </div>
      </div>

      <!-- Action Bar -->
      <div style="margin-top:var(--space-5);display:flex;gap:var(--space-3);justify-content:flex-end">
        <button class="btn btn-secondary" onclick="window.navigate('proyek-detail',{id:'${proyek.id}'})">
          <i class="fas fa-arrow-left"></i> Kembali
        </button>
        <button class="btn btn-primary" onclick="window._saveChecklist()">
          <i class="fas fa-save"></i> Simpan & Lanjut ke Analisis
        </button>
      </div>
    </div>
  `;
}

// ── Init ──────────────────────────────────────────────────────
function initTabs() {
  window.switchTab = (name) => {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    document.getElementById(`tab-${name}`)?.classList.add('active');
    document.getElementById(`tab-btn-${name}`)?.classList.add('active');
    
    if (name === 'files') {
      window._loadFiles();
    }
  };
}

// ── Render Dashboard Lapangan ───────────────────────────────────
window.renderLapanganGallery = () => {
  const container = document.getElementById('lapangan-gallery-container');
  if (!container) return;

  let hasFiles = false;
  let html = '<div class="gallery-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:var(--space-4)">';

  // Loop semua item yang ada fotonya
  Object.keys(window._dbFotoLinks).forEach(kode => {
    const urls = window._dbFotoLinks[kode] || [];
    if (urls.length > 0) {
      hasFiles = true;
      const namaKomponen = window._checklistDataMap[kode]?.nama || kode;
      urls.forEach((url, index) => {
        // Cek file extension dari format namanya kalau ada, jika tidak, kita tidak tahu. 
        // Biasa Drive URL tidak ada ekstensi di ujungnya, jadi kita kasih thumbnail document generik
        html += `
          <div class="card" style="padding:var(--space-3);border:1px solid var(--border-subtle);box-shadow:none">
            <div style="height:120px;background:var(--bg-canvas);border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;margin-bottom:var(--space-3)">
               <a href="${escapeHtml(url)}" target="_blank" style="text-decoration:none;color:var(--text-tertiary)">
                 <i class="fas fa-file-invoice" style="font-size:3rem;"></i>
               </a>
            </div>
            <div class="text-xs text-tertiary">[${escapeHtml(kode)}] - File ${index+1}</div>
            <div class="text-sm font-semibold text-secondary" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${escapeHtml(namaKomponen)}">${escapeHtml(namaKomponen)}</div>
            <a href="${escapeHtml(url)}" target="_blank" class="btn btn-outline btn-sm" style="width:100%;margin-top:8px">Buka di Drive</a>
          </div>
        `;
      });
    }
  });

  html += '</div>';

  if (!hasFiles) {
    container.innerHTML = `
      <div style="text-align:center;padding:var(--space-10) 0;color:var(--text-tertiary)">
        <i class="fas fa-box-open" style="font-size:3rem;margin-bottom:12px;opacity:0.3"></i>
        <div>Belum ada dokumen/foto lapangan yang diunggah ke komponen manapun.</div>
      </div>
    `;
  } else {
    container.innerHTML = html;
  }
};

function escapeHtml(str) {
  if(!str) return '';
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[tag]));
}

// ── AI Vision Handlers ──────────────────────────────────────────
async function processImagesForAI(fileList, kode, componentName, kategori, aspek) {
  if (!fileList || fileList.length === 0) return;
  const files = Array.from(fileList).filter(f => f.type.startsWith('image/') || f.type === 'application/pdf');
  if (files.length === 0) return showError('Harap masukkan file gambar (JPG/PNG) atau PDF!');

  const dzContent = document.getElementById(`dz-content-${kode}`);
  dzContent.innerHTML = `<i class="fas fa-circle-notch fa-spin" style="color:var(--brand-400)"></i> <span style="font-size:0.75rem;margin-left:4px">Menganalisis ${files.length} File...</span>`;

  try {
    const imagesData = [];
    
    for (const file of files) {
      if (file.type.startsWith('image/')) {
        // Panggil Editor untuk Anotasi
        const editedBase64 = await openImageEditor(file);
        if (editedBase64) {
          imagesData.push({
            base64: editedBase64.split(',')[1],
            mimeType: 'image/jpeg'
          });
        }
      } else {
        // PDF dkk langsung diproses tanpa editor
        const readBase64 = (f) => new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(f);
          reader.onload = () => resolve({
            base64: reader.result.split(',')[1],
            mimeType: f.type
          });
          reader.onerror = reject;
        });
        imagesData.push(await readBase64(file));
      }
    }

    if (imagesData.length === 0) {
      dzContent.innerHTML = `<i class="fas fa-magic" style="color:var(--brand-400)"></i> <span style="font-size:0.75rem;font-weight:600;margin-left:4px">Batal</span>`;
      return;
    }

    // 1. Ekstrak data metadata untuk dikirim ke Drive
    const drivePayload = imagesData.map(imgData => ({
      base64: imgData.base64,
      mimeType: imgData.mimeType,
      name: `${kategori.toUpperCase()}_${kode}_${new Date().getTime()}`
    }));

    // 2. Jalankan Upload ke Drive secara NON-BLOCKING (Agar layar AI tidak tersendat)
    uploadToGoogleDrive(drivePayload, window._checklistProyekId).then(urls => {
      if (urls && urls.length > 0) {
        window._dbFotoLinks[kode] = [...(window._dbFotoLinks[kode] || []), ...urls];
        window._markDirty(kode); // Pastikan ini dikenali sebagai perubahan pada form
        console.log(`[Drive] ${urls.length} file diunggah ke Google Drive: `, urls);
        window.renderLapanganGallery(); // Update Galeri di latar
      }
    }).catch(console.error);

    try {
       // 3. Menunggu Jawaban Vision Router
       const aiResult = await analyzeChecklistImage(imagesData, componentName, kategori, aspek);
       
       // Update UI Form
       const txtCatatan = document.getElementById(`cl-${kode}-catatan`);
       const selStatus = document.getElementById(`cl-${kode}-status`);
       
       // Tambahkan note AI ke textarea tanpa menimpa note buatan manusia jika ada
       const oldVal = txtCatatan.value.trim();
       const labelMod = kategori === 'administrasi' ? 'Audit AI' : 'AI Vision';
       const aiMarker = `[${labelMod} (${files.length} File): \n` + aiResult.catatan + "\n]";
       txtCatatan.value = oldVal ? oldVal + "\n\n" + aiMarker : aiMarker;
       
       // Update dropdown severity
       if (aiResult.status && Array.from(selStatus.options).some(o => o.value === aiResult.status)) {
          Array.from(selStatus.options).forEach(opt => {
            if(opt.value === aiResult.status) opt.selected = true;
          });
       }
       
       window._markDirty(kode);
       dzContent.innerHTML = `<i class="fas fa-check-circle" style="color:var(--success-400)"></i> <span style="font-size:0.75rem;color:var(--success-400);margin-left:4px;font-weight:600">Selesai</span>`;
       showSuccess(`AI merespons komponen ${componentName}: ${aiResult.status.toUpperCase()}`);
       
       setTimeout(() => {
          const icon = kategori === 'administrasi' ? 'fa-file-pdf' : 'fa-magic';
          const txtLabel = kategori === 'administrasi' ? 'AI Audit: Drop Dokumen/Foto' : 'AI Vision: Drop Dokumen/Foto';
          dzContent.innerHTML = `<i class="fas ${icon}" style="color:var(--brand-400)"></i> <span style="font-size:0.75rem;font-weight:600;margin-left:4px">${txtLabel}</span>`;
       }, 4000);

    } catch(e) {
       showError('Gemini Error: ' + e.message);
       dzContent.innerHTML = `<i class="fas fa-exclamation-triangle" style="color:var(--danger-400)"></i> <span style="font-size:0.75rem;color:var(--danger-400);margin-left:4px">Gagal AI</span>`;
    }
  } catch(e) {
    showError('Gagal membaca file di perangkat.');
  }
}

window._handleImageDrop = function(e, kode, nama, kategori = 'teknis', aspek = '') {
  e.preventDefault();
  const dz = e.currentTarget;
  dz.style.borderColor='var(--border-subtle)'; dz.style.color='var(--text-tertiary)';
  if(e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    processImagesForAI(e.dataTransfer.files, kode, nama, kategori, aspek);
  }
};

window._handleImageSelect = function(e, kode, nama, kategori = 'teknis', aspek = '') {
  if(e.target.files && e.target.files.length > 0) {
    processImagesForAI(e.target.files, kode, nama, kategori, aspek);
  }
};

let _dirtyKodes = new Set();
let _saveTimer  = null;

function initAutoSave(proyekId) {
  window._markDirty = (kode) => {
    _dirtyKodes.add(kode);
    clearTimeout(_saveTimer);
    _saveTimer = setTimeout(() => doSave(proyekId, false), 2000);
  };

  window._saveChecklist = async () => {
    await doSave(proyekId, true);
  };
}

async function doSave(proyekId, showToast) {
  const user = getUserInfo();
  const allKodes = [
    ...CHECKLIST_ADMIN.map(i => i.kode),
    ...CHECKLIST_TEKNIS.flatMap(g => g.items.map(i => i.kode)),
  ];

  // Collect all values
  const items = allKodes.map(kode => {
    const statusEl  = document.getElementById(`cl-${kode}-status`);
    const catatanEl = document.getElementById(`cl-${kode}-catatan`);
    if (!statusEl) return null;
    const kategori = statusEl.dataset.kategori || 'teknis';
    const aspek    = statusEl.dataset.aspek || '';
    return {
      proyek_id:  proyekId,
      kode:       kode,
      kategori:   kategori,
      aspek:      aspek,
      nama:       statusEl.closest('tr')?.cells[1]?.textContent?.trim() || kode,
      status:     statusEl.value || null,
      catatan:    catatanEl?.value || null,
      foto_urls:  window._dbFotoLinks[kode] || [], // <- MASUKKAN ARRAY DARI DRIVE KE DB
      created_by: user?.email,
      updated_at: new Date().toISOString(),
    };
  }).filter(Boolean);

  try {
    // Upsert semua items
  // Filter & persiapkan payload
  const validItems = items.filter(i => i.status !== null && i.status !== '');

  if (validItems.length === 0) {
    if (showToast) showSuccess('Pekerjaan disimpan. (Belum ada status yang terisi)');
    return;
  }

  // Tampilkan loading toast jika showToast true
  if (showToast) {
    const btn = document.querySelector('button[onclick="window._saveChecklist()"]');
    if (btn) btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Menyimpan...';
  }

  // Jika Offline: Simpan ke IndexedDB (Draft)
  if (!navigator.onLine) {
    try {
      await saveOfflineDrafts(validItems);
      _dirtyKodes.clear();
      
      if (showToast) {
        showInfo('Mode Offline: Data disimpan secara lokal di perangkat Anda. Jangan lupa sinkronisasi saat online kembali.');
        const btn = document.querySelector('button[onclick="window._saveChecklist()"]');
        if (btn) btn.innerHTML = '<i class="fas fa-save"></i> Simpan & Lanjut ke Analisis';
      }
      
      // Trigger update UI banner (panggil manual karena global)
      if (window.updateSyncUI) window.updateSyncUI();
      return;
    } catch (dbErr) {
       showError('Gagal menyimpan draft lokal: ' + dbErr.message);
       return;
    }
  }

  const { error } = await supabase.from('checklist_items').upsert(
    validItems, 
    { onConflict: 'proyek_id, kode' }
  );

  if (showToast) {
    const btn = document.querySelector('button[onclick="window._saveChecklist()"]');
    if (btn) btn.innerHTML = '<i class="fas fa-save"></i> Simpan & Lanjut ke Analisis';
  }

  if (error) {
    console.error("Supabase Save Error:", error);
    // Tangani error kolom tidak ada (PWA update)
    if (error.message && error.message.includes('foto_urls')) {
       showError('GAGAL FATAL: Kolom foto_urls belum ada di Supabase. Buka Dasbor Supabase Anda > SQL Editor > Jalankan: ALTER TABLE public.checklist_items ADD COLUMN foto_urls jsonb;', 10000);
       alert("DATABASE ERROR: Supabase menolak data karena kolom 'foto_urls' belum ada. Silakan jalankan perintah SQL yang muncul di pesan Error layar Anda.");
    } else {
       showError('Gagal menyimpan: ' + error.message);
    }
  } else {
    // Update progress di tabel proyek
    const done  = items.filter(i => i.status).length;
    const total = items.length;
    const clPct = Math.round((done / total) * 100);
    const progress = Math.min(40, Math.round(clPct * 0.4)); // checklist = 40% dari total
    await supabase.from('proyek').update({ progress }).eq('id', proyekId);

    _dirtyKodes.clear();
    if (showToast) {
      showSuccess('Seluruh Data Checklist, Analisis AI, dan Lampiran Drive berhasil disimpan!');
      setTimeout(() => {
        window.navigate('analisis', { id: proyekId });
      }, 1500);
    }
  }
  } catch (err) {
    showError('Kesalahan terduga saat menyimpan: ' + err.message);
  }
}

// ── Data Fetchers ─────────────────────────────────────────────
async function fetchProyek(id) {
  try {
    const { data } = await supabase.from('proyek').select('id,nama_bangunan').eq('id', id).single();
    return data;
  } catch { return null; }
}

async function fetchChecklistData(proyekId) {
  try {
    const { data } = await supabase
      .from('checklist_items')
      .select('*')
      .eq('proyek_id', proyekId);
    return data || [];
  } catch { return []; }
}

function renderSkeleton() {
  return `
    <div class="page-header">
      <div class="skeleton" style="height:20px;width:200px;margin-bottom:8px"></div>
      <div class="skeleton" style="height:36px;width:400px;margin-bottom:8px"></div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-4);margin-bottom:var(--space-5)">
      ${Array(3).fill(0).map(()=>`<div class="skeleton" style="height:80px;border-radius:var(--radius-lg)"></div>`).join('')}
    </div>
    <div class="skeleton" style="height:56px;border-radius:var(--radius-lg);margin-bottom:var(--space-5)"></div>
    <div class="skeleton" style="height:400px;border-radius:var(--radius-lg)"></div>
  `;
}

function escHtml(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ── MODERN FILE MANAGEMENT LOGIC ─────────────────────────────
window._filesList = [];
window._currentCat = 'all';
window._currentSub = null;

window._loadFiles = async () => {
  const container = document.getElementById('fm-file-list');
  const { data, error } = await supabase
    .from('proyek_files')
    .select('*')
    .eq('proyek_id', window._checklistProyekId)
    .order('created_at', { ascending: false });

  if (error) {
    container.innerHTML = `<div class="text-danger">Gagal memuat: ${error.message}</div>`;
    return;
  }

  window._filesList = data || [];
  window._renderFileList();
};

window._filterFiles = (cat, sub = null) => {
  window._currentCat = cat;
  window._currentSub = sub;
  
  // UI Update
  document.querySelectorAll('.fm-tree-item, .fm-tree-sub').forEach(el => el.classList.remove('active'));
  if (sub) {
    document.getElementById(`tree-sub-${sub}`)?.classList.add('active');
  } else {
    document.getElementById(`tree-${cat}`)?.classList.add('active');
  }
  
  window._renderFileList();
};

window._renderFileList = () => {
  const container = document.getElementById('fm-file-list');
  const searchStr = document.getElementById('fm-search-input')?.value.toLowerCase() || '';
  
  let filtered = window._filesList;
  if (window._currentCat !== 'all') {
    filtered = filtered.filter(f => f.category === window._currentCat);
  }
  if (window._currentSub) {
    filtered = filtered.filter(f => f.subcategory === window._currentSub);
  }
  if (searchStr) {
    filtered = filtered.filter(f => f.name.toLowerCase().includes(searchStr) || f.subcategory?.toLowerCase().includes(searchStr));
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="fm-empty">
        <i class="fas fa-folder-open"></i>
        <p>Belum ada berkas di kategori ini</p>
      </div>`;
    return;
  }

  container.innerHTML = `
    <table class="fm-table">
      <thead>
        <tr>
          <th>Nama Berkas</th>
          <th>Kategori</th>
          <th>AI Status</th>
          <th>Tanggal</th>
          <th style="width:50px"></th>
        </tr>
      </thead>
      <tbody>
        ${filtered.map(f => `
          <tr>
            <td>
              <div class="flex items-center gap-2">
                <i class="fas ${f.name.endsWith('.pdf') ? 'fa-file-pdf text-danger' : 'fa-file-image text-primary'}"></i>
                <a href="${f.file_url}" target="_blank" class="fm-file-link">${escHtml(f.name)}</a>
              </div>
            </td>
            <td><span class="badge badge-outline">${escHtml(f.subcategory || f.category)}</span></td>
            <td>
              <span class="ai-status-indicator ${f.ai_status}">
                 ${f.ai_status === 'ready' ? '🟢 Ready' : f.ai_status === 'processing' ? '🟡 Processing' : '🔴 Error'}
              </span>
            </td>
            <td class="text-xs text-tertiary">${new Date(f.created_at).toLocaleDateString()}</td>
            <td>
              <button class="btn btn-ghost btn-xs text-danger" onclick="window._deleteFile('${f.id}')">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
};

window._handleMultiUpload = async (e) => {
  const files = Array.from(e.target.files);
  if (!files.length) return;

  showInfo(`Mengunggah ${files.length} berkas...`);
  
  for (const file of files) {
    const fileName = file.name;
    const fileType = file.type;
    
    // 1. Convert ke Base64 (untuk Drive)
    const readBase64 = (f) => new Promise(resolve => {
       const reader = new FileReader();
       reader.readAsDataURL(f);
       reader.onload = () => resolve(reader.result.split(',')[1]);
    });

    try {
      const b64 = await readBase64(file);
      
      // Pilih kategori & sub dari folder yang sedang aktif
      const targetCat = window._currentCat === 'all' ? 'umum' : window._currentCat;
      const targetSub = window._currentSub || null;

      // 2. Insert Awal (Initial State)
      const { data: record, error } = await supabase.from('proyek_files').insert({
        proyek_id: window._checklistProyekId,
        name: fileName,
        category: targetCat,
        subcategory: targetSub,
        ai_status: 'pending',
        source: 'local'
      }).select().single();

      if (error) throw error;
      
      window._filesList.unshift(record);
      window._renderFileList();

      // 3. Simpan saja dulu (Tanpa Auto-Analysis)
      showSuccess(`Berkas ${fileName} berhasil disimpan.`);

      // 4. Upload ke Google Drive (Background Sync)
      uploadToGoogleDrive([{ base64: b64, mimeType: fileType, name: fileName }], window._checklistProyekId).then(async (urls) => {
         if (urls && urls.length > 0) {
            await supabase.from('proyek_files').update({ file_url: urls[0], drive_link: urls[0] }).eq('id', record.id);
            window._loadFiles();
         }
      });

    } catch (err) {
      showError(`Gagal memproses ${fileName}: ${err.message}`);
    }
  }
};

window._deleteFile = async (id) => {
  if (!confirm('Hapus berkas ini?')) return;
  const { error } = await supabase.from('proyek_files').delete().eq('id', id);
  if (!error) {
    window._filesList = window._filesList.filter(f => f.id !== id);
    window._renderFileList();
  }
};

window._syncDrive = () => {
  showInfo("Fitur Google Drive Sync sedang menyiapkan koneksi aman...");
};
