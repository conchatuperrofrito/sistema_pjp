import { PaginationResponse } from "./responseInterfaces";

export interface Event {
    id: string;
    userId: string;
    title: string;
    subtitle: string;
    description: string;
    venueName: string;
    venueAddress: string;
    targetAudience: string;
    organizer: string;
    organizingArea: string;
    createdAt: string;
    createdBy: string;
    schedules: EventSchedule[];
}

export interface EventSchedule {
    date: string;
    startTime: string;
    endTime: string;
}

export interface EventFormData {
    id?: string;
    title: string;
    subtitle: string;
    description: string;
    venueName: string;
    venueAddress: string;
    targetAudience: string;
    organizer: string;
    organizingArea: string;
    schedules: EventSchedule[];
}

export interface EventParticipant {
    id: string;
    fullName: string;
    documentType: string;
    documentNumber: string;
    position: string;
}

export interface EventParticipantFormData {
    id: string;
    patientId?: string;
    documentNumber?: string;
}

export interface EventResponse {
    data: Event[];
    pagination: PaginationResponse;
}
