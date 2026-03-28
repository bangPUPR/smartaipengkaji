<div align="center">
  <h1>🏢 Smart AI Pengkaji SLF</h1>
  <p><strong>Aplikasi Konsultan Cerdas Pengkajian Teknis Sertifikat Laik Fungsi (SLF) Gedung</strong></p>
  
  <p>
    <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
    <img src="https://img.shields.io/badge/Vanilla_JS-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="Vanilla JS" />
    <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
    <img src="https://img.shields.io/badge/AI_Assisted-000000?style=for-the-badge&logo=openai&logoColor=white" alt="AI Assisted" />
  </p>
</div>

---

## 📖 Deskripsi Proyek

**Smart AI Pengkaji** adalah aplikasi *Progressive Web App* (PWA) berbasis kecerdasan buatan (*Artificial Intelligence*) yang diciptakan untuk mempermudah Insinyur, Auditor Bangunan, dan Konsultan Pengkaji Teknis dalam menyusun **Laporan Sertifikat Laik Fungsi (SLF)** maupun melakukan penilaian struktural (*Rapid Visual Screening* & Audit Forensik).

Sistem ini didesain agar mematuhi tata letak, logika *scoring*, dan standar referensi yang ditetapkan oleh Pemerintah Indonesia, terutama:
- **PP No. 16 Tahun 2021** tentang Peraturan Pelaksanaan UU Bangunan Gedung (PBG & SLF)
- **SNI 9273:2025** terkait Kajian Teknis Bangunan Eksisting
- Pedoman Persyaratan Teknis Bangunan Gedung PUPR (Tingkat Kerusakan I - V)

## ✨ Fitur Utama (Core Features)

1. 🧠 **Deep Forensic AI Reasoning Engine**
   Aplikasi memiliki Multi-Model *AI Router* (Gemini, Claude, Llama via Groq, OpenAI). AI ditugaskan sebagai *Lead Engineer* untuk melakukan bedah forensik pada temuan lapangan secara makroskopis dan mikroskopis dengan narasi *Engineering-grade* yang mendalam.
   
2. 📊 **Sistem Skoring Kerusakan Kuantitatif (SLF)**
   Penerapan langsung logika *scoring* SLF berbasis persentase kerusakan struktur aktual:
   - **Tingkat I (0%)** : Retak mikro < 0.2mm
   - **Tingkat II (20%)** : Sangat Ringan
   - **Tingkat III (35%)** : Ringan 
   - **Tingkat IV (50%)** : Sedang (Inti terpapar)
   - **Tingkat V (75-100%)**: Ekstrem / Runtuh

3. 📑 **Export Laporan Otomatis (Ms. Word & PDF-ready)**
   Seluruh kajian teknis dan bab sintesis akhir dari *Lead Engineer AI* akan langsung dikompilasi ke dalam format dokumen legal `.docx` (Microsoft Word) siap cetak dan tanda tangan. Menyimpan hingga ribuan blok teks dan temuan teknis.

4. ☁️ **Cloud Database & Row-Level Security**
   Menyimpan seluruh data rekam periksa (*assessment record*) menggunakan arsitektur **Supabase** dengan *Row-Level Security* (RLS). Hanya Inspektur yang membuat inspeksi yang bisa melihat dan mengubah datanya.

5. 📱 **Offline-First PWA (Progressive Web Application)**
   Sistem di-optimasi dengan *Service Worker* sehingga Konsultan dapat merekam data inspeksi ketika tengah berada di *Basement* gedung atau lokasi terpencil yang *blank spot*.

---

## 🛠️ Stack Teknologi Modern

Aplikasi Smart AI SLF dibangun dengan tumpukan teknologi modern, cepat, dan ringan:

