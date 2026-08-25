import type { FormData as AppFormData } from '../types';

interface Props {
  data: AppFormData;
  onChange: (patch: Partial<AppFormData>) => void;
}

const QUESTIONS: { key: keyof AppFormData; text: string }[] = [
  { key: 'q8', text: '8. Biseptol tabletka — preparati qaysi guruhga kiradi?' },
  {
    key: 'q9',
    text: '9. Terafleks bilan Terafleks Ultra — dori vositalarining farqini ayting?',
  },
  {
    key: 'q10',
    text: '10. APF (angiotenzin aylantiruvchi ferment) ingibitorlariga kiruvchi preparatlar nomini sanab oʻting?',
  },
  { key: 'q11', text: '11. «Uno» qoʻshimchasi preparatlarda nimani anglatadi?' },
  { key: 'q12', text: '12. Geptral preparatining tarkibi?' },
  { key: 'q13', text: '13. Litik aralashma tarkibiga qanday dori vositalari kiradi?' },
  { key: 'q14', text: '14. Antigistamin guruhiga qanday dori vositalari kiradi?' },
  {
    key: 'q15',
    text: '15. Analog va almashtirish deganda nimani tushunasiz? Dorilarda misol keltiring?',
  },
];

export function StepKnowledge({ data, onChange }: Props) {
  return (
    <div className="step-body">
      <h2>Kasbiy bilimlar</h2>
      <p className="step-lead">Farmatsevtik bilimingizni qisqa javoblar bilan koʻrsating.</p>

      {QUESTIONS.map((q) => (
        <label key={q.key} className="field">
          <span>{q.text}</span>
          <textarea
            rows={2}
            value={String(data[q.key] ?? '')}
            onChange={(e) => onChange({ [q.key]: e.target.value } as Partial<AppFormData>)}
            placeholder="Javobingiz..."
          />
        </label>
      ))}
    </div>
  );
}
