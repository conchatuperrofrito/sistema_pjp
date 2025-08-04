import { defaultConsultationClosureFormData, useAppointmentStore } from "@/store/appointmentStore";
import { ConsultationClosureFormData } from "@/types/doctorInterfaces";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { FC, Dispatch, SetStateAction, useEffect } from "react";
import { CustomTextarea } from "@/components/CustomTextarea";
import { CustomDatePicker } from "@/components/CustomDatePicker";
import { consultationClosureSchema } from "@/validators/validationSchemas";
import { saveMedicalEvaluation } from "@/services/doctorService";
import useSaveMutation from "@/hooks/useSaveMutation";
interface ConsultationClosureFormProps {
  setFormModalConfig: Dispatch<SetStateAction<FormModalConfig>>;
  onSuccess: () => void;
}

const ConsultationClosureForm: FC<ConsultationClosureFormProps> = ({
  setFormModalConfig,
  onSuccess
}) => {
  const {
    appointmentId,
    setSelectedForm,
    setConsultationClosureFormData,
    consultationClosureFormData,
    anamnesisFormData,
    diagnosisFormData,
    therapeuticPlanFormData,
    prescriptionFormData,
    appointmentStatus
  } = useAppointmentStore((state) => state);

  const { handleSubmit, control, reset, watch } = useForm<ConsultationClosureFormData>({
    resolver: zodResolver(consultationClosureSchema),
    defaultValues: defaultConsultationClosureFormData,
    mode: "onChange"
  });

  const { save, isPending } = useSaveMutation({
    mutationFn: saveMedicalEvaluation,
    onSuccess,
    queryKeys: ["appointments"]
  });

  useEffect(() => {
    reset(consultationClosureFormData);
  }, []);

  useEffect(() => {
    setFormModalConfig((prev) => ({
      ...prev,
      title: "Cierre de consulta",
      onSubmit: handleSubmit(onSubmit),
      customCloseButton: {
        show: true,
        onClick: () => {
          setConsultationClosureFormData(watch());
          setSelectedForm("therapeutic-plan-form");
        },
        content: "Atrás",
        startContent: <span style={{ fontSize: "16px" }}> {"<-"} </span>
      },
      customSaveButton: undefined,
      isSaving: isPending
    }));
  }, [
    handleSubmit,
    setFormModalConfig,
    isPending
  ]);

  const onSubmit = (data: ConsultationClosureFormData) => {
    const medicalEvaluationData = {
      id: appointmentStatus === "Realizada" ? appointmentId : undefined,
      appointmentId,
      anamnesis: anamnesisFormData,
      diagnosis: diagnosisFormData,
      therapeuticPlan: therapeuticPlanFormData,
      prescription: prescriptionFormData,
      consultationClosure: data
    };

    save(medicalEvaluationData);
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-x-3">
        <Controller
          name="summary"
          control={control}
          render={({ field, fieldState }) => (
            <CustomTextarea
              {...field}
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              label="Resumen final de la consulta"
              placeholder="Sintetice lo acontecido: hallazgos, evolución y conclusiones"
              isRequired
              rows={2}
              isDisabled={isPending}
              className="mb-[18px]"
            />
          )}
        />

        <Controller
          name="instructions"
          control={control}
          render={({ field, fieldState }) => (
            <CustomTextarea
              {...field}
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              label="Instrucciones y Observaciones"
              placeholder="Detalle cuidados, advertencias y notas finales para el paciente"
              rows={2}
              isDisabled={isPending}
              className="mb-[18px]"
            />
          )}
        />

        <Controller
          name="nextAppointmentDate"
          control={control}
          render={({ field, fieldState }) => (
            <CustomDatePicker
              {...field}
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              label="Fecha de próxima cita"
              placeholder="Seleccione la fecha"
              size="sm"
              isDisabled={isPending}
            />
          )}
        />
      </div>
    </>
  );
};

export default ConsultationClosureForm;