- **Frontend Build Tool**: [Vite.js](https://vitejs.dev/) - Sangat cepat untuk HMR dan optimasi build.
- **Language**: Vanilla JavaScript & ES Modules (tanpa dependensi framework reaktif murni untuk kecepatan).
- **Backend & Auth**: [Supabase](https://supabase.com) - *Open source Firebase Alternative* (Otentikasi, Database PostgreSQL).
- **AI Integrations**: Native Fetch API ke Google Gemini, Anthropic Claude, OpenAI, dan OpenRouter.
- **Document Generation**: `docx` package untuk ekspor file Word lokal secara aman di perangkat klien.

---

## 🚀 Panduan Memulai Cepat (Quick Start)

### 1. Prasyarat (*Prerequisites*)
Pastikan Anda telah menginstal `Node.js` (minimal versi 18.x) dan NPM/Yarn di mesin lokal.

### 2. Instalasi
Clone repository ini dan *install dependencies*.
```bash
git clone https://github.com/bangPUPR/Pengkaji-smart-AI.git
cd smartaipengkaji
npm install
```

### 3. Konfigurasi Variabel Lingkungan (.env)
Buat sebuah file bernama `.env` di *root* foler aplikasi. Salin format dari `.env.example` dan isi dengan kunci API (*API Keys*) milik Anda:

```env
# ==== SUPABASE (DATABASE & AUTH) ====
VITE_SUPABASE_URL=https://<project-id>.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...

# ==== AI API KEYS (Untuk Analisis Forensik) ====
VITE_GEMINI_API_KEY=AIzaSyB...
VITE_GROQ_API_KEY=gsk_...
VITE_CLAUDE_API_KEY=sk-ant-api03...
VITE_OPENAI_API_KEY=sk-proj-...
VITE_OPENROUTER_API_KEY=sk-or-v1-...
```

### 4. Menjalankan Mode Pengembangan (Development)
Jalankan perintah ini untuk memulai *Local Dev Server*:
```bash
npm run dev
```
Aplikasi akan dapat diakses secara *live* melalui `http://localhost:5173/` (tergantung *port* dari Vite).

### 5. Membangun untuk Produksi (Build for Production)
Jika ingin melakukan *compile* sistem menjadi aset statis yang ringan:
```bash
npm run build
```
Jalankan `npm run preview` untuk mengecek hasil build sebelum di-*deploy*.

---

## 🔐 Arsitektur Sistem AI (AI Router)

Modul inti sistem terletak pada `src/lib/ai-router.js`. AI Router berfungsi:
- Bertindak sebagai penyeimbang beban (*Load Balancer*). Jika satu penyedia API (misalnya OpenAI Limit), ia langsung *failover* ke model berikutnya otomatis.
- Memisahkan **Prompt Mikro** (Inspeksi Per Komponen/Patologi) dan **Prompt Makro** (Lead Engineer Synthesis/Kesahihan Regulasi).
- Memaksa keluaran harus selalu dalam bentuk spesifikasi JSON murni yang divalidasi dan di-ekstrak oleh klien.

## 🗄️ Database Schema & Kebijakan
Untuk membangun tabel mandiri menggunakan SQL, gunakan skrip pada dokumen `supabase-schema.sql` di *root* repositori. Skrip ini akan mengaktifkan PostgreSQL *Extensions*, *Table Creation*, dan kebijakan RLS-nya otomatis. Pastikan RLS diaktifkan agar tidak semua akun dapat membaca proyek pengguna lain.

---

## 📄 Lisensi
Perangkat lunak ini dikembangkan eksklusif sebagai purwarupa (Prototype)/Sistem Bantu dan **Tidak berlisensi Open Source bebas** (terkait kepatutan standar teknis dan regulasi tata kelola sistem PUPR). Seluruh klaim justifikasi kelaikan yang diproduksi AI tetap memerlukan validasi pengesahan akhir (*Final Sign-Off*) dengan tanda tangan Insinyur Bersertifikat sesuai hukum yang berlaku di Indonesia.

---
*Dikembangkan oleh Tim Smart AI Pengkaji - 2026*
