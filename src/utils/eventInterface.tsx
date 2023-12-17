import { handleJsonResponse, handleMiscResponse } from "./responseHelpers";

//review: is this the right place to put this?
export interface eventType {
  name: string;
  description: string;
  code: string;
  date: Date;
  programs: string[];
  staff: string[];
  attended_youth?: string[];
  attached_forms?: string[];
}

// GET all events
export const getAllEvents = async (token: string) => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_ROUTE}/events`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await handleJsonResponse(response);
};

// GET event with @eventCode
export const getEvent = async (eventCode: string, token: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_ROUTE}/events/${eventCode}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return await handleJsonResponse(response);
};

// POST new event
export const createEvent = async (event: eventType, token: string) => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_ROUTE}/events`, {
    method: "POST",
    body: JSON.stringify(event),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return await handleJsonResponse(response);
};

// PUT add a staff member
export const addEventStaff = async (
  eventCode: string,
  firebaseUID: string,
  token: string
) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_ROUTE}/events/addStaff/${eventCode}`,
    {
      method: "PUT",
      body: JSON.stringify({ firebaseUID }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return await handleJsonResponse(response);
};

// PUT mark attendance
export const attendEvent = async (
  eventCode: string,
  firebaseUID: string,
  token: string
) => {
  let response = await fetch(
    `${import.meta.env.VITE_BACKEND_ROUTE}/events/attend/${eventCode}`,
    {
      method: "PUT",
      body: JSON.stringify({ firebaseUID }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return await handleMiscResponse(response);
};
