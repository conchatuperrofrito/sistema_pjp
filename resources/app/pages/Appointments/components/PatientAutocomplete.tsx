import { getPatientOptions } from "@/services/patientService";
import { FC } from "react";
import { AutocompleteAsync } from "@/components/AutocompleteAsync";
import { PatientOption } from "@/types/patientInterfaces";

interface PatientAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  className?: string;
  isInvalid?: boolean;
  errorMessage?: string;
  isDisabled?: boolean;
  disabledKeys?: string[];
  setSelection?: (option: PatientOption | undefined) => void;
  withData?: boolean;
  cacheOptions?: PatientOption[];
  initialSearch?: string;
  setCacheOptions?: (options: PatientOption[]) => void;
  label?: string;
  placeholder?: string;
  emptyContentMessage?: string;
  isRequired?: boolean;
  popoverContentClassName?: string;
}

const PatientAutocomplete: FC<PatientAutocompleteProps> = ({
  label = "Paciente",
  placeholder = "Buscar por nombre, apellido o documento",
  emptyContentMessage = "No se encontraron pacientes",
  ...props
}) => {

  const renderItem = (item: Option) => {
    const match = item.label.match(/^(.+?)\s*\(N° Documento:\s*([^)]+)\)$/);

    if (match) {
      const [, fullName, document] = match;
      return (
        <div className="flex flex-nowrap flex-col md:flex-row">
          {fullName}
          <span className="font-semibold md:ml-1 text-gray-400"> (N° Documento: {document})</span>
        </div>
      );
    }

    return <div>{item.label}</div>;
  };

  return (
    <AutocompleteAsync
      {...props}
      fetchOptions={getPatientOptions}
      placeholder={placeholder}
      label={label}
      emptyContentMessage={emptyContentMessage}
      renderItem={renderItem}
    />
  );
};

export default PatientAutocomplete;
