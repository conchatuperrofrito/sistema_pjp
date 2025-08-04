import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import useSaveMutation from "@/hooks/useSaveMutation";
import { getMedication, saveMedication } from "@/services/medicationService";
import { FormModal } from "@/components/FormModal";
import { medicationSchema } from "@/validators/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useMedicationStore } from "@/store/medicationStore";
import { Skeleton } from "@heroui/react";
import { CustomInput } from "@/components/CustomInput";
import { MedicationFormData } from "@/types/medicationInterfaces";
import DosageFormsAutocomplete from "./DosageFormsAutocomplete";

interface MedicationFormModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

const MedicationFormModal: React.FC<MedicationFormModalProps> = ({
  isOpen,
  onOpenChange
}) => {
  const { medicationId, setMedicationId, setAdditionalData } = useMedicationStore((state) => state);

  const initialDefaultValues = useMemo(
    (): MedicationFormData => ({
      genericName: "",
      concentration: "",
      presentation: "",
      dosageFormId: ""
    }),
    []
  );

  const { handleSubmit, control, reset, setError } = useForm<MedicationFormData>({
    resolver: zodResolver(medicationSchema),
    defaultValues: initialDefaultValues,
    mode: "onSubmit"
  });

  const medicationQuery = useQuery({
    queryKey: ["medication"],
    queryFn: () => getMedication(medicationId),
    enabled: false
  });

  useEffect(() => {
    if (!isOpen) {
      setMedicationId("");
      setTimeout(() => {
        reset(initialDefaultValues);
      }, 300);
    }
  }, [isOpen]);

  useEffect(() => {
    if (medicationId && isOpen) {
      assignFormData();
    }
  }, [medicationId, isOpen]);

  const assignFormData = () => {
    medicationQuery.refetch().then((response) => {
      if (response.status === "success") {
        reset({
          genericName: response.data.genericName,
          concentration: response.data.concentration,
          presentation: response.data.presentation,
          dosageFormId: response.data.dosageFormId
        });
      }
    });
  };

  const { save, isPending } = useSaveMutation({
    mutationFn: saveMedication,
    onSuccess: onOpenChange,
    queryKeys: ["medications"],
    setError,
    setDataResponse: (data) => {
      if (data) {
        setAdditionalData(data);
      }
    }
  });

  const isLoading = useMemo(
    () => medicationQuery.isFetching && !!medicationId,
    [medicationQuery.isFetching, medicationId]
  );

  const isSaving = useMemo(
    () => isPending || isLoading,
    [isPending, isLoading]
  );

  return (
    <FormModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={medicationId ? "Editar medicamento" : "Registrar medicamento"}
      isLoading={isLoading}
      isSaving={isSaving}
      onSubmit={handleSubmit((data) => save({ ...data, id: medicationId }))}
      onClose={() => reset(initialDefaultValues)}
      size="2xl"
      skeletonForm={
        <div className="grid grid-cols-1 gap-x-3">
          <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
          <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
          <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
          <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
        </div>
      }
    >
      <Controller
        name="genericName"
        control={control}
        render={({ field, fieldState }) => (
          <CustomInput
            {...field}
            label="Nombre genérico"
            placeholder="Ingrese el nombre genérico del medicamento"
            isInvalid={!!fieldState.error}
            errorMessage={fieldState.error?.message}
            isDisabled={isPending}
            isRequired
          />
        )}
      />

      <Controller
        name="concentration"
        control={control}
        render={({ field, fieldState }) => (
          <CustomInput
            {...field}
            label="Concentración"
            placeholder="Ej: 500mg, 10mg/ml"
            isInvalid={!!fieldState.error}
            errorMessage={fieldState.error?.message}
            isDisabled={isPending}
          />
        )}
      />

      <Controller
        name="presentation"
        control={control}
        render={({ field, fieldState }) => (
          <CustomInput
            {...field}
            label="Presentación"
            placeholder="Ej: 100mL, 50mL, gotas"
            isInvalid={!!fieldState.error}
            errorMessage={fieldState.error?.message}
            isDisabled={isPending}
          />
        )}
      />

      <Controller
        name="dosageFormId"
        control={control}
        render={({ field, fieldState }) => (
          <DosageFormsAutocomplete
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            isInvalid={!!fieldState.error}
            errorMessage={fieldState.error?.message}
            isDisabled={isPending}
            isRequired
          />
        )}
      />

    </FormModal>
  );
};

export default MedicationFormModal;
