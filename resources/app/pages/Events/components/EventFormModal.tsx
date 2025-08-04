import { FC, useEffect, useMemo } from "react";
import { Event, EventFormData } from "@/types/eventInterfaces";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventSchema } from "@/validators/validationSchemas";
import useSaveMutation from "@/hooks/useSaveMutation";
import { getEvent, saveEvent } from "@/services/eventService";
import { FormModal } from "@/components/FormModal";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { CustomInput } from "@/components/CustomInput";
import { useEventStore } from "@/store/eventStore";
import { useQuery } from "@tanstack/react-query";
import { Divider, Skeleton, Button } from "@heroui/react";
import { CustomDateInput } from "@/components/CustomDateInput";
import { CustomTimeInput } from "@/components/CustomTimeInput";
import { PlusIcon, TrashSolidIcon } from "@/assets/icons";
import { useMediaQuery } from "react-responsive";

interface EventFormModalProps {
    isOpen: boolean;
    onOpenChange: () => void;
    saveReturnData?: (data: { eventId: string }) => void;
}

export const EventFormModal: FC<EventFormModalProps> = ({
  isOpen,
  onOpenChange,
  saveReturnData
}) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const { id, setId } = useEventStore((state) => state);

  const initialDefaultValues = useMemo(
    (): EventFormData => ({
      title: "",
      subtitle: "",
      description: "",
      venueName: "",
      venueAddress: "",
      targetAudience: "",
      organizer: "",
      organizingArea: "",
      schedules: [{ date: "", startTime: "", endTime: "" }]
    }),
    []
  );

  const { handleSubmit, control, reset, setError } =
        useForm<EventFormData>({
          resolver: zodResolver(eventSchema),
          defaultValues: initialDefaultValues,
          mode: "onSubmit"
        });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "schedules"
  });

  const { save, isPending } = useSaveMutation({
    mutationFn: saveEvent,
    onSuccess: onOpenChange,
    setError,
    queryKeys: ["events"],
    setDataResponse: (data) => {
      if (data && saveReturnData) {
        saveReturnData(data);
      }
    }
  });

  const eventQuery = useQuery<Event>({
    queryKey: ["event"],
    queryFn: () => getEvent(id),
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
    eventQuery.refetch().then(async (response) => {
      if (response.status === "success") {
        const event = response.data;
        reset(event);
      }
    });
  };

  const isLoading = useMemo(
    () => eventQuery.isFetching && !!id,
    [eventQuery.isFetching, id]
  );

  const isSaving = useMemo(
    () => isPending || isLoading,
    [isPending, isLoading]
  );

  return (
    <FormModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={id ? "Editar evento" : "Registrar evento"}
      customSaveButton={{
        content: "Guardar",
        color: "success",
        show: true
      }}
      isLoading={isLoading}
      isSaving={isSaving}
      size={isMobile ? "full" : "3xl"}
      scrollBehavior={isMobile ? "inside" : "normal"}
      onSubmit={handleSubmit((data) => {
        save({ ...data, id });
      })}
      skeletonForm={
        <>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] grid-rows-auto gap-x-3">
            <Skeleton className="h-[48px] mb-[18px] rounded-lg md:col-span-2" />
            <Skeleton className="h-[48px] mb-[18px] rounded-lg md:col-span-2" />
            <Skeleton className="h-[48px] mb-[18px] rounded-lg md:col-span-2" />
            <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
            <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
            <Skeleton className="h-[48px] mb-[18px] rounded-lg md:col-span-2" />
            <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
            <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
          </div>

          <div className="flex items-center justify-between">
            <p className="text-small text-default-500">HORARIOS</p>
            <Skeleton className="h-[32px] w-[140.1px] rounded-small" />
          </div>

          <Divider className="mt-1 mb-2" />
          <div className="grid grid-cols-[1fr_1fr_1fr] grid-rows-auto gap-x-3">
            <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
            <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
            <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
          </div>

        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] grid-rows-auto gap-x-3">
        <Controller
          name="title"
          control={control}
          render={({ field, fieldState }) => (
            <CustomInput
              label="Título"
              placeholder="Ingrese el título"
              variant="flat"
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              size="sm"
              autoComplete="off"
              className="md:col-span-2"
              {...field}
              isDisabled={isPending}
              isRequired
            />
          )}
        />

        <Controller
          name="subtitle"
          control={control}
          render={({ field, fieldState }) => (
            <CustomInput
              label="Subtítulo"
              placeholder="Ingrese el subtítulo"
              variant="flat"
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              size="sm"
              autoComplete="off"
              className="md:col-span-2"
              {...field}
              isDisabled={isPending}
            />
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field, fieldState }) => (
            <CustomInput
              label="Descripción"
              placeholder="Ingrese la descripción"
              variant="flat"
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              size="sm"
              autoComplete="off"
              {...field}
              isDisabled={isPending}
              className="md:col-span-2"
            />
          )}
        />

        <Controller
          name="venueName"
          control={control}
          render={({ field, fieldState }) => (
            <CustomInput
              label="Nombre del lugar"
              placeholder="Ingrese el nombre del lugar"
              variant="flat"
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              size="sm"
              autoComplete="off"
              {...field}
              isDisabled={isPending}
            />
          )}
        />

        <Controller
          name="venueAddress"
          control={control}
          render={({ field, fieldState }) => (
            <CustomInput
              label="Dirección del lugar"
              placeholder="Ingrese la dirección del lugar"
              variant="flat"
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              size="sm"
              autoComplete="off"
              {...field}
              isDisabled={isPending}
            />
          )}
        />

        <Controller
          name="targetAudience"
          control={control}
          render={({ field, fieldState }) => (
            <CustomInput
              label="Público objetivo"
              placeholder="Ingrese el público objetivo"
              variant="flat"
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              size="sm"
              autoComplete="off"
              className="md:col-span-2"
              {...field}
              isDisabled={isPending}
            />
          )}
        />

        <Controller
          name="organizer"
          control={control}
          render={({ field, fieldState }) => (
            <CustomInput
              label="Organizador"
              placeholder="Ingrese el organizador"
              variant="flat"
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              size="sm"
              autoComplete="off"
              {...field}
              isDisabled={isPending}
            />
          )}
        />

        <Controller
          name="organizingArea"
          control={control}
          render={({ field, fieldState }) => (
            <CustomInput
              label="Área organizadora"
              placeholder="Ingrese el área organizadora"
              variant="flat"
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              size="sm"
              autoComplete="off"
              {...field}
              isDisabled={isPending}
            />
          )}
        />
      </div>

      <div className="flex items-center justify-between">
        <p className="text-small text-default-500">HORARIOS</p>
        <Button
          size="sm"
          color="primary"
          variant="flat"
          startContent={<PlusIcon />}
          onPress={() => append({ date: "", startTime: "", endTime: "" })}
          isDisabled={isPending}
        >
          Agregar horario
        </Button>
      </div>
      <Divider className="mt-1 mb-2" />

      {fields.map((field, index) => (
        <div key={field.id} className="grid grid-cols-[1fr_1fr_1fr] grid-rows-auto gap-x-3 relative group">
          <Controller
            name={`schedules.${index}.date`}
            control={control}
            render={({ field, fieldState }) => (
              <CustomDateInput
                label="Fecha"
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
            name={`schedules.${index}.startTime`}
            control={control}
            render={({ field, fieldState }) => (
              <CustomTimeInput
                label={isMobile ? "Hor. inicio" : "Hora de inicio"}
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
            name={`schedules.${index}.endTime`}
            control={control}
            render={({ field, fieldState }) => (
              <CustomTimeInput
                label={isMobile ? "Hor. fin" : "Hora de fin"}
                isInvalid={!!fieldState.error}
                errorMessage={fieldState.error?.message}
                size="sm"
                {...field}
                isDisabled={isPending}
                isRequired
              />
            )}
          />
          { index > 0 && (
            <Button
              size="sm"
              isIconOnly
              color="danger"
              className="absolute top-[-10px] right-[-10px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              onPress={() => remove(index)}
            >
              <TrashSolidIcon />
            </Button>
          )}
        </div>
      ))}
    </FormModal>
  );
};

export default EventFormModal;
