// ============================================================
//  LAPORAN PAGE — Professional Report Preview & Export
//  Fitur: Preview Laporan, Export Word (.docx), Export PDF
//  Standard: PUPR / WORD_SAFE_EXPORT
// ============================================================
import { supabase } from '../lib/supabase.js';
import { navigate } from '../lib/router.js';
import { showSuccess, showError, showInfo } from '../components/toast.js';
import { marked } from 'marked';
import { generateDocx } from '../lib/docx-service.js';
import { generatePDF, generatePDFViaPrint } from '../lib/pdf-service.js';
import { parseNarasiAI, renderToHTML } from '../lib/report-formatter.js';

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
    initExportDropdown();
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
            <!-- Export Dropdown -->
            <div class="export-dropdown" id="export-dropdown">
              <button class="btn btn-primary" id="btn-export-toggle" onclick="window._toggleExportDropdown()">
                <i class="fas fa-download"></i> Export Laporan
                <i class="fas fa-chevron-down" style="font-size:0.7rem;margin-left:4px"></i>
              </button>
              <div class="export-dropdown-menu" id="export-menu">
                <button class="export-option" onclick="window._downloadWord()">
                  <div class="export-option-icon" style="background:hsla(220,80%,55%,0.15);color:hsl(220,80%,55%)">
                    <i class="fas fa-file-word"></i>
                  </div>
                  <div>
                    <div class="export-option-title">Microsoft Word (.docx)</div>
                    <div class="export-option-desc">Format PUPR standard, siap edit di Word</div>
                  </div>
                </button>
                <button class="export-option" onclick="window._downloadPDF()">
                  <div class="export-option-icon" style="background:hsla(0,74%,52%,0.15);color:hsl(0,74%,52%)">
                    <i class="fas fa-file-pdf"></i>
                  </div>
                  <div>
                    <div class="export-option-title">PDF Document (.pdf)</div>
                    <div class="export-option-desc">Format cetak, layout identik preview</div>
                  </div>
                </button>
                <div style="border-top:1px solid var(--border-subtle);margin:4px 0"></div>
                <button class="export-option" onclick="window._printReport()">
                  <div class="export-option-icon" style="background:hsla(160,70%,46%,0.15);color:hsl(160,70%,46%)">
                    <i class="fas fa-print"></i>
                  </div>
                  <div>
                    <div class="export-option-title">Cetak Langsung</div>
                    <div class="export-option-desc">Print via Browser (Save as PDF)</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Export Progress Modal -->
      <div class="export-progress-overlay" id="export-progress-overlay" style="display:none">
        <div class="export-progress-modal">
          <div class="export-progress-icon">
            <i class="fas fa-cog fa-spin" id="export-progress-icon-i"></i>
          </div>
          <h3 id="export-progress-title">Mengeksport Dokumen...</h3>
          <p id="export-progress-msg" style="color:var(--text-secondary);font-size:0.85rem;margin-bottom:var(--space-4)">Menyiapkan struktur dokumen...</p>
          <div class="export-progress-bar">
            <div class="export-progress-fill" id="export-progress-fill" style="width:0%"></div>
          </div>
          <div id="export-progress-pct" style="font-size:0.75rem;color:var(--text-tertiary);margin-top:var(--space-2)">0%</div>
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

          <!-- Export Format Info Card -->
          <div class="card no-print" style="margin-top:var(--space-4);padding:var(--space-4)">
            <div style="font-size:0.72rem;font-weight:700;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:var(--space-2)">Format Export</div>
            <div style="display:flex;flex-direction:column;gap:8px;font-size:0.78rem">
              <div style="display:flex;align-items:center;gap:var(--space-2)">
                <i class="fas fa-check-circle" style="color:var(--success-400);font-size:0.7rem"></i>
                <span class="text-secondary">Kertas A4 Portrait</span>
              </div>
              <div style="display:flex;align-items:center;gap:var(--space-2)">
                <i class="fas fa-check-circle" style="color:var(--success-400);font-size:0.7rem"></i>
                <span class="text-secondary">Margin PUPR Standard</span>
              </div>
              <div style="display:flex;align-items:center;gap:var(--space-2)">
                <i class="fas fa-check-circle" style="color:var(--success-400);font-size:0.7rem"></i>
                <span class="text-secondary">Font Calibri 11pt</span>
              </div>
              <div style="display:flex;align-items:center;gap:var(--space-2)">
                <i class="fas fa-check-circle" style="color:var(--success-400);font-size:0.7rem"></i>
                <span class="text-secondary">Word-Safe (Stabil)</span>
              </div>
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
              <p style="font-size:1rem;margin:0;opacity:0.9">${escHtml(proyek.alamat)}, ${escHtml(proyek.kota || '')}</p>
            </div>

            <div style="margin-top:auto;padding-top:60px">
              <p style="font-size:1.1rem;margin-bottom:8px">Diajukan oleh:</p>
              <p style="font-size:1.3rem;font-weight:700;margin-bottom:32px">${escHtml(proyek.pemilik)}</p>
              
              <div style="width:60px;height:4px;background:rgba(255,255,255,0.3);margin:0 auto 24px;border-radius:2px"></div>
              <p style="font-size:1rem;opacity:0.8">${formatTanggal(new Date())}</p>
            </div>
          </div>

          <!-- BAB I: GAMBARAN UMUM -->
          <div id="lap-bab1" class="laporan-section pdf-page-break" style="page-break-before:always">
            <h2>BAB I: Gambaran Umum Bangunan</h2>
            
            <h3>1.1. Latar Belakang</h3>
            <p>Penilaian kelaikan fungsi bangunan gedung merupakan kewajiban yang diamanatkan dalam Peraturan Pemerintah Nomor 16 Tahun 2021 tentang Peraturan Pelaksanaan Undang-Undang Nomor 28 Tahun 2002 tentang Bangunan Gedung. Penilaian ini bertujuan untuk memastikan bahwa bangunan gedung memenuhi persyaratan teknis yang mencakup aspek keselamatan, kesehatan, kenyamanan, dan kemudahan.</p>

            <h3>1.2. Maksud dan Tujuan</h3>
            <p>Kajian ini bertujuan menilai kelengkapan dokumen administratif, mengevaluasi kondisi teknis eksisting, dan menentukan kelayakan fungsi bangunan gedung untuk penerbitan atau perpanjangan Sertifikat Laik Fungsi (SLF).</p>

            <h3>1.3. Data Umum Bangunan</h3>
            <table>
              <tbody>
                <tr><td style="width:30%;font-weight:600">Nama Bangunan</td><td><b>${escHtml(proyek.nama_bangunan)}</b></td></tr>
                <tr><td style="font-weight:600">Jenis Bangunan</td><td>${escHtml(proyek.jenis_bangunan || '-')}</td></tr>
                <tr><td style="font-weight:600">Fungsi Bangunan</td><td>${escHtml(proyek.fungsi_bangunan || '-')}</td></tr>
                <tr><td style="font-weight:600">Alamat Lokasi</td><td>${escHtml(proyek.alamat || '-')}, ${escHtml(proyek.kota || '-')}, ${escHtml(proyek.provinsi || '-')}</td></tr>
                <tr><td style="font-weight:600">Nama Pemilik</td><td>${escHtml(proyek.pemilik)}</td></tr>
                <tr><td style="font-weight:600">Tahun Dibangun</td><td>${proyek.tahun_dibangun || '-'}</td></tr>
                <tr><td style="font-weight:600">Jumlah Lantai</td><td>${proyek.jumlah_lantai || '-'} Lantai</td></tr>
                <tr><td style="font-weight:600">Luas Bangunan</td><td>${proyek.luas_bangunan ? Number(proyek.luas_bangunan).toLocaleString('id-ID') : '-'} m2</td></tr>
                <tr><td style="font-weight:600">Luas Lahan</td><td>${proyek.luas_lahan ? Number(proyek.luas_lahan).toLocaleString('id-ID') : '-'} m2</td></tr>
                <tr><td style="font-weight:600">Konstruksi Utama</td><td>${escHtml(proyek.jenis_konstruksi || '-')}</td></tr>
                <tr><td style="font-weight:600">Nomor PBG/IMB</td><td>${escHtml(proyek.nomor_pbg || 'Belum tersedia')}</td></tr>
              </tbody>
            </table>

            <h3>1.4. Dasar Hukum</h3>
            <ul style="margin-left:20px;font-size:0.875rem;line-height:1.8">
              <li>PP No. 16 Tahun 2021 tentang Peraturan Pelaksanaan UU No. 28/2002 tentang Bangunan Gedung.</li>
              <li>SNI 9273:2025 - Evaluasi dan Rehabilitasi Seismik Bangunan Gedung Eksisting.</li>
              <li>ASCE/SEI 41-17 - Seismic Evaluation and Retrofit of Existing Buildings.</li>
              <li>Peraturan Menteri PUPR terkait Persyaratan Teknis Bangunan Gedung.</li>
            </ul>
          </div>

          <!-- BAB II: METODOLOGI -->
          <div id="lap-bab2" class="laporan-section pdf-page-break" style="page-break-before:always">
            <h2>BAB II: Metodologi Pemeriksaan</h2>
            <p>Pengkajian teknis bangunan gedung ini dilakukan menggunakan pendekatan berbasis kinerja <i>(performance-based evaluation)</i> yang mengintegrasikan beberapa metode:</p>
            
            <h3>2.1. Pendekatan Analisis</h3>
            <table>
              <thead>
                <tr><th style="width:5%">No</th><th style="width:25%">Metode</th><th>Deskripsi</th></tr>
              </thead>
              <tbody>
                <tr><td>1</td><td><b>Rule-based</b></td><td>Evaluasi mengacu pada NSPK, PP No. 16 Tahun 2021, dan standar teknis PUPR.</td></tr>
                <tr><td>2</td><td><b>Risk-based</b></td><td>Penilaian berbasis dampak risiko terhadap keselamatan dan operasional.</td></tr>
                <tr><td>3</td><td><b>Performance-based</b></td><td>Evaluasi kinerja struktur mengacu SNI 9273:2025 dan ASCE/SEI 41-17.</td></tr>
                <tr><td>4</td><td><b>AI Deep Reasoning</b></td><td>Analisis mendalam menggunakan engine Smart AI Pengkaji SLF.</td></tr>
              </tbody>
            </table>

            <h3>2.2. Bobot Penilaian per Aspek</h3>
            <table>
              <thead>
                <tr><th>No</th><th>Aspek</th><th>Bobot (%)</th><th>Acuan Standar</th></tr>
              </thead>
              <tbody>
                <tr><td>1</td><td>Administrasi</td><td>10%</td><td>PP 16/2021</td></tr>
                <tr><td>2</td><td>Struktur</td><td>25%</td><td>SNI 9273:2025</td></tr>
                <tr><td>3</td><td>Arsitektur</td><td>10%</td><td>NSPK BG</td></tr>
                <tr><td>4</td><td>MEP (Utilitas)</td><td>15%</td><td>SNI PUIL/Plumbing</td></tr>
                <tr><td>5</td><td>Keselamatan Kebakaran</td><td>20%</td><td>Permen PU 26/2008</td></tr>
                <tr><td>6</td><td>Kesehatan</td><td>8%</td><td>Permen PUPR 14/2017</td></tr>
                <tr><td>7</td><td>Kenyamanan</td><td>6%</td><td>SNI Kenyamanan</td></tr>
                <tr><td>8</td><td>Kemudahan</td><td>6%</td><td>Permen PU 30/2006</td></tr>
              </tbody>
            </table>

            <h3>2.3. Alur Analisis</h3>
            <p style="text-align:center;font-weight:700;color:#1e3a8a;padding:16px;background:#f0f4ff;border-radius:8px;margin:16px 0">
              Input Data  &rarr;  Validasi  &rarr;  Analisis Rule-based  &rarr;  Deep Reasoning AI  &rarr;  Skoring  &rarr;  Kesimpulan
            </p>
          </div>

          <!-- BAB III: HASIL CHECKLIST -->
          <div id="lap-bab3" class="laporan-section pdf-page-break" style="page-break-before:always">
            <h2>BAB III: Hasil Pemeriksaan Checklist</h2>
            <p>Berikut adalah ringkasan hasil pemeriksaan visual dan dokumen yang dilakukan pada bangunan gedung.</p>
            
            <h3>3.1. Dokumen Administrasi</h3>
            ${renderChecklistTable(checklist.filter(c => c.kategori === 'administrasi'))}

            <h3 style="margin-top:24px">3.2. Kondisi Teknis Eksisting</h3>
            ${renderChecklistTable(checklist.filter(c => c.kategori === 'teknis'))}
          </div>

          <!-- BAB IV: ANALISIS AI -->
          <div id="lap-bab4" class="laporan-section pdf-page-break" style="page-break-before:always">
            <h2>BAB IV: Hasil Analisis AI SLF</h2>
            <p>Berdasarkan data input pemeriksaan, AI Engine telah melakukan evaluasi mendalam dengan hasil sebagai berikut:</p>

            <!-- Ringkasan Analisis -->
            <h3>4.1. Ringkasan Hasil Analisis</h3>
            <table>
              <tbody>
                <tr><td style="width:40%;font-weight:600">Total Item Diperiksa</td><td>${checklist.length} item</td></tr>
                <tr><td style="font-weight:600">Item Sesuai/Baik</td><td style="color:#065f46;font-weight:700">${checklist.filter(i => ['ada_sesuai','baik'].includes(i.status)).length} item</td></tr>
                <tr><td style="font-weight:600">Item Tidak Sesuai/Buruk</td><td style="color:#991b1b;font-weight:700">${checklist.filter(i => ['ada_tidak_sesuai','buruk','kritis'].includes(i.status)).length} item</td></tr>
                <tr><td style="font-weight:600">Skor Kepatuhan Total</td><td style="font-size:1.2rem;font-weight:800;color:#1e3a8a">${analisis.skor_total || 0}%</td></tr>
                <tr><td style="font-weight:600">Level Risiko</td><td style="font-weight:700;color:${analisis.risk_level==='low'?'#065f46':analisis.risk_level==='high'||analisis.risk_level==='critical'?'#991b1b':'#92400e'}">${analisis.risk_level==='low'?'RENDAH':analisis.risk_level==='medium'?'SEDANG':analisis.risk_level==='high'?'TINGGI':'KRITIS'}</td></tr>
              </tbody>
            </table>

            <!-- Skor per aspek -->
            <h3>4.2. Skor Per Aspek Kelaikan Fungsi</h3>
            <div style="display:flex;gap:20px;margin:24px 0">
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
                  <div class="pdf-avoid-break" style="padding:10px;border:1px solid #e5e7eb;border-radius:6px;display:flex;justify-content:space-between;align-items:center;background:${(a.val||0)<60?'#fef2f2':'#f9fafb'}">
                    <span style="font-size:0.8rem;font-weight:600">${a.lbl}</span>
                    <span style="font-size:1.1rem;font-weight:800;color:${(a.val||0)<60?'#dc2626':(a.val||0)<80?'#d97706':'#059669'}">${a.val||0}/100</span>
                  </div>
                `).join('')}
              </div>
              
              <div style="width:240px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:24px;text-align:center;display:flex;flex-direction:column;justify-content:center">
                <div style="font-size:0.8rem;text-transform:uppercase;letter-spacing:1px;color:#64748b;margin-bottom:8px">Skor Keseluruhan</div>
                <div style="font-size:4rem;font-weight:800;color:#1e3a8a;line-height:1">${analisis.skor_total || 0}</div>
                <div style="margin-top:16px;font-size:0.9rem;font-weight:700;color:${analisis.risk_level==='low'?'#059669':analisis.risk_level==='medium'?'#d97706':'#dc2626'}">
                  Risiko ${analisis.risk_level==='low'?'Rendah':analisis.risk_level==='medium'?'Sedang':analisis.risk_level==='high'?'Tinggi':'Kritis'}
                </div>
              </div>
            </div>

            ${analisis.narasi_teknis ? `
              <h3>4.3. Analisis Mendalam per Item</h3>
              <div>${renderToHTML(parseNarasiAI(analisis.narasi_teknis))}</div>
            ` : ''}
          </div>

          <!-- BAB V: KESIMPULAN -->
          <div id="lap-bab5" class="laporan-section pdf-page-break" style="page-break-before:always">
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

            <div style="margin-top:24px;padding:16px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px">
              <p style="margin:0;font-size:0.85rem;color:#64748b;font-style:italic">
                Catatan: Evaluasi ini bersifat indikatif berdasarkan data yang tersedia. Hasil ini harus dikonfirmasi oleh tenaga ahli pengkaji bangunan gedung yang bersertifikat sebelum diterbitkan Sertifikat Laik Fungsi resmi dari instansi berwenang.
              </p>
            </div>
          </div>

          <!-- BAB VI: REKOMENDASI -->
          <div id="lap-bab6" class="laporan-section pdf-page-break" style="page-break-before:always">
            <h2>BAB VI: Rekomendasi Terukur</h2>
            <p>Untuk mempertahankan atau meningkatkan status kelaikan fungsi bangunan, direkomendasikan tindak lanjut sebagai berikut:</p>
            
            ${renderRekomendasi(analisis.rekomendasi)}

            <div style="margin-top:60px;page-break-inside:avoid">
              <div style="width:280px;margin-left:auto;text-align:center">
                <p style="margin-bottom:8px;font-size:0.9rem">Dianalisis dan disusun oleh,</p>
                <p style="font-weight:700;margin-bottom:80px">Tim Pengkaji Teknis Bangunan Gedung</p>
                <div style="border-bottom:1px solid #1a1a2e;margin-bottom:8px"></div>
                <p style="font-size:0.78rem;color:#64748b;font-style:italic">Generated by Smart AI Pengkaji SLF v1.0</p>
                <p style="font-size:0.78rem;color:#64748b">${formatTanggal(new Date())}</p>
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
          <th style="width:12%">Kode</th>
          <th style="width:38%">Item / Komponen</th>
          <th style="width:15%">Status</th>
          <th style="width:35%">Catatan Teknis</th>
        </tr>
      </thead>
      <tbody>
        ${items.map(i => `
          <tr class="pdf-avoid-break">
            <td style="font-family:monospace;font-size:0.8rem;color:#64748b">${escHtml(i.kode || '-')}</td>
            <td><b>${escHtml(i.nama)}</b></td>
            <td><span style="font-weight:700;color:${['baik','ada_sesuai'].includes(i.status)?'#065f46':['buruk','kritis','tidak_ada','ada_tidak_sesuai'].includes(i.status)?'#991b1b':'#92400e'}">${statusLabel(i.status)}</span></td>
            <td style="font-size:0.825rem">${escHtml(i.catatan || '-')}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function renderRekomendasi(rekomText) {
  let list = [];
  try { list = typeof rekomText === 'string' ? JSON.parse(rekomText) : rekomText; } catch(e){}
  
  if (!list || list.length === 0) return '<p>Tidak ada rekomendasi kritis. Bangunan dalam kondisi memadai.</p>';

  const p1 = list.filter(r => ['kritis','tinggi'].includes(r.prioritas?.toLowerCase()));
  const p2 = list.filter(r => r.prioritas?.toLowerCase() === 'sedang');
  const p3 = list.filter(r => r.prioritas?.toLowerCase() === 'rendah');

  const renderGroup = (title, items, color) => {
    if (items.length === 0) return '';
    return `
      <h3 style="color:${color};margin-top:20px">${title}</h3>
      <table>
        <thead>
          <tr>
            <th style="width:5%">No</th>
            <th style="width:15%">Aspek</th>
            <th style="width:50%">Tindakan</th>
            <th style="width:15%">Standar</th>
            <th style="width:15%">Prioritas</th>
          </tr>
        </thead>
        <tbody>
          ${items.map((r, i) => `
            <tr class="pdf-avoid-break">
              <td style="text-align:center">${i+1}</td>
              <td style="font-weight:600">${escHtml(r.aspek || '-')}</td>
              <td>${escHtml(r.judul || '')}: ${escHtml(r.tindakan || '')}</td>
              <td style="font-size:0.8rem;color:#64748b;font-style:italic">${escHtml(r.standar || '-')}</td>
              <td style="text-align:center;font-weight:700;color:${color};text-transform:uppercase">${escHtml(r.prioritas || '-')}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  };

  return renderGroup('Prioritas 1: URGENT (Kritis/Tinggi)', p1, '#991b1b')
       + renderGroup('Prioritas 2: Jangka Pendek (Sedang)', p2, '#92400e')
       + renderGroup('Prioritas 3: Jangka Menengah (Rendah)', p3, '#065f46');
}

