import { FC } from "react";
import { useAppointmentStore } from "@/store/appointmentStore";
import { SelectFilter } from "@/components/SelectFilter";

interface StatusFilterProps {
  className?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
}

export const StatusFilter: FC<StatusFilterProps> = (props) => {
  const { filters, setFilters } = useAppointmentStore((state) => state);

  return (
    <SelectFilter
      {...props}
      placeholder="Filtrar por estado"
      ariaLabel="Filtrar por estado"
      emptyContent="No se encontraron resultados"
      onSelectionChange={(value) => setFilters({ ...filters, status: value })}
      selectedKey={filters.status}
      items={[
        { value: "Pendiente", label: "Pendiente" },
        { value: "Realizada", label: "Realizada" },
        { value: "Programada", label: "Programada" },
        { value: "Cancelada", label: "Cancelada" }
      ]}
    />
  );
};

export default StatusFilter;
