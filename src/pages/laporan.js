// ============================================================
//  LAPORAN PAGE
//  Preview & Export Laporan Kajian SLF
// ============================================================
import { supabase } from '../lib/supabase.js';
import { navigate } from '../lib/router.js';
import { showSuccess, showError } from '../components/toast.js';
import { marked } from 'marked';
import { generateDocx } from '../lib/docx-service.js';

export async function laporanPage(params = {}) {
  const id = params.id;
  if (!id) { navigate('proyek'); return ''; }

  const root = document.getElementById('page-root');
  if (root) root.innerHTML = renderSkeleton();

  const [proyek, analisis, checklist] = await Promise.all([
    fetchProyek(id),
    fetchLastAnalisis(id),
    fetchChecklist(id),
  ]);

  if (!proyek) { navigate('proyek'); showError('Proyek tidak ditemukan.'); return ''; }

  const html = buildHtml(proyek, analisis, checklist);
  if (root) {
    root.innerHTML = html;
    initLaporanActions(proyek, analisis, checklist);
  }
  return html;
}

function buildHtml(proyek, analisis, checklist) {
  if (!analisis) {
    return `
      <div class="page-container flex-center">
        <div class="card" style="text-align:center;padding:var(--space-12);max-width:500px">
          <div style="width:70px;height:70px;background:var(--gradient-brand);border-radius:var(--radius-xl);display:flex;align-items:center;justify-content:center;margin:0 auto var(--space-5);font-size:1.8rem;color:white">
            <i class="fas fa-file-contract"></i>
          </div>
          <h3 style="font-size:1.1rem;font-weight:700;margin-bottom:var(--space-2)">Laporan Belum Tersedia</h3>
          <p style="color:var(--text-secondary);margin:0 auto var(--space-6)">
            Laporan SLF baru dapat di-generate setelah Anda melengkapi checklist dan melakukan Analisis AI.
          </p>
          <button class="btn btn-primary" onclick="window.navigate('analisis',{id:'${proyek.id}'})">
            <i class="fas fa-brain"></i> Buka Halaman Analisis
          </button>
        </div>
      </div>
    `;
  }

  const sections = [
    { id: 'cover', icon: 'fa-book', label: 'Cover Laporan' },
    { id: 'bab1', icon: 'fa-building', label: 'Bab I: Gambaran Umum' },
    { id: 'bab2', icon: 'fa-search', label: 'Bab II: Metodologi' },
    { id: 'bab3', icon: 'fa-clipboard-check', label: 'Bab III: Hasil Checklist' },
    { id: 'bab4', icon: 'fa-brain', label: 'Bab IV: Analisis AI' },
    { id: 'bab5', icon: 'fa-certificate', label: 'Bab V: Kesimpulan' },
    { id: 'bab6', icon: 'fa-list-check', label: 'Bab VI: Rekomendasi' },
  ];

  return `
    <div id="laporan-page">
      <!-- Action Bar (No Print) -->
      <div class="page-header no-print">
        <div class="flex-between">
          <div>
            <button class="btn btn-ghost btn-sm" onclick="window.navigate('proyek-detail',{id:'${proyek.id}'})" style="margin-bottom:8px">
              <i class="fas fa-arrow-left"></i> ${escHtml(proyek.nama_bangunan)}
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
              ${sections.map((s, i) => `
                <a href="javascript:void(0)" class="laporan-nav-item ${i===0?'active':''}" 
                   onclick="document.querySelectorAll('.laporan-nav-item').forEach(el=>el.classList.remove('active')); this.classList.add('active'); document.getElementById('lap-${s.id}').scrollIntoView({ behavior: 'smooth', block: 'start' });">
                  <i class="fas ${s.icon} shrink-0" style="width:20px;text-align:center"></i>
                  <span class="truncate">${s.label}</span>
                </a>
              `).join('')}
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
              <h2 style="font-size:1.4rem;margin-bottom:12px;border:none;padding:0">${escHtml(proyek.nama_bangunan)}</h2>
              <p style="font-size:1rem;margin:0;opacity:0.9">${escHtml(proyek.alamat)}</p>
            </div>

            <div style="margin-top:auto;padding-top:60px">
              <p style="font-size:1.1rem;margin-bottom:8px">Diajukan oleh:</p>
              <p style="font-size:1.3rem;font-weight:700;margin-bottom:32px">${escHtml(proyek.pemilik)}</p>
              
              <div style="width:60px;height:4px;background:rgba(255,255,255,0.3);margin:0 auto 24px;border-radius:2px"></div>
              <p style="font-size:1rem;opacity:0.8">${formatTanggal(new Date())}</p>
            </div>
          </div>

          <!-- BAB I: GAMBARAN UMUM -->
          <div id="lap-bab1" class="laporan-section" style="page-break-before:always">
            <h2>BAB I: Gambaran Umum Bangunan</h2>
            <p>Pemeriksaan kelaikan fungsi bangunan gedung ini dilakukan pada:</p>
            <table>
              <tbody>
                <tr><td style="width:30%">Nama Bangunan</td><td><b>${escHtml(proyek.nama_bangunan)}</b></td></tr>
                <tr><td>Jenis Bangunan</td><td>${escHtml(proyek.jenis_bangunan || '-')}</td></tr>
                <tr><td>Fungsi Bangunan</td><td>${escHtml(proyek.fungsi_bangunan || '-')}</td></tr>
                <tr><td>Alamat Lokasi</td><td>${escHtml(proyek.alamat)}, ${escHtml(proyek.kota)}, ${escHtml(proyek.provinsi)}</td></tr>
                <tr><td>Nama Pemilik</td><td>${escHtml(proyek.pemilik)}</td></tr>
                <tr><td>Tahun Dibangun</td><td>${proyek.tahun_dibangun || '-'}</td></tr>
                <tr><td>Jumlah Lantai</td><td>${proyek.jumlah_lantai || '-'} Lantai</td></tr>
                <tr><td>Luas Bangunan</td><td>${proyek.luas_bangunan ? Number(proyek.luas_bangunan).toLocaleString('id-ID') : '-'} m²</td></tr>
                <tr><td>Luas Lahan</td><td>${proyek.luas_lahan ? Number(proyek.luas_lahan).toLocaleString('id-ID') : '-'} m²</td></tr>
                <tr><td>Konstruksi Utama</td><td>${escHtml(proyek.jenis_konstruksi || '-')}</td></tr>
                <tr><td>Nomor PBG/IMB</td><td>${escHtml(proyek.nomor_pbg || 'Belum tersedia')}</td></tr>
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
            ${renderChecklistTable(checklist.filter(c => c.kategori === 'administrasi'))}

            <h3 style="margin-top:24px">3.2. Kondisi Teknis Eksisting</h3>
            ${renderChecklistTable(checklist.filter(c => c.kategori === 'teknis'))}
          </div>

          <!-- BAB IV: ANALISIS AI -->
          <div id="lap-bab4" class="laporan-section" style="page-break-before:always">
            <h2>BAB IV: Hasil Analisis AI SLF</h2>
            <p>Berdasarkan data input pemeriksaan (Checklist), AI Engine (Rule-based SNI 9273:2025) telah melakukan kuantifikasi pembobotan kondisi keandalan bangunan dengan hasil sebagai berikut:</p>

            <div style="display:flex;gap:20px;margin:24px 0">
              <!-- Score Grid Print Version -->
              <div style="flex:1;display:grid;grid-template-columns:1fr 1fr;gap:12px">
                ${[
                  { lbl: 'Administrasi', val: analisis.skor_administrasi },
                  { lbl: 'Struktur', val: analisis.skor_struktur },
                  { lbl: 'Arsitektur', val: analisis.skor_arsitektur },
                  { lbl: 'MEP (Utilitas)', val: analisis.skor_mep },
                  { lbl: 'Keselamatan', val: analisis.skor_kebakaran },
                  { lbl: 'Kesehatan', val: analisis.skor_kesehatan },
                  { lbl: 'Kenyamanan', val: analisis.skor_kenyamanan },
                  { lbl: 'Kemudahan', val: analisis.skor_kemudahan },
                ].map(a => `
                  <div style="padding:10px;border:1px solid #e5e7eb;border-radius:6px;display:flex;justify-content:space-between;align-items:center;background:${a.val<60?'#fef2f2':'#f9fafb'}">
                    <span style="font-size:0.8rem;font-weight:600">${a.lbl}</span>
                    <span style="font-size:1.1rem;font-weight:800;color:${a.val<60?'#dc2626':a.val<80?'#d97706':'#059669'}">${a.val}/100</span>
                  </div>
                `).join('')}
              </div>
              
              <div style="width:240px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:24px;text-align:center;display:flex;flex-direction:column;justify-content:center">
                <div style="font-size:0.8rem;text-transform:uppercase;letter-spacing:1px;color:#64748b;margin-bottom:8px">Skor Keseluruhan</div>
                <div style="font-size:4rem;font-weight:800;color:#1e3a8a;line-height:1">${analisis.skor_total}</div>
                <div style="margin-top:16px;font-size:0.9rem;font-weight:700;color:${analisis.risk_level==='low'?'#059669':analisis.risk_level==='medium'?'#d97706':'#dc2626'}">
                  Risiko ${analisis.risk_level==='low'?'Rendah':analisis.risk_level==='medium'?'Sedang':analisis.risk_level==='high'?'Tinggi':'Kritis'}
                </div>
              </div>
            </div>

            ${analisis.narasi_teknis ? `
              <h3>4.1. Narasi Evaluasi Kinerja</h3>
              <div class="markdown-content" style="background:#f0f9ff;border-left:4px solid #0284c7;padding:16px">${marked.parse(analisis.narasi_teknis)}</div>
            ` : ''}
          </div>

          <!-- BAB V: KESIMPULAN -->
          <div id="lap-bab5" class="laporan-section" style="page-break-before:always">
            <h2>BAB V: Kesimpulan Status Kelaikan</h2>
            <p>Berdasarkan kajian teknis lapangan dan hasil analisis sistem terhadap parameter keselamatan, kesehatan, kenyamanan, dan kemudahan, maka disimpulkan bahwa bangunan gedung:</p>
            
            <div style="margin:32px 0;text-align:center">
              <span class="${analisis.status_slf==='LAIK_FUNGSI'?'status-laik':analisis.status_slf==='LAIK_FUNGSI_BERSYARAT'?'status-bersyarat':'status-tidak-laik'}" style="font-size:1.5rem;padding:16px 32px">
                ${analisis.status_slf==='LAIK_FUNGSI'?'LAIK FUNGSI':analisis.status_slf==='LAIK_FUNGSI_BERSYARAT'?'LAIK FUNGSI BERSYARAT':'TIDAK LAIK FUNGSI'}
              </span>
            </div>

            <p style="text-align:center;max-width:600px;margin:0 auto;font-weight:600;color:#4b5563">
              ${analisis.status_slf==='LAIK_FUNGSI'?'Bangunan siap dioperasikan dan dapat diterbitkan Sertifikat Laik Fungsi (SLF).'
               :analisis.status_slf==='LAIK_FUNGSI_BERSYARAT'?'Bangunan dapat dioperasikan dengan catatan harus segera menindaklanjuti rekomendasi perbaikan sebelum batas waktu yang ditentukan.'
               :'Bangunan belum memenuhi standar minimal keselamatan dan belum dapat diterbitkan SLF. Harus dilakukan perbaikan menyeluruh (rehabilitasi/retrofit).'}
            </p>
          </div>

          <!-- BAB VI: REKOMENDASI -->
          <div id="lap-bab6" class="laporan-section" style="page-break-before:always">
            <h2>BAB VI: Rekomendasi Terukur</h2>
            <p>Untuk mempertahankan atau meningkatkan status kelaikan fungsi bangunan, direkomendasikan tindak lanjut sebagai berikut:</p>
            
            ${renderRekomendasi(analisis.rekomendasi)}

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
  `;
}

