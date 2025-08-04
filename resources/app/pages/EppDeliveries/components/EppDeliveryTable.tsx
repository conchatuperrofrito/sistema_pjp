import { FC, Key, useCallback, useState } from "react";
import { InitialVisibleColumns, Column, TableProps } from "@/types/tableInterfaces";
import { TableFiltersRequest } from "@/types/requestInterfaces";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { TableCrud } from "@/components/TableCrud";
import { EppDelivery, EppDeliveryResponse } from "@/types/eppDeliveryInterfaces";
import { useEppDeliveryStore } from "@/store/eppDeliveryStore";
import { useDisclosure } from "@heroui/react";
import { deleteEppDelivery, getEppDeliveries } from "@/services/eppDeliveryService";
import useSaveMutation from "@/hooks/useSaveMutation";
import { ActionsDropdown } from "@/components/ActionsDropdown";
import { DeleteConfirmationModal } from "@/components/DeleteConfirmationModal";
import { ConditionFilter } from "./ConditionFilter";
import { FilePdfIcon } from "@/assets/icons";

const INITIAL_VISIBLE_COLUMNS: InitialVisibleColumns<EppDelivery> = [
  "date",
  "eppItem",
  "quantity",
  "condition",
  "patientFullName",
  "createdAt",
  "actions"
];

const columns: Column<EppDelivery>[] = [
  { name: "FECHA", uid: "date", sortable: true },
  { name: "EPP", uid: "eppItem", sortable: true },
  { name: "CANTIDAD", uid: "quantity", sortable: true },
  { name: "CONDICIÓN", uid: "condition", sortable: true },
  { name: "TRABAJADOR", uid: "patientFullName", sortable: true },
  { name: "FECHA REGISTRO", uid: "createdAt", sortable: true },
  { name: "ACCIONES", uid: "actions" }
];

interface EppDeliveryTableProps extends TableProps {
  openModal: () => void;
}

const EppDeliveryTable: FC<EppDeliveryTableProps> = ({ openModal }) => {
  const { filters, setId, id } = useEppDeliveryStore((state) => state);
  const deleteModal = useDisclosure();

  const [tableFilters, setTableFilters] = useState<TableFiltersRequest>({
    page: 1,
    rowsPerPage: 5,
    filterValue: "",
    sortDescriptor: { column: "createdAt", direction: "descending" }
  });

  const {
    isLoading,
    data: {
      data: deliveries = [],
      pagination: pagination = {
        total: 0,
        count: 0,
        perPage: 0,
        currentPage: 0,
        totalPages: 0
      }
    } = {},
    error,
    isFetching
  } = useQuery<EppDeliveryResponse>({
    queryKey: ["epp-deliveries", { ...tableFilters, ...filters }],
    queryFn: ({ signal }) => getEppDeliveries({ ...tableFilters, ...filters }, signal),
    placeholderData: keepPreviousData
  });

  const { save: deleteRecord, isPending } = useSaveMutation({
    mutationFn: deleteEppDelivery,
    onSuccess: deleteModal.onOpenChange,
    queryKeys: ["epp-deliveries"],
    loadingMessage: "Eliminando entrega de EPP..."
  });

  const renderCell = useCallback(
    (delivery: EppDelivery, columnKey: Key) => {
      const cellValue = delivery[columnKey as keyof EppDelivery];

      switch (columnKey) {
      case "createdAt": {
        const parts = cellValue?.split(" ") || [];
        return (
          <div className="whitespace-nowrap">{parts.slice(0, 2).join(" ")}
            <span className="text-xs text-gray-500 ml-1">{parts[2]}</span>
          </div>
        );
      }
      case "actions":
        return (
          <ActionsDropdown
            onAction={(key) => {
              setId(delivery.id);
              if (key === "edit") {
                openModal();
              }
              if (key === "delete") {
                deleteModal.onOpen();
              }
              if (key === "view-pdf") {
                const reportUrl = `/api/epp-deliveries/${delivery.id}/report`;
                window.open(reportUrl, "reportWindow", "width=800,height=600");
              }
            }}
            customOptions={{
              "view-pdf": {
                label: "Ver reporte PDF",
                icon: <FilePdfIcon />
              }
            }}
            keys={["edit", "delete", "view-pdf"]}
          />
        );
      default:
        return cellValue || <div className="text-gray-500 text-center w-full">~</div>;
      }
    },
    []
  );

  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        deleteAction={() => deleteRecord(id)}
        onOpenChange={deleteModal.onOpenChange}
        onClose={() => setId("")}
        loading={isPending}
        title="Eliminar entrega de EPP"
        message={
          <span>
            ¿Estás seguro que deseas eliminar esta entrega de EPP?
          </span>
        }
      />
      <TableCrud
        data={deliveries}
        columns={columns}
        renderCell={renderCell}
        tableFilters={tableFilters}
        setTableFilters={setTableFilters}
        pagination={pagination}
        isFetching={isFetching}
        isLoading={isLoading}
        initialVisibleColumns={INITIAL_VISIBLE_COLUMNS}
        textTable={{
          placeholderSearch: "Buscar entrega por trabajador...",
          nameTable: "Entregas de EPP",
          textButtonCreate: "Registrar entrega"
        }}
        openModal={openModal}
        extraTopContent={
          <>
            <ConditionFilter
              isDisabled={isLoading}
              className="h-[40px] w-[170px]"
            />
          </>
        }
      />
    </>
  );
};

export default EppDeliveryTable;
