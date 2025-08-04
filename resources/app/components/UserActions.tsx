import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger
} from "@heroui/react";
import { ReactNode, FC } from "react";
import { KeyIcon, LeftToBracketIcon } from "@/assets/icons";

type ActionKey = "profile" | "change-password" | "logout";

interface UserActionsProps {
  triggerComponent: ReactNode;
  onAction?: (key: ActionKey) => void;
}

export const UserActions: FC<UserActionsProps> = ({
  triggerComponent,
  onAction
}) => {
  return (
    <Dropdown size="sm">
      <DropdownTrigger className="flex justify-start">
        {triggerComponent}
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Opciones de usuario"
        onAction={(key) => onAction && onAction(key as ActionKey)}
      >
        <DropdownSection showDivider>
          {/* <DropdownItem
            startContent={<i className="icon-vl-id-card-solid" />}
            aria-label="Perfil"
            key={"profile"}
          >
            Perfil
          </DropdownItem> */}

          <DropdownItem
            startContent={<KeyIcon />}
            aria-label="Cambiar contraseña"
            key={"change-password"}
          >
            Cambiar contraseña
          </DropdownItem>
        </DropdownSection>
        <DropdownItem
          startContent={<LeftToBracketIcon />}
          aria-label="Cerrar sesión"
          key={"logout"}
          className="text-danger"
          color="danger"
        >
          Cerrar sesión
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
