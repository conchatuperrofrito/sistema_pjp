import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Button
} from "@heroui/react";

import { PenToSquareIcon, TrashSolidIcon, UnlockIcon, VerticalDotsIcon } from "../assets/icons";

type DefaultActionKey = "delete" | "edit" | "reset-password";

const DEFAULT_OPTIONS_MAP: Record<DefaultActionKey, ActionOption> = {
  edit: {
    label: "Editar",
    icon: <PenToSquareIcon />
  },
  delete: {
    label: "Eliminar",
    icon: <TrashSolidIcon />
  },
  "reset-password": {
    label: "Restablecer contraseña",
    icon: <UnlockIcon />
  }
};

interface ActionsDropdownProps<T extends string> {
  onAction: (key: DefaultActionKey | T) => void;
  keys: (DefaultActionKey | T)[];
  customOptions?: Record<T, ActionOption>;
  disabled?: boolean;
}

export const ActionsDropdown = <T extends string>({
  onAction,
  keys,
  customOptions = {} as Record<T, ActionOption>,
  disabled = false
}: ActionsDropdownProps<T>) => {
  const combinedOptions: Record<DefaultActionKey | T, ActionOption> = {
    ...DEFAULT_OPTIONS_MAP,
    ...customOptions
  };

  return (
    <div className="flex justify-end">
      <Dropdown>
        <DropdownTrigger>
          <Button
            isIconOnly
            size="sm"
            variant="light"
            disabled={disabled}
            className="disabled:opacity-50 w-full"
          >
            <VerticalDotsIcon className="text-default-300" height="24px" width="24px" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Opciones"
          onAction={(key) => onAction(key as DefaultActionKey | T)}
        >
          {keys.map((key) => (
            <DropdownItem
              startContent={combinedOptions[key]?.icon}
              aria-label={combinedOptions[key]?.label}
              key={key}
            >
              {combinedOptions[key]?.label}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};
