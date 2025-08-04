interface SpecialtySummary {
    specialty: "Medicina General" | "Odontología" | "Psicología";
    total: number;
    attended: number;
}

interface PatientsBySex{
    male: number;
    female: number;
    unassigned: number;
}

interface GeneralSummary {
    totalPatients: number;
    patientsBySex: PatientsBySex;
    todayAppointments: number;
    todayAttendedAppointments: number;
    specialtySummary: SpecialtySummary[];
}

interface ReportByPeriod {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
    }[];
}

interface SummaryByPeriod {
    label: string;
    totalAppointments: number;
}

interface LastPatient {
    id: string;
    date: string;
    hour: string;
    abreviatedFullName: string;
    fullName: string;
    documentType: string;
    documentNumber: string;
    sex: string;
}

interface LastAppointment {
    id: string;
    date: string;
    hour: string;
    status: "Pendiente" | "Realizada";
    patientFullName: string;
    patient: string;
    doctorAbreviatedFullName: string;
    doctor: string;
    reason: string;
    specialty: string;
}

interface FacultyWithSchoolsOption extends Option {
    schools: Option[];
}

interface AppointmentsBySchoolAndPeriod {
    appointments: {
        school: string;
        totalCount: number;
        pendingCount: number;
        completedCount: number;
    }[];
    total: number;
    totalPending: number;
    totalCompleted: number;
}
