import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Send,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Clock,
  Sparkles,
  Info,
  BookOpen
} from 'lucide-react';
import { Student, LkmInfo, Question, SubmissionResult } from '../types/lkm';
import { LkmService } from '../services/lkmService';

interface LkmWorksheetProps {
  student: Student;
  lkm: LkmInfo;
  onSubmitted: (result: SubmissionResult) => void;
  onCancel: () => void;
}

export const LkmWorksheet: React.FC<LkmWorksheetProps> = ({
  student,
  lkm,
  onSubmitted,
  onCancel
}) => {
  const [questions, setQuestions] = useState<Omit<Question, 'kunci' | 'pembahasan'>[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>('');

  // Modals for confirmation
  const [showUnansweredWarning, setShowUnansweredWarning] = useState<boolean>(false);
  const [showFinalConfirmation, setShowFinalConfirmation] = useState<boolean>(false);

  // Time tracking
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);

  // Load questions for student (strictly without answer keys)
  useEffect(() => {
    const list = LkmService.getQuestionsForStudent(lkm.id);
    setQuestions(list);

    // Try restoring draft answers from sessionStorage for this student + lkm
    const draftKey = `lkm_draft_${student.nis}_${lkm.id}`;
    const savedDraft = sessionStorage.getItem(draftKey);
    if (savedDraft) {
      try {
        setAnswers(JSON.parse(savedDraft));
      } catch (e) {
        console.warn('Failed restoring draft', e);
      }
    }
  }, [student.nis, lkm.id]);

  // Timer interval
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Save draft answers to sessionStorage
  const handleSelectAnswer = (questionId: string, answerVal: string) => {
    const updated = { ...answers, [questionId]: answerVal };
    setAnswers(updated);
    const draftKey = `lkm_draft_${student.nis}_${lkm.id}`;
    sessionStorage.setItem(draftKey, JSON.stringify(updated));
  };

  const answeredCount = questions.filter((q) => answers[q.id] && answers[q.id].trim() !== '').length;
  const totalCount = questions.length;
  const progressPct = totalCount > 0 ? Math.round((answeredCount / totalCount) * 100) : 0;
  const unansweredCount = totalCount - answeredCount;

  const currentQuestion = questions[currentIndex];

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleInitiateSubmit = () => {
    if (unansweredCount > 0) {
      setShowUnansweredWarning(true);
    } else {
      setShowFinalConfirmation(true);
    }
  };

  const handleFinalSubmit = async () => {
    setShowFinalConfirmation(false);
    setShowUnansweredWarning(false);
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const result = await LkmService.submitAnswers({
        namaMurid: student.nama,
        kelas: student.kelas,
        nis: student.nis,
        lkmId: lkm.id,
        materi: lkm.materi,
        answers
      });

      // Clear draft on successful submission
      const draftKey = `lkm_draft_${student.nis}_${lkm.id}`;
      sessionStorage.removeItem(draftKey);

      onSubmitted(result);
    } catch (err: any) {
      setSubmitError(err.message || 'Terjadi kesalahan saat mengumpulkan jawaban. Silakan coba kembali.');
      setIsSubmitting(false);
    }
  };

  if (questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center bg-white rounded-3xl p-8 border border-slate-200">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-slate-800">Soal Belum Tersedia</h3>
        <p className="text-sm text-slate-500 mt-2">
          Soal untuk LKM ini belum tersedia di Google Spreadsheet atau sedang disiapkan oleh guru pengampu.
        </p>
        <button
          onClick={onCancel}
          className="mt-6 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700"
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-6 space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-100 text-blue-800">
              {lkm.fase} • Kelas {student.kelas}
            </span>
            <span className="text-xs text-slate-500">
              NIS: {student.nis}
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
            {lkm.judul}
          </h1>
          <p className="text-xs text-slate-600 font-medium">
            Murid: <span className="font-bold text-blue-700">{student.nama}</span>
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-mono text-sm font-bold border border-slate-200">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>{formatTimer(secondsElapsed)}</span>
          </div>

          <button
            onClick={handleInitiateSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-500/20 inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>Kumpulkan Jawaban</span>
          </button>
        </div>
      </div>

      {/* Progress Bar Component */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <span>PROGRES PENGERJAAN</span>
          <span className="text-blue-700">
            {answeredCount} dari {totalCount} soal telah dijawab ({progressPct}%)
          </span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-300 rounded-full"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Main Question Card - Mobile Optimized */}
      {currentQuestion && (
        <div className="bg-white rounded-3xl p-4 sm:p-8 border border-slate-200 shadow-md space-y-4 sm:space-y-6">
          {/* Question Metadata */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 sm:pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center text-xs sm:text-sm shadow-sm shadow-blue-500/20">
                {currentIndex + 1}
              </span>
              <span className="font-bold text-slate-700 text-xs sm:text-sm">
                Soal {currentIndex + 1} dari {totalCount}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Indikator: {currentQuestion.indikator}
              </span>
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-600">
                Bobot: {currentQuestion.bobot} Poin
              </span>
            </div>
          </div>

          {/* Question Text */}
          <div className="text-slate-900 text-base sm:text-lg font-medium leading-relaxed">
            {currentQuestion.pertanyaan}
          </div>

          {/* Answer Options Rendered Based on Type */}
          <div className="space-y-3 pt-2">
            {/* Type: Pilihan Ganda */}
            {currentQuestion.tipe === 'Pilihan Ganda' && (
              <div className="space-y-3">
                {[
                  { key: 'A', text: currentQuestion.opsiA },
                  { key: 'B', text: currentQuestion.opsiB },
                  { key: 'C', text: currentQuestion.opsiC },
                  { key: 'D', text: currentQuestion.opsiD },
                  currentQuestion.opsiE ? { key: 'E', text: currentQuestion.opsiE } : null
                ]
                  .filter((item): item is { key: string; text: string } => Boolean(item && item.text))
                  .map((opt) => {
                    const isSelected = answers[currentQuestion.id] === opt.key;
                    return (
                      <div
                        key={opt.key}
                        onClick={() => handleSelectAnswer(currentQuestion.id, opt.key)}
                        className={`p-4 rounded-2xl border-2 transition-all flex items-start gap-3.5 cursor-pointer select-none ${
                          isSelected
                            ? 'bg-blue-50/80 border-blue-600 shadow-sm shadow-blue-500/10'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                            isSelected
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 text-slate-700 border border-slate-300'
                          }`}
                        >
                          {opt.key}
                        </div>
                        <div className={`text-sm sm:text-base leading-relaxed ${
                          isSelected ? 'font-bold text-blue-950' : 'text-slate-800'
                        }`}>
                          {opt.text}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}

            {/* Type: Benar Salah */}
            {currentQuestion.tipe === 'Benar Salah' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {['Benar', 'Salah'].map((val) => {
                  const isSelected = answers[currentQuestion.id]?.toUpperCase() === val.toUpperCase();
                  return (
                    <div
                      key={val}
                      onClick={() => handleSelectAnswer(currentQuestion.id, val)}
                      className={`p-5 rounded-2xl border-2 transition-all text-center cursor-pointer select-none ${
                        isSelected
                          ? val === 'Benar'
                            ? 'bg-emerald-50 border-emerald-600 shadow-sm'
                            : 'bg-rose-50 border-rose-600 shadow-sm'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className={`text-lg font-black ${
                        isSelected
                          ? val === 'Benar' ? 'text-emerald-700' : 'text-rose-700'
                          : 'text-slate-800'
                      }`}>
                        {val.toUpperCase()}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Type: Isian Singkat */}
            {currentQuestion.tipe === 'Isian Singkat' && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-600">
                  Tuliskan jawaban singkat Anda:
                </label>
                <input
                  type="text"
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleSelectAnswer(currentQuestion.id, e.target.value)}
                  placeholder="Ketik jawaban di sini..."
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-blue-600 focus:outline-none text-slate-900 font-medium"
                />
              </div>
            )}

            {/* Type: Uraian */}
            {currentQuestion.tipe === 'Uraian' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold text-slate-600">
                    Tuliskan uraian analisis Anda:
                  </label>
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-semibold">
                    Menunggu Penilaian Guru
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleSelectAnswer(currentQuestion.id, e.target.value)}
                  placeholder="Ketik uraian jawaban secara sistematis dan jelas..."
                  className="w-full p-4 rounded-2xl border-2 border-slate-200 focus:border-blue-600 focus:outline-none text-slate-900 font-medium"
                />
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="px-3.5 sm:px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs sm:text-sm hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>SEBELUMNYA</span>
            </button>

            <span className="text-xs text-slate-400 hidden sm:inline">
              Jawaban otomatis tersimpan
            </span>

            {currentIndex < totalCount - 1 ? (
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(totalCount - 1, prev + 1))}
                className="px-4 sm:px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs sm:text-sm hover:bg-blue-700 shadow-md shadow-blue-500/20 inline-flex items-center gap-1 cursor-pointer"
              >
                <span>SELANJUTNYA</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleInitiateSubmit}
                className="px-4 sm:px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs sm:text-sm hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-500/20 inline-flex items-center gap-1 cursor-pointer"
              >
                <span>KUMPULKAN</span>
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Interactive Question Palette / Grid */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">NAVIGASI NOMOR SOAL</span>
          <div className="flex items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-emerald-500" /> Sudah Dijawab
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-slate-200 border border-slate-300" /> Belum
            </span>
          </div>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {questions.map((q, idx) => {
            const hasAnswer = answers[q.id] && answers[q.id].trim() !== '';
            const isCurrent = idx === currentIndex;

            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`h-11 rounded-xl text-sm font-bold transition-all relative flex items-center justify-center cursor-pointer ${
                  isCurrent
                    ? 'ring-2 ring-blue-600 ring-offset-2'
                    : ''
                } ${
                  hasAnswer
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* MODAL 1: Unanswered Questions Warning */}
      {showUnansweredWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">
                Periksa Kembali Jawaban Anda
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Masih terdapat <strong className="text-amber-700">{unansweredCount} soal</strong> yang belum Anda jawab dari total {totalCount} soal.
              </p>
              <p className="text-xs text-slate-500 mt-2">
                Apakah Anda ingin memeriksa kembali butir soal yang belum dijawab, atau tetap mengumpulkan sekarang?
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
              <button
                onClick={() => setShowUnansweredWarning(false)}
                className="w-full sm:w-1/2 px-4 py-2.5 rounded-xl border-2 border-slate-200 font-bold text-sm text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                PERIKSA KEMBALI
              </button>
              <button
                onClick={() => {
                  setShowUnansweredWarning(false);
                  setShowFinalConfirmation(true);
                }}
                className="w-full sm:w-1/2 px-4 py-2.5 rounded-xl bg-amber-600 text-white font-bold text-sm hover:bg-amber-700 shadow-md shadow-amber-500/20 cursor-pointer"
              >
                TETAP KUMPULKAN
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Final Confirmation */}
      {showFinalConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <HelpCircle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">
                Konfirmasi Pengumpulan Jawaban
              </h3>
              <p className="text-sm text-slate-600 mt-2">
                Apakah Anda yakin ingin mengumpulkan jawaban? Jawaban yang telah dikumpulkan tidak dapat diubah kembali.
              </p>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 mt-3 text-xs text-slate-700 space-y-1">
                <p>• Nama: <strong>{student.nama}</strong> ({student.kelas})</p>
                <p>• Materi: <strong>{lkm.materi}</strong></p>
                <p>• Soal Dijawab: <strong>{answeredCount} / {totalCount}</strong></p>
              </div>
            </div>

            {submitError && (
              <p className="text-xs text-rose-600 font-semibold">{submitError}</p>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
              <button
                onClick={() => setShowFinalConfirmation(false)}
                disabled={isSubmitting}
                className="w-full sm:w-1/2 px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-sm text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="w-full sm:w-1/2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-extrabold text-sm hover:from-blue-700 hover:to-emerald-700 shadow-md shadow-blue-500/20 inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Menyimpan ke Spreadsheet...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Ya, Kumpulkan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
