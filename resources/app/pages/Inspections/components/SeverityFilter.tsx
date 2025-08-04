import { FC } from "react";
import { useInspectionStore } from "@/store/inspectionStore";
import { SelectFilter } from "@/components/SelectFilter";

interface SeverityFilterProps {
  className?: string;
  isDisabled?: boolean;
  isLoading?: boolean;
}

export const SeverityFilter: FC<SeverityFilterProps> = (props) => {
  const { filters, setFilters } = useInspectionStore((state) => state);

  const severityLevels = [
    { label: "Baja", value: "Baja" },
    { label: "Moderada", value: "Moderada" },
    { label: "Alta", value: "Alta" }
  ];

  return (
    <SelectFilter
      {...props}
      placeholder="Filtrar por severidad"
      ariaLabel="Filtrar por severidad"
      emptyContent="No se encontraron resultados"
      onSelectionChange={(value) => setFilters({ ...filters, severity: value })}
      selectedKey={filters.severity}
      items={severityLevels}
    />
  );
};
