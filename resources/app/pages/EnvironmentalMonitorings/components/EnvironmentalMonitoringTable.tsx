import { FC, Key, useCallback, useState } from "react";
import { InitialVisibleColumns, Column, TableProps } from "@/types/tableInterfaces";
import { TableFiltersRequest } from "@/types/requestInterfaces";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { TableCrud } from "@/components/TableCrud";
import { EnvironmentalMonitoring, EnvironmentalMonitoringResponse } from "@/types/environmentalMonitoringInterfaces";
import { useEnvironmentalMonitoringStore } from "@/store/environmentalMonitoringStore";
import { useDisclosure } from "@heroui/react";
import { deleteEnvironmentalMonitoring, getEnvironmentalMonitorings } from "@/services/environmentalMonitoringService";
import useSaveMutation from "@/hooks/useSaveMutation";
import { ActionsDropdown } from "@/components/ActionsDropdown";
import { DeleteConfirmationModal } from "@/components/DeleteConfirmationModal";
import { FilePdfIcon } from "@/assets/icons";

const INITIAL_VISIBLE_COLUMNS: InitialVisibleColumns<EnvironmentalMonitoring> = [
  "area",
  "agentType",
  "unit",
  "responsible",
  "measurementDate",
  "observations",
  "createdAt",
  "actions"
];

const columns: Column<EnvironmentalMonitoring>[] = [
  { name: "ÁREA", uid: "area", sortable: true },
  { name: "TIPO DE AGENTE", uid: "agentType", sortable: true },
  { name: "VALOR MEDIDO", uid: "measuredValue", sortable: true },
  { name: "UNIDAD", uid: "unit", sortable: true },
  { name: "LÍMITE PERMITIDO", uid: "permittedLimit", sortable: true },
  { name: "FECHA DE MEDICIÓN", uid: "measurementDate", sortable: true },
  { name: "FRECUENCIA", uid: "frequency", sortable: true },
  { name: "RESPONSABLE", uid: "responsible", sortable: true },
  { name: "FECHA REGISTRO", uid: "createdAt", sortable: true },
  { name: "ACCIONES", uid: "actions" }
];

interface EnvironmentalMonitoringTableProps extends TableProps {
  openModal: () => void;
}

const EnvironmentalMonitoringTable: FC<EnvironmentalMonitoringTableProps> = ({ openModal }) => {
  const { filters, setId, id } = useEnvironmentalMonitoringStore((state) => state);
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
      data: monitorings = [],
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
  } = useQuery<EnvironmentalMonitoringResponse>({
    queryKey: ["environmentalMonitorings", { ...tableFilters, ...filters }],
    queryFn: ({ signal }) => getEnvironmentalMonitorings({ ...tableFilters, ...filters }, signal),
    placeholderData: keepPreviousData
  });

  const { save: deleteRecord, isPending } = useSaveMutation({
    mutationFn: deleteEnvironmentalMonitoring,
    onSuccess: deleteModal.onOpenChange,
    queryKeys: ["environmentalMonitorings"],
    loadingMessage: "Eliminando monitoreo..."
  });

  const renderCell = useCallback(
    (monitoring: EnvironmentalMonitoring, columnKey: Key) => {
      const cellValue = monitoring[columnKey as keyof EnvironmentalMonitoring];
      switch (columnKey) {
      case "measuredValue":
      case "permittedLimit":
        return <div className="whitespace-nowrap">{cellValue}</div>;
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
              setId(monitoring.id);
              if (key === "edit") {
                openModal();
              }
              if (key === "delete") {
                deleteModal.onOpen();
              }
              if (key === "view-pdf") {
                const reportUrl = `/api/environmental-monitorings/${monitoring.id}/report`;
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
        title="Eliminar monitoreo ambiental"
        message={<span>¿Estás seguro que deseas eliminar este monitoreo ambiental?</span>}
      />
      <TableCrud
        data={monitorings}
        columns={columns}
        renderCell={renderCell}
        tableFilters={tableFilters}
        setTableFilters={setTableFilters}
        pagination={pagination}
        isFetching={isFetching}
        isLoading={isLoading}
        initialVisibleColumns={INITIAL_VISIBLE_COLUMNS}
        textTable={{
          placeholderSearch: "Buscar monitoreo por área o agente...",
          nameTable: "Monitoreos Ambientales",
          textButtonCreate: "Registrar monitoreo"
        }}
        openModal={openModal}
        extraTopContent={null}
      />
    </>
  );
};

export default EnvironmentalMonitoringTable;
