import { Key } from "react";
import { useCallback } from "react";
import { useAppointmentStore } from "@/store/appointmentStore";
import { PrescriptionMedicationFormData } from "@/types/doctorInterfaces";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  NumberInput,
  Select,
  SelectItem,
  Input
} from "@heroui/react";
import MedicationSelector from "./MedicationSelector";
import { Tooltip } from "@heroui/react";
import { TrashSolidIcon } from "@/assets/icons";

const COLUMNS: TableColumnDefinition<PrescriptionMedicationFormData>[] = [
  {
    key: "genericName",
    label: "Nombre y concentración"
  },
  {
    key: "dosageForm",
    label: "UM"
  },
  {
    key: "frequency",
    label: "Frecuencia",
    width: 136
  },
  {
    key: "duration",
    label: "Días",
    width: 50
  },
  {
    key: "instructions",
    label: "Instrucciones"
  },
  {
    key: "actions",
    label: "Acc",
    width: 40
  }
];

const MedicationTable = () => {
  const { prescriptionFormData, setPrescriptionFormData } = useAppointmentStore();

  const handleRemoveMedication = useCallback(
    (medicationId: string) => {
      const row = document.querySelector(`tr[data-key="${medicationId}"]`);
      if (!row) return;
      row.classList.add("row-removing");
      setTimeout(() => {
        setPrescriptionFormData({
          ...prescriptionFormData,
          medications: prescriptionFormData.medications.filter(
            (item) => item.id !== medicationId
          )
        });
      }, 200);
    },
    [prescriptionFormData, setPrescriptionFormData]
  );

  const handleChangeField = useCallback(
    (value: string, key: keyof PrescriptionMedicationFormData, medicationId: string) => {
      setPrescriptionFormData({
        ...prescriptionFormData,
        medications: prescriptionFormData.medications.map((item) =>
          item.id === medicationId ? { ...item, [key]: value } : item
        )
      });
    }, [prescriptionFormData, setPrescriptionFormData]
  );

  const getMedicationValue = useCallback(
    (medicationId: string, key: keyof PrescriptionMedicationFormData) =>
      prescriptionFormData.medications.find(
        (item) => item.id === medicationId
      )?.[key] || undefined,
    [prescriptionFormData]
  );

  const renderMedicationCell = useCallback((medication: PrescriptionMedicationFormData, columnKey: Key) => {
    if (columnKey === "actions") {
      return (
        <Button
          isIconOnly
          size="sm"
          color="danger"
          onPress={() => handleRemoveMedication(medication.id)}
        >
          <TrashSolidIcon />
        </Button>
      );
    }

    const key = columnKey as keyof PrescriptionMedicationFormData;
    const cellValue = medication[key];

    const selectOptions: Record<string, Option[]> = {
      frequency: [
        { label: "Cada 4 horas", value: "4" },
        { label: "Cada 6 horas", value: "6" },
        { label: "Cada 8 horas", value: "8" },
        { label: "Cada 12 horas", value: "12" },
        { label: "Cada 24 horas", value: "24" }
      ]
    };

    if (key in selectOptions) {
      return (
        <Select
          items={selectOptions[key]}
          size="sm"
          aria-label={`Seleccionar ${key}`}
          placeholder="Seleccionar"
          onChange={(e) => handleChangeField(e.target.value, key, medication.id)}
          selectedKeys={[getMedicationValue(medication.id, key) || ""]}
          popoverProps={{
            placement: "bottom"
          }}
          classNames={{
            listbox: "p-0",
            helperWrapper: "!hidden"
          }}
          validationBehavior="native"
          isRequired
        >
          {(option) => (
            <SelectItem key={option.value} className="px-1 py-[4px]">
              {option.label}
            </SelectItem>
          )}
        </Select>
      );
    }

    if (key === "genericName") {
      return <div className="">
        {cellValue} {medication.concentration}
        {medication.presentation && (
          <span className="text-gray-500 ml-1">
            ({medication.presentation})
          </span>
        )}
      </div>;
    }

    if (key === "dosageForm") {
      return (
        cellValue ? (
          <Tooltip content={medication.dosageDescription} placement="top">
            <div className="cursor-help">{cellValue }</div>
          </Tooltip>
        ) : (
          <div className="text-gray-500">No especificado</div>
        )
      );
    }

    if (key === "duration") {
      return (
        <NumberInput
          size="sm"
          hideStepper
          aria-label="Duración en días"
          isRequired
          validationBehavior="native"
          minValue={1}
          classNames={{
            helperWrapper: "!hidden",
            inputWrapper: "h-[32px]"
          }}
          value={Number(getMedicationValue(medication.id, key ))}
          onChange={(e) =>
            handleChangeField(Math.trunc(Number(e)).toString(), key, medication.id)
          }
        />
      );
    }

    if (key === "instructions") {
      return (
        <Input
          aria-label="Instrucciones"
          size="sm"
          classNames={{
            inputWrapper: "h-[32px]"
          }}
          value={getMedicationValue(medication.id, key) || ""}
          onChange={(e) => handleChangeField(e.target.value, key, medication.id)}
        />
      );
    }

    return cellValue;
  }, [handleRemoveMedication, handleChangeField]);


  return (
    <Table
      isHeaderSticky
      aria-label="medication-table"
      topContentPlacement="outside"
      classNames={{
        emptyWrapper: "h-[48px]",
        base: "gap-0",
        wrapper: "p-0 rounded-none shadow-none max-h-[288px]"
      }}
      maxTableHeight={240}
      topContent={ <MedicationSelector />}
      isKeyboardNavigationDisabled
      className="mb-2"
    >
      <TableHeader columns={COLUMNS}>
        {(column) => (
          <TableColumn
            key={column.key}
            width={column.width}
            maxWidth={column.maxWidth}
            style={{
              minWidth: column.width
            }}
            className="text-tiny"
          >
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        items={prescriptionFormData.medications}
        emptyContent="No se han agregado medicamentos. Utilice el buscador para registrar medicamentos."
        aria-label="Lista de medicamentos"
      >
        {(medication) => (
          <TableRow key={medication.id}>
            {(columnKey) => (
              <TableCell className="pl-2 pr-0">
                {renderMedicationCell(medication, columnKey)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default MedicationTable;
