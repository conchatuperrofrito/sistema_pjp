import { FC, useEffect, useMemo, useState, Dispatch, SetStateAction } from "react";
import { Key } from "@react-types/shared";
import { ClinicalExamForm as ClinicalExamFormData } from "@/types/appointmentInterfaces";
import { zodResolver } from "@hookform/resolvers/zod";
import { clinicalExamSchema } from "@/validators/validationSchemas";
import useSaveMutation from "@/hooks/useSaveMutation";
import { saveAppointment } from "@/services/appointmentService";
import { useForm, Controller } from "react-hook-form";
import { CustomInput } from "@/components/CustomInput";
import { useAppointmentStore } from "@/store/appointmentStore";
import { Accordion, AccordionItem, Tab, Tabs } from "@heroui/react";
import {
  HeadSideMedicalIcon,
  LungsIcon,
  HeartIcon,
  BrainIcon,
  ClipboardCheckIcon
} from "@/assets/icons";
import clsx from "clsx";

interface ClinicalExamFormProps {
  setFormModalConfig: Dispatch<SetStateAction<FormModalConfig>>;
  onSuccess: () => void;
  isMobile: boolean;
}

const ClinicalExamForm: FC<ClinicalExamFormProps> = ({
  setFormModalConfig,
  onSuccess,
  isMobile
}) => {
  const {
    appointmentId,
    setSelectedForm,
    clinicalExamForm,
    setClinicalExamForm,
    appointmentForm,
    appointmentStatus,
    basicPatientInfo
  } = useAppointmentStore((state) => state);

  const [selectedTab, setSelectedTab] = useState<Key>("physicalExam");

  const initialDefaultValues = useMemo(
    (): ClinicalExamFormData => ({
      generalExam: "",
      physicalExam: {
        respiratoryRate: "",
        heartRate: "",
        temperature: "",
        bloodPressure: "",
        height: "",
        weight: "",
        bodyMassIndex: ""
      },
      regionalExam: {
        regionalExam: "",
        skin: "",
        eyes: "",
        ears: "",
        nose: "",
        mouth: "",
        throat: "",
        teeth: "",
        neck: "",
        thorax: "",
        lungs: "",
        heart: "",
        breasts: "",
        abdomen: "",
        urinary: "",
        lymphatic: "",
        vascular: "",
        locomotor: "",
        extremities: "",
        obituaries: "",
        higherFunctions: "",
        lowerFunctions: "",
        rectal: "",
        gynecological: ""
      }
    }),
    []
  );

  const { handleSubmit, control, reset, watch, formState: { errors } } =
        useForm<ClinicalExamFormData>({
          resolver: zodResolver(clinicalExamSchema),
          defaultValues: initialDefaultValues,
          mode: "onChange"
        });

  const { save, isPending } = useSaveMutation({
    mutationFn: saveAppointment,
    onSuccess,
    loadingMessage: appointmentId ? "Actualizando cita..." : "Registrando cita...",
    queryKeys: ["appointments"]
  });

  useEffect(() => {
    reset(clinicalExamForm);
  }, []);

  useEffect(() => {
    const errorKeys = Object.keys(errors);

    if (errorKeys.length === 1 && errorKeys.includes("generalExam")) {
      setSelectedTab("specializedExam");
    }
  }, [errors]);

  const onSubmit = (data: ClinicalExamFormData) => {
    const appointmentData = {
      id: ["Pendiente", "Programada", "Cancelada"].includes(appointmentStatus) ? appointmentId : undefined,
      appointment: { ...appointmentForm, status: appointmentStatus },
      clinicalExam: data
    };

    save(appointmentData);
  };

  useEffect(() => {
    if (watch("physicalExam.height") && watch("physicalExam.weight")) {
      const bmi = (
        Number(watch("physicalExam.weight")) /
                (Number(watch("physicalExam.height")) / 100) ** 2
      ).toFixed(2);
      reset({
        ...watch(),
        physicalExam: {
          ...watch("physicalExam"),
          bodyMassIndex: bmi
        }
      });
    }
  }, [watch("physicalExam.height"), watch("physicalExam.weight")]);

  useEffect(() => {
    setFormModalConfig((prev) => ({
      ...prev,
      title: appointmentId ? "Editar Examen Clínico" : "Registrar Examen Clínico",
      customSaveButton: undefined,
      onSubmit: handleSubmit(onSubmit),
      customCloseButton: {
        show: true,
        onClick: () => {
          setClinicalExamForm(structuredClone(watch()));
          setSelectedForm("appointment-form");
        },
        content: "Atrás",
        endContent: <></>,
        startContent: <span style={{ fontSize: "16px" }}> {"<-"} </span>
      },
      isSaving: isPending
    }));
  }, [
    appointmentId,
    isPending,
    handleSubmit,
    setFormModalConfig,
    setClinicalExamForm,
    appointmentStatus,
    selectedTab
  ]);

  return (
    <>
      <Tabs
        aria-label="Examen Clínico"
        selectedKey={selectedTab}
        onSelectionChange={setSelectedTab}
        destroyInactiveTabPanel={false}
        className="pb-3"
      >
        <Tab title="Examen Físico" key="physicalExam" />
        <Tab
          title={isMobile ? "Examenes Regionales" : "Examenes Regionales y Especializados"}
          key="specializedExam"
        />
      </Tabs>

      <div
        className={clsx("h-auto md:h-[272px]", {
          "md:scroll-outside-container md:!h-[340px]": selectedTab === "specializedExam"
        })}
      >
        <div className="grid grid-cols-3 md:grid-cols-[260px_140px_1fr_1fr] grid-rows-auto gap-x-3">
          <CustomInput
            label="Paciente"
            variant="flat"
            size="sm"
            value={basicPatientInfo?.fullName}
            isInvalid={false}
            errorMessage=""
            onChange={() => {}}
            onBlur={() => {}}
            isDisabled
            readonly
            className="col-span-3 md:col-span-1"
          />

          <CustomInput
            label={isMobile ? "Documento" : "N° de Documento"}
            variant="flat"
            size="sm"
            value={basicPatientInfo?.documentNumber}
            isInvalid={false}
            errorMessage=""
            onChange={() => {}}
            onBlur={() => {}}
            isDisabled
            readonly
          />

          <CustomInput
            label="Edad"
            variant="flat"
            size="sm"
            value={basicPatientInfo?.age}
            isInvalid={false}
            errorMessage=""
            onChange={() => {}}
            onBlur={() => {}}
            isDisabled
            readonly
          />

          <CustomInput
            label="Sexo"
            variant="flat"
            size="sm"
            value={basicPatientInfo?.sex}
            isInvalid={false}
            errorMessage=""
            onChange={() => {}}
            onBlur={() => {}}
            isDisabled
            readonly
          />
        </div>

        { selectedTab === "physicalExam" && (
          <>
            <div className="grid grid-cols-[1fr_1fr] grid-rows-auto gap-x-3">
              <Controller
                name="physicalExam.respiratoryRate"
                control={control}
                render={({ field, fieldState }) => (
                  <CustomInput
                    label={isMobile ? "Frec. Respiratoria" : "Frecuencia respiratoria"}
                    placeholder="Entre 12 y 20"
                    variant="flat"
                    isInvalid={!!fieldState.error}
                    errorMessage={fieldState.error?.message}
                    size="sm"
                    autoComplete="off"
                    {...field}
                    isDisabled={isPending}
                    isRequired
                    startContent={
                      <span className="text-gray-500 text-[0.8rem]">
                            FR:
                      </span>
                    }
                    endContent={
                      <span className="text-gray-500 text-[0.8rem]">
                            rpm
                      </span>
                    }
                  />
                )}
              />

              <Controller
                name="physicalExam.heartRate"
                control={control}
                render={({ field, fieldState }) => (
                  <CustomInput
                    label={isMobile ? "Frec. Cardíaca" : "Frecuencia cardíaca"}
                    placeholder="Entre 60 y 100"
                    variant="flat"
                    isInvalid={!!fieldState.error}
                    errorMessage={fieldState.error?.message}
                    size="sm"
                    autoComplete="off"
                    {...field}
                    isDisabled={isPending}
                    isRequired
                    startContent={
                      <span className="text-gray-500 text-[0.8rem]">
                            FC:
                      </span>
                    }
                    endContent={
                      <span className="text-gray-500 text-[0.8rem]">
                            lpm
                      </span>
                    }
                  />
                )}
              />

              <Controller
                name="physicalExam.temperature"
                control={control}
                render={({ field, fieldState }) => (
                  <CustomInput
                    label="Temperatura"
                    placeholder="Ej. 37.5"
                    variant="flat"
                    isInvalid={!!fieldState.error}
                    errorMessage={fieldState.error?.message}
                    size="sm"
                    autoComplete="off"
                    {...field}
                    isDisabled={isPending}
                    isRequired
                    startContent={
                      <span className="text-gray-500 text-[0.8rem]">
                            T°:
                      </span>
                    }
                    endContent={
                      <span className="text-gray-500 text-[0.8rem]">
                            °C
                      </span>
                    }
                  />
                )}
              />

              <Controller
                name="physicalExam.bloodPressure"
                control={control}
                render={({ field, fieldState }) => (
                  <CustomInput
                    label="Presión arterial"
                    placeholder="Ej. 120/80"
                    variant="flat"
                    isInvalid={!!fieldState.error}
                    errorMessage={fieldState.error?.message}
                    size="sm"
                    autoComplete="off"
                    {...field}
                    isDisabled={isPending}
                    isRequired
                    startContent={
                      <span className="text-gray-500 text-[0.8rem]">
                            PA:
                      </span>
                    }
                    endContent={
                      <span className="text-gray-500 text-[0.8rem]">
                            mmHg
                      </span>
                    }
                  />
                )}
              />
            </div>

            <div className="grid grid-cols-[1fr_1fr_1fr] grid-rows-auto gap-x-3">
              <Controller
                name="physicalExam.height"
                control={control}
                render={({ field, fieldState }) => (
                  <CustomInput
                    label="Talla"
                    placeholder="Ej. 170"
                    variant="flat"
                    isInvalid={!!fieldState.error}
                    errorMessage={fieldState.error?.message}
                    size="sm"
                    autoComplete="off"
                    {...field}
                    isDisabled={isPending}
                    endContent={
                      <span className="text-gray-500 text-[0.8rem]">
                            cm
                      </span>
                    }
                  />
                )}
              />

              <Controller
                name="physicalExam.weight"
                control={control}
                render={({ field, fieldState }) => (
                  <CustomInput
                    label="Peso"
                    placeholder="Ej. 70"
                    variant="flat"
                    isInvalid={!!fieldState.error}
                    errorMessage={fieldState.error?.message}
                    size="sm"
                    autoComplete="off"
                    {...field}
                    isDisabled={isPending}
                    endContent={
                      <span className="text-gray-500 text-[0.8rem]">
                            kg
                      </span>
                    }
                  />
                )}
              />

              <Controller
                name="physicalExam.bodyMassIndex"
                control={control}
                render={({ field, fieldState }) => (
                  <CustomInput
                    label="IMC"
                    placeholder=""
                    variant="flat"
                    isInvalid={!!fieldState.error}
                    errorMessage={fieldState.error?.message}
                    size="sm"
                    autoComplete="off"
                    {...field}
                    isDisabled
                  />
                )}
              />
            </div>
          </>
        )}

        { selectedTab === "specializedExam" && (
          <div className="grid gap-x-3">
            <Controller
              name="generalExam"
              control={control}
              render={({ field, fieldState }) => (
                <CustomInput
                  label="Examen general"
                  placeholder="Ejm: Paciente en buen estado general, hidratado, afebril"
                  variant="flat"
                  isInvalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                  size="sm"
                  autoComplete="off"
                  {...field}
                  isDisabled={isPending}
                  isRequired
                />
              )}
            />

            <Controller
              name="regionalExam.regionalExam"
              control={control}
              render={({ field, fieldState }) => (
                <CustomInput
                  label="Examen regional"
                  placeholder="Ejm: Cabeza: normocéfalo, cabello bien distribuido"
                  variant="flat"
                  isInvalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                  size="sm"
                  autoComplete="off"
                  {...field}
                  isDisabled={isPending}
                />
              )}
            />

            <Accordion
              className="p-0"
            >
              <AccordionItem
                classNames={{
                  trigger: "pt-0"
                }}
                startContent={<HeadSideMedicalIcon />}
                title="Región de Cabeza y Cuello">
                <Controller
                  name="regionalExam.skin"
                  control={control}
                  render={({ field, fieldState }) => (
                    <CustomInput
                      label="Piel"
                      placeholder="Ejm: Integros, sin lesiones, sin edema"
                      variant="flat"
                      isInvalid={!!fieldState.error}
                      errorMessage={fieldState.error?.message}
                      size="sm"
                      autoComplete="off"
                      {...field}
                      isDisabled={isPending}
                    />
                  )}
                />

                <Controller
                  name="regionalExam.eyes"
                  control={control}
                  render={({ field, fieldState }) => (
                    <CustomInput
                      label="Ojos"
                      placeholder="Ejm: Conjuntivas rosadas, escleras blancas, pupilas isocóricas"
                      variant="flat"
                      isInvalid={!!fieldState.error}
                      errorMessage={fieldState.error?.message}
                      size="sm"
                      autoComplete="off"
                      {...field}
                      isDisabled={isPending}
                    />
                  )}
                />

                <Controller
                  name="regionalExam.ears"
                  control={control}
                  render={({ field, fieldState }) => (
                    <CustomInput
                      label="Oídos"
                      placeholder="Ejm: Sin secreciones, sin lesiones, sin edema"
                      variant="flat"
                      isInvalid={!!fieldState.error}
                      errorMessage={fieldState.error?.message}
                      size="sm"
                      autoComplete="off"
                      {...field}
                      isDisabled={isPending}
                    />
                  )}
                />

                <Controller
                  name="regionalExam.nose"
                  control={control}
                  render={({ field, fieldState }) => (
                    <CustomInput
                      label="Nariz"
                      placeholder="Ejm: Sin secreciones, sin lesiones"
                      variant="flat"
                      isInvalid={!!fieldState.error}
                      errorMessage={fieldState.error?.message}
                      size="sm"
                      autoComplete="off"
                      {...field}
                      isDisabled={isPending}
                    />
                  )}
                />

                <Controller
                  name="regionalExam.mouth"
                  control={control}
                  render={({ field, fieldState }) => (
                    <CustomInput
                      label="Boca"
                      placeholder="Ejm: Mucosas húmedas, sin lesiones"
                      variant="flat"
                      isInvalid={!!fieldState.error}
                      errorMessage={fieldState.error?.message}
                      size="sm"
                      autoComplete="off"
                      {...field}
                      isDisabled={isPending}
                    />
                  )}
                />

                <Controller
                  name="regionalExam.throat"
                  control={control}
                  render={({ field, fieldState }) => (
                    <CustomInput
                      label="Garganta"
                      placeholder="Ejm: Sin hiperemia, sin exudados"
                      variant="flat"
                      isInvalid={!!fieldState.error}
                      errorMessage={fieldState.error?.message}
                      size="sm"
                      autoComplete="off"
                      {...field}
                      isDisabled={isPending}
                    />
                  )}
                />

                <Controller
                  name="regionalExam.teeth"
                  control={control}
                  render={({ field, fieldState }) => (
                    <CustomInput
                      label="Dientes"
                      placeholder="Ejm: Sin caries, alineados"
                      variant="flat"
                      isInvalid={!!fieldState.error}
                      errorMessage={fieldState.error?.message}
                      size="sm"
                      autoComplete="off"
                      {...field}
                      isDisabled={isPending}
                    />
                  )}
                />

                <Controller
                  name="regionalExam.neck"
                  control={control}
                  render={({ field, fieldState }) => (
                    <CustomInput
                      label="Cuello"
                      placeholder="Ejm: Sin adenopatías, sin masas"
                      variant="flat"
                      isInvalid={!!fieldState.error}
                      errorMessage={fieldState.error?.message}
                      size="sm"
                      autoComplete="off"
                      {...field}
                      isDisabled={isPending}
                    />
                  )}
                />
              </AccordionItem>

              <AccordionItem
                startContent={<LungsIcon />}
                title="Región de Torácica y Abdominal">
                <Controller
                  name="regionalExam.thorax"
                  control={control}
                  render={({ field, fieldState }) => (
                    <CustomInput
                      label="Tórax"
                      placeholder="Ejm: Simétrico, sin deformidades"
                      variant="flat"
                      isInvalid={!!fieldState.error}
                      errorMessage={fieldState.error?.message}
                      size="sm"
                      autoComplete="off"
                      {...field}
                      isDisabled={isPending}
                    />
                  )}
                />

                <Controller
                  name="regionalExam.lungs"
                  control={control}
                  render={({ field, fieldState }) => (
                    <CustomInput
                      label="Pulmones"
                      placeholder="Ejm: Murmullo vesicular presente, sin ruidos agregados"
                      variant="flat"
                      isInvalid={!!fieldState.error}
                      errorMessage={fieldState.error?.message}
                      size="sm"
                      autoComplete="off"
                      {...field}
                      isDisabled={isPending}
                    />
                  )}
                />

                <Controller
                  name="regionalExam.heart"
                  control={control}
                  render={({ field, fieldState }) => (
                    <CustomInput
                      label="Corazón"
                      placeholder="Ejm: Ruidos cardíacos rítmicos, sin soplos"
                      variant="flat"
                      isInvalid={!!fieldState.error}
                      errorMessage={fieldState.error?.message}
                      size="sm"
                      autoComplete="off"
                      {...field}
                      isDisabled={isPending}
                    />
                  )}
                />

                <Controller
                  name="regionalExam.breasts"
                  control={control}
                  render={({ field, fieldState }) => (
                    <CustomInput
                      label="Mamas"
                      placeholder="Ejm: Sin masas, sin secreciones"
                      variant="flat"
                      isInvalid={!!fieldState.error}
                      errorMessage={fieldState.error?.message}
                      size="sm"
                      autoComplete="off"
                      {...field}
                      isDisabled={isPending}
                    />
                  )}
                />

                <Controller
                  name="regionalExam.abdomen"
                  control={control}
                  render={({ field, fieldState }) => (
                    <CustomInput
                      label="Abdomen"
                      placeholder="Ejm: Blando, depresible, sin dolor a la palpación"
                      variant="flat"
                      isInvalid={!!fieldState.error}
                      errorMessage={fieldState.error?.message}
                      size="sm"
                      autoComplete="off"
                      {...field}
                      isDisabled={isPending}
                    />
                  )}
                />

                <Controller
                  name="regionalExam.urinary"
                  control={control}
                  render={({ field, fieldState }) => (
                    <CustomInput
                      label="Urinario"
                      placeholder="Ejm: Sin dolor, sin disuria"
                      variant="flat"
                      isInvalid={!!fieldState.error}
                      errorMessage={fieldState.error?.message}
                      size="sm"
                      autoComplete="off"
                      {...field}
                      isDisabled={isPending}
                    />
                  )}
                />
              </AccordionItem>

              <AccordionItem
                startContent={<HeartIcon />}
                title="Sistema Vascular y Locomotor">
                <Controller
                  name="regionalExam.lymphatic"
                  control={control}
                  render={({ field, fieldState }) => (
                    <CustomInput
                      label="Linfáticos"
                      placeholder="Ejm: Sin adenopatías palpables"
                      variant="flat"
                      isInvalid={!!fieldState.error}
                      errorMessage={fieldState.error?.message}
                      size="sm"
                      autoComplete="off"
                      {...field}
                      isDisabled={isPending}
                    />
                  )}
                />

                <Controller
                  name="regionalExam.vascular"
                  control={control}
                  render={({ field, fieldState }) => (
                    <CustomInput
                      label="Vasos"
                      placeholder="Ejm: Pulsos periféricos presentes"
                      variant="flat"
                      isInvalid={!!fieldState.error}
                      errorMessage={fieldState.error?.message}
                      size="sm"
                      autoComplete="off"
                      {...field}
                      isDisabled={isPending}
                    />
                  )}
                />

                <Controller
                  name="regionalExam.locomotor"
                  control={control}
                  render={({ field, fieldState }) => (
                    <CustomInput
                      label="Locomotor"
                      placeholder="Ejm: Sin limitaciones, sin dolor"
                      variant="flat"
                      isInvalid={!!fieldState.error}
                      errorMessage={fieldState.error?.message}
                      size="sm"
                      autoComplete="off"
                      {...field}
                      isDisabled={isPending}
                    />
                  )}
                />

                <Controller
                  name="regionalExam.extremities"
                  control={control}
                  render={({ field, fieldState }) => (
                    <CustomInput
                      label="Extremidades"
                      placeholder="Ejm: Sin edemas, sin deformidades"
                      variant="flat"
                      isInvalid={!!fieldState.error}
                      errorMessage={fieldState.error?.message}
                      size="sm"
                      autoComplete="off"
                      {...field}
                      isDisabled={isPending}
                    />
                  )}
                />
              </AccordionItem>

              <AccordionItem
                startContent={<BrainIcon />}
                title="Sistema Neurológico">

                <Controller
                  name="regionalExam.higherFunctions"
                  control={control}
                  render={({ field, fieldState }) => (
                    <CustomInput
                      label="Funciones superiores"
                      placeholder="Ejm: Conservado"
                      variant="flat"
                      isInvalid={!!fieldState.error}
                      errorMessage={fieldState.error?.message}
                      size="sm"
                      autoComplete="off"
                      {...field}
                      isDisabled={isPending}
                    />
                  )}
                />

                <Controller
                  name="regionalExam.lowerFunctions"
                  control={control}
                  render={({ field, fieldState }) => (
                    <CustomInput
                      label="Funciones inferiores"
                      placeholder="Ejm: Conservado"
                      variant="flat"
                      isInvalid={!!fieldState.error}
                      errorMessage={fieldState.error?.message}
                      size="sm"
                      autoComplete="off"
                      {...field}
                      isDisabled={isPending}
                    />
                  )}
                />

              </AccordionItem>

              <AccordionItem
                startContent={<ClipboardCheckIcon />}
                title="Examen Especializado"
              >
                <Controller
                  name="regionalExam.obituaries"
                  control={control}
                  render={({ field, fieldState }) => (
                    <CustomInput
                      label="Necrologicos"
                      placeholder="Ejm: Sin alteraciones"
                      variant="flat"
                      isInvalid={!!fieldState.error}
                      errorMessage={fieldState.error?.message}
                      size="sm"
                      autoComplete="off"
                      {...field}
                      isDisabled={isPending}
                    />
                  )}
                />

                <Controller
                  name="regionalExam.rectal"
                  control={control}
                  render={({ field, fieldState }) => (
                    <CustomInput
                      label="Rectal"
                      placeholder="Ejm: Sin masas, sin dolor"
                      variant="flat"
                      isInvalid={!!fieldState.error}
                      errorMessage={fieldState.error?.message}
                      size="sm"
                      autoComplete="off"
                      {...field}
                      isDisabled={isPending}
                    />
                  )}
                />

                <Controller
                  name="regionalExam.gynecological"
                  control={control}
                  render={({ field, fieldState }) => (
                    <CustomInput
                      label="Ginecológico"
                      placeholder="Ejm: Sin lesiones, sin secreciones"
                      variant="flat"
                      isInvalid={!!fieldState.error}
                      errorMessage={fieldState.error?.message}
                      size="sm"
                      autoComplete="off"
                      {...field}
                      isDisabled={isPending}
                    />
                  )}
                />
              </AccordionItem>
            </Accordion>
          </div>
        )}
      </div>
    </>
  );
};

export default ClinicalExamForm;
