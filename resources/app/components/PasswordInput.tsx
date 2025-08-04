import { Input } from "@heroui/react";
import { useState } from "react";
import { EyeFilledIcon, EyeSlashFilledIcon } from "../assets/icons";
import { forwardRef } from "react";
import { InputCommonProps } from "../types/ui/InputInterfaces";

interface PasswordInputProps extends InputCommonProps {
  newPassword?: boolean;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ newPassword = false, ...props }, ref) => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    return (
      <Input
        {...props}
        endContent={
          <button
            className="focus:outline-none"
            type="button"
            onClick={toggleVisibility}
          >
            {isVisible ? (
              <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
            ) : (
              <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
            )}
          </button>
        }
        classNames={{
          base: "h-[66px]",
          inputWrapper: "h-[48px]",
          helperWrapper: "py-0"
        }}
        type={isVisible ? "text" : "password"}
        autoComplete={newPassword ? "new-password" : "current-password"}
        ref={ref}
      />
    );
  }
);
