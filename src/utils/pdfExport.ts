import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SubmissionResult } from '../types/lkm';

export function generateLkmResultPdf(result: SubmissionResult, teacherName = 'I Ketut Agus Nova Anggarawan, S.Pd.'): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let currentY = 14;

  // Header Banner / Kop Resmi
  doc.setFillColor(30, 64, 175); // Dark blue #1e40af
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('LKM DIGITAL PJOK - SMA NEGERI 1 TEJAKULA', pageWidth / 2, 11, { align: 'center' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('LEMBAR HASIL PENILAIAN & UMPAN BALIK OTOMATIS PEMBELAJARAN PJOK', pageWidth / 2, 17, { align: 'center' });
  doc.text('Motto: Belajar Aktif, Berpikir Kritis, dan Refleksi Diri', pageWidth / 2, 22, { align: 'center' });

  currentY = 34;

  // Student Identity Box
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, currentY, pageWidth - 28, 30, 2, 2, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('IDENTITAS PESERTA DIDIK', 18, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);

  // Column 1
  doc.text(`Nama Murid      : ${result.namaMurid}`, 18, currentY + 13);
  doc.text(`Kelas / NIS        : ${result.kelas} / ${result.nis || '-'}`, 18, currentY + 19);
  doc.text(`Materi LKM       : ${result.materi}`, 18, currentY + 25);

  // Column 2
  doc.text(`ID Pengerjaan  : ${result.id}`, 115, currentY + 13);
  doc.text(`Waktu Selesai  : ${result.tanggal} ${result.waktu}`, 115, currentY + 19);
  doc.text(`Guru Pengampu : ${teacherName}`, 115, currentY + 25);

  currentY += 36;

  // Score Highlight Banner
  let scoreBgColor: [number, number, number] = [16, 185, 129]; // Emerald
  if (result.nilaiAkhir < 60) {
    scoreBgColor = [225, 29, 72]; // Rose
  } else if (result.nilaiAkhir < 70) {
    scoreBgColor = [217, 119, 6]; // Amber
  } else if (result.nilaiAkhir < 80) {
    scoreBgColor = [14, 165, 233]; // Sky
  } else if (result.nilaiAkhir < 90) {
    scoreBgColor = [37, 99, 235]; // Blue
  }

  doc.setFillColor(scoreBgColor[0], scoreBgColor[1], scoreBgColor[2]);
  doc.roundedRect(14, currentY, pageWidth - 28, 22, 2, 2, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('NILAI AKHIR', 22, currentY + 8);
  doc.setFontSize(18);
  doc.text(`${result.nilaiAkhir} / 100`, 22, currentY + 17);

  doc.setFontSize(10);
  doc.text(`Kategori: ${result.kategori}`, 85, currentY + 8);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(
    `Benar: ${result.benar} Soal   |   Salah: ${result.salah} Soal   |   Kosong: ${result.kosong} Soal   |   Total: ${result.totalSoal} Soal`,
    85,
    currentY + 16
  );

  currentY += 28;

  // Umpan Balik Otomatis
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('UMPAN BALIK OTOMATIS & MOTIVASI', 14, currentY);

  currentY += 3;
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(241, 245, 249);
  
  const feedbackLines = doc.splitTextToSize(result.umpanBalik, pageWidth - 36);
  const feedbackHeight = Math.max(16, feedbackLines.length * 4.5 + 8);
  
  doc.roundedRect(14, currentY, pageWidth - 28, feedbackHeight, 2, 2, 'FD');
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text(feedbackLines, 18, currentY + 6);

  currentY += feedbackHeight + 7;

  // Analisis Indikator Table via autoTable
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('ANALISIS PENGUASAAN BERDASARKAN INDIKATOR', 14, currentY);

  currentY += 2;

  const tableRows = (result.analisisIndikator || []).map((item) => [
    item.indikator,
    String(item.totalSoal),
    String(item.benar),
    String(item.salah),
    `${item.persentase}%`,
    item.persentase >= 80 ? 'Sangat Baik' : item.persentase >= 70 ? 'Cukup' : 'Perlu Diperkuat'
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['Indikator Pembelajaran', 'Total', 'Benar', 'Salah', 'Tingkat', 'Status']],
    body: tableRows,
    theme: 'striped',
    headStyles: {
      fillColor: [30, 64, 175],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5
    },
    bodyStyles: {
      fontSize: 8,
      cellPadding: 2.2
    },
    columnStyles: {
      0: { cellWidth: 70 },
      1: { halign: 'center', cellWidth: 16 },
      2: { halign: 'center', cellWidth: 16 },
      3: { halign: 'center', cellWidth: 16 },
      4: { halign: 'center', cellWidth: 20 },
      5: { halign: 'center' }
    },
    margin: { left: 14, right: 14 }
  });

  const finalTableY = (doc as any).lastAutoTable.finalY || currentY + 30;
  currentY = finalTableY + 6;

  // Saran Belajar Khusus jika ada materi lemah
  if (result.indikatorLemah && result.indikatorLemah.length > 0) {
    // Check if new page is needed
    if (currentY > 230) {
      doc.addPage();
      currentY = 16;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(180, 83, 9); // Amber 700
    doc.text('MATERI YANG PERLU DIPERKUAT & SARAN BELAJAR:', 14, currentY);

    currentY += 4;
    const weakIndicators = result.analisisIndikator?.filter((ind) => result.indikatorLemah.includes(ind.indikator)) || [];
    
    weakIndicators.forEach((weak) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(30, 41, 59);
      doc.text(`• ${weak.indikator} (Salah: ${weak.salah}/${weak.totalSoal})`, 16, currentY);
      currentY += 4;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      const adviceLines = doc.splitTextToSize(`Saran: ${weak.saranBelajar || 'Pelajari kembali materi terkait dari buku paket PJOK.'}`, pageWidth - 36);
      doc.text(adviceLines, 19, currentY);
      currentY += adviceLines.length * 3.8 + 2;
    });

    currentY += 3;
  }

  // Rekomendasi Tindak Lanjut
  if (currentY > 235) {
    doc.addPage();
    currentY = 16;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('REKOMENDASI TINDAK LANJUT BELAJAR:', 14, currentY);
  currentY += 4;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);

  result.rekomendasiTindakLanjut?.forEach((rek, i) => {
    const textLines = doc.splitTextToSize(`${i + 1}. ${rek}`, pageWidth - 34);
    doc.text(textLines, 16, currentY);
    currentY += textLines.length * 3.8;
  });

  currentY += 6;

  // Signature / Tanda Tangan Resmi
  if (currentY > 245) {
    doc.addPage();
    currentY = 20;
  }

  const signX = pageWidth - 70;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`Tejakula, ${result.tanggal}`, signX, currentY);
  doc.text('Guru Mata Pelajaran PJOK,', signX, currentY + 5);

  doc.setFont('helvetica', 'bold');
  doc.text(teacherName, signX, currentY + 22);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('NIP. Guru PJOK SMAN 1 Tejakula', signX, currentY + 26);

  // Bottom watermark / footer
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(
    `Dokumen resmi LKM Digital PJOK SMAN 1 Tejakula • ID: ${result.id} • Dicetak pada: ${new Date().toLocaleString('id-ID')}`,
    pageWidth / 2,
    pageHeight - 6,
    { align: 'center' }
  );

  // Clean filename
  const safeName = (result.namaMurid || 'Murid').replace(/[^a-zA-Z0-9]/g, '_');
  const safeClass = (result.kelas || 'XI').replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `LKM_PJOK_${safeName}_${safeClass}_Nilai_${result.nilaiAkhir}.pdf`;

  doc.save(filename);
}
