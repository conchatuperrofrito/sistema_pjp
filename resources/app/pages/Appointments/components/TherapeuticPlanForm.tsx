import { FC, useEffect, Dispatch, SetStateAction } from "react";
import { useAppointmentStore, defaultTherapeuticPlanFormData } from "@/store/appointmentStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { TherapeuticPlanFormData } from "@/types/doctorInterfaces";
import { therapeuticPlanSchema } from "@/validators/validationSchemas";
import { Controller, useForm } from "react-hook-form";
import { CustomTextarea } from "@/components/CustomTextarea";
import { Divider } from "@heroui/react";
import MedicationTable from "./MedicationTable";

interface TherapeuticPlanFormProps {
  setFormModalConfig: Dispatch<SetStateAction<FormModalConfig>>;
}

const TherapeuticPlanForm: FC<TherapeuticPlanFormProps> = ({
  setFormModalConfig
}) => {
  const {
    setTherapeuticPlanFormData,
    therapeuticPlanFormData,
    setSelectedForm
  } = useAppointmentStore(store => store);

  const { handleSubmit, control, reset, watch } = useForm<TherapeuticPlanFormData>({
    resolver: zodResolver(therapeuticPlanSchema),
    defaultValues: defaultTherapeuticPlanFormData,
    mode: "onSubmit"
  });

  useEffect(() => {
    reset(therapeuticPlanFormData);
  }, []);

  useEffect(() => {
    setFormModalConfig((prev) => ({
      ...prev,
      title: "Plan Terapéutico",
      onSubmit: handleSubmit((data) => {
        setTherapeuticPlanFormData(data);
        setSelectedForm("consultation-closure-form");
      }),
      customCloseButton: {
        show: true,
        onClick: () => {
          setTherapeuticPlanFormData(watch());
          setSelectedForm("diagnosis-form");
        },
        content: "Atrás",
        startContent: <span style={{ fontSize: "16px" }}> {"<-"} </span>
      },
      customSaveButton: {
        show: true,
        content: "Siguiente",
        endContent: <span style={{ fontSize: "16px" }}> {"->"} </span>
      }
    }));
  }, [
    handleSubmit,
    setFormModalConfig
  ]);

  return (
    <>
      <div className="grid grid-cols-1 grid-rows-auto gap-x-3">
        <Controller
          name="treatment"
          control={control}
          render={({ field, fieldState }) => (
            <CustomTextarea
              {...field}
              label="Tratamiento propuesto"
              placeholder='Describa la estrategia clínica: p. ej.
               Iniciar ibuprofeno 400 mg c/8 h para controlar inflamación, reposo relativo y
               fisioterapia 3 veces/semana.”'
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              isRequired
              rows={2}
              className="mb-[18px]"
            />
          )}
        />

        <Controller
          name="lifeStyleInstructions"
          control={control}
          render={({ field, fieldState }) => (
            <CustomTextarea
              {...field}
              label="Instrucciones de estilo de vida"
              placeholder="Ej: Mantener dieta baja en sodio, ejercicio moderado diario"
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              rows={2}
              className="mb-[18px]"
            />
          )}
        />
      </div>

      <p className="text-small text-default-500 mt-1">MEDICAMENTOS</p>
      <Divider className="mt-1 mb-2" />

      <MedicationTable />
    </>
  );
};

export default TherapeuticPlanForm;
