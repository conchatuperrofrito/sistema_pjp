import { FC, useEffect, Dispatch, SetStateAction } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { diagnosisFormSchema } from "@/validators/validationSchemas";
import { useForm, Controller } from "react-hook-form";
import { useAppointmentStore, defaultDiagnosisFormData } from "@/store/appointmentStore";
import { Divider } from "@heroui/react";
import { DiagnosisFormData } from "@/types/doctorInterfaces";
import { CustomTextarea } from "@/components/CustomTextarea";
import DiagnosisTable from "./DiagnosisTable";

interface DiagnosisFormProps {
  setFormModalConfig: Dispatch<SetStateAction<FormModalConfig>>;
}

const DiagnosisForm: FC<DiagnosisFormProps> = ({
  setFormModalConfig
}) => {
  const {
    setDiagnosisFormData,
    diagnosisFormData,
    setSelectedForm
  } = useAppointmentStore((state) => state);

  const { handleSubmit, control, reset, watch, setValue } = useForm<DiagnosisFormData>({
    resolver: zodResolver(diagnosisFormSchema),
    defaultValues: defaultDiagnosisFormData,
    mode: "onSubmit"
  });

  useEffect(() => {
    reset(diagnosisFormData);
  }, []);

  useEffect(() => {
    setValue("diagnosisCodes", diagnosisFormData.diagnosisCodes);
  },[diagnosisFormData.diagnosisCodes]);


  useEffect(() => {
    setFormModalConfig((prev) => ({
      ...prev,
      title: "Formulario de evolución",
      onSubmit: handleSubmit((data) => {
        setDiagnosisFormData(data);
        setSelectedForm("therapeutic-plan-form");
      }),
      customCloseButton: {
        show: true,
        onClick: () => {
          setDiagnosisFormData(watch());
          setSelectedForm("anamnesis-form");
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
          name="description"
          control={control}
          render={({ field, fieldState }) => (
            <CustomTextarea
              {...field}
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              label="Descripción del Diagnóstico"
              placeholder="Detalle la conclusión clínica"
              isRequired
              rows={2}
              className="mb-[18px]"
            />
          )}
        />

        <Controller
          name="clinicalCriteria"
          control={control}
          render={({ field, fieldState }) => (
            <CustomTextarea
              {...field}
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              label="Criterios Clínicos Aplicados"
              placeholder="Documente las referencias (criterios diagnósticos, hallazgos clave)"
              rows={2}
              className="mb-[18px]"
            />
          )}
        />
      </div>

      <p className="text-small text-default-500 mt-1">DIAGNÓSTICOS ESPECÍFICOS</p>
      <Divider className="mt-1 mb-2" />

      <DiagnosisTable />
    </>
  );
};

export default DiagnosisForm;
