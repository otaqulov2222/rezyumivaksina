import type { FormData as AppFormData } from '../types';

interface Props {
  data: AppFormData;
  onChange: (patch: Partial<AppFormData>) => void;
}

export function StepEducation({ data, onChange }: Props) {
  return (
    <div className="step-body">
      <h2>Taʼlim</h2>
      <p className="step-lead">Oliy yoki oʻrta maxsus taʼlim maʼlumotlari.</p>

      <label className="field">
        <span>Taʼlim muassasasi nomi</span>
        <input
          value={data.educationInstitution}
          onChange={(e) => onChange({ educationInstitution: e.target.value })}
          placeholder="Masalan: Toshkent farmatsevtika instituti"
        />
      </label>

      <div className="grid-2">
        <label className="field">
          <span>Bitirgan yili</span>
          <input
            value={data.graduationYear}
            onChange={(e) => onChange({ graduationYear: e.target.value })}
            placeholder="2020"
          />
        </label>
        <label className="field">
          <span>Mutaxassisligi</span>
          <input
            value={data.specialty}
            onChange={(e) => onChange({ specialty: e.target.value })}
            placeholder="Farmatsiya"
          />
        </label>
      </div>

      <label className="field">
        <span>Diplom seriyasi va raqami</span>
        <input
          value={data.diplomaNumber}
          onChange={(e) => onChange({ diplomaNumber: e.target.value })}
          placeholder="AA № 0000000"
        />
      </label>
    </div>
  );
}
