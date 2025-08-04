import { Dispatch, FC, useEffect, useMemo, SetStateAction } from "react";
import { AppointmentForm as AppointmentFormData } from "@/types/appointmentInterfaces";
import { zodResolver } from "@hookform/resolvers/zod";
import { appointmentSchema } from "@/validators/validationSchemas";
import { useForm, Controller } from "react-hook-form";
import { CustomInput } from "@/components/CustomInput";
import { useAppointmentStore } from "@/store/appointmentStore";
import { Skeleton, Button, Tooltip } from "@heroui/react";
import PatientAutocomplete from "./PatientAutocomplete";
import { getCurrentDate, getCurrentTime } from "@/utils/dateUtils";
import clsx from "clsx";
import { CustomDateInput } from "@/components/CustomDateInput";
import { CustomTimeInput } from "@/components/CustomTimeInput";
import { useLogout } from "@/hooks/useLogout";
import { PlusIcon } from "@/assets/icons";
import { CustomSelect } from "@/components/CustomSelect";
import { getAppointmentDoctors } from "@/services/appointmentService";

interface AppointmentFormProps {
  openPatientModal: () => void;
  setFormModalConfig: Dispatch<SetStateAction<FormModalConfig>>;
  isLoading: boolean;
}

export const AppointmentForm: FC<AppointmentFormProps> = ( {
  openPatientModal,
  setFormModalConfig,
  isLoading
}) => {
  const {
    appointmentId: id,
    setAppointmentForm,
    appointmentForm,
    setSelectedForm,
    additionalData,
    appointmentStatus,
    setAdditionalData
  } = useAppointmentStore((state) => state);

  const { user } = useLogout();

  const { handleSubmit, control, reset, watch } =
        useForm<AppointmentFormData>({
          resolver: zodResolver(appointmentSchema),
          defaultValues: appointmentForm,
          mode: "onChange"
        });

  useEffect(() => {
    reset({
      ...appointmentForm,
      date: appointmentForm.date?.toString() || getCurrentDate(),
      hour: appointmentForm.hour || getCurrentTime(),
      doctorId: user?.role.id === __DOCTOR_ROLE_ID__ ? user.doctorId : appointmentForm.doctorId
    });
  }, [appointmentForm]);

  useEffect(() => {
    if (additionalData.patientId) {
      reset({ ...watch(), patientId: additionalData.patientId });
    }
  }, [additionalData.patientId]);

  const isScheduled = useMemo(
    () => ["Programada", "Cancelada"].includes(appointmentStatus),
    [appointmentStatus]
  );

  useEffect(() => {
    setFormModalConfig((prev) => ({
      ...prev,
      title: appointmentStatus === "Cancelada" ? "Reagendar cita"
        : appointmentStatus === "Programada" ? "Recepcionar paciente"
          : id ? "Editar cita" : "Registrar cita",
      onSubmit: handleSubmit((data) => {
        setAppointmentForm(data);
        setSelectedForm("clinical-exam-form");
      }),
      customCloseButton: { show: false },
      customSaveButton: {
        show: true,
        content: "Siguiente",
        endContent: <span style={{ fontSize: "16px" }}> {"->"} </span>
      }
    }));
  }, [
    id,
    handleSubmit,
    setFormModalConfig,
    appointmentStatus
  ]);

  const isFormReady = useMemo(() => {
    return !isLoading && (watch("date") || !appointmentStatus);
  }, [isLoading, watch("date"), appointmentStatus]);

  return (
    <>
      <div className={clsx("grid grid-cols-[1fr_1fr] grid-rows-auto gap-x-3", isFormReady && "hidden")}>
        <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
        <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
        <div className={clsx("col-span-2 grid gap-x-1",{
          "grid-cols-[1fr_48px]": !isScheduled,
          "grid-cols-[1fr]": isScheduled
        })}>
          <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
          { !isScheduled && <Skeleton className="h-[48px] mb-[18px] rounded-small" />}
        </div>
        <Skeleton className="h-[48px] mb-[18px] rounded-lg col-span-2" />
        <Skeleton className="h-[48px] mb-[18px] rounded-lg col-span-2" />
      </div>

      <div className={clsx("grid-cols-[1fr_1fr] grid-rows-auto gap-x-3", {
        "hidden": !isFormReady,
        "grid": isFormReady
      })}>
        <Controller
          name="date"
          control={control}
          render={({ field, fieldState }) => (
            <CustomDateInput
              label="Fecha"
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              size="sm"
              {...field}
              isRequired
            />
          )}
        />

        <Controller
          name="hour"
          control={control}
          render={({ field, fieldState }) => (
            <Tooltip
              isOpen={!!fieldState.error}
              content={
                <div className="px-1 py-2 w-[200px]">
                  <div className="text-tiny">
                    {fieldState.error?.message}
                  </div>
                </div>
              }
              style={{
                zIndex: 50
              }}
              showArrow
              placement="right"
              color="danger"
              offset={15}
            >
              <div>
                <CustomTimeInput
                  label="Hora"
                  isInvalid={!!fieldState.error}
                  size="sm"
                  {...field}
                  isRequired
                />
              </div>
            </Tooltip>
          )}
        />

        <div className="col-span-2 flex gap-1">
          <Controller
            name="patientId"
            control={control}
            render={({ field, fieldState }) => (
              <PatientAutocomplete
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                isInvalid={!!fieldState.error}
                errorMessage={fieldState.error?.message}
                isDisabled={isScheduled}
                cacheOptions={additionalData.patientOptions}
                initialSearch={additionalData.patientName}
                setSelection={option => {
                  if (option?.value === additionalData.patientId) return;
                  setAdditionalData({ patientId: option?.value });
                }}
                setCacheOptions={options => setAdditionalData({ patientOptions: options })}
                popoverContentClassName="w-[calc(100%+52px)] sm:w-full"
              />
            )}
          />

          {!isScheduled && (
            <Tooltip
              content="Registrar nuevo paciente"
              placement="right"
              showArrow
              offset={5}
            >
              <Button
                isIconOnly
                variant="faded"
                className="min-h-[48px] min-w-[48px] text-gray-500 rounded-small aspect-square"
                onPress={openPatientModal}
              >
                <PlusIcon />
              </Button>
            </Tooltip>
          ) }
        </div>

        <Controller
          name="doctorId"
          control={control}
          render={({ field, fieldState }) => (
            <CustomSelect
              label="Doctor"
              placeholder="Seleccione un doctor"
              isRequired
              isAsync
              queryKey="doctorOptions"
              queryFn={getAppointmentDoctors}
              className="col-span-2"
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              isDisabled={user?.role.id === __DOCTOR_ROLE_ID__ || isScheduled}
              {...field}
            />
          )}
        />

        <Controller
          name="reason"
          control={control}
          render={({ field, fieldState }) => (
            <CustomInput
              label="Motivo de la consulta"
              placeholder="Ingrese el motivo de la consulta"
              className="col-span-2"
              variant="flat"
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              size="sm"
              autoComplete="off"
              {...field}
              isRequired
            />
          )}
        />
      </div>
    </>
  );
};

export default AppointmentForm;
