import { FC, ChangeEvent } from "react";

interface SelectSimpleProps {
    options: Option[];
    value?: string;
    onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
}

const SelectSimple: FC<SelectSimpleProps> = ({ options, value, onChange }) => (
  <select
    className="outline-none border-1 bg-transparent cursor-pointer rounded-[4px] p-[2px]"
    style={{
      msOverflowStyle: "none"
    }}
    value={value}
    onChange={onChange}
  >
    {options.map((option) => (
      <option
        key={option.value}
        className="bg-default-100"
        value={option.value}
      >
        {option.label}
      </option>
    ))}
  </select>
);

export default SelectSimple;
