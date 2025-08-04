import { getPositionOptions } from "@/services/positionService";
import { FC } from "react";
import { CustomAutocomplete } from "@/components/CustomAutocomplete";

interface PositionAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  className?: string;
  isInvalid?: boolean;
  errorMessage?: string;
  isDisabled?: boolean;
}

const PositionAutocomplete: FC<PositionAutocompleteProps> = (props) => {

  const renderItem = (item: Option) => {
    return <div>{item.label}</div>;
  };

  return (
    <CustomAutocomplete
      {...props}
      label="Cargo"
      placeholder="Buscar por cargo"
      queryFn={getPositionOptions}
      queryKey="patientPositions"
      emptyContentMessage="No se encontraron cargos"
      renderItem={renderItem}
      popoverContentClassName="100%+52px)] sm:w-auto"
    />
  );
};

export default PositionAutocomplete;
