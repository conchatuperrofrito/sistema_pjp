import { Input } from "@heroui/react";
import { forwardRef } from "react";
import { InputCommonProps } from "@/types/ui/InputInterfaces";
import { SIZES } from "@/constants/sizes";

interface CustomInputProps extends InputCommonProps {
  type?: string;
  classNameInput?: string;
}

export const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({
    autoComplete = "off",
    type = "text",
    classNameInput,
    className = "",
    size = "sm",
    value,
    ...props
  }, ref) => {
    return (
      <div
        style={{ height: SIZES.input[size].containerHeight }}
        className={className}
      >
        <Input
          {...props}
          value={value || ""}
          autoComplete={autoComplete}
          classNames={{
            helperWrapper: "py-0",
            input: classNameInput
          }}
          size={size}
          type={type}
          ref={ref}
        />
      </div>
    );
  }
);
