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
import { getDependences, deleteDependence } from "@/services/dependenceService";
import { Dependence } from "@/types/dependenceInterfaces";
import useSaveMutation from "@/hooks/useSaveMutation";
import { TableCrud } from "@/components/TableCrud";
import { TableFiltersRequest } from "@/types/requestInterfaces";
import { Column } from "@/types/tableInterfaces";
import { useDependenceStore } from "@/store/dependenceStore";
import { DeleteConfirmationModal } from "@/components/DeleteConfirmationModal";
import { useMediaQuery } from "react-responsive";
import { PenToSquareIcon, TrashSolidIcon } from "@/assets/icons";

interface DependenceModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  openDependenceFormModal: () => void;
}

const COLUMNS_TABLE: Column<Dependence>[] = [
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

export const DependenceModal: FC<DependenceModalProps> = ({
  isOpen,
  onOpenChange,
  openDependenceFormModal
}) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const { dependenceId, setDependenceId, dependenceName, setDependenceName } = useDependenceStore((state) => state);

  const deleteModal = useDisclosure();

  const [tableFilters, setTableFilters] = useState<TableFiltersRequest>({
    page: 1,
    rowsPerPage: 5,
    filterValue: "",
    sortDescriptor: { column: "name", direction: "ascending" }
  });

  const {
    data: {
      data: dependences = [],
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
    queryKey: ["dependences", tableFilters],
    queryFn: ({ signal }) => getDependences(tableFilters, signal),
    placeholderData: keepPreviousData
  });

  const { save: deleteRecord, isPending } = useSaveMutation({
    mutationFn: deleteDependence,
    onSuccess: deleteModal.onOpenChange,
    queryKeys: ["dependences"],
    loadingMessage: "Eliminando dependencia..."
  });

  const renderCell = useCallback(
    (dependence: Dependence, columnKey: Key) => {
      const cellValue = dependence[columnKey as keyof Dependence];
      switch (columnKey) {
      case "actions":
        return (
          <div className="flex gap-2">
            <Button
              color="danger"
              size="sm"
              isIconOnly
              onPress={() => {
                setDependenceId(dependence.id);
                setDependenceName(dependence.name);
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
                setDependenceId(dependence.id);
                setDependenceName(dependence.name);
                openDependenceFormModal();
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
        deleteAction={() => deleteRecord(dependenceId)}
        onOpenChange={deleteModal.onOpenChange}
        onClose={() => setDependenceId("")}
        loading={isPending}
        title="Eliminar dependencia"
        message={
          <span>
            ¿Estás seguro que deseas eliminar la dependencia{" "}
            <strong>"{dependenceName}"</strong>?
          </span>
        }
      />

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size={isMobile ? "full" : "3xl"}
        scrollBehavior="inside"
        onClose={() => setDependenceId("")}
        isDismissable={false}
      >
        <ModalContent>
          <ModalHeader className="pb-1">Gestionar dependencias</ModalHeader>
          <ModalBody className="gap-0">
            <TableCrud
              data={dependences}
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
              openModal={openDependenceFormModal}
              textTable={{
                nameTable: "Dependencias",
                placeholderSearch: "Buscar dependencia por nombre...",
                textButtonCreate: "Registrar dependencia"
              }}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DependenceModal;
