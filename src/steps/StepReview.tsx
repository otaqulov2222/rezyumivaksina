import type { FormData as AppFormData } from '../types';
import type { DocFiles } from './StepDocuments';

interface Props {
  data: AppFormData;
  files: DocFiles;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="review-row">
      <dt>{label}</dt>
      <dd>{value || '—'}</dd>
    </div>
  );
}

export function StepReview({ data, files }: Props) {
  const quals = [
    data.qualities.responsible && 'Masʼuliyatli',
    data.qualities.customerCare && 'Mijozlarga eʼtiborli',
    data.qualities.hardworking && 'Tirishqoq',
    data.qualities.cleanliness && 'Tozalik va tartib',
    data.qualities.teamwork && 'Jamoada ishlay oladi',
  ].filter(Boolean) as string[];

  const docs = data.noDocuments
    ? ['Hozircha yuklanmagan']
    : ([
        data.hasPassport && `Pasport${files.passport ? ` (${files.passport.name})` : ''}`,
        data.hasDiploma && `Diplom${files.diploma ? ` (${files.diploma.name})` : ''}`,
        data.hasResume && `Rezyume${files.resume ? ` (${files.resume.name})` : ''}`,
      ].filter(Boolean) as string[]);

  const shift =
    data.shiftPreference === 'ertalabki'
      ? 'Ertalabki'
      : data.shiftPreference === 'kechki'
        ? 'Kechki'
        : data.shiftPreference === 'navbat'
          ? 'Navbatma-navbat'
          : data.shiftPreference === 'farqi_yoq'
            ? 'Farqi yoʻq'
            : '';

  return (
    <div className="step-body">
      <h2>Tekshirish va yuborish</h2>
      <p className="step-lead">
        Maʼlumotlarni koʻrib chiqing. Yuborilganda professional PDF rezyume Telegramga keladi.
      </p>

      <dl className="review-block">
        <h3>Shaxsiy</h3>
        <Row label="F.I.Sh." value={data.fullName} />
        <Row label="Telefon" value={data.phone} />
        <Row label="Email" value={data.email} />
        <Row label="Manzil" value={data.address} />
      </dl>

      <dl className="review-block">
        <h3>Taʼlim va tajriba</h3>
        <Row
          label="Taʼlim"
          value={
            data.noEducation
              ? 'Oʻqimagan / maxsus taʼlim yoʻq'
              : [data.educationInstitution, data.specialty].filter(Boolean).join(' — ')
          }
        />
        <Row
          label="Tajriba"
          value={
            data.noExperience
              ? 'Ish tajribasi yoʻq'
              : [data.lastWorkplace, data.position, data.experienceYears && `${data.experienceYears} yil`]
                  .filter(Boolean)
                  .join(' / ')
          }
        />
      </dl>

      <dl className="review-block">
        <h3>Qoʻshimcha</h3>
        <Row label="Sifatlar" value={quals.join(', ')} />
        <Row label="Smena" value={shift} />
        <Row
          label="Maosh"
          value={data.salaryNegotiable ? 'Kelishiladi' : data.salaryRequest}
        />
        <Row label="Hujjatlar" value={docs.join(', ')} />
        <Row
          label="Kasbiy test"
          value={data.skipKnowledge ? 'Oʻtkazib yuborilgan' : 'Javoblar kiritilgan'}
        />
      </dl>
    </div>
  );
}
