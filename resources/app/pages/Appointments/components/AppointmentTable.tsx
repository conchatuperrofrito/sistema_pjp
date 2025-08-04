import { FC, Key, useCallback, useMemo, useState, useEffect } from "react";
import { InitialVisibleColumns, Column } from "@/types/tableInterfaces";
import { TableCrud } from "@/components/TableCrud";
import { TableFiltersRequest } from "@/types/requestInterfaces";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Appointment, AppointmentResponse } from "@/types/appointmentInterfaces";
import { useAppointmentStore } from "@/store/appointmentStore";
import { ActionsDropdown } from "@/components/ActionsDropdown";
import { getAppointments } from "@/services/appointmentService";
import { useLogout } from "@/hooks/useLogout";
import { Chip, Tooltip, Button } from "@heroui/react";
import { toast } from "sonner";
import { PrescriptionBottlePillIcon, CalendarPenIcon, PlusIcon, EyeSolidIcon, PenToSquareIcon } from "@/assets/icons";
import { DoctorFilter } from "./DoctorFilter";
import StatusFilter from "./StatusFilter";

const INITIAL_VISIBLE_COLUMNS: InitialVisibleColumns<Appointment> = [
  "scheduledFor",
  "patientDocument",
  "doctor",
  "patient",
  "reason",
  "status",
  "actions"
];

const columns: Column<Appointment>[] = [
  { name: "Fecha y hora", uid: "scheduledFor", sortable: true },
  { name: "Doctor", uid: "doctor" },
  { name: "Paciente", uid: "patient", sortable: true },
  { name: "Documento", uid: "patientDocument" },
  { name: "Motivo", uid: "reason", sortable: true },
  { name: "Estado", uid: "status", sortable: true },
  { name: "Acciones", uid: "actions" }
];

const ICONS = {
  plus: <PlusIcon/>,
  eye: <EyeSolidIcon/>,
  pen: <PenToSquareIcon/>
};

const OPTIONS_MAP = {
  general: {
    "register-medical-evaluation": { label: "Formulario de evaluación", icon: ICONS.plus },
    "view-evaluation-report": { label: "Ver reporte de evaluación", icon: ICONS.eye },
    "view-prescription": { label: "Ver receta", icon: <PrescriptionBottlePillIcon /> },
    "appointment-edit": { label: "Editar cita", icon: ICONS.pen },
    "reception-appointment": { label: "Recepcionar cita", icon: ICONS.pen },
    "reschedule-appointment": { label: "Reagendar cita", icon: <CalendarPenIcon /> }
  },
  dentist: {
    "register-dental-evolution": { label: "Formulario de evolución dental", icon: ICONS.plus },
    "view-dental-report": { label: "Ver reporte de evolución dental", icon: ICONS.eye },
    "view-prescription": { label: "Ver receta", icon: <PrescriptionBottlePillIcon /> }
  },
  admin: {
    "appointment-edit": { label: "Editar cita", icon: ICONS.pen },
    "reception-appointment": { label: "Recepcionar cita", icon: ICONS.pen },
    "view-evaluation-report": { label: "Ver reporte de evaluación", icon: ICONS.eye },
    "view-prescription": { label: "Ver receta", icon: <PrescriptionBottlePillIcon /> },
    "reschedule-appointment": { label: "Reagendar cita", icon: <CalendarPenIcon /> }
  }
};

interface AppointmentTableProps {
  openCreateModal: () => void;
  openAppointmentModal: () => void;
  openClinicalExamModal: () => void;
  openDentalEvolutionModal: () => void;
  openOdontogramModal: () => void;
  openMedicalEvaluationModal: () => void;
  openMedicationModal: () => void;
}

interface ActionOptions {
  keys: string[];
  options: Record<string, ActionOption>;
}

