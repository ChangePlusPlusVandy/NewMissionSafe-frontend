import { handleJsonResponse, handleMiscResponse } from "./responseHelpers";

export interface eventType {
  //review: is this the right place to put this
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
export const getAllEvents = async () => {
  const response = await fetch(import.meta.env.VITE_BACKEND_ROUTE);
  return await handleJsonResponse(response);
};

// GET event with @eventCode
export const getEvent = async (eventCode: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_ROUTE}/${eventCode}`
  );
  return await handleJsonResponse(response);
};

// POST new event
export const createEvent = async (event: eventType) => {
  const response = await fetch(import.meta.env.VITE_BACKEND_ROUTE, {
    method: "POST",
    body: JSON.stringify(event),
    headers: { "Content-Type": "application/json" },
  });
  return await handleJsonResponse(response);
};

// PUT add a staff member
export const addEventStaff = async (eventCode: string, firebaseUID: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_ROUTE}/addStaff/${eventCode}`,
    {
      method: "PUT",
      body: JSON.stringify({ firebaseUID }),
      headers: { "Content-Type": "application/json" },
    }
  );
  return await handleJsonResponse(response);
};

// PUT mark attendance
export const attendEvent = async (eventCode: string, firebaseUID: string) => {
  let response = await fetch(
    `${import.meta.env.VITE_BACKEND_ROUTE}/attend/${eventCode}`,
    {
      method: "PUT",
      body: JSON.stringify({ firebaseUID }),
      headers: { "Content-Type": "application/json" },
    }
  );
  return await handleMiscResponse(response);
};
