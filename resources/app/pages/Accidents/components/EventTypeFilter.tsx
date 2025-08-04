import { FC } from "react";
import { useAccidentStore } from "@/store/accidentStore";
import { SelectFilter } from "@/components/SelectFilter";

interface EventTypeFilterProps {
  className?: string;
  isDisabled?: boolean;
  isLoading?: boolean;
}

export const EventTypeFilter: FC<EventTypeFilterProps> = (props) => {
  const { filters, setFilters } = useAccidentStore((state) => state);

  const eventTypes = [
    { label: "Accidente", value: "Accidente" },
    { label: "Enfermedad", value: "Enfermedad" },
    { label: "Incidente", value: "Incidente" },
    { label: "Otro", value: "Otro" }
  ];

  return (
    <SelectFilter
      {...props}
      placeholder="Filtrar por tipo de evento"
      ariaLabel="Filtrar por tipo de evento"
      emptyContent="No se encontraron resultados"
      onSelectionChange={(value) => setFilters({ ...filters, eventType: value })}
      selectedKey={filters.eventType}
      items={eventTypes}
    />
  );
};
