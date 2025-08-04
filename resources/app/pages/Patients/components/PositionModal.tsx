import { FC, Key, useCallback, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure
} from "@heroui/react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getPositions, deletePosition } from "@/services/positionService";
import { Position } from "@/types/positionInterfaces";
import useSaveMutation from "@/hooks/useSaveMutation";
import { TableCrud } from "@/components/TableCrud";
import { TableFiltersRequest } from "@/types/requestInterfaces";
import { Column } from "@/types/tableInterfaces";
import { usePositionStore } from "@/store/positionStore";
import { DeleteConfirmationModal } from "@/components/DeleteConfirmationModal";
import { useMediaQuery } from "react-responsive";
import { PenToSquareIcon, TrashSolidIcon } from "@/assets/icons";

interface PositionModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  openPositionFormModal: () => void;
}

const COLUMNS_TABLE: Column<Position>[] = [
  {
    uid: "name",
    name: "Nombre",
    sortable: true,
    className: "w-full"
  },
  {
    uid: "actions",
    name: "Acciones"
  }
];

export const PositionModal: FC<PositionModalProps> = ({
  isOpen,
  onOpenChange,
  openPositionFormModal
}) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const { positionId, setPositionId, positionName, setPositionName } = usePositionStore((state) => state);

  const deleteModal = useDisclosure();

  const [tableFilters, setTableFilters] = useState<TableFiltersRequest>({
    page: 1,
    rowsPerPage: 5,
    filterValue: "",
    sortDescriptor: { column: "name", direction: "ascending" }
  });

  const {
    data: {
      data: positions = [],
      pagination: pagination = {
        total: 0,
        count: 0,
        perPage: 0,
        currentPage: 0,
        totalPages: 0
      }
    } = {},
    isLoading,
    isFetching
  } = useQuery({
    queryKey: ["positions", tableFilters],
    queryFn: ({ signal }) => getPositions(tableFilters, signal),
    placeholderData: keepPreviousData
  });

  const { save: deleteRecord, isPending } = useSaveMutation({
    mutationFn: deletePosition,
    onSuccess: deleteModal.onOpenChange,
    queryKeys: ["positions"],
    loadingMessage: "Eliminando cargo..."
  });

  const renderCell = useCallback(
    (position: Position, columnKey: Key) => {
      const cellValue = position[columnKey as keyof Position];
      switch (columnKey) {
      case "actions":
        return (
          <div className="flex gap-2">
            <Button
              color="danger"
              size="sm"
              isIconOnly
              onPress={() => {
                setPositionId(position.id);
                setPositionName(position.name);
                deleteModal.onOpen();
              }}
            >
              <TrashSolidIcon />
            </Button>

            <Button
              color="primary"
              size="sm"
              isIconOnly
              onPress={() => {
                setPositionId(position.id);
                setPositionName(position.name);
                openPositionFormModal();
              }}
            >
              <PenToSquareIcon />
            </Button>
          </div>
        );
      default:
        return cellValue;
      }
    },
    []
  );

  return (
    <>
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        deleteAction={() => deleteRecord(positionId)}
        onOpenChange={deleteModal.onOpenChange}
        onClose={() => setPositionId("")}
        loading={isPending}
        title="Eliminar paciente"
        message={
          <span>
            ¿Estás seguro que deseas eliminar el cargo{" "}
            <strong>"{positionName}"</strong>?
          </span>
        }
      />

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size={isMobile ? "full" : "3xl"}
        scrollBehavior="inside"
        onClose={() => setPositionId("")}
        isDismissable={false}
      >
        <ModalContent>
          <ModalHeader className="pb-1">Gestionar cargos</ModalHeader>
          <ModalBody className="gap-0">
            <TableCrud
              data={positions}
              removeWrapper
              columns={COLUMNS_TABLE}
              renderCell={renderCell}
              tableFilters={tableFilters}
              setTableFilters={setTableFilters}
              pagination={pagination}
              isFetching={isFetching}
              isLoading={isLoading}
              initialVisibleColumns={COLUMNS_TABLE.map((column) => column.uid)}
              columnDropdown={false}
              openModal={openPositionFormModal}
              textTable={{
                nameTable: "Posiciones",
                placeholderSearch: "Buscar cargo por nombre...",
                textButtonCreate: "Registrar cargo"
              }}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PositionModal;
