import {
  Student,
  LkmInfo,
  Question,
  FeedbackRule,
  SubmissionResult,
  StudentReflection,
  AppSettings,
  IndicatorAnalysis,
  DetailedQuestionReview
} from '../types/lkm';
import {
  DEFAULT_SETTINGS,
  DEFAULT_STUDENTS,
  DEFAULT_LKMS,
  DEFAULT_QUESTIONS,
  DEFAULT_FEEDBACK_RULES,
  INITIAL_SUBMISSIONS,
  INITIAL_REFLECTIONS
} from '../data/defaultData';

const SETTINGS_KEY = 'lkm_pjok_settings';
const SUBMISSIONS_KEY = 'lkm_pjok_submissions';
const REFLECTIONS_KEY = 'lkm_pjok_reflections';
const CUSTOM_LKMS_KEY = 'lkm_pjok_lkms';

export class LkmService {
  private static getStored<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      if (item) return JSON.parse(item);
    } catch (e) {
      console.warn('Error reading from localStorage', e);
    }
    return defaultValue;
  }

  private static setStored<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('Error saving to localStorage', e);
    }
  }

  static getSettings(): AppSettings {
    return this.getStored<AppSettings>(SETTINGS_KEY, DEFAULT_SETTINGS);
  }

  static saveSettings(settings: AppSettings): void {
    this.setStored<AppSettings>(SETTINGS_KEY, settings);
  }

  static getStudents(): Student[] {
    return DEFAULT_STUDENTS;
  }

  static getClasses(): string[] {
    const students = this.getStudents();
    const set = new Set<string>();
    students.forEach((s) => set.add(s.kelas));
    return Array.from(set).sort();
  }

  static getStudentsByClass(kelas: string): Student[] {
    return this.getStudents().filter((s) => s.kelas === kelas);
  }

  static getLkms(): LkmInfo[] {
    const custom = this.getStored<LkmInfo[]>(CUSTOM_LKMS_KEY, DEFAULT_LKMS);
    return custom;
  }

  static updateLkm(lkm: LkmInfo): void {
    const lkms = this.getLkms();
    const index = lkms.findIndex((l) => l.id === lkm.id);
    if (index >= 0) {
      lkms[index] = lkm;
    } else {
      lkms.push(lkm);
    }
    this.setStored(CUSTOM_LKMS_KEY, lkms);
  }

  /**
   * SECURITY RULE:
   * Strips the answer keys and private explanations when serving questions to the student interface!
   */
  static getQuestionsForStudent(lkmId: string): Omit<Question, 'kunci' | 'pembahasan'>[] {
    const list = DEFAULT_QUESTIONS.filter((q) => q.lkmId === lkmId);
    return list.map((q) => ({
      id: q.id,
      lkmId: q.lkmId,
      materi: q.materi,
      submateri: q.submateri,
      indikator: q.indikator,
      tipe: q.tipe,
      pertanyaan: q.pertanyaan,
      opsiA: q.opsiA,
      opsiB: q.opsiB,
      opsiC: q.opsiC,
      opsiD: q.opsiD,
      opsiE: q.opsiE,
      bobot: q.bobot,
      saranBelajar: q.saranBelajar
    }));
  }

  static getAllQuestions(): Question[] {
    return DEFAULT_QUESTIONS;
  }

  static getSubmissions(): SubmissionResult[] {
    return this.getStored<SubmissionResult[]>(SUBMISSIONS_KEY, INITIAL_SUBMISSIONS as SubmissionResult[]);
  }

  static getReflections(): StudentReflection[] {
    return this.getStored<StudentReflection[]>(REFLECTIONS_KEY, INITIAL_REFLECTIONS);
  }

  static checkExistingSubmission(namaMurid: string, kelas: string, lkmId: string): { alreadySubmitted: boolean; submission?: SubmissionResult } {
    const submissions = this.getSubmissions();
    const found = submissions.find(
      (s) => s.namaMurid.trim().toLowerCase() === namaMurid.trim().toLowerCase() &&
             s.kelas === kelas &&
             s.lkmId === lkmId
    );
    if (found) {
      return { alreadySubmitted: true, submission: found };
    }
    return { alreadySubmitted: false };
  }

  /**
   * Evaluates answers safely on the simulated or live GAS backend.
   */
  static async submitAnswers(payload: {
    namaMurid: string;
    kelas: string;
    nis?: string;
    lkmId: string;
    materi: string;
    answers: Record<string, string>;
  }): Promise<SubmissionResult> {
    const settings = this.getSettings();
    const lkms = this.getLkms();
    const targetLkm = lkms.find((l) => l.id === payload.lkmId);

    // If configured to use live GAS Web App, attempt remote POST
    if (settings.useLiveGas && settings.gasWebAppUrl) {
      try {
        const response = await fetch(settings.gasWebAppUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'submitAnswers',
            payload: {
              namaMurid: payload.namaMurid,
              kelas: payload.kelas,
              nis: payload.nis,
              lkmId: payload.lkmId,
              materi: payload.materi,
              jawabanPerSoal: payload.answers
            }
          })
        });
        const json = await response.json();
        if (json.success && json.data) {
          const res = json.data as SubmissionResult;
          // Also save in local state for offline view
          const current = this.getSubmissions();
          this.setStored(SUBMISSIONS_KEY, [res, ...current]);
          return res;
        }
      } catch (err) {
        console.warn('Gagal menghubungi live GAS Web App, beralih ke engine evaluasi internal:', err);
      }
    }

    // Server-side evaluation logic
    const questions = DEFAULT_QUESTIONS.filter((q) => q.lkmId === payload.lkmId);
    if (questions.length === 0) {
      throw new Error(`Soal untuk LKM ${payload.lkmId} belum tersedia.`);
    }

    let benar = 0;
    let salah = 0;
    let kosong = 0;
    let totalBobot = 0;
    let bobotDiperoleh = 0;

    const reviewDetails: DetailedQuestionReview[] = [];
    const indicatorMap = new Map<string, { total: number; benar: number; salah: number; kosong: number; saran?: string }>();

    questions.forEach((q, idx) => {
      totalBobot += q.bobot;
      const studentAns = payload.answers[q.id];
      const isKosong = !studentAns || studentAns.trim() === '';
      const kunci = (q.kunci || '').trim().toUpperCase();

      if (!indicatorMap.has(q.indikator)) {
        indicatorMap.set(q.indikator, { total: 0, benar: 0, salah: 0, kosong: 0, saran: q.saranBelajar });
      }
      const indStat = indicatorMap.get(q.indikator)!;
      indStat.total++;

      let isCorrect = false;
      if (isKosong) {
        kosong++;
        indStat.kosong++;
      } else {
        const normStudent = studentAns.trim().toUpperCase();
        if (normStudent === kunci) {
          benar++;
          bobotDiperoleh += q.bobot;
          isCorrect = true;
          indStat.benar++;
        } else {
          salah++;
          indStat.salah++;
        }
      }

      const opsiList: { key: string; text: string }[] = [];
      if (q.opsiA) opsiList.push({ key: 'A', text: q.opsiA });
      if (q.opsiB) opsiList.push({ key: 'B', text: q.opsiB });
      if (q.opsiC) opsiList.push({ key: 'C', text: q.opsiC });
      if (q.opsiD) opsiList.push({ key: 'D', text: q.opsiD });
      if (q.opsiE) opsiList.push({ key: 'E', text: q.opsiE });

      reviewDetails.push({
        nomor: idx + 1,
        questionId: q.id,
        pertanyaan: q.pertanyaan,
        opsiList,
        jawabanSiswa: studentAns || '(Belum dijawab)',
        kunciJawaban: q.kunci || '',
        isCorrect,
        isKosong,
        indikator: q.indikator,
        pembahasan: q.pembahasan || 'Pembahasan telah disediakan guru pengampu PJOK.',
        saranBelajar: q.saranBelajar
      });
    });

    const nilaiAkhir = totalBobot > 0 ? Math.round((bobotDiperoleh / totalBobot) * 100) : 0;

    // Build indicator breakdown
    const analisisIndikator: IndicatorAnalysis[] = [];
    const indikatorLemah: string[] = [];

    indicatorMap.forEach((val, ind) => {
      const persentase = Math.round((val.benar / val.total) * 100);
      analisisIndikator.push({
        indikator: ind,
        totalSoal: val.total,
        benar: val.benar,
        salah: val.salah,
        kosong: val.kosong,
        persentase,
        saranBelajar: val.saran
      });

      // Weak indicator criteria: < 70% and has errors
      if (persentase < 70 && val.salah > 0) {
        indikatorLemah.push(ind);
      }
    });

    // Determine automatic feedback from rules
    const feedbackRule = DEFAULT_FEEDBACK_RULES.find(
      (r) => nilaiAkhir >= r.minScore && nilaiAkhir <= r.maxScore
    ) || DEFAULT_FEEDBACK_RULES[2];

    const rekomendasiTindakLanjut: string[] = [];
    if (nilaiAkhir >= 90) {
      rekomendasiTindakLanjut.push('Kerjakan kegiatan pengayaan untuk memperdalam analisis konsep kebugaran dan biomekanika olahraga.');
      rekomendasiTindakLanjut.push('Terapkan prinsip FITT dalam merancang program kebugaran mandiri selama 1 bulan.');
      rekomendasiTindakLanjut.push('Bantu rekan kelompok melalui kegiatan tutor sebaya secara sportif.');
    } else if (nilaiAkhir >= 80) {
      rekomendasiTindakLanjut.push('Pelajari kembali pembahasan pada butir soal yang masih keliru untuk memperkuat detail konsep.');
      rekomendasiTindakLanjut.push('Latih ketelitian membaca pertanyaan agar terhindar dari salah penafsiran istilah.');
    } else if (nilaiAkhir >= 70) {
      rekomendasiTindakLanjut.push(`Fokuskan belajar ulang pada indikator yang masih kurang: ${indikatorLemah.length ? indikatorLemah.join(', ') : 'materi pokok'}.`);
      rekomendasiTindakLanjut.push('Kerjakan latihan penguatan pada materi circuit training dan komponen kebugaran.');
    } else {
      rekomendasiTindakLanjut.push('Pelajari kembali materi dasar dari buku teks atau materi tayang PJOK.');
      rekomendasiTindakLanjut.push('Konsultasikan kesulitan pemahaman dengan guru pengampu I Ketut Agus Nova Anggarawan, S.Pd.');
      rekomendasiTindakLanjut.push('Lakukan latihan pemahaman konsep secara bertahap bersama rekan belajar.');
    }

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0];
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const submissionId = `LKM-${dateStr.replace(/-/g, '')}-${randomSuffix}`;

    const newResult: SubmissionResult = {
      id: submissionId,
      tanggal: dateStr,
      waktu: timeStr,
      nis: payload.nis || '',
      namaMurid: payload.namaMurid,
      kelas: payload.kelas,
      lkmId: payload.lkmId,
      materi: payload.materi,
      totalSoal: questions.length,
      benar,
      salah,
      kosong,
      nilaiAkhir,
      kategori: feedbackRule.kategori,
      umpanBalik: feedbackRule.teks,
      indikatorLemah,
      analisisIndikator,
      jawabanPerSoal: payload.answers,
      rincianReview: reviewDetails,
      statusPenilaian: 'Selesai Otomatis',
      rekomendasiTindakLanjut,
      attemptNumber: 1
    };

    const currentSubmissions = this.getSubmissions();
    this.setStored(SUBMISSIONS_KEY, [newResult, ...currentSubmissions]);

    return newResult;
  }

  static async saveReflection(reflection: Omit<StudentReflection, 'id' | 'tanggal'>): Promise<StudentReflection> {
    const settings = this.getSettings();
    const now = new Date();
    const timeStr = `${now.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0]}`;
    const id = `REF-${Date.now().toString().slice(-6)}`;

    const fullReflection: StudentReflection = {
      ...reflection,
      id,
      tanggal: timeStr
    };

    if (settings.useLiveGas && settings.gasWebAppUrl) {
      try {
        await fetch(settings.gasWebAppUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'saveReflection',
            payload: fullReflection
          })
        });
      } catch (err) {
        console.warn('Gagal menyimpan refleksi ke live GAS Web App, disimpan secara lokal:', err);
      }
    }

    const list = this.getReflections();
    this.setStored(REFLECTIONS_KEY, [fullReflection, ...list]);
    return fullReflection;
  }

  static getTeacherDashboardStats() {
    const students = this.getStudents();
    const lkms = this.getLkms();
    const submissions = this.getSubmissions();

    const totalStudents = students.length;
    const completedStudents = new Set(submissions.map((s) => `${s.kelas}_${s.namaMurid}`)).size;
    const incompleteCount = Math.max(0, totalStudents - completedStudents);

    const scores = submissions.map((s) => s.nilaiAkhir);
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const highestScore = scores.length > 0 ? Math.max(...scores) : 0;
    const lowestScore = scores.length > 0 ? Math.min(...scores) : 0;

    const kategoriCounts: Record<string, number> = {
      'Sangat Baik': 0,
      'Baik': 0,
      'Cukup Baik': 0,
      'Perlu Peningkatan': 0,
      'Perlu Pendampingan': 0
    };

    submissions.forEach((s) => {
      if (kategoriCounts[s.kategori] !== undefined) {
        kategoriCounts[s.kategori]++;
      } else {
        kategoriCounts[s.kategori] = 1;
      }
    });

    // Indicator error aggregation across submissions
    const indicatorMistakeCount: Record<string, { totalWrong: number; totalTested: number }> = {};
    submissions.forEach((sub) => {
      sub.analisisIndikator?.forEach((ind) => {
        if (!indicatorMistakeCount[ind.indikator]) {
          indicatorMistakeCount[ind.indikator] = { totalWrong: 0, totalTested: 0 };
        }
        indicatorMistakeCount[ind.indikator].totalWrong += ind.salah;
        indicatorMistakeCount[ind.indikator].totalTested += ind.totalSoal;
      });
    });

    const indicatorSummary = Object.entries(indicatorMistakeCount).map(([indikator, data]) => {
      const errorRate = data.totalTested > 0 ? Math.round((data.totalWrong / data.totalTested) * 100) : 0;
      return {
        indikator,
        totalWrong: data.totalWrong,
        totalTested: data.totalTested,
        errorRate
      };
    }).sort((a, b) => b.errorRate - a.errorRate);

    // Students needing accompaniment (score < 70)
    const studentsNeedingHelp = submissions
      .filter((s) => s.nilaiAkhir < 70)
      .map((s) => ({
        nama: s.namaMurid,
        kelas: s.kelas,
        nilai: s.nilaiAkhir,
        indikatorLemah: s.indikatorLemah
      }));

    return {
      totalStudents,
      completedStudents,
      incompleteCount,
      totalLkms: lkms.length,
      avgScore,
      highestScore,
      lowestScore,
      kategoriCounts,
      indicatorSummary,
      studentsNeedingHelp
    };
  }
}
