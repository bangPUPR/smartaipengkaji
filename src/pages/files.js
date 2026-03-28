// ============================================================
//  GLOBAL FILE REPOSITORY PAGE
//  Menampilkan seluruh berkas proyek yang diunggah
// ============================================================
import { supabase } from '../lib/supabase.js';
import { navigate } from '../lib/router.js';
import { showInfo } from '../components/toast.js';

export async function filesPage() {
  const { data: files, error } = await supabase
    .from('proyek_files')
    .select('*, proyek(nama)')
    .order('created_at', { ascending: false });

  const stats = {
    total: files?.length || 0,
    tanah: files?.filter(f => f.category === 'tanah').length || 0,
    umum: files?.filter(f => f.category === 'umum').length || 0,
    ready: files?.filter(f => f.ai_status === 'ready').length || 0,
  };

  const filesHtml = files?.map(f => `
    <tr>
      <td>
        <div class="flex items-center gap-2">
          <i class="fas ${f.name.endsWith('.pdf') ? 'fa-file-pdf text-danger' : 'fa-file-image text-primary'}"></i>
          <div>
            <div class="font-bold text-sm">${esc(f.name)}</div>
            <div class="text-xs text-tertiary">${esc(f.proyek?.nama || 'Tanpa Proyek')}</div>
          </div>
        </div>
      </td>
      <td><span class="badge badge-outline">${esc(f.subcategory || f.category)}</span></td>
      <td>
        <span class="ai-status-indicator ${f.ai_status}">
           ${f.ai_status === 'ready' ? '🟢 Ready' : f.ai_status === 'pending' ? '⚪ Pending' : '🔴 Error'}
        </span>
      </td>
      <td class="text-xs text-tertiary">${new Date(f.created_at).toLocaleDateString()}</td>
      <td class="text-right">
        <button class="btn btn-ghost btn-xs" onclick="navigate('checklist', {id:'${f.proyek_id}'})">
          <i class="fas fa-eye"></i> Buka
        </button>
      </td>
    </tr>
  `).join('') || `<tr><td colspan="5" style="padding:40px;text-align:center" class="text-tertiary">Belum ada berkas yang diunggah.</td></tr>`;

  return `
    <div class="page-header">
      <div class="page-title-box">
        <h1 class="page-title">Manajemen Berkas Global</h1>
        <p class="page-subtitle">Repositori seluruh dokumen administrasi & teknis dari semua proyek SLF</p>
      </div>
      <div class="flex gap-2">
         <button class="btn btn-secondary" onclick="window.location.reload()">
           <i class="fas fa-sync"></i> Refresh
         </button>
      </div>
    </div>

    <div class="grid grid-cols-4 gap-4 mb-6">
      <div class="card p-4 flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center"><i class="fas fa-file-invoice"></i></div>
        <div>
          <div class="text-xs text-tertiary">Total Berkas</div>
          <div class="text-xl font-bold">${stats.total}</div>
        </div>
      </div>
      <div class="card p-4 flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center"><i class="fas fa-map-marked-alt"></i></div>
        <div>
          <div class="text-xs text-tertiary">Data Tanah</div>
          <div class="text-xl font-bold">${stats.tanah}</div>
        </div>
      </div>
      <div class="card p-4 flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><i class="fas fa-folder-open"></i></div>
        <div>
          <div class="text-xs text-tertiary">Data Umum</div>
          <div class="text-xl font-bold">${stats.umum}</div>
        </div>
      </div>
      <div class="card p-4 flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center"><i class="fas fa-brain"></i></div>
        <div>
          <div class="text-xs text-tertiary">AI Ready</div>
          <div class="text-xl font-bold">${stats.ready}</div>
        </div>
      </div>
    </div>

    <div class="card" style="padding:0; overflow:hidden">
      <div class="card-header" style="background:var(--bg-elevated); padding:var(--space-4)">
         <div class="card-title">Log Berkas Terbaru</div>
      </div>
      <table class="checklist-table">
        <thead>
          <tr>
            <th>Identitas Berkas / Proyek</th>
            <th>Kategori</th>
            <th>Status AI</th>
            <th>Tgl Masuk</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          ${filesHtml}
        </tbody>
      </table>
    </div>
  `;
}

function esc(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
