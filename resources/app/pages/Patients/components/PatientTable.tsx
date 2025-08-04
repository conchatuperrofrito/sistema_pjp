import { FC, Key, useCallback, useState } from "react";
import { InitialVisibleColumns, Column, TableProps } from "@/types/tableInterfaces";
import { TableFiltersRequest } from "@/types/requestInterfaces";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { TableCrud } from "@/components/TableCrud";
import { Patient, PatientResponse } from "@/types/patientInterfaces";
import { usePatientStore } from "@/store/patientStore";
import { Button, Tooltip, useDisclosure } from "@heroui/react";
import { deletePatient, getPatients } from "@/services/patientService";
import useSaveMutation from "@/hooks/useSaveMutation";
import { ActionsDropdown } from "@/components/ActionsDropdown";
import { DeleteConfirmationModal } from "@/components/DeleteConfirmationModal";
import { SexFilter } from "./SexFilter";
import { EyeSolidIcon, FilePdfIcon } from "@/assets/icons";

const INITIAL_VISIBLE_COLUMNS: InitialVisibleColumns<Patient> = [
  "fullName",
  "age",
  "placeOfBirth",
  "documentNumber",
  "birthdate",
  "sex",
  "contactNumber",
  "createdAt",
  "actions"
];

const columns: Column<Patient>[] = [
  { name: "NOMBRE COMPLETO", uid: "fullName", sortable: true },
  { name: "EDAD", uid: "age", sortable: false },
  { name: "FECHA NAC.", uid: "birthdate", sortable: true },
  { name: "SEXO", uid: "sex", sortable: false },
  { name: "TIPO DOCUMENTO", uid: "documentType", sortable: false },
  { name: "N° DOCUMENTO", uid: "documentNumber", sortable: false },
  { name: "TELEFONO", uid: "contactNumber", sortable: false },
  { name: "CARGO", uid: "position", sortable: false },
  { name: "DEPENDENCIA", uid: "dependence", sortable: false },
  { name: "CORREO", uid: "email", sortable: false },
  { name: "DIRECCION", uid: "address", sortable: false },
  { name: "FECHA REGISTRO", uid: "createdAt", sortable: true },
  { name: "ACCIONES", uid: "actions" }
];

interface PatientTableProps extends TableProps{
  openAppointmentModal: () => void;
  openPositionModal: () => void;
  openDependenceModal: () => void;
}

const PatientTable: FC<PatientTableProps> = (
  { openModal, openAppointmentModal, openPositionModal, openDependenceModal }
) => {
  const { filters, setId, id, setFullName, fullName } = usePatientStore((state) => state);
  const deleteModal = useDisclosure();
  const confirmationModal = useDisclosure();

  const [tableFilters, setTableFilters] = useState<TableFiltersRequest>({
    page: 1,
    rowsPerPage: 5,
    filterValue: "",
    sortDescriptor: { column: "createdAt", direction: "descending" }
  });

  const {
    isLoading,
    data: {
      data: patients = [],
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
  } = useQuery<PatientResponse>({
    queryKey: ["patients", { ...tableFilters, ...filters }],
    queryFn: ({ signal }) => getPatients({ ...tableFilters, ...filters }, signal),
    placeholderData: keepPreviousData
  });

  const { save: deleteRecord, isPending } = useSaveMutation({
    mutationFn: deletePatient,
    onSuccess: deleteModal.onOpenChange,
    queryKeys: ["patients"],
    loadingMessage: "Eliminando paciente..."
  });

  const renderCell = useCallback(
    (patient: Patient, columnKey: Key) => {
      const cellValue = patient[columnKey as keyof Patient];

      switch (columnKey) {

      case "documentNumber":
        return (
          <div className="flex items-center gap-1">
            <Tooltip content={
              patient.documentType === "DNI" ? "Documento Nacional de Identidad" :
                patient.documentType === "Pasaporte" ? "Pasaporte" : "Carnet de Extranjería"
            }>
              <span className="text-xs text-gray-500 cursor-help">
                {patient.documentType === "DNI" ? "DNI" :
                  patient.documentType === "Pasaporte" ? "Pas." : "C.E."}:
              </span>
            </Tooltip>
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
              setId(patient.id);
              setFullName(patient.fullName);
              if (key === "edit") {
                openModal();
              }

              if (key === "delete") {
                deleteModal.onOpen();
              }

              if (key === "reset-password") {
                confirmationModal.onOpen();
              }

              if (key === "view-appointments") {
                openAppointmentModal();
              }

              if (key === "view-pdf-appointments") {
                const reportUrl = `/api/patients/${patient.id}/appointments-report`;
                window.open(reportUrl, "reportWindow", "width=800,height=600");
              }

            }}
            customOptions={{
              "view-appointments": {
                label: "Ver historial de citas",
                icon: <EyeSolidIcon />
              },
              "view-pdf-appointments": {
                label: "Ver PDF de citas",
                icon: <FilePdfIcon />
              }
            }}
            keys={["edit", "delete", "view-appointments", "view-pdf-appointments"]}
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
        title="Eliminar paciente"
        message={
          <span>
            ¿Estás seguro que deseas eliminar al paciente{" "}
            <strong>"{fullName}"</strong>?
          </span>
        }
      />

      <TableCrud
        data={patients}
        columns={columns}
        renderCell={renderCell}
        tableFilters={tableFilters}
        setTableFilters={setTableFilters}
        pagination={pagination}
        isFetching={isFetching}
        isLoading={isLoading}
        initialVisibleColumns={INITIAL_VISIBLE_COLUMNS}
        textTable={{
          placeholderSearch: "Buscar paciente por nombre, apellido o número de documento...",
          nameTable: "Pacientes",
          textButtonCreate: "Registrar paciente"
        }}
        openModal={openModal}
        extraTopContent={
          <>
            <SexFilter
              isDisabled={isLoading}
              className="h-[40px] md:w-[150px] w-auto"
            />
            <Button
              onPress={openPositionModal}
              size="md"
              radius="sm"
              color="warning"
              variant="bordered"
              className="order-1"
              isDisabled={isLoading}
            >
              Gestionar cargos
            </Button>
            <Button
              onPress={openDependenceModal}
              size="md"
              radius="sm"
              color="secondary"
              variant="bordered"
              className="order-2"
              isDisabled={isLoading}
            >
              Gestionar dependencias
            </Button>
          </>
        }
      />
    </>
  );
};

export default PatientTable;
