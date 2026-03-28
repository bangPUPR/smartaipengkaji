import { 
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, 
  WidthType, AlignmentType, HeadingLevel, PageNumber, 
  VerticalAlign, BorderStyle, ShadingType, Header, Footer
} from 'docx';
import { saveAs } from 'file-saver';

/**
 * UTILS
 */
function getStatusLabel(s) {
    const map = {
      'ada_sesuai':'Sesuai', 'ada_tidak_sesuai':'Tidak Sesuai', 'tidak_ada':'Tidak Ada', 'pertama_kali':'Pertama Kali',
      'baik':'Baik', 'sedang':'Sedang', 'buruk':'Buruk', 'kritis':'Kritis', 'tidak_wajib':'-'
    };
    return map[s] || s || '-';
}

function getStatusColor(s) {
    if (['baik','ada_sesuai'].includes(s)) return '059669'; // Green
    if (['buruk','kritis','tidak_ada','ada_tidak_sesuai'].includes(s)) return 'dc2626'; // Red
    return 'd97706'; // Amber/Orange
}

/**
 * GENERATE SLF REPORT (.DOCX)
 */
export async function generateDocx(proyek, analisis, checklist) {
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { size: 22, font: "Calibri" }, // 11pt Calibri
          paragraph: { alignment: AlignmentType.JUSTIFIED, spacing: { line: 360 } } // 1.5 line spacing
        }
      },
      paragraphStyles: [
        {
          id: "Heading1",
          name: "Heading 1",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: { size: 32, bold: true, font: "Calibri", allCaps: true }, // 16pt Bold ALL CAPS
          paragraph: { alignment: AlignmentType.CENTER, spacing: { before: 400, after: 200 } }
        },
        {
          id: "Heading2",
          name: "Heading 2",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: { size: 24, bold: true, font: "Calibri" }, // 12pt Bold
          paragraph: { spacing: { before: 300, after: 150 } }
        }
      ]
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1701, right: 1417, bottom: 1417, left: 1701 }, // 3cm / 2.5cm
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: "LAPORAN KAJIAN SLF - " + proyek.nama_bangunan, size: 16, color: "999999" }),
                ],
                alignment: AlignmentType.RIGHT,
                spacing: { after: 200 }
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: "Smart AI Pengkaji SLF v1.0 - Halaman ", size: 16, color: "999999" }),
                  new TextRun({ children: [PageNumber.CURRENT], size: 16, color: "999999" }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { before: 200 }
              }),
            ],
          }),
        },
        children: [
          // COVER PAGE
          ...renderCover(proyek),
          new Paragraph({ text: "", pageBreakBefore: true }),

          // BAB I
          ...renderBab1(proyek),

          // BAB II
          ...renderBab2(),

          // BAB III
          ...renderBab3(checklist),

          // BAB IV
          ...renderBab4(analisis),

          // BAB V
          ...renderBab5(analisis),

          // BAB VI
          ...renderBab6(analisis),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const fileName = `SLF_${proyek.nama_bangunan.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.docx`;
  saveAs(blob, fileName);
}

// ── RENDERERS ──────────────────────────────────────────────────

function renderCover(proyek) {
  return [
    new Paragraph({ spacing: { before: 2400 }, alignment: AlignmentType.CENTER, children: [
      new TextRun({ text: "LAPORAN PENILAIAN ADMINISTRASI", size: 32, bold: true, color: "1e3a8a" }),
    ] }),
    new Paragraph({ alignment: AlignmentType.CENTER, children: [
      new TextRun({ text: "BANGUNAN GEDUNG", size: 48, bold: true, color: "1e3a8a" }),
    ] }),
    new Paragraph({ spacing: { before: 800 }, alignment: AlignmentType.CENTER, children: [
        new TextRun({ text: (proyek.nama_bangunan || "").toUpperCase(), size: 36, bold: true }),
    ] }),
    new Paragraph({ spacing: { before: 200 }, alignment: AlignmentType.CENTER, children: [
        new TextRun({ text: proyek.alamat || "", size: 22, color: "4b5563" }),
    ] }),
    new Paragraph({ spacing: { before: 2400 }, alignment: AlignmentType.CENTER, children: [
      new TextRun({ text: "PEMILIK:", size: 18, color: "6b7280" }),
    ] }),
    new Paragraph({ alignment: AlignmentType.CENTER, children: [
      new TextRun({ text: proyek.pemilik || "N/A", size: 28, bold: true }),
    ] }),
    new Paragraph({ spacing: { before: 1200 }, alignment: AlignmentType.CENTER, children: [
        new TextRun({ text: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }), size: 20, color: "6b7280" }),
    ] }),
  ];
}

