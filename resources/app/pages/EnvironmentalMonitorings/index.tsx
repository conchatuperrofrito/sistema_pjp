import EnvironmentalMonitoringTable from "./components/EnvironmentalMonitoringTable";
import { EnvironmentalMonitoringFormModal } from "./components/EnvironmentalMonitoringFormModal";
import { useDisclosure } from "@heroui/react";

const EnvironmentalMonitoringsPage = () => {
  const formModal = useDisclosure();

  return (
    <>
      <EnvironmentalMonitoringFormModal
        isOpen={formModal.isOpen}
        onOpenChange={formModal.onOpenChange}
      />
      <EnvironmentalMonitoringTable
        openModal={formModal.onOpen}
      />
    </>
  );
};

export default EnvironmentalMonitoringsPage;
