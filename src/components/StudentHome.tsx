import React from 'react';
import {
  ArrowRight,
  Sparkles,
  Target,
  Zap,
  CheckCircle,
  Clock,
  BookOpen,
  Award,
  Activity,
  HeartPulse,
  Flame
} from 'lucide-react';
import { LkmInfo, AppSettings } from '../types/lkm';

interface StudentHomeProps {
  onStartLkm: (lkmId?: string) => void;
  lkms: LkmInfo[];
  settings: AppSettings;
}

export const StudentHome: React.FC<StudentHomeProps> = ({ onStartLkm, lkms, settings }) => {
  return (
    <div className="space-y-10 pb-16">
      {/* Hero Banner with Modern Blue, White, and Emerald Palette */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900 via-blue-800 to-emerald-900 text-white shadow-xl">
        {/* Decorative background shapes */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-10 bottom-0 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 top-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 px-4 py-8 xs:px-6 xs:py-10 sm:px-12 sm:py-16 max-w-4xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-emerald-300 mb-4 sm:mb-6">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Lembar Kerja Murid Digital Interaktif</span>
          </div>

          <h1 className="text-2xl xs:text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-2 sm:mb-4">
            LKM DIGITAL PJOK
          </h1>

          <p className="text-base xs:text-lg sm:text-2xl font-medium text-emerald-200/90 mb-5 sm:mb-6 leading-snug">
            Belajar Aktif, Berpikir Kritis, dan Refleksi Diri
          </p>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 sm:p-5 border border-white/15 mb-6 sm:mb-8 max-w-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 text-xs sm:text-sm">
              <div>
                <span className="text-slate-300 block text-[11px] sm:text-xs">Satuan Pendidikan:</span>
                <span className="font-bold text-white">{settings.schoolName}</span>
              </div>
              <div>
                <span className="text-slate-300 block text-[11px] sm:text-xs">Mata Pelajaran:</span>
                <span className="font-bold text-white">PJOK (Fase F)</span>
              </div>
              <div>
                <span className="text-slate-300 block text-[11px] sm:text-xs">Guru Pengampu:</span>
                <span className="font-bold text-white truncate block">{settings.teacherName}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <button
              onClick={() => onStartLkm()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-sm sm:text-base hover:from-emerald-400 hover:to-teal-300 shadow-lg shadow-emerald-500/30 transform hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <span>MULAI MENGERJAKAN LKM</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs text-blue-200/90 px-1">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Siswa masuk menggunakan dropdown kelas & nama</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Feature Highlights */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-blue-300 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-1">Penilaian Otomatis</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Langsung ketahui nilai akhir, jumlah jawaban benar, dan jumlah salah seketika setelah mengumpulkan.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
            <HeartPulse className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-1">Umpan Balik Cerdas</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Analisis indikator materi yang belum dikuasai dengan saran belajar spesifik untuk perbaikan konsep.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-cyan-300 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center mb-3">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-1">Pembahasan Soal</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Akses kunci jawaban dan penjelasan mendalam setelah pengumpulan demi pembelajaran mandiri yang bermakna.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-amber-300 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
            <Activity className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-1">Refleksi Diri PJOK</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Ruang refleksi 4 pilar untuk mengukur pemahaman diri dan langkah tindak lanjut peningkatan prestasi.
          </p>
        </div>
      </section>

      {/* Available LKMs Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Daftar Lembar Kerja Murid Aktif
            </h2>
            <p className="text-sm text-slate-500">
              Pilih LKM yang ditugaskan oleh guru untuk mulai belajar dan mengerjakan soal
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {lkms.map((lkm) => (
            <div
              key={lkm.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-blue-100 text-blue-800">
                    {lkm.fase} • Kelas {lkm.kelas}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    {lkm.durasiMenit} Menit
                  </span>
                </div>

                <h3 className="font-extrabold text-slate-900 text-lg mb-2 line-clamp-1">
                  {lkm.judul}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                  {lkm.tujuanPembelajaran}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">
                  <Flame className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{lkm.totalSoal} Butir Soal</span>
                </div>

                <button
                  onClick={() => onStartLkm(lkm.id)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Pilih LKM</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Petunjuk Belajar PJOK */}
      <section className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
        <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <span>Petunjuk & Budaya Belajar PJOK SMA Negeri 1 Tejakula</span>
        </h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0">1</span>
            <span>Junjung tinggi nilai <strong>kejujuran dan sportivitas</strong> dalam setiap pengerjaan LKM.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0">2</span>
            <span>Baca butir pertanyaan dan pilihan jawaban secara mendalam sebelum menentukan pilihan.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0">3</span>
            <span>Gunakan umpan balik dan pembahasan soal sebagai sarana pengayaan dan perbaikan diri.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0">4</span>
            <span>Isi lembar refleksi di akhir kegiatan untuk mencatat capaian dan tantangan belajar Anda.</span>
          </li>
        </ul>
      </section>
    </div>
  );
};