function renderBab1(proyek) {
    const rows = [
        ["Nama Bangunan", proyek.nama_bangunan],
        ["Fungsi Bangunan", proyek.fungsi_bangunan || '-'],
        ["Lokasi", `${proyek.alamat}, ${proyek.kota}`],
        ["Pemilik", proyek.pemilik],
        ["Tahun Bangunan", proyek.tahun_dibangun || '-'],
    ];

    return [
        new Paragraph({ text: "BAB I: GAMBARAN UMUM", heading: HeadingLevel.HEADING_1 }),
        new Paragraph({ text: "1.1. Latar Belakang", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ 
          text: "Penilaian administrasi merupakan bagian krusial dalam kelaikan fungsi bangunan gedung sesuai Peraturan Pemerintah No. 16 Tahun 2021. Hal ini bertujuan untuk memastikan legalitas dan kepatuhan administratif penyelenggaraan bangunan gedung." 
        }),
        new Paragraph({ text: "1.2. Maksud dan Tujuan", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ text: "Maksud dari kajian ini adalah menilai kelengkapan dokumen administratif dan menentukan kelayakan penyelenggaraan bangunan secara legal formal.", spacing: { before: 100 } }),
        new Paragraph({ text: "1.3. Ruang Lingkup", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ text: "Fokus pada aspek administrasi yang meliputi dokumen perizinan (PBG/IMB), Sertifikat Laik Fungsi, serta dokumen pendukung teknis lainnya (A01–A10).", spacing: { before: 100 } }),
        new Paragraph({ text: "1.4. Data Umum Bangunan", heading: HeadingLevel.HEADING_2 }),
        new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: rows.map(r => new TableRow({
                children: [
                    new TableCell({ 
                        width: { size: 35, type: WidthType.PERCENTAGE }, 
                        margins: { top: 120, bottom: 120, left: 120 },
                        children: [new Paragraph({ text: r[0], bold: true })] 
                    }),
                    new TableCell({ 
                        width: { size: 65, type: WidthType.PERCENTAGE }, 
                        margins: { top: 120, bottom: 120, left: 120 },
                        children: [new Paragraph({ text: r[1] })] 
                    }),
                ],
            })),
        }),
    ];
}

function renderBab2() {
    return [
        new Paragraph({ text: "BAB II: METODOLOGI", heading: HeadingLevel.HEADING_1, spacing: { before: 500 } }),
        new Paragraph({ text: "2.1. Pendekatan Analisis", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ text: "Laporan ini disusun menggunakan pendekatan multi-layer:", bullet: { level: 0 } }),
        new Paragraph({ text: "1. Rule-based: Mengacu pada NSPK dan standar teknis PUPR.", bullet: { level: 1 } }),
        new Paragraph({ text: "2. Risk-based Assessment: Penilaian berbasis dampak risiko infrastruktur.", bullet: { level: 1 } }),
        new Paragraph({ text: "3. AI-based Analysis: Audit mendalam menggunakan Deep Reasoning AI.", bullet: { level: 1 } }),
        new Paragraph({ text: "2.2. Sumber Data", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ text: "Data diperoleh dari dokumen administratif yang diunggah pemilik, hasil inspeksi visual, serta verifikasi keabsahan dokumen melalui basis data otoritas terkait.", spacing: { before: 100 } }),
        new Paragraph({ text: "2.3. Metode Penilaian", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ text: "Penilaian dilakukan dengan skoring kepatuhan (0-100) dan klasifikasi status kelaikan: Laik Fungsi, Laik Fungsi Bersyarat, atau Tidak Laik Fungsi.", spacing: { before: 100 } }),
        new Paragraph({ text: "2.4. Alur Analisis AI", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ text: "Proses audit mengikuti alur: Input Data → Validasi Stringent → Analisis Deep Reasoning AI → Output Rekomendasi Teknis.", spacing: { before: 100 } }),
    ];
}

