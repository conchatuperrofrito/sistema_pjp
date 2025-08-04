import { CalendarDate, DateInput } from "@heroui/react";
import { forwardRef } from "react";
import { InputCommonProps } from "@/types/ui/InputInterfaces";
import { parseDate } from "@internationalized/date";
import { SIZES } from "@/constants/sizes";

interface CustomDateInputProps extends Omit<InputCommonProps, "onChange"> {
  classNameInput?: string;
  onChange?: (value: string) => void;
}

export const CustomDateInput = forwardRef<HTMLInputElement, CustomDateInputProps>(
  ({
    className = "",
    size = "sm",
    value,
    onChange,
    classNameInput = "",
    ...props
  }, ref) => {
    const handleChange = (value: CalendarDate | null) => {
      if (value) {
        const date = value.toString();
        onChange?.(date);
      }
    };

    return (
      <div
        style={{ height: SIZES.input[size].containerHeight }}
        className={className}
      >
        <DateInput
          {...props}
          onChange={handleChange}
          value={value ? parseDate(value) : null}
          classNames={{
            helperWrapper: "py-0",
            input: classNameInput
          }}
          size={size}
          ref={ref}
        />
      </div>
    );
  }
);
