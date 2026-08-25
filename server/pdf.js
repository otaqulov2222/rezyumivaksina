import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FONT = path.join(__dirname, 'fonts', 'arial.ttf');
const FONT_BOLD = path.join(__dirname, 'fonts', 'arialbd.ttf');
const LOGO = path.join(__dirname, 'logo.png');

const COLORS = {
  primary: '#4A1D6E',
  accent: '#6B2D8B',
  muted: '#6B5A78',
  line: '#E0D4EA',
  bg: '#F8F4FB',
  text: '#1F1528',
  white: '#FFFFFF',
  soft: '#F3E8FF',
  highlight: '#F5C518',
};

function safe(v) {
  return (v ?? '').toString().trim() || '—';
}

function labelMap(map, key) {
  return map[key] || '—';
}

export function buildApplicationPdf(data) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 48, bottom: 48, left: 48, right: 48 },
      info: {
        Title: `Anketa — ${data.fullName || 'Nomzod'}`,
        Author: 'VAKSINA MED',
      },
    });

    const chunks = [];
    doc.on('data', (c) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.registerFont('Regular', FONT);
    doc.registerFont('Bold', FONT_BOLD);
    // Vercel: never touch built-in Helvetica (files may be missing in serverless)
    doc.font('Regular');

    const pageW = doc.page.width;
    const contentW = pageW - 96;

    // —— Header band ——
    doc.rect(0, 0, pageW, 112).fill(COLORS.white);
    doc.rect(0, 0, pageW, 5).fill(COLORS.primary);
    doc.rect(0, 108, pageW, 4).fill(COLORS.highlight);

    if (fs.existsSync(LOGO)) {
      try {
        doc.image(LOGO, pageW / 2 - 95, 18, { width: 190 });
      } catch {
        /* logo optional */
      }
    }

    doc
      .fillColor(COLORS.primary)
      .font('Bold')
      .fontSize(11)
      .text('FARMATSEVT ANKETASI', 48, 78, { width: contentW, align: 'center' });

    const today = new Date().toLocaleDateString('uz-UZ', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
    doc
      .font('Regular')
      .fontSize(8)
      .fillColor(COLORS.muted)
      .text(`Ishga qabul · ${today}`, 48, 94, { width: contentW, align: 'center' });

    let y = 128;

    // Name hero
    doc
      .fillColor(COLORS.text)
      .font('Bold')
      .fontSize(20)
      .text(safe(data.fullName), 48, y, { width: contentW });
    y = doc.y + 4;
    doc
      .font('Regular')
      .fontSize(11)
      .fillColor(COLORS.accent)
      .text(
        [data.specialty && `Mutaxassis: ${data.specialty}`, data.phone, data.email]
          .filter(Boolean)
          .join('  ·  ') || '—',
        48,
        y,
        { width: contentW }
      );
    y = doc.y + 14;

    const drawSection = (title) => {
      if (y > 720) {
        doc.addPage();
        y = 48;
      }
      doc.rect(48, y, contentW, 22).fill(COLORS.soft);
      doc
        .fillColor(COLORS.primary)
        .font('Bold')
        .fontSize(11)
        .text(title, 56, y + 5, { width: contentW - 16 });
      y += 30;
    };

    const drawRow = (label, value, half = false) => {
      if (y > 760) {
        doc.addPage();
        y = 48;
      }
      const w = half ? contentW / 2 - 6 : contentW;
      doc
        .fillColor(COLORS.muted)
        .font('Regular')
        .fontSize(8)
        .text(label.toUpperCase(), 48, y, { width: w });
      doc
        .fillColor(COLORS.text)
        .font('Regular')
        .fontSize(10)
        .text(safe(value), 48, y + 11, { width: w });
      if (!half) y = doc.y + 10;
    };

    const drawTwoCol = (l1, v1, l2, v2) => {
      if (y > 760) {
        doc.addPage();
        y = 48;
      }
      const col = contentW / 2 - 6;
      const startY = y;
      doc
        .fillColor(COLORS.muted)
        .font('Regular')
        .fontSize(8)
        .text(l1.toUpperCase(), 48, startY, { width: col });
      doc
        .fillColor(COLORS.text)
        .font('Regular')
        .fontSize(10)
        .text(safe(v1), 48, startY + 11, { width: col });
      const h1 = doc.y;
      doc
        .fillColor(COLORS.muted)
        .font('Regular')
        .fontSize(8)
        .text(l2.toUpperCase(), 48 + col + 12, startY, { width: col });
      doc
        .fillColor(COLORS.text)
        .font('Regular')
        .fontSize(10)
        .text(safe(v2), 48 + col + 12, startY + 11, { width: col });
      const h2 = doc.y;
      y = Math.max(h1, h2) + 10;
    };

    const drawParagraph = (label, value) => {
      if (y > 740) {
        doc.addPage();
        y = 48;
      }
      doc
        .fillColor(COLORS.muted)
        .font('Regular')
        .fontSize(8)
        .text(label.toUpperCase(), 48, y, { width: contentW });
      doc
        .fillColor(COLORS.text)
        .font('Regular')
        .fontSize(10)
        .text(safe(value), 48, y + 11, { width: contentW, align: 'justify' });
      y = doc.y + 12;
    };

    // 1. Shaxsiy
    drawSection('1. Shaxsiy maʼlumotlar');
    drawTwoCol('F.I.Sh.', data.fullName, 'Tugʻilgan sana', data.birthDate);
    drawTwoCol('Yoshi', data.age, 'Telefon', data.phone);
    drawTwoCol('Elektron pochta', data.email, 'Manzil', data.address);

    // 2. Ta'lim
    drawSection('2. Taʼlim');
    if (data.noEducation) {
      drawRow('Holat', "Oʻqimagan / maxsus taʼlim yoʻq");
    } else {
      drawRow('Taʼlim muassasasi', data.educationInstitution);
      drawTwoCol('Bitirgan yili', data.graduationYear, 'Mutaxassisligi', data.specialty);
      drawRow('Diplom seriyasi va raqami', data.diplomaNumber);
    }

    // 3. Ish tajribasi
    drawSection('3. Ish tajribasi');
    if (data.noExperience) {
      drawRow('Holat', "Ish tajribasi yoʻq");
    } else {
      drawTwoCol('Oxirgi ish joyi', data.lastWorkplace, 'Lavozimi', data.position);
      drawTwoCol('Ish staji (yil)', data.experienceYears, 'Ishdan ketish sababi', data.leaveReason);
    }

    // 4. Qo'shimcha
    drawSection('4. Qoʻshimcha maʼlumotlar');
    drawTwoCol(
      'Kompyuter koʻnikmasi',
      labelMap({ yoq: "Yoʻq", ortacha: 'Oʻrtacha', yaxshi: 'Yaxshi' }, data.computerSkill),
      'Farmatsevtik dasturlar',
      data.pharmaPrograms === 'ha'
        ? `Ha${data.pharmaProgramsWhich ? ` — ${data.pharmaProgramsWhich}` : ''}`
        : labelMap({ yoq: "Yoʻq", ha: 'Ha' }, data.pharmaPrograms)
    );
    drawTwoCol(
      'JPP sertifikati',
      labelMap({ bor: 'Bor', yoq: "Yoʻq" }, data.jppCertificate),
      'Dori vositalari bilimi',
      labelMap(
        { boshlangich: "Boshlangʻich", orta: "Oʻrta", yuqori: 'Yuqori' },
        data.medicineKnowledge
      )
    );
    drawRow(
      'Chet tillari',
      data.noForeignLanguages ? 'Bilmayman' : data.foreignLanguages
    );

    const quals = [];
    if (data.qualities?.responsible) quals.push('Masʼuliyatli');
    if (data.qualities?.customerCare) quals.push('Mijozlarga eʼtiborli');
    if (data.qualities?.hardworking) quals.push('Tirishqoq');
    if (data.qualities?.cleanliness) quals.push('Tozalik va tartib');
    if (data.qualities?.teamwork) quals.push('Jamoada ishlay oladi');
    drawRow('Shaxsiy sifatlar', quals.length ? quals.join(', ') : '—');

    // 5. Motivatsiya
    drawSection('5. Motivatsiya va afzalliklar');
    drawParagraph('Nima uchun bizning dorixonada ishlashni xohlaysiz?', data.whyUs);
    drawTwoCol(
      'Afzal smena',
      labelMap(
        {
          ertalabki: 'Ertalabki',
          kechki: 'Kechki',
          navbat: 'Navbatma-navbat',
          farqi_yoq: 'Farqi yoq',
        },
        data.shiftPreference
      ),
      'Maosh sorovi',
      data.salaryNegotiable ? 'Kelishiladi' : data.salaryRequest
    );
    if (data.additionalNotes) {
      drawParagraph('Qoʻshimcha izoh', data.additionalNotes);
    }

    // 6. Hujjatlar
    drawSection('6. Hujjatlar');
    if (data.noDocuments) {
      drawRow('Holat', 'Hozircha yuklanmagan');
    } else {
      const docs = [];
      if (data.hasPassport) docs.push('Pasport nusxasi');
      if (data.hasDiploma) docs.push('Diplom nusxasi');
      if (data.hasResume) docs.push('Rezyume');
      drawRow('Biriktirilgan / mavjud', docs.length ? docs.join(', ') : "Ko'rsatilmagan");
    }

    // 7. Kasbiy
    drawSection('7. Kasbiy bilimlar (test)');
    if (data.skipKnowledge) {
      drawRow('Holat', "O'tkazib yuborilgan");
    } else {
      const questions = [
        ['8. Biseptol — qaysi guruh?', data.q8],
        ['9. Terafleks va Terafleks Ultra farqi', data.q9],
        ['10. APF ingibitorlari', data.q10],
        ['11. «Uno» qoshimchasi nima anglatadi?', data.q11],
        ['12. Geptral tarkibi', data.q12],
        ['13. Litik aralashma tarkibi', data.q13],
        ['14. Antigistamin guruhidagi dorilar', data.q14],
        ['15. Analog va almashtirish (misol bilan)', data.q15],
      ];
      for (const [q, a] of questions) {
        drawParagraph(q, a);
      }
    }

    // Footer
    if (y > 700) {
      doc.addPage();
      y = 48;
    }
    y += 8;
    doc
      .moveTo(48, y)
      .lineTo(48 + contentW, y)
      .strokeColor(COLORS.line)
      .stroke();
    y += 16;
    doc
      .fillColor(COLORS.muted)
      .font('Regular')
      .fontSize(9)
      .text(
        `Sana: ${today}                                          Imzo: ____________________`,
        48,
        y,
        { width: contentW }
      );
    y += 28;
    doc
      .fontSize(8)
      .fillColor(COLORS.accent)
      .text('VAKSINA MED · onlayn anketa orqali avtomatik yaratilgan.', 48, y, {
        width: contentW,
        align: 'center',
      });

    doc.end();
  });
}
