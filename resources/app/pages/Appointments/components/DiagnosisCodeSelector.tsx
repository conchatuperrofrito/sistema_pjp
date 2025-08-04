import { getDiagnosisCodes } from "@/services/doctorService";
import { useCallback, useState } from "react";
import { AutocompleteAsync } from "@/components/AutocompleteAsync";
import { useAppointmentStore } from "@/store/appointmentStore";
import { PlusIcon, SearchIcon } from "@/assets/icons";
import { Button } from "@heroui/react";
import { DiagnosisCode, DiagnosisCodeOptionData } from "@/types/doctorInterfaces";

const DiagnosisCodeSelector = () => {
  const [inputValue, setInputValue] = useState("");
  const [selectedDiagnosisCode, setSelectedDiagnosisCode] = useState<DiagnosisCode>();

  const { setDiagnosisFormData, diagnosisFormData } = useAppointmentStore((state) => state);

  const renderOption = (option: Option) => {
    const { code, description } = option.data as DiagnosisCodeOptionData;

    return (
      <div className="flex text-tiny items-center">
        <div className="flex items-center gap-1 min-w-[40px]">
          <span className="font-bold">{code}</span>
        </div>
        <div className="">
          {description}
        </div>
      </div>
    );
  };

  const handleSelection = useCallback((option: Option | undefined) => {
    if (!option) {
      setSelectedDiagnosisCode(undefined);
      return;
    }

    const { code, description, classification } = option.data as DiagnosisCodeOptionData;
    const diagnosisCode: DiagnosisCode = {
      id: option.value,
      code,
      description,
      classification,
      type: "Definitivo",
      case: "Nuevo",
      dischargeFlag: "No"
    };
    setSelectedDiagnosisCode(diagnosisCode);
  }, []);

  const handleAddDiagnosisCode = useCallback(() => {
    if (selectedDiagnosisCode) {
      setDiagnosisFormData({
        ...diagnosisFormData,
        diagnosisCodes: [...diagnosisFormData.diagnosisCodes, selectedDiagnosisCode]
      });
      setInputValue("");
      setSelectedDiagnosisCode(undefined);
    }
  }, [selectedDiagnosisCode, diagnosisFormData, setDiagnosisFormData]);

  return (
    <div className="flex gap-2">
      <AutocompleteAsync
        startContent={<SearchIcon />}
        value={inputValue}
        onChange={setInputValue}
        fetchOptions={getDiagnosisCodes}
        placeholder="Ingrese código CIE-10 o descripción del diagnóstico"
        label="Buscar Diagnóstico CIE-10"
        emptyContentMessage="No hay resultados para su búsqueda"
        disabledKeys={diagnosisFormData.diagnosisCodes.map((diagnosis) => diagnosis.id)}
        renderItem={renderOption}
        size="sm"
        isCustom={false}
        setSelection={handleSelection}
        popoverContentClassName="w-[calc(100%+56px)] sm:w-full"
      />

      <Button
        isIconOnly
        color="success"
        className="min-h-[48px] aspect-square min-w-[48px] rounded-small"
        isDisabled={!selectedDiagnosisCode}
        onPress={handleAddDiagnosisCode}
      >
        <PlusIcon />
      </Button>
    </div>
  );
};

export default DiagnosisCodeSelector;
