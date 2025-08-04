import {
  ErrorResponseValidation,
  ErrorResponse
} from "../types/responseInterfaces";
import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { UseFormSetError } from "react-hook-form";
import { SuccessResponse } from "../types/responseInterfaces";
import { FieldValues } from "react-hook-form";
import { Path } from "react-hook-form";
import { useState } from "react";
interface UseSaveMutationConfig<T, U> {
  mutationFn: (data: T) => Promise<SuccessResponse<U>>;
  onSuccess?: (response: SuccessResponse) => unknown,
  setError?: UseFormSetError<T & FieldValues>;
  queryKeys?: string[];
  loadingMessage?: string;
  setDataResponse?: (data: U | undefined) => void;
}

interface UseSaveMutationReturn<T> {
  save: (data: T) => void;
  isPending: boolean;
}

const useSaveMutation = <T,U>({
  mutationFn,
  queryKeys = [],
  onSuccess = () => {},
  setError,
  loadingMessage = "Cargando...",
  setDataResponse
}: UseSaveMutationConfig<T,U>): UseSaveMutationReturn<T> => {
  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);

  const { mutate } = useMutation({
    mutationFn,
    onSuccess: (data) =>
      queryClient
        .invalidateQueries({
          predicate: (query) => queryKeys.includes(query.queryKey[0] as string)
        })
        .then(() => {
          if (setDataResponse) {
            setDataResponse(data.data);
          }
          onSuccess(data);
          setIsPending(false);
          toast.success(data.message, {
            id: "toast",
            duration: 1500
          });
        }),
    onError: (error: AxiosError) => {
      if (error.response?.status === 422) {
        const errorResponse = error.response.data as ErrorResponseValidation;

        if (errorResponse.error) {
          toast.error(errorResponse.error, {
            id: "toast",
            duration: 1500
          });
        } else if (errorResponse.errors && setError) {
          toast.error("Por favor, verifica los campos", {
            id: "toast",
            duration: 1500
          });

          Object.entries(errorResponse.errors).forEach(([key, value]) => {
            setError(key as Path<T & FieldValues>, {
              type: "manual",
              message: value
            });
          });
        }
      }

      if (error.response?.status && [500, 404, 400].includes(error.response?.status)) {
        const errorResponse = error.response.data as ErrorResponse;
        toast.error(errorResponse.message, {
          id: "toast",
          duration: 1500
        });
      }

      if (![422, 500, 404, 400].includes(error.response?.status as number)) {
        toast.error("Ocurrió un error, intenta de nuevo", {
          id: "toast",
          duration: 1500
        });
      }

      setIsPending(false);
    }
  });

  return {
    save: (data) => {
      setIsPending(true);
      mutate(data);
      toast.loading(loadingMessage, { id: "toast" });
    },
    isPending
  };
};

export default useSaveMutation;
