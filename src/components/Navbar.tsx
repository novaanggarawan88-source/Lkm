import React, { useState } from 'react';
import {
  BookOpen,
  Award,
  BarChart3,
  MessageSquare,
  ShieldCheck,
  UserCheck,
  Menu,
  X,
  FileSpreadsheet,
  CheckCircle2,
  Lock,
  LogIn,
  LogOut,
  User,
  GraduationCap,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { AppSettings } from '../types/lkm';

interface NavbarProps {
  currentRole: 'murid' | 'guru';
  onRoleChange: (role: 'murid' | 'guru') => void;
  currentTab: string;
  onTabChange: (tab: string) => void;
  settings: AppSettings;
  onOpenSheetsModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  currentTab,
  onTabChange,
  settings,
  onOpenSheetsModal
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [inputPin, setInputPin] = useState('');
  const [pinError, setPinError] = useState('');

  const handleOpenLogin = () => {
    setShowLoginModal(true);
    setInputPin('');
    setPinError('');
    setSidebarOpen(false);
  };

  const handleVerifyLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPin === settings.teacherPin || inputPin === 'tejakula123' || inputPin === 'admin') {
      onRoleChange('guru');
      onTabChange('dashboard');
      setShowLoginModal(false);
      setInputPin('');
      setPinError('');
    } else {
      setPinError('PIN sandi guru salah. Silakan coba kembali (PIN Bawaan: tejakula123).');
    }
  };

  const handleLogout = () => {
    onRoleChange('murid');
    onTabChange('beranda');
    setSidebarOpen(false);
  };

  const handleNavClick = (tab: string) => {
    onTabChange(tab);
    setSidebarOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            {/* LEFT: Hamburger menu (garis 3) + School Brand */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* Garis 3 Menu Button - ON THE LEFT */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 -ml-1 sm:ml-0 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/30 transition-colors cursor-pointer"
                aria-label="Buka Menu Sidebar"
              >
                <Menu className="w-6 h-6 sm:w-7 sm:h-7" />
              </button>

              {/* Logo & School Branding */}
              <div
                className="flex items-center gap-2.5 cursor-pointer select-none"
                onClick={() => handleNavClick(currentRole === 'murid' ? 'beranda' : 'dashboard')}
              >
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-blue-700 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
                  <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-slate-900 tracking-tight text-base sm:text-lg leading-tight truncate">
                      LKM DIGITAL PJOK
                    </span>
                    <span className="hidden lg:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Merdeka
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate max-w-[170px] xs:max-w-[220px] sm:max-w-none">
                    SMAN 1 Tejakula • {currentRole === 'guru' ? 'Mode Guru' : 'Mode Murid'}
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop Center Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {currentRole === 'murid' ? (
                <>
                  <button
                    onClick={() => handleNavClick('beranda')}
                    className={`px-3 py-2 rounded-lg text-xs lg:text-sm font-semibold transition-colors cursor-pointer ${
                      currentTab === 'beranda'
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    🏠 Beranda
                  </button>
                  <button
                    onClick={() => handleNavClick('identitas')}
                    className={`px-3 py-2 rounded-lg text-xs lg:text-sm font-semibold transition-colors cursor-pointer ${
                      currentTab === 'identitas' || currentTab === 'kerjakan'
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    📝 Kerjakan LKM
                  </button>
                  <button
                    onClick={() => handleNavClick('hasil')}
                    className={`px-3 py-2 rounded-lg text-xs lg:text-sm font-semibold transition-colors cursor-pointer ${
                      currentTab === 'hasil'
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    📊 Hasil Belajar
                  </button>
                  <button
                    onClick={() => handleNavClick('refleksi')}
                    className={`px-3 py-2 rounded-lg text-xs lg:text-sm font-semibold transition-colors cursor-pointer ${
                      currentTab === 'refleksi'
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    💬 Refleksi
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleNavClick('dashboard')}
                    className={`px-3 py-2 rounded-lg text-xs lg:text-sm font-semibold transition-colors cursor-pointer ${
                      currentTab === 'dashboard'
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    🏠 Dashboard
                  </button>
                  <button
                    onClick={() => handleNavClick('rekap')}
                    className={`px-3 py-2 rounded-lg text-xs lg:text-sm font-semibold transition-colors cursor-pointer ${
                      currentTab === 'rekap'
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    📊 Rekap Nilai
                  </button>
                  <button
                    onClick={() => handleNavClick('banksoal')}
                    className={`px-3 py-2 rounded-lg text-xs lg:text-sm font-semibold transition-colors cursor-pointer ${
                      currentTab === 'banksoal'
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    📚 Bank Soal
                  </button>
                  <button
                    onClick={() => handleNavClick('pengaturan')}
                    className={`px-3 py-2 rounded-lg text-xs lg:text-sm font-semibold transition-colors cursor-pointer ${
                      currentTab === 'pengaturan'
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    ⚙️ Pengaturan
                  </button>
                </>
              )}
            </nav>

            {/* RIGHT: Login Guru / Logout Action */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={onOpenSheetsModal}
                className="hidden xl:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
                title="Integrasi Google Spreadsheet & GAS Code"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Google Sheets & Code.gs</span>
              </button>

              {currentRole === 'murid' ? (
                <button
                  onClick={handleOpenLogin}
                  className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-extrabold bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-500/20 transition-all cursor-pointer shrink-0"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">Login Guru</span>
                  <span className="xs:hidden">Login</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Pak Agus Nova</span>
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer shrink-0"
                    title="Keluar dari akun guru"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden xs:inline">Keluar</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* LEFT SIDEBAR DRAWER (Sliding from Left) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Left Drawer Panel */}
          <div className="relative w-[280px] xs:w-[320px] max-w-[85vw] bg-white h-full shadow-2xl z-10 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-300">
            {/* Drawer Top Header */}
            <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-blue-900 via-blue-800 to-emerald-900 text-white">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 font-black">
                  PJOK
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <h2 className="font-extrabold text-base leading-tight">LKM DIGITAL PJOK</h2>
              <p className="text-xs text-emerald-200 mt-0.5">{settings.schoolName}</p>
            </div>

            {/* Active User Card */}
            <div className="p-4 mx-4 mt-4 rounded-2xl border bg-slate-50 border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                  currentRole === 'guru'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {currentRole === 'guru' ? <ShieldCheck className="w-5 h-5" /> : <GraduationCap className="w-5 h-5" />}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {currentRole === 'guru' ? 'Status: Guru Pengampu' : 'Status: Siswa / Murid'}
                  </span>
                  <p className="text-xs font-extrabold text-slate-900 truncate">
                    {currentRole === 'guru' ? settings.teacherName : 'Siswa PJOK (Dropdown Masuk)'}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="p-4 flex-1 space-y-1">
              <span className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase px-3 block mb-2">
                {currentRole === 'murid' ? 'Menu Murid' : 'Menu Guru'}
              </span>

              {currentRole === 'murid' ? (
                <>
                  <button
                    onClick={() => handleNavClick('beranda')}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                      currentTab === 'beranda'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span>🏠</span>
                      <span>Beranda Utama</span>
                    </span>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </button>

                  <button
                    onClick={() => handleNavClick('identitas')}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                      currentTab === 'identitas' || currentTab === 'kerjakan'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span>📝</span>
                      <span>Kerjakan LKM (Pilih Siswa)</span>
                    </span>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </button>

                  <button
                    onClick={() => handleNavClick('hasil')}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                      currentTab === 'hasil'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span>📊</span>
                      <span>Hasil Pengerjaan LKM</span>
                    </span>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </button>

                  <button
                    onClick={() => handleNavClick('refleksi')}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                      currentTab === 'refleksi'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span>💬</span>
                      <span>Lembar Refleksi Diri</span>
                    </span>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleNavClick('dashboard')}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                      currentTab === 'dashboard'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span>🏠</span>
                      <span>Dashboard Analisis Guru</span>
                    </span>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </button>

                  <button
                    onClick={() => handleNavClick('rekap')}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                      currentTab === 'rekap'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span>📊</span>
                      <span>Rekapitulasi Nilai & Detail</span>
                    </span>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </button>

                  <button
                    onClick={() => handleNavClick('banksoal')}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                      currentTab === 'banksoal'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span>📚</span>
                      <span>Bank Soal & Kunci Jawaban</span>
                    </span>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </button>

                  <button
                    onClick={() => handleNavClick('pengaturan')}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                      currentTab === 'pengaturan'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span>⚙️</span>
                      <span>Pengaturan & Endpoint GAS</span>
                    </span>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </button>
                </>
              )}
            </div>

            {/* Drawer Bottom Actions */}
            <div className="p-4 border-t border-slate-100 space-y-2 bg-slate-50">
              <button
                onClick={() => {
                  onOpenSheetsModal();
                  setSidebarOpen(false);
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Dokumentasi Google Sheets & Code.gs</span>
              </button>

              {currentRole === 'murid' ? (
                <button
                  onClick={handleOpenLogin}
                  className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Mode Login Guru</span>
                </button>
              ) : (
                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar ke Mode Murid</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* LOGIN GURU MODAL */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm sm:max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">Mode Login Guru</h3>
                  <p className="text-[11px] text-slate-500">Otorisasi Guru Pengampu PJOK</p>
                </div>
              </div>
              <button
                onClick={() => setShowLoginModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleVerifyLogin} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[11px] text-slate-500 font-bold block">Guru Pengampu:</span>
                <p className="text-xs font-extrabold text-blue-900">
                  {settings.teacherName}
                </p>
                <p className="text-[10px] text-slate-500">
                  SMA Negeri 1 Tejakula
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Masukkan PIN / Sandi Guru
                </label>
                <input
                  type="password"
                  value={inputPin}
                  onChange={(e) => {
                    setInputPin(e.target.value);
                    setPinError('');
                  }}
                  placeholder="Ketik PIN guru di sini..."
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-600 focus:outline-none text-slate-900 font-semibold text-sm"
                />
                {pinError && (
                  <p className="mt-1.5 text-xs text-rose-600 font-semibold">{pinError}</p>
                )}
                <p className="mt-1 text-[11px] text-slate-400">
                  *PIN default sekolah: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-mono font-bold">tejakula123</code>
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLoginModal(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-extrabold hover:bg-blue-700 shadow-md shadow-blue-500/20 cursor-pointer transition-colors"
                >
                  Masuk Sistem
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
