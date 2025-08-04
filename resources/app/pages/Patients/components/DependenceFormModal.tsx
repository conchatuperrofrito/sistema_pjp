import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import useSaveMutation from "@/hooks/useSaveMutation";
import { getDependence, saveDependence } from "@/services/dependenceService";
import { FormModal } from "@/components/FormModal";
import { dependenceSchema } from "@/validators/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useDependenceStore } from "@/store/dependenceStore";
import { Skeleton } from "@heroui/react";
import { CustomTextarea } from "@/components/CustomTextarea";

interface DependenceFormModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  saveReturnData?: (data: { dependenceId: string }) => void;
}

interface DependenceForm {
  name: string;
}

const DependenceFormModal: React.FC<DependenceFormModalProps> = ({
  isOpen,
  onOpenChange,
  saveReturnData
}) => {
  const { dependenceId, setDependenceId } = useDependenceStore((state) => state);

  const initialDefaultValues = useMemo(
    (): DependenceForm => ({
      name: ""
    }),
    []
  );

  const { handleSubmit, control, reset, setError } = useForm<DependenceForm>({
    resolver: zodResolver(dependenceSchema),
    defaultValues: initialDefaultValues,
    mode: "onSubmit"
  });

  const dependenceQuery = useQuery({
    queryKey: ["dependence"],
    queryFn: () => getDependence(dependenceId),
    enabled: false
  });

  useEffect(() => {
    if (!isOpen) {
      setDependenceId("");
      setTimeout(() => {
        reset(initialDefaultValues);
      }, 300);
    }
  }, [isOpen]);

  useEffect(() => {
    if (dependenceId && isOpen) {
      assignFormData();
    }
  }, [dependenceId, isOpen]);

  const assignFormData = () => {
    dependenceQuery.refetch().then((response) => {
      if (response.status === "success") {
        reset({ name: response.data.name });
      }
    });
  };

  const { save, isPending } = useSaveMutation({
    mutationFn: saveDependence,
    onSuccess: onOpenChange,
    queryKeys: ["patientDependences", "dependences"],
    setError,
    setDataResponse: (data) => {
      if (data && saveReturnData) {
        saveReturnData(data);
      }
    }
  });

  const isLoading = useMemo(
    () => dependenceQuery.isFetching && !!dependenceId,
    [dependenceQuery.isFetching, dependenceId]
  );

  const isSaving = useMemo(
    () => isPending || isLoading,
    [isPending, isLoading]
  );

  return (
    <FormModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={dependenceId ? "Editar dependencia" : "Registrar dependencia"}
      isLoading={isLoading}
      isSaving={isSaving}
      onSubmit={handleSubmit((data) => save({ ...data, id: dependenceId }))}
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
            label="Nombre de la dependencia"
            placeholder="Ingrese el nombre de la dependencia"
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

export default DependenceFormModal;
