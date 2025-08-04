import { FC } from "react";
import { usePatientStore } from "@/store/patientStore";
import { SelectFilter } from "@/components/SelectFilter";

interface SexFilterProps {
    className?: string;
    isLoading?: boolean;
    isDisabled?: boolean;
}

export const SexFilter: FC<SexFilterProps> = (props) => {
  const { filters, setFilters } = usePatientStore((state) => state);

  return (
    <SelectFilter
      {...props}
      placeholder="Filtrar por sexo"
      ariaLabel="Filtrar por sexo"
      emptyContent="No se encontraron resultados"
      onSelectionChange={(value) => setFilters({ ...filters, sex: value })}
      selectedKey={filters.sex}
      items={[
        { value: "Masculino", label: "Masculino" },
        { value: "Femenino", label: "Femenino" }
      ]}
    />
  );
};
