import { handleJsonResponse, handleMiscResponse } from "./responseHelpers";
import { eventType } from "./models/eventModel";

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

export const createCode = async (token: string) => {
  let result = "";
  try {
    for (;;) {
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
      const charactersLength = characters.length;
      for (let i = 0; i < 7; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }

      await getEvent(result, token);
    }
  } catch (err) {
    if (
      err instanceof Error &&
      err.message === "No event with code " + result
    ) {
      return result;
    }
    throw err;
  }
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
  const response = await fetch(
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
