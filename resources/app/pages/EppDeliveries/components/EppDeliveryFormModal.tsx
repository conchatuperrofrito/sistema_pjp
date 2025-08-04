import { FC, useEffect, useMemo, useState } from "react";
import { EppDelivery, EppDeliveryFormData } from "@/types/eppDeliveryInterfaces";
import { zodResolver } from "@hookform/resolvers/zod";
import { eppDeliverySchema } from "@/validators/validationSchemas";
import useSaveMutation from "@/hooks/useSaveMutation";
import { getEppDelivery, saveEppDelivery } from "@/services/eppDeliveryService";
import { FormModal } from "@/components/FormModal";
import { useForm, Controller } from "react-hook-form";
import { CustomSelect } from "@/components/CustomSelect";
import { useEppDeliveryStore } from "@/store/eppDeliveryStore";
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

interface EppDeliveryFormModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

const EppDeliveryFormModal: FC<EppDeliveryFormModalProps> = ({
  isOpen,
  onOpenChange
}) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const { id, setId, patientId } = useEppDeliveryStore((state) => state);
  const [selectedPatient, setSelectedPatient] = useState<PatientOption>();

  const [isOpenQrScanner, setIsOpenQrScanner] = useState(false);
  const [documentNumber, setDocumentNumber] = useState("");
  const [options, setOptions] = useState<PatientOption[]>([]);

  const initialDefaultValues = useMemo(
    (): EppDeliveryFormData => ({
      date: "",
      eppItem: "",
      quantity: "1",
      condition: "",
      observations: "",
      patientId: ""
    }),
    []
  );

  const { handleSubmit, control, reset, setError, watch } =
      useForm<EppDeliveryFormData>({
        resolver: zodResolver(eppDeliverySchema),
        defaultValues: initialDefaultValues,
        mode: "onSubmit"
      });

  const { save, isPending } = useSaveMutation({
    mutationFn: saveEppDelivery,
    onSuccess: onOpenChange,
    setError,
    queryKeys: ["epp-deliveries"]
  });

  const eppDeliveryQuery = useQuery<EppDelivery>({
    queryKey: ["epp-delivery"],
    queryFn: () => getEppDelivery(id),
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
    eppDeliveryQuery.refetch().then(async (response) => {
      if (response.status === "success") {
        const delivery = response.data;
        reset({
          date: delivery.date,
          eppItem: delivery.eppItem,
          quantity: delivery.quantity.toString(),
          condition: delivery.condition,
          observations: delivery.observations || "",
          patientId: delivery.patientId
        });
      }
    });
  };

  const isLoading = useMemo(
    () => eppDeliveryQuery.isFetching && !!id,
    [eppDeliveryQuery.isFetching, id]
  );

  const isSaving = useMemo(
    () => isPending || isLoading,
    [isPending, isLoading]
  );

  return (
    <FormModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={id ? "Editar entrega de EPP" : "Registrar entrega de EPP"}
      customSaveButton={{
        content: "Guardar",
        color: "success",
        show: true
      }}
      isLoading={isLoading}
      isSaving={isSaving}
      size={isMobile ? "full" : "4xl"}
      onSubmit={handleSubmit((data) => save({ ...data, id }))}
      skeletonForm={
        <>
          <div className="grid grid-cols-1 md:grid-cols-[120px_1fr_80px_120px] grid-rows-auto gap-x-3">
            <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
            <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
            <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
            <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
          </div>
          <div className="grid grid-cols-[1fr] grid-rows-auto gap-x-3">
            <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
            <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
            <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
            <Skeleton className="h-[99.97px] mb-[18px] rounded-lg" />
          </div>
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-[120px_1fr_80px_120px] grid-rows-auto gap-x-3">
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
          name="eppItem"
          control={control}
          render={({ field, fieldState }) => (
            <CustomInput
              label="Ítem EPP"
              placeholder="Ingrese el nombre del EPP"
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
          name="quantity"
          control={control}
          render={({ field, fieldState }) => (
            <CustomInput
              label="Cantidad"
              placeholder="Cantidad"
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
          name="condition"
          control={control}
          render={({ field, fieldState }) => (
            <CustomSelect
              label="Condición"
              placeholder="Seleccione"
              variant="flat"
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              size="sm"
              data={[
                { label: "Nuevo", value: "Nuevo" },
                { label: "Usado", value: "Usado" },
                { label: "Dañado", value: "Dañado" }
              ]}
              {...field}
              isDisabled={isPending}
              isRequired
            />
          )}
        />
      </div>
      <div className="grid grid-cols-1 grid-rows-auto gap-x-3">
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
                  initialSearch={(id ? eppDeliveryQuery.data?.patientFullName : "") || documentNumber}
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
        />

        <CustomInput
          label="Dependencia del trabajador"
          variant="flat"
          value={selectedPatient?.data?.dependence || ""}
          isDisabled={isPending}
        />

        <Controller
          name="observations"
          control={control}
          render={({ field, fieldState }) => (
            <CustomTextarea
              label="Observaciones"
              placeholder="Ingrese observaciones (opcional)"
              variant="flat"
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              {...field}
              isDisabled={isPending}
              className="mb-[18px]"
              rows={3}
            />
          )}
        />
      </div>
    </FormModal>
  );
};

export default EppDeliveryFormModal;
