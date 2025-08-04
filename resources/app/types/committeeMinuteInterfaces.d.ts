import { PaginationResponse } from "./responseInterfaces";

export interface CommitteeMinute {
    id: string;
    date: string;
    topics: string;
    agreements: string;
    followupResponsible: string;
    nextMeetingDate: string;
    createdAt: string;
}

export interface CommitteeMinuteFormData {
    id?: string;
    date: string;
    topics: string;
    agreements: string;
    followupResponsible: string;
    nextMeetingDate: string;
}

export interface CommitteeMinuteResponse {
    data: CommitteeMinute[];
    pagination: PaginationResponse;
}
