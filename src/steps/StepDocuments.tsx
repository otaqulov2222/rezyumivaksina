import type { FormData as AppFormData } from '../types';

export interface DocFiles {
  passport: File | null;
  diploma: File | null;
  resume: File | null;
}

interface Props {
  data: AppFormData;
  onChange: (patch: Partial<AppFormData>) => void;
  files: DocFiles;
  onFiles: (patch: Partial<DocFiles>) => void;
}

function FilePick({
  label,
  file,
  onFile,
  checked,
  onChecked,
}: {
  label: string;
  file: File | null;
  onFile: (f: File | null) => void;
  checked: boolean;
  onChecked: (v: boolean) => void;
}) {
  return (
    <div className="file-card">
      <label className="check-row">
        <input type="checkbox" checked={checked} onChange={(e) => onChecked(e.target.checked)} />
        {label}
      </label>
      <label className="file-btn">
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          onChange={(e) => {
            const f = e.target.files?.[0] ?? null;
            onFile(f);
            if (f) onChecked(true);
          }}
        />
        {file ? file.name : 'Fayl yuklash'}
      </label>
    </div>
  );
}

export function StepDocuments({ data, onChange, files, onFiles }: Props) {
  return (
    <div className="step-body">
      <h2>Hujjatlar</h2>
      <p className="step-lead">
        Mavjud hujjatlarni belgilang va imkon boʻlsa faylini yuklang (PDF yoki rasm).
      </p>

      <FilePick
        label="Pasport nusxasi"
        file={files.passport}
        onFile={(f) => onFiles({ passport: f })}
        checked={data.hasPassport}
        onChecked={(v) => onChange({ hasPassport: v })}
      />
      <FilePick
        label="Diplom nusxasi"
        file={files.diploma}
        onFile={(f) => onFiles({ diploma: f })}
        checked={data.hasDiploma}
        onChecked={(v) => onChange({ hasDiploma: v })}
      />
      <FilePick
        label="Rezyume (agar boʻlsa)"
        file={files.resume}
        onFile={(f) => onFiles({ resume: f })}
        checked={data.hasResume}
        onChecked={(v) => onChange({ hasResume: v })}
      />
    </div>
  );
}
