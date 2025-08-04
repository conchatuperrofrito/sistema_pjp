import { getDosageForms } from "@/services/medicationService";
import { FC } from "react";
import { CustomAutocomplete } from "@/components/CustomAutocomplete";

interface DosageFormsAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  className?: string;
  isInvalid?: boolean;
  errorMessage?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
}

const DosageFormsAutocomplete: FC<DosageFormsAutocompleteProps> = (props) => {

  const renderItem = (item: Option) => {
    return <div>{item.label}</div>;
  };

  return (
    <CustomAutocomplete
      {...props}
      label="Forma de dosificación"
      placeholder="Buscar por forma de dosificación"
      queryFn={getDosageForms}
      queryKey="dosageForms"
      emptyContentMessage="No se encontraron formas de dosificación"
      renderItem={renderItem}
    />
  );
};

export default DosageFormsAutocomplete;
