import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from "@heroui/react";
import { OdontogramData } from "@/types/doctorInterfaces";
import { toothParts } from "./data";
import { PART_STATUS_OPTIONS } from "./data";
import { ArrowUpSolidIcon, CircleRegularIcon, MinusSolidIcon, XmarkSolidIcon } from "@/assets/icons";

const TOOTH_STATUS_OPTIONS = [
  {
    status: "Removido",
    icon: <XmarkSolidIcon style={{ color: "#dc2626" }} />
  },
  {
    status: "Corona",
    icon: <CircleRegularIcon style={{ color: "#16a34a" }} />
  },
  {
    status: "Puente",
    icon: <MinusSolidIcon style={{ color: "#dc2626" }} />
  },
  {
    status: "Implante",
    icon: <ArrowUpSolidIcon style={{ color: "#2563eb" }} />
  },
  {
    status: "Endodoncia",
    icon: <CircleRegularIcon style={{ color: "#7c3aed" }} />
  },
  {
    status: "Restauración temporal",
    icon: <CircleRegularIcon style={{ color: "#d97706" }} />
  }
];

interface StatusPoperProps {
    children: React.ReactNode;
    toothData: {
        number: number;
        quadrant: number;
        type: string;
        status: string;
        position: string;
        part?: {
            key: "oclusal" | "distal" | "palatina" | "mesial" | "vestibular",
            name: string;
            status: string;
        };
    };
    teethIndex: number;
    toothIndex: number;
    setOdontogramData: React.Dispatch<React.SetStateAction<OdontogramData>>;
}

const StatusPoper: React.FC<StatusPoperProps> = ({ children, toothData, teethIndex, toothIndex, setOdontogramData }) =>
{
  const handleChangeStatusPart = (
    teeth: number,
    tooth: number,
    part: "oclusal" | "distal" | "palatina" | "mesial" | "vestibular",
    status: string
  ) =>
    setOdontogramData((prev) => {
      const newOdontogram = [...prev];
      newOdontogram[teeth][tooth].parts[part].status = status;
      return newOdontogram;
    }
    );


  const handleChangeStatusTooth = (teeth: number, tooth: number, status: string) =>
    setOdontogramData((prev) => {
      const newOdontogram = [...prev];
      newOdontogram[teeth][tooth].status = status;
      newOdontogram[teeth][tooth].parts = toothParts();
      return newOdontogram;
    });


  return <Popover
    placement="bottom"
    showArrow
    offset={-5}
    classNames={{
      trigger: toothData.part ? "aria-expanded:bg-[#dedede] aria-expanded:opacity-1" : ""
    }}
    backdrop="opaque"
  >
    <PopoverTrigger>{children}</PopoverTrigger>
    <PopoverContent>
      <div className="py-1 w-[150px]">
        <div className="flex flex-col space-y-1">
          <div className="flex justify-between border-b pb-2">
            <span className="text-sm font-medium text-white">
                        Diente:
            </span>
            <span className="text-sm">{toothData.number}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-sm font-medium text-white">
                        Cuadrante:
            </span>
            <span className="text-sm">{toothData.quadrant}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-sm font-medium text-white">
                        Tipo:
            </span>
            <span className="text-sm">{toothData.position}</span>
          </div>
          {
            !toothData.part &&
            <div className={"flex justify-between" + ((toothData.part && !toothData.status ) ? " pb-2 border-b" : "")}>
              <span className="text-sm font-medium text-white">
                        Estado:
              </span>

              <Dropdown className="min-w-0 w-fit p-0">
                <DropdownTrigger>
                  <span className="trigger-selection">
                    {toothData.status ?
                      <>
                        {toothData.status}
                        <div className="clear-selection"
                          onClick={() => handleChangeStatusTooth(teethIndex, toothIndex, "")}
                        >
                          <XmarkSolidIcon />
                        </div>
                      </>
                      : "Seleccione"}
                  </span>
                </DropdownTrigger>
                <DropdownMenu
                  className="p-0"
                  aria-label="Single selection example"
                  variant="flat"
                  disallowEmptySelection
                  selectionMode="single"
                  hideSelectedIcon
                  onSelectionChange={(value) =>
                    value.currentKey && handleChangeStatusTooth(
                      teethIndex,
                      toothIndex,
                      value.currentKey
                    )
                  }
                >
                  {TOOTH_STATUS_OPTIONS.map((option) => (
                    <DropdownItem
                      endContent={
                        option.icon
                      }
                      key={option.status}
                    >
                      {option.status}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </div>
          }

          {
            (toothData.part && !toothData.status ) &&
                <>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-sm font-medium text-white">
                        Parte:
                    </span>
                    <span className="text-sm">{toothData.part.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-white whitespace-nowrap mr-1">
                        Estado Parte:
                    </span>
                    <Dropdown className="min-w-0 w-fit p-0">
                      <DropdownTrigger>
                        <span className="trigger-selection">
                          {toothData.part.status ?
                            <>
                              {toothData.part.status}
                              <div className="clear-selection"
                                onClick={() => toothData.part && handleChangeStatusPart(teethIndex, toothIndex, toothData.part.key, "")}
                              >
                                <XmarkSolidIcon />
                              </div>
                            </>
                            : "Seleccione"}
                        </span>
                      </DropdownTrigger>
                      <DropdownMenu
                        className="p-0"
                        aria-label="Single selection example"
                        variant="flat"
                        disallowEmptySelection
                        selectionMode="single"
                        hideSelectedIcon
                        onSelectionChange={(value) =>
                          value.currentKey && toothData.part && handleChangeStatusPart(
                            teethIndex,
                            toothIndex,
                            toothData.part.key,
                            value.currentKey
                          )
                        }
                      >
                        {PART_STATUS_OPTIONS.map((option) => (
                          <DropdownItem
                            endContent={
                              <div
                                style={{ backgroundColor: option.color }}
                                className={`w-[10px] h-[10px] rounded-full bg-[${option.color}] mr-2`}
                              ></div>
                            }
                            key={option.status}
                          >
                            {option.status}
                          </DropdownItem>
                        ))}
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </>
          }
        </div>
      </div>
    </PopoverContent>
  </Popover>;};

export default StatusPoper;

