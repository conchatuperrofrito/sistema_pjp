import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import useSaveMutation from "@/hooks/useSaveMutation";
import { getPosition, savePosition } from "@/services/positionService";
import { FormModal } from "@/components/FormModal";
import { positionSchema } from "@/validators/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { usePositionStore } from "@/store/positionStore";
import { Skeleton } from "@heroui/react";
import { CustomTextarea } from "@/components/CustomTextarea";

interface PositionFormModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  saveReturnData?: (data: { positionId: string }) => void;
}

interface PositionForm {
  name: string;
}

const PositionFormModal: React.FC<PositionFormModalProps> = ({
  isOpen,
  onOpenChange,
  saveReturnData
}) => {
  const { positionId, setPositionId } = usePositionStore((state) => state);

  const initialDefaultValues = useMemo(
    (): PositionForm => ({
      name: ""
    }),
    []
  );

  const { handleSubmit, control, reset, setError } = useForm<PositionForm>({
    resolver: zodResolver(positionSchema),
    defaultValues: initialDefaultValues,
    mode: "onSubmit"
  });


  const positionQuery = useQuery({
    queryKey: ["position"],
    queryFn: () => getPosition(positionId),
    enabled: false
  });

  useEffect(() => {
    if (!isOpen) {
      setPositionId("");
      setTimeout(() => {
        reset(initialDefaultValues);
      }, 300);
    }
  }, [isOpen]);

  useEffect(() => {
    if (positionId && isOpen) {
      assignFormData();
    }
  }, [positionId, isOpen]);

  const assignFormData = () => {
    positionQuery.refetch().then((response) => {
      if (response.status === "success") {
        reset({ name: response.data.name });
      }
    });
  };

  const { save, isPending } = useSaveMutation({
    mutationFn: savePosition,
    onSuccess: onOpenChange,
    queryKeys: ["patientPositions", "positions"],
    setError,
    setDataResponse: (data) => {
      if (data && saveReturnData) {
        saveReturnData(data);
      }
    }
  });

  const isLoading = useMemo(
    () => positionQuery.isFetching && !!positionId,
    [positionQuery.isFetching, positionId]
  );

  const isSaving = useMemo(
    () => isPending || isLoading,
    [isPending, isLoading]
  );

  return (
    <FormModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={positionId ? "Editar cargo" : "Registrar cargo"}
      isLoading={isLoading}
      isSaving={isSaving}
      onSubmit={handleSubmit((data) => save({ ...data, id: positionId }))}
      onClose={() => reset(initialDefaultValues)}
      size="2xl"
      skeletonForm={
        <div className="grid grid-rows-auto gap-x-3">
          <Skeleton className="h-[79.97px] mb-[18px] rounded-lg col-span-3" />
        </div>
      }
    >
      <Controller
        name="name"
        control={control}
        render={({ field, fieldState }) => (
          <CustomTextarea
            {...field}
            label="Nombre del cargo"
            placeholder="Ingrese el nombre del cargo"
            rows={2}
            isInvalid={!!fieldState.error}
            errorMessage={fieldState.error?.message}
            isDisabled={isPending}
            isRequired
            className="mb-[18px]"
          />
        )}
      />
    </FormModal>
  );
};

export default PositionFormModal;
