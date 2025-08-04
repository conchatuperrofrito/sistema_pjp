import PatientTable from "./components/PatientTable";
import PatientFormModal from "./components/PatientFormModal";
import AppointmentModal from "./components/AppointmentModal";
import PositionFormModal from "./components/PositionFormModal";
import DependenceFormModal from "./components/DependenceFormModal";
import { useDisclosure } from "@heroui/react";
import PositionModal from "./components/PositionModal";
import DependenceModal from "./components/DependenceModal";
import { usePatientStore } from "@/store/patientStore";

const PatientsPage = () => {
  const { setPositionId, setDependenceId } = usePatientStore((state) => state);

  const formModal = useDisclosure();
  const appointmentModal = useDisclosure();
  const positionFormModal = useDisclosure();
  const positionModal = useDisclosure();
  const dependenceFormModal = useDisclosure();
  const dependenceModal = useDisclosure();

  return (
    <>
      <PatientFormModal
        isOpen={formModal.isOpen}
        onOpenChange={formModal.onOpenChange}
        openPositionFormModal={positionFormModal.onOpen}
        openDependenceFormModal={dependenceFormModal.onOpen}
      />

      <PatientTable
        openModal={formModal.onOpen}
        openAppointmentModal={appointmentModal.onOpen}
        openPositionModal={positionModal.onOpen}
        openDependenceModal={dependenceModal.onOpen}
      />

      <AppointmentModal
        isOpen={appointmentModal.isOpen}
        onOpenChange={appointmentModal.onOpenChange}
      />

      <PositionFormModal
        isOpen={positionFormModal.isOpen}
        onOpenChange={positionFormModal.onOpenChange}
        saveReturnData={(data) => setPositionId(data.positionId)}
      />

      <PositionModal
        isOpen={positionModal.isOpen}
        onOpenChange={positionModal.onOpenChange}
        openPositionFormModal={positionFormModal.onOpen}
      />

      <DependenceFormModal
        isOpen={dependenceFormModal.isOpen}
        onOpenChange={dependenceFormModal.onOpenChange}
        saveReturnData={(data) => setDependenceId(data.dependenceId)}
      />

      <DependenceModal
        isOpen={dependenceModal.isOpen}
        onOpenChange={dependenceModal.onOpenChange}
        openDependenceFormModal={dependenceFormModal.onOpen}
      />
    </>
  );
};

export default PatientsPage;
