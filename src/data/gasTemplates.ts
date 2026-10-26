export const SPREADSHEET_SCHEMA_DOC = `
# PANDUAN STRUKTUR & PEMETAAN GOOGLE SPREADSHEET
### LKM DIGITAL PJOK - SMA NEGERI 1 TEJAKULA
**Guru Pengampu:** I Ketut Agus Nova Anggarawan, S.Pd.

Google Spreadsheet adalah **Single Source of Truth (Satu-satunya Sumber Data)** untuk seluruh operasional aplikasi LKM Digital PJOK.
Aplikasi menggunakan pemetaan dinamis berbasis baris header (header-based mapping), sehingga urutan kolom tetap fleksibel.

---

### 1. Sheet: \`DATA_MURID\`
Menyimpan daftar seluruh peserta didik per kelas.
* **Kelas** (Teks, contoh: "XI 1", "XI 2", "X 1")
* **NIS** (Teks/Angka, contoh: "220101")
* **Nama Murid** (Teks, contoh: "I Made Dwi Antara")
* **Jenis Kelamin** (Teks, "L" / "P")
* **Status** (Teks, "Aktif")

---

### 2. Sheet: \`BANK_SOAL\`
Menyimpan butir pertanyaan, pilihan, kunci jawaban, dan indikator.
* **ID Soal** (Teks unik, contoh: "KBG-01", "VOL-01")
* **ID LKM** (Teks, contoh: "LKM-KBG-01")
* **Materi** (Teks, contoh: "Kebugaran Jasmani")
* **Submateri** (Teks, contoh: "Komponen Kebugaran Jasmani")
* **Indikator** (Teks, contoh: "Komponen kebugaran jasmani")
* **Tipe Soal** (Teks: "Pilihan Ganda", "Benar Salah", "Isian Singkat", "Uraian")
* **Pertanyaan** (Teks lengkap butir soal)
* **A** (Teks pilihan A)
* **B** (Teks pilihan B)
* **C** (Teks pilihan C)
* **D** (Teks pilihan D)
* **E** (Teks pilihan E)
* **Kunci** (Teks: "A", "B", "C", "D", atau "E" untuk Pilihan Ganda; "Benar" / "Salah" untuk Benar-Salah)
* **Bobot** (Angka, contoh: 5)
* **Pembahasan** (Teks penjelasan ilmiah untuk pemahaman konsep)
* **Saran Belajar** (Teks rekomendasi spesifik jika murid menjawab salah pada indikator ini)

---

### 3. Sheet: \`PENGATURAN_LKM\`
Menyimpan daftar topik LKM yang aktif dan perizinan.
* **ID LKM** (Teks unik, contoh: "LKM-KBG-01")
* **Judul LKM** (Teks, contoh: "LKM Kebugaran Jasmani")
* **Materi** (Teks, contoh: "Kebugaran Jasmani")
* **Fase** (Teks, contoh: "Fase F")
* **Kelas Target** (Teks, contoh: "XI")
* **Tujuan Pembelajaran** (Teks deskripsi capaian pembelajaran)
* **Petunjuk** (Teks petunjuk pengerjaan)
* **Durasi Menit** (Angka, contoh: 45)
* **Status Aktif** (Boolean/Teks: "TRUE" / "Aktif")
* **Izinkan Ulang** (Boolean/Teks: "TRUE" / "FALSE")

---

### 4. Sheet: \`PENGATURAN_FEEDBACK\`
Konfigurasi rentang nilai dan teks umpan balik otomatis yang dapat diubah guru kapan saja.
* **Batas Bawah** (Angka: 90, 80, 70, 60, 0)
* **Batas Atas** (Angka: 100, 89, 79, 69, 59)
* **Kategori** ("Sangat Baik", "Baik", "Cukup Baik", "Perlu Peningkatan", "Perlu Pendampingan")
* **Arah Umpan Balik** ("Apresiasi dan pengayaan", "Penguatan dan peningkatan ketelitian", dll)
* **Teks Umpan Balik** (Teks template narasi motivatif dan mendidik)

---

### 5. Sheet: \`HASIL_LKM\`
Tempat penyimpanan otomatis hasil pengerjaan murid dari backend.
* **ID Pengerjaan** (Teks unik, contoh: "LKM-20261025-001")
* **Tanggal** (Format: YYYY-MM-DD)
* **Waktu** (Format: HH:mm:ss)
* **Kelas** (Teks)
* **NIS** (Teks)
* **Nama Murid** (Teks)
* **ID LKM** (Teks)
* **Materi** (Teks)
* **Total Soal** (Angka)
* **Benar** (Angka)
* **Salah** (Angka)
* **Kosong** (Angka)
* **Nilai Akhir** (Angka, rentang 0-100)
* **Kategori** (Teks)
* **Umpan Balik** (Teks)
* **Indikator Lemah** (Teks terpisah koma)
* **Rincian Jawaban** (JSON String kumpulan jawaban per nomor)
* **Status Penilaian** ("Selesai Otomatis" atau "Menunggu Penilaian Guru")

---

### 6. Sheet: \`REFLEKSI\`
Tempat penyimpanan jawaban refleksi 4 pilar murid setelah melihat umpan balik.
* **ID Refleksi** (Teks unik)
* **ID Pengerjaan** (Relasi ke Sheet HASIL_LKM)
* **Tanggal & Waktu** (Timestamp)
* **Nama Murid** (Teks)
* **Kelas** (Teks)
* **ID LKM** (Teks)
* **Materi** (Teks)
* **Hal Baru Dipelajari** (Teks jawaban pertanyaan 1)
* **Materi Masih Sulit** (Teks jawaban pertanyaan 2)
* **Penyebab Kesulitan** (Teks jawaban pertanyaan 3)
* **Rencana Peningkatan** (Teks jawaban pertanyaan 4)
`;

