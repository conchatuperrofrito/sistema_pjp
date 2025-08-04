import { FC, useEffect, useMemo, useState } from "react";
import { OccupationalExam, OccupationalExamFormData } from "@/types/occupationalExamInterfaces";
import { zodResolver } from "@hookform/resolvers/zod";
import { occupationalExamSchema } from "@/validators/validationSchemas";
import useSaveMutation from "@/hooks/useSaveMutation";
import { getOccupationalExam, saveOccupationalExam } from "@/services/occupationalExamService";
import { FormModal } from "@/components/FormModal";
import { useForm, Controller } from "react-hook-form";
import { CustomSelect } from "@/components/CustomSelect";
import { useOccupationalExamStore } from "@/store/occupationalExamStore";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@heroui/react";
import { CustomDateInput } from "@/components/CustomDateInput";
import { CustomTextarea } from "@/components/CustomTextarea";
import { CustomInput } from "@/components/CustomInput";
import PatientAutocomplete from "@/pages/Appointments/components/PatientAutocomplete";
import { PatientOption } from "@/types/patientInterfaces";
import { useMediaQuery } from "react-responsive";
import { QrCodeIcon } from "@/assets/icons";
import BarcodeQrScanner from "@/pages/Appointments/components/BarcodeQrScanner";
import { Popover, PopoverTrigger, PopoverContent, Button } from "@heroui/react";

interface OccupationalExamFormModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

export const OccupationalExamFormModal: FC<OccupationalExamFormModalProps> = ({
  isOpen,
  onOpenChange
}) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const { id, setId, patientId } = useOccupationalExamStore((state) => state);
  const [selectedPatient, setSelectedPatient] = useState<PatientOption>();

  const [isOpenQrScanner, setIsOpenQrScanner] = useState(false);
  const [documentNumber, setDocumentNumber] = useState("");
  const [options, setOptions] = useState<PatientOption[]>([]);

  const initialDefaultValues = useMemo(
    (): OccupationalExamFormData => ({
      patientId: "",
      examType: "",
      date: "",
      result: "",
      medicalObservations: "",
      doctor: ""
    }),
    []
  );

  const { handleSubmit, control, reset, setError, watch } =
      useForm<OccupationalExamFormData>({
        resolver: zodResolver(occupationalExamSchema),
        defaultValues: initialDefaultValues,
        mode: "onSubmit"
      });

  const { save, isPending } = useSaveMutation({
    mutationFn: saveOccupationalExam,
    onSuccess: onOpenChange,
    setError,
    queryKeys: ["occupational-exams"]
  });

  const occupationalExamQuery = useQuery<OccupationalExam>({
    queryKey: ["occupational-exam"],
    queryFn: () => getOccupationalExam(id),
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
    occupationalExamQuery.refetch().then(async (response) => {
      if (response.status === "success") {
        const occupationalExam = response.data;

        reset({
          patientId: occupationalExam.patientId,
          examType: occupationalExam.examType,
          date: occupationalExam.date,
          result: occupationalExam.result,
          medicalObservations: occupationalExam.medicalObservations || "",
          doctor: occupationalExam.doctor
        });
      }
    });
  };

  const isLoading = useMemo(
    () => occupationalExamQuery.isFetching && !!id,
    [occupationalExamQuery.isFetching, id]
  );

  const isSaving = useMemo(
    () => isPending || isLoading,
    [isPending, isLoading]
  );

  return (
    <FormModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={id ? "Editar examen ocupacional" : "Registrar examen ocupacional"}
      customSaveButton={{
        content: "Guardar",
        color: "success",
        show: true
      }}
      isLoading={isLoading}
      isSaving={isSaving}
      size={isMobile ? "full" : "5xl"}
      onSubmit={handleSubmit((data) => save({ ...data, id }))}
      skeletonForm={
        <>
          <div className="grid grid-cols-1 md:grid-cols-[140px_180px_1fr] grid-rows-auto gap-x-3">
            <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
            <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
            <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
            <Skeleton className="h-[48px] mb-[18px] rounded-lg md:col-span-3" />
            <Skeleton className="h-[48px] mb-[18px] rounded-lg md:col-span-3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] grid-rows-auto gap-x-3">
            <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
            <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
            <Skeleton className="h-[99.97px] mb-[18px] rounded-lg md:col-span-2" />
          </div>
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-[140px_180px_1fr] grid-rows-auto gap-x-3">
        <Controller
          name="date"
          control={control}
          render={({ field, fieldState }) => (
            <CustomDateInput
              label="Fecha del examen"
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
          name="examType"
          control={control}
          render={({ field, fieldState }) => (
            <CustomSelect
              label="Tipo de examen"
              placeholder="Seleccione"
              variant="flat"
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              size="sm"
              data={[
                { label: "Ingreso", value: "Ingreso" },
                { label: "Periódico", value: "Periódico" },
                { label: "Retiro", value: "Retiro" }
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
                  initialSearch={(id ? occupationalExamQuery.data?.patientFullName : "") || documentNumber}
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

        <CustomInput
          label="Cargo del trabajador"
          variant="flat"
          value={selectedPatient?.data?.position || ""}
          isDisabled={isPending}
          className="md:col-span-3"
        />

        <CustomInput
          label="Dependencia del trabajador"
          variant="flat"
          value={selectedPatient?.data?.dependence || ""}
          isDisabled={isPending}
          className="md:col-span-3"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] grid-rows-auto gap-x-3">
        <Controller
          name="result"
          control={control}
          render={({ field, fieldState }) => (
            <CustomSelect
              label="Resultado"
              placeholder="Seleccione"
              variant="flat"
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              size="sm"
              data={[
                { label: "Apto", value: "Apto" },
                { label: "No Apto", value: "No Apto" },
                { label: "Apto con reservas", value: "Apto con reservas" }
              ]}
              isLoading={false}
              selectionMode="single"
              {...field}
              isRequired
              isDisabled={isPending}
            />
          )}
        />

        <Controller
          name="doctor"
          control={control}
          render={({ field, fieldState }) => (
            <CustomInput
              label="Doctor"
              placeholder="Ingrese el nombre del doctor"
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
          name="medicalObservations"
          control={control}
          render={({ field, fieldState }) => (
            <CustomTextarea
              label="Observaciones médicas"
              placeholder="Ingrese las observaciones médicas"
              variant="flat"
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              {...field}
              isDisabled={isPending}
              className="mb-[18px] md:col-span-2"
              rows={3}
            />
          )}
        />
      </div>
    </FormModal>
  );
};

export default OccupationalExamFormModal;
