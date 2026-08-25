import type { FormData as AppFormData } from '../types';

interface Props {
  data: AppFormData;
  onChange: (patch: Partial<AppFormData>) => void;
}

export function StepAdditional({ data, onChange }: Props) {
  const toggleQuality = (key: keyof AppFormData['qualities']) => {
    onChange({
      qualities: { ...data.qualities, [key]: !data.qualities[key] },
    });
  };

  return (
    <div className="step-body">
      <h2>Qoʻshimcha maʼlumotlar</h2>
      <p className="step-lead">Koʻnikmalar, sertifikatlar va shaxsiy sifatlar.</p>

      <fieldset className="choice-group">
        <legend>Kompyuter bilan ishlash koʻnikmasi</legend>
        <label className="chip">
          <input
            type="radio"
            name="computer"
            checked={data.computerSkill === 'yoq'}
            onChange={() => onChange({ computerSkill: 'yoq' })}
          />
          Yoʻq
        </label>
        <label className="chip">
          <input
            type="radio"
            name="computer"
            checked={data.computerSkill === 'ortacha'}
            onChange={() => onChange({ computerSkill: 'ortacha' })}
          />
          Oʻrtacha
        </label>
        <label className="chip">
          <input
            type="radio"
            name="computer"
            checked={data.computerSkill === 'yaxshi'}
            onChange={() => onChange({ computerSkill: 'yaxshi' })}
          />
          Yaxshi
        </label>
      </fieldset>

      <fieldset className="choice-group">
        <legend>Farmatsevtik dasturlardan foydalanish</legend>
        <label className="chip">
          <input
            type="radio"
            name="pharma"
            checked={data.pharmaPrograms === 'yoq'}
            onChange={() => onChange({ pharmaPrograms: 'yoq', pharmaProgramsWhich: '' })}
          />
          Yoʻq
        </label>
        <label className="chip">
          <input
            type="radio"
            name="pharma"
            checked={data.pharmaPrograms === 'ha'}
            onChange={() => onChange({ pharmaPrograms: 'ha' })}
          />
          Ha
        </label>
      </fieldset>

      {data.pharmaPrograms === 'ha' && (
        <label className="field">
          <span>Qaysi dasturlar?</span>
          <input
            value={data.pharmaProgramsWhich}
            onChange={(e) => onChange({ pharmaProgramsWhich: e.target.value })}
            placeholder="Masalan: 1C, MDX, FarmSoft..."
          />
        </label>
      )}

      <fieldset className="choice-group">
        <legend>JPP sertifikatingiz bormi?</legend>
        <label className="chip">
          <input
            type="radio"
            name="jpp"
            checked={data.jppCertificate === 'bor'}
            onChange={() => onChange({ jppCertificate: 'bor' })}
          />
          Bor
        </label>
        <label className="chip">
          <input
            type="radio"
            name="jpp"
            checked={data.jppCertificate === 'yoq'}
            onChange={() => onChange({ jppCertificate: 'yoq' })}
          />
          Yoʻq
        </label>
      </fieldset>

      <label className="field">
        <span>Chet tillarini bilish darajasi</span>
        <input
          value={data.foreignLanguages}
          onChange={(e) => onChange({ foreignLanguages: e.target.value })}
          placeholder="Masalan: Ingliz — oʻrta, Rus — erkin"
        />
      </label>

      <fieldset className="choice-group">
        <legend>Dori vositalari haqida bilim darajasi</legend>
        <label className="chip">
          <input
            type="radio"
            name="med"
            checked={data.medicineKnowledge === 'boshlangich'}
            onChange={() => onChange({ medicineKnowledge: 'boshlangich' })}
          />
          Boshlangʻich
        </label>
        <label className="chip">
          <input
            type="radio"
            name="med"
            checked={data.medicineKnowledge === 'orta'}
            onChange={() => onChange({ medicineKnowledge: 'orta' })}
          />
          Oʻrta
        </label>
        <label className="chip">
          <input
            type="radio"
            name="med"
            checked={data.medicineKnowledge === 'yuqori'}
            onChange={() => onChange({ medicineKnowledge: 'yuqori' })}
          />
          Yuqori
        </label>
      </fieldset>

      <fieldset className="choice-group checks">
        <legend>Shaxsiy sifatlar (belgilang)</legend>
        {(
          [
            ['responsible', 'Masʼuliyatli'],
            ['customerCare', 'Mijozlarga eʼtiborli'],
            ['hardworking', 'Tirishqoq'],
            ['cleanliness', 'Tozalik va tartibni saqlaydi'],
            ['teamwork', 'Jamoada ishlay oladi'],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="check-row">
            <input
              type="checkbox"
              checked={data.qualities[key]}
              onChange={() => toggleQuality(key)}
            />
            {label}
          </label>
        ))}
      </fieldset>
    </div>
  );
}
