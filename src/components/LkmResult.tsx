import React, { useState, useEffect } from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  BookOpen,
  ArrowRight,
  Printer,
  ChevronDown,
  ChevronUp,
  Sparkles,
  AlertCircle,
  Target,
  FileText,
  FileDown,
  Download,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SubmissionResult } from '../types/lkm';
import { generateLkmResultPdf } from '../utils/pdfExport';

interface LkmResultProps {
  result: SubmissionResult;
  onGoToReflection: () => void;
  onRetakeLkm?: () => void;
  allowRetake?: boolean;
}

export const LkmResult: React.FC<LkmResultProps> = ({
  result,
  onGoToReflection,
  onRetakeLkm,
  allowRetake = false
}) => {
  const [showReview, setShowReview] = useState<boolean>(false);
  const [filterReview, setFilterReview] = useState<'all' | 'wrong' | 'correct'>('all');
  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false);

  // Trigger celebration confetti for high achievements
  useEffect(() => {
    if (result.nilaiAkhir >= 80) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [result.nilaiAkhir]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    try {
      setIsDownloadingPdf(true);
      // Small timeout to allow UI update
      setTimeout(() => {
        generateLkmResultPdf(result);
        setIsDownloadingPdf(false);
      }, 250);
    } catch (err) {
      console.error('Error generating PDF:', err);
      setIsDownloadingPdf(false);
      alert('Terjadi kendala saat membuat dokumen PDF. Anda dapat menggunakan tombol Cetak Hasil.');
    }
  };

  const filteredReviewList = (result.rincianReview || []).filter((item) => {
    if (filterReview === 'wrong') return !item.isCorrect;
    if (filterReview === 'correct') return item.isCorrect;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-emerald-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden print:bg-white print:text-slate-900 print:shadow-none print:p-0">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-emerald-300 mb-2 print:hidden">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Pengerjaan Berhasil Disimpan ke Google Spreadsheet</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              HASIL LKM DIGITAL
            </h1>
            <p className="text-sm sm:text-base text-emerald-200 mt-1">
              Selamat, Anda telah menyelesaikan Lembar Kerja Murid!
            </p>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-white/10 rounded-2xl p-3 border border-white/15 print:border-slate-300 print:bg-slate-50 print:text-slate-900">
              <div>
                <span className="text-slate-300 block text-[11px] print:text-slate-600">Nama Murid:</span>
                <span className="font-bold text-white text-sm print:text-slate-900">{result.namaMurid}</span>
              </div>
              <div>
                <span className="text-slate-300 block text-[11px] print:text-slate-600">Kelas:</span>
                <span className="font-bold text-white text-sm print:text-slate-900">{result.kelas}</span>
              </div>
              <div>
                <span className="text-slate-300 block text-[11px] print:text-slate-600">Materi:</span>
                <span className="font-bold text-white text-sm print:text-slate-900">{result.materi}</span>
              </div>
              <div>
                <span className="text-slate-300 block text-[11px] print:text-slate-600">Waktu Pengumpulan:</span>
                <span className="font-bold text-white text-sm print:text-slate-900">{result.tanggal} {result.waktu}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-col items-stretch sm:items-end gap-2 print:hidden w-full sm:w-auto">
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
              className="px-4 py-2.5 rounded-xl bg-white text-blue-900 hover:bg-blue-50 font-extrabold text-xs inline-flex items-center justify-center gap-1.5 shadow-md shadow-blue-900/20 transition-all cursor-pointer disabled:opacity-50"
              title="Unduh Lembar Hasil Resmi format PDF (jsPDF)"
            >
              {isDownloadingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-blue-700" />
                  <span>Membuat PDF...</span>
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4 text-blue-700" />
                  <span>Unduh Dokumen PDF</span>
                </>
              )}
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white font-bold text-xs inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Hasil</span>
            </button>
            <button
              onClick={onGoToReflection}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs inline-flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <span>Isi Refleksi</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Nilai Akhir & Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Main Score Hero Card */}
        <div className="md:col-span-4 lg:col-span-2 bg-white rounded-3xl p-6 border-2 border-blue-500/30 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 tracking-wider uppercase block">
              NILAI AKHIR
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-5xl sm:text-6xl font-black text-blue-900">
                {result.nilaiAkhir}
              </span>
              <span className="text-sm font-semibold text-slate-400">/ 100</span>
            </div>
            <div className="mt-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black ${
                result.nilaiAkhir >= 90
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : result.nilaiAkhir >= 80
                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                  : result.nilaiAkhir >= 70
                  ? 'bg-cyan-100 text-cyan-800 border border-cyan-300'
                  : result.nilaiAkhir >= 60
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-rose-100 text-rose-800 border border-rose-300'
              }`}>
                Kategori: {result.kategori}
              </span>
            </div>
          </div>

          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-blue-50 to-emerald-50 border border-blue-200 flex flex-col items-center justify-center text-center p-2">
            <Award className="w-8 h-8 text-blue-600 mb-1" />
            <span className="text-[10px] font-bold text-slate-600 uppercase">
              {result.benar} / {result.totalSoal}
            </span>
            <span className="text-[9px] text-slate-400">Tepat</span>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-3 gap-3 md:col-span-4 lg:col-span-2">
          {/* Benar */}
          <div className="bg-white rounded-2xl p-4 border border-emerald-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-emerald-700">
              <span className="text-xs font-bold">JAWABAN BENAR</span>
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="mt-2">
              <span className="text-3xl font-black text-emerald-600">{result.benar}</span>
              <span className="text-xs text-slate-500 block">Soal</span>
            </div>
          </div>

          {/* Salah */}
          <div className="bg-white rounded-2xl p-4 border border-rose-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-rose-700">
              <span className="text-xs font-bold">JAWABAN SALAH</span>
              <XCircle className="w-4 h-4" />
            </div>
            <div className="mt-2">
              <span className="text-3xl font-black text-rose-600">{result.salah}</span>
              <span className="text-xs text-slate-500 block">Soal</span>
            </div>
          </div>

          {/* Belum Dijawab / Total */}
          <div className="bg-white rounded-2xl p-4 border border-blue-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-blue-700">
              <span className="text-xs font-bold">TOTAL SOAL</span>
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="mt-2">
              <span className="text-3xl font-black text-blue-600">{result.totalSoal}</span>
              <span className="text-xs text-slate-500 block">
                {result.kosong > 0 ? `(${result.kosong} Belum)` : 'Selesai'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Unduh Dokumen PDF Resmi Card */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 rounded-3xl p-5 sm:p-6 text-white shadow-md border border-blue-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md text-emerald-400 border border-white/15 flex items-center justify-center shrink-0">
            <FileDown className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base sm:text-lg text-white">
                Unduh Dokumen Laporan Resmi (PDF)
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                jsPDF Engine
              </span>
            </div>
            <p className="text-xs text-blue-200 mt-1 max-w-xl leading-relaxed">
              Dapatkan berkas PDF resmi ber-kop SMA Negeri 1 Tejakula lengkap dengan rincian identitas, nilai akhir, tabel capaian per indikator, umpan balik personal, dan kolom pengesahan guru PJOK.
            </p>
          </div>
        </div>

        <button
          onClick={handleDownloadPdf}
          disabled={isDownloadingPdf}
          className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs sm:text-sm inline-flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer shrink-0 disabled:opacity-50"
        >
          {isDownloadingPdf ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
              <span>Memproses Dokumen...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4 text-slate-950" />
              <span>Unduh PDF Sekarang</span>
            </>
          )}
        </button>
      </div>

      {/* Umpan Balik Otomatis Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-blue-700">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
            Umpan Balik Otomatis
          </h2>
        </div>
        <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-sm text-slate-800 leading-relaxed font-medium">
          "{result.umpanBalik}"
        </div>
      </div>

      {/* Analisis Jawaban Berdasarkan Indikator Pembelajaran */}
      {result.analisisIndikator && result.analisisIndikator.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                Analisis Penguasaan Berdasarkan Indikator
              </h2>
            </div>
            <span className="text-xs text-slate-500 hidden sm:inline">
              Data langsung dari Google Spreadsheet
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold">
                  <th className="py-3 px-4">Indikator Pembelajaran</th>
                  <th className="py-3 px-3 text-center">Jumlah Soal</th>
                  <th className="py-3 px-3 text-center text-emerald-700">Benar</th>
                  <th className="py-3 px-3 text-center text-rose-700">Salah</th>
                  <th className="py-3 px-4 text-center">Penguasaan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {result.analisisIndikator.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {item.indikator}
                    </td>
                    <td className="py-3.5 px-3 text-center font-bold text-slate-600">
                      {item.totalSoal}
                    </td>
                    <td className="py-3.5 px-3 text-center font-bold text-emerald-600">
                      {item.benar}
                    </td>
                    <td className="py-3.5 px-3 text-center font-bold text-rose-600">
                      {item.salah}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        item.persentase >= 80
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.persentase >= 60
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {item.persentase}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Saran Belajar Berdasarkan Materi yang Masih Sulit */}
      {result.indikatorLemah && result.indikatorLemah.length > 0 ? (
        <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-6 sm:p-7 space-y-4">
          <div className="flex items-center gap-2 text-amber-900 font-extrabold text-base sm:text-lg">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>Materi yang Perlu Diperkuat & Saran Belajar</span>
          </div>

          <div className="space-y-3">
            {result.analisisIndikator
              ?.filter((ind) => result.indikatorLemah.includes(ind.indikator))
              .map((weak, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-4 border border-amber-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-amber-900">{weak.indikator}</span>
                    <span className="text-rose-600 font-bold">{weak.salah} dari {weak.totalSoal} soal masih keliru</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    <strong>Saran Belajar:</strong> {weak.saranBelajar || 'Pelajari kembali buku paket PJOK Bab Kebugaran Jasmani dan tanyakan hal yang belum jelas kepada guru.'}
                  </p>
                </div>
              ))}
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 flex items-center gap-3 text-emerald-900">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          <div className="text-sm">
            <span className="font-bold block">Penguasaan Materi Sangat Baik!</span>
            <span>Anda berhasil menjawab dengan baik seluruh indikator materi pada Lembar Kerja Murid ini.</span>
          </div>
        </div>
      )}

      {/* Rekomendasi Tindak Lanjut Otomatis */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-3">
        <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-600" />
          <span>Rekomendasi Tindak Lanjut Belajar</span>
        </h3>
        <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
          {result.rekomendasiTindakLanjut.map((rek, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-xs">
                {idx + 1}
              </span>
              <span>{rek}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Feature: LIHAT PEMBAHASAN SOAL */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
              Lihat Pembahasan Soal
            </h3>
            <p className="text-xs text-slate-500">
              Periksa kunci jawaban, butir soal, dan ulasan ilmiah dari guru pengampu
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowReview(!showReview)}
              className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 font-bold text-xs hover:bg-blue-100 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>{showReview ? 'Sembunyikan Pembahasan' : 'Buka Pembahasan'}</span>
              {showReview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {showReview && (
          <div className="pt-4 border-t border-slate-100 space-y-4">
            {/* Filter buttons */}
            <div className="flex items-center gap-2 pb-2">
              <button
                onClick={() => setFilterReview('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  filterReview === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Semua Soal ({result.rincianReview?.length || 0})
              </button>
              <button
                onClick={() => setFilterReview('wrong')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  filterReview === 'wrong'
                    ? 'bg-rose-600 text-white'
                    : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                }`}
              >
                Hanya Jawaban Salah ({result.salah})
              </button>
              <button
                onClick={() => setFilterReview('correct')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  filterReview === 'correct'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                Hanya Jawaban Benar ({result.benar})
              </button>
            </div>

            {/* List of Question Reviews */}
            <div className="space-y-4">
              {filteredReviewList.map((item) => (
                <div
                  key={item.questionId}
                  className={`p-5 rounded-2xl border-2 space-y-3 transition-colors ${
                    item.isCorrect
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-rose-50/40 border-rose-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center text-white ${
                        item.isCorrect ? 'bg-emerald-600' : 'bg-rose-600'
                      }`}>
                        {item.nomor}
                      </span>
                      <span className="text-xs font-bold text-slate-600">
                        Indikator: {item.indikator}
                      </span>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                      item.isCorrect
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {item.isCorrect ? 'BENAR' : 'SALAH'}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                    {item.pertanyaan}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                      <span className="text-slate-400 block text-[10px]">Jawaban Anda:</span>
                      <span className={`font-bold ${item.isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {item.jawabanSiswa}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                      <span className="text-slate-400 block text-[10px]">Kunci Jawaban:</span>
                      <span className="font-bold text-blue-700">
                        {item.kunciJawaban}
                      </span>
                    </div>
                  </div>

                  {item.pembahasan && (
                    <div className="p-3.5 rounded-xl bg-white/80 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                      <span className="font-bold text-slate-900 block mb-0.5">Pembahasan Guru:</span>
                      {item.pembahasan}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Call to Action: Refleksi Murid */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-emerald-500/20 print:hidden">
        <div>
          <h3 className="text-xl font-black">Langkah Terakhir: Refleksi Diri</h3>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-xl">
            Tuliskan 4 catatan refleksi singkat mengenai pemahaman materi hari ini agar guru dapat memberikan pendampingan yang tepat.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2.5 shrink-0 w-full sm:w-auto">
          <button
            onClick={handleDownloadPdf}
            disabled={isDownloadingPdf}
            className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-emerald-700/80 hover:bg-emerald-700 border border-emerald-400/40 text-white font-extrabold text-sm inline-flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
          >
            {isDownloadingPdf ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Membuat PDF...</span>
              </>
            ) : (
              <>
                <FileDown className="w-4 h-4" />
                <span>Unduh PDF</span>
              </>
            )}
          </button>
          <button
            onClick={onGoToReflection}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white text-emerald-900 font-black text-sm hover:bg-emerald-50 shadow-md inline-flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-105 shrink-0"
          >
            <span>LANJUT KE REFLEKSI</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
