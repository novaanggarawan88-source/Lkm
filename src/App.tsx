/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { StudentHome } from './components/StudentHome';
import { StudentIdentity } from './components/StudentIdentity';
import { LkmWorksheet } from './components/LkmWorksheet';
import { LkmResult } from './components/LkmResult';
import { StudentReflection } from './components/StudentReflection';
import { TeacherDashboard } from './components/TeacherDashboard';
import { TeacherRecap } from './components/TeacherRecap';
import { TeacherQuestionBank } from './components/TeacherQuestionBank';
import { TeacherSettings } from './components/TeacherSettings';
import { GoogleSheetsIntegrationModal } from './components/GoogleSheetsIntegrationModal';
import { Student, LkmInfo, SubmissionResult, AppSettings } from './types/lkm';
import { LkmService } from './services/lkmService';
import { BookOpen, FileSpreadsheet, Heart } from 'lucide-react';

export default function App() {
  const [role, setRole] = useState<'murid' | 'guru'>('murid');
  const [tab, setTab] = useState<string>('beranda');

  // Active student session state
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedLkm, setSelectedLkm] = useState<LkmInfo | null>(null);
  const [preselectedLkmId, setPreselectedLkmId] = useState<string>('LKM-KBG-01');
  const [currentSubmission, setCurrentSubmission] = useState<SubmissionResult | null>(null);

  // App settings & LKMs
  const [settings, setSettings] = useState<AppSettings>(LkmService.getSettings());
  const [lkms, setLkms] = useState<LkmInfo[]>(LkmService.getLkms());

  // Modal
  const [isSheetsModalOpen, setIsSheetsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    // If there is any recent submission in local storage, set as default for quick preview
    const subs = LkmService.getSubmissions();
    if (subs.length > 0 && !currentSubmission) {
      setCurrentSubmission(subs[0]);
    }
  }, []);

  const handleStartLkm = (lkmId?: string) => {
    if (lkmId) {
      setPreselectedLkmId(lkmId);
    }
    setTab('identitas');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToWorksheet = (student: Student, lkm: LkmInfo) => {
    setSelectedStudent(student);
    setSelectedLkm(lkm);
    setTab('kerjakan');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitted = (result: SubmissionResult) => {
    setCurrentSubmission(result);
    setTab('hasil');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToReflection = () => {
    setTab('refleksi');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinishedReflection = () => {
    setTab('beranda');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewPreviousResult = (sub: SubmissionResult) => {
    setCurrentSubmission(sub);
    setTab('hasil');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Navigation Header */}
      <Navbar
        currentRole={role}
        onRoleChange={setRole}
        currentTab={tab}
        onTabChange={(t) => {
          setTab(t);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        settings={settings}
        onOpenSheetsModal={() => setIsSheetsModalOpen(true)}
      />

      {/* Main Container - Optimized for mobile phone screens */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-2.5 xs:px-3 sm:px-6 lg:px-8 pt-3 sm:pt-6 pb-12">
        {/* STUDENT VIEWS */}
        {role === 'murid' && (
          <>
            {tab === 'beranda' && (
              <StudentHome
                onStartLkm={handleStartLkm}
                lkms={lkms}
                settings={settings}
              />
            )}

            {tab === 'identitas' && (
              <StudentIdentity
                initialLkmId={preselectedLkmId}
                onProceedToWorksheet={handleProceedToWorksheet}
                onViewPreviousResult={handleViewPreviousResult}
              />
            )}

            {tab === 'kerjakan' && selectedStudent && selectedLkm && (
              <LkmWorksheet
                student={selectedStudent}
                lkm={selectedLkm}
                onSubmitted={handleSubmitted}
                onCancel={() => setTab('beranda')}
              />
            )}

            {tab === 'hasil' && (
              currentSubmission ? (
                <LkmResult
                  result={currentSubmission}
                  onGoToReflection={handleGoToReflection}
                  onRetakeLkm={() => setTab('identitas')}
                  allowRetake={selectedLkm?.izinkanUlang || settings.allowRetakeByDefault}
                />
              ) : (
                <div className="max-w-md mx-auto py-16 text-center space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Belum Ada Hasil Pengerjaan</h3>
                  <p className="text-xs text-slate-500">
                    Anda belum menyelesaikan LKM pada sesi ini. Silakan mulai pengerjaan LKM terlebih dahulu.
                  </p>
                  <button
                    onClick={() => handleStartLkm()}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 cursor-pointer"
                  >
                    Mulai Kerjakan LKM
                  </button>
                </div>
              )
            )}

            {tab === 'refleksi' && (
              <StudentReflection
                submission={currentSubmission}
                onFinished={handleFinishedReflection}
              />
            )}
          </>
        )}

        {/* TEACHER VIEWS */}
        {role === 'guru' && (
          <>
            {tab === 'dashboard' && (
              <TeacherDashboard
                settings={settings}
                onOpenSheetsModal={() => setIsSheetsModalOpen(true)}
                onViewRecap={() => setTab('rekap')}
              />
            )}

            {tab === 'rekap' && <TeacherRecap />}

            {tab === 'banksoal' && <TeacherQuestionBank />}

            {tab === 'pengaturan' && (
              <TeacherSettings
                settings={settings}
                onUpdateSettings={(newS) => setSettings(newS)}
                onOpenSheetsModal={() => setIsSheetsModalOpen(true)}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-700 to-emerald-600 flex items-center justify-center text-white font-black text-xs">
              PJOK
            </div>
            <div>
              <p className="font-extrabold text-slate-800">
                LKM DIGITAL PJOK • SMA NEGERI 1 TEJAKULA
              </p>
              <p className="text-[11px] text-slate-400">
                Guru Pengampu: {settings.teacherName} • Single Source of Truth: Google Spreadsheet
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <button
              onClick={() => setIsSheetsModalOpen(true)}
              className="text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1 cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Panduan Spreadsheet & Code.gs</span>
            </button>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500">
              Belajar Aktif, Berpikir Kritis, dan Refleksi Diri
            </span>
          </div>
        </div>
      </footer>

      {/* Global Google Spreadsheet & Code.gs Documentation Modal */}
      <GoogleSheetsIntegrationModal
        isOpen={isSheetsModalOpen}
        onClose={() => setIsSheetsModalOpen(false)}
      />
    </div>
  );
}
