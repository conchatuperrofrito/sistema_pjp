import { z } from "zod";
import { DateValue, TimeInputValue } from "@heroui/react";
import { getCurrentDate } from "../utils/dateUtils";

const convertToArray = (value: unknown): string => {
  if (Array.isArray(value)) {
    return value.length === 1
      ? String(value[0])
      : value.map(String).join(", ");
  } else if (value instanceof Set) {
    const arr = Array.from(value);
    return arr.length === 1
      ? String(arr[0])
      : arr.map(String).join(", ");
  } else if (typeof value === "string") {
    return value;
  } else if (value != null) {
    return String(value);
  }
  return "";
};

export const loginSchema = z.object({
  documentNumber: z.string().min(1, "El número de documento es requerido"),
  password: z.string().min(1, "La contraseña es requerida")
});

export const userSchema = z.object({
  firstName: z.string().min(1, "El nombre es requerido"),
  lastName: z.string().min(1, "El apellido es requerido"),
  documentType: z.preprocess(
    convertToArray,
    z.string().min(1, "El tipo de documento es requerido")
  ),
  documentNumber: z
    .string()
    .min(1, "El número de documento es requerido"),
  roleId: z.preprocess(
    convertToArray,
    z.string().min(1, "El rol es requerido")
  ),
  registrationNumber: z.string().optional(),
  doctorId: z.string().optional(),
  specialtyId: z.preprocess(
    convertToArray, z.string()).optional()
});

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "La contraseña actual es requerida")
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .max(32, "La contraseña debe tener como máximo 32 caracteres"),
    newPassword: z.string().min(1, "La nueva contraseña es requerida"),
    confirmNewPassword: z
      .string()
      .min(1, "La confirmación de contraseña es requerida")
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "No conincide con la nueva contraseña",
    path: ["confirmNewPassword"]
  });

export const patientSchema = z.object({
  departmentId: z.preprocess(
    convertToArray,
    z.string()
  ),
  provinceId: z.preprocess(
    convertToArray,
    z.string()
  ),
  districtId: z.preprocess(
    convertToArray,
    z.string()
  ),
  firstName: z.string().min(1, "El nombre es requerido"),
  lastName: z.string().min(1, "El apellido es requerido"),
  documentType: z.preprocess(
    convertToArray,
    z.string().min(1, "El tipo de documento es requerido")
  ),
  documentNumber: z.string().min(1, "El número de documento es requerido"),
  birthdate: z.string().nullable(),
  sex: z.preprocess(
    convertToArray,
    z.string().min(1, "El sexo es requerido")
  ),
  address: z.string().nullable(),
  contactNumber: z.string().nullable(),
  email: z.string().nullable(),
  positionId: z.preprocess(
    convertToArray,
    z.string()
  ),
  dependenceId: z.preprocess(
    convertToArray,
    z.string()
  )
}).refine(
  (data) =>
    data.departmentId === "" ||
    (typeof data.provinceId === "string" && data.provinceId.length > 0),
  {
    path: ["provinceId"],
    message: "La provincia es requerida"
  }
).refine(
  (data) =>
    data.departmentId === "" ||
    (typeof data.districtId === "string" && data.districtId.length > 0),
  {
    path: ["districtId"],
    message: "El distrito es requerido"
  }
);

export const appointmentSchema = z.object({
  date: z.string().min(1, "La fecha es requerida")
    .refine((val) => val >= getCurrentDate(), {
      message: "No puede ingresar una fecha pasada"
    }),
  hour: z.preprocess(
    (value) => (value ? (value as TimeInputValue).toString() : ""),
    z.string().min(1, "La hora es requerida").refine((val) => {
      const [hours, minutes] = val.split(":").map(Number);
      const time = hours * 60 + minutes;
      const isValidTime =
        (time >= 8 * 60 && time <= 13 * 60) || (time >= 14 * 60 && time <= 15.5 * 60);
      return isValidTime;
    }, {
      message: "El horario de atención es de 8:00am a 1:00pm y de 2:00pm a 3:30pm"
    })
  ),
  doctorId: z.preprocess(
    convertToArray,
    z.string().min(1, "El doctor es requerido")
  ),
  patientId: z.preprocess(
    convertToArray,
    z.string().min(1, "El paciente es requerido")
  ),
  reason: z.string().min(1, "El motivo es requerido")
});

