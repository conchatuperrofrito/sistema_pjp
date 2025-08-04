import { FC, Key, useCallback, useState } from "react";
import { InitialVisibleColumns, Column, TableProps } from "@/types/tableInterfaces";
import { TableFiltersRequest } from "@/types/requestInterfaces";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { TableCrud } from "@/components/TableCrud";
import { CommitteeMinute, CommitteeMinuteResponse } from "@/types/committeeMinuteInterfaces";
import { useCommitteeMinuteStore } from "@/store/committeeMinuteStore";
import { useDisclosure } from "@heroui/react";
import { deleteCommitteeMinute, getCommitteeMinutes } from "@/services/committeeMinuteService";
import useSaveMutation from "@/hooks/useSaveMutation";
import { ActionsDropdown } from "@/components/ActionsDropdown";
import { DeleteConfirmationModal } from "@/components/DeleteConfirmationModal";
import { FilePdfIcon } from "@/assets/icons";

const INITIAL_VISIBLE_COLUMNS: InitialVisibleColumns<CommitteeMinute> = [
  "date",
  "topics",
  "agreements",
  "followupResponsible",
  "nextMeetingDate",
  "createdAt",
  "actions"
];

const columns: Column<CommitteeMinute>[] = [
  { name: "FECHA", uid: "date", sortable: true },
  { name: "TEMAS", uid: "topics", sortable: false },
  { name: "ACUERDOS", uid: "agreements", sortable: false },
  { name: "RESPONSABLE", uid: "followupResponsible", sortable: true },
  { name: "PRÓXIMA REUNIÓN", uid: "nextMeetingDate", sortable: true },
  { name: "FECHA REGISTRO", uid: "createdAt", sortable: true },
  { name: "ACCIONES", uid: "actions" }
];

interface CommitteeMinuteTableProps extends TableProps {
  openModal: () => void;
}

const CommitteeMinuteTable: FC<CommitteeMinuteTableProps> = ({ openModal }) => {
  const { filters, setId, id } = useCommitteeMinuteStore((state) => state);
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
      data: minutes = [],
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
  } = useQuery<CommitteeMinuteResponse>({
    queryKey: ["committeeMinutes", { ...tableFilters, ...filters }],
    queryFn: ({ signal }) => getCommitteeMinutes({ ...tableFilters, ...filters }, signal),
    placeholderData: keepPreviousData
  });

  const { save: deleteRecord, isPending } = useSaveMutation({
    mutationFn: deleteCommitteeMinute,
    onSuccess: deleteModal.onOpenChange,
    queryKeys: ["committeeMinutes"],
    loadingMessage: "Eliminando acta..."
  });

  const renderCell = useCallback(
    (minute: CommitteeMinute, columnKey: Key) => {
      const cellValue = minute[columnKey as keyof CommitteeMinute];

      switch (columnKey) {
      case "topics":
      case "agreements":
        return (
          <div className="max-w-[200px] truncate">
            <span>{cellValue}</span>
          </div>
        );
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
              setId(minute.id);
              if (key === "edit") {
                openModal();
              }
              if (key === "delete") {
                deleteModal.onOpen();
              }
              if (key === "view-pdf") {
                const reportUrl = `/api/committee-minutes/${minute.id}/report`;
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
        title="Eliminar acta de comité"
        message={<span>¿Estás seguro que deseas eliminar esta acta de comité?</span>}
      />
      <TableCrud
        data={minutes}
        columns={columns}
        renderCell={renderCell}
        tableFilters={tableFilters}
        setTableFilters={setTableFilters}
        pagination={pagination}
        isFetching={isFetching}
        isLoading={isLoading}
        initialVisibleColumns={INITIAL_VISIBLE_COLUMNS}
        textTable={{
          placeholderSearch: "Buscar acta por temas o responsable...",
          nameTable: "Actas de Comité",
          textButtonCreate: "Registrar acta"
        }}
        openModal={openModal}
        extraTopContent={null}
      />
    </>
  );
};

export default CommitteeMinuteTable;
