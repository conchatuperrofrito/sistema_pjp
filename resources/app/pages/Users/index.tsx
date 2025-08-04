
import UserTable from "./components/UserTable";
import { UserFormModal } from "./components/UserFormModal";
import { useDisclosure } from "@heroui/react";

const UsersPage = () => {

  const formModal = useDisclosure();

  return (
    <>
      <UserFormModal
        isOpen={formModal.isOpen}
        onOpenChange={formModal.onOpenChange}

      />

      <UserTable
        openModal={formModal.onOpen}
      />
    </>
  );
};

export default UsersPage;
