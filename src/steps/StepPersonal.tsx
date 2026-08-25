import type { FormData as AppFormData } from '../types';

interface Props {
  data: AppFormData;
  onChange: (patch: Partial<AppFormData>) => void;
}

export function StepPersonal({ data, onChange }: Props) {
  return (
    <div className="step-body">
      <h2>Shaxsiy maʼlumotlar</h2>
      <p className="step-lead">Nomzodning asosiy kontakt va shaxsiy maʼlumotlari.</p>

      <label className="field">
        <span>F.I.Sh. *</span>
        <input
          value={data.fullName}
          onChange={(e) => onChange({ fullName: e.target.value })}
          placeholder="Familiya Ism Sharif"
          required
        />
      </label>

      <div className="grid-2">
        <label className="field">
          <span>Tugʻilgan sana</span>
          <input
            type="date"
            value={data.birthDate}
            onChange={(e) => onChange({ birthDate: e.target.value })}
          />
        </label>
        <label className="field">
          <span>Yoshi</span>
          <input
            type="number"
            min={16}
            max={70}
            value={data.age}
            onChange={(e) => onChange({ age: e.target.value })}
            placeholder="masalan: 28"
          />
        </label>
      </div>

      <label className="field">
        <span>Manzili</span>
        <input
          value={data.address}
          onChange={(e) => onChange({ address: e.target.value })}
          placeholder="Viloyat, tuman, koʻcha"
        />
      </label>

      <div className="grid-2">
        <label className="field">
          <span>Telefon raqami *</span>
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            placeholder="+998 XX XXX XX XX"
            required
          />
        </label>
        <label className="field">
          <span>Elektron pochta</span>
          <input
            type="email"
            value={data.email}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="email@example.com"
          />
        </label>
      </div>
    </div>
  );
}
