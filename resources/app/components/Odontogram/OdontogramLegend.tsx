import { PART_STATUS_OPTIONS } from "./data";

const OdontogramLegend = () => {
  return (
    <div className="odontogram-legend">
      <div>
        <h4>Estados del Diente</h4>
        <ul>
          <li>
            <div className="crown" style={{ width: "1rem", height: "1rem" }}></div>
            <span>Corona</span>
          </li>
          <li>
            <div className="bridge" style={{ width: "1rem", height: "1rem" }}></div>
            <span>Puente</span>
          </li>
          <li>
            <div className="implant" style={{ width: "1rem", height: "1rem" }}>
              <div className="implant-arrow"></div>
              <div className="implant-stem"></div>
            </div>
            <span>Implante</span>
          </li>
          <li>
            <div className="remove" style={{ width: "1rem", height: "1rem" }}></div>
            <span>Removido</span>
          </li>
          <li>
            <div className="endodontics" style={{ width: "1rem", height: "1rem" }}></div>
            <span>Endodoncia</span>
          </li>
          <li>
            <div className="temporary" style={{ width: "1rem", height: "1rem" }}></div>
            <span>Rest. temporal</span>
          </li>
        </ul>
      </div>

      <div className="parts">
        <h4>Estados de las Partes</h4>
        <ul >
          {
            PART_STATUS_OPTIONS.map((part, index) => (
              <li key={index}>
                <span style={{ backgroundColor: part.color }}></span>
                <span>{part.status}</span>
              </li>
            ))
          }
        </ul>
      </div>
    </div>
  );
};

export default OdontogramLegend;
