import { FC, Key, useCallback, useState } from "react";
import { InitialVisibleColumns, Column, TableProps } from "@/types/tableInterfaces";
import { TableFiltersRequest } from "@/types/requestInterfaces";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { TableCrud } from "@/components/TableCrud";
import { Event, EventResponse, EventSchedule } from "@/types/eventInterfaces";
import { useEventStore } from "@/store/eventStore";
import { useDisclosure } from "@heroui/react";
import { deleteEvent, getEvents } from "@/services/eventService";
import useSaveMutation from "@/hooks/useSaveMutation";
import { ActionsDropdown } from "@/components/ActionsDropdown";
import { DeleteConfirmationModal } from "@/components/DeleteConfirmationModal";
import { UsersIcon, FilePdfIcon } from "@/assets/icons";

const INITIAL_VISIBLE_COLUMNS: InitialVisibleColumns<Event> = [
  "createdBy",
  "title",
  "venueName",
  "organizer",
  "createdAt",
  "actions"
];

const columns: Column<Event>[] = [
  { name: "CREADO POR", uid: "createdBy" },
  { name: "TÍTULO", uid: "title", sortable: true },
  { name: "SUBTÍTULO", uid: "subtitle" },
  { name: "LUGAR", uid: "venueName", sortable: true },
  { name: "ORGANIZADOR", uid: "organizer" },
  { name: "ÁREA", uid: "organizingArea" },
  { name: "PÚBLICO OBJETIVO", uid: "targetAudience" },
  { name: "FECHA CREACIÓN", uid: "createdAt", sortable: true },
  { name: "HORARIOS", uid: "schedules" },
  { name: "ACCIONES", uid: "actions" }
];

interface EventTableProps extends TableProps {
  openParticipantsModal: () => void;
}

const EventTable: FC<EventTableProps> = ({ openModal, openParticipantsModal }) => {
  const { filters, setId, id, setTitle, title } = useEventStore((state) => state);
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
      data: events = [],
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
  } = useQuery<EventResponse>({
    queryKey: ["events", { ...tableFilters, ...filters }],
    queryFn: ({ signal }) => getEvents({ ...tableFilters, ...filters }, signal),
    placeholderData: keepPreviousData
  });

  const { save: deleteRecord, isPending } = useSaveMutation({
    mutationFn: deleteEvent,
    onSuccess: deleteModal.onOpenChange,
    queryKeys: ["events"],
    loadingMessage: "Eliminando evento..."
  });

  const renderCell = useCallback(
    (event: Event, columnKey: Key) => {
      const cellValue = event[columnKey as keyof Event];

      switch (columnKey) {
      case "createdAt": {
        const parts = (cellValue as string)?.split(" ");
        return (
          <div className="whitespace-nowrap">
            {parts.slice(0, 2).join(" ")}
            <span className="text-xs text-gray-500 ml-1">{parts[2]}</span>
          </div>
        );
      }

      case "schedules": {
        return (
          <div className="flex flex-col gap-1">
            {(cellValue as EventSchedule[])?.map((schedule, index) => (
              <div
                key={index}
              >
                {schedule.date}
                <span className="text-gray-500"> • </span>
                {schedule.startTime.split(" ").map((part, i) => (
                  <span key={i} className={i === 1 ? "text-xs text-gray-500 ml-1" : ""}>
                    {part}
                  </span>
                ))}
                {" - "}
                {schedule.endTime.split(" ").map((part, i) => (
                  <span key={i} className={i === 1 ? "text-xs text-gray-500 ml-1" : ""}>
                    {part}
                  </span>
                ))}
              </div>
            ))}
          </div>
        );
      }

      case "actions":
        return (
          <ActionsDropdown
            onAction={(key) => {
              setId(event.id);
              setTitle(event.title);

              if (key === "edit") {
                openModal();
              }

              if (key === "delete") {
                deleteModal.onOpen();
              }

              if (key === "participants") {
                openParticipantsModal();
              }

              if (key === "report") {
                const reportUrl = `/api/events/report/${event.id}`;

                window.open(reportUrl, "reportWindow", "width=800,height=600");
              }

            }}
            keys={["participants", "report", "edit", "delete"]}
            customOptions={{
              participants: {
                label: "Participantes",
                icon: <UsersIcon />
              },
              report: {
                label: "Reporte",
                icon: <FilePdfIcon />
              }
            }}
          />
        );

      default:
        return cellValue as string || <div className="text-gray-500 text-center w-full">~</div>;
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
        title="Eliminar evento"
        message={
          <span>
            ¿Estás seguro que deseas eliminar el evento{" "}
            <strong>"{title}"</strong>?
          </span>
        }
      />

      <TableCrud
        data={events}
        columns={columns}
        renderCell={renderCell}
        tableFilters={tableFilters}
        setTableFilters={setTableFilters}
        pagination={pagination}
        isFetching={isFetching}
        isLoading={isLoading}
        initialVisibleColumns={INITIAL_VISIBLE_COLUMNS}
        textTable={{
          placeholderSearch: "Buscar evento por título",
          nameTable: "Eventos",
          textButtonCreate: "Registrar evento"
        }}
        openModal={openModal}
      />
    </>
  );
};

export default EventTable;
