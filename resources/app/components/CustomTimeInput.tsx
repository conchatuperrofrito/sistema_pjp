import { TimeInput, TimeInputValue } from "@heroui/react";
import { forwardRef } from "react";
import { InputCommonProps } from "@/types/ui/InputInterfaces";
import { SIZES } from "@/constants/sizes";
import { Time } from "@internationalized/date";

interface CustomTimeInputProps extends Omit<InputCommonProps, "onChange"> {
  classNameInput?: string;
  onChange: (value: string) => void;
}

export const CustomTimeInput = forwardRef<HTMLInputElement, CustomTimeInputProps>(
  ({
    classNameInput,
    className = "",
    size = "sm",
    onChange,
    value,
    ...props
  }, ref) => {
    const handleChange = (timeValue: TimeInputValue | null) => {
      if (!timeValue) return;

      if (!value) {
        onChange(timeValue.toString());
        return;
      }

      const [currentHour] = value.split(":");
      const { hour: newHour, minute } = timeValue;

      const hourAdjustments: Record<string, number> = {
        "11:0": 12,
        "12:23": 11,
        "23:12": 0,
        "0:11": 23
      };

      const adjustedHour = hourAdjustments[`${currentHour}:${newHour}`] ?? newHour;
      onChange(`${adjustedHour}:${minute}`);
    };

    return (
      <div
        style={{ height: SIZES.input[size].containerHeight }}
        className={className}
      >
        <TimeInput
          {...props}
          onChange={handleChange}
          value={value ? new Time(...value.split(":").map(Number)) : null}
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
