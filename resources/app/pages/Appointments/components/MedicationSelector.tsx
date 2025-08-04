import { useAppointmentStore } from "@/store/appointmentStore";
import { useState, useCallback, useEffect } from "react";
import { AutocompleteAsync } from "@/components/AutocompleteAsync";
import { getMedicationOptions } from "@/services/medicationService";
import { PlusIcon, SearchIcon, PrescriptionBottlePillIcon } from "@/assets/icons";
import { Button, Tooltip } from "@heroui/react";
import { PrescriptionMedicationFormData } from "@/types/doctorInterfaces";
import { MedicationOption } from "@/types/medicationInterfaces";
import { useMedicationStore } from "@/store/medicationStore";

const MedicationSelector = () => {
  const { additionalData, setAdditionalData, medicationFormModal } = useMedicationStore((state) => state);

  const [inputValue, setInputValue] = useState("");
  const [selectedMedication, setSelectedMedication] = useState<PrescriptionMedicationFormData>();

  const { setPrescriptionFormData, prescriptionFormData } = useAppointmentStore((state) => state);

  useEffect(() => {
    return () => {
      setAdditionalData({ medicationId: "", medicationName: "" });
    };
  }, []);

  useEffect(() => {
    if (additionalData.medicationId) {
      setInputValue(additionalData.medicationId);
    }
  }, [additionalData.medicationId]);

  const renderOption = (option: MedicationOption) => {
    const { genericName, concentration, presentation, dosageForm, dosageDescription } = option.data || {};
    return (
      <div className="flex text-tiny items-center">
        <div className="flex items-center gap-1">
          <span className="font-medium">{genericName} {concentration}</span>
          {presentation && (
            <span className="text-gray-500 text-xs">
              ({presentation})
            </span>
          )}
        </div>
        {dosageForm && (
          <Tooltip content={dosageDescription} placement="top">
            <div className="ml-2 px-1.5 py-0.1 bg-gray-100 rounded text-black text-tiny">
              {dosageForm}
            </div>
          </Tooltip>
        )}
      </div>
    );
  };

  const handleSelection = useCallback((option: MedicationOption | undefined) => {
    if (!option) {
      setSelectedMedication(undefined);
      return;
    }

    const { genericName, concentration, presentation, dosageForm, dosageDescription } = option.data || {};

    const medication: PrescriptionMedicationFormData = {
      id: option.value,
      genericName: genericName ?? "",
      concentration: concentration ?? "",
      presentation: presentation ?? "",
      dosageForm: dosageForm ?? "",
      dosageDescription: dosageDescription ?? "",
      duration: "",
      frequency: "",
      instructions: ""
    };
    setSelectedMedication(medication);
  }, []);


  const handleAddMedication = useCallback(() => {
    if (selectedMedication) {
      setPrescriptionFormData({
        ...prescriptionFormData,
        medications: [...prescriptionFormData.medications, selectedMedication]
      });
      setInputValue("");
      setSelectedMedication(undefined);
    }
  }, [selectedMedication, prescriptionFormData, setPrescriptionFormData]);

  return (
    <div className="flex gap-2">
      <AutocompleteAsync
        startContent={<SearchIcon />}
        value={inputValue}
        onChange={setInputValue}
        fetchOptions={getMedicationOptions}
        placeholder="Ingrese el nombre del medicamento..."
        label="Buscar Medicamento"
        emptyContentMessage="No hay resultados para su búsqueda"
        disabledKeys={prescriptionFormData.medications.map((medication) => medication.id)}
        renderItem={renderOption}
        size="sm"
        isCustom={false}
        setSelection={handleSelection}
        initialSearch={additionalData.medicationName}
        popoverContentClassName="w-[calc(100%+112px)] sm:w-full "
      />
      <Button
        isIconOnly
        color="success"
        className="min-h-[48px] aspect-square min-w-[48px] rounded-small"
        isDisabled={!selectedMedication}
        onPress={handleAddMedication}
      >
        <PlusIcon/>
      </Button>

      <Tooltip content="Registrar nuevo medicamento" placement="top" showArrow>
        <Button
          isIconOnly
          color="primary"
          className="min-h-[48px] aspect-square min-w-[48px] rounded-small"
          onPress={medicationFormModal.onOpen}
        >
          <PrescriptionBottlePillIcon height={24} width={24} />
        </Button>
      </Tooltip>
    </div>
  );
};

export default MedicationSelector;