function renderBab3(checklist) {
    const items = (checklist || []);

    return [
        new Paragraph({ text: "BAB III: HASIL CHECKLIST", heading: HeadingLevel.HEADING_1, spacing: { before: 500 } }),
        new Paragraph({ text: "Berikut adalah ringkasan hasil pemeriksaan kelengkapan dokumen administratif dan teknis:", spacing: { after: 200 } }),
        new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
                new TableRow({
                    tableHeader: true,
                    children: [
                        new TableCell({ width: { size: 10, type: WidthType.PERCENTAGE }, shading: { fill: "f1f5f9" }, margins: { top: 120, bottom: 120, left: 120 }, children: [new Paragraph({ text: "KODE", bold: true })] }),
                        new TableCell({ width: { size: 35, type: WidthType.PERCENTAGE }, shading: { fill: "f1f5f9" }, margins: { top: 120, bottom: 120, left: 120 }, children: [new Paragraph({ text: "ITEM", bold: true })] }),
                        new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, shading: { fill: "f1f5f9" }, margins: { top: 120, bottom: 120, left: 120 }, children: [new Paragraph({ text: "STATUS", bold: true })] }),
                        new TableCell({ width: { size: 35, type: WidthType.PERCENTAGE }, shading: { fill: "f1f5f9" }, margins: { top: 120, bottom: 120, left: 120 }, children: [new Paragraph({ text: "CATATAN", bold: true })] }),
                    ],
                }),
                ...items.map(i => new TableRow({
                    children: [
                        new TableCell({ margins: { top: 100, bottom: 100, left: 120 }, children: [new Paragraph({ text: i.kode || "-" })] }),
                        new TableCell({ margins: { top: 100, bottom: 100, left: 120 }, children: [new Paragraph({ text: i.nama })] }),
                        new TableCell({ margins: { top: 100, bottom: 100, left: 120 }, children: [new Paragraph({ text: getStatusLabel(i.status), color: getStatusColor(i.status), bold: true })] }),
                        new TableCell({ margins: { top: 100, bottom: 100, left: 120 }, children: [new Paragraph({ text: i.catatan || "-" })] }),
                    ],
                })),
            ],
        }),
    ];
}

function renderBab4(analisis) {
    if (!analisis) return [];

    return [
        new Paragraph({ text: "BAB IV: ANALISIS AI (INTI LAPORAN)", heading: HeadingLevel.HEADING_1, spacing: { before: 500 } }),
        new Paragraph({ 
            spacing: { before: 200, after: 200 },
            text: `Berdasarkan pemrosesan data, skor kepatuhan administratif bangunan adalah ${analisis.skor_total || 0}%. Tingkat risiko yang diidentifikasi: ${analisis.risk_level?.toUpperCase() || "N/A"}.`
        }),
        new Paragraph({ text: "4.1. Narasi Evaluasi Kinerja", heading: HeadingLevel.HEADING_2, spacing: { before: 400, after: 200 } }),
        ...renderMarkdownToDocx(analisis.narasi_teknis),
    ];
}

function renderBab5(analisis) {
    const status = analisis?.status_slf || "BELUM_DIANALISIS";
    const statusText = status.replace(/_/g, ' ');
    
    return [
        new Paragraph({ text: "BAB V: KESIMPULAN", heading: HeadingLevel.HEADING_1, spacing: { before: 500 } }),
        new Paragraph({ 
          text: `Berdasarkan hasil analisis mendalam terhadap seluruh data administratif yang tersedia, maka disimpulkan bahwa status kelaikan operasional bangunan gedung saat ini adalah:`,
          spacing: { after: 300 } 
        }),
        new Paragraph({ 
            text: statusText.toUpperCase(), 
            alignment: AlignmentType.CENTER,
            bold: true,
            size: 28,
            spacing: { before: 400, after: 400 },
            border: {
              top: { style: BorderStyle.SINGLE, size: 6 },
              bottom: { style: BorderStyle.SINGLE, size: 6 },
              left: { style: BorderStyle.SINGLE, size: 6 },
              right: { style: BorderStyle.SINGLE, size: 6 },
            }
        }),
        new Paragraph({
          text: `Hasil skoring total menunjukkan tingkat kepatuhan sebesar ${analisis?.skor_total || 0}%. Temuan kritis telah dipetakan pada bab sebelumnya untuk segera ditindaklanjuti.`,
          spacing: { before: 300 }
        })
    ];
}

