import { FC } from "react";
import { useEppDeliveryStore } from "@/store/eppDeliveryStore";
import { SelectFilter } from "@/components/SelectFilter";

interface ConditionFilterProps {
  className?: string;
  isDisabled?: boolean;
  isLoading?: boolean;
}

export const ConditionFilter: FC<ConditionFilterProps> = (props) => {
  const { filters, setFilters } = useEppDeliveryStore((state) => state);

  const conditions = [
    { label: "Nuevo", value: "Nuevo" },
    { label: "Usado", value: "Usado" },
    { label: "Dañado", value: "Dañado" }
  ];

  return (
    <SelectFilter
      {...props}
      placeholder="Filtrar por condición"
      ariaLabel="Filtrar por condición"
      emptyContent="No se encontraron resultados"
      onSelectionChange={(value) => setFilters({ ...filters, condition: value })}
      selectedKey={filters.condition}
      items={conditions}
    />
  );
};
