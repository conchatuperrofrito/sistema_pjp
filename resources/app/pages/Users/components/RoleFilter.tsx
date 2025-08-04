import { getUserRoles } from "@/services/userService";
import { FC } from "react";
import { useUserStore } from "@/store/userStore";
import { SelectFilter } from "@/components/SelectFilter";

interface RoleFilterProps {
  className?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
}

export const RoleFilter: FC<RoleFilterProps> = (props) => {
  const { filters, setFilters } = useUserStore((state) => state);

  return (
    <SelectFilter
      {...props}
      queryKey="usersRoles"
      queryFn={getUserRoles}
      placeholder="Filtrar por rol"
      ariaLabel="Filtrar por rol"
      emptyContent="No se encontraron roles"
      onSelectionChange={(value) => setFilters({ ...filters, role: value })}
      selectedKey={filters.role}
    />
  );
};
