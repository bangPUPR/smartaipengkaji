// ============================================================
//  CHECKLIST PAGE
//  3 Tab: Administrasi | Teknis | Lapangan
//  Data disimpan ke Supabase tabel checklist_items
// ============================================================
import { supabase }  from '../lib/supabase.js';
import { navigate }  from '../lib/router.js';
import { showSuccess, showError, showInfo } from '../components/toast.js';
import { getUserInfo } from '../lib/auth.js';
import { analyzeChecklistImage } from '../lib/gemini.js';
import { uploadToGoogleDrive } from '../lib/drive.js';

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
  { aspek: 'Struktur', items: [
    { kode: 'S01', nama: 'Kondisi Pondasi' },
    { kode: 'S02', nama: 'Kondisi Kolom Struktur' },
    { kode: 'S03', nama: 'Kondisi Balok Struktur' },
    { kode: 'S04', nama: 'Kondisi Pelat Lantai' },
    { kode: 'S05', nama: 'Kondisi Rangka Atap' },
    { kode: 'S06', nama: 'Kondisi Dinding Struktural / Shear Wall' },
    { kode: 'S07', nama: 'Kesesuaian Konstruksi dengan PBG' },
  ]},
  { aspek: 'Arsitektur', items: [
    { kode: 'AR01', nama: 'Kondisi Dinding Non-Struktural' },
    { kode: 'AR02', nama: 'Kondisi Pintu dan Jendela' },
    { kode: 'AR03', nama: 'Kondisi Penutup Lantai' },
    { kode: 'AR04', nama: 'Kondisi Plafon' },
    { kode: 'AR05', nama: 'Kondisi Fasad / Eksterior Bangunan' },
    { kode: 'AR06', nama: 'Kesesuaian Tata Letak dengan Gambar' },
  ]},
  { aspek: 'MEP (Mekanikal, Elektrikal, Plumbing)', items: [
    { kode: 'M01', nama: 'Instalasi Listrik (Panel, Kabel, ELCB)' },
    { kode: 'M02', nama: 'Instalasi Air Bersih' },
    { kode: 'M03', nama: 'Instalasi Air Kotor & Sanitasi' },
    { kode: 'M04', nama: 'Instalasi Gas (jika ada)' },
    { kode: 'M05', nama: 'Sistem HVAC / Ventilasi' },
    { kode: 'M06', nama: 'Instalasi Lift / Eskalator (jika ada)' },
  ]},
  { aspek: 'Keselamatan Kebakaran', items: [
    { kode: 'K01', nama: 'Alat Pemadam Api Ringan (APAR)' },
    { kode: 'K02', nama: 'Sistem Sprinkler' },
    { kode: 'K03', nama: 'Sistem Hidran Gedung' },
    { kode: 'K04', nama: 'Alarm Kebakaran & Detektor Asap' },
    { kode: 'K05', nama: 'Tangga Darurat & Pintu Kebakaran' },
    { kode: 'K06', nama: 'Jalur Evakuasi & Tanda Darurat' },
  ]},
  { aspek: 'Kesehatan', items: [
    { kode: 'KH01', nama: 'Ventilasi Udara Memadai' },
    { kode: 'KH02', nama: 'Pencahayaan Alami & Buatan' },
    { kode: 'KH03', nama: 'Fasilitas Sanitasi (Toilet, Wastafel)' },
    { kode: 'KH04', nama: 'Pengelolaan Sampah' },
  ]},
  { aspek: 'Kenyamanan', items: [
    { kode: 'KN01', nama: 'Kenyamanan Termal (Suhu Ruang)' },
    { kode: 'KN02', nama: 'Kenyamanan Visual (Silau, Pencahayaan)' },
    { kode: 'KN03', nama: 'Pengendalian Kebisingan' },
  ]},
  { aspek: 'Kemudahan / Aksesibilitas', items: [
    { kode: 'KM01', nama: 'Fasilitas Difabel (Ramp, Toilet Difabel)' },
    { kode: 'KM02', nama: 'Lebar Koridor & Sirkulasi Memadai' },
    { kode: 'KM03', nama: 'Area Parkir Cukup' },
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
    const readBase64 = (file) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve({
        base64: reader.result.split(',')[1],
        mimeType: file.type
      });
      reader.onerror = reject;
    });

    const imagesData = await Promise.all(files.map(readBase64));

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
