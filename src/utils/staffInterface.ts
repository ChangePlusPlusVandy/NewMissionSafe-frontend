import { handleJsonResponse } from "./responseHelpers";

const BACKEND_ROUTE = `${import.meta.env.VITE_BACKEND_ROUTE}/staff`;

export const getStaffByID = async (fireID: string, token: string) => {
  const response = await fetch(`${BACKEND_ROUTE}/byID/${fireID}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await handleJsonResponse(response);
};
