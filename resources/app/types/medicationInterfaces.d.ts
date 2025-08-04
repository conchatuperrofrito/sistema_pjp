export interface Medication {
  id: string;
  genericName: string;
  concentration: string;
  presentation: string;
  dosageForm: string;
  dosageDescription: string;
  dosageFormId: string;
  createdAt: string;
}

export interface MedicationFormData {
  id?: string;
  genericName: string;
  concentration: string;
  presentation: string;
  dosageFormId: string;
}

export interface MedicationOptionData {
  genericName: string;
  concentration: string;
  presentation: string;
  dosageForm: string;
  dosageDescription: string;
}

export type MedicationOption = Option<MedicationOptionData>;
export interface MedicationResponse {
  data: Medication[];
  pagination: PaginationResponse;
}
