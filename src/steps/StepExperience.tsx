import type { FormData as AppFormData } from '../types';

interface Props {
  data: AppFormData;
  onChange: (patch: Partial<AppFormData>) => void;
}

export function StepExperience({ data, onChange }: Props) {
  const toggleNoExp = () => {
    const next = !data.noExperience;
    onChange({
      noExperience: next,
      ...(next
        ? {
            lastWorkplace: '',
            position: '',
            experienceYears: '',
            leaveReason: '',
          }
        : {}),
    });
  };

  return (
    <div className="step-body">
      <h2>Ish tajribasi</h2>
      <p className="step-lead">Ishlagan boʻlsangiz toʻldiring, yoʻq boʻlsa belgilang.</p>

      <label className="skip-row">
        <input type="checkbox" checked={data.noExperience} onChange={toggleNoExp} />
        <span>
          <strong>Ish tajribasi yoʻq</strong>
          <em>Hali ishlamaganman / yangi mutaxassis</em>
        </span>
      </label>

      {!data.noExperience && (
        <>
          <label className="field">
            <span>Oxirgi ish joyi</span>
            <input
              value={data.lastWorkplace}
              onChange={(e) => onChange({ lastWorkplace: e.target.value })}
              placeholder="Dorixona / kompaniya nomi"
            />
          </label>

          <div className="grid-2">
            <label className="field">
              <span>Lavozimi</span>
              <input
                value={data.position}
                onChange={(e) => onChange({ position: e.target.value })}
                placeholder="Farmatsevt"
              />
            </label>
            <label className="field">
              <span>Ish staji (yil)</span>
              <input
                value={data.experienceYears}
                onChange={(e) => onChange({ experienceYears: e.target.value })}
                placeholder="3"
              />
            </label>
          </div>

          <label className="field">
            <span>Ishdan ketish sababi</span>
            <textarea
              rows={3}
              value={data.leaveReason}
              onChange={(e) => onChange({ leaveReason: e.target.value })}
              placeholder="Qisqacha yozing..."
            />
          </label>
        </>
      )}
    </div>
  );
}
