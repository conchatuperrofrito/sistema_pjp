import { FC, useEffect, useMemo, useState } from "react";
import { Accident, AccidentFormData } from "@/types/accidentInterfaces";
import { zodResolver } from "@hookform/resolvers/zod";
import { accidentSchema } from "@/validators/validationSchemas";
import useSaveMutation from "@/hooks/useSaveMutation";
import { getAccident, saveAccident } from "@/services/accidentService";
import { FormModal } from "@/components/FormModal";
import { useForm, Controller } from "react-hook-form";
import { CustomSelect } from "@/components/CustomSelect";
import { useAccidentStore } from "@/store/accidentStore";
import { useQuery } from "@tanstack/react-query";
import { Button, Skeleton, Popover, PopoverTrigger, PopoverContent } from "@heroui/react";
import { CustomDateInput } from "@/components/CustomDateInput";
import { CustomTimeInput } from "@/components/CustomTimeInput";
import { CustomTextarea } from "@/components/CustomTextarea";
import { CustomInput } from "@/components/CustomInput";
import PatientAutocomplete from "@/pages/Appointments/components/PatientAutocomplete";
import { PatientOption } from "@/types/patientInterfaces";
import { useMediaQuery } from "react-responsive";
import { QrCodeIcon } from "@/assets/icons";
import BarcodeQrScanner from "@/pages/Appointments/components/BarcodeQrScanner";

interface AccidentFormModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

