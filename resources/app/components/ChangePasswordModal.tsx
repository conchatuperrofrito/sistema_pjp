import { useMemo } from "react";
import { ChangePasswordForm } from "@/types/userInterfaces";
import { Controller, useForm } from "react-hook-form";
import useSaveMutation from "@/hooks/useSaveMutation";
import { changePassword } from "@/services/userService";
import { FormModal } from "./FormModal";
import { PasswordInput } from "./PasswordInput";
import { changePasswordSchema } from "@/validators/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onOpenChange
}) => {
  const initialDefaultValues = useMemo(
    (): ChangePasswordForm => ({
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: ""
    }),
    []
  );

  const { handleSubmit, control, reset, setError } =
    useForm<ChangePasswordForm>({
      resolver: zodResolver(changePasswordSchema),
      defaultValues: initialDefaultValues,
      mode: "onSubmit"
    });

  const { save, isPending } = useSaveMutation({
    mutationFn: changePassword,
    onSuccess: onOpenChange,
    setError
  });

  return (
    <FormModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Cambiar contraseña"
      isLoading={false}
      isSaving={isPending}
      onSubmit={handleSubmit((data) => save(data))}
      onClose={() => reset(initialDefaultValues)}
      size="sm"
    >
      <Controller
        name="currentPassword"
        control={control}
        render={({ field, fieldState }) => (
          <PasswordInput
            label="Contraseña actual"
            placeholder="Ingrese su contraseña actual"
            isInvalid={!!fieldState.error}
            errorMessage={fieldState.error?.message}
            {...field}
            isDisabled={isPending}
            isRequired
          />
        )}
      />

      <Controller
        name="newPassword"
        control={control}
        render={({ field, fieldState }) => (
          <PasswordInput
            label="Nueva contraseña"
            placeholder="Ingrese su nueva contraseña"
            isInvalid={!!fieldState.error}
            errorMessage={fieldState.error?.message}
            {...field}
            isDisabled={isPending}
            isRequired
          />
        )}
      />

      <Controller
        name="confirmNewPassword"
        control={control}
        render={({ field, fieldState }) => (
          <PasswordInput
            label="Confirmar contraseña"
            placeholder="Confirme su nueva contraseña"
            isInvalid={!!fieldState.error}
            errorMessage={fieldState.error?.message}
            {...field}
            isDisabled={isPending}
            isRequired
          />
        )}
      />
    </FormModal>
  );
};
