import EventTable from "./components/EventTable";
import EventFormModal from "./components/EventFormModal";
import { useDisclosure } from "@heroui/react";
import EventParticipantsModal from "./components/EventParticipantsModal";

const EventsPage = () => {
  const formModal = useDisclosure();
  const participantsModal = useDisclosure();

  return (
    <>

      <EventParticipantsModal
        isOpen={participantsModal.isOpen}
        onOpenChange={participantsModal.onOpenChange}
      />

      <EventFormModal
        isOpen={formModal.isOpen}
        onOpenChange={formModal.onOpenChange}
      />

      <EventTable
        openModal={formModal.onOpen}
        openParticipantsModal={participantsModal.onOpen}
      />
    </>
  );
};

export default EventsPage;