const AppointmentTable: FC<AppointmentTableProps> = (
  {
    openCreateModal,
    openAppointmentModal,
    openOdontogramModal,
    openMedicalEvaluationModal,
    openMedicationModal
  }
) => {

  const { user } = useLogout();
  const {
    filters,
    setAppointmentId: setId,
    setAppointmentStatus,
    setAdditionalData,
    setSelectedForm
  } = useAppointmentStore((state) => state);

  const [tableFilters, setTableFilters] = useState<TableFiltersRequest>({
    page: 1,
    rowsPerPage: 5,
    filterValue: "",
    sortDescriptor: { column: "scheduledFor", direction: "descending" }
  });

  const {
    isLoading,
    data: {
      data: appointments = [],
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
  } = useQuery<AppointmentResponse>({
    queryKey: ["appointments", { ...tableFilters, ...filters }],
    queryFn: ({ signal }) => getAppointments({ ...tableFilters, ...filters }, signal),
    placeholderData: keepPreviousData
  });

  const actionOptions: ActionOptions = useMemo(() => {
    if (!user?.role.id) return { keys: [], options: {} };

    if (user.role.id === __DOCTOR_ROLE_ID__) {
      return user?.specialty?.id === __DENTISTRY_SPECIALTY_ID__
        ? {
          keys: [
            "register-dental-evolution",
            "view-dental-report",
            "view-prescription"
          ],
          options: OPTIONS_MAP.dentist
        }
        : {
          keys: [
            "register-medical-evaluation",
            "view-evaluation-report",
            "view-prescription",
            "appointment-edit",
            "reception-appointment",
            "reschedule-appointment",
            "delete"
          ],
          options: OPTIONS_MAP.general
        };
    }

    return {
      keys: ["appointment-edit", "reschedule-appointment", "delete"],
      options: OPTIONS_MAP.admin
    };
  }, [user]);


  const renderCell = useCallback(
    (appointment: Appointment, columnKey: Key) => {
      const cellValue = appointment[columnKey as keyof Appointment];

      switch (columnKey) {
      case "actions":
        return (
          <ActionsDropdown
            onAction={(key) => {
              setId(appointment.id);
              setAppointmentStatus(appointment.status);
              if (key === "edit") {
                openCreateModal();
              }

              if (key === "appointment-edit") {
                openAppointmentModal();
                setAdditionalData({ patientName: appointment.patient });
                setSelectedForm("appointment-form");
              }

              if (key === "reception-appointment" || key === "reschedule-appointment") {
                openAppointmentModal();
                setAdditionalData({ patientName: appointment.patient });
                setSelectedForm("appointment-form");
              }

              if (key === "register-medical-evaluation") {
                setAdditionalData({ patientId: appointment.patientId });
                setSelectedForm("anamnesis-form");
                openMedicalEvaluationModal();
              }

              if (key === "register-dental-evolution") {
                openOdontogramModal();
              }

              if (key === "view-evaluation-report") {

                if (appointment.status === "Realizada") {
                  const reportUrl = `/api/appointments/general-report/${appointment.id}`;
                  window.open(reportUrl, "reportWindow", "width=800,height=600");
                } else {
                  toast.error("La evaluacion médica debe estar realizada para ver el reporte", {
                    id: "toast",
                    duration: 1500
                  });
                }
              }

              if (key === "view-dental-report") {
                if (appointment.status === "Realizada") {
                  const reportUrl = `/api/appointments/dental-report/${appointment.id}`;
                  window.open(reportUrl, "reportWindow", "width=800,height=600");
                } else {
                  toast.error("La cita debe estar realizada para ver el reporte de evaluación", {
                    id: "toast",
                    duration: 1500
                  });
                }
              }

              if (key === "view-prescription") {
                if (appointment.prescription) {
                  const reportUrl = `/api/appointments/prescription/${appointment.id}`;
                  window.open(reportUrl, "reportWindow", "width=800,height=600");
                } else {
                  toast.error("No tiene una receta registrada", {
                    id: "toast",
                    duration: 1500
                  });
                }
              }

            }}
            customOptions={actionOptions.options}
            keys={
              appointment.status === "Programada"
                ? ["reception-appointment", "delete"]
                : appointment.status === "Cancelada"
                  ? ["reschedule-appointment", "delete"]
                  : appointment.status === "Realizada"
                    ? user?.role.id === __DOCTOR_ROLE_ID__
                      ? [
                        "register-medical-evaluation",
                        "view-evaluation-report",
                        "view-prescription"
                      ]
                      : ["view-evaluation-report", "view-prescription"]
                    : actionOptions.keys.filter(key => !["reception-appointment", "reschedule-appointment"].includes(key))
            }
          />
        );

      case "scheduledFor": {
        const parts = (cellValue as string)?.split(" ");
        return (
          <div className="whitespace-nowrap">{parts.slice(0, 2).join(" ")}
            <span className="text-xs text-gray-500 ml-1">{parts[2]}</span>
          </div>
        );
      }


      case "patientDocument": {
        const [documentType, documentNumber] = appointment.patientDocument.split(" - ");

        return (
          <div className="flex items-center gap-1">
            <Tooltip content={
              documentType === "DNI" ? "Documento Nacional de Identidad" :
                documentType === "Pasaporte" ? "Pasaporte" : "Carnet de Extranjería"
            }>
              <span className="text-xs text-gray-500 cursor-help">
                {documentType === "DNI" ? "DNI" :
                  documentType === "Pasaporte" ? "Pas." : "C.E."}:
              </span>
            </Tooltip>
            <span>{documentNumber}</span>
          </div>
        );
      }

      case "status": {
        const statusColors = {
          "Pendiente": "warning",
          "Realizada": "success",
          "Programada": "primary",
          "Cancelada": "danger"
        } as const;
        return (
          <Chip
            variant="shadow"
            color={statusColors[cellValue as keyof typeof statusColors] || "default"}
          >
            {cellValue}
          </Chip>
        );
      }

      default:
        return cellValue;
      }
    },
    []
  );

  useEffect(() => {
    if (user?.role.id === __DOCTOR_ROLE_ID__) {
      const doctorIndex = INITIAL_VISIBLE_COLUMNS.indexOf("doctor");
      if (doctorIndex > -1) {
        INITIAL_VISIBLE_COLUMNS.splice(doctorIndex, 1);
      }

      const doctorColumnIndex = columns.findIndex(column => column.uid === "doctor");
      if (doctorColumnIndex > -1) {
        columns.splice(doctorColumnIndex, 1);
      }
    } else {
      const doctorColumnExists = columns.some(column => column.uid === "doctor");
      if (!doctorColumnExists) {
        columns.splice(2, 0, { name: "Doctor", uid: "doctor", sortable: true });
      }

      const doctorVisibleColumnExists = INITIAL_VISIBLE_COLUMNS.includes("doctor");
      if (!doctorVisibleColumnExists) {
        INITIAL_VISIBLE_COLUMNS.splice(2, 0, "doctor");
      }
    }
  }, [user]);

  if (error) return <div>Error: {error.message}</div>;

  return (
    <TableCrud
      data={appointments}
      columns={columns.filter(
        (column) =>
          __ADMIN_ROLE_ID__ === user?.role.id || column.uid !== "doctor"
      )}
      renderCell={renderCell}
      tableFilters={tableFilters}
      setTableFilters={setTableFilters}
      pagination={pagination}
      isFetching={isFetching}
      isLoading={isLoading}
      initialVisibleColumns={INITIAL_VISIBLE_COLUMNS}
      textTable={{
        placeholderSearch: "Buscar por nombre del paciente o número de documento",
        nameTable: "Citas",
        textButtonCreate: "Registrar cita"
      }}
      openModal={openCreateModal}
      extraTopContent={
        <>
          {__ADMIN_ROLE_ID__ === user?.role.id && (
            <DoctorFilter
              className="w-auto md:w-[300px] h-[40px]"
              isDisabled={isLoading}
            />
          )}
          <StatusFilter
            className="w-auto md:w-[130px] h-[40px]"
            isDisabled={isLoading}
          />
          <Button
            onPress={openMedicationModal}
            size="md"
            radius="sm"
            color="secondary"
            variant="bordered"
            className="order-1"
            isDisabled={isLoading}
          >
            Gestionar medicamentos
          </Button>
        </>
      }
    />
  );
};

export default AppointmentTable;
