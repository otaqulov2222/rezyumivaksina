import type { FormData as AppFormData } from '../types';

interface Props {
  data: AppFormData;
  onChange: (patch: Partial<AppFormData>) => void;
}

export function StepMotivation({ data, onChange }: Props) {
  return (
    <div className="step-body">
      <h2>Motivatsiya</h2>
      <p className="step-lead">Nima uchun aynan shu dorixona va qanday sharoitda ishlamoqchisiz.</p>

      <label className="field">
        <span>Nima uchun bizning dorixonada ishlashni xohlaysiz?</span>
        <textarea
          rows={4}
          value={data.whyUs}
          onChange={(e) => onChange({ whyUs: e.target.value })}
          placeholder="Javobingizni yozing... (ixtiyoriy)"
        />
      </label>

      <fieldset className="choice-group">
        <legend>Qaysi smenada ishlashni afzal koʻrasiz?</legend>
        <label className="chip">
          <input
            type="radio"
            name="shift"
            checked={data.shiftPreference === 'ertalabki'}
            onChange={() => onChange({ shiftPreference: 'ertalabki' })}
          />
          Ertalabki
        </label>
        <label className="chip">
          <input
            type="radio"
            name="shift"
            checked={data.shiftPreference === 'kechki'}
            onChange={() => onChange({ shiftPreference: 'kechki' })}
          />
          Kechki
        </label>
        <label className="chip">
          <input
            type="radio"
            name="shift"
            checked={data.shiftPreference === 'navbat'}
            onChange={() => onChange({ shiftPreference: 'navbat' })}
          />
          Navbatma-navbat
        </label>
        <label className="chip">
          <input
            type="radio"
            name="shift"
            checked={data.shiftPreference === 'farqi_yoq'}
            onChange={() => onChange({ shiftPreference: 'farqi_yoq' })}
          />
          Farqi yoʻq
        </label>
      </fieldset>

      <label className="skip-row">
        <input
          type="checkbox"
          checked={data.salaryNegotiable}
          onChange={() =>
            onChange({
              salaryNegotiable: !data.salaryNegotiable,
              salaryRequest: !data.salaryNegotiable ? '' : data.salaryRequest,
            })
          }
        />
        <span>
          <strong>Maosh kelishiladi</strong>
          <em>Aniq summa aytmayman</em>
        </span>
      </label>

      {!data.salaryNegotiable && (
        <label className="field">
          <span>Maosh boʻyicha soʻrovingiz</span>
          <input
            value={data.salaryRequest}
            onChange={(e) => onChange({ salaryRequest: e.target.value })}
            placeholder="Masalan: 4 000 000 soʻm"
          />
        </label>
      )}

      <label className="field">
        <span>Qoʻshimcha izoh (ixtiyoriy)</span>
        <textarea
          rows={3}
          value={data.additionalNotes}
          onChange={(e) => onChange({ additionalNotes: e.target.value })}
          placeholder="Qoʻshimcha aytmoqchi boʻlganlaringiz..."
        />
      </label>
    </div>
  );
}
