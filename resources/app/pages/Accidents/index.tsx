import AccidentTable from "./components/AccidentTable";
import AccidentFormModal from "./components/AccidentFormModal";
import { useDisclosure } from "@heroui/react";

const AccidentsPage = () => {

  const formModal = useDisclosure();

  return (
    <>
      <AccidentFormModal
        isOpen={formModal.isOpen}
        onOpenChange={formModal.onOpenChange}
      />

      <AccidentTable
        openModal={formModal.onOpen}
      />
    </>
  );
};

export default AccidentsPage;
