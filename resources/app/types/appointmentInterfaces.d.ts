import { DateValue, TimeInputValue } from "@nextui-org/react";
export interface Appointment {
    id: string;
    date: string;
    hour: string;
    scheduledFor: string;
    patientDocument: string;
    doctor: string;
    patient: string;
    reason: string;
    status: "Pendiente" | "Realizada" | "Cancelada" | "Programada";
    doctorId?: string;
    patientId?: string;
    prescription: boolean;
}

export interface AppointmentForm {
    id?: string;
    date: string;
    hour: string;
    doctorId: string;
    patientId: string;
    reason: string;
    status?: "Pendiente" | "Realizada" | "Cancelada" | "Programada" | "";
}

export interface ClinicalExamForm {
    id?: string;
    physicalExam: PhysicalExam;
    regionalExam: RegionalExam;
    generalExam: string;
}
export interface PhysicalExam {
    respiratoryRate: string;
    heartRate: string;
    temperature: string;
    bloodPressure: string;
    height?: string;
    weight?: string;
    bodyMassIndex?: string;
}

export interface RegionalExam {
    regionalExam?: string;
    skin?: string;
    eyes?: string;
    ears?: string;
    nose?: string;
    mouth?: string;
    throat?: string;
    teeth?: string;
    neck?: string;
    thorax?: string;
    lungs?: string;
    heart?: string;
    breasts?: string;
    abdomen?: string;
    urinary?: string;
    lymphatic?: string;
    vascular?: string;
    locomotor?: string;
    extremities?: string;
    obituaries?: string;
    higherFunctions?: string;
    lowerFunctions?: string;
    rectal?: string;
    gynecological?: string;
}

export interface RegionalExamForm extends RegionalExam {
    id?: string;
}
export interface BasicPatientInfo {
    fullName: string;
    documentNumber: string;
    documentType: string;
    age: string;
    sex: string;
    weight?: string;
    height?: string;
    bodyMassIndex?: string;
}

export interface PhysicalExamForm extends PhysicalExam {
    id?: string;
}

export interface AppointmentResponse {
    data: Appointment[];
    pagination: PaginationResponse;
}

export interface PatientAppointmentForm {
    date: DateValue | null;
    hour: TimeInputValue | null;
    doctorId: string;
}

export interface PatientAppointment {
    id: string;
    patient: string;
    documentNumber: string;
    date: string;
    hour: string;
    doctor: string;
    specialty: string;
    status: string;
  }

export interface AppointmentFormData {
    appointment: AppointmentForm;
    clinicalExam: ClinicalExamForm;
  }
