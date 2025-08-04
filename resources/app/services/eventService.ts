import { TableFiltersRequest } from "@/types/requestInterfaces";
import { Event, EventFormData, EventResponse, EventParticipant, EventParticipantFormData } from "@/types/eventInterfaces";
import { get, save, remove } from "./apiService";
import { GenericAbortSignal } from "axios";
import { PaginatedDataResponse } from "@/types/responseInterfaces";

interface EventRequest extends TableFiltersRequest {
    organizingArea: string;
}
interface EventParticipantRequest extends TableFiltersRequest {
    id: string;
}

export interface GetParticipantsResponse {
  patients: PaginatedDataResponse<EventParticipant>;
  participants: string[];
}

export const getEvents = (filter: EventRequest, signal: GenericAbortSignal) =>
  get<EventResponse>("/events", filter, signal);

export const saveEvent = (data: EventFormData) =>
  save<EventFormData, {eventId: string}>("/events", data, true);

export const deleteEvent = (id: string) => remove("/events", id);

export const getEvent = (id: string) => get<Event>(`/events/${id}`);

export const getParticipants = (filter: EventParticipantRequest, signal: GenericAbortSignal) =>
  get<GetParticipantsResponse>("/events/participants", filter, signal);

export const addParticipant = (data: EventParticipantFormData) =>
  save("/events/add-participant", data);

export const removeParticipant = (data: EventParticipantFormData) =>
  save("/events/remove-participant", data);
