import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  AppointmentForm,
  ClinicalExamForm,
  BasicPatientInfo
} from "@/types/appointmentInterfaces";
import {
  DentalEvolutionForm,
  AnamnesisFormData,
  DiagnosisFormData,
  TherapeuticPlanFormData,
  PrescriptionFormData,
  ConsultationClosureFormData
} from "@/types/doctorInterfaces";
import { getBasicPatientInfo } from "@/services/appointmentService";
import { PatientOption } from "@/types/patientInterfaces";

type appointmentStatus = "Pendiente" | "Realizada" | "Cancelada" | "Programada" | "";

type SelectedForm =
    | "appointment-form"
    | "clinical-exam-form"
    | "anamnesis-form"
    | "diagnosis-form"
    | "therapeutic-plan-form"
    | "consultation-closure-form"
    | "";

interface AppointmentStore {
    filters: { date: string, doctor: string, status: string };
    setFilters: (filters: { date: string, doctor: string, status: string }) => void;

    appointmentId: string;
    setAppointmentId: (id: string) => void;

    appointmentStatus: appointmentStatus;
    setAppointmentStatus: (status: appointmentStatus) => void;

    physicalExamId: string;
    setPhysicalExamId: (id: string) => void;

    appointmentForm: AppointmentForm;
    setAppointmentForm: (appointment: AppointmentForm) => void;

    appointmentModal: ModalHandlers;
    setAppointmentModal: (handlers: ModalHandlers) => void;

    clinicalExamForm: ClinicalExamForm;
    setClinicalExamForm: (clinicalExam: ClinicalExamForm) => void;

    anamnesisFormData: AnamnesisFormData,
    setAnamnesisFormData: (data: AnamnesisFormData) => void;

    diagnosisFormData: DiagnosisFormData,
    setDiagnosisFormData: (data: DiagnosisFormData) => void;

    therapeuticPlanFormData: TherapeuticPlanFormData,
    setTherapeuticPlanFormData: (data: TherapeuticPlanFormData) => void;

    prescriptionFormData: PrescriptionFormData,
    setPrescriptionFormData: (data: PrescriptionFormData) => void;

    consultationClosureFormData: ConsultationClosureFormData,
    setConsultationClosureFormData: (data: ConsultationClosureFormData) => void;

    selectedForm: SelectedForm;
    setSelectedForm: (form: SelectedForm) => void;

    resetForm: () => void;

    additionalData: {
        patientName: string;
        patientId: string;
        patientOptions: PatientOption[];
    };
    setAdditionalData: (
        data: Partial<{
            patientName: string;
            patientId: string;
            patientOptions: PatientOption[];
        }>
    ) => void;

    dentalEvolutionForm: DentalEvolutionForm;
    setDentalEvolutionForm: (evolution: DentalEvolutionForm) => void;

    basicPatientInfo: BasicPatientInfo;
    setBasicPatientInfo: (data: BasicPatientInfo) => void;
}

interface ModalHandlers {
    onOpen: () => void;
    onClose: () => void;
}

export const defaultAppointmentForm: AppointmentForm = {
  date: "",
  hour: "",
  patientId: "",
  doctorId: "",
  reason: ""
};

const defaultClinicalExamForm: ClinicalExamForm = {
  generalExam: "",
  physicalExam: {
    respiratoryRate: "",
    heartRate: "",
    temperature: "",
    bloodPressure: "",
    height: "",
    weight: "",
    bodyMassIndex: ""
  },
  regionalExam: {
    regionalExam: "",
    skin: "",
    eyes: "",
    ears: "",
    nose: "",
    mouth: "",
    throat: "",
    teeth: "",
    neck: "",
    thorax: "",
    lungs: "",
    heart: "",
    breasts: "",
    abdomen: "",
    urinary: "",
    lymphatic: "",
    vascular: "",
    locomotor: "",
    extremities: "",
    obituaries: "",
    higherFunctions: "",
    lowerFunctions: "",
    rectal: "",
    gynecological: ""
  }
};

const defaultDentalEvolutionForm: DentalEvolutionForm = {
  date: "",
  odontogram: "",
  specifications: "",
  observations: "",
  basicDentalDischarge: "",
  odontogramHtml: ""
};

export const defaultAnamnesisFormData: AnamnesisFormData = {
  diseaseDuration: "",
  onsetType: "",
  course: "",
  symptomsSigns: "",
  clinicalStory: "",
  appetite: "",
  thirst: "",
  urine: "",
  stool: "",
  weight: "",
  sleep: ""
};

export const defaultDiagnosisFormData: DiagnosisFormData = {
  description: "",
  clinicalCriteria: "",
  diagnosisCodes: []
};

