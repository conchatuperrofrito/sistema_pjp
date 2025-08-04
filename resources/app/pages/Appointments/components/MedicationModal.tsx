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
import { getMedications, deleteMedication } from "@/services/medicationService";
import { Medication } from "@/types/medicationInterfaces";
import useSaveMutation from "@/hooks/useSaveMutation";
import { TableCrud } from "@/components/TableCrud";
import { TableFiltersRequest } from "@/types/requestInterfaces";
import { Column } from "@/types/tableInterfaces";
import { useMedicationStore } from "@/store/medicationStore";
import { DeleteConfirmationModal } from "@/components/DeleteConfirmationModal";
import { useMediaQuery } from "react-responsive";
import { PenToSquareIcon, TrashSolidIcon } from "@/assets/icons";

interface MedicationModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  openMedicationFormModal: () => void;
}

const COLUMNS_TABLE: Column<Medication>[] = [
  {
    uid: "genericName",
    name: "Nombre genérico",
    sortable: true,
    className: "w-full"
  },
  {
    uid: "concentration",
    name: "Concentración"
  },
  {
    uid: "presentation",
    name: "Presentación"
  },
  {
    uid: "dosageForm",
    name: "Forma de dosificación"
  },
  {
    uid: "actions",
    name: "Acciones"
  }
];

export const MedicationModal: FC<MedicationModalProps> = ({
  isOpen,
  onOpenChange,
  openMedicationFormModal
}) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const { medicationId, setMedicationId, medicationName, setMedicationName } = useMedicationStore((state) => state);

  const deleteModal = useDisclosure();

  const [tableFilters, setTableFilters] = useState<TableFiltersRequest>({
    page: 1,
    rowsPerPage: 5,
    filterValue: "",
    sortDescriptor: { column: "genericName", direction: "ascending" }
  });

  const {
    data: {
      data: medications = [],
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
    queryKey: ["medications", tableFilters],
    queryFn: ({ signal }) => getMedications(tableFilters, signal),
    placeholderData: keepPreviousData
  });

  const { save: deleteRecord, isPending } = useSaveMutation({
    mutationFn: deleteMedication,
    onSuccess: deleteModal.onOpenChange,
    queryKeys: ["medications"],
    loadingMessage: "Eliminando medicamento..."
  });

  const renderCell = useCallback(
    (medication: Medication, columnKey: Key) => {
      const cellValue = medication[columnKey as keyof Medication];
      switch (columnKey) {
      case "actions":
        return (
          <div className="flex gap-2">
            <Button
              color="danger"
              size="sm"
              isIconOnly
              onPress={() => {
                setMedicationId(medication.id);
                setMedicationName(medication.genericName);
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
                setMedicationId(medication.id);
                openMedicationFormModal();
              }}
            >
              <PenToSquareIcon />
            </Button>
          </div>
        );

      case "dosageForm":
        return (
          <div className="flex gap-1 text-nowrap">
            <span >{medication.dosageDescription}</span>
            <div className="ml-2 px-1.5 py-0.1 bg-gray-100 rounded text-black text-tiny">
              {cellValue}
            </div>
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
        deleteAction={() => deleteRecord(medicationId)}
        onOpenChange={deleteModal.onOpenChange}
        onClose={() => setMedicationId("")}
        loading={isPending}
        title="Eliminar medicamento"
        message={
          <span>
            ¿Estás seguro que deseas eliminar el medicamento{" "}
            <strong>"{medicationName}"</strong>?
          </span>
        }
      />

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size={isMobile ? "full" : "5xl"}
        scrollBehavior="inside"
        onClose={() => setMedicationId("")}
        isDismissable={false}
      >
        <ModalContent>
          <ModalHeader className="pb-1">Gestionar medicamentos</ModalHeader>
          <ModalBody className="gap-0">
            <TableCrud
              data={medications}
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
              openModal={openMedicationFormModal}
              textTable={{
                nameTable: "Medicamentos",
                placeholderSearch: "Buscar medicamento por nombre genérico...",
                textButtonCreate: "Registrar medicamento"
              }}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default MedicationModal;
