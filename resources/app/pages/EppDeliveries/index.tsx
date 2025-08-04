import EppDeliveryTable from "./components/EppDeliveryTable";
import EppDeliveryFormModal from "./components/EppDeliveryFormModal";
import { useDisclosure } from "@heroui/react";

const EppDeliveriesPage = () => {
  const formModal = useDisclosure();

  return (
    <>
      <EppDeliveryFormModal
        isOpen={formModal.isOpen}
        onOpenChange={formModal.onOpenChange}
      />

      <EppDeliveryTable
        openModal={formModal.onOpen}
      />
    </>
  );
};

export default EppDeliveriesPage;
