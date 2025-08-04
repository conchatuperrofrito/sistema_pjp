import { FC, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Chip,
  Tooltip,
  Spinner,
  SortDescriptor,
  ModalFooter,
  Button
} from "@heroui/react";

import { getPatientAppointments } from "@/services/patientService";
import { Key, useCallback, useEffect, useState } from "react";
import { PatientAppointment } from "@/types/patientInterfaces";
import { usePatientStore } from "@/store/patientStore";
import { FilePdfIcon } from "@/assets/icons";
import { useMediaQuery } from "react-responsive";

const columns = [
  {
    key: "date",
    label: "Fecha",
    size: "100px",
    sortable: true
  },
  {
    key: "hour",
    label: "Hora"
  },
  {
    key: "doctor",
    label: "Doctor",
    sortable: true
  },
  {
    key: "specialty",
    label: "Especialidad",
    sortable: true
  },
  {
    key: "reason",
    label: "Motivo"
  },
  {
    key: "status",
    label: "Estado"
  }
];

interface AppointmentModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

const AppointmentModal: FC<AppointmentModalProps> = ({
  isOpen,
  onOpenChange
}) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const { id, fullName } = usePatientStore((state) => state);
  const [isLoading, setIsLoading] = useState(false);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "date",
    direction: "descending"
  });
  const [rows, setRows] = useState<PatientAppointment[]>([]);

  const sortedItems = useMemo(() => {
    const { column, direction } = sortDescriptor;

    return rows.slice().sort((a: PatientAppointment, b: PatientAppointment) => {
      const first = a[column as keyof PatientAppointment];
      const second = b[column as keyof PatientAppointment];

      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, rows]);


  useEffect(() => {
    if (id && isOpen) {
      setIsLoading(true);
      getPatientAppointments(id).then((response) => {
        setRows(response);
      }).finally(() => setIsLoading(false));
    }
  }, [isOpen, id]);

  const renderCell = useCallback(
    (appointment: PatientAppointment, columnKey: Key) => {
      const cellValue = appointment[columnKey as keyof PatientAppointment];

      switch (columnKey){
      case "status":
        return (

          appointment.status === "Realizada" ?
            <Tooltip
              content="Ver"
              delay={0}
              closeDelay={0}
            >
              <Chip
                color="success"
                className="cursor-pointer"
                onClick={() => {
                  const reportPath = appointment.specialty === "Odontología" ? "dental-report" : "general-report";
                  const reportUrl = `/api/appointments/${reportPath}/${appointment.id}`;
                  window.open(reportUrl, "reportWindow", "width=800,height=600");
                }}
              >Realizada</Chip>
            </Tooltip>
            : <Chip color={appointment.status === "Pendiente" ? "warning" : "danger"}>
              {cellValue}
            </Chip>
        );

      default:
        return cellValue;
      }

    }, []
  );

  return (
    <Modal
      onOpenChange={onOpenChange}
      isOpen={isOpen}
      size={isMobile ? "full" : "4xl"}
      scrollBehavior="inside"
      onClose={() => setRows([])}
    >
      <ModalContent>
        <ModalHeader className="pb-1">Historial de citas - {fullName}</ModalHeader>
        <ModalBody className="px-4">
          <Table
            removeWrapper
            aria-label="table-appoinments"
            isHeaderSticky
            sortDescriptor={sortDescriptor}
            onSortChange={setSortDescriptor}
          >
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn
                  key={column.key}
                  style={{ width: column.size }}
                  allowsSorting={column.sortable}
                >
                  {column.label}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody
              items={sortedItems}
              emptyContent="No hay citas registradas"
              loadingContent={<Spinner />}
              loadingState={isLoading ? "loading" : "idle"}
            >
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) => (
                    <TableCell>
                      {renderCell(item, columnKey)}
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ModalBody>
        <ModalFooter className={isLoading ? "hidden" : ""}>
          <Button
            className="bg-red-500"
            onPress={() => {
              const reportUrl = `/api/patients/${id}/appointments-report`;
              window.open(reportUrl, "reportWindow", "width=800,height=600");
            }}
          >
            <span className="font-semibold">
              Ver PDF
            </span>
            <FilePdfIcon height="1rem" width="1rem" />
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AppointmentModal;