export const clinicalExamSchema = z.object({
  generalExam: z.string().min(1, "Campo requerido"),
  physicalExam: z.object({
    respiratoryRate: z
      .string()
      .min(1, "Campo requerido")
      .refine((val) => !isNaN(Number(val)) && Number(val) >= 12 && Number(val) <= 20, {
        message: "Ingrese un número entre 12 y 20"
      }),
    heartRate: z
      .string()
      .min(1, "Campo requerido")
      .refine((val) => !isNaN(Number(val)) && Number(val) >= 60 && Number(val) <= 100, {
        message: "Ingrese un número entre 60 y 100"
      }),
    temperature: z
      .string()
      .min(1, "Campo requerido")
      .refine((val) => !isNaN(Number(val)) && Number(val) >= 35 && Number(val) <= 42, {
        message: "Ingrese un número entre 35 y 42"
      }),
    bloodPressure: z
      .string()
      .min(1, "Campo requerido")
      .refine((val) => /^(\d{2,3})\/(\d{2,3})$/.test(val), {
        message: "Formato inválido. Ejemplo: 120/80"
      }),
    height: z
      .string()
      .optional()
      .refine((val) => !val || (Number.isInteger(Number(val)) && Number(val) > 0), {
        message: "Debe ser un número entero válido"
      }),
    weight: z
      .string()
      .optional()
      .refine((val) => !val || (!isNaN(Number(val)) && Number(val) > 0), {
        message: "Debe ser un número válido"
      }),
    bodyMassIndex: z
      .string()
      .optional()
      .refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 0), {
        message: "Debe ser un número válido"
      })
  }),
  regionalExam: z.object({
    regionalExam: z.string().optional(),
    skin: z.string().optional(),
    eyes: z.string().optional(),
    ears: z.string().optional(),
    nose: z.string().optional(),
    mouth: z.string().optional(),
    throat: z.string().optional(),
    teeth: z.string().optional(),
    neck: z.string().optional(),
    thorax: z.string().optional(),
    lungs: z.string().optional(),
    heart: z.string().optional(),
    breasts: z.string().optional(),
    abdomen: z.string().optional(),
    urinary: z.string().optional(),
    lymphatic: z.string().optional(),
    vascular: z.string().optional(),
    locomotor: z.string().optional(),
    extremities: z.string().optional(),
    obituaries: z.string().optional(),
    higherFunctions: z.string().optional(),
    lowerFunctions: z.string().optional(),
    rectal: z.string().optional(),
    gynecological: z.string().optional()
  })
});

export const diagnosisFormSchema = z.object({
  description: z.string().min(1, "Campo requerido"),
  clinicalCriteria: z.string().nullable(),
  diagnosisCodes: z.array(
    z.object({
      id: z.string().min(1, "Campo requerido"),
      code: z.string().min(1, "Campo requerido"),
      description: z.string().min(1, "Campo requerido"),
      classification: z.string().min(1, "Campo requerido"),
      type: z.string().min(1, "Campo requerido"),
      case: z.string().min(1, "Campo requerido"),
      dischargeFlag: z.string().min(1, "Campo requerido")
    })
  ).default([]).refine(
    (arr) => arr.length === 0 || arr.every(item =>
      item.type && item.case
    ), {
      message: "Los campos son requeridos cuando hay diagnósticos"
    }
  )
});

export const therapeuticPlanSchema = z.object({
  treatment: z.string().min(1, "Campo requerido"),
  lifeStyleInstructions: z.string().nullable()
});

export const dentalEvolutionSchema = z.object({
  id: z.string().optional(),
  date: z.preprocess(
    (value) => (value ? (value as DateValue).toString() : ""),
    z.string().min(1, "Campo requerido")
  ),
  odontogram: z.string().min(1, "Campo requerido"),
  odontogramHtml: z.string().min(1, "Campo requerido"),
  specifications: z.string().min(1, "Campo requerido"),
  observations: z.string().min(1, "Campo requerido"),
  basicDentalDischarge: z.preprocess(
    (value) => (value ? (value as DateValue).toString() : ""),
    z.string().min(1, "Campo requerido")
  )
});

