import { FC, useEffect, useMemo } from "react";
import { Inspection, InspectionFormData } from "@/types/inspectionInterfaces";
import { zodResolver } from "@hookform/resolvers/zod";
import { inspectionSchema } from "@/validators/validationSchemas";
import useSaveMutation from "@/hooks/useSaveMutation";
import { getInspection, saveInspection } from "@/services/inspectionService";
import { FormModal } from "@/components/FormModal";
import { useForm, Controller } from "react-hook-form";
import { CustomSelect } from "@/components/CustomSelect";
import { useInspectionStore } from "@/store/inspectionStore";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@heroui/react";
import { CustomDateInput } from "@/components/CustomDateInput";
import { CustomTextarea } from "@/components/CustomTextarea";
import { CustomInput } from "@/components/CustomInput";
import { useMediaQuery } from "react-responsive";

interface InspectionFormModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

export const InspectionFormModal: FC<InspectionFormModalProps> = ({
  isOpen,
  onOpenChange
}) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const { id, setId } = useInspectionStore((state) => state);

  const initialDefaultValues = useMemo(
    (): InspectionFormData => ({
      date: "",
      area: "",
      inspector: "",
      findings: "",
      severity: "",
      recommendations: "",
      correctionDeadline: "",
      correctionResponsible: ""
    }),
    []
  );

  const { handleSubmit, control, reset, setError } =
      useForm<InspectionFormData>({
        resolver: zodResolver(inspectionSchema),
        defaultValues: initialDefaultValues,
        mode: "onSubmit"
      });

  const { save, isPending } = useSaveMutation({
    mutationFn: saveInspection,
    onSuccess: onOpenChange,
    setError,
    queryKeys: ["inspections"]
  });

  const inspectionQuery = useQuery<Inspection>({
    queryKey: ["inspection"],
    queryFn: () => getInspection(id),
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
    inspectionQuery.refetch().then(async (response) => {
      if (response.status === "success") {
        const inspection = response.data;

        reset({
          date: inspection.date,
          area: inspection.area,
          inspector: inspection.inspector,
          findings: inspection.findings,
          severity: inspection.severity,
          recommendations: inspection.recommendations,
          correctionDeadline: inspection.correctionDeadline,
          correctionResponsible: inspection.correctionResponsible
        });
      }
    });
  };

  const isLoading = useMemo(
    () => inspectionQuery.isFetching && !!id,
    [inspectionQuery.isFetching, id]
  );

  const isSaving = useMemo(
    () => isPending || isLoading,
    [isPending, isLoading]
  );

  return (
    <FormModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={id ? "Editar inspección" : "Registrar inspección"}
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
          <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] grid-rows-auto gap-x-3">
            <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
            <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
            <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
            <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
            <Skeleton className="h-[100px] mb-[18px] rounded-lg col-span-2" />
            <Skeleton className="h-[100px] mb-[18px] rounded-lg col-span-2" />
            <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
            <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
          </div>
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] grid-rows-auto gap-x-3">
        <Controller
          name="date"
          control={control}
          render={({ field, fieldState }) => (
            <CustomDateInput
              label="Fecha"
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
            />
          )}
        />

        <Controller
          name="severity"
          control={control}
          render={({ field, fieldState }) => (
            <CustomSelect
              label="Severidad"
              placeholder="Seleccione"
              variant="flat"
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              size="sm"
              data={[
                { label: "Baja", value: "Baja" },
                { label: "Moderada", value: "Moderada" },
                { label: "Alta", value: "Alta" }
              ]}
              selectionMode="single"
              {...field}
              isRequired
              isDisabled={isPending}
            />
          )}
        />

        <Controller
          name="inspector"
          control={control}
          render={({ field, fieldState }) => (
            <CustomInput
              label="Inspector"
              placeholder="Ingrese el inspector"
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
          name="findings"
          control={control}
          render={({ field, fieldState }) => (
            <CustomTextarea
              label="Hallazgos"
              placeholder="Describa los hallazgos de la inspección"
              variant="flat"
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              {...field}
              isDisabled={isPending}
              isRequired
              className="mb-[18px] md:col-span-2"
              rows={3}
            />
          )}
        />

        <Controller
          name="recommendations"
          control={control}
          render={({ field, fieldState }) => (
            <CustomTextarea
              label="Recomendaciones"
              placeholder="Describa las recomendaciones"
              variant="flat"
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              {...field}
              isDisabled={isPending}
              isRequired
              className="mb-[18px] md:col-span-2"
              rows={3}
            />
          )}
        />

        <Controller
          name="correctionDeadline"
          control={control}
          render={({ field, fieldState }) => (
            <CustomDateInput
              label="Fecha límite de corrección"
              placeholder="Seleccione la fecha (opcional)"
              variant="flat"
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              {...field}
              isDisabled={isPending}
            />
          )}
        />

        <Controller
          name="correctionResponsible"
          control={control}
          render={({ field, fieldState }) => (
            <CustomInput
              label="Responsable de corrección"
              placeholder="Ingrese el responsable"
              variant="flat"
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              {...field}
              isDisabled={isPending}
              isRequired
            />
          )}
        />
      </div>
    </FormModal>
  );
};

export default InspectionFormModal;