function renderChecklistTable(items) {
  if (!items || items.length === 0) return '<p style="font-size:0.85rem;font-style:italic">Data tidak tersedia.</p>';
  
  const statusLabel = (s) => {
    const map = {
      'ada_sesuai':'Sesuai', 'ada_tidak_sesuai':'Tdk Sesuai', 'tidak_ada':'Tdk Ada', 'pertama_kali':'Pertama Kali',
      'baik':'Baik', 'sedang':'Sedang', 'buruk':'Buruk', 'kritis':'Kritis', 'tidak_wajib':'-'
    };
    return map[s] || s || '-';
  };

  return `
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
        ${items.map(i => `
          <tr>
            <td>${escHtml(i.aspek || i.kategori)}</td>
            <td><b>[${i.kode}]</b> ${escHtml(i.nama)}</td>
            <td><span style="font-weight:600;color:${['baik','ada_sesuai'].includes(i.status)?'#059669':['buruk','kritis','tidak_ada','ada_tidak_sesuai'].includes(i.status)?'#dc2626':'#d97706'}">${statusLabel(i.status)}</span></td>
            <td>${escHtml(i.catatan || '-')}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function renderRekomendasi(rekomText) {
  let list = [];
  try { list = typeof rekomText === 'string' ? JSON.parse(rekomText) : rekomText; } catch(e){}
  
  if (!list || list.length === 0) return '<p>Tidak ada rekomendasi kritis.</p>';

  return `
    <div style="display:flex;flex-direction:column;gap:16px;margin-top:20px">
      ${list.map((r,i) => `
        <div style="border:1px solid #e5e7eb;border-left:4px solid ${r.prioritas?.toLowerCase()==='kritis'?'#dc2626':'#2563eb'};padding:16px;background:#f9fafb;page-break-inside:avoid">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
            <b style="color:#1e3a8a;font-size:0.95rem">${i+1}. ${escHtml(r.judul)} (${escHtml(r.aspek)})</b>
            <span style="font-size:0.75rem;padding:2px 8px;background:${r.prioritas?.toLowerCase()==='kritis'?'#fee2e2':'#e0f2fe'};color:${r.prioritas?.toLowerCase()==='kritis'?'#991b1b':'#0369a1'};border-radius:4px;font-weight:700;text-transform:uppercase">${escHtml(r.prioritas)}</span>
          </div>
          <p style="margin:0;font-size:0.875rem">${escHtml(r.tindakan)}</p>
          ${r.standar ? `<div style="margin-top:8px;font-size:0.75rem;color:#6b7280"><i>Referensi Standar: ${escHtml(r.standar)}</i></div>`:''}
        </div>
      `).join('')}
    </div>
  `;
}

function initLaporanActions(proyek, analisis, checklist) {
  window._downloadWord = async () => {
    try {
      showSuccess('Menyiapkan dokumen Word...');
      await generateDocx(proyek, analisis, checklist);
      showSuccess('Dokumen Word berhasil di-generate!');
    } catch (err) {
      console.error('[Docx] Error generating document:', err);
      showError('Gagal membuat dokumen Word: ' + err.message);
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
async function fetchLastAnalisis(proyekId) {
  try {
    const { data } = await supabase.from('hasil_analisis').select('*').eq('proyek_id', proyekId).order('created_at',{ascending:false}).limit(1);
    return data && data.length > 0 ? data[0] : null;
  } catch { return null; }
}
async function fetchChecklist(proyekId) {
  try {
    const { data } = await supabase.from('checklist_items').select('*').eq('proyek_id', proyekId);
    return data || [];
  } catch { return []; }
}

function renderSkeleton() {
  return `
    <div class="page-header">
      <div class="skeleton" style="height:36px;width:300px;margin-bottom:8px"></div>
      <div class="skeleton" style="height:20px;width:400px"></div>
    </div>
    <div style="display:grid;grid-template-columns:240px 1fr;gap:var(--space-5)">
      <div class="skeleton" style="height:400px;border-radius:var(--radius-lg)"></div>
      <div class="skeleton" style="height:800px;border-radius:var(--radius-lg)"></div>
    </div>
  `;
}

function escHtml(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function formatTanggal(d) { try { return new Date(d).toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'}); } catch { return d; } }
