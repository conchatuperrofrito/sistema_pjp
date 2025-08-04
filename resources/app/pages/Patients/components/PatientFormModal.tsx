import { FC, useEffect, useMemo, useState } from "react";
import { DepartmentOption, ProvinceOption, Patient, PatientFormData } from "@/types/patientInterfaces";
import { zodResolver } from "@hookform/resolvers/zod";
import { patientSchema } from "@/validators/validationSchemas";
import useSaveMutation from "@/hooks/useSaveMutation";
import { getDepartments, getPatient, savePatient } from "@/services/patientService";
import { FormModal } from "@/components/FormModal";
import { useForm, Controller } from "react-hook-form";
import { CustomInput } from "@/components/CustomInput";
import { CustomSelect } from "@/components/CustomSelect";
import { usePatientStore } from "@/store/patientStore";
import { useQuery } from "@tanstack/react-query";
import { Button, Skeleton, Tooltip } from "@heroui/react";
import { CustomDateInput } from "@/components/CustomDateInput";
import PositionAutocomplete from "./PositionAutocomplete";
import DependenceAutocomplete from "./DependenceAutocomplete";
import { useMediaQuery } from "react-responsive";
import { PlusIcon } from "@/assets/icons";

interface PatientFormModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  saveReturnData?: (data: { patientId: string }) => void;
  openPositionFormModal?: () => void;
  openDependenceFormModal?: () => void;
}

