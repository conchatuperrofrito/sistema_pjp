import { FC, useEffect, useState } from "react";
import { FormModal } from "@/components/FormModal";
import AppointmentForm from "./AppointmentForm";
import ClinicalExamForm from "./ClinicalExamForm";
import { useAppointmentStore } from "@/store/appointmentStore";
import { CarouselItem } from "@/components/CarouselFormContainer";
import { getAppointment } from "@/services/appointmentService";
import { useQuery } from "@tanstack/react-query";
import { useMediaQuery } from "react-responsive";

interface AppointmentFormModalProps extends FormModalProps {
  openPatientModal: () => void;
}

const AppointmentFormModal: FC<AppointmentFormModalProps> = ({
  isOpen,
  onOpenChange,
  openPatientModal,
  onClose
}) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const {
    selectedForm,
    appointmentId,
    setAppointmentForm,
    setClinicalExamForm,
    resetForm
  } = useAppointmentStore((store) => store);

  const [formModalConfig, setFormModalConfig] = useState<FormModalConfig>({
    onModalClose: () => {
      onClose?.();
      resetForm();
    },
    title: "",
    onSubmit: () => {}
  });

  const appointmentQuery = useQuery({
    queryKey: ["appointment"],
    queryFn: () => getAppointment(appointmentId),
    enabled: false
  });

  useEffect(() => {
    if (isOpen && appointmentId) {
      assignFormData();
    }
  }, [isOpen]);

  const assignFormData = () => {
    appointmentQuery.refetch().then((response) => {
      if (response.status === "success") {
        const rescheduleAppointment = response.data;
        setAppointmentForm(rescheduleAppointment.appointment);
        setClinicalExamForm(rescheduleAppointment.clinicalExam);
      }
    });
  };

  useEffect(() => {
    setFormModalConfig((prev) => ({
      ...prev,
      isSaving: false,
      isLoading: appointmentQuery.isFetching
    }));
  }, [appointmentQuery.isFetching]);

  const forms: CarouselItem[] = [
    {
      key: "appointment-form",
      content: (
        <AppointmentForm
          openPatientModal={openPatientModal}
          setFormModalConfig={setFormModalConfig}
          isLoading={appointmentQuery.isFetching}
        />
      )
    },
    {
      key: "clinical-exam-form",
      content: (
        <ClinicalExamForm
          setFormModalConfig={setFormModalConfig}
          onSuccess={() => {
            onOpenChange();
            resetForm();
          }}
          isMobile={isMobile}
        />
      )
    }
  ];

  return (
    <FormModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      {...formModalConfig}
      size={isMobile ? "full" : "2xl"}
      className="hidden-scrollbar"
      modalVariant="multi"
      forms={forms}
      selectedForm={selectedForm}
    />
  );
};

export default AppointmentFormModal;