export const defaultTherapeuticPlanFormData: TherapeuticPlanFormData = {
  treatment: "",
  lifeStyleInstructions: ""
};

export const defaultConsultationClosureFormData: ConsultationClosureFormData = {
  summary: "",
  instructions: "",
  nextAppointmentDate: ""
};

const defaultPrescriptionFormData: PrescriptionFormData = {
  medications: [],
  notes: ""
};

const basicPatientInfo: BasicPatientInfo = {
  fullName: "",
  documentNumber: "",
  documentType: "",
  age: "",
  sex: ""
};

export const useAppointmentStore = create<AppointmentStore>()(
  devtools((set, get) => ({
    filters: { date: "", doctor: "", status: "" },
    setFilters: (filters) => set({ filters }, false, "setFilters"),

    appointmentId: "",
    setAppointmentId: (id) => set({ appointmentId: id }, false, "setAppointmentId"),

    appointmentStatus: "",
    setAppointmentStatus: (status) =>
      set({ appointmentStatus: status }, false, "setAppointmentStatus"),

    physicalExamId: "",
    setPhysicalExamId: (id) => set({ physicalExamId: id }, false, "setPhysicalExamId"),

    appointmentForm: { ...defaultAppointmentForm },
    setAppointmentForm: (appointment) =>
      set({ appointmentForm: appointment }, false, "setAppointmentForm"),

    clinicalExamForm: { ...defaultClinicalExamForm },
    setClinicalExamForm: (clinicalExam) =>
      set({ clinicalExamForm: clinicalExam }, false, "setClinicalExamForm"),

    appointmentModal: { onOpen: () => {}, onClose: () => {} },
    setAppointmentModal: (handlers) =>
      set({ appointmentModal: handlers }, false, "setAppointmentModal"),

    anamnesisFormData: { ...defaultAnamnesisFormData },
    setAnamnesisFormData: (anamnesisFormData) =>
      set({ anamnesisFormData }, false, "setAnamnesisFormData"),

    diagnosisFormData: { ...defaultDiagnosisFormData },
    setDiagnosisFormData: (data) =>
      set( ({ diagnosisFormData: structuredClone(data) } ), false, "setDiagnosisFormData"),

    therapeuticPlanFormData: { ...defaultTherapeuticPlanFormData },
    setTherapeuticPlanFormData: (data) =>
      set({ therapeuticPlanFormData: data }, false, "setTherapeuticPlanFormData"),

    consultationClosureFormData: { ...defaultConsultationClosureFormData },
    setConsultationClosureFormData: (data) =>
      set({ consultationClosureFormData: data }, false, "setConsultationClosureFormData"),

    prescriptionFormData: { ...defaultPrescriptionFormData },
    setPrescriptionFormData: (data) =>
      set({ prescriptionFormData: structuredClone(data) }, false, "setPrescriptionFormData"),

    selectedForm: "",
    setSelectedForm: (form) =>
      set({ selectedForm: form }, false, "setSelectedForm"),

    basicPatientInfo: { ...basicPatientInfo },
    setBasicPatientInfo: (basicPatientInfo) =>
      set({ basicPatientInfo } , false, "setBasicPatientInfo"),

    resetForm: () =>
      set({
        appointmentForm: { ...defaultAppointmentForm },
        clinicalExamForm: { ...defaultClinicalExamForm },
        appointmentId: "",
        physicalExamId: "",
        additionalData: { patientName: "", patientId: "", patientOptions: [] },
        selectedForm: "",
        dentalEvolutionForm: { ...defaultDentalEvolutionForm },
        anamnesisFormData: { ...defaultAnamnesisFormData },
        diagnosisFormData: { ...defaultDiagnosisFormData },
        therapeuticPlanFormData: { ...defaultTherapeuticPlanFormData },
        prescriptionFormData: { ...defaultPrescriptionFormData },
        consultationClosureFormData: { ...defaultConsultationClosureFormData },
        basicPatientInfo: { ...basicPatientInfo },
        appointmentStatus: ""
      }, false, "resetForm"),

    additionalData: { patientName: "", patientId: "", patientOptions: [] },
    setAdditionalData: (data) => {

      if (data.patientId) {
        getBasicPatientInfo({ id: data.patientId, appointmentId: get().appointmentId })
          .then((basicPatientInfo) =>
            set({ basicPatientInfo }, false, "setBasicPatientInfo")
          );
      }

      set((state) => (
        { additionalData: { ...state.additionalData, ...data } }
      ), false, "setAdditionalData");
    },

    dentalEvolutionForm: { ...defaultDentalEvolutionForm },
    setDentalEvolutionForm: (evolution) =>
      set({ dentalEvolutionForm: evolution }, false, "setDentalEvolutionForm")
  }),
  { name: "appointmentStore", trace: true })
);
