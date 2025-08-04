import { FC, useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { DentalEvolutionForm } from "@/types/doctorInterfaces";
import { dentalEvolutionSchema } from "@/validators/validationSchemas";
import useSaveMutation from "@/hooks/useSaveMutation";
import { saveDentalEvolution } from "@/services/doctorService";
import { FormModal } from "@/components/FormModal";
import { useForm, Controller } from "react-hook-form";
import { CustomInput } from "@/components/CustomInput";
import { useAppointmentStore } from "@/store/appointmentStore";
import { Skeleton, DateInput, Button } from "@heroui/react";
import { PrescriptionBottlePillIcon } from "@/assets/icons";

interface DentalEvolutionFormModalProps extends FormModalProps {
  onOpenOdontogramModal: () => void;
  openPrescriptionModal: () => void;
}

const DentalEvolutionFormModal: FC<DentalEvolutionFormModalProps> = ({
  isOpen,
  onOpenChange,
  onOpenOdontogramModal,
  openPrescriptionModal
}) => {
  const {
    appointmentId,
    setDentalEvolutionForm,
    dentalEvolutionForm,
    resetForm
  } = useAppointmentStore((state) => state);

  const { handleSubmit, control, reset, setError, watch } = useForm<DentalEvolutionForm>({
    resolver: zodResolver(dentalEvolutionSchema),
    defaultValues: dentalEvolutionForm,
    mode: "onSubmit"
  });

  const { save, isPending } = useSaveMutation({
    mutationFn: saveDentalEvolution,
    onSuccess: onOpenChange,
    setError,
    queryKeys: ["appointments"]
  });

  useEffect(() => {
    if (isOpen) {
      reset(dentalEvolutionForm);
    }
  }, [isOpen]);

  const isLoading = false;

  const isSaving = useMemo(
    () => isPending || isLoading,
    [isPending, isLoading]
  );

  return (
    <FormModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onModalClose={resetForm}
      title={"Formulario de evolución dental"}
      isLoading={isLoading}
      isSaving={isSaving}
      onSubmit={handleSubmit((data) => {
        save({ ...data, appointmentId });
        resetForm();
      })}
      size="lg"
      customCloseButton={{
        show: true,
        content: "Atrás",
        startContent: <span style={{ fontSize: "16px" }}> {"<-"} </span>,
        onClick: () => {
          onOpenOdontogramModal();
          onOpenChange();
          setDentalEvolutionForm(watch());
        }
      }}
      skeletonForm={
        <>
          <div className="grid grid-cols-[1fr_1fr] grid-rows-auto gap-x-3">
            <Skeleton className="h-[48px] mb-[18px] rounded-lg col-span-2" />
            <Skeleton className="h-[48px] mb-[18px] rounded-lg col-span-2" />
            <Skeleton className="h-[48px] mb-[18px] rounded-lg col-span-2" />
            <Skeleton className="h-[48px] mb-[18px] rounded-lg col-span-2" />
          </div>
        </>
      }
      extraContentFooter={
        <Button
          className="bg-blue-500 text-white hover:bg-blue-600"
          onPress={openPrescriptionModal}
          isDisabled={isPending}
        >
          Recetar
          <PrescriptionBottlePillIcon />
        </Button>
      }
    >
      <div className="grid grid-cols-[1fr_1fr] grid-rows-auto gap-x-3">

        <Controller
          name="date"
          control={control}
          render={({ field, fieldState }) => (
            <DateInput
              label="Fecha"
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              className="col-span-2"
              size="sm"
              {...field}
              isDisabled={isPending}
              classNames={{
                base: "h-[68px]",
                inputWrapper: "h-[48px]",
                helperWrapper: "py-0"
              }}
              isRequired
            />
          )}
        />

        <Controller
          name="specifications"
          control={control}
          render={({ field, fieldState }) => (
            <CustomInput
              label="Especificaciones"
              placeholder="Ejm: Gingivitis crónica"
              className="col-span-2"
              variant="flat"
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              size="sm"
              autoComplete="off"
              {...field}
              isDisabled={isPending}
              isRequired
            />
          )}
        />

        <Controller
          name="observations"
          control={control}
          render={({ field, fieldState }) => (
            <CustomInput
              label="Observaciones"
              placeholder="Ejm: Gingivitis crónica"
              className="col-span-2"
              variant="flat"
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              size="sm"
              autoComplete="off"
              {...field}
              isDisabled={isPending}
              isRequired
            />
          )}
        />

        <Controller
          name="basicDentalDischarge"
          control={control}
          render={({ field, fieldState }) => (
            <DateInput
              label="Alta básica Odontológica"
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              className="col-span-2"
              size="sm"
              {...field}
              isDisabled={isPending}
              classNames={{
                base: "h-[68px]",
                inputWrapper: "h-[48px]",
                helperWrapper: "py-0"
              }}
              startContent="Fecha: "
              isRequired
            />
          )}
        />
      </div>
    </FormModal>
  );
};

export default DentalEvolutionFormModal;
