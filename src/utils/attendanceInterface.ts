import { attendanceType } from "./models/attendanceModel";
import { handleJsonResponse } from "./responseHelpers";

const BACKEND_ROUTE = `${import.meta.env.VITE_BACKEND_ROUTE}/attendance`;

export const addAttendanceEntry = async (
  entry: attendanceType,
  token: string
) => {
  const response = await fetch(`${BACKEND_ROUTE}`, {
    method: "POST",
    body: JSON.stringify(entry),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return await handleJsonResponse(response);
};

export const getYouthAttendanceDay = async (
  date: string,
  uid: string,
  token: string
) => {
  const response = await fetch(`${BACKEND_ROUTE}/${uid}/${date}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await handleJsonResponse(response);
};

export const updateStatus = async (
  date: string,
  uid: string,
  token: string,
  status: string
) => {
  const response = await fetch(`${BACKEND_ROUTE}/${uid}/${date}/${status}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await handleJsonResponse(response);
};

export const getAttendanceInRange = async (
  startDate: Date,
  endDate: Date,
  token: string
) => {
  const response = await fetch(`${BACKEND_ROUTE}/getAttendances/${startDate}/${endDate}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await handleJsonResponse(response);
};
