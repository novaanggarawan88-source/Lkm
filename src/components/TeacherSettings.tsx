import React, { useState } from 'react';
import {
  Settings,
  FileSpreadsheet,
  Link,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Save,
  RotateCcw,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { AppSettings } from '../types/lkm';
import { LkmService } from '../services/lkmService';

interface TeacherSettingsProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onOpenSheetsModal: () => void;
}

export const TeacherSettings: React.FC<TeacherSettingsProps> = ({
  settings,
  onUpdateSettings,
  onOpenSheetsModal
}) => {
  const [formData, setFormData] = useState<AppSettings>(settings);
  const [testStatus, setTestStatus] = useState<{ testing: boolean; success?: boolean; message?: string }>({
    testing: false
  });
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const handleTestConnection = async () => {
    if (!formData.gasWebAppUrl) {
      setTestStatus({
        testing: false,
        success: false,
        message: 'Masukkan URL Google Apps Script Web App terlebih dahulu.'
      });
      return;
    }

    setTestStatus({ testing: true });
    try {
      const url = `${formData.gasWebAppUrl}?action=getInitialData`;
      const res = await fetch(url, { method: 'GET' });
      const data = await res.json();
      if (data.success) {
        setTestStatus({
          testing: false,
          success: true,
          message: `Koneksi Berhasil! Terhubung ke spreadsheet (${data.data?.students?.length || 0} murid, ${data.data?.lkms?.length || 0} LKM).`
        });
      } else {
        setTestStatus({
          testing: false,
          success: false,
          message: data.error || 'Server Apps Script mengembalikan status gagal.'
        });
      }
    } catch (err: any) {
      setTestStatus({
        testing: false,
        success: false,
        message: 'Gagal terhubung ke endpoint GAS. Pastikan deployment berstatus "Anyone" (Siapa saja) dan URL berakhiran /exec.'
      });
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    LkmService.saveSettings(formData);
    onUpdateSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Pengaturan Aplikasi & Integrasi Spreadsheet
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Konfigurasi koneksi Google Spreadsheet, Apps Script Web App, dan parameter penilaian
          </p>
        </div>

        <button
          onClick={onOpenSheetsModal}
          className="px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-bold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          <span>Buka Panduan & Code.gs</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {saveSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Pengaturan berhasil disimpan!</span>
          </div>
        )}

        {/* Section 1: Integrasi Google Apps Script */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-extrabold text-slate-900">
              Integrasi Google Spreadsheet & Apps Script
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ID Google Spreadsheet (Database Utama)
              </label>
              <input
                type="text"
                value={formData.spreadsheetId}
                onChange={(e) => setFormData({ ...formData, spreadsheetId: e.target.value })}
                placeholder="Contoh: 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-mono text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
              />
              <p className="mt-1 text-[11px] text-slate-400">
                Dapat dilihat dari URL Google Spreadsheet di antara <code className="bg-slate-100 px-1 py-0.5 rounded">/d/</code> dan <code className="bg-slate-100 px-1 py-0.5 rounded">/edit</code>.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                URL Google Apps Script Web App (Endpoint /exec)
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="url"
                  value={formData.gasWebAppUrl}
                  onChange={(e) => setFormData({ ...formData, gasWebAppUrl: e.target.value })}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 font-mono text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testStatus.testing}
                  className="px-4 py-2.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 font-bold text-xs inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                >
                  <Link className="w-3.5 h-3.5" />
                  <span>{testStatus.testing ? 'Menguji...' : 'Uji Koneksi GAS'}</span>
                </button>
              </div>
            </div>

            {testStatus.message && (
              <div className={`p-3.5 rounded-xl text-xs font-semibold flex items-start gap-2 ${
                testStatus.success
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border border-rose-200 text-rose-800'
              }`}>
                {testStatus.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <span>{testStatus.message}</span>
              </div>
            )}

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.useLiveGas}
                  onChange={(e) => setFormData({ ...formData, useLiveGas: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300"
                />
                <span className="text-xs font-bold text-slate-800">
                  Aktifkan Mode Sinkronisasi Langsung ke Google Apps Script Web App
                </span>
              </label>
              <p className="ml-6 text-[11px] text-slate-500 mt-0.5">
                Bila tidak dicentang, aplikasi menggunakan database bawaan SMAN 1 Tejakula (aman untuk demo/prototyping).
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Identitas Sekolah & Guru */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-extrabold text-slate-900">
              Identitas Sekolah & Guru Pengampu
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Sekolah
              </label>
              <input
                type="text"
                value={formData.schoolName}
                onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-semibold focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Guru Pengampu
              </label>
              <input
                type="text"
                value={formData.teacherName}
                onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-semibold focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                PIN Akses Guru
              </label>
              <input
                type="text"
                value={formData.teacherPin}
                onChange={(e) => setFormData({ ...formData, teacherPin: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-mono text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.allowRetakeByDefault}
                  onChange={(e) => setFormData({ ...formData, allowRetakeByDefault: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300"
                />
                <span className="text-xs font-bold text-slate-800">
                  Izinkan Pengerjaan Ulang (Remedial) Bawaan
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm inline-flex items-center gap-2 shadow-md shadow-blue-500/20 cursor-pointer transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Semua Pengaturan</span>
          </button>
        </div>
      </form>
    </div>
  );
};