export const GAS_CODE_GS = `/**
 * =========================================================================
 * LKM DIGITAL PJOK - SMA NEGERI 1 TEJAKULA
 * Backend Google Apps Script (Code.gs)
 * Guru Pengampu: I Ketut Agus Nova Anggarawan, S.Pd.
 * =========================================================================
 * 
 * Prinsip: GOOGLE SPREADSHEET SEBAGAI SINGLE SOURCE OF TRUTH
 * Aman: Kunci jawaban diproses di server/GAS, tidak dikirim ke browser murid!
 */

// GANTI ID SPREADSHEET INI DENGAN ID SPREADSHEET ANDA
var SPREADSHEET_ID = "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms";

function getSpreadsheet() {
  if (!SPREADSHEET_ID || SPREADSHEET_ID === "ISI_DENGAN_ID_SPREADSHEET_ANDA") {
    return SpreadsheetApp.getActiveSpreadsheet();
  }
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

/**
 * Endpoint HTML Service (jika dijalankan langsung dari Web App)
 */
function doGet(e) {
  // Jika dipanggil via API fetch dengan query parameter action
  if (e && e.parameter && e.parameter.action) {
    return handleApiRequest(e.parameter.action, e.parameter);
  }
  
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('LKM DIGITAL PJOK - SMA Negeri 1 Tejakula')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Endpoint POST untuk pengumpulan data dari browser
 */
function doPost(e) {
  try {
    var contents = JSON.parse(e.postData.contents);
    var action = contents.action;
    var payload = contents.payload;
    var result = null;

    if (action === 'submitAnswers') {
      result = submitAnswers(payload);
    } else if (action === 'saveReflection') {
      result = saveReflection(payload);
    } else if (action === 'checkExistingSubmission') {
      result = checkExistingSubmission(payload.namaMurid, payload.kelas, payload.lkmId);
    } else {
      throw new Error('Aksi tidak dikenal: ' + action);
    }

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      data: result
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function handleApiRequest(action, params) {
  var data = null;
  if (action === 'getInitialData') {
    data = getInitialData();
  } else if (action === 'getQuestions') {
    data = getQuestionsForStudent(params.lkmId);
  } else if (action === 'getTeacherDashboard') {
    data = getTeacherDashboardData();
  }
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    data: data
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Helper: Membaca sheet menjadi array of objects berdasarkan Header Kolom
 */
function readSheetByHeader(sheetName) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  
  var values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];

  var headers = values[0].map(function(h) { return String(h).trim(); });
  var result = [];

  for (var i = 1; i < values.length; i++) {
    var row = values[i];
    var isEmpty = row.every(function(val) { return String(val).trim() === ''; });
    if (isEmpty) continue;

    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = row[j];
    }
    result.push(obj);
  }
  return result;
}

/**
 * 1. Ambil data awal murid, daftar kelas, dan daftar LKM yang aktif
 */
function getInitialData() {
  var studentsRaw = readSheetByHeader('DATA_MURID');
  var lkmsRaw = readSheetByHeader('PENGATURAN_LKM');

  var students = studentsRaw.map(function(item) {
    return {
      nis: String(item['NIS'] || ''),
      nama: String(item['Nama Murid'] || item['Nama'] || ''),
      kelas: String(item['Kelas'] || ''),
      jenisKelamin: String(item['Jenis Kelamin'] || '')
    };
  });

  // Ambil daftar kelas unik
  var kelasList = [];
  students.forEach(function(s) {
    if (s.kelas && kelasList.indexOf(s.kelas) === -1) {
      kelasList.push(s.kelas);
    }
  });
  kelasList.sort();

  var lkms = lkmsRaw.filter(function(l) {
    var aktif = String(l['Status Aktif'] || 'TRUE').toUpperCase();
    return aktif === 'TRUE' || aktif === 'AKTIF' || aktif === 'YA';
  }).map(function(item) {
    return {
      id: String(item['ID LKM'] || ''),
      judul: String(item['Judul LKM'] || ''),
      materi: String(item['Materi'] || ''),
      fase: String(item['Fase'] || 'Fase F'),
      kelas: String(item['Kelas Target'] || 'XI'),
      tujuanPembelajaran: String(item['Tujuan Pembelajaran'] || ''),
      petunjuk: String(item['Petunjuk'] || ''),
      durasiMenit: Number(item['Durasi Menit'] || 45),
      izinkanUlang: String(item['Izinkan Ulang'] || '').toUpperCase() === 'TRUE'
    };
  });

  return {
    students: students,
    kelasList: kelasList,
    lkms: lkms
  };
}

/**
 * 2. Ambil soal untuk pengerjaan murid (KUNCI JAWABAN TIDAK DIKIRIM KE BROWSER)
 */
function getQuestionsForStudent(lkmId) {
  var allQuestions = readSheetByHeader('BANK_SOAL');
  var filtered = allQuestions.filter(function(q) {
    return String(q['ID LKM']).trim() === String(lkmId).trim();
  });

  // Hapus kunci dan pembahasan agar tidak bisa di-inspect melalui DevTools murid
  return filtered.map(function(q) {
    return {
      id: String(q['ID Soal'] || ''),
      lkmId: String(q['ID LKM'] || ''),
      materi: String(q['Materi'] || ''),
      submateri: String(q['Submateri'] || ''),
      indikator: String(q['Indikator'] || ''),
      tipe: String(q['Tipe Soal'] || 'Pilihan Ganda'),
      pertanyaan: String(q['Pertanyaan'] || ''),
      opsiA: String(q['A'] || ''),
      opsiB: String(q['B'] || ''),
      opsiC: String(q['C'] || ''),
      opsiD: String(q['D'] || ''),
      opsiE: String(q['E'] || ''),
      bobot: Number(q['Bobot'] || 1)
      // kunci, pembahasan, saranBelajar DIHAPUS dari respon ini demi keamanan
    };
  });
}

/**
 * 3. Pemeriksaan duplikasi pengerjaan
 */
function checkExistingSubmission(namaMurid, kelas, lkmId) {
  var hasil = readSheetByHeader('HASIL_LKM');
  for (var i = 0; i < hasil.length; i++) {
    var r = hasil[i];
    if (String(r['Nama Murid']).trim() === String(namaMurid).trim() &&
        String(r['Kelas']).trim() === String(kelas).trim() &&
        String(r['ID LKM']).trim() === String(lkmId).trim()) {
      return {
        alreadySubmitted: true,
        submission: r
      };
    }
  }
  return { alreadySubmitted: false };
}

/**
 * 4. PENGUMPULAN & PENILAIAN OTOMATIS (SERVER-SIDE EVALUATION)
 */
function submitAnswers(payload) {
  var nama = payload.namaMurid;
  var kelas = payload.kelas;
  var lkmId = payload.lkmId;
  var answers = payload.jawabanPerSoal || {}; // { 'KBG-01': 'B', ... }

  var ss = getSpreadsheet();
  
  // Baca bank soal lengkap BESERTA KUNCI dari sheet
  var allQuestions = readSheetByHeader('BANK_SOAL');
  var questions = allQuestions.filter(function(q) {
    return String(q['ID LKM']).trim() === String(lkmId).trim();
  });

  if (questions.length === 0) {
    throw new Error('Soal untuk LKM ' + lkmId + ' tidak ditemukan di database.');
  }

  var totalSoal = questions.length;
  var benar = 0;
  var salah = 0;
  var kosong = 0;
  var totalBobot = 0;
  var bobotDiperoleh = 0;

  var reviewDetails = [];
  var indicatorStats = {};

  for (var i = 0; i < questions.length; i++) {
    var q = questions[i];
    var qId = String(q['ID Soal']).trim();
    var indikator = String(q['Indikator'] || 'Umum').trim();
    var bobot = Number(q['Bobot'] || 1);
    var kunci = String(q['Kunci'] || '').trim().toUpperCase();
    var saran = String(q['Saran Belajar'] || '');
    var pembahasan = String(q['Pembahasan'] || '');
    
    totalBobot += bobot;

    if (!indicatorStats[indikator]) {
      indicatorStats[indikator] = {
        indikator: indikator,
        totalSoal: 0,
        benar: 0,
        salah: 0,
        kosong: 0,
        saranBelajar: saran
      };
    }
    indicatorStats[indikator].totalSoal++;

    var studentAns = answers[qId];
    var isKosong = !studentAns || String(studentAns).trim() === '';
    var isCorrect = false;

    if (isKosong) {
      kosong++;
      indicatorStats[indikator].kosong++;
    } else {
      var normAns = String(studentAns).trim().toUpperCase();
      if (normAns === kunci) {
        benar++;
        bobotDiperoleh += bobot;
        isCorrect = true;
        indicatorStats[indikator].benar++;
      } else {
        salah++;
        indicatorStats[indikator].salah++;
      }
    }

    reviewDetails.push({
      nomor: i + 1,
      questionId: qId,
      pertanyaan: q['Pertanyaan'],
      opsiList: [
        { key: 'A', text: q['A'] || '' },
        { key: 'B', text: q['B'] || '' },
        { key: 'C', text: q['C'] || '' },
        { key: 'D', text: q['D'] || '' },
        { key: 'E', text: q['E'] || '' }
      ].filter(function(o) { return o.text !== ''; }),
      jawabanSiswa: studentAns || '(Tidak dijawab)',
      kunciJawaban: kunci,
      isCorrect: isCorrect,
      isKosong: isKosong,
      indikator: indikator,
      pembahasan: pembahasan,
      saranBelajar: saran
    });
  }

  // Hitung Nilai Akhir (Skala 0-100)
  var nilaiAkhir = Math.round((bobotDiperoleh / totalBobot) * 100);
  if (isNaN(nilaiAkhir)) nilaiAkhir = 0;

  // Analisis Indikator & Identifikasi Indikator Lemah
  var analisisIndikator = [];
  var indikatorLemah = [];

  for (var ind in indicatorStats) {
    var stat = indicatorStats[ind];
    var pct = Math.round((stat.benar / stat.totalSoal) * 100);
    stat.persentase = pct;
    analisisIndikator.push(stat);

    // Kriteria lemah: persentase penguasaan di bawah 70% dan memiliki minimal 1 salah
    if (pct < 70 && stat.salah > 0) {
      indikatorLemah.push(ind);
    }
  }

  // Ambil Umpan Balik Otomatis dari Sheet PENGATURAN_FEEDBACK
  var feedbackRules = readSheetByHeader('PENGATURAN_FEEDBACK');
  var feedbackText = "";
  var category = "Cukup Baik";

  if (feedbackRules && feedbackRules.length > 0) {
    for (var f = 0; f < feedbackRules.length; f++) {
      var rule = feedbackRules[f];
      var minS = Number(rule['Batas Bawah']);
      var maxS = Number(rule['Batas Atas']);
      if (nilaiAkhir >= minS && nilaiAkhir <= maxS) {
        category = rule['Kategori'] || category;
        feedbackText = rule['Teks Umpan Balik'] || "";
        break;
      }
    }
  }

  // Fallback standar jika sheet feedback belum diisi
  if (!feedbackText) {
    if (nilaiAkhir >= 90) {
      category = 'Sangat Baik';
      feedbackText = 'Hebat! Kamu menunjukkan pemahaman yang sangat baik terhadap materi pembelajaran. Pertahankan pencapaian ini dan terus kembangkan kemampuanmu dengan menerapkan pengetahuan dalam kegiatan sehari-hari.';
    } else if (nilaiAkhir >= 80) {
      category = 'Baik';
      feedbackText = 'Bagus! Kamu sudah memahami sebagian besar materi dengan baik. Tingkatkan ketelitian dalam menjawab soal dan pelajari kembali beberapa bagian yang masih perlu diperkuat.';
    } else if (nilaiAkhir >= 70) {
      category = 'Cukup Baik';
      feedbackText = 'Kamu sudah menunjukkan pemahaman yang cukup baik. Masih ada beberapa konsep yang perlu dipelajari kembali. Tetap semangat dan gunakan hasil ini sebagai bahan untuk meningkatkan pemahamanmu.';
    } else if (nilaiAkhir >= 60) {
      category = 'Perlu Peningkatan';
      feedbackText = 'Terima kasih sudah berusaha menyelesaikan LKM. Kamu perlu memperkuat pemahaman terhadap beberapa konsep dasar. Bacalah kembali materi, diskusikan bagian yang belum dipahami, dan terus berlatih.';
    } else {
      category = 'Perlu Pendampingan';
      feedbackText = 'Terima kasih atas usaha yang sudah kamu lakukan. Hasil ini menjadi bahan untuk mengetahui bagian materi yang masih perlu dipelajari. Jangan ragu bertanya kepada guru dan terus berlatih secara bertahap.';
    }
  }

  // Rekomendasi Tindak Lanjut Otomatis
  var rekomendasiTindakLanjut = [];
  if (nilaiAkhir >= 90) {
    rekomendasiTindakLanjut.push('Kerjakan kegiatan pengayaan materi tingkat lanjut.');
    rekomendasiTindakLanjut.push('Terapkan konsep latihan ini dalam aktivitas fisik atau olahraga harian Anda.');
    rekomendasiTindakLanjut.push('Bantu rekan sekelas melalui diskusi dan tutor sebaya.');
  } else if (nilaiAkhir >= 80) {
    rekomendasiTindakLanjut.push('Pelajari kembali pembahasan pada butir soal yang masih keliru.');
    rekomendasiTindakLanjut.push('Latih ketelitian membaca pertanyaan agar tidak terjebak pengecoh.');
  } else if (nilaiAkhir >= 70) {
    rekomendasiTindakLanjut.push('Pelajari kembali indikator materi yang belum dikuasai secara utuh.');
    rekomendasiTindakLanjut.push('Kerjakan latihan penguatan pada materi yang masih dijawab salah.');
  } else {
    rekomendasiTindakLanjut.push('Pelajari kembali materi dasar dari buku atau modul PJOK.');
    rekomendasiTindakLanjut.push('Konsultasikan kesulitan Anda dengan guru pengampu I Ketut Agus Nova Anggarawan, S.Pd.');
    rekomendasiTindakLanjut.push('Lakukan latihan bertahap bersama teman kelompok.');
  }

  // Generate Unique ID Pengerjaan
  var now = new Date();
  var dateStr = Utilities.formatDate(now, Session.getScriptTimeZone(), "yyyy-MM-dd");
  var timeStr = Utilities.formatDate(now, Session.getScriptTimeZone(), "HH:mm:ss");
  var subId = "LKM-" + Utilities.formatDate(now, Session.getScriptTimeZone(), "yyyyMMdd") + "-" + Math.floor(1000 + Math.random() * 9000);

  // Simpan ke Sheet HASIL_LKM
  var hasilSheet = ss.getSheetByName('HASIL_LKM');
  if (!hasilSheet) {
    hasilSheet = ss.insertSheet('HASIL_LKM');
    hasilSheet.appendRow([
      'ID Pengerjaan', 'Tanggal', 'Waktu', 'Kelas', 'NIS', 'Nama Murid', 'ID LKM',
      'Materi', 'Total Soal', 'Benar', 'Salah', 'Kosong', 'Nilai Akhir', 'Kategori',
      'Umpan Balik', 'Indikator Lemah', 'Rincian Jawaban', 'Status Penilaian'
    ]);
  }

  hasilSheet.appendRow([
    subId,
    dateStr,
    timeStr,
    kelas,
    payload.nis || '',
    nama,
    lkmId,
    payload.materi || 'PJOK',
    totalSoal,
    benar,
    salah,
    kosong,
    nilaiAkhir,
    category,
    feedbackText,
    indikatorLemah.join('; '),
    JSON.stringify(answers),
    'Selesai Otomatis'
  ]);

  var finalResult = {
    id: subId,
    tanggal: dateStr,
    waktu: timeStr,
    nis: payload.nis || '',
    namaMurid: nama,
    kelas: kelas,
    lkmId: lkmId,
    materi: payload.materi || 'Kebugaran Jasmani',
    totalSoal: totalSoal,
    benar: benar,
    salah: salah,
    kosong: kosong,
    nilaiAkhir: nilaiAkhir,
    kategori: category,
    umpanBalik: feedbackText,
    indikatorLemah: indikatorLemah,
    analisisIndikator: analisisIndikator,
    jawabanPerSoal: answers,
    rincianReview: reviewDetails,
    statusPenilaian: 'Selesai Otomatis',
    rekomendasiTindakLanjut: rekomendasiTindakLanjut,
    attemptNumber: 1
  };

  return finalResult;
}

/**
 * 5. SIMPAN REFLEKSI MURID
 */
function saveReflection(payload) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName('REFLEKSI');
  if (!sheet) {
    sheet = ss.insertSheet('REFLEKSI');
    sheet.appendRow([
      'ID Refleksi', 'ID Pengerjaan', 'Tanggal & Waktu', 'Nama Murid', 'Kelas',
      'ID LKM', 'Materi', 'Hal Baru Dipelajari', 'Materi Masih Sulit',
      'Penyebab Kesulitan', 'Rencana Peningkatan'
    ]);
  }

  var now = new Date();
  var timeStr = Utilities.formatDate(now, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
  var refId = "REF-" + Utilities.formatDate(now, Session.getScriptTimeZone(), "yyyyMMdd") + "-" + Math.floor(1000 + Math.random() * 9000);

  sheet.appendRow([
    refId,
    payload.submissionId,
    timeStr,
    payload.namaMurid,
    payload.kelas,
    payload.lkmId,
    payload.materi,
    payload.halBaru,
    payload.materiSulit,
    payload.penyebabKesulitan,
    payload.rencanaPeningkatan
  ]);

  return { success: true, id: refId };
}

/**
 * 6. AMBIL DATA DASHBOARD GURU & REKAP
 */
function getTeacherDashboardData() {
  var hasil = readSheetByHeader('HASIL_LKM');
  var students = readSheetByHeader('DATA_MURID');
  var lkms = readSheetByHeader('PENGATURAN_LKM');

  var totalMurid = students.length;
  var totalSudah = hasil.length;
  
  var nilaiList = hasil.map(function(h) { return Number(h['Nilai Akhir'] || 0); });
  var rataRata = 0;
  var tertinggi = 0;
  var terendah = 100;

  if (nilaiList.length > 0) {
    var sum = nilaiList.reduce(function(a, b) { return a + b; }, 0);
    rataRata = Math.round(sum / nilaiList.length);
    tertinggi = Math.max.apply(null, nilaiList);
    terendah = Math.min.apply(null, nilaiList);
  } else {
    terendah = 0;
  }

  var kategoriDist = {
    'Sangat Baik': 0,
    'Baik': 0,
    'Cukup Baik': 0,
    'Perlu Peningkatan': 0,
    'Perlu Pendampingan': 0
  };

  hasil.forEach(function(h) {
    var kat = h['Kategori'] || 'Cukup Baik';
    if (kategoriDist[kat] !== undefined) {
      kategoriDist[kat]++;
    } else {
      kategoriDist[kat] = 1;
    }
  });

  return {
    totalMurid: totalMurid,
    totalLKM: lkms.length,
    sudahMengerjakan: totalSudah,
    belumMengerjakan: Math.max(0, totalMurid - totalSudah),
    rataRata: rataRata,
    tertinggi: tertinggi,
    terendah: terendah,
    distribusiKategori: kategoriDist,
    rekapList: hasil
  };
}
`;

