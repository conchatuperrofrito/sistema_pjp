import { FC, Key, useCallback, useState } from "react";
import { InitialVisibleColumns, Column } from "@/types/tableInterfaces";
import { TableFiltersRequest } from "@/types/requestInterfaces";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { TableCrud } from "@/components/TableCrud";
import { User, UserResponse } from "@/types/userInterfaces";
import { useUserStore } from "@/store/userStore";
import { useDisclosure } from "@heroui/react";
import { deleteUser, getUsers, resetPassword } from "@/services/userService";
import useSaveMutation from "@/hooks/useSaveMutation";
import { ActionsDropdown } from "@/components/ActionsDropdown";
import { DeleteConfirmationModal } from "@/components/DeleteConfirmationModal";
import { RoleFilter } from "./RoleFilter";
import { ConfirmationModal } from "@/components/ConfirmationModal";

const INITIAL_VISIBLE_COLUMNS: InitialVisibleColumns<User> = [
  "fullName",
  "documentType",
  "documentNumber",
  "role",
  "specialty",
  "registrationNumber",
  "actions"
];

const columns: Column<User>[] = [
  { name: "NOMBRE COMPLETO", uid: "fullName", sortable: true },
  { name: "TIPO DE DOCUMENTO", uid: "documentType", sortable: true },
  {
    name: "N° DOCUMENTO",
    uid: "documentNumber",
    sortable: true
  },
  { name: "ROL", uid: "role", sortable: false },
  { name: "ESPECIALIDAD", uid: "specialty", sortable: true },
  { name: "N° REGISTRO", uid: "registrationNumber", sortable: true },
  { name: "ACCIONES", uid: "actions" }
];

interface UserTableProps {
    openModal: () => void;
}

const UserTable: FC<UserTableProps> = (
  { openModal }
) => {
  const { filters, setId, id } = useUserStore((state) => state);
  const deleteModal = useDisclosure();
  const confirmationModal = useDisclosure();

  const [tableFilters, setTableFilters] = useState<TableFiltersRequest>({
    page: 1,
    rowsPerPage: 5,
    filterValue: "",
    sortDescriptor: { column: "", direction: "ascending" }
  });

  const {
    isLoading,
    data: {
      data: users = [],
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
  } = useQuery<UserResponse>({
    queryKey: ["users", { ...tableFilters, ...filters }],
    queryFn: ({ signal }) => getUsers({ ...tableFilters, ...filters }, signal),
    placeholderData: keepPreviousData
  });

  const { save: deleteRecord, isPending } = useSaveMutation({
    mutationFn: deleteUser,
    onSuccess: deleteModal.onOpenChange,
    queryKeys: ["users"],
    loadingMessage: "Eliminando usuario..."
  });

  const resetPasswordMutation = useSaveMutation({
    mutationFn: resetPassword,
    loadingMessage: "Restableciendo contraseña...",
    onSuccess: confirmationModal.onClose
  });

  const renderCell = useCallback(
    (user: User, columnKey: Key) => {
      const cellValue = user[columnKey as keyof User];

      switch (columnKey) {
      case "actions":
        return (
          <ActionsDropdown
            onAction={(key) => {
              setId(user.id);
              if (key === "edit") {
                openModal();
              }

              if (key === "delete") {
                deleteModal.onOpen();
              }

              if (key === "reset-password") {
                confirmationModal.onOpen();
              }
            }}
            keys={["edit", "delete", "reset-password"]}
          />
        );

      default:
        return cellValue;
      }
    },
    []
  );

  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={confirmationModal.onClose}
        onOpenChange={confirmationModal.onOpenChange}
        functionAction={() => resetPasswordMutation.save(id)}
        title="Restablecer contraseña"
        message={
          <span>
              ¿Estas seguro que deseas restablecer la contraseña del usuario{" "}
            <strong>
                "
              {
                users.find((user) => user.id === id)
                  ?.fullName
              }
                "
            </strong>
              ?
          </span>
        }
        loading={resetPasswordMutation.isPending}
      />

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        deleteAction={() => deleteRecord(id)}
        onOpenChange={deleteModal.onOpenChange}
        onClose={() => setId("")}
        loading={isPending}
        title="Eliminar usuario"
        message={
          <span>
              ¿Estás seguro que deseas eliminar el usuario{" "}
            <strong>
                "
              {
                users.find((user) => user.id === id)
                  ?.fullName
              }
                "
            </strong>
              ?
          </span>
        }
      />

      <TableCrud
        data={users}
        columns={columns}
        renderCell={renderCell}
        tableFilters={tableFilters}
        setTableFilters={setTableFilters}
        pagination={pagination}
        isFetching={isFetching}
        isLoading={isLoading}
        initialVisibleColumns={INITIAL_VISIBLE_COLUMNS}
        textTable={{
          placeholderSearch: "Buscar usuario por nombre, apellido o número de documento...",
          nameTable: "Usuarios",
          textButtonCreate: "Crear usuario"
        }}
        openModal={openModal}
        extraTopContent={
          <RoleFilter
            isDisabled={isLoading}
            className="h-[40px] md:w-[150px] w-auto"
          />
        }
      />
    </>
  );
};

export default UserTable;
