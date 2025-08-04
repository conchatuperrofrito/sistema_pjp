import CommitteeMinuteTable from "./components/CommitteeMinuteTable";
import { CommitteeMinuteFormModal } from "./components/CommitteeMinuteFormModal";
import { useDisclosure } from "@heroui/react";

const CommitteeMinutesPage = () => {
  const formModal = useDisclosure();

  return (
    <>
      <CommitteeMinuteFormModal
        isOpen={formModal.isOpen}
        onOpenChange={formModal.onOpenChange}
      />
      <CommitteeMinuteTable
        openModal={formModal.onOpen}
      />
    </>
  );
};

export default CommitteeMinutesPage;