export const GAS_DEPLOYMENT_GUIDE = `
# PANDUAN DEPLOYMENT GOOGLE APPS SCRIPT (GAS)

Ikuti 6 langkah mudah berikut untuk menerbitkan LKM DIGITAL PJOK secara online:

### Langkah 1: Buat Google Spreadsheet Baru
1. Buka [Google Sheets](https://sheets.new) di peramban Anda.
2. Beri nama file: **"DATABASE LKM DIGITAL PJOK - SMAN 1 TEJAKULA"**.
3. Buat sheet dengan nama persis:
   - \`DATA_MURID\`
   - \`BANK_SOAL\`
   - \`PENGATURAN_LKM\`
   - \`PENGATURAN_FEEDBACK\`
   - \`HASIL_LKM\`
   - \`REFLEKSI\`
*(Anda juga dapat menyalin baris header dari tab template di aplikasi ini)*.

### Langkah 2: Buka Apps Script Editor
1. Di menu Google Spreadsheet, klik **Ekstensi (Extensions) > Apps Script**.
2. Beri nama proyek: **"LKM Digital PJOK Engine"**.

### Langkah 3: Tempelkan Kode Code.gs
1. Hapus isi file \`Code.gs\` yang ada, lalu salin dan tempelkan seluruh kode dari tab **"Salin Code.gs Lengkap"**.
2. Masukkan ID Spreadsheet Anda pada variabel \`SPREADSHEET_ID\` di baris atas.
   *(ID Spreadsheet dapat dilihat dari URL sheet di antara \`/d/\` dan \`/edit\`)*.
3. Klik tombol Simpan (ikon disket).

### Langkah 4: Terapkan Sebagai Web App (Deploy)
1. Klik tombol **Deploy (Terapkan) > New deployment (Penerapan baru)** di kanan atas.
2. Klik ikon gerigi (Select type) > pilih **Web App**.
3. Isi konfigurasi:
   - **Description**: "LKM Digital PJOK v1.0"
   - **Execute as (Jalankan sebagai)**: **Me (email Anda: guru pengampu)**
   - **Who has access (Siapa yang memiliki akses)**: **Anyone (Siapa saja)** — *PENTING agar murid dapat mengakses tanpa perlu login Google Apps Script developer*.
4. Klik **Deploy (Terapkan)**.
5. Izinkan akses (Authorize Access) akun Google Anda saat diminta.

### Langkah 5: Salin URL Web App ke Aplikasi Ini
1. Salin **Web App URL** yang berakhiran \`/exec\` (contoh: \`https://script.google.com/macros/s/AKfycb.../exec\`).
2. Di aplikasi LKM Digital PJOK ini, buka menu **Guru > Pengaturan & Integrasi**.
3. Masukkan URL tersebut pada kolom **URL Google Apps Script Web App** dan klik **"Uji Koneksi & Simpan"**.
4. Aplikasi kini langsung terhubung secara live ke Google Spreadsheet Anda!
`;
