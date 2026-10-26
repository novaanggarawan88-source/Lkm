import React, { useState, useEffect } from 'react';
import {
  Users,
  Award,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  Target,
  Sparkles,
  ArrowRight,
  Filter,
  Lightbulb,
  FileSpreadsheet
} from 'lucide-react';
import { LkmService } from '../services/lkmService';
import { AppSettings } from '../types/lkm';

interface TeacherDashboardProps {
  settings: AppSettings;
  onOpenSheetsModal: () => void;
  onViewRecap: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  settings,
  onOpenSheetsModal,
  onViewRecap
}) => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const data = LkmService.getTeacherDashboardStats();
    setStats(data);
  }, []);

  if (!stats) return null;

  return (
    <div className="space-y-6 sm:space-y-8 pb-16">
      {/* Welcome Banner - Mobile Optimized */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-4 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold mb-2.5 border border-blue-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dashboard Analisis Guru PJOK</span>
          </div>
          <h1 className="text-xl xs:text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            Selamat Datang, {settings.teacherName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Pantau hasil belajar murid, identifikasi indikator yang paling banyak dijawab salah, dan rancang tindak lanjut pembelajaran berbasis data Google Spreadsheet.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <button
            onClick={onOpenSheetsModal}
            className="w-full sm:w-auto justify-center px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Integrasi Spreadsheet & Code.gs</span>
          </button>
        </div>
      </div>

      {/* Top 5 Metrics Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-4">
        {/* Total Murid */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 block">TOTAL MURID</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-slate-900">{stats.totalStudents}</span>
            <span className="text-xs text-slate-400">Terdaftar</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-bold mt-2 block">
            {stats.completedStudents} Telah Mengerjakan
          </span>
        </div>

        {/* Belum Mengerjakan */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 block">BELUM MENGERJAKAN</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-amber-600">{stats.incompleteCount}</span>
            <span className="text-xs text-slate-400">Murid</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-2 block">
            Perlu pengingat kelas
          </span>
        </div>

        {/* Rata-Rata Nilai */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 block">RATA-RATA NILAI</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-blue-700">{stats.avgScore}</span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <span className="text-[11px] text-blue-600 font-bold mt-2 block">
            Kategori: {stats.avgScore >= 80 ? 'Baik' : stats.avgScore >= 70 ? 'Cukup Baik' : 'Perlu Peningkatan'}
          </span>
        </div>

        {/* Nilai Tertinggi */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 block">NILAI TERTINGGI</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-emerald-600">{stats.highestScore}</span>
            <span className="text-xs text-slate-400">Poin</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-bold mt-2 block">
            Pencapaian Terbaik
          </span>
        </div>

        {/* Nilai Terendah */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs col-span-2 sm:col-span-1">
          <span className="text-xs font-bold text-slate-500 block">NILAI TERENDAH</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-rose-600">{stats.lowestScore}</span>
            <span className="text-xs text-slate-400">Poin</span>
          </div>
          <span className="text-[11px] text-rose-600 font-bold mt-2 block">
            Butuh Remedial/Bimbingan
          </span>
        </div>
      </div>

      {/* Distribusi Kategori Pencapaian */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
            Distribusi Kategori Pencapaian Murid
          </h2>
          <span className="text-xs text-slate-500">
            Berdasarkan konfigurasi Sheet PENGATURAN_FEEDBACK
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: 'Sangat Baik (90-100)', key: 'Sangat Baik', color: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50' },
            { label: 'Baik (80-89)', key: 'Baik', color: 'bg-blue-500', text: 'text-blue-700', bg: 'bg-blue-50' },
            { label: 'Cukup Baik (70-79)', key: 'Cukup Baik', color: 'bg-cyan-500', text: 'text-cyan-700', bg: 'bg-cyan-50' },
            { label: 'Perlu Peningkatan (60-69)', key: 'Perlu Peningkatan', color: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50' },
            { label: 'Perlu Pendampingan (<60)', key: 'Perlu Pendampingan', color: 'bg-rose-500', text: 'text-rose-700', bg: 'bg-rose-50' }
          ].map((cat) => {
            const count = stats.kategoriCounts[cat.key] || 0;
            return (
              <div key={cat.key} className={`p-4 rounded-2xl ${cat.bg} border border-slate-200/80`}>
                <span className="text-xs font-bold text-slate-600 block line-clamp-1">{cat.label}</span>
                <span className={`text-2xl font-black ${cat.text} block mt-1`}>{count}</span>
                <span className="text-[10px] text-slate-500">Murid</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid: Analisis Kesalahan Indikator & Rekomendasi Guru */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Indikator Paling Banyak Salah */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-rose-600" />
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
              Indikator dengan Tingkat Kesalahan Tertinggi
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Materi di bawah ini memerlukan perhatian khusus dan penguatan saat tatap muka di lapangan maupun di kelas.
          </p>

          <div className="space-y-3 pt-2">
            {stats.indicatorSummary.map((ind: any, idx: number) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                  <span className="truncate max-w-[260px]">{ind.indikator}</span>
                  <span className="font-bold text-rose-600">
                    {ind.errorRate}% Salah ({ind.totalWrong} dari {ind.totalTested} respons)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      ind.errorRate > 30 ? 'bg-rose-500' : ind.errorRate > 15 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, ind.errorRate)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rekomendasi Pedagogis Guru */}
        <div className="bg-gradient-to-br from-blue-50 to-emerald-50/50 rounded-3xl p-6 sm:p-7 border border-blue-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-blue-900">
              <Lightbulb className="w-5 h-5 text-blue-600" />
              <h2 className="text-base sm:text-lg font-extrabold">
                Rekomendasi Tindak Lanjut untuk Guru
              </h2>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-700">
              <div className="p-3.5 bg-white rounded-2xl border border-blue-200 space-y-1">
                <span className="font-bold text-blue-900 block">1. Penguatan Materi Sirkuit Latihan (Circuit Training)</span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Banyak murid masih keliru mengenai penyusunan variasi pos otot dan interval istirahat. Laksanakan simulasi penataan 4 pos di lapangan olahraga sekolah.
                </p>
              </div>

              <div className="p-3.5 bg-white rounded-2xl border border-blue-200 space-y-1">
                <span className="font-bold text-blue-900 block">2. Diferensiasi Pembelajaran</span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Bagi murid berkategori Sangat Baik (90-100), berikan tugas pengayaan memimpin pemanasan dan merancang circuit training pribadi. Murid kategori &lt;70 diberikan bimbingan konsep mandiri.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={onViewRecap}
              className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs inline-flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 cursor-pointer"
            >
              <span>Buka Rekap Lengkap & Refleksi Murid</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Murid yang Memerlukan Pendampingan */}
      {stats.studentsNeedingHelp && stats.studentsNeedingHelp.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-rose-800">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <h2 className="text-base sm:text-lg font-extrabold">
              Murid yang Memerlukan Pendampingan Khusus (Nilai &lt; 70)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {stats.studentsNeedingHelp.map((s: any, idx: number) => (
              <div key={idx} className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-sm">{s.nama}</span>
                  <span className="px-2 py-0.5 rounded-md bg-rose-200 text-rose-900 font-black text-xs">
                    {s.nilai}
                  </span>
                </div>
                <span className="text-xs text-slate-500 block">Kelas: {s.kelas}</span>
                {s.indikatorLemah && s.indikatorLemah.length > 0 && (
                  <p className="text-[11px] text-rose-700 leading-tight">
                    Materi belum dikuasai: <strong>{s.indikatorLemah.join(', ')}</strong>
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
