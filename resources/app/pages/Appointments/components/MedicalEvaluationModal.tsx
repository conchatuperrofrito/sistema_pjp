import { FC, useEffect, useMemo, useState } from "react";
import { FormModal } from "@/components/FormModal";
import AnamnesisForm from "./AnamnesisForm";
import DiagnosisForm from "./DiagnosisForm";
import TherapeuticPlanForm from "./TherapeuticPlanForm";
import { useAppointmentStore } from "@/store/appointmentStore";
import { CarouselItem } from "@/components/CarouselFormContainer";
import ConsultationClosureForm from "./ConsultationClosureForm";
import { useQuery } from "@tanstack/react-query";
import { MedicalEvaluationForm } from "@/types/doctorInterfaces";
import { getMedicalEvaluation } from "@/services/doctorService";
import { Skeleton } from "@heroui/react";
import { useMediaQuery } from "react-responsive";

interface MedicalEvaluationModalProps extends FormModalProps {
  openPrescriptionModal: () => void;
}

const MedicalEvaluationModal: FC<MedicalEvaluationModalProps> = ({
  isOpen,
  onOpenChange,
  onClose
}) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const {
    selectedForm,
    resetForm,
    basicPatientInfo,
    appointmentId,
    setAnamnesisFormData,
    setDiagnosisFormData,
    setTherapeuticPlanFormData,
    setPrescriptionFormData,
    setConsultationClosureFormData,
    appointmentStatus
  } = useAppointmentStore(store => store);

  const [formModalConfig, setFormModalConfig] = useState<FormModalConfig>({
    onModalClose: () => {
      onClose?.();
      resetForm();
    },
    title: "",
    onSubmit: () => { }
  });

  const medicalEvaluationQuery = useQuery<MedicalEvaluationForm>({
    queryKey: ["medicalEvaluation"],
    queryFn: () => getMedicalEvaluation(appointmentId),
    enabled: false
  });

  useEffect(() => {
    if (isOpen && appointmentId && appointmentStatus === "Realizada") {
      assignFormData();
    }
  }, [isOpen]);

  const assignFormData = () => {
    medicalEvaluationQuery.refetch().then(async (response) => {
      if (response.status === "success") {
        const medicalEvaluation = response.data;
        setAnamnesisFormData(medicalEvaluation.anamnesis);
        setDiagnosisFormData(medicalEvaluation.diagnosis);
        setTherapeuticPlanFormData(medicalEvaluation.therapeuticPlan);
        setPrescriptionFormData(medicalEvaluation.prescription);
        setConsultationClosureFormData(medicalEvaluation.consultationClosure);
      }
    });
  };

  const extraContent = useMemo(() => (
    <div className="flex flex-col gap-x-2 text-sm mr-auto">
      {basicPatientInfo.fullName ? (
        <>
          <div className="flex gap-1">
            <span className="font-medium">
                Paciente:
            </span>{" "}
            <span className="capitalize md:uppercase">
              {basicPatientInfo.fullName.toLowerCase()}
            </span>
          </div>
          <div className="items-center gap-3 hidden md:!flex">
            <div>
              <span className="font-medium">
                {basicPatientInfo.documentType}:
              </span>{" "}
              {basicPatientInfo.documentNumber}
            </div>
            <div>
              <span className="font-medium">Edad:</span>{" "}
              {basicPatientInfo.age ? `${basicPatientInfo.age} años` : "~"}
            </div>
            <div>
              <span className="font-medium">Sexo:</span>{" "}
              {basicPatientInfo.sex || "~"}
            </div>
          </div>
        </>
      ) : (
        <Skeleton className="h-[20px] md:h-[40px] w-[280px] rounded-md" />
      )}
    </div>
  ), [basicPatientInfo]);

  useEffect(() => {
    setFormModalConfig((prev) => ({
      ...prev,
      isSaving: false,
      isLoading: medicalEvaluationQuery.isFetching,
      extraContentFooter: !isMobile ? extraContent : undefined,
      extraContentTop: isMobile ? extraContent : undefined,
      classNameHeader: isMobile ? "flex flex-col gap-y-1" : ""
    }));
  }, [medicalEvaluationQuery.isFetching, extraContent, isMobile]);

  const forms: CarouselItem[] = [
    {
      key: "anamnesis-form",
      content: (
        <AnamnesisForm
          setFormModalConfig={setFormModalConfig}
          isLoading={medicalEvaluationQuery.isFetching}
        />
      )
    },
    {
      key: "diagnosis-form",
      content: (
        <DiagnosisForm
          setFormModalConfig={setFormModalConfig}
        />
      )
    },
    {
      key: "therapeutic-plan-form",
      content: (
        <TherapeuticPlanForm
          setFormModalConfig={setFormModalConfig}
        />
      )
    },
    {
      key: "consultation-closure-form",
      content: (
        <ConsultationClosureForm
          setFormModalConfig={setFormModalConfig}
          onSuccess={() => {
            onOpenChange();
            resetForm();
          }}
        />
      )
    }
  ];

  return (
    <FormModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      {...formModalConfig}
      size={isMobile ? "full" : "5xl"}
      className="hidden-scrollbar"
      modalVariant="wizard"
      forms={forms}
      selectedForm={selectedForm}
      wizardConfig={{
        tabs: [
          { title: "Anamnesis", key: "anamnesis-form" },
          { title: "Diagnóstico", key: "diagnosis-form" },
          { title: "Plan Terapéutico", key: "therapeutic-plan-form" },
          { title: "Cierre de consulta", key: "consultation-closure-form" }
        ],
        ariaLabel: "Medical Evaluation Form"
      }}
      isMobile={isMobile}
    />
  );
};

export default MedicalEvaluationModal;
