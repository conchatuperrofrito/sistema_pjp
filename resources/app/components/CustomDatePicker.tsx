import { DatePicker } from "@heroui/react";
import { forwardRef } from "react";
import { InputCommonProps } from "@/types/ui/InputInterfaces";
import { parseDate, CalendarDate } from "@internationalized/date";
import { SIZES } from "@/constants/sizes";

interface CustomDatePickerProps extends Omit<InputCommonProps, "onChange"> {
  classNameInput?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export const CustomDatePicker = forwardRef<HTMLInputElement, CustomDatePickerProps>(
  ({ value, onChange, className = "", size = "sm", ...props }, ref) => {
    const handleChange = (value: CalendarDate | null) => {
      if (value) {
        const date = value.toString()	;
        onChange?.(date);
      }
    };

    return (
      <div
        style={{ height: SIZES.input[size].containerHeight }}
        className={className}
      >
        <DatePicker
          {...props}
          value={value ? parseDate(value) : null}
          onChange={handleChange}
          classNames={{
            helperWrapper: "py-0"
          }}
          size={size}
          ref={ref}
        />
      </div>
    );
  }
);
