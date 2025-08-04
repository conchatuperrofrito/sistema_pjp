import { TrashSolidIcon, TriangleExclamationIcon, XmarkSolidIcon } from "@/assets/icons";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button
} from "@heroui/react";
import { FC, ReactNode } from "react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  deleteAction: () => void;
  message?: string | ReactNode;
  onOpenChange: () => void;
  loading?: boolean;
  title?: string;
  onClose?: () => void;
}

export const DeleteConfirmationModal: FC<DeleteConfirmationModalProps> = ({
  isOpen,
  deleteAction,
  title = "Confirmar eliminación",
  message = "¿Estás seguro de que quieres eliminar este registro?",
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
            <TriangleExclamationIcon className="text-[#F31260] text-[1.5rem]" />
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
                deleteAction();
              }}
              color="danger"
              endContent={<TrashSolidIcon />}
            >
              Eliminar
            </Button>
          </ModalFooter>
        </>
      )}
    </ModalContent>
  </Modal>
);
