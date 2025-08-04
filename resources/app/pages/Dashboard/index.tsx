import {
  getGeneralSummary,
  getLastAppointments,
  getLastPatients
} from "@/services/dashboardService";
import { useQuery } from "@tanstack/react-query";
import StatisticalCard from "./components/StatisticalCard";
import { HospitalUserIcon, CalendarIcon, CalendarCheckIcon } from "@/assets/icons";
import SpecialtySummaryCard from "./components/SpecialtySummaryCard";
import LineChart from "./components/LineChart";
import DoughnutChart from "./components/DoughnutChart";
import TableCard from "./components/TableCard";
import { Chip, Tooltip } from "@heroui/react";
import { useLogout } from "@/hooks/useLogout";
import clsx from "clsx";
import { useMemo } from "react";

const DashboardPage = () => {

  const { user } = useLogout();

  const generalSummary = useQuery({
    queryKey: ["generalSummary"],
    queryFn: getGeneralSummary
  });

  const isAdmin = useMemo(() => user?.role.id === __ADMIN_ROLE_ID__, [user]);

  return (
    <section>
      <div className={clsx("grid grid-cols-1 gap-4 md:grid-cols-2", {
        "lg:grid-cols-3": !isAdmin,
        "lg:grid-cols-4": isAdmin
      })}>
        <StatisticalCard
          title="Pacientes registrados"
          value={generalSummary.data?.totalPatients}
          icon={<HospitalUserIcon height={65} width={65} />}
          extraContent={
            <div className="flex flex-col gap-0">
              <span className="text-xs font-semibold text-default-500">Hombres: {generalSummary.data?.patientsBySex.male}</span>
              <span className="text-xs font-semibold text-default-500">Mujeres: {generalSummary.data?.patientsBySex.female}</span>
              {generalSummary.data?.patientsBySex.unassigned && (
                <span className="text-xs font-semibold text-default-500">Sin asignar: {generalSummary.data?.patientsBySex.unassigned}</span>
              )}
            </div>
          }
          // withPopover
          // popoverContent={
          //   <table className="min-w-full divide-y divide-gray-200 text-xs">
          //     <thead >
          //       <tr>
          //         <th scope="col" className="px-2 py-1 text-left font-medium uppercase tracking-wider">
          //       Sexo
          //         </th>
          //         <th scope="col" className="px-2 py-1 text-left font-medium uppercase tracking-wider">
          //       Cantidad
          //         </th>
          //         <th scope="col" className="px-2 py-1 text-left font-medium uppercase tracking-wider">
          //       Cantidad
          //         </th>
          //       </tr>
          //     </thead>
          //     <tbody>
          //       {Object.entries(generalSummary.data?.patientsBySex || {}).map(([key, value], index) => (
          //         <tr key={index}>
          //           <td className="px-2 py-1 whitespace-nowrap">{key}</td>
          //           <td className="px-2 py-1 whitespace-nowrap">{value}</td>
          //         </tr>
          //       ))}
          //     </tbody>
          //   </table>
          // }
        />

        <StatisticalCard
          title="Citas registradas hoy"
          value={generalSummary.data?.todayAppointments}
          icon={<CalendarIcon height={65} width={65} color="white"/>}
        />

        <StatisticalCard
          title="Citas realizadas hoy"
          value={generalSummary.data?.todayAttendedAppointments}
          icon={<CalendarCheckIcon height={65} width={65} color="white"/>}
        />

        {
          isAdmin && (
            <SpecialtySummaryCard generalSummary={generalSummary.data?.specialtySummary} />
          )
        }

      </div>
      <div className={"grid grid-cols-1 gap-4 mt-4 md:grid-cols-1 xl:grid-cols-[2fr_1fr]"}>
        <LineChart isAdmin={isAdmin} />
        <DoughnutChart isAdmin={isAdmin} />
      </div>

      <div className="grid gap-4 mt-4 lg:grid-cols-[450px_auto]">
        <TableCard
          title="Últimos pacientes registrados"
          columns={[
            { key: "date", label: "Fecha y hora", size: "80px" },
            { key: "fullName", label: "Nombre", size: "150px" },
            { key: "documentNumber", label: "Documento", size: "120px" }
          ]}
          queryKey="lastPatients"
          queryFn={getLastPatients}
          renderCell={(patient, columnKey) => {
            switch (columnKey) {
            case "date":
              return (
                <div className="whitespace-nowrap">
                  <span className="text-bold text-small capitalize">{patient.date}</span>
                  <p className="text-bold text-tiny capitalize text-default-500">{patient.hour}</p>
                </div>
              );
            case "abreviatedFullName":
              return (
                <Tooltip content={patient.fullName}>
                  <div>
                    <span className="text-bold text-small capitalize">
                      {patient.abreviatedFullName}
                    </span>
                    <p className="text-bold text-tiny capitalize text-default-500">{patient.sex}</p>
                  </div>
                </Tooltip>

              );

            case "documentNumber":
              return (
                <div className="flex items-center gap-1">
                  <Tooltip content={
                    patient.documentType === "DNI" ? "Documento Nacional de Identidad" :
                      patient.documentType === "Pasaporte" ? "Pasaporte" : "Carnet de Extranjería"
                  }>
                    <span className="text-xs text-gray-500 cursor-help">
                      {patient.documentType === "DNI" ? "DNI" :
                        patient.documentType === "Pasaporte" ? "Pas." : "C.E."}:
                    </span>
                  </Tooltip>
                  <span>{patient.documentNumber}</span>
                </div>
              );

            default:
              return patient[columnKey as keyof typeof patient];
            }
          }}
        />

        <TableCard
          title="Últimas citas registradas"
          columns={[
            { key: "date", label: "Fecha y hora", size: "97px" },
            { key: "patientFullName", label: "Paciente", size: "160px" },
            { key: "doctorAbreviatedFullName", label: "Doctor", size: "140px" },
            { key: "reason", label: "Motivo" },
            { key: "status", label: "Estado" }
          ].filter(column =>
            isAdmin || column.key !== "doctorAbreviatedFullName"
          )}
          queryKey="lastAppointments"
          queryFn={getLastAppointments}
          renderCell={(appointment, columnKey) => {
            switch (columnKey) {

            case "date":
              return (
                <div>
                  <span className="text-bold text-small capitalize">{appointment.date}</span>
                  <p className="text-bold text-tiny capitalize text-default-500">{appointment.hour}</p>
                </div>
              );

            case "status":
              return (
                <Chip variant="flat" color={appointment.status === "Pendiente" ? "warning" : "success"}>
                  {appointment.status}
                </Chip>
              );

            case "patientFullName":
              return (
                <Tooltip content={appointment.patient}>
                  <span>{appointment.patientFullName}</span>
                </Tooltip>
              );

            case "doctorAbreviatedFullName":
              return (
                <Tooltip content={appointment.doctor}>
                  <div>
                    <span className="text-bold text-small capitalize">{appointment.doctorAbreviatedFullName}</span>
                    <p className="text-bold text-tiny capitalize text-default-500">{appointment.specialty}</p>
                  </div>
                </Tooltip>

              );

            case "reason":
              return (
                <div className="break-words line-clamp-2">
                  {appointment.reason}
                </div>
              );

            default:
              return appointment[columnKey as keyof typeof appointment];
            }
          }}
        />
      </div>
    </section>
  );
};

export default DashboardPage;
