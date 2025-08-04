import { FC, useState, useEffect, useRef, useMemo } from "react";
import { FormModal } from "@/components/FormModal";
import Odontogram from "@/components/Odontogram";
import { odontogram } from "@/components/Odontogram/data";
import { useAppointmentStore } from "@/store/appointmentStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getDentalEvolution } from "@/services/doctorService";
import { parseDate } from "@internationalized/date";
import { Spinner } from "@heroui/react";

interface OdontogramModalProps extends FormModalProps {
  openEvolutionForm: () => void;
}

const OdontogramModal: FC<OdontogramModalProps> = ({
  isOpen,
  onOpenChange,
  openEvolutionForm
}) => {
  const queryClient = useQueryClient();
  const {
    dentalEvolutionForm,
    setDentalEvolutionForm,
    appointmentId,
    resetForm,
    appointmentStatus
  } = useAppointmentStore((state) => state);

  const [odontogramData, setOdontogramData] = useState(odontogram());

  const odontogramRef = useRef<HTMLDivElement>(null);

  const dentalEvolutionQuery = useQuery({
    queryKey: ["dentalEvolution"],
    queryFn: () => getDentalEvolution(appointmentId),
    enabled: false,
    retry: false
  });

  const handleSetOdontogramData = async () => {
    await Promise.resolve();
    setOdontogramData(JSON.parse(dentalEvolutionForm.odontogram));
  };

  useEffect(() => {
    if (isOpen) {
      if (dentalEvolutionForm.odontogram) {
        handleSetOdontogramData();
      } else if (appointmentStatus === "Realizada") {
        assignFormData();
      }
    } else {
      queryClient.removeQueries({ queryKey: ["dentalEvolution"] });
      setOdontogramData(odontogram());
    }
  }, [isOpen, appointmentStatus]);

  const assignFormData = () => {
    dentalEvolutionQuery.refetch().then(async (response) => {
      if (response.error) return;

      const dentalEvolution = response.data?.dentalEvolution;

      if (dentalEvolution){
        if (dentalEvolution.odontogram) {
          setOdontogramData(JSON.parse(dentalEvolution.odontogram));
        }

        setDentalEvolutionForm({
          ...dentalEvolution,
          date: parseDate(dentalEvolution.date),
          basicDentalDischarge: parseDate(dentalEvolution.basicDentalDischarge),
          odontogramHtml: captureOdontogram() ?? ""
        });
      }

    });
  };

  const saveOdontogram = () => {
    setDentalEvolutionForm({
      ...dentalEvolutionForm,
      odontogram: JSON.stringify(odontogramData),
      odontogramHtml: captureOdontogram() ?? ""
    });
    onOpenChange();
    openEvolutionForm();
  };

  const captureOdontogram = () => {
    if (!odontogramRef.current) return;

    const odontogramHTML = odontogramRef.current.innerHTML;

    const odontogramStylesheet = Array.from(document.styleSheets).find(sheet => {
      try {
        return Array.from(sheet.cssRules).some(rule =>
          rule instanceof CSSStyleRule && rule.selectorText.includes(".odontogram-legend")
        );
      } catch (e) {
        console.error("Error al acceder a las reglas CSS", e);
        return false;
      }
    });

    let styles = "";
    if (odontogramStylesheet) {
      try {
        styles = Array.from(odontogramStylesheet.cssRules)
          .map(rule => rule.cssText)
          .join("\n");
      } catch (e) {
        console.error("Error al acceder a las reglas CSS del odontograma", e);
      }
    }

    return `
      <html>
        <head>
          <title>Odontograma</title>
          <style>
          html, :host {
            line-height: 1.5;
            text-size-adjust: 100%;
            tab-size: 4;
            font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
            font-feature-settings: normal;
            font-variation-settings: normal;
            -webkit-tap-highlight-color: transparent;
          }

          *, ::before, ::after {
            box-sizing: border-box;
            border-width: 0px;
            border-style: solid;
            border-color: rgb(229, 231, 235);
          }
          ol, ul, menu {
            list-style: none;
            margin: 0px;
            padding: 0px;
          }
          
          body {
            margin: 0px;
            padding: 0px;
          }

          blockquote, dl, dd, h1, h2, h3, h4, h5, h6, hr, figure, p, pre {
              margin: 0px;
          }
          .tooth-status {
            bottom: 4px !important;
          }
          ${styles}
          </style>
        </head>
        <body>
          <div id="printable-odontogram">${odontogramHTML}</div>
        </body>
      </html>
    `;
  };

  const isLoading = useMemo(
    () => dentalEvolutionQuery.isFetching,
    [dentalEvolutionQuery.isFetching]
  );

  return (
    <FormModal
      title="Odontograma"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onSubmit={saveOdontogram}
      onModalClose={resetForm}
      size="4xl"
      isLoading={false}
      isSaving={false}
      customCloseButton={{ show: false }}
      customSaveButton={{
        show: true,
        content: "Siguiente",
        endContent: <span style={{ fontSize: "16px" }}> {"->"} </span>
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          zIndex: 1000,
          display: isLoading ? "flex" : "none",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.8)"
        }}
      >
        <Spinner size="lg" />
      </div>
      <div ref={odontogramRef}>
        <Odontogram
          odontogramData={odontogramData}
          setOdontogramData={setOdontogramData}
        />
      </div>
    </FormModal>
  );
};

export default OdontogramModal;
