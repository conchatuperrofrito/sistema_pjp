import { DateValue } from "@nextui-org/react";
import { PrescriptionForm } from "./appointmentInterfaces";

export interface AnamnesisFormData {
  diseaseDuration: string;
  onsetType: string;
  course: string;
  symptomsSigns: string;
  clinicalStory: string;
  appetite: string;
  thirst: string;
  urine: string;
  stool: string;
  weight: string;
  sleep: string;
}

export interface DiagnosisCodeOptionData {
  code: string;
  description: string;
  classification: "category" | "subcategory";
};

export interface DiagnosisFormData {
  description: string;
  clinicalCriteria?: string;
  diagnosisCodes: DiagnosisCode[];
}

export interface DiagnosisCode extends DiagnosisCodeOptionData {
  id: string;
  type: "Definitivo" | "Presuntivo" | "Provisional";
  case: "Nuevo" | "Repetido" | "Recidiva" | "Secuela" | "Complicación";
  dischargeFlag: "Sí" | "No";
}

export interface TherapeuticPlanFormData {
  treatment: string;
  lifeStyleInstructions: string;
}

export interface PrescriptionMedicationFormData {
  id: string;
  genericName: string;
  concentration: string;
  presentation: string;
  dosageForm: string;
  dosageDescription: string;
  duration: string;
  frequency: string;
  instructions: string;
}

export interface PrescriptionFormData {
  medications: MedicationFormData[];
  notes: string;
}

export interface ConsultationClosureFormData {
  summary: string;
  instructions?: string;
  nextAppointmentDate?: string;
}

export interface MedicalEvaluationForm {
  appointmentId: string;
  anamnesis: AnamnesisFormData;
  diagnosis: DiagnosisFormData;
  therapeuticPlan: TherapeuticPlanFormData;
  prescription: PrescriptionFormData;
  consultationClosure: ConsultationClosureFormData;
}

interface DentalEvolution {
    id?: string;
    date: string;
    odontogram: string;
    specifications: string;
    observations: string;
    basicDentalDischarge: string;
}

interface DentalEvolutionForm extends DentalEvolution {
    date: DateValue | null;
    appointmentId?: string;
    odontogramHtml: string;
    basicDentalDischarge: DateValue | null;
    prescription?: PrescriptionForm;
}

interface ToothPart {
    name: string;
    status: string;
  }

  interface Tooth {
    number: number;
    quadrant: number;
    type: string;
    status: string;
    position: string;
    parts: {
      oclusal: ToothPart;
      distal: ToothPart;
      palatina: ToothPart;
      mesial: ToothPart;
      vestibular: ToothPart;
    };
  }

  type OdontogramData = Tooth[][];
