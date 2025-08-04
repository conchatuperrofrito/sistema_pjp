import { FC, useEffect, useMemo } from "react";
import { CommitteeMinute, CommitteeMinuteFormData } from "@/types/committeeMinuteInterfaces";
import { zodResolver } from "@hookform/resolvers/zod";
import { committeeMinuteSchema } from "@/validators/validationSchemas";
import useSaveMutation from "@/hooks/useSaveMutation";
import { getCommitteeMinute, saveCommitteeMinute } from "@/services/committeeMinuteService";
import { FormModal } from "@/components/FormModal";
import { useForm, Controller } from "react-hook-form";
import { useCommitteeMinuteStore } from "@/store/committeeMinuteStore";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@heroui/react";
import { CustomDateInput } from "@/components/CustomDateInput";
import { CustomTextarea } from "@/components/CustomTextarea";
import { CustomInput } from "@/components/CustomInput";

interface CommitteeMinuteFormModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

export const CommitteeMinuteFormModal: FC<CommitteeMinuteFormModalProps> = ({
  isOpen,
  onOpenChange
}) => {
  const { id, setId } = useCommitteeMinuteStore((state) => state);

  const initialDefaultValues = useMemo(
    (): CommitteeMinuteFormData => ({
      date: "",
      topics: "",
      agreements: "",
      followupResponsible: "",
      nextMeetingDate: ""
    }),
    []
  );

  const { handleSubmit, control, reset, setError } =
      useForm<CommitteeMinuteFormData>({
        resolver: zodResolver(committeeMinuteSchema),
        defaultValues: initialDefaultValues,
        mode: "onSubmit"
      });

  const { save, isPending } = useSaveMutation({
    mutationFn: saveCommitteeMinute,
    onSuccess: onOpenChange,
    setError,
    queryKeys: ["committeeMinutes"]
  });

  const minuteQuery = useQuery<CommitteeMinute>({
    queryKey: ["committeeMinute"],
    queryFn: () => getCommitteeMinute(id),
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
    minuteQuery.refetch().then(async (response) => {
      if (response.status === "success") {
        const m = response.data;
        reset({
          date: m.date,
          topics: m.topics,
          agreements: m.agreements,
          followupResponsible: m.followupResponsible,
          nextMeetingDate: m.nextMeetingDate
        });
      }
    });
  };

  const isLoading = useMemo(
    () => minuteQuery.isFetching && !!id,
    [minuteQuery.isFetching, id]
  );

  const isSaving = useMemo(
    () => isPending || isLoading,
    [isPending, isLoading]
  );

  return (
    <FormModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={id ? "Editar acta de comité" : "Registrar acta de comité"}
      customSaveButton={{
        content: "Guardar",
        color: "success",
        show: true
      }}
      isLoading={isLoading}
      isSaving={isSaving}
      size="4xl"
      onSubmit={handleSubmit((data) => save({ ...data, id }))}
      skeletonForm={
        <>
          <div className="grid grid-cols-1 md:grid-cols-[170px_170px_1fr] gap-x-3">
            <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
            <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
            <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
            <Skeleton className="h-[100px] mb-[18px] rounded-lg md:col-span-3" />
            <Skeleton className="h-[100px] mb-[18px] rounded-lg md:col-span-3" />
          </div>
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-[170px_170px_1fr] gap-x-3">
        <Controller
          name="date"
          control={control}
          render={({ field, fieldState }) => (
            <CustomDateInput
              label="Fecha de reunión"
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
          name="nextMeetingDate"
          control={control}
          render={({ field, fieldState }) => (
            <CustomDateInput
              label="Fecha de próxima reunión"
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
          name="followupResponsible"
          control={control}
          render={({ field, fieldState }) => (
            <CustomInput
              label="Responsable de seguimiento"
              placeholder="Ingrese el responsable"
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
          name="topics"
          control={control}
          render={({ field, fieldState }) => (
            <CustomTextarea
              label="Temas tratados"
              placeholder="Ingrese los temas tratados en la reunión"
              variant="flat"
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              {...field}
              isDisabled={isPending}
              isRequired
              className="mb-[18px] md:col-span-3"
            />
          )}
        />

        <Controller
          name="agreements"
          control={control}
          render={({ field, fieldState }) => (
            <CustomTextarea
              label="Acuerdos tomados"
              placeholder="Ingrese los acuerdos tomados en la reunión"
              variant="flat"
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              {...field}
              isDisabled={isPending}
              isRequired
              className="mb-[18px] md:col-span-3"
            />
          )}
        />
      </div>

    </FormModal>
  );
};
