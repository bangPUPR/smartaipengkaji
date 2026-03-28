-- ==============================================================================
-- STRUKTUR DATABASE: SMART AI PENGKAJI SLF
-- Silakan COPY dan RUN seluruh skrip ini di:
-- Supabase Dashboard -> SQL Editor -> New Query
-- ==============================================================================

-- 1. Tabel Proyek
CREATE TABLE public.proyek (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nama_bangunan text NOT NULL,
  jenis_bangunan text,
  fungsi_bangunan text,
  alamat text NOT NULL,
  kota text,
  provinsi text,
  pemilik text NOT NULL,
  tahun_dibangun integer,
  jumlah_lantai integer,
  luas_bangunan numeric,
  luas_lahan numeric,
  jenis_konstruksi text,
  nomor_pbg text,
  status_slf text DEFAULT 'DALAM_PENGKAJIAN',
  progress integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- 2. Tabel Checklist Items (Input Data dari Lapangan)
CREATE TABLE public.checklist_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  proyek_id uuid REFERENCES public.proyek(id) ON DELETE CASCADE,
  kode text NOT NULL,
  nama text NOT NULL,
  kategori text NOT NULL, -- 'administrasi', 'teknis'
  aspek text, -- 'Struktur', 'Arsitektur', dll. HANYA untuk teknis
  status text, -- 'ada_sesuai', 'ada_tidak_sesuai', 'baik', 'kritis', dll
  catatan text,
  created_by text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(proyek_id, kode) -- Agar upsert tidak duplikat
);

-- 3. Tabel Hasil Analisis (Record Log dari AI Engine)
CREATE TABLE public.hasil_analisis (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  proyek_id uuid REFERENCES public.proyek(id) ON DELETE CASCADE,
  skor_administrasi integer DEFAULT 0,
  skor_struktur integer DEFAULT 0,
  skor_arsitektur integer DEFAULT 0,
  skor_mep integer DEFAULT 0,
  skor_kebakaran integer DEFAULT 0,
  skor_kesehatan integer DEFAULT 0,
  skor_kenyamanan integer DEFAULT 0,
  skor_kemudahan integer DEFAULT 0,
  skor_total integer DEFAULT 0,
  status_slf text, 
  risk_level text, -- 'low', 'medium', 'high', 'critical'
  rekomendasi jsonb, -- Array object rekomendasi dari AI
  narasi_teknis text,
  ai_provider text DEFAULT 'rule-based',
  created_at timestamptz DEFAULT now()
);

-- 4. Tabel Todo Tasks (Manajemen Perbaikan / Kanban)
CREATE TABLE public.todo_tasks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  proyek_id uuid REFERENCES public.proyek(id) ON DELETE CASCADE,
  proyek_nama text,
  title text NOT NULL,
  judul text, -- alias untuk title dari rule sebelumnya
  deskripsi text,
  status text DEFAULT 'todo', -- 'todo', 'in_progress', 'review', 'done'
  priority text DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
  due_date date,
  created_by text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Pastikan user login baru bisa akses
-- ==============================================================================

-- Aktifkan RLS di semua tabel
ALTER TABLE public.proyek ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hasil_analisis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.todo_tasks ENABLE ROW LEVEL SECURITY;

-- Buat policy "Semua orang yang login" bisa akses data
CREATE POLICY "Enable read/write for authenticated users only"
ON public.proyek
AS PERMISSIVE
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable read/write for authenticated users only"
ON public.checklist_items
AS PERMISSIVE
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable read/write for authenticated users only"
ON public.hasil_analisis
AS PERMISSIVE
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable read/write for authenticated users only"
ON public.todo_tasks
AS PERMISSIVE
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

-- (Opsional) Mengaktifkan Realtime Socket Supabase
-- Jika ingin fitur Kanban drag-and-drop auto update di laptop lain
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.todo_tasks;
  END IF;
END $$;
