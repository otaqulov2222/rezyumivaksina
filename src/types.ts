export type ComputerSkill = 'yoq' | 'ortacha' | 'yaxshi' | '';
export type PharmaPrograms = 'yoq' | 'ha' | '';
export type JppCert = 'bor' | 'yoq' | '';
export type MedicineKnowledge = 'boshlangich' | 'orta' | 'yuqori' | '';
export type ShiftPref = 'ertalabki' | 'kechki' | 'navbat' | 'farqi_yoq' | '';

export interface FormData {
  // 1. Shaxsiy
  fullName: string;
  birthDate: string;
  age: string;
  address: string;
  phone: string;
  email: string;

  // 2. Ta'lim
  noEducation: boolean;
  educationInstitution: string;
  graduationYear: string;
  specialty: string;
  diplomaNumber: string;

  // 3. Ish tajribasi
  noExperience: boolean;
  lastWorkplace: string;
  position: string;
  experienceYears: string;
  leaveReason: string;

  // 4. Qo'shimcha
  computerSkill: ComputerSkill;
  pharmaPrograms: PharmaPrograms;
  pharmaProgramsWhich: string;
  jppCertificate: JppCert;
  noForeignLanguages: boolean;
  foreignLanguages: string;
  medicineKnowledge: MedicineKnowledge;

  // 5. Shaxsiy sifatlar
  qualities: {
    responsible: boolean;
    customerCare: boolean;
    hardworking: boolean;
    cleanliness: boolean;
    teamwork: boolean;
  };

  // 6. Qo'shimcha savollar
  whyUs: string;
  shiftPreference: ShiftPref;
  salaryNegotiable: boolean;
  salaryRequest: string;
  additionalNotes: string;

  // 7. Hujjatlar
  noDocuments: boolean;
  hasPassport: boolean;
  hasDiploma: boolean;
  hasResume: boolean;

  // 8–15 Kasbiy bilimlar
  skipKnowledge: boolean;
  q8: string;
  q9: string;
  q10: string;
  q11: string;
  q12: string;
  q13: string;
  q14: string;
  q15: string;
}

export const initialFormData: FormData = {
  fullName: '',
  birthDate: '',
  age: '',
  address: '',
  phone: '',
  email: '',
  noEducation: false,
  educationInstitution: '',
  graduationYear: '',
  specialty: '',
  diplomaNumber: '',
  noExperience: false,
  lastWorkplace: '',
  position: '',
  experienceYears: '',
  leaveReason: '',
  computerSkill: '',
  pharmaPrograms: '',
  pharmaProgramsWhich: '',
  jppCertificate: '',
  noForeignLanguages: false,
  foreignLanguages: '',
  medicineKnowledge: '',
  qualities: {
    responsible: false,
    customerCare: false,
    hardworking: false,
    cleanliness: false,
    teamwork: false,
  },
  whyUs: '',
  shiftPreference: '',
  salaryNegotiable: false,
  salaryRequest: '',
  additionalNotes: '',
  noDocuments: false,
  hasPassport: false,
  hasDiploma: false,
  hasResume: false,
  skipKnowledge: false,
  q8: '',
  q9: '',
  q10: '',
  q11: '',
  q12: '',
  q13: '',
  q14: '',
  q15: '',
};

export const STEPS = [
  { id: 1, title: 'Shaxsiy maʼlumotlar', short: 'Shaxsiy' },
  { id: 2, title: 'Taʼlim', short: 'Taʼlim' },
  { id: 3, title: 'Ish tajribasi', short: 'Tajriba' },
  { id: 4, title: 'Qoʻshimcha maʼlumotlar', short: 'Qoʻshimcha' },
  { id: 5, title: 'Motivatsiya', short: 'Motivatsiya' },
  { id: 6, title: 'Hujjatlar', short: 'Hujjatlar' },
  { id: 7, title: 'Kasbiy bilimlar', short: 'Bilimlar' },
  { id: 8, title: 'Tekshirish', short: 'Yuborish' },
] as const;
