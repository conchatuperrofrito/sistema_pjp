import "@/css/components/Odontogram.css";
import StatusPoper from "./StatusPoper";
import OdontogramLegend from "./OdontogramLegend";
import { OdontogramData } from "../../types/doctorInterfaces";
import { PART_STATUS_OPTIONS } from "./data";

const PARTS_POSITIONS = {
  vestibular: "top",
  palatina: "bottom",
  distal: "left",
  mesial: "right",
  oclusal: "center"
};

const TOOTH_PARTS = Object.keys(PARTS_POSITIONS) as Array<keyof typeof PARTS_POSITIONS>;

interface OdontogramProps {
  odontogramData: OdontogramData;
  setOdontogramData: React.Dispatch<React.SetStateAction<OdontogramData>>;
}

const Odontogram: React.FC<OdontogramProps> =
({
  odontogramData,
  setOdontogramData
}) =>
  (
    <div>
      {odontogramData.map((teeth, teethIndex) => (
        <div className="tootContainer" key={teethIndex}>
          {teeth.map((tooth, toothIndex) => (
            <div
              key={teethIndex + "-" + toothIndex}
              className="tootItem"
            >
              <StatusPoper
                key={"toothNumber" + teethIndex + toothIndex}
                toothData={{
                  ...tooth
                }}
                teethIndex={teethIndex}
                toothIndex={toothIndex}
                setOdontogramData={setOdontogramData}
              >
                <span className="toothNumber">{tooth.number}</span>
              </StatusPoper>

              <div className= "containTeeth">
                {
                  TOOTH_PARTS.map((part) => {
                    const partData = tooth.parts[part];
                    return (
                      <StatusPoper
                        key={part + teethIndex + toothIndex}
                        toothData={{
                          ...tooth,
                          part: { ...partData, key: part }
                        }}
                        teethIndex={teethIndex}
                        toothIndex={toothIndex}
                        setOdontogramData={setOdontogramData}
                      >
                        <div className={`tooth ${PARTS_POSITIONS[part]}`}
                          style={{ backgroundColor: PART_STATUS_OPTIONS.find((item) => item.status === partData.status)?.color }}
                        ></div>
                      </StatusPoper>
                    );
                  })
                }
              </div>
              <StatusPoper
                key={"tooth" + teethIndex + toothIndex}
                toothData={{
                  ...tooth
                }}
                teethIndex={teethIndex}
                toothIndex={toothIndex}
                setOdontogramData={setOdontogramData}
              >
                {
                  tooth.status &&
                  <div className="tooth-status cursor-pointer">
                    <div className={`tooth-icon ${tooth.status === "Corona" ? "crown" : "hidden"}`}>
                    </div>

                    <div className={`tooth-icon ${tooth.status === "Puente" ? "bridge" : "hidden"}`}>
                    </div>

                    <div className={`tooth-icon ${tooth.status === "Implante" ? "implant" : "hidden"}`}>
                      <div className="implant-arrow"></div>
                      <div className="implant-stem"></div>
                    </div>

                    <div className={`tooth-icon ${tooth.status === "Removido" ? "remove" : "hidden"}`}>
                    </div>

                    <div className={`tooth-icon ${tooth.status === "Endodoncia" ? "endodontics" : "hidden"}`}>
                      <div className="endodontics-icon"></div>
                    </div>

                    <div className={`tooth-icon ${tooth.status === "Restauración temporal" ? "temporary" : "hidden"}`}>
                      <div className="temporary-icon"></div>
                    </div>
                  </div>
                }
              </StatusPoper>
            </div>
          ))}
        </div>
      ))}

      <OdontogramLegend />
    </div>
  );

export default Odontogram;
