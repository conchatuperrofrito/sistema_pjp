import { FC } from "react";
import { useOccupationalExamStore } from "@/store/occupationalExamStore";
import { SelectFilter } from "@/components/SelectFilter";

interface ExamTypeFilterProps {
  className?: string;
  isDisabled?: boolean;
  isLoading?: boolean;
}

export const ExamTypeFilter: FC<ExamTypeFilterProps> = (props) => {
  const { filters, setFilters } = useOccupationalExamStore((state) => state);

  const examTypes = [
    { label: "Ingreso", value: "Ingreso" },
    { label: "Periódico", value: "Periódico" },
    { label: "Retiro", value: "Retiro" }
  ];

  return (
    <SelectFilter
      {...props}
      placeholder="Filtrar por tipo de examen"
      ariaLabel="Filtrar por tipo de examen"
      emptyContent="No se encontraron resultados"
      onSelectionChange={(value) => setFilters({ ...filters, examType: value })}
      selectedKey={filters.examType}
      items={examTypes}
    />
  );
};
