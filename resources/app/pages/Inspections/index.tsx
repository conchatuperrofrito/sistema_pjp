import InspectionTable from "./components/InspectionTable";
import InspectionFormModal from "./components/InspectionFormModal";
import { useDisclosure } from "@heroui/react";

const InspectionsPage = () => {
  const formModal = useDisclosure();

  return (
    <>
      <InspectionFormModal
        isOpen={formModal.isOpen}
        onOpenChange={formModal.onOpenChange}
      />

      <InspectionTable
        openModal={formModal.onOpen}
      />
    </>
  );
};

export default InspectionsPage;
