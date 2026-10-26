export type QuestionType = 'Pilihan Ganda' | 'Benar Salah' | 'Isian Singkat' | 'Uraian';

export interface Question {
  id: string;
  lkmId: string;
  materi: string;
  submateri: string;
  indikator: string;
  tipe: QuestionType;
  pertanyaan: string;
  opsiA?: string;
  opsiB?: string;
  opsiC?: string;
  opsiD?: string;
  opsiE?: string;
  // Answer key is kept secure, never sent to student during exam
  kunci?: string;
  bobot: number;
  pembahasan?: string;
  saranBelajar?: string;
}

export interface Student {
  nis: string;
  nama: string;
  kelas: string;
  jenisKelamin?: 'L' | 'P';
}

export interface LkmInfo {
  id: string;
  judul: string;
  materi: string;
  fase: string;
  kelas: string;
  tujuanPembelajaran: string;
  petunjuk: string;
  durasiMenit?: number;
  izinkanUlang: boolean;
  statusAktif: boolean;
  totalSoal: number;
}

export interface FeedbackRule {
  minScore: number;
  maxScore: number;
  kategori: string;
  arah: string;
  teks: string;
}

export interface StudentAnswer {
  questionId: string;
  answerText: string;
}

export interface IndicatorAnalysis {
  indikator: string;
  totalSoal: number;
  benar: number;
  salah: number;
  kosong: number;
  persentase: number;
  saranBelajar?: string;
}

export interface DetailedQuestionReview {
  nomor: number;
  questionId: string;
  pertanyaan: string;
  opsiList: { key: string; text: string }[];
  jawabanSiswa: string;
  kunciJawaban: string;
  isCorrect: boolean;
  isKosong: boolean;
  indikator: string;
  pembahasan: string;
  saranBelajar?: string;
}

export interface SubmissionResult {
  id: string; // Unique ID pengerjaan (e.g. LKM-20261026-XXXX)
  tanggal: string;
  waktu: string;
  nis: string;
  namaMurid: string;
  kelas: string;
  lkmId: string;
  materi: string;
  totalSoal: number;
  benar: number;
  salah: number;
  kosong: number;
  nilaiAkhir: number;
  kategori: string;
  umpanBalik: string;
  indikatorLemah: string[];
  analisisIndikator: IndicatorAnalysis[];
  jawabanPerSoal: Record<string, string>;
  rincianReview?: DetailedQuestionReview[];
  statusPenilaian: 'Selesai Otomatis' | 'Menunggu Penilaian Guru' | 'Telah Dinilai Guru';
  rekomendasiTindakLanjut: string[];
  attemptNumber: number;
}

export interface StudentReflection {
  id: string;
  submissionId: string;
  tanggal: string;
  namaMurid: string;
  kelas: string;
  lkmId: string;
  materi: string;
  halBaru: string;
  materiSulit: string;
  penyebabKesulitan: string;
  rencanaPeningkatan: string;
}

export interface AppSettings {
  teacherPin: string;
  gasWebAppUrl: string;
  spreadsheetId: string;
  useLiveGas: boolean;
  allowRetakeByDefault: boolean;
  schoolName: string;
  teacherName: string;
  subjectName: string;
}
