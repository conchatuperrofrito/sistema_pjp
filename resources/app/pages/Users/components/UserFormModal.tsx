import { FC, useEffect, useMemo, useState } from "react";
import { User, UserFormData } from "@/types/userInterfaces";

import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema } from "@/validators/validationSchemas";
import useSaveMutation from "@/hooks/useSaveMutation";
import { getUser, getUserRoles, getUserSpecialties, saveUser } from "@/services/userService";
import { FormModal } from "@/components/FormModal";
import { useForm, Controller } from "react-hook-form";
import { CustomInput } from "@/components/CustomInput";
import { CustomSelect } from "@/components/CustomSelect";
import { useUserStore } from "@/store/userStore";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@heroui/react";
import SlideDown from "@/components/SlideDown";

interface UserFormModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

export const UserFormModal: FC<UserFormModalProps> = ({
  isOpen,
  onOpenChange
}) => {
  const { id, setId } = useUserStore((state) => state);

  const [selectedRole, setSelectedRole] = useState<Option>({ label: "", value: "" });

  const initialDefaultValues = useMemo(
    (): UserFormData => ({
      firstName: "",
      lastName: "",
      documentType: "",
      documentNumber: "",
      roleId: "",
      registrationNumber: "",
      specialtyId: "",
      doctorId: ""
    }),
    []
  );

  const { handleSubmit, control, reset, setError } =
    useForm<UserFormData>({
      resolver: zodResolver(userSchema),
      defaultValues: initialDefaultValues,
      mode: "onSubmit"
    });

  const { save, isPending } = useSaveMutation({
    mutationFn: saveUser,
    onSuccess: onOpenChange,
    setError,
    queryKeys: ["users", "usersRoles"]
  });

  const userQuery = useQuery<User>({
    queryKey: ["user"],
    queryFn: () => getUser(id),
    enabled: false
  });

  useEffect(() => {
    if (!isOpen) {
      setId("");
      setSelectedRole({ label: "", value: "" });

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
    userQuery.refetch().then(async (response) => {
      if (response.status === "success") {
        const user = response.data;

        reset({
          firstName: user.firstName,
          lastName: user.lastName,
          documentType: user.documentType,
          documentNumber: user.documentNumber,
          roleId: user.roleId,
          registrationNumber: user.registrationNumber,
          specialtyId: user.specialtyId,
          doctorId: user.doctorId
        });
      }
    });
  };

  const isLoading = useMemo(
    () => userQuery.isFetching && !!id,
    [userQuery.isFetching, id]
  );

  const isSaving = useMemo(
    () => isPending || isLoading,
    [isPending, isLoading]
  );

  return (
    <FormModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={id ? "Editar usuario" : "Crear usuario"}
      isLoading={isLoading}
      isSaving={isSaving}
      onSubmit={handleSubmit((data) => save({ ...data, id }))}
      skeletonForm={
        <>
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr] grid-rows-auto gap-x-3">
            <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
            <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
            <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
            <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
            <Skeleton className="h-[48px] mb-[18px] rounded-lg sm:col-span-2" />
          </div>
          {
            selectedRole.label === "Doctor" &&
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr] grid-rows-auto gap-x-3">
                <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
                <Skeleton className="h-[48px] mb-[18px] rounded-lg" />
              </div>
          }
        </>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr] gap-x-3">
        <Controller
          name="firstName"
          control={control}
          render={({ field, fieldState }) => (
            <CustomInput
              label="Nombre"
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
              label="Apellido"
              placeholder="Ingrese el apellido"
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
          name="documentType"
          control={control}
          render={({ field, fieldState }) => (
            <CustomSelect
              label="Tipo de documento"
              placeholder="Seleccione"
              variant="flat"
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              size="sm"
              data={[
                { label: "DNI", value: "DNI" },
                { label: "Pasaporte", value: "Pasaporte" },
                {
                  label: "Carnet de extranjería",
                  value: "Carnet de extranjería"
                }
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
          name="documentNumber"
          control={control}
          render={({ field, fieldState }) => (
            <CustomInput
              label="Número de documento"
              placeholder="Ingrese el número de documento"
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
          name="roleId"
          control={control}
          render={({ field, fieldState }) => (
            <CustomSelect
              label="Rol"
              placeholder="Seleccione un rol"
              isRequired
              queryKey={"roleOptions"}
              queryFn={getUserRoles}
              isAsync
              className="sm:col-span-2"
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              isDisabled={isPending}
              setSelection={(option) => {
                if (!option) return;
                setSelectedRole(option);
              }}
              {...field}
            />
          )}
        />
      </div>

      <SlideDown isOpen={selectedRole.label === "Doctor"}>
        <div className='grid grid-cols-1 sm:grid-cols-[1fr_1fr] grid-rows-auto gap-x-3' >
          <Controller
            name="specialtyId"
            control={control}
            render={({ field, fieldState }) => (
              <CustomSelect
                label="Especialidad"
                placeholder="Seleccione una especialidad"
                isRequired
                isAsync
                queryKey={"specialtyOptions"}
                queryFn={getUserSpecialties}
                isInvalid={!!fieldState.error}
                errorMessage={fieldState.error?.message}
                isDisabled={isPending}
                {...field}
              />
            )}
          />

          <Controller
            name="registrationNumber"
            control={control}
            render={({ field, fieldState }) => (
              <CustomInput
                label="Número de registro"
                placeholder="Ingrese el número"
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
        </div>
      </SlideDown>
    </FormModal>
  );
};
