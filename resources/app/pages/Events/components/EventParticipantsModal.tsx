import { FC, Key, useCallback, useState } from "react";
import { useEventStore } from "@/store/eventStore";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Tooltip
} from "@heroui/react";
import PatientAutocomplete from "@/pages/Appointments/components/PatientAutocomplete";
import { Button } from "@heroui/react";
import { PlusIcon, QrCodeIcon, TrashSolidIcon } from "@/assets/icons";
import { addParticipant, getParticipants, removeParticipant } from "@/services/eventService";
import useSaveMutation from "@/hooks/useSaveMutation";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { TableCrud } from "@/components/TableCrud";
import { EventParticipant } from "@/types/eventInterfaces";
import { TableFiltersRequest } from "@/types/requestInterfaces";
import { Column } from "@/types/tableInterfaces";
import BarcodeQrScanner from "@/pages/Appointments/components/BarcodeQrScanner";
import { useMediaQuery } from "react-responsive";

const COLUMNS_TABLE: Column<EventParticipant>[] = [
  {
    uid: "fullName",
    name: "Nombre",
    sortable: true
  },
  {
    uid: "documentNumber",
    name: "Documento"
  },
  {
    uid: "position",
    name: "Cargo"
  },
  {
    uid: "createdAt",
    name: "Fecha de registro"
  },
  {
    uid: "actions",
    name: "Acciones"
  }
];

interface EventParticipantsModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

export const EventParticipantsModal: FC<EventParticipantsModalProps> = ({
  isOpen,
  onOpenChange
}) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const { id, title, setId } = useEventStore((state) => state);
  const [isOpenQrScanner, setIsOpenQrScanner] = useState(false);

  const [selectedParticipant, setSelectedParticipant] = useState<string>("");
  const [removingParticipantId, setRemovingParticipantId] = useState<string | null>(null);

  const [tableFilters, setTableFilters] = useState<TableFiltersRequest>({
    page: 1,
    rowsPerPage: 5,
    filterValue: "",
    sortDescriptor: { column: "fullName", direction: "ascending" }
  });

  const initialData = {
    patients: {
      data: [],
      pagination: {
        total: 0,
        count: 0,
        perPage: 0,
        currentPage: 0,
        totalPages: 0
      }
    },
    participants: []
  };

  const {
    data = initialData,
    isLoading,
    isFetching
  } = useQuery({
    queryKey: ["participants", { ...tableFilters, id }],
    queryFn: ({ signal }) => getParticipants({ ...tableFilters, id }, signal),
    initialData: initialData,
    placeholderData: keepPreviousData,
    enabled: !!id
  });

  const participants = data.patients.data;
  const pagination = data.patients.pagination;
  const participantIds = data.participants;

  const addParticipantQuery = useSaveMutation({
    mutationFn: addParticipant,
    queryKeys: ["participants"],
    onSuccess: () => setSelectedParticipant("")
  });

  const removeParticipantQuery = useSaveMutation({
    mutationFn: removeParticipant,
    queryKeys: ["participants"],
    onSuccess: () => setRemovingParticipantId(null)
  });

  const handleRemoveParticipant = (participantId: string) => {
    setRemovingParticipantId(participantId);
    removeParticipantQuery.save({ id, patientId: participantId });
  };


  const renderCell = useCallback(
    (participant: EventParticipant, columnKey: Key) => {
      const cellValue = participant[columnKey as keyof EventParticipant];

      switch (columnKey) {
      case "documentNumber":
        return (
          <div className="flex items-center gap-1">
            <Tooltip content={
              participant.documentType === "DNI" ? "Documento Nacional de Identidad" :
                participant.documentType === "Pasaporte" ? "Pasaporte" : "Carnet de Extranjería"
            }>
              <span className="text-xs text-gray-500 cursor-help">
                {participant.documentType === "DNI" ? "DNI" :
                  participant.documentType === "Pasaporte" ? "Pas." : "C.E."}:
              </span>
            </Tooltip>
            <span>{participant.documentNumber}</span>
          </div>
        );
      case "actions":
        return (
          <div className="flex gap-2">
            <Button
              isIconOnly
              color="danger"
              onPress={() => handleRemoveParticipant(participant.id)}
              isLoading={removingParticipantId === participant.id}
              isDisabled={removingParticipantId !== null && removingParticipantId !== participant.id}
            >
              <TrashSolidIcon />
            </Button>
          </div>
        );
      default:
        return cellValue;
      }
    }, [id, removeParticipantQuery, removingParticipantId]
  );

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size={isMobile ? "full" : "4xl"}
      scrollBehavior={isMobile ? "inside" : "normal"}
      onClose={() => {
        setSelectedParticipant("");
        setIsOpenQrScanner(false);
        setId("");
      }}
      isDismissable={false}
      shouldBlockScroll={false}
      classNames={{ wrapper: "items-start h-auto", base: "my-auto" }}
    >
      <ModalContent>
        <ModalHeader className="pb-1">Participantes del evento {title}</ModalHeader>
        <ModalBody className="gap-0">
          <div className="flex gap-2">
            <div className="flex-1">
              <PatientAutocomplete
                value={selectedParticipant}
                onChange={setSelectedParticipant}
                disabledKeys={participantIds}
                isDisabled={addParticipantQuery.isPending}
                popoverContentClassName="w-[calc(100%+112px)] sm:w-full"
              />
            </div>
            <Button
              isIconOnly
              color="primary"
              className="min-h-[48px] min-w-[48px]"
              onPress={() => addParticipantQuery.save({ id, patientId: selectedParticipant })}
              isDisabled={addParticipantQuery.isPending || !selectedParticipant}
              isLoading={addParticipantQuery.isPending}
            >
              <PlusIcon />
            </Button>
            <Popover
              placement="right"
              isOpen={isOpenQrScanner}
              onOpenChange={setIsOpenQrScanner}
              shouldCloseOnInteractOutside={() => false}
              classNames={{
                content: "rounded-md p-1"
              }}
              showArrow
            >
              <PopoverTrigger>
                <Button
                  isIconOnly
                  color="warning"
                  className="min-h-[48px] min-w-[48px]"
                >
                  <QrCodeIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                {addParticipantQuery.isPending && (
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-sm shadow-2xl z-[99]">
                    <Spinner />
                  </div>
                )}

                <BarcodeQrScanner
                  isActive={isOpenQrScanner}
                  save={(documentNumber: string) => {
                    addParticipantQuery.save({ id, documentNumber });
                  }}
                  isLoading={addParticipantQuery.isPending}
                />
              </PopoverContent>
            </Popover>
          </div>

          <TableCrud
            key={removingParticipantId || ""}
            removeWrapper
            data={participants}
            columns={COLUMNS_TABLE}
            renderCell={renderCell}
            tableFilters={tableFilters}
            setTableFilters={setTableFilters}
            pagination={pagination}
            isFetching={isFetching}
            isLoading={isLoading}
            initialVisibleColumns={COLUMNS_TABLE.map((column) => column.uid)}
            buttonCreate={false}
            columnDropdown={false}
            textTable={{
              nameTable: "Participantes",
              placeholderSearch: "Buscar participante por nombre, apellido o número de documento...",
              textButtonCreate: "Agregar participante"
            }}
          />

        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EventParticipantsModal;