export const prescriptionFormSchema = z.object({
  medications: z.string().min(1, "Campo requerido"),
  instructions: z.string().min(1, "Campo requerido"),
  notes: z.string().optional()
});

export const patientApopintmentSchema = z.object({
  date: z.preprocess(
    (value) => (value ? (value as DateValue).toString() : ""),
    z.string().min(1, "La fecha es requerida")
  ),
  hour: z.preprocess(
    (value) => (value ? (value as TimeInputValue).toString() : ""),
    z.string().min(1, "La hora es requerida").refine((val) => {
      const [hours, minutes] = val.split(":").map(Number);
      const time = hours * 60 + minutes;
      const isValidTime =
        (time >= 8 * 60 && time <= 13 * 60) || (time >= 14 * 60 && time <= 15.5 * 60);
      return isValidTime;
    }, {
      message: "El horario de atención es de 8:00am a 1:00pm y de 2:00pm a 3:30pm"
    })
  ),
  doctorId: z.preprocess(
    convertToArray,
    z.string().min(1, "El doctor es requerido")
  )
});

export const anamnesisSchema = z.object({
  diseaseDuration: z.preprocess(
    convertToArray,
    z.string().min(1, "Campo requerido")
  ),
  onsetType: z.preprocess(
    convertToArray,
    z.string().min(1, "Campo requerido")
  ),
  course: z.preprocess(
    convertToArray,
    z.string().min(1, "Campo requerido")
  ),
  symptomsSigns: z.string().min(1, "Campo requerido"),
  clinicalStory: z.string().min(1, "Campo requerido"),
  appetite: z.preprocess(
    convertToArray,
    z.string().min(1, "Campo requerido")
  ),
  thirst: z.preprocess(
    convertToArray,
    z.string().min(1, "Campo requerido")
  ),
  urine: z.preprocess(
    convertToArray,
    z.string().min(1, "Campo requerido")
  ),
  stool: z.preprocess(
    convertToArray,
    z.string().min(1, "Campo requerido")
  ),
  weight: z.string().min(1, "Campo requerido"),
  sleep: z.preprocess(
    convertToArray,
    z.string().min(1, "Campo requerido")
  )
});

export const consultationClosureSchema = z.object({
  summary: z.string().min(1, "Campo requerido"),
  instructions: z.string().nullable(),
  nextAppointmentDate: z.string()
    .nullable()
    .refine(
      (val) => val === null || (val.length > 0 && val >= getCurrentDate()),
      {
        message: "No puede ingresar una fecha pasada"
      }
    )
});

const scheduleSchema = z.object({
  date: z.string().min(1, "La fecha es requerida"),
  startTime: z.string().min(1, "La hora de inicio es requerida"),
  endTime: z.string().min(1, "La hora de fin es requerida")
})
  .refine(
    ({ startTime, endTime }) => {
      const [startHours, startMinutes] = startTime.split(":").map(Number);
      const [endHours, endMinutes] = endTime.split(":").map(Number);

      const startTotalMinutes = startHours * 60 + startMinutes;
      const endTotalMinutes = endHours * 60 + endMinutes;

      return startTotalMinutes < endTotalMinutes;
    },
    {
      message: "Hora fin debe ser posterior",
      path: ["endTime"]
    }
  );

export const eventSchema = z.object({
  title: z.string().min(1, "Campo requerido"),
  subtitle: z.string().nullable(),
  description: z.string().nullable(),
  venueName: z.string().nullable(),
  venueAddress: z.string().nullable(),
  targetAudience: z.string().nullable(),
  organizer: z.string().nullable(),
  organizingArea: z.string().nullable(),
  schedules: z.array(scheduleSchema).min(1, "Debe haber al menos un horario").refine(
    (schedules) => {
      if (schedules.length === 0) return true;
      return schedules.every((schedule, index) => {
        if (index === 0) return true;
        return schedule.date && schedule.startTime && schedule.endTime;
      });
    },
    {
      message: "Los horarios adicionales deben estar completos"
    }
  )
});

export const positionSchema = z.object({
  name: z.string().min(2, "El nombre del cargo es requerido")
});

export const dependenceSchema = z.object({
  name: z.string().min(2, "El nombre de la dependencia es requerido")
});

