import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  CheckCircle2,
  Send,
  Sparkles,
  BookOpen,
  ArrowRight,
  HeartHandshake,
  Lightbulb
} from 'lucide-react';
import { SubmissionResult, StudentReflection as IReflection } from '../types/lkm';
import { LkmService } from '../services/lkmService';

interface StudentReflectionProps {
  submission: SubmissionResult | null;
  onFinished: () => void;
}

export const StudentReflection: React.FC<StudentReflectionProps> = ({
  submission,
  onFinished
}) => {
  const [halBaru, setHalBaru] = useState<string>('');
  const [materiSulit, setMateriSulit] = useState<string>('');
  const [penyebabKesulitan, setPenyebabKesulitan] = useState<string>('');
  const [rencanaPeningkatan, setRencanaPeningkatan] = useState<string>('');

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Auto-fill weak indicators as suggestions for question 2 if available
  useEffect(() => {
    if (submission?.indikatorLemah && submission.indikatorLemah.length > 0) {
      setMateriSulit(`Materi terkait: ${submission.indikatorLemah.join(', ')}`);
    }
  }, [submission]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!halBaru || !materiSulit || !rencanaPeningkatan) {
      setErrorMessage('Mohon lengkapi minimal pertanyaan hal baru, materi yang sulit, dan rencana peningkatan Anda.');
      return;
    }

    setIsSaving(true);
    setErrorMessage('');

    try {
      await LkmService.saveReflection({
        submissionId: submission?.id || 'REF-OFFLINE',
        namaMurid: submission?.namaMurid || 'Murid PJOK',
        kelas: submission?.kelas || 'XI',
        lkmId: submission?.lkmId || 'LKM-KBG-01',
        materi: submission?.materi || 'Kebugaran Jasmani',
        halBaru,
        materiSulit,
        penyebabKesulitan: penyebabKesulitan || 'Perlu pembiasaan latihan soal lebih banyak.',
        rencanaPeningkatan
      });

      setSavedSuccess(true);
    } catch (err: any) {
      setErrorMessage('Terjadi kesalahan saat menyimpan refleksi. Silakan coba kembali.');
    } finally {
      setIsSaving(false);
    }
  };

  if (savedSuccess) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">
          Refleksi Berhasil Disimpan!
        </h2>
        <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          Terima kasih telah mengisi refleksi belajar PJOK dengan jujur dan terbuka. Catatan refleksi Anda telah tersimpan ke Google Spreadsheet dan akan menjadi bahan evaluasi guru untuk perbaikan pembelajaran berikutnya.
        </p>

        <div className="pt-4 flex items-center justify-center gap-3">
          <button
            onClick={onFinished}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-extrabold text-sm hover:from-blue-700 hover:to-emerald-700 shadow-lg shadow-blue-500/20 inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Kembali ke Beranda</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-2 sm:py-6">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header - Mobile Friendly */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-blue-800 px-4 sm:px-8 py-6 sm:py-8 text-white relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-emerald-300 mb-2.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Refleksi Pembelajaran PJOK</span>
          </div>
          <h1 className="text-xl xs:text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            LEMBAR REFLEKSI DIRI
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-xl leading-relaxed">
            Kejujuran refleksi adalah awal kemajuan. Tuliskan tanggapan Anda secara jujur dan mendalam setelah menyelesaikan LKM.
          </p>

          {submission && (
            <div className="mt-3.5 flex flex-wrap gap-2 text-xs">
              <span className="px-3 py-1 rounded-lg bg-white/15 text-white font-semibold">
                {submission.namaMurid} • {submission.kelas}
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/15 text-white font-semibold">
                Nilai LKM: {submission.nilaiAkhir} ({submission.kategori})
              </span>
            </div>
          )}
        </div>

        {/* Form Body - Mobile Friendly Padding */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-8 space-y-5 sm:space-y-6">
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-semibold">
              {errorMessage}
            </div>
          )}

          {/* Question 1 */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-800 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>1. Apa hal baru yang kamu pelajari hari ini?</span>
            </label>
            <textarea
              rows={3}
              value={halBaru}
              onChange={(e) => setHalBaru(e.target.value)}
              placeholder="Contoh: Saya baru memahami cara merancang pos circuit training dengan prinsip variasi kelompok otot..."
              className="w-full p-4 rounded-2xl border-2 border-slate-200 focus:border-emerald-600 focus:outline-none text-slate-900 text-sm"
              required
            />
          </div>

          {/* Question 2 */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-800 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-500" />
              <span>2. Bagian materi apa yang masih sulit kamu pahami?</span>
            </label>
            <textarea
              rows={3}
              value={materiSulit}
              onChange={(e) => setMateriSulit(e.target.value)}
              placeholder="Contoh: Membedakan daya ledak (power) dengan kekuatan murni pada cabang olahraga tertentu..."
              className="w-full p-4 rounded-2xl border-2 border-slate-200 focus:border-emerald-600 focus:outline-none text-slate-900 text-sm"
              required
            />
          </div>

          {/* Question 3 */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-800 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-rose-500" />
              <span>3. Apa penyebab kamu kesulitan menjawab soal tersebut?</span>
            </label>
            <textarea
              rows={3}
              value={penyebabKesulitan}
              onChange={(e) => setPenyebabKesulitan(e.target.value)}
              placeholder="Contoh: Kurang teliti membaca perbedaan istilah dalam soal, atau belum membaca materi FITT sebelumnya..."
              className="w-full p-4 rounded-2xl border-2 border-slate-200 focus:border-emerald-600 focus:outline-none text-slate-900 text-sm"
            />
          </div>

          {/* Question 4 */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-800 flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-emerald-500" />
              <span>4. Apa yang akan kamu lakukan untuk meningkatkan pemahamanmu?</span>
            </label>
            <textarea
              rows={3}
              value={rencanaPeningkatan}
              onChange={(e) => setRencanaPeningkatan(e.target.value)}
              placeholder="Contoh: Membaca kembali buku teks PJOK, berdiskusi dengan teman kelompok, dan berkonsultasi dengan Pak Guru Agus Nova..."
              className="w-full p-4 rounded-2xl border-2 border-slate-200 focus:border-emerald-600 focus:outline-none text-slate-900 text-sm"
              required
            />
          </div>

          {/* Submit Action - Mobile Responsive */}
          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-100">
            <span className="text-xs text-slate-400">
              Jawaban refleksi akan dikirim langsung ke Google Spreadsheet guru.
            </span>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-sm hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-500/20 inline-flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? (
                <span>Menyimpan Refleksi...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>SIMPAN REFLEKSI</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
