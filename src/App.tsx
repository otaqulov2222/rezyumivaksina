import { useState } from 'react';
import { ProgressBar } from './components/ProgressBar';
import { STEPS, initialFormData, type FormData as AppFormData } from './types';
import { StepPersonal } from './steps/StepPersonal';
import { StepEducation } from './steps/StepEducation';
import { StepExperience } from './steps/StepExperience';
import { StepAdditional } from './steps/StepAdditional';
import { StepMotivation } from './steps/StepMotivation';
import { StepDocuments, type DocFiles } from './steps/StepDocuments';
import { StepKnowledge } from './steps/StepKnowledge';
import { StepReview } from './steps/StepReview';
import './App.css';

const emptyFiles: DocFiles = { passport: null, diploma: null, resume: null };

export default function App() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<AppFormData>(initialFormData);
  const [files, setFiles] = useState<DocFiles>(emptyFiles);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const patch = (p: Partial<AppFormData>) => setData((d) => ({ ...d, ...p }));
  const patchFiles = (p: Partial<DocFiles>) => setFiles((f) => ({ ...f, ...p }));

  const validateStep = () => {
    if (step === 1) {
      if (!data.fullName.trim() || !data.phone.trim()) {
        setError('F.I.Sh. va telefon raqami majburiy.');
        return false;
      }
    }
    setError('');
    return true;
  };

  const next = () => {
    if (!validateStep()) return;
    setStep((s) => Math.min(s + 1, STEPS.length));
  };

  const back = () => {
    setError('');
    setStep((s) => Math.max(s - 1, 1));
  };

  const submit = async () => {
    if (!validateStep()) return;
    setSubmitting(true);
    setError('');
    try {
      const body = new FormData();
      body.append('data', JSON.stringify(data));
      if (files.passport) body.append('passport', files.passport);
      if (files.diploma) body.append('diploma', files.diploma);
      if (files.resume) body.append('resume', files.resume);

      const res = await fetch('/api/submit', { method: 'POST', body });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error || 'Yuborishda xatolik');
      }
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Yuborishda xatolik');
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="page">
        <div className="atmosphere" aria-hidden>
          <span className="orb orb-a" />
          <span className="orb orb-b" />
          <span className="orb orb-c" />
          <span className="ring ring-a" />
          <span className="ring ring-b" />
          <span className="beam" />
          <span className="mesh" />
        </div>
        <main className="shell success-shell">
          <div className="brand-lockup">
            <img className="brand-logo" src="/logo.png?v=3" alt="VAKSINA MED" />
          </div>
          <h1>Anketa yuborildi</h1>
          <p className="lede">
            Rahmat, {data.fullName.split(' ')[0] || 'nomzod'}! Maʼlumotlaringiz professional PDF
            koʻrinishida Telegramga yetkazildi.
          </p>
          <button
            type="button"
            className="btn primary"
            onClick={() => {
              setDone(false);
              setStep(1);
              setData(initialFormData);
              setFiles(emptyFiles);
            }}
          >
            Yangi anketa
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="atmosphere" aria-hidden>
        <span className="orb orb-a" />
        <span className="orb orb-b" />
        <span className="orb orb-c" />
        <span className="ring ring-a" />
        <span className="ring ring-b" />
        <span className="beam" />
        <span className="mesh" />
      </div>

      <header className="hero">
        <div className="brand-lockup">
          <img className="brand-logo" src="/logo.png?v=3" alt="VAKSINA MED" />
        </div>
        <h1>Farmatsevt anketasi</h1>
        <p className="lede">
          Qogʻozsiz ariza — bosqichma-bosqich toʻldiring, rezyumeingiz PDF shaklida qabul
          qilinadi.
        </p>
      </header>

      <main className="shell">
        <ProgressBar step={step} total={STEPS.length} titles={STEPS} />

        <div className="panel" key={step}>
          {step === 1 && <StepPersonal data={data} onChange={patch} />}
          {step === 2 && <StepEducation data={data} onChange={patch} />}
          {step === 3 && <StepExperience data={data} onChange={patch} />}
          {step === 4 && <StepAdditional data={data} onChange={patch} />}
          {step === 5 && <StepMotivation data={data} onChange={patch} />}
          {step === 6 && (
            <StepDocuments data={data} onChange={patch} files={files} onFiles={patchFiles} />
          )}
          {step === 7 && <StepKnowledge data={data} onChange={patch} />}
          {step === 8 && <StepReview data={data} files={files} />}
        </div>

        {error && <p className="error">{error}</p>}

        <div className="nav-row">
          <button type="button" className="btn ghost" onClick={back} disabled={step === 1 || submitting}>
            Orqaga
          </button>
          {step < STEPS.length ? (
            <button type="button" className="btn primary" onClick={next}>
              Davom etish
            </button>
          ) : (
            <button type="button" className="btn primary" onClick={submit} disabled={submitting}>
              {submitting ? 'Yuborilmoqda...' : 'Anketani yuborish'}
            </button>
          )}
        </div>
      </main>

      <footer className="foot">Barcha maydonlar ishonchli saqlanadi · FAQ 90–120 soniya</footer>
    </div>
  );
}
