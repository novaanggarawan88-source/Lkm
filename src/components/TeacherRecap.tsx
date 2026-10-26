import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Download,
  Printer,
  Eye,
  CheckCircle2,
  XCircle,
  X,
  FileSpreadsheet,
  MessageSquare,
  BookOpen,
  Calendar,
  FileDown
} from 'lucide-react';
import { SubmissionResult, StudentReflection } from '../types/lkm';
import { LkmService } from '../services/lkmService';
import { generateLkmResultPdf } from '../utils/pdfExport';

export const TeacherRecap: React.FC = () => {
  const [submissions, setSubmissions] = useState<SubmissionResult[]>([]);
  const [reflections, setReflections] = useState<StudentReflection[]>([]);
  const [classes, setClasses] = useState<string[]>([]);

  // Filter state
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedLkm, setSelectedLkm] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Detail Modal State
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionResult | null>(null);

  useEffect(() => {
    const subs = LkmService.getSubmissions();
    setSubmissions(subs);
    const refs = LkmService.getReflections();
    setReflections(refs);
    const cls = LkmService.getClasses();
    setClasses(cls);
  }, []);

  const filteredList = submissions.filter((s) => {
    if (selectedClass !== 'all' && s.kelas !== selectedClass) return false;
    if (selectedLkm !== 'all' && s.lkmId !== selectedLkm) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = s.namaMurid.toLowerCase().includes(q);
      const matchNis = (s.nis || '').includes(q);
      if (!matchName && !matchNis) return false;
    }
    return true;
  });

  const handleExportCsv = () => {
    const headers = ['No', 'ID Pengerjaan', 'Tanggal', 'Waktu', 'Kelas', 'NIS', 'Nama Murid', 'Materi', 'Total Soal', 'Benar', 'Salah', 'Kosong', 'Nilai Akhir', 'Kategori', 'Umpan Balik', 'Status Penilaian'];
    const rows = filteredList.map((s, idx) => [
      idx + 1,
      s.id,
      s.tanggal,
      s.waktu,
      s.kelas,
      s.nis,
      `"${s.namaMurid}"`,
      `"${s.materi}"`,
      s.totalSoal,
      s.benar,
      s.salah,
      s.kosong,
      s.nilaiAkhir,
      s.kategori,
      `"${s.umpanBalik.replace(/"/g, '""')}"`,
      s.statusPenilaian
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_LKM_PJOK_${selectedClass}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentReflection = selectedSubmission
    ? reflections.find((r) => r.submissionId === selectedSubmission.id || (r.namaMurid === selectedSubmission.namaMurid && r.lkmId === selectedSubmission.lkmId))
    : null;

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner - Mobile Friendly */}
      <div className="bg-white rounded-3xl p-4 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg xs:text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
            Rekapitulasi Hasil LKM Digital PJOK
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Data penilaian real-time terhubung langsung dengan Google Spreadsheet SMA Negeri 1 Tejakula
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleExportCsv}
            className="flex-1 sm:flex-none justify-center px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Unduh CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex-1 sm:flex-none justify-center px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Rekap</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl p-3.5 sm:p-5 border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama murid atau NIS..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 font-medium focus:border-blue-600 focus:outline-none"
          />
        </div>

        {/* Filter Kelas */}
        <div>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 font-semibold focus:border-blue-600 focus:outline-none bg-white cursor-pointer"
          >
            <option value="all">-- Semua Kelas --</option>
            {classes.map((c) => (
              <option key={c} value={c}>
                Kelas {c}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Materi */}
        <div>
          <select
            value={selectedLkm}
            onChange={(e) => setSelectedLkm(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 font-semibold focus:border-blue-600 focus:outline-none bg-white cursor-pointer"
          >
            <option value="all">-- Semua Materi LKM --</option>
            <option value="LKM-KBG-01">Kebugaran Jasmani</option>
            <option value="LKM-VOL-02">Permainan Bola Voli</option>
            <option value="LKM-SNM-03">Senam Lantai</option>
          </select>
        </div>
      </div>

      {/* Recap Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                <th className="py-3.5 px-4 w-12 text-center">No</th>
                <th className="py-3.5 px-4">Nama Murid</th>
                <th className="py-3.5 px-3">Kelas</th>
                <th className="py-3.5 px-3">Materi</th>
                <th className="py-3.5 px-3 text-center text-emerald-700">Benar</th>
                <th className="py-3.5 px-3 text-center text-rose-700">Salah</th>
                <th className="py-3.5 px-4 text-center">Nilai</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">Waktu</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400">
                    Tidak ada data pengerjaan yang cocok dengan filter yang dipilih.
                  </td>
                </tr>
              ) : (
                filteredList.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center font-bold text-slate-500">{idx + 1}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-extrabold text-slate-900 block">{item.namaMurid}</span>
                      <span className="text-[10px] text-slate-400">NIS: {item.nis}</span>
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-slate-700">{item.kelas}</td>
                    <td className="py-3.5 px-3 font-medium text-slate-600 truncate max-w-[140px]">{item.materi}</td>
                    <td className="py-3.5 px-3 text-center font-bold text-emerald-600">{item.benar}</td>
                    <td className="py-3.5 px-3 text-center font-bold text-rose-600">{item.salah}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-black text-blue-900 text-sm px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200">
                        {item.nilaiAkhir}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        item.nilaiAkhir >= 90
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.nilaiAkhir >= 80
                          ? 'bg-blue-100 text-blue-800'
                          : item.nilaiAkhir >= 70
                          ? 'bg-cyan-100 text-cyan-800'
                          : item.nilaiAkhir >= 60
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {item.kategori}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {item.tanggal}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => setSelectedSubmission(item)}
                        className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Detail</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL: Detailed Answers & Student Reflection */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">
                  Detail Pengerjaan: {selectedSubmission.namaMurid}
                </h3>
                <p className="text-xs text-slate-500">
                  Kelas {selectedSubmission.kelas} • {selectedSubmission.materi} • Nilai: <strong className="text-blue-700">{selectedSubmission.nilaiAkhir}</strong>
                </p>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm">
              {/* Submission summary cards */}
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">TOTAL SOAL</span>
                  <span className="font-black text-slate-900 text-base">{selectedSubmission.totalSoal}</span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <span className="text-[10px] text-emerald-700 block">BENAR</span>
                  <span className="font-black text-emerald-700 text-base">{selectedSubmission.benar}</span>
                </div>
                <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
                  <span className="text-[10px] text-rose-700 block">SALAH</span>
                  <span className="font-black text-rose-700 text-base">{selectedSubmission.salah}</span>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <span className="text-[10px] text-blue-700 block">NILAI AKHIR</span>
                  <span className="font-black text-blue-700 text-base">{selectedSubmission.nilaiAkhir}</span>
                </div>
              </div>

              {/* Umpan Balik */}
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-1">
                <span className="font-bold text-blue-900 block">Umpan Balik Otomatis:</span>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  "{selectedSubmission.umpanBalik}"
                </p>
              </div>

              {/* Indikator Lemah */}
              {selectedSubmission.indikatorLemah && selectedSubmission.indikatorLemah.length > 0 && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
                  <span className="font-bold text-amber-900 block">Indikator yang Perlu Diperkuat:</span>
                  <p className="text-xs text-amber-800">
                    {selectedSubmission.indikatorLemah.join(', ')}
                  </p>
                </div>
              )}

              {/* Refleksi Murid */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <h4 className="font-extrabold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>Jawaban Refleksi Murid</span>
                </h4>

                {currentReflection ? (
                  <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                    <div>
                      <span className="font-bold text-slate-700 block">1. Hal Baru yang Dipelajari:</span>
                      <p className="text-slate-600 mt-0.5">{currentReflection.halBaru}</p>
                    </div>
                    <div>
                      <span className="font-bold text-slate-700 block">2. Materi yang Masih Sulit:</span>
                      <p className="text-slate-600 mt-0.5">{currentReflection.materiSulit}</p>
                    </div>
                    <div>
                      <span className="font-bold text-slate-700 block">3. Penyebab Kesulitan:</span>
                      <p className="text-slate-600 mt-0.5">{currentReflection.penyebabKesulitan}</p>
                    </div>
                    <div>
                      <span className="font-bold text-slate-700 block">4. Rencana Peningkatan:</span>
                      <p className="text-slate-600 mt-0.5">{currentReflection.rencanaPeningkatan}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic p-3 bg-slate-50 rounded-xl">
                    Murid belum mengisi lembar refleksi untuk pengerjaan ini.
                  </p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => generateLkmResultPdf(selectedSubmission)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <FileDown className="w-4 h-4" />
                <span>Unduh Dokumen PDF Murid</span>
              </button>

              <button
                onClick={() => setSelectedSubmission(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
