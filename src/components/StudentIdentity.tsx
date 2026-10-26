import React, { useState, useEffect } from 'react';
import {
  User,
  Users,
  BookOpen,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { Student, LkmInfo, SubmissionResult } from '../types/lkm';
import { LkmService } from '../services/lkmService';

interface StudentIdentityProps {
  initialLkmId?: string;
  onProceedToWorksheet: (selectedStudent: Student, selectedLkm: LkmInfo) => void;
  onViewPreviousResult: (submission: SubmissionResult) => void;
}

export const StudentIdentity: React.FC<StudentIdentityProps> = ({
  initialLkmId,
  onProceedToWorksheet,
  onViewPreviousResult
}) => {
  const [classes, setClasses] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('XI 1');
  const [studentsInClass, setStudentsInClass] = useState<Student[]>([]);
  const [selectedStudentNis, setSelectedStudentNis] = useState<string>('');
  const [lkms, setLkms] = useState<LkmInfo[]>([]);
  const [selectedLkmId, setSelectedLkmId] = useState<string>(initialLkmId || 'LKM-KBG-01');

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [existingSubmission, setExistingSubmission] = useState<SubmissionResult | null>(null);

  // Load initial data from service
  useEffect(() => {
    const cls = LkmService.getClasses();
    setClasses(cls);
    const lkmList = LkmService.getLkms().filter((l) => l.statusAktif);
    setLkms(lkmList);

    if (cls.length > 0) {
      const defaultCls = cls.includes('XI 1') ? 'XI 1' : cls[0];
      setSelectedClass(defaultCls);
    }
  }, []);

  // Update students when class changes
  useEffect(() => {
    if (selectedClass) {
      const list = LkmService.getStudentsByClass(selectedClass);
      setStudentsInClass(list);
      if (list.length > 0) {
        setSelectedStudentNis(list[0].nis);
      } else {
        setSelectedStudentNis('');
      }
    }
  }, [selectedClass]);

  // Check if student already completed this LKM
  useEffect(() => {
    if (selectedStudentNis && selectedClass && selectedLkmId) {
      const currentStudent = studentsInClass.find((s) => s.nis === selectedStudentNis);
      if (currentStudent) {
        const check = LkmService.checkExistingSubmission(currentStudent.nama, selectedClass, selectedLkmId);
        if (check.alreadySubmitted && check.submission) {
          setExistingSubmission(check.submission);
        } else {
          setExistingSubmission(null);
        }
      }
    }
  }, [selectedStudentNis, selectedClass, selectedLkmId, studentsInClass]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!selectedClass) {
      setErrorMessage('Silakan pilih kelas terlebih dahulu.');
      return;
    }

    if (!selectedStudentNis) {
      setErrorMessage('Silakan pilih nama murid.');
      return;
    }

    if (!selectedLkmId) {
      setErrorMessage('Silakan pilih LKM yang akan dikerjakan.');
      return;
    }

    const student = studentsInClass.find((s) => s.nis === selectedStudentNis);
    const lkm = lkms.find((l) => l.id === selectedLkmId);

    if (!student || !lkm) {
      setErrorMessage('Data identitas atau LKM tidak valid.');
      return;
    }

    // Check duplicate
    if (existingSubmission && !lkm.izinkanUlang) {
      setErrorMessage('Anda sudah menyelesaikan LKM ini. Pengulangan pengerjaan tidak diizinkan oleh guru.');
      return;
    }

    onProceedToWorksheet(student, lkm);
  };

  const currentSelectedStudent = studentsInClass.find((s) => s.nis === selectedStudentNis);
  const currentSelectedLkm = lkms.find((l) => l.id === selectedLkmId);

  return (
    <div className="max-w-3xl mx-auto py-2 sm:py-6">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header - Mobile Optimized */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-emerald-700 px-4 sm:px-8 py-6 sm:py-8 text-white relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-emerald-300 mb-2.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Akses Siswa via Dropdown</span>
          </div>
          <h2 className="text-xl xs:text-2xl sm:text-3xl font-extrabold tracking-tight">
            PILIH IDENTITAS SISWA
          </h2>
          <p className="text-xs sm:text-sm text-blue-100/90 mt-1 max-w-xl leading-relaxed">
            Siswa masuk dengan memilih kelas dan nama dari daftar resmi Google Spreadsheet SMA Negeri 1 Tejakula.
          </p>
        </div>

        {/* Form Body - Mobile Friendly Padding */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-8 space-y-5 sm:space-y-6">
          {/* Error notification */}
          {errorMessage && (
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
              <div>
                <p className="font-bold">Perhatian</p>
                <p>{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Already submitted warning card */}
          {existingSubmission && (
            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900">
              <div className="flex items-start gap-3">
                <FileCheck className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-bold text-sm">Anda Sudah Mengerjakan LKM Ini</h4>
                  <p className="text-xs text-amber-800 mt-1">
                    LKM <strong>{existingSubmission.materi}</strong> telah dikumpulkan pada{' '}
                    <strong>{existingSubmission.tanggal} {existingSubmission.waktu}</strong> dengan nilai akhir{' '}
                    <span className="font-extrabold text-blue-800 bg-white px-2 py-0.5 rounded-md border border-amber-300">
                      {existingSubmission.nilaiAkhir} ({existingSubmission.kategori})
                    </span>.
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onViewPreviousResult(existingSubmission)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 text-white hover:bg-amber-700 transition-colors cursor-pointer"
                    >
                      LIHAT HASIL SAYA
                    </button>
                    {currentSelectedLkm?.izinkanUlang && (
                      <span className="text-xs text-amber-700 italic">
                        *Guru mengizinkan pengerjaan ulang (remedial/pengayaan).
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Select Kelas */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>1. Pilih Kelas</span>
            </label>
            <div className="relative">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl border-2 border-slate-200 bg-white text-slate-900 font-semibold focus:border-blue-600 focus:outline-none appearance-none cursor-pointer"
              >
                <option value="">-- Pilih Kelas Anda --</option>
                {classes.map((c) => (
                  <option key={c} value={c}>
                    Kelas {c}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400">
                ▼
              </div>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Data kelas disinkronkan otomatis dari Google Spreadsheet.
            </p>
          </div>

          {/* Select Nama Murid */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              <span>2. Pilih Nama Murid</span>
            </label>
            <div className="relative">
              <select
                value={selectedStudentNis}
                onChange={(e) => setSelectedStudentNis(e.target.value)}
                disabled={!selectedClass || studentsInClass.length === 0}
                className="w-full px-4 py-3.5 rounded-2xl border-2 border-slate-200 bg-white text-slate-900 font-semibold focus:border-blue-600 focus:outline-none appearance-none disabled:bg-slate-100 disabled:cursor-not-allowed cursor-pointer"
              >
                <option value="">-- Pilih Nama Sesuai Absen --</option>
                {studentsInClass.map((s) => (
                  <option key={s.nis} value={s.nis}>
                    {s.nama} ({s.nis})
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400">
                ▼
              </div>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              *Nama murid dipilih dari data resmi sekolah, tidak dapat diketik bebas demi akurasi rekap nilai.
            </p>
          </div>

          {/* Select Materi / LKM */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>3. Pilih Materi / LKM</span>
            </label>
            <div className="relative">
              <select
                value={selectedLkmId}
                onChange={(e) => setSelectedLkmId(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl border-2 border-slate-200 bg-white text-slate-900 font-semibold focus:border-emerald-600 focus:outline-none appearance-none cursor-pointer"
              >
                <option value="">-- Pilih Lembar Kerja Murid --</option>
                {lkms.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.judul} ({l.totalSoal} Soal - {l.durasiMenit} Menit)
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400">
                ▼
              </div>
            </div>
          </div>

          {/* Preview of selected LKM details */}
          {currentSelectedLkm && (
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-700">
                <span className="font-bold text-slate-900">{currentSelectedLkm.judul}</span>
                <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
                  {currentSelectedLkm.fase}
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                <strong>Tujuan:</strong> {currentSelectedLkm.tujuanPembelajaran}
              </p>
              <div className="flex items-center gap-4 text-slate-500 pt-1">
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  {currentSelectedLkm.durasiMenit} Menit Waktu Pengerjaan
                </span>
                <span>•</span>
                <span>{currentSelectedLkm.totalSoal} Butir Soal Evaluasi</span>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-100">
            <div className="text-xs text-slate-500">
              Pastikan identitas yang dipilih sudah benar sebelum menekan tombol mulai.
            </div>

            <button
              type="submit"
              disabled={Boolean(existingSubmission && !currentSelectedLkm?.izinkanUlang)}
              className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-extrabold text-sm sm:text-base hover:from-blue-700 hover:to-emerald-700 shadow-lg shadow-blue-500/25 inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all"
            >
              <span>MULAI MENGERJAKAN LKM</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
