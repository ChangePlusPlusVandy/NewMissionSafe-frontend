//Server-client interface for /api/users/youth
import { youthType } from "../models/youthModel";
import { handleJsonResponse, handleMiscResponse } from "../responseHelpers";

const BACKEND_ROUTE = `${import.meta.env.VITE_BACKEND_ROUTE}/youth`;

//#region GET Requests

// GET all Youth
export const getAllYouth = async (token: string) => {
  const response = await fetch(`${BACKEND_ROUTE}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await handleJsonResponse(response);
};

// GET youth with @fireID
export const getYouthByID = async (firebaseUID: string, token: string) => {
  const response = await fetch(`${BACKEND_ROUTE}/byID/${firebaseUID}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await handleJsonResponse(response);
};

// GET youth by @email
export const getYouthByEmail = async (email: string, token: string) => {
  const response = await fetch(`${BACKEND_ROUTE}/byEmail/${email}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await handleJsonResponse(response);
};

// GET all youth in @program
export const getYouthByProgram = async (program: string, token: string) => {
  const response = await fetch(`${BACKEND_ROUTE}/byProgram/${program}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await handleJsonResponse(response);
};

// GET all active youth
export const getActiveYouth = async (token: string) => {
  const response = await fetch(`${BACKEND_ROUTE}/active`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await handleJsonResponse(response);
};

// GET all inactive youth
export const getInactiveYouth = async (token: string) => {
  const response = await fetch(`${BACKEND_ROUTE}/inactive`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await handleJsonResponse(response);
};
//#endregion GET Requests

//#region POST Requests

// POST create Youth
export const createYouth = async (youth: youthType, token: string) => {
  const response = await fetch(`${BACKEND_ROUTE}`, {
    method: "POST",
    body: JSON.stringify(youth),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return await handleJsonResponse(response);
};

//#endregion POST Requests

//#region PUT Requests

//PUT update youth
export const updateYouth = async (
  youth: youthType,
  firebaseUID: string,
  token: string
) => {
  const response = await fetch(`${BACKEND_ROUTE}/${firebaseUID}`, {
    method: "PUT",
    body: JSON.stringify(youth),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return await handleJsonResponse(response);
};

// PUT activate youth with @fireID
export const activateYouth = async (firebaseUID: string, token: string) => {
  const response = await fetch(`${BACKEND_ROUTE}/activate/${firebaseUID}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await handleMiscResponse(response);
};

// PUT deactivate youth with @fireID
export const deactivateYouth = async (firebaseUID: string, token: string) => {
  const response = await fetch(`${BACKEND_ROUTE}/deactivate/${firebaseUID}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await handleMiscResponse(response);
};

//#endregion PUT Requests

export const calculateAgeJoined = (birthDate: Date): number => {
  const today = new Date().getTime();
  const x = today - birthDate.getTime();
  return Math.floor(x / 1000 / 60 / 60 / 24 / 365.25);
};

export const convertTo12HourFormat = (time24: string) => {
  const [hours, minutes] = time24.split(":").map(Number);
  const meridiem = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  const minuteStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return `${hour12}:${minuteStr} ${meridiem}`;
};