function renderBab6(analisis) {
    let rekom = [];
    try { 
        rekom = typeof analisis.rekomendasi === 'string' ? JSON.parse(analisis.rekomendasi) : (analisis.rekomendasi || []);
    } catch(e) {}

    const p1 = rekom.filter(r => ['kritis', 'tinggi'].includes(r.prioritas));
    const p2 = rekom.filter(r => r.prioritas === 'sedang');
    const p3 = rekom.filter(r => r.prioritas === 'rendah');

    const renderRekomGroup = (title, group) => {
      if (group.length === 0) return [];
      return [
        new Paragraph({ text: title, bold: true, spacing: { before: 300, after: 100 } }),
        ...group.map((r, i) => [
            new Paragraph({ text: `${i+1}. ${r.judul}`, bold: true, bullet: { level: 0 } }),
            new Paragraph({ text: `Tindakan: ${r.tindakan}`, spacing: { left: 400 } }),
            new Paragraph({ text: `Dasar Standar: ${r.standar || '-'}`, font: "italic", size: 18, spacing: { left: 400, after: 150 } }),
        ]).flat()
      ];
    };

    return [
        new Paragraph({ text: "BAB VI: REKOMENDASI", heading: HeadingLevel.HEADING_1, spacing: { before: 500 } }),
        new Paragraph({ text: "Berikut adalah langkah-langkah strategis untuk pemenuhan kelaikan fungsi bangunan:" }),
        ...renderRekomGroup("🔥 Prioritas 1 (URGENT)", p1),
        ...renderRekomGroup("⏳ Prioritas 2 (Jangka Pendek)", p2),
        ...renderRekomGroup("📈 Prioritas 3 (Jangka Menengah)", p3),
    ];
}

/**
 * Advanced Markdown to Docx Converter (handles Tables, Headings, Bullets, Bold)
 */
function renderMarkdownToDocx(md = "") {
    if (!md) return [new Paragraph({ text: "Tidak ada narasi teknis." })];

    const lines = md.split('\n');
    const result = [];
    let currentTableRows = [];

    const processTable = () => {
        if (currentTableRows.length < 2) {
            currentTableRows = [];
            return;
        }

        // Filter divider line (|---|---|)
        const dataRows = currentTableRows.filter(r => !r.includes('---'));
        
        const docxTable = new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: dataRows.map((line, idx) => {
                const cells = line.split('|').filter(c => c.trim() !== '' || line.indexOf(c) > 0 && line.indexOf(c) < line.lastIndexOf('|'));
                // Cleaning empty cells from split
                const cleanCells = cells.map(c => c.trim()).filter((c, i) => i > 0 || line.startsWith('|') ? true : false);
                
                // Actual parsing of a markdown table line can be tricky with split('|')
                // Let's use a simpler but safer split
                const columns = line.split('|').map(c => c.trim()).filter((c, i, arr) => {
                   if (i === 0 && c === "") return false;
                   if (i === arr.length - 1 && c === "") return false;
                   return true;
                });

                return new TableRow({
                    children: columns.map(colText => new TableCell({
                        shading: idx === 0 ? { fill: "f1f5f9" } : undefined,
                        margins: { top: 120, bottom: 120, left: 120, right: 120 },
                        children: [new Paragraph({ 
                            children: parseFormatting(colText),
                            alignment: idx === 0 ? AlignmentType.CENTER : undefined
                        })]
                    }))
                });
            })
        });

        result.push(docxTable);
        result.push(new Paragraph({ spacing: { before: 200 } })); // Spacer after table
        currentTableRows = [];
    };

    lines.forEach(line => {
        const trimmed = line.trim();

        // Detect Table Line
        if (trimmed.startsWith('|')) {
            currentTableRows.push(trimmed);
            return;
        } else if (currentTableRows.length > 0) {
            processTable();
        }

        if (!trimmed) {
            result.push(new Paragraph({ spacing: { before: 150 } }));
            return;
        }

        // Headings
        if (trimmed.startsWith('### ')) {
            result.push(new Paragraph({ text: trimmed.replace('### ', ''), heading: HeadingLevel.HEADING_3, spacing: { before: 300, after: 120 } }));
        } else if (trimmed.startsWith('## ')) {
            result.push(new Paragraph({ text: trimmed.replace('## ', ''), heading: HeadingLevel.HEADING_2, spacing: { before: 400, after: 150 } }));
        } else if (trimmed.startsWith('# ')) {
             result.push(new Paragraph({ text: trimmed.replace('# ', ''), heading: HeadingLevel.HEADING_1, spacing: { before: 500, after: 200 } }));
        }
        // Bullets
        else if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
            result.push(new Paragraph({ 
                children: parseFormatting(trimmed.substring(2)),
                bullet: { level: 0 },
                spacing: { before: 80, after: 80 }
            }));
        } 
        // Normal text
        else {
            result.push(new Paragraph({ 
                children: parseFormatting(trimmed),
                spacing: { after: 200 },
                lineSpacing: { before: 120 }
            }));
        }
    });

    // Final table flush
    if (currentTableRows.length > 0) processTable();

    return result;
}

function parseFormatting(text) {
    if (!text) return [new TextRun("")];
    
    // Improved regex to find all **bold** markers
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map(part => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return new TextRun({ text: part.substring(2, part.length - 2), bold: true });
        }
        return new TextRun({ text: part });
    });
}
