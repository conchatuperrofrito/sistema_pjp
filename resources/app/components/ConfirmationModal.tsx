import { TriangleExclamationIcon, XmarkSolidIcon } from "@/assets/icons";
import { CheckIcon } from "@/assets/icons/CheckIcon";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader
} from "@heroui/react";

import { FC, ReactNode } from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  functionAction: () => void;
  message?: string | ReactNode;
  onOpenChange: () => void;
  loading?: boolean;
  title?: string;
  onClose?: () => void;
}

export const ConfirmationModal: FC<ConfirmationModalProps> = ({
  isOpen,
  functionAction,
  title = "Confirmar acción",
  message = "¿Estás seguro de que quieres realizar esta acción?",
  onOpenChange,
  loading = false,
  onClose = () => {}
}) => (
  <Modal
    isOpen={isOpen}
    onOpenChange={onOpenChange}
    placement="center"
    hideCloseButton={true}
    isDismissable={!loading}
    onClose={onClose}
  >
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader className="flex items-center gap-2">
            <TriangleExclamationIcon className="text-[#F5A524] text-[1.5rem]" />
            {title}
          </ModalHeader>
          <ModalBody className="py-0">{message}</ModalBody>
          <ModalFooter>
            <Button
              onPress={onClose}
              isDisabled={loading}
              variant="flat"
              endContent={
                <XmarkSolidIcon className="pt-[2px] text-[16px]" />
              }
            >
              Cancelar
            </Button>
            <Button
              isLoading={loading}
              onPress={() => {
                functionAction();
              }}
              className="text-[#FFFFFF]"
              color="warning"
              endContent={
                <CheckIcon className="pt-[2px] text-[16px]" />
              }
            >
              Confirmar
            </Button>
          </ModalFooter>
        </>
      )}
    </ModalContent>
  </Modal>
);