// ── Actions & Event Handlers ─────────────────────────────────
function initLaporanActions(proyek, analisis, checklist) {
  // Show/hide export progress
  const showProgress = (pct, msg) => {
    const overlay = document.getElementById('export-progress-overlay');
    const fill = document.getElementById('export-progress-fill');
    const pctEl = document.getElementById('export-progress-pct');
    const msgEl = document.getElementById('export-progress-msg');
    const titleEl = document.getElementById('export-progress-title');
    const iconEl = document.getElementById('export-progress-icon-i');

    if (overlay) overlay.style.display = 'flex';
    if (fill) fill.style.width = `${pct}%`;
    if (pctEl) pctEl.textContent = `${pct}%`;
    if (msgEl) msgEl.textContent = msg || '';

    if (pct >= 100) {
      if (titleEl) titleEl.textContent = 'Export Berhasil!';
      if (iconEl) { iconEl.className = 'fas fa-check-circle'; iconEl.style.color = 'var(--success-400)'; }
      setTimeout(() => {
        if (overlay) overlay.style.display = 'none';
        if (iconEl) { iconEl.className = 'fas fa-cog fa-spin'; iconEl.style.color = ''; }
        if (titleEl) titleEl.textContent = 'Mengeksport Dokumen...';
      }, 1500);
    }
  };

  const hideProgress = () => {
    const overlay = document.getElementById('export-progress-overlay');
    const iconEl = document.getElementById('export-progress-icon-i');
    if (overlay) overlay.style.display = 'none';
    if (iconEl) { iconEl.className = 'fas fa-cog fa-spin'; iconEl.style.color = ''; }
  };

  // Word export
  window._downloadWord = async () => {
    try {
      closeExportDropdown();
      showProgress(5, 'Menyiapkan dokumen Word...');
      await generateDocx(proyek, analisis, checklist, showProgress);
      showSuccess('Dokumen Word (.docx) berhasil di-download!');
    } catch (err) {
      console.error('[Docx] Error:', err);
      hideProgress();
      showError('Gagal membuat dokumen Word: ' + err.message);
    }
  };

  // PDF export
  window._downloadPDF = async () => {
    try {
      closeExportDropdown();
      showProgress(10, 'Memuat library PDF...');
      const printArea = document.getElementById('print-area');
      if (!printArea) throw new Error('Area cetak tidak ditemukan');
      await generatePDF(printArea, proyek, showProgress);
      showSuccess('Dokumen PDF berhasil di-download!');
    } catch (err) {
      console.error('[PDF] Error:', err);
      hideProgress();
      showError('Gagal membuat PDF: ' + err.message);
    }
  };

  // Print
  window._printReport = () => {
    closeExportDropdown();
    showInfo('Membuka dialog cetak...');
    setTimeout(() => window.print(), 300);
  };
}

function initExportDropdown() {
  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('export-dropdown');
    if (dropdown && !dropdown.contains(e.target)) {
      closeExportDropdown();
    }
  });
}

window._toggleExportDropdown = () => {
  const menu = document.getElementById('export-menu');
  if (menu) menu.classList.toggle('open');
};

function closeExportDropdown() {
  const menu = document.getElementById('export-menu');
  if (menu) menu.classList.remove('open');
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
