import { FC, Key, useCallback, useState } from "react";
import { InitialVisibleColumns, Column, TableProps } from "@/types/tableInterfaces";
import { TableFiltersRequest } from "@/types/requestInterfaces";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { TableCrud } from "@/components/TableCrud";
import { Inspection, InspectionResponse } from "@/types/inspectionInterfaces";
import { useInspectionStore } from "@/store/inspectionStore";
import { Chip, Tooltip, useDisclosure } from "@heroui/react";
import { deleteInspection, getInspections } from "@/services/inspectionService";
import useSaveMutation from "@/hooks/useSaveMutation";
import { ActionsDropdown } from "@/components/ActionsDropdown";
import { DeleteConfirmationModal } from "@/components/DeleteConfirmationModal";
import { SeverityFilter } from "./SeverityFilter";
import { FilePdfIcon } from "@/assets/icons";

const INITIAL_VISIBLE_COLUMNS: InitialVisibleColumns<Inspection> = [
  "date",
  "area",
  "inspector",
  "severity",
  "findings",
  "correctionResponsible",
  "createdAt",
  "actions"
];

const columns: Column<Inspection>[] = [
  { name: "FECHA", uid: "date", sortable: true },
  { name: "ÁREA", uid: "area", sortable: true },
  { name: "INSPECTOR", uid: "inspector", sortable: true },
  { name: "SEVERIDAD", uid: "severity", sortable: true },
  { name: "HALLAZGOS", uid: "findings", sortable: false },
  { name: "RESPONSABLE", uid: "correctionResponsible", sortable: true },
  { name: "FECHA REGISTRO", uid: "createdAt", sortable: true },
  { name: "ACCIONES", uid: "actions" }
];

interface InspectionTableProps extends TableProps {
  openModal: () => void;
}

const InspectionTable: FC<InspectionTableProps> = ({ openModal }) => {
  const { filters, setId, id } = useInspectionStore((state) => state);
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
      data: inspections = [],
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
  } = useQuery<InspectionResponse>({
    queryKey: ["inspections", { ...tableFilters, ...filters }],
    queryFn: ({ signal }) => getInspections({ ...tableFilters, ...filters }, signal),
    placeholderData: keepPreviousData
  });

  const { save: deleteRecord, isPending } = useSaveMutation({
    mutationFn: deleteInspection,
    onSuccess: deleteModal.onOpenChange,
    queryKeys: ["inspections"],
    loadingMessage: "Eliminando inspección..."
  });

  const renderCell = useCallback(
    (inspection: Inspection, columnKey: Key) => {
      const cellValue = inspection[columnKey as keyof Inspection];

      switch (columnKey) {
      case "severity": {
        const severityColors = {
          "Alta": "danger",
          "Moderada": "warning",
          "Baja": "success"
        } as const;

        return (
          <Chip
            variant="flat"
            className="min-w-[90px] text-center"
            color={severityColors[cellValue as keyof typeof severityColors] || "default"}
          >
            {cellValue}
          </Chip>
        );
      }
      case "findings":
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
              setId(inspection.id);
              if (key === "edit") {
                openModal();
              }

              if (key === "delete") {
                deleteModal.onOpen();
              }

              if (key === "view-pdf") {
                const reportUrl = `/api/inspections/${inspection.id}/report`;
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
        title="Eliminar inspección"
        message={
          <span>
            ¿Estás seguro que deseas eliminar esta inspección?
          </span>
        }
      />

      <TableCrud
        data={inspections}
        columns={columns}
        renderCell={renderCell}
        tableFilters={tableFilters}
        setTableFilters={setTableFilters}
        pagination={pagination}
        isFetching={isFetching}
        isLoading={isLoading}
        initialVisibleColumns={INITIAL_VISIBLE_COLUMNS}
        textTable={{
          placeholderSearch: "Buscar inspección por área, inspector...",
          nameTable: "Inspecciones",
          textButtonCreate: "Registrar inspección"
        }}
        openModal={openModal}
        extraTopContent={
          <>
            <SeverityFilter
              isDisabled={isLoading}
              className="h-[40px] w-full md:w-[170px]"
            />
          </>
        }
      />
    </>
  );
};

export default InspectionTable;
