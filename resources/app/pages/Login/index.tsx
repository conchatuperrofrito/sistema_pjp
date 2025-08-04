import { Button } from "@heroui/react";
import { useMemo } from "react";
import { PasswordInput } from "@/components/PasswordInput";
import { ErrorResponseValidation, ErrorResponse } from "@/types/responseInterfaces";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/validators/validationSchemas";
import { ErrorLogin, LoginForm } from "@/types/authInterfaces";
import { CustomInput } from "@/components/CustomInput";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { LogInIcon } from "@/assets/icons";
import Logo from "@/assets/images/logo.png";

export default function Login () {
  const { login, loading } = useAuthStore((stage) => stage);

  const initialDefaultValues = useMemo(
    (): LoginForm => ({
      documentNumber: "",
      password: ""
    }),
    []
  );

  const { handleSubmit, control, reset, setError } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: initialDefaultValues,
    mode: "onSubmit"
  });

  const onSubmit = async ({ documentNumber, password }: LoginForm) => {
    toast.loading("Iniciando sesión...", { id: "toast" });

    const response = await login(documentNumber, password);

    if (response.success) {
      toast.success("Inicio de sesión exitoso", {
        id: "toast",
        duration: 1500
      });

      reset(initialDefaultValues);
    } else if (!response.success && response.error) {
      if (response.error.response?.status === 422) {
        const errorResponse = response.error.response.data as ErrorResponseValidation;

        if (errorResponse.error) {
          toast.error(errorResponse.error, {
            id: "toast",
            duration: 1500
          });
        } else if (errorResponse.errors) {
          Object.entries(errorResponse.errors).forEach(([key, value]) => {
            setError(key as keyof LoginForm, {
              type: "manual",
              message: value
            });
          });
        }
      }

      if (response.error.response?.status === 500) {
        const errorResponse = response.error.response.data as ErrorResponse;
        toast.error(errorResponse.message, {
          id: "toast",
          duration: 1500
        });
      }

      if (response.error.response?.status === 401) {
        const { message } = response.error.response.data as ErrorLogin;
        toast.error(message, {
          id: "toast",
          duration: 1500
        });
      }

      if (![422, 500, 401].includes(response.error.response?.status as number)) {
        toast.error("Ocurrió un error, intenta de nuevo", {
          id: "toast",
          duration: 1500
        });
      }

    }
  };

  const containerStyle = "h-[100vh] w-[100vw] flex justify-center items-center bg-gradient-to-br from-[#14202b] via-[#1c2b3a] to-[#243647]";

  const formStyle = "flex flex-col min-w-full h-full xs:h-auto xs:min-w-[320px] sm:min-w-[400px] p-6 bg-white dark:bg-gray-800 shadow-xl  xs:rounded-lg gap-4 text-gray-700 dark:text-white";

  const textColor = "text-gray-500 dark:text-gray-300";

  return (
    <div className={containerStyle}>
      <form
        className={formStyle}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="text-center mb-4">
          <img
            src={Logo}
            alt="Logo"
            className="mb-3 w-[150px] h-auto mx-auto"
          />
          <h1 className="text-2xl font-bold">Iniciar Sesión</h1>
          <p className={`text-sm ${textColor}`}>Bienvenido, por favor ingrese sus credenciales.</p>
        </div>

        <Controller
          name="documentNumber"
          control={control}
          render={({ field, fieldState }) => (
            <CustomInput
              {...field}
              isRequired
              label="Número de documento"
              placeholder="Ingrese su número de documento"
              errorMessage={fieldState.error?.message}
              isInvalid={!!fieldState.error}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <PasswordInput
              {...field}
              isRequired
              label="Contraseña"
              placeholder="Ingrese su contraseña"
              errorMessage={fieldState.error?.message}
              isInvalid={!!fieldState.error}
            />
          )}
        />

        <Button
          color="primary"
          type="submit"
          isLoading={loading}
          className="mt-2 flex items-center justify-center gap-2 text-lg font-semibold bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg transition-all">
          { !loading && <LogInIcon />}
          Iniciar sesión
        </Button>
      </form>
    </div>
  );
}