export const medicationSchema = z.object({
  genericName: z.string().min(2, "El nombre genérico es requerido"),
  concentration: z.string().nullable(),
  presentation: z.string().nullable(),
  dosageFormId: z.preprocess(
    convertToArray,
    z.string().min(1, "La forma de dosificación es requerida")
  )
});

export const accidentSchema = z.object({
  date: z.string().min(1, "La fecha es requerida"),
  hour: z.string().min(1, "La hora es requerida"),
  eventType: z.preprocess(
    convertToArray,
    z.string().min(1, "El tipo de evento es requerido")
  ),
  patientId: z.preprocess(
    convertToArray,
    z.string().min(1, "El paciente es requerido")
  ),
  description: z.string().min(1, "La descripción es requerida"),
  probableCause: z.string().min(1, "La causa probable es requerida"),
  consequences: z.string().min(1, "Las consecuencias son requeridas"),
  correctiveActions: z.string().min(1, "Las medidas correctivas son requeridas"),
  responsible: z.string().min(1, "El responsable es requerido")
});

export const inspectionSchema = z.object({
  date: z.string().min(1, "La fecha es requerida"),
  area: z.string().min(1, "El área es requerida"),
  inspector: z.string().min(1, "El inspector es requerido"),
  findings: z.string().min(1, "Los hallazgos son requeridos"),
  severity: z.preprocess(
    convertToArray,
    z.string().min(1, "La severidad es requerida")
  ),
  recommendations: z.string().min(1, "Las recomendaciones son requeridas"),
  correctionDeadline: z.string().nullable(),
  correctionResponsible: z.string().min(1, "El responsable de corrección es requerido")
});

export const occupationalExamSchema = z.object({
  patientId: z.preprocess(
    convertToArray,
    z.string().min(1, "El paciente es requerido")
  ),
  examType: z.preprocess(
    convertToArray,
    z.string().min(1, "El tipo de examen es requerido")
  ),
  date: z.string().min(1, "La fecha es requerida"),
  result: z.preprocess(
    convertToArray,
    z.string().min(1, "El resultado es requerido")
  ),
  medicalObservations: z.string().nullable(),
  doctor: z.string().min(1, "El doctor es requerido")
});

export const eppDeliverySchema = z.object({
  date: z.string().min(1, "La fecha es requerida"),
  eppItem: z.string().min(1, "El ítem EPP es requerido"),
  quantity: z.string()
    .min(1, "Requerido")
    .refine((val) => /^-?\d+(\.\d+)?$/.test(val), {
      message: "Número inválido"
    })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Mínimo 1"
    }),
  condition: z.preprocess(
    convertToArray,
    z.string().min(1, "La condición es requerida")
  ),
  observations: z.string().optional(),
  patientId: z.string().min(1, "El paciente es requerido")
});

export const environmentalMonitoringSchema = z.object({
  area: z.string().min(1, "El área es requerida"),
  agentType: z.preprocess(
    convertToArray,
    z.string().min(1, "El tipo de agente es requerido")
  ),
  agentDescription: z.string().nullable(),
  measuredValue: z.string()
    .min(1, "El valor medido es requerido")
    .refine((val) => /^-?\d+(\.\d+)?$/.test(val), {
      message: "Debe ser un número válido"
    }),
  unit: z.preprocess(
    convertToArray,
    z.string().min(1, "La unidad es requerida")
  ),
  permittedLimit: z.string()
    .nullable()
    .refine((val) => !val || /^-?\d+(\.\d+)?$/.test(val), {
      message: "Debe ser un número válido"
    }),
  measurementDate: z.string().min(1, "La fecha de medición es requerida"),
  frequency: z.preprocess(
    convertToArray,
    z.string().min(1, "La frecuencia es requerida")
  ),
  responsible: z.string().min(1, "El responsable es requerido"),
  observations: z.string().nullable()
});

export const committeeMinuteSchema = z.object({
  date: z.string().min(1, "La fecha es requerida"),
  topics: z.string().min(1, "Los temas son requeridos"),
  agreements: z.string().min(1, "Los acuerdos son requeridos"),
  followupResponsible: z.string().min(1, "El responsable de seguimiento es requerido"),
  nextMeetingDate: z.string().min(1, "La fecha de próxima reunión es requerida")
});
