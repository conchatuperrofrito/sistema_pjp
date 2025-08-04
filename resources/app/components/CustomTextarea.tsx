import { Textarea } from "@heroui/react";
import { forwardRef, ChangeEvent } from "react";

interface CustomTextareaProps {
    label: string;
    placeholder: string;
    type?: string;
    autoComplete?: string;
    disableAutosize?: boolean;
    rows?: number;
    minRows?: number;
    maxRows?: number;
    variant?: "flat" | "bordered" | "faded" | "underlined";
    cacheMeasurements?: boolean;
    isClearable?: boolean;
    isInvalid: boolean;
    errorMessage?: string;
    isDisabled?: boolean;
    isRequired?: boolean;
    value: string | undefined;
    className?: string;
    onChange: (input: ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
    validationBehavior?: "aria" | "native" | undefined;
}

export const CustomTextarea = forwardRef<HTMLTextAreaElement, CustomTextareaProps>(
  ({ autoComplete = "off", type = "text", rows = 3, value, ...props }, ref) => {
    return (
      <Textarea
        {...props}
        value={value || ""}
        autoComplete={autoComplete}
        classNames={{
          base: "relative",
          helperWrapper: "py-0 absolute bottom-[-16px]"
        }}
        type={type}
        minRows={rows}
        ref={ref}
      />
    );
  }
);