export const PatientFormModal: FC<PatientFormModalProps> = ({
  isOpen,
  onOpenChange,
  saveReturnData,
  openPositionFormModal,
  openDependenceFormModal
}) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const { id, setId, positionId, dependenceId } = usePatientStore((state) => state);

  const [departments, setDepartments] = useState<DepartmentOption[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentOption>();
  const [selectedProvince, setSelectedProvince] = useState<ProvinceOption>();

  const initialDefaultValues = useMemo(
    (): PatientFormData => ({
      departmentId: "",
      provinceId: "",
      districtId: "",
      firstName: "",
      lastName: "",
      documentType: "DNI",
      documentNumber: "",
      birthdate: "",
      sex: "",
      address: "",
      contactNumber: "",
      email: "",
      positionId: "",
      dependenceId: ""
    }),
    []
  );

  const { handleSubmit, control, reset, setError, setValue, register, watch } =
      useForm<PatientFormData>({
        resolver: zodResolver(patientSchema),
        defaultValues: initialDefaultValues,
        mode: "onSubmit"
      });

  const { save, isPending } = useSaveMutation({
    mutationFn: savePatient,
    onSuccess: onOpenChange,
    setError,
    queryKeys: ["patients", "patientOptions"],
    setDataResponse: (data) => {
      if (data && saveReturnData) {
        saveReturnData(data);
      }
    }
  });

  const patientQuery = useQuery<Patient>({
    queryKey: ["patient"],
    queryFn: () => getPatient(id),
    enabled: false
  });

  useEffect(() => {
    if (positionId) {
      reset({ ...watch(), positionId });
    }
  }, [positionId]);

  useEffect(() => {
    if (dependenceId) {
      reset({ ...watch(), dependenceId });
    }
  }, [dependenceId]);

  useEffect(() => {
    getDepartments().then( data => setDepartments(data));
  },[]);

  useEffect(() => {
    if (!isOpen) {
      setId("");

      setSelectedDepartment(undefined);
      setSelectedProvince(undefined);
      setTimeout(() => {
        reset(initialDefaultValues);
      }, 300);
    }
  }, [isOpen]);

  useEffect(() => {
    if (id && isOpen && departments.length) {
      assignFormData();
    }
  }, [id, isOpen]);

  const assignFormData = () => {
    patientQuery.refetch().then(async (response) => {
      if (response.status === "success") {
        const patient = response.data;

        reset({
          departmentId: patient.departmentId || "",
          firstName: patient.firstName,
          lastName: patient.lastName,
          documentType: patient.documentType,
          documentNumber: patient.documentNumber,
          birthdate: patient.birthdate,
          sex: patient.sex,
          address: patient.address,
          contactNumber: patient.contactNumber,
          email: patient.email,
          positionId: patient.positionId,
          dependenceId: patient.dependenceId
        });

        setTimeout(() => {
          setValue<"provinceId">("provinceId", patient.provinceId || "");
          setTimeout(() => setValue<"districtId">("districtId", patient.districtId || ""), 50);
        }, 0);
      }
    });
  };

  const isLoading = useMemo(
    () => patientQuery.isFetching && !!id,
    [patientQuery.isFetching, id]
  );

  const isSaving = useMemo(
    () => isPending || isLoading,
    [isPending, isLoading]
  );

  return (
    <FormModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={id ? "Editar paciente" : "Registrar paciente"}
      customSaveButton={{
        content: "Guardar",
        color: "success",
        show: true
      }}
      isLoading={isLoading}
      isSaving={isSaving}
      size={isMobile ? "full" : "3xl"}
      onSubmit={handleSubmit((data) => save({ ...data, id }))}
      scrollBehavior={isMobile ? "inside" : "normal"}
      skeletonForm={
        <>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr] grid-rows-auto gap-x-3">
            <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
            <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
            <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
            <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
            <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
            <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[150px_120px_150px_1fr] grid-rows-auto gap-x-3">
            <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
            <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
            <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
            <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
            <Skeleton className="h-[48px] mb-[18px] rounded-lg md:col-span-4" />
          </div>
          <div className="grid gap-x-1 grid-cols-[1fr_48px]">
            <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
            <Skeleton className="h-[48px] mb-[18px] rounded-small" />
            <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
            <Skeleton className="h-[48px] mb-[18px] rounded-small" />
          </div>
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr] grid-rows-auto gap-x-3">
        <Controller
          name="departmentId"
          control={control}
          render={({ field, fieldState }) => (
            <CustomSelect
              label="Departamento"
              placeholder="Seleccione el departamento"
              variant="flat"
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              size="sm"
              data={departments}
              isLoading={false}
              selectionMode="single"
              {...field}
              setSelection={selected => {
                setValue<"provinceId">("provinceId", "");
                setValue<"districtId">("districtId", "");
                setSelectedDepartment(selected);
                setSelectedProvince(undefined);
              }}
              isClearable
              isDisabled={isPending}
            />
          )}
        />

        <Controller
          name="provinceId"
          control={control}
          render={({ field, fieldState }) => (
            <CustomSelect
              label="Provincia"
              placeholder="Seleccione la provincia"
              variant="flat"
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              size="sm"
              data={selectedDepartment?.data ?? []}
              isLoading={false}
              selectionMode="single"
              {...field}
              setSelection={selected => {
                setValue<"districtId">("districtId", "");
                setSelectedProvince(selected);
              }}
              isDisabled={!selectedDepartment || isPending}
              isRequired
            />
          )}
        />

        <Controller
          name="districtId"
          control={control}
          render={({ field, fieldState }) => (
            <CustomSelect
              label="Distrito"
              placeholder="Seleccione el distrito"
              variant="flat"
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              size="sm"
              data={selectedProvince?.data ?? []}
              isLoading={false}
              selectionMode="single"
              {...field}
              isDisabled={!selectedProvince || isPending}
              isRequired
            />
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr] grid-rows-auto gap-x-3">
        <Controller
          name="firstName"
          control={control}
          render={({ field, fieldState }) => (
            <CustomInput
              label="Nombres"
              placeholder="Ingrese el nombre"
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
          name="lastName"
          control={control}
          render={({ field, fieldState }) => (
            <CustomInput
              label="Apellidos"
              placeholder="Ingrese los apellidos"
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
          name="documentNumber"
          control={control}
          render={({ field, fieldState }) => (
            <CustomInput
              label="Número de documento"
              placeholder="Ingrese el número"
              variant="flat"
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              size="sm"
              autoComplete="off"
              {...field}
              isDisabled={isPending}
              isRequired
              classNameInput="!pl-0 traslate-x-[-4px]"
              startContent={
                <select
                  {...register("documentType")}
                  className="outline-none px-1 border-0 bg-transparent text-default-400 text-small cursor-pointer"
                  title={watch("documentType")}
                  style={{
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    appearance: "none",
                    msOverflowStyle: "none",
                    transform: "translateX(-4px)"
                  }}
                  disabled={isPending}
                >
                  <option
                    className="bg-default-100"
                    value="DNI"
                    title="Documento Nacional de Identidad"
                  >
                    DNI
                  </option>
                  <option
                    className="bg-default-100"
                    value="Pasaporte"
                    title="Pasaporte"
                  >
                    Pas.
                  </option>
                  <option
                    className="bg-default-100"
                    value="Carnet de extranjería"
                    title="Carnet de extranjería"
                  >
                    C.E.
                  </option>
                </select>
              }
            />
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[150px_120px_150px_1fr] gap-x-3">
        <Controller
          name="birthdate"
          control={control}
          render={({ field, fieldState }) => (
            <CustomDateInput
              label="Fecha de nacimiento"
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              size="sm"
              {...field}
              isDisabled={isPending}
            />
          )}
        />

        <Controller
          name="sex"
          control={control}
          render={({ field, fieldState }) => (
            <CustomSelect
              label="Sexo"
              placeholder="Seleccione"
              variant="flat"
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              size="sm"
              data={[
                { label: "Masculino", value: "Masculino" },
                { label: "Femenino", value: "Femenino" }
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
          name="contactNumber"
          control={control}
          render={({ field, fieldState }) => (
            <CustomInput
              label="Número de contacto"
              placeholder="Ingrese el número de contacto"
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
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <CustomInput
              label="Correo electrónico"
              placeholder="Ingrese el correo electrónico"
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
          name="address"
          control={control}
          render={({ field, fieldState }) => (
            <CustomInput
              label="Dirección"
              placeholder="Ingrese la dirección"
              variant="flat"
              className="md:col-span-4"
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              size="sm"
              autoComplete="off"
              {...field}
              isDisabled={isPending}
            />
          )}
        />

        <div className="md:col-span-4 flex gap-1">
          <Controller
            name="positionId"
            control={control}
            render={({ field, fieldState }) => (
              <PositionAutocomplete
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                isInvalid={!!fieldState.error}
                errorMessage={fieldState.error?.message}
                isDisabled={isPending}
              />
            )}
          />

          <Tooltip
            content="Registrar nueva posición"
            placement="right"
            showArrow
            offset={-5}
          >
            <Button
              isIconOnly
              variant="faded"
              className="min-h-[48px] min-w-[48px] text-gray-500 rounded-small aspect-square"
              onPress={openPositionFormModal}
              isDisabled={isSaving}
            >
              <PlusIcon />
            </Button>
          </Tooltip>
        </div>

        <div className="md:col-span-4 flex gap-1">
          <Controller
            name="dependenceId"
            control={control}
            render={({ field, fieldState }) => (
              <DependenceAutocomplete
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                isInvalid={!!fieldState.error}
                errorMessage={fieldState.error?.message}
                isDisabled={isPending}
              />
            )}
          />

          <Tooltip
            content="Registrar nueva dependencia"
            placement="right"
            showArrow
            offset={-5}
          >
            <Button
              isIconOnly
              variant="faded"
              className="min-h-[48px] min-w-[48px] text-gray-500 rounded-small aspect-square"
              onPress={openDependenceFormModal}
              isDisabled={isSaving}
            >
              <PlusIcon />
            </Button>
          </Tooltip>
        </div>
      </div>

    </FormModal>
  );
};

export default PatientFormModal;
