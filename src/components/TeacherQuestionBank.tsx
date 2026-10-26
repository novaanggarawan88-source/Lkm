import React, { useState } from 'react';
import {
  BookOpen,
  HelpCircle,
  CheckCircle2,
  Filter,
  Tag,
  Key,
  Award
} from 'lucide-react';
import { LkmService } from '../services/lkmService';
import { Question } from '../types/lkm';

export const TeacherQuestionBank: React.FC = () => {
  const [selectedLkm, setSelectedLkm] = useState<string>('LKM-KBG-01');
  const allQuestions: Question[] = LkmService.getAllQuestions();

  const filtered = allQuestions.filter((q) => q.lkmId === selectedLkm);

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Bank Soal & Indikator PJOK
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Data butir pertanyaan, indikator pencapaian, kunci jawaban, dan pembahasan dari Sheet BANK_SOAL
          </p>
        </div>

        <div>
          <select
            value={selectedLkm}
            onChange={(e) => setSelectedLkm(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 font-bold focus:border-blue-600 focus:outline-none bg-white cursor-pointer"
          >
            <option value="LKM-KBG-01">LKM 1: Kebugaran Jasmani (20 Soal)</option>
            <option value="LKM-VOL-02">LKM 2: Permainan Bola Voli (10 Soal)</option>
            <option value="LKM-SNM-03">LKM 3: Senam Lantai (8 Soal)</option>
          </select>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filtered.map((q, idx) => (
          <div
            key={q.id}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center text-xs">
                  {idx + 1}
                </span>
                <span className="text-xs font-bold text-slate-500">ID: {q.id}</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  {q.tipe}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-0.5 rounded-full font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Indikator: {q.indikator}
                </span>
                <span className="px-2 py-0.5 rounded-md font-bold bg-slate-100 text-slate-700">
                  Bobot: {q.bobot}
                </span>
              </div>
            </div>

            <p className="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed">
              {q.pertanyaan}
            </p>

            {/* Options display */}
            {q.tipe === 'Pilihan Ganda' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {[
                  { k: 'A', t: q.opsiA },
                  { k: 'B', t: q.opsiB },
                  { k: 'C', t: q.opsiC },
                  { k: 'D', t: q.opsiD },
                  { k: 'E', t: q.opsiE }
                ]
                  .filter((o) => Boolean(o.t))
                  .map((opt) => (
                    <div
                      key={opt.k}
                      className={`p-3 rounded-xl border flex items-start gap-2 ${
                        q.kunci === opt.k
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${
                        q.kunci === opt.k ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {opt.k}
                      </span>
                      <span>{opt.t}</span>
                    </div>
                  ))}
              </div>
            )}

            {/* Answer Key & Explanation */}
            <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200">
                <div className="flex items-center gap-1.5 text-blue-900 font-bold mb-1">
                  <Key className="w-3.5 h-3.5 text-blue-600" />
                  <span>Kunci Jawaban: {q.kunci}</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  <strong>Pembahasan:</strong> {q.pembahasan || '-'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200">
                <div className="flex items-center gap-1.5 text-amber-900 font-bold mb-1">
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  <span>Saran Belajar jika Salah:</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {q.saranBelajar || '-'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
