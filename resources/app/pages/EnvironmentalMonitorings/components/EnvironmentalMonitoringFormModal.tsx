import { FC, useEffect, useMemo } from "react";
import { EnvironmentalMonitoring, EnvironmentalMonitoringFormData } from "@/types/environmentalMonitoringInterfaces";
import { zodResolver } from "@hookform/resolvers/zod";
import { environmentalMonitoringSchema } from "@/validators/validationSchemas";
import useSaveMutation from "@/hooks/useSaveMutation";
import { getEnvironmentalMonitoring, saveEnvironmentalMonitoring } from "@/services/environmentalMonitoringService";
import { FormModal } from "@/components/FormModal";
import { useForm, Controller } from "react-hook-form";
import { useEnvironmentalMonitoringStore } from "@/store/environmentalMonitoringStore";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@heroui/react";
import { CustomDateInput } from "@/components/CustomDateInput";
import { CustomTextarea } from "@/components/CustomTextarea";
import { CustomInput } from "@/components/CustomInput";
import { CustomSelect } from "@/components/CustomSelect";
import { useMediaQuery } from "react-responsive";

interface EnvironmentalMonitoringFormModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

export const EnvironmentalMonitoringFormModal: FC<EnvironmentalMonitoringFormModalProps> = ({
  isOpen,
  onOpenChange
}) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const { id, setId } = useEnvironmentalMonitoringStore((state) => state);

  const initialDefaultValues = useMemo(
    (): EnvironmentalMonitoringFormData => ({
      area: "",
      agentType: "",
      agentDescription: "",
      measuredValue: "",
      unit: "",
      permittedLimit: "",
      measurementDate: "",
      frequency: "",
      responsible: "",
      observations: ""
    }),
    []
  );

  const { handleSubmit, control, reset, setError } =
      useForm<EnvironmentalMonitoringFormData>({
        resolver: zodResolver(environmentalMonitoringSchema),
        defaultValues: initialDefaultValues,
        mode: "onSubmit"
      });

  const { save, isPending } = useSaveMutation({
    mutationFn: saveEnvironmentalMonitoring,
    onSuccess: onOpenChange,
    setError,
    queryKeys: ["environmentalMonitorings"]
  });

  const monitoringQuery = useQuery<EnvironmentalMonitoring>({
    queryKey: ["environmentalMonitoring"],
    queryFn: () => getEnvironmentalMonitoring(id),
    enabled: false
  });

  useEffect(() => {
    if (!isOpen) {
      setId("");
      setTimeout(() => {
        reset(initialDefaultValues);
      }, 300);
    }
  }, [isOpen]);

  useEffect(() => {
    if (id && isOpen) {
      assignFormData();
    }
  }, [id, isOpen]);

  const assignFormData = () => {
    monitoringQuery.refetch().then(async (response) => {
      if (response.status === "success") {
        const m = response.data;
        reset({
          area: m.area,
          agentType: m.agentType,
          agentDescription: m.agentDescription,
          measuredValue: m.measuredValue,
          unit: m.unit,
          permittedLimit: m.permittedLimit,
          measurementDate: m.measurementDate,
          frequency: m.frequency,
          responsible: m.responsible,
          observations: m.observations
        });
      }
    });
  };

  const isLoading = useMemo(
    () => monitoringQuery.isFetching && !!id,
    [monitoringQuery.isFetching, id]
  );

  const isSaving = useMemo(
    () => isPending || isLoading,
    [isPending, isLoading]
  );

  return (
    <FormModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={id ? "Editar monitoreo ambiental" : "Registrar monitoreo ambiental"}
      customSaveButton={{
        content: "Guardar",
        color: "success",
        show: true
      }}
      isLoading={isLoading}
      isSaving={isSaving}
      size={isMobile ? "full" : "5xl"}
      scrollBehavior={isMobile ? "inside" : "normal"}
      onSubmit={handleSubmit((data) => save({ ...data, id }))}
      skeletonForm={
        <>
          <div className="grid grid-cols-1 md:grid-cols-[150px_1fr_150px_150px_150px] gap-x-3">
            <Skeleton className="h-[48px] mb-[18px] rounded-lg md:col-span-5" />
            <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
            <Skeleton className="h-[48px] mb-[18px] rounded-lg md:col-span-4" />
            <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
            <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
            <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
            <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
            <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
            <Skeleton className="h-[48px] mb-[18px] rounded-lg md:col-span-5" />
            <Skeleton className="h-[100px] mb-[18px] rounded-lg md:col-span-5" />
          </div>
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-[150px_1fr_150px_150px_150px] gap-x-3">
        <Controller
          name="area"
          control={control}
          render={({ field, fieldState }) => (
            <CustomInput
              label="Área"
              placeholder="Ingrese el área"
              variant="flat"
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              size="sm"
              {...field}
              isDisabled={isPending}
              isRequired
              className="md:col-span-5"
            />
          )}
        />
        <Controller
          name="agentType"
          control={control}
          render={({ field, fieldState }) => (
            <CustomSelect
              label="Tipo de agente"
              placeholder="Seleccione"
              variant="flat"
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              size="sm"
              data={[
                { label: "Físico", value: "Físico" },
                { label: "Químico", value: "Químico" },
                { label: "Biológico", value: "Biológico" },
                { label: "Psicosocial", value: "Psicosocial" },
                { label: "Disergonómico", value: "Disergonómico" }
              ]}
              selectionMode="single"
              {...field}
              isRequired
              isDisabled={isPending}
            />
          )}
        />
        <Controller
          name="agentDescription"
          control={control}
          render={({ field, fieldState }) => (
            <CustomInput
              label="Descripción del agente"
              placeholder="Ingrese la descripción"
              variant="flat"
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              size="sm"
              {...field}
              isDisabled={isPending}
              className="md:col-span-4"
            />
          )}
        />

        <Controller
          name="measuredValue"
          control={control}
          render={({ field, fieldState }) => (
            <CustomInput
              label="Valor medido"
              placeholder="Ingrese el valor medido"
              variant="flat"
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              size="sm"
              type="number"
              {...field}
              isDisabled={isPending}
              isRequired
            />
          )}
        />
        <Controller
          name="unit"
          control={control}
          render={({ field, fieldState }) => (
            <CustomSelect
              label="Unidad"
              placeholder="Seleccione"
              variant="flat"
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              size="sm"
              data={[
                { label: "dB – Decibelio", value: "dB" },
                { label: "ppm – Partes por millón", value: "ppm" },
                { label: "µT – Microtesla", value: "µT" },
                { label: "mg/m³ – Miligramos por metro cúbico", value: "mg/m³" },
                { label: "°C – Grados Celsius", value: "°C" },
                { label: "% – Porcentaje", value: "%" },
                { label: "lux – Lux", value: "lux" },
                { label: "m/s – Metros por segundo", value: "m/s" },
                { label: "Hz – Hertz", value: "Hz" },
                { label: "W/m² – Vatios por metro cuadrado", value: "W/m²" },
                { label: "Pa – Pascal", value: "Pa" },
                { label: "kPa – Kilopascal", value: "kPa" },
                { label: "mbar – Milibar", value: "mbar" },
                { label: "ppmV – Partes por millón (volumen)", value: "ppmV" },
                { label: "g/L – Gramos por litro", value: "g/L" },
                { label: "µg/m³ – Microgramos por metro cúbico", value: "µg/m³" },
                { label: "m³/h – Metros cúbicos por hora", value: "m³/h" },
                { label: "bar – Bar", value: "bar" },
                { label: "V – Voltio", value: "V" },
                { label: "A – Amperio", value: "A" }
              ]}
              selectionMode="single"
              {...field}
              isRequired
              isDisabled={isPending}
            />
          )}
        />

        <Controller
          name="permittedLimit"
          control={control}
          render={({ field, fieldState }) => (
            <CustomInput
              label="Límite permitido"
              placeholder="Ingrese el límite permitido"
              variant="flat"
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              size="sm"
              type="number"
              {...field}
              isDisabled={isPending}
            />
          )}
        />
        <Controller
          name="measurementDate"
          control={control}
          render={({ field, fieldState }) => (
            <CustomDateInput
              label="Fecha de medición"
              placeholder="Seleccione la fecha"
              variant="flat"
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              size="sm"
              {...field}
              isDisabled={isPending}
              isRequired
            />
          )}
        />
        <Controller
          name="frequency"
          control={control}
          render={({ field, fieldState }) => (
            <CustomSelect
              label="Frecuencia"
              placeholder="Seleccione"
              variant="flat"
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              size="sm"
              data={[
                { label: "Mensual", value: "Mensual" },
                { label: "Trimestral", value: "Trimestral" },
                { label: "Semestral", value: "Semestral" },
                { label: "Anual", value: "Anual" }
              ]}
              selectionMode="single"
              {...field}
              isRequired
              isDisabled={isPending}
            />
          )}
        />
        <Controller
          name="responsible"
          control={control}
          render={({ field, fieldState }) => (
            <CustomInput
              label="Responsable"
              placeholder="Ingrese el responsable"
              variant="flat"
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              size="sm"
              {...field}
              isDisabled={isPending}
              isRequired
              className="md:col-span-5"
            />
          )}
        />
        <Controller
          name="observations"
          control={control}
          render={({ field, fieldState }) => (
            <CustomTextarea
              label="Observaciones"
              placeholder="Ingrese observaciones"
              variant="flat"
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              {...field}
              isDisabled={isPending}
              className="md:col-span-5 mb-[18px]"
            />
          )}
        />
      </div>
    </FormModal>
  );
};
