import { TableFiltersRequest } from "@/types/requestInterfaces";
import { get } from "./apiService";
import { PaginatedDataResponse } from "@/types/responseInterfaces";

interface ReportByPeriodFilter {
    period: string;
    sex: string;
    groupBy: string;
}

export const getGeneralSummary = () => get<GeneralSummary>("/dashboard/general-summary");

export const getReportByPeriod = ( filter: ReportByPeriodFilter ) =>
  get<ReportByPeriod>("/dashboard/report-by-period/", filter);

export const getSummaryByPeriod = (filter: ReportByPeriodFilter) =>
  get<SummaryByPeriod[]>("/dashboard/summary-by-period/", filter);

export const getLastAppointments = (filter: TableFiltersRequest) => get<PaginatedDataResponse<LastAppointment>>("/dashboard/last-appointments", filter);

export const getLastPatients = (filter: TableFiltersRequest) => get<PaginatedDataResponse<LastPatient>>("/dashboard/last-patients", filter);
