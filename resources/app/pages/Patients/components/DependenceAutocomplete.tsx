import { getDependenceOptions } from "@/services/dependenceService";
import { FC } from "react";
import { CustomAutocomplete } from "@/components/CustomAutocomplete";

interface DependenceAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  className?: string;
  isInvalid?: boolean;
  errorMessage?: string;
  isDisabled?: boolean;
}

const DependenceAutocomplete: FC<DependenceAutocompleteProps> = (props) => {

  const renderItem = (item: Option) => {
    return <div>{item.label}</div>;
  };

  return (
    <CustomAutocomplete
      {...props}
      label="Dependencia"
      placeholder="Buscar por dependencia"
      queryFn={getDependenceOptions}
      queryKey="patientDependences"
      emptyContentMessage="No se encontraron dependencias"
      renderItem={renderItem}
      popoverContentClassName="w-[calc(100%+52px)] sm:w-full"
    />
  );
};

export default DependenceAutocomplete;
