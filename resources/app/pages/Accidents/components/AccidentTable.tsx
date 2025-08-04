import { FC, Key, useCallback, useState } from "react";
import { InitialVisibleColumns, Column, TableProps } from "@/types/tableInterfaces";
import { TableFiltersRequest } from "@/types/requestInterfaces";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { TableCrud } from "@/components/TableCrud";
import { Accident, AccidentResponse } from "@/types/accidentInterfaces";
import { useAccidentStore } from "@/store/accidentStore";
import { Tooltip, useDisclosure } from "@heroui/react";
import { deleteAccident, getAccidents } from "@/services/accidentService";
import useSaveMutation from "@/hooks/useSaveMutation";
import { ActionsDropdown } from "@/components/ActionsDropdown";
import { DeleteConfirmationModal } from "@/components/DeleteConfirmationModal";
import { EventTypeFilter } from "./EventTypeFilter";
import { FilePdfIcon } from "@/assets/icons";

const INITIAL_VISIBLE_COLUMNS: InitialVisibleColumns<Accident> = [
  "date",
  "hour",
  "eventType",
  "patientFullName",
  "description",
  "responsible",
  "createdAt",
  "actions"
];

const columns: Column<Accident>[] = [
  { name: "FECHA Y HORA", uid: "date", sortable: true },
  { name: "TIPO EVENTO", uid: "eventType", sortable: true },
  { name: "TRABAJADOR", uid: "patientFullName", sortable: true },
  { name: "DESCRIPCIÓN", uid: "description", sortable: false },
  { name: "RESPONSABLE", uid: "responsible", sortable: true },
  { name: "FECHA REGISTRO", uid: "createdAt", sortable: true },
  { name: "ACCIONES", uid: "actions" }
];

interface AccidentTableProps extends TableProps {
  openModal: () => void;
}

const AccidentTable: FC<AccidentTableProps> = ({ openModal }) => {
  const { filters, setId, id } = useAccidentStore((state) => state);
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
      data: accidents = [],
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
  } = useQuery<AccidentResponse>({
    queryKey: ["accidents", { ...tableFilters, ...filters }],
    queryFn: ({ signal }) => getAccidents({ ...tableFilters, ...filters }, signal),
    placeholderData: keepPreviousData
  });

  const { save: deleteRecord, isPending } = useSaveMutation({
    mutationFn: deleteAccident,
    onSuccess: deleteModal.onOpenChange,
    queryKeys: ["accidents"],
    loadingMessage: "Eliminando accidente..."
  });

  const renderCell = useCallback(
    (accident: Accident, columnKey: Key) => {
      const cellValue = accident[columnKey as keyof Accident];

      switch (columnKey) {
      case "date":{
        const [hour, period] = accident.hour.split(" ");
        return (
          <div className="whitespace-nowrap">
            {cellValue}
            {" " + hour}<span className="text-xs text-gray-500 ml-1">{period}</span>
          </div>
        );
      }
      case "description":
        return (
          <div className="max-w-[200px] truncate">
            <Tooltip content={cellValue}>
              <span>{cellValue}</span>
            </Tooltip>
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
              setId(accident.id);
              if (key === "edit") {
                openModal();
              }

              if (key === "delete") {
                deleteModal.onOpen();
              }

              if (key === "view-pdf") {
                const reportUrl = `/api/accidents/${accident.id}/report`;
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
        title="Eliminar accidente"
        message={
          <span>
            ¿Estás seguro que deseas eliminar este accidente?
          </span>
        }
      />

      <TableCrud
        data={accidents}
        columns={columns}
        renderCell={renderCell}
        tableFilters={tableFilters}
        setTableFilters={setTableFilters}
        pagination={pagination}
        isFetching={isFetching}
        isLoading={isLoading}
        initialVisibleColumns={INITIAL_VISIBLE_COLUMNS}
        textTable={{
          placeholderSearch: "Buscar accidente por paciente...",
          nameTable: "Accidentes",
          textButtonCreate: "Registrar accidente"
        }}
        openModal={openModal}
        extraTopContent={
          <>
            <EventTypeFilter
              isDisabled={isLoading}
              className="h-[40px] w-full md:w-[170px]"
            />
          </>
        }
      />
    </>
  );
};

export default AccidentTable;
