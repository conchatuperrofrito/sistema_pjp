import { Key, useCallback } from "react";
import { DiagnosisCode } from "@/types/doctorInterfaces";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Select,
  SelectItem
} from "@heroui/react";
import DiagnosisCodeSelector from "./DiagnosisCodeSelector";
import { useAppointmentStore } from "@/store/appointmentStore";
import { TrashSolidIcon } from "@/assets/icons";

const COLUMNS: TableColumnDefinition<DiagnosisCode>[] = [
  {
    key: "code",
    label: "Código",
    width: 64
  },
  {
    key: "description",
    label: "Descripción Diagnóstico"
  },
  {
    key: "type",
    label: "Tipo",
    width: 115
  },
  {
    key: "case",
    label: "Caso",
    width: 132
  },
  {
    key: "dischargeFlag",
    label: "Alta?",
    width: 68
  },
  {
    key: "actions",
    label: "Acc",
    width: 47
  }
];

const DiagnosisTable = () => {
  const { setDiagnosisFormData, diagnosisFormData } = useAppointmentStore((state) => state);

  const handleRemoveDiagnosis = useCallback(
    (diagnosisId: string ) => {
      const row = document.querySelector(`tr[data-key="${diagnosisId}"]`);
      if (!row) return;
      row.classList.add("row-removing");
      setTimeout(() => {
        setDiagnosisFormData({
          ...diagnosisFormData,
          diagnosisCodes: diagnosisFormData.diagnosisCodes.filter(
            (item) => item.id !== diagnosisId
          )
        });
      }, 200);
    },
    [diagnosisFormData, setDiagnosisFormData]
  );

  const handleChangeSelect = useCallback(
    (value: string, key: keyof DiagnosisCode, diagnosisId: string ) => {
      setDiagnosisFormData({
        ...diagnosisFormData,
        diagnosisCodes: diagnosisFormData.diagnosisCodes.map((item) =>
          item.id === diagnosisId ? { ...item, [key]: value } : item
        )
      });
    },
    [diagnosisFormData, setDiagnosisFormData]
  );

  const getDiagnosisValue = useCallback(
    (diagnosisId: string, key: keyof DiagnosisCode) =>
      diagnosisFormData.diagnosisCodes.find(
        (item) => item.id === diagnosisId
      )?.[key] || "",
    [diagnosisFormData]
  );


  const renderDiagnosisCell = useCallback(
    (diagnosis: DiagnosisCode, columnKey: Key) => {
      if (columnKey === "actions") {
        return (
          <Button
            isIconOnly
            size="sm"
            color="danger"
            onPress={() => handleRemoveDiagnosis(diagnosis.id)}
          >
            <TrashSolidIcon />
          </Button>
        );
      }

      const key = columnKey as keyof DiagnosisCode;
      const cellValue = diagnosis[key];

      const selectOptions: Record<string, Option[]> = {
        type: [
          { label: "Definitivo", value: "Definitivo" },
          { label: "Presuntivo", value: "Presuntivo" },
          { label: "Provisional", value: "Provisional" }
        ],
        case: [
          { label: "Nuevo", value: "Nuevo" },
          { label: "Repetido", value: "Repetido" },
          { label: "Recidiva", value: "Recidiva" },
          { label: "Secuela", value: "Secuela" },
          { label: "Complicación", value: "Complicación" }
        ],
        dischargeFlag: [
          { label: "No", value: "No" },
          { label: "Sí", value: "Sí" }
        ]
      };

      if (key in selectOptions) {
        return (
          <Select
            items={selectOptions[key]}
            size="sm"
            aria-label={`Seleccionar ${key}`}
            placeholder="Seleccionar"
            onChange={(e) => handleChangeSelect(e.target.value, key, diagnosis.id)}
            selectedKeys={[getDiagnosisValue(diagnosis.id, key)]}
            popoverProps={{
              placement: "bottom"
            }}
            classNames={{
              listbox: "p-0"
            }}
          >
            {(option) => (
              <SelectItem key={option.value} className="px-1 py-[4px]">
                {option.label}
              </SelectItem>
            )}
          </Select>
        );
      }

      if (key === "description") {
        return <div className="text-tiny">{cellValue}</div>;
      }

      return cellValue;
    },
    [handleRemoveDiagnosis, handleChangeSelect]
  );

  return (
    <Table
      aria-label="diagnosis-table"
      topContentPlacement="outside"
      classNames={{
        emptyWrapper: "h-[48px]",
        base: "gap-0",
        wrapper: "p-0 rounded-none shadow-none max-h-[288px]"
      }}
      topContent={ <DiagnosisCodeSelector /> }
      className="mb-2"
    >
      <TableHeader columns={COLUMNS}>
        {(column) => (
          <TableColumn
            key={column.key}
            width={column.width}
            maxWidth={column.maxWidth}
            className="text-tiny"
            style={{
              minWidth: column.width
            }}
          >
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        items={diagnosisFormData.diagnosisCodes}
        emptyContent="No se han agregado diagnósticos específicos. Utilice el buscador para agregar diagnósticos CIE-10."
      >
        {(diagnosis) => (
          <TableRow key={diagnosis.id}>
            {(columnKey) => (
              <TableCell className="pl-2 pr-0">
                {renderDiagnosisCell(diagnosis, columnKey)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default DiagnosisTable;
