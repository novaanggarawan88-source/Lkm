import React, { useState } from 'react';
import {
  X,
  FileSpreadsheet,
  Code2,
  BookOpen,
  Copy,
  Check,
  Download,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';
import { SPREADSHEET_SCHEMA_DOC, GAS_CODE_GS, GAS_DEPLOYMENT_GUIDE } from '../data/gasTemplates';

interface GoogleSheetsIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleSheetsIntegrationModal: React.FC<GoogleSheetsIntegrationModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'mapping' | 'codegs' | 'guide' | 'testing'>('mapping');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedMapping, setCopiedMapping] = useState(false);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(GAS_CODE_GS);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleCopyMapping = () => {
    navigator.clipboard.writeText(SPREADSHEET_SCHEMA_DOC);
    setCopiedMapping(true);
    setTimeout(() => setCopiedMapping(false), 2500);
  };

  const handleDownloadCodeGs = () => {
    const element = document.createElement('a');
    const file = new Blob([GAS_CODE_GS], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = 'Code.gs';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-slate-900 px-4 sm:px-6 py-4 sm:py-5 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm sm:text-lg text-white leading-tight">
                Dokumentasi & Integrasi Spreadsheet
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-400">
                Single Source of Truth • Google Apps Script (Code.gs)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigator */}
        <div className="flex items-center gap-1 px-3 sm:px-6 pt-2.5 border-b border-slate-200 bg-slate-50 text-xs font-bold overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('mapping')}
            className={`px-4 py-2.5 rounded-t-xl transition-colors cursor-pointer shrink-0 ${
              activeTab === 'mapping'
                ? 'bg-white border-t-2 border-emerald-600 text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📊 1. Pemetaan Sheet
          </button>
          <button
            onClick={() => setActiveTab('codegs')}
            className={`px-4 py-2.5 rounded-t-xl transition-colors cursor-pointer shrink-0 ${
              activeTab === 'codegs'
                ? 'bg-white border-t-2 border-blue-600 text-blue-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            💻 2. Kode Code.gs (Backend)
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-2.5 rounded-t-xl transition-colors cursor-pointer shrink-0 ${
              activeTab === 'guide'
                ? 'bg-white border-t-2 border-indigo-600 text-indigo-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🚀 3. Panduan Deployment Web App
          </button>
          <button
            onClick={() => setActiveTab('testing')}
            className={`px-4 py-2.5 rounded-t-xl transition-colors cursor-pointer shrink-0 ${
              activeTab === 'testing'
                ? 'bg-white border-t-2 border-teal-600 text-teal-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ✅ 4. Panduan Pengujian
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs sm:text-sm text-slate-800">
          {/* TAB 1: Pemetaan Google Spreadsheet */}
          {activeTab === 'mapping' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Pemetaan 6 Sheet Google Spreadsheet
                  </h3>
                  <p className="text-xs text-slate-500">
                    Aplikasi membaca kolom berdasarkan nama header (bebas urutan kolom).
                  </p>
                </div>

                <button
                  onClick={handleCopyMapping}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-bold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedMapping ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedMapping ? 'Tersalin!' : 'Salin Struktur Markdown'}</span>
                </button>
              </div>

              <div className="space-y-3">
                {/* Sheet 1 */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span className="font-mono text-blue-700">1. Sheet: DATA_MURID</span>
                    <span className="text-[11px] text-slate-500">Daftar nama dan kelas murid</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-700 overflow-x-auto">
                    Kelas | NIS | Nama Murid | Jenis Kelamin | Status
                  </div>
                </div>

                {/* Sheet 2 */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span className="font-mono text-blue-700">2. Sheet: BANK_SOAL</span>
                    <span className="text-[11px] text-slate-500">Butir soal, kunci, dan pembahasan</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-700 overflow-x-auto">
                    ID Soal | ID LKM | Materi | Submateri | Indikator | Tipe Soal | Pertanyaan | A | B | C | D | E | Kunci | Bobot | Pembahasan | Saran Belajar
                  </div>
                </div>

                {/* Sheet 3 */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span className="font-mono text-blue-700">3. Sheet: PENGATURAN_LKM</span>
                    <span className="text-[11px] text-slate-500">Daftar LKM aktif dan batas waktu</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-700 overflow-x-auto">
                    ID LKM | Judul LKM | Materi | Fase | Kelas Target | Tujuan Pembelajaran | Petunjuk | Durasi Menit | Status Aktif | Izinkan Ulang
                  </div>
                </div>

                {/* Sheet 4 */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span className="font-mono text-blue-700">4. Sheet: PENGATURAN_FEEDBACK</span>
                    <span className="text-[11px] text-slate-500">Rentang nilai dan teks umpan balik</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-700 overflow-x-auto">
                    Batas Bawah | Batas Atas | Kategori | Arah Umpan Balik | Teks Umpan Balik
                  </div>
                </div>

                {/* Sheet 5 */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span className="font-mono text-blue-700">5. Sheet: HASIL_LKM</span>
                    <span className="text-[11px] text-slate-500">Penyimpanan nilai otomatis dari backend</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-700 overflow-x-auto">
                    ID Pengerjaan | Tanggal | Waktu | Kelas | NIS | Nama Murid | ID LKM | Materi | Total Soal | Benar | Salah | Kosong | Nilai Akhir | Kategori | Umpan Balik | Indikator Lemah | Rincian Jawaban | Status Penilaian
                  </div>
                </div>

                {/* Sheet 6 */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span className="font-mono text-blue-700">6. Sheet: REFLEKSI</span>
                    <span className="text-[11px] text-slate-500">Catatan 4 pilar refleksi murid</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-700 overflow-x-auto">
                    ID Refleksi | ID Pengerjaan | Tanggal & Waktu | Nama Murid | Kelas | ID LKM | Materi | Hal Baru Dipelajari | Materi Masih Sulit | Penyebab Kesulitan | Rencana Peningkatan
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Code.gs (Full Backend Script) */}
          {activeTab === 'codegs' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Kode Google Apps Script (Code.gs)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Backend lengkap siap tempel: doGet, doPost, SpreadsheetApp, evaluasi nilai aman, dan pencatatan refleksi.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyCode}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Tersalin ke Clipboard!' : 'Salin Code.gs'}</span>
                  </button>
                  <button
                    onClick={handleDownloadCodeGs}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh .gs</span>
                  </button>
                </div>
              </div>

              <div className="relative">
                <pre className="p-4 rounded-2xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto max-h-[460px] leading-relaxed border border-slate-800">
                  {GAS_CODE_GS}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: Panduan Deployment */}
          {activeTab === 'guide' && (
            <div className="space-y-4">
              <h3 className="text-base font-extrabold text-slate-900">
                Langkah Menerbitkan Web App di Google Apps Script
              </h3>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-1">
                  <span className="font-extrabold text-blue-900 block">Langkah 1: Buka Apps Script</span>
                  <p className="text-xs text-slate-700">
                    Di Google Spreadsheet Anda, klik menu <strong>Ekstensi &gt; Apps Script</strong>.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-1">
                  <span className="font-extrabold text-blue-900 block">Langkah 2: Tempelkan Code.gs</span>
                  <p className="text-xs text-slate-700">
                    Salin kode dari Tab <strong>"2. Kode Code.gs"</strong>, tempelkan ke editor Apps Script, dan ganti nilai <code>SPREADSHEET_ID</code> dengan ID Spreadsheet Anda. Klik Simpan.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-300 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Langkah 3: Terapkan Sebagai Web App (Paling Penting!)</span>
                  </div>
                  <ul className="text-xs text-slate-700 space-y-1 ml-5 list-disc">
                    <li>Klik <strong>Deploy &gt; New deployment (Penerapan baru)</strong>.</li>
                    <li>Pilih tipe: <strong>Web App</strong>.</li>
                    <li><strong>Execute as:</strong> Me (email akun Google guru).</li>
                    <li><strong>Who has access:</strong> <strong className="text-emerald-800 bg-emerald-100 px-1 rounded">Anyone (Siapa saja)</strong> — agar browser murid dapat mengirim jawaban tanpa login akun developer.</li>
                    <li>Klik <strong>Deploy</strong> dan berikan izin akses Google (Authorize).</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-1">
                  <span className="font-extrabold text-blue-900 block">Langkah 4: Masukkan URL ke Aplikasi</span>
                  <p className="text-xs text-slate-700">
                    Salin URL Web App yang berakhiran <code>/exec</code>, buka menu <strong>Guru &gt; Pengaturan</strong> di aplikasi ini, tempelkan pada kolom URL Google Apps Script Web App, lalu klik <strong>Uji Koneksi GAS</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Panduan Pengujian */}
          {activeTab === 'testing' && (
            <div className="space-y-4">
              <h3 className="text-base font-extrabold text-slate-900">
                Checklist Pengujian Aplikasi LKM Digital PJOK
              </h3>
              <p className="text-xs text-slate-500">
                Lakukan verifikasi terhadap 10 aspek utama untuk memastikan kehandalan sistem:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {[
                  { title: '1. Pengambilan Data Murid & Kelas', desc: 'Dropdown nama murid berubah secara dinamis mengikuti kelas yang dipilih, tanpa input teks bebas.' },
                  { title: '2. Pengambilan Soal Aman', desc: 'Browser murid hanya menerima butir soal & pilihan; kunci jawaban tidak terkirim sebelum pengumpulan.' },
                  { title: '3. Navigasi & Progres Pengerjaan', desc: 'Tombol sebelumnya/selanjutnya, grid nomor soal interaktif, dan progres persentase bekerja mulus.' },
                  { title: '4. Deteksi Soal Belum Dijawab', desc: 'Jika ada soal kosong saat klik Kumpulkan, dialog peringatan ramah muncul meminta konfirmasi murid.' },
                  { title: '5. Pencegahan Pengerjaan Ganda', desc: 'Kombinasi Nama Murid + Kelas + ID LKM divalidasi sehingga murid tidak dapat mengirim duplikat tanpa izin remedial.' },
                  { title: '6. Evaluasi Nilai Sisi Server', desc: 'Nilai dihitung berdasarkan kunci jawaban di backend dengan rumus baku (0-100).' },
                  { title: '7. Analisis Indikator Lemah', desc: 'Indikator dengan penguasaan <70% otomatis ditandai dan diberikan saran belajar spesifik.' },
                  { title: '8. Umpan Balik Sesuai Kategori', desc: 'Narasi positif dan memotivasi ditampilkan sesuai pencapaian skor (Sangat Baik s.d. Perlu Pendampingan).' },
                  { title: '9. Penyimpanan Refleksi 4 Pilar', desc: 'Jawaban refleksi murid tersimpan dan dapat ditinjau oleh guru di menu Rekap Nilai.' },
                  { title: '10. Dashboard & Rekap Guru', desc: 'Statistik rata-rata kelas, nilai tertinggi/terendah, dan tombol unduh CSV berfungsi optimal.' }
                ].map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-900 block">{item.title}</span>
                    <p className="text-slate-600 leading-relaxed text-[11px]">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>SMA Negeri 1 Tejakula • Guru: I Ketut Agus Nova Anggarawan, S.Pd.</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
          >
            Tutup Dokumentasi
          </button>
        </div>
      </div>
    </div>
  );
};