export const AccidentFormModal: FC<AccidentFormModalProps> = ({
  isOpen,
  onOpenChange
}) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const { id, setId, patientId } = useAccidentStore((state) => state);
  const [selectedPatient, setSelectedPatient] = useState<PatientOption>();

  const [isOpenQrScanner, setIsOpenQrScanner] = useState(false);
  const [documentNumber, setDocumentNumber] = useState("");
  const [options, setOptions] = useState<PatientOption[]>([]);

  const initialDefaultValues = useMemo(
    (): AccidentFormData => ({
      date: "",
      hour: "",
      eventType: "",
      patientId: "",
      description: "",
      probableCause: "",
      consequences: "",
      correctiveActions: "",
      responsible: ""
    }),
    []
  );

  const { handleSubmit, control, reset, setError, watch } =
      useForm<AccidentFormData>({
        resolver: zodResolver(accidentSchema),
        defaultValues: initialDefaultValues,
        mode: "onSubmit"
      });

  const { save, isPending } = useSaveMutation({
    mutationFn: saveAccident,
    onSuccess: onOpenChange,
    setError,
    queryKeys: ["accidents"]
  });

  const accidentQuery = useQuery<Accident>({
    queryKey: ["accident"],
    queryFn: () => getAccident(id),
    enabled: false
  });

  useEffect(() => {
    if (patientId) {
      reset({ ...watch(), patientId });
    }
  }, [patientId]);

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

  useEffect(() => {
    if (documentNumber && options.length > 0) {
      reset({ ...watch(), patientId: options[0]?.value });
      setIsOpenQrScanner(false);
    }
  }, [documentNumber, options]);

  const assignFormData = () => {
    accidentQuery.refetch().then(async (response) => {
      if (response.status === "success") {
        const accident = response.data;

        reset({
          date: accident.date,
          hour: accident.hour,
          eventType: accident.eventType,
          patientId: accident.patientId,
          description: accident.description,
          probableCause: accident.probableCause,
          consequences: accident.consequences,
          correctiveActions: accident.correctiveActions,
          responsible: accident.responsible
        });
      }
    });
  };

  const isLoading = useMemo(
    () => accidentQuery.isFetching && !!id,
    [accidentQuery.isFetching, id]
  );

  const isSaving = useMemo(
    () => isPending || isLoading,
    [isPending, isLoading]
  );

  return (
    <FormModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={id ? "Editar accidente" : "Registrar accidente"}
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
          <div className="grid grid-cols-1 md:grid-cols-[120px_120px_130px_1fr] grid-rows-auto gap-x-3">
            <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
            <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
            <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
            <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
          </div>
          <div className="grid grid-cols-[1fr] grid-rows-auto gap-x-3">
            <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
            <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
            <Skeleton className="h-[60px] mb-[18px] rounded-lg" />
            <Skeleton className="h-[60px] mb-[18px] rounded-lg" />
            <Skeleton className="h-[60px] mb-[18px] rounded-lg" />
            <Skeleton className="h-[60px] mb-[18px] rounded-lg" />
            <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
          </div>
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-[120px_120px_130px_1fr] grid-rows-auto gap-x-3">
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
          name="hour"
          control={control}
          render={({ field, fieldState }) => (
            <CustomTimeInput
              label="Hora"
              placeholder="Seleccione la hora"
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
          name="eventType"
          control={control}
          render={({ field, fieldState }) => (
            <CustomSelect
              label="Tipo de evento"
              placeholder="Seleccione"
              variant="flat"
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              size="sm"
              data={[
                { label: "Accidente", value: "Accidente" },
                { label: "Enfermedad", value: "Enfermedad" },
                { label: "Incidente", value: "Incidente" },
                { label: "Otro", value: "Otro" }
              ]}
              selectionMode="single"
              {...field}
              isRequired
              isDisabled={isPending}
            />
          )}
        />

        <div className="flex gap-2">
          <div className="flex-1">
            <Controller
              name="patientId"
              control={control}
              render={({ field, fieldState }) => (
                <PatientAutocomplete
                  label="Trabajador"
                  emptyContentMessage="No se encontró el trabajador"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  isInvalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                  isDisabled={isPending}
                  setSelection={setSelectedPatient}
                  withData
                  isRequired
                  initialSearch={(id ? accidentQuery.data?.patientFullName : "") || documentNumber}
                  setCacheOptions={setOptions}
                />
              )}
            />
          </div>
          <Popover
            placement="right"
            isOpen={isOpenQrScanner}
            onOpenChange={setIsOpenQrScanner}
            shouldCloseOnInteractOutside={() => false}
            classNames={{
              content: "rounded-md p-1"
            }}
            showArrow
          >
            <PopoverTrigger>
              <Button
                isIconOnly
                color="warning"
                className="min-h-[48px] min-w-[48px]"
              >
                <QrCodeIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <BarcodeQrScanner
                isActive={isOpenQrScanner}
                save={(documentNumber: string) => setDocumentNumber(documentNumber)}
                isLoading={isPending}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid gap-x-3">
        <CustomInput
          label="Cargo del trabajador"
          variant="flat"
          value={selectedPatient?.data?.position || ""}
          isDisabled={isPending}
        />

        <CustomInput
          label="Dependencia del trabajador"
          variant="flat"
          value={selectedPatient?.data?.dependence || ""}
          isDisabled={isPending}
        />

        <Controller
          name="description"
          control={control}
          render={({ field, fieldState }) => (
            <CustomTextarea
              label="Descripción del hecho"
              placeholder="Describa el hecho ocurrido"
              variant="flat"
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              {...field}
              isDisabled={isPending}
              isRequired
              className="mb-[18px]"
              rows={1}
            />
          )}
        />

        <Controller
          name="probableCause"
          control={control}
          render={({ field, fieldState }) => (
            <CustomTextarea
              label="Causa probable"
              placeholder="Describa la causa probable"
              variant="flat"
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              {...field}
              isDisabled={isPending}
              isRequired
              className="mb-[18px]"
              rows={1}
            />
          )}
        />

        <Controller
          name="consequences"
          control={control}
          render={({ field, fieldState }) => (
            <CustomTextarea
              label="Consecuencias"
              placeholder="Describa las consecuencias"
              variant="flat"
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              {...field}
              isDisabled={isPending}
              isRequired
              className="mb-[18px]"
              rows={1}
            />
          )}
        />

        <Controller
          name="correctiveActions"
          control={control}
          render={({ field, fieldState }) => (
            <CustomTextarea
              label="Medidas correctivas"
              placeholder="Describa las medidas correctivas"
              variant="flat"
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              {...field}
              isDisabled={isPending}
              isRequired
              className="mb-[18px]"
              rows={1}
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
              {...field}
              isDisabled={isPending}
              isRequired
              className="mb-[18px]"
            />
          )}
        />

      </div>
    </FormModal>
  );
};

export default AccidentFormModal;
