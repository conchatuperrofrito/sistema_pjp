import OccupationalExamTable from "./components/OccupationalExamTable";
import OccupationalExamFormModal from "./components/OccupationalExamFormModal";
import { useDisclosure } from "@heroui/react";

const OccupationalExamsPage = () => {

  const formModal = useDisclosure();

  return (
    <>
      <OccupationalExamFormModal
        isOpen={formModal.isOpen}
        onOpenChange={formModal.onOpenChange}
      />

      <OccupationalExamTable
        openModal={formModal.onOpen}
      />
    </>
  );
};

export default OccupationalExamsPage;
