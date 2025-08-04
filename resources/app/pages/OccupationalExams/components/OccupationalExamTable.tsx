import { FC, Key, useCallback, useState } from "react";
import { InitialVisibleColumns, Column, TableProps } from "@/types/tableInterfaces";
import { TableFiltersRequest } from "@/types/requestInterfaces";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { TableCrud } from "@/components/TableCrud";
import { OccupationalExam, OccupationalExamResponse } from "@/types/occupationalExamInterfaces";
import { useOccupationalExamStore } from "@/store/occupationalExamStore";
import { Tooltip, useDisclosure, Chip } from "@heroui/react";
import { deleteOccupationalExam, getOccupationalExams } from "@/services/occupationalExamService";
import useSaveMutation from "@/hooks/useSaveMutation";
import { ActionsDropdown } from "@/components/ActionsDropdown";
import { DeleteConfirmationModal } from "@/components/DeleteConfirmationModal";
import { ExamTypeFilter } from "./ExamTypeFilter";
import { ResultFilter } from "./ResultFilter";
import { FilePdfIcon } from "@/assets/icons";

const INITIAL_VISIBLE_COLUMNS: InitialVisibleColumns<OccupationalExam> = [
  "date",
  "examType",
  "patientFullName",
  "result",
  "doctor",
  "createdAt",
  "actions"
];

const columns: Column<OccupationalExam>[] = [
  { name: "FECHA", uid: "date", sortable: true },
  { name: "TIPO EXAMEN", uid: "examType", sortable: true },
  { name: "TRABAJADOR", uid: "patientFullName", sortable: true },
  { name: "RESULTADO", uid: "result", sortable: true },
  { name: "DOCTOR", uid: "doctor", sortable: true },
  { name: "FECHA REGISTRO", uid: "createdAt", sortable: true },
  { name: "ACCIONES", uid: "actions" }
];

interface OccupationalExamTableProps extends TableProps {
  openModal: () => void;
}

const OccupationalExamTable: FC<OccupationalExamTableProps> = ({ openModal }) => {
  const { filters, setId, id } = useOccupationalExamStore((state) => state);
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
      data: occupationalExams = [],
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
  } = useQuery<OccupationalExamResponse>({
    queryKey: ["occupational-exams", { ...tableFilters, ...filters }],
    queryFn: ({ signal }) => getOccupationalExams({ ...tableFilters, ...filters }, signal),
    placeholderData: keepPreviousData
  });

  const { save: deleteRecord, isPending } = useSaveMutation({
    mutationFn: deleteOccupationalExam,
    onSuccess: deleteModal.onOpenChange,
    queryKeys: ["occupational-exams"],
    loadingMessage: "Eliminando examen ocupacional..."
  });

  const renderCell = useCallback(
    (occupationalExam: OccupationalExam, columnKey: Key) => {
      const cellValue = occupationalExam[columnKey as keyof OccupationalExam];

      switch (columnKey) {
      case "result": {
        const resultColors = {
          "Apto": "success",
          "No Apto": "danger",
          "Apto con reservas": "warning"
        } as const;

        return (
          <Chip
            variant="flat"
            className="min-w-[90px] text-center"
            color={resultColors[cellValue as keyof typeof resultColors] || "default"}
          >
            {cellValue}
          </Chip>
        );
      }
      case "medicalObservations":
        return (
          <div className="max-w-[200px] truncate">
            <Tooltip content={cellValue || "Sin observaciones"}>
              <span>{cellValue || "Sin observaciones"}</span>
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
              setId(occupationalExam.id);
              if (key === "edit") {
                openModal();
              }

              if (key === "delete") {
                deleteModal.onOpen();
              }

              if (key === "view-pdf") {
                const reportUrl = `/api/occupational-exams/${occupationalExam.id}/report`;
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
        title="Eliminar examen ocupacional"
        message={
          <span>
            ¿Estás seguro que deseas eliminar este examen ocupacional?
          </span>
        }
      />

      <TableCrud
        data={occupationalExams}
        columns={columns}
        renderCell={renderCell}
        tableFilters={tableFilters}
        setTableFilters={setTableFilters}
        pagination={pagination}
        isFetching={isFetching}
        isLoading={isLoading}
        initialVisibleColumns={INITIAL_VISIBLE_COLUMNS}
        textTable={{
          placeholderSearch: "Buscar examen por paciente...",
          nameTable: "Exámenes Ocupacionales",
          textButtonCreate: "Registrar examen"
        }}
        openModal={openModal}
        extraTopContent={
          <>
            <ExamTypeFilter
              isDisabled={isLoading}
              className="h-[40px] w-full md:w-[170px]"
            />
            <ResultFilter
              isDisabled={isLoading}
              className="h-[40px] w-full md:w-[170px]"
            />
          </>
        }
      />
    </>
  );
};

export default OccupationalExamTable;
