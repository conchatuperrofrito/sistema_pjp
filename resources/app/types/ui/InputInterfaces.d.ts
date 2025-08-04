import { ChangeEvent } from "react";

interface InputCommonProps {
  label: string;
  placeholder?: string;
  variant?: "flat" | "bordered" | "faded" | "underlined";
  isInvalid?: boolean;
  errorMessage?: string | undefined;
  size?: "sm" | "lg" | "md";
  autoComplete?: string;
  isDisabled?: boolean;
  className?: string;
  value?: string | undefined;
  onChange?: (input: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  isRequired?: boolean;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  readonly?: boolean;
}
