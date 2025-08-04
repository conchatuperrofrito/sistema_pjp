import { getAppointmentDoctors } from "@/services/appointmentService";
import { FC } from "react";
import { useAppointmentStore } from "@/store/appointmentStore";
import { SelectFilter } from "@/components/SelectFilter";

interface DoctorFilterProps {
  className?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
}

export const DoctorFilter: FC<DoctorFilterProps> = (props) => {
  const { filters, setFilters } = useAppointmentStore((state) => state);

  return (
    <SelectFilter
      {...props}
      queryKey="appointmentDoctors"
      queryFn={getAppointmentDoctors}
      placeholder="Filtrar por doctor"
      ariaLabel="Filtrar por doctor"
      emptyContent="No se encontraron doctores"
      onSelectionChange={(value) => setFilters({ ...filters, doctor: value })}
      selectedKey={filters.doctor}
    />
  );
};
