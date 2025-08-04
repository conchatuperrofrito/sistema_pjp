import { Dispatch, FC, useEffect, SetStateAction, useMemo } from "react";
import { AnamnesisFormData } from "@/types/doctorInterfaces";
import { zodResolver } from "@hookform/resolvers/zod";
import { anamnesisSchema } from "@/validators/validationSchemas";
import { useForm, Controller } from "react-hook-form";
import { CustomInput } from "@/components/CustomInput";
import { useAppointmentStore, defaultAnamnesisFormData } from "@/store/appointmentStore";
import { Skeleton, Divider } from "@heroui/react";
import { CustomSelect } from "@/components/CustomSelect";
import { CustomTextarea } from "@/components/CustomTextarea";
import clsx from "clsx";

interface AnamnesisFormProps {
  setFormModalConfig: Dispatch<SetStateAction<FormModalConfig>>;
  isLoading: boolean;
}

const AnamnesisForm: FC<AnamnesisFormProps> = ( {
  setFormModalConfig,
  isLoading
}) => {
  const {
    setSelectedForm,
    setAnamnesisFormData,
    anamnesisFormData,
    basicPatientInfo,
    appointmentStatus
  } = useAppointmentStore((state) => state);

  const { handleSubmit, control, reset, setValue, watch } = useForm<AnamnesisFormData>({
    resolver: zodResolver(anamnesisSchema),
    defaultValues: defaultAnamnesisFormData ,
    mode: "onChange"
  });

  useEffect(() => {
    reset(anamnesisFormData);
  }, [anamnesisFormData]);

  useEffect(() => {
    if (basicPatientInfo?.weight && !isLoading) {
      setValue("weight", basicPatientInfo?.weight);
    }
  }, [basicPatientInfo]);

  useEffect(() => {
    setFormModalConfig( (prev) => ({
      ...prev,
      title: "Formulario de anamnesis",
      onSubmit: handleSubmit((data) => {
        setAnamnesisFormData(data);
        setSelectedForm("diagnosis-form");
      }),
      customCloseButton: { show: false },
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

  const isFormReady = useMemo(() => {
    return !isLoading && (watch("clinicalStory") || appointmentStatus === "Pendiente");
  }, [isLoading, watch("clinicalStory"), appointmentStatus]);

  return (
    <>
      <div className={clsx("", isFormReady && "hidden")}>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr] grid-rows-auto gap-x-3">
          <Skeleton className="h-[48px] mb-[18px] rounded-lg col-span-3 md:col-span-1" />
          <Skeleton className="h-[48px] mb-[18px] rounded-lg col-span-3 md:col-span-1" />
          <Skeleton className="h-[48px] mb-[18px] rounded-lg col-span-3 md:col-span-1" />
          <Skeleton className="h-[79.97px] mb-[18px] rounded-lg col-span-3" />
          <Skeleton className="h-[99.97px] mb-[18px] rounded-lg col-span-3" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-3 grid-rows-auto">
          <p className="text-small text-default-500 mt-1 col-span-2 md:col-span-3">FUNCIONES BIÓLOGICAS</p>
          <Divider className="mt-1 mb-2 col-span-2 md:col-span-3" />
          <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
          <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
          <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
          <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
          <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
          <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
        </div>
      </div>

      <div className={!isFormReady ? "hidden" : ""}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-3">
          <Controller
            name="diseaseDuration"
            control={control}
            render={({ field, fieldState }) => (
              <CustomSelect
                label="Duración de la enfermedad"
                placeholder="Seleccione la duración"
                variant="flat"
                isInvalid={!!fieldState.error}
                errorMessage={fieldState.error?.message}
                size="sm"
                data={[
                  { label: "±1 días", value: "±1 días" },
                  { label: "±2 días", value: "±2 días" },
                  { label: "±3 días", value: "±3 días" },
                  { label: "±5 días", value: "±5 días" },
                  { label: "±7 días", value: "±7 días" },
                  { label: "±10 días", value: "±10 días" },
                  { label: "±14 días", value: "±14 días" },
                  { label: "±21 días", value: "±21 días" },
                  { label: "±30 días", value: "±30 días" },
                  { label: "±60 días", value: "±60 días" },
                  { label: "±90 días", value: "±90 días" },
                  { label: "±180 días", value: "±180 días" },
                  { label: "±365 días", value: "±365 días" }
                ]}
                isLoading={false}
                selectionMode="single"
                {...field}
                isRequired
              />
            )}
          />

          <Controller
            name="onsetType"
            control={control}
            rules={{ required: "La forma de inicio es obligatoria" }}
            render={({ field, fieldState }) => (
              <CustomSelect
                label="Forma de inicio"
                placeholder="Seleccione la forma"
                variant="flat"
                isInvalid={!!fieldState.error}
                errorMessage={fieldState.error?.message}
                size="sm"
                data={[
                  { label: "Insidioso", value: "Insidioso" },
                  { label: "Brusco", value: "Brusco" },
                  { label: "Gradual", value: "Gradual" },
                  { label: "Agudo", value: "Agudo" }
                ]}
                isLoading={false}
                selectionMode="single"
                {...field}
                isRequired
              />
            )}
          />

          <Controller
            name="course"
            control={control}
            rules={{ required: "El curso es obligatorio" }}
            render={({ field, fieldState }) => (
              <CustomSelect
                label="Curso"
                placeholder="Seleccione el curso"
                variant="flat"
                isInvalid={!!fieldState.error}
                errorMessage={fieldState.error?.message}
                size="sm"
                data={[
                  { label: "Progresivo", value: "Progresivo" },
                  { label: "Estacionario", value: "Estacionario" },
                  { label: "Regresivo", value: "Regresivo" },
                  { label: "Intermitente", value: "Intermitente" }
                ]}
                isLoading={false}
                selectionMode="single"
                {...field}
                isRequired
              />
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-x-3">
          <Controller
            name="symptomsSigns"
            control={control}
            render={({ field, fieldState }) => (
              <CustomTextarea
                {...field}
                isInvalid={!!fieldState.error}
                errorMessage={fieldState.error?.message}
                label="Síntomas y signos"
                placeholder="Ej: Fiebre, tos, dolor de cabeza"
                isRequired
                rows={2}
                className="mb-[18px]"
              />
            )}
          />

          <Controller
            name="clinicalStory"
            control={control}
            render={({ field, fieldState }) => (
              <CustomTextarea
                {...field}
                isInvalid={!!fieldState.error}
                errorMessage={fieldState.error?.message}
                label="Relato"
                placeholder="Ej: Paciente con fiebre de 38.5°C, tos seca y dolor de cabeza"
                isRequired
                rows={3}
                className="mb-[18px]"
              />
            )}
          />
        </div>

        <p className="text-small text-default-500 mt-1">FUNCIONES BIÓLOGICAS</p>
        <Divider className="mt-1 mb-2" />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-3">
          <Controller
            name="appetite"
            control={control}
            rules={{ required: "El apetito es obligatorio" }}
            render={({ field, fieldState }) => (
              <CustomSelect
                label="Apetito"
                placeholder="Seleccione el apetito"
                variant="flat"
                isInvalid={!!fieldState.error}
                errorMessage={fieldState.error?.message}
                size="sm"
                data={[
                  { label: "Normal", value: "Normal" },
                  { label: "Aumentado", value: "Aumentado" },
                  { label: "Disminuido", value: "Disminuido" },
                  { label: "Ninguno", value: "Ninguno" }
                ]}
                isLoading={false}
                selectionMode="single"
                {...field}
                isRequired
              />
            )}
          />

          <Controller
            name="thirst"
            control={control}
            rules={{ required: "La sed es obligatoria" }}
            render={({ field, fieldState }) => (
              <CustomSelect
                label="Sed"
                placeholder="Seleccione cómo está la sed"
                variant="flat"
                isInvalid={!!fieldState.error}
                errorMessage={fieldState.error?.message}
                size="sm"
                data={[
                  { label: "Normal", value: "Normal" },
                  { label: "Aumentada", value: "Aumentada" },
                  { label: "Disminuida", value: "Disminuida" }
                ]}
                selectionMode="single"
                isLoading={false}
                {...field}
                isRequired
              />
            )}
          />

          <Controller
            name="weight"
            control={control}
            render={({ field, fieldState }) => (
              <CustomInput
                label="Peso"
                placeholder="Ej. 70"
                variant="flat"
                isInvalid={!!fieldState.error}
                errorMessage={fieldState.error?.message}
                size="sm"
                autoComplete="off"
                {...field}
                isRequired
                endContent={
                  <span className="text-gray-500 text-[0.8rem]">kg</span>
                }
              />
            )}
          />

          <Controller
            name="urine"
            control={control}
            rules={{ required: "El estado de la orina es obligatorio" }}
            render={({ field, fieldState }) => (
              <CustomSelect
                label="Orina"
                placeholder="Seleccione el estado"
                variant="flat"
                isInvalid={!!fieldState.error}
                errorMessage={fieldState.error?.message}
                size="sm"
                data={[
                  { label: "Normal", value: "Normal" },
                  { label: "Frecuente", value: "Frecuente" },
                  { label: "Dolorosa", value: "Dolorosa" },
                  { label: "Dificultosa", value: "Dificultosa" }
                ]}
                selectionMode="single"
                isLoading={false}
                {...field}
                isRequired
              />
            )}
          />

          <Controller
            name="stool"
            control={control}
            rules={{ required: "El estado de las heces es obligatorio" }}
            render={({ field, fieldState }) => (
              <CustomSelect
                label="Heces"
                placeholder="Seleccione el estado"
                variant="flat"
                isInvalid={!!fieldState.error}
                errorMessage={fieldState.error?.message}
                size="sm"
                data={[
                  { label: "Normal", value: "Normal" },
                  { label: "Estreñimiento", value: "Estreñimiento" },
                  { label: "Diarrea", value: "Diarrea" },
                  { label: "Irregular", value: "Irregular" }
                ]}
                selectionMode="single"
                isLoading={false}
                {...field}
                isRequired
              />
            )}
          />

          <Controller
            name="sleep"
            control={control}
            rules={{ required: "El estado de sueño es obligatorio" }}
            render={({ field, fieldState }) => (
              <CustomSelect
                label="Sueño"
                placeholder="Seleccione el estado"
                variant="flat"
                isInvalid={!!fieldState.error}
                errorMessage={fieldState.error?.message}
                size="sm"
                data={[
                  { label: "Normal", value: "Normal" },
                  { label: "Aumentado", value: "Aumentado" },
                  { label: "Disminuido", value: "Disminuido" }
                ]}
                selectionMode="single"
                isLoading={false}
                {...field}
                isRequired
              />
            )}
          />
        </div>
      </div>
    </>
  );
};

export default AnamnesisForm;
