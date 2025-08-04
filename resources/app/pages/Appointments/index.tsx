import AppointmentTable from "./components/AppointmentTable";
import { useDisclosure } from "@heroui/react";
import { useEffect } from "react";
import { useAppointmentStore } from "@/store/appointmentStore";
import PatientFormModal from "../Patients/components/PatientFormModal";
import DentalEvolutionFormModal from "./components/DentalFormModal";
import OdontogramModal from "./components/OdontogramModal";
import AppointmentFormModal from "./components/AppointmentFormModal";
import MedicalEvaluationModal from "./components/MedicalEvaluationModal";
import MedicationFormModal from "./components/MedicationFormModal";
import MedicationModal from "./components/MedicationModal";
import PositionFormModal from "../Patients/components/PositionFormModal";
import { useMedicationStore } from "@/store/medicationStore";
import { usePatientStore } from "@/store/patientStore";
import DependenceFormModal from "../Patients/components/DependenceFormModal";

const AppointmentsPage = () => {
  const { setAppointmentModal, setAdditionalData, setSelectedForm } = useAppointmentStore();
  const { setPositionId, setDependenceId } = usePatientStore();
  const { setMedicationFormModal } = useMedicationStore();

  const appointmentModal = useDisclosure();
  const clinicalExamModal = useDisclosure();
  const patientModal = useDisclosure();
  const dentalEvolutionModal = useDisclosure();
  const odontogramModal = useDisclosure();
  const prescriptionModal = useDisclosure();
  const medicalEvaluationModal = useDisclosure();
  const medicationFormModal = useDisclosure();
  const medicationModal = useDisclosure();
  const positionFormModal = useDisclosure();
  const dependenceFormModal = useDisclosure();

  useEffect(() => {
    setAppointmentModal({ ...appointmentModal });
    setMedicationFormModal({ ...medicationFormModal });
  }, []);

  return (
    <>
      <OdontogramModal
        isOpen={odontogramModal.isOpen}
        onOpenChange={odontogramModal.onOpenChange}
        openEvolutionForm={dentalEvolutionModal.onOpen}
      />

      <DentalEvolutionFormModal
        isOpen={dentalEvolutionModal.isOpen}
        onOpenChange={dentalEvolutionModal.onOpenChange}
        onOpenOdontogramModal={odontogramModal.onOpen}
        openPrescriptionModal={prescriptionModal.onOpen}
      />

      <PatientFormModal
        isOpen={patientModal.isOpen}
        onOpenChange={patientModal.onOpenChange}
        openPositionFormModal={positionFormModal.onOpen}
        openDependenceFormModal={dependenceFormModal.onOpen}
        saveReturnData={(data) => setAdditionalData(data)}
      />

      <PositionFormModal
        isOpen={positionFormModal.isOpen}
        onOpenChange={positionFormModal.onOpenChange}
        saveReturnData={(data) => setPositionId(data.positionId)}
      />

      <DependenceFormModal
        isOpen={dependenceFormModal.isOpen}
        onOpenChange={dependenceFormModal.onOpenChange}
        saveReturnData={(data) => setDependenceId(data.dependenceId)}
      />

      <AppointmentFormModal
        isOpen={appointmentModal.isOpen}
        onOpenChange={appointmentModal.onOpenChange}
        openPatientModal={patientModal.onOpen}
        onClose={appointmentModal.onClose}
      />

      <MedicalEvaluationModal
        isOpen={medicalEvaluationModal.isOpen}
        onOpenChange={medicalEvaluationModal.onOpenChange}
        onClose={medicalEvaluationModal.onClose}
        openPrescriptionModal={prescriptionModal.onOpen}
      />

      <MedicationFormModal
        isOpen={medicationFormModal.isOpen}
        onOpenChange={medicationFormModal.onOpenChange}
      />

      <MedicationModal
        isOpen={medicationModal.isOpen}
        onOpenChange={medicationModal.onOpenChange}
        openMedicationFormModal={medicationFormModal.onOpen}
      />

      <AppointmentTable
        openAppointmentModal={appointmentModal.onOpen}
        openClinicalExamModal={clinicalExamModal.onOpen}
        openCreateModal={() => {
          setSelectedForm("appointment-form");
          appointmentModal.onOpen();
        }}
        openDentalEvolutionModal={dentalEvolutionModal.onOpen}
        openOdontogramModal={odontogramModal.onOpen}
        openMedicalEvaluationModal={medicalEvaluationModal.onOpenChange}
        openMedicationModal={medicationModal.onOpen}
      />
    </>
  );
};

export default AppointmentsPage;
