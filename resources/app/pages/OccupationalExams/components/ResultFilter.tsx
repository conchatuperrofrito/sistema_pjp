import { FC } from "react";
import { useOccupationalExamStore } from "@/store/occupationalExamStore";
import { SelectFilter } from "@/components/SelectFilter";

interface ResultFilterProps {
  className?: string;
  isDisabled?: boolean;
  isLoading?: boolean;
}

export const ResultFilter: FC<ResultFilterProps> = (props) => {
  const { filters, setFilters } = useOccupationalExamStore((state) => state);

  const results = [
    { label: "Apto", value: "Apto" },
    { label: "No Apto", value: "No Apto" },
    { label: "Apto con reservas", value: "Apto con reservas" }
  ];

  return (
    <SelectFilter
      {...props}
      placeholder="Filtrar por resultado"
      ariaLabel="Filtrar por resultado"
      emptyContent="No se encontraron resultados"
      onSelectionChange={(value) => setFilters({ ...filters, result: value })}
      selectedKey={filters.result}
      items={results}
    />
  );
};
