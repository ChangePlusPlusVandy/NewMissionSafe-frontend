// import { handleJsonResponse } from "./responseHelpers";

// const BACKEND_ROUTE = `${import.meta.env.VITE_BACKEND_ROUTE}/staff`;

// export const getStaffByID = async (fireID: string, token: string) => {
//   const response = await fetch(`${BACKEND_ROUTE}/byID/${fireID}`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   return await handleJsonResponse(response);
// };

// Server-client interface for /api/users/staff
import { handleJsonResponse, handleMiscResponse } from "./responseHelpers";
import { staffType } from "./models/staffModel";

const BACKEND_ROUTE = `${import.meta.env.VITE_BACKEND_ROUTE}/staff`;

// GET all staff
export const getAllStaff = async (token: string) => {
    const response = await fetch(`${BACKEND_ROUTE}/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });
    return await handleJsonResponse(response);
}

// POST a new staff
export const createStaff = async (staff: staffType, token: string) => {
    const response = await fetch(`${BACKEND_ROUTE}/`, {
        method: "POST",
        body: JSON.stringify(staff),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return await handleJsonResponse(response);
}

// GET staff by @email
export const getStaffByEmail = async(email: string, token: string) => {
    const response = await fetch(`${BACKEND_ROUTE}/byEmail/${email}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });
    return await handleJsonResponse(response);
}

// GET staff by @fireID
// TODO: double check these with backend staff endpoints when finally merged
export const getStaffByID = async(fireID: string, token: string) => {
    const response = await fetch(`${BACKEND_ROUTE}/byID/${fireID}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });
    return await handleJsonResponse(response);
}

// GET all staff w/ @program
// TODO: double check these with backend staff endpoints when finally merged
export const getStaffByProgram = async(program: string, token: string) => {
    const response = await fetch(`${BACKEND_ROUTE}/byProgram/${program}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });
    return await handleJsonResponse(response);
}

// GET all active staff
export const getActiveStaff = async(token: string) => {
    const response = await fetch(`${BACKEND_ROUTE}/active`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });
    return await handleJsonResponse(response);
}


// GET all inactive staff
export const getInactiveStaff = async(token: string) => {
    const response = await fetch(`${BACKEND_ROUTE}/inactive`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });
    return await handleJsonResponse(response);
}

// PUT @active to true for staff w/ @fireID
export const activateStaff = async (fireID: string, token: string) => {
    const response = await fetch(`${BACKEND_ROUTE}/activate/${fireID}`, {
        method: "PUT",
        body: JSON.stringify(fireID),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return await handleMiscResponse(response);
}

// PUT @active to false for staff w/ @fireID
export const deactivateStaff = async (fireID: string, token: string) => {
    const response = await fetch(`${BACKEND_ROUTE}/deactivate/${fireID}`, {
        method: "PUT",
        body: JSON.stringify(fireID),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return await handleMiscResponse(response);
}

// PUT new @value for @attribute for staff w/ @fireID
export const updateAttribute = async (key: string, value: string, fireID: string, token: string) => {
    const response = await fetch(`${BACKEND_ROUTE}/updateStaffAttribute/${fireID}`, {
        method: "PUT",
        body: JSON.stringify({key, value}),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return await handleMiscResponse(response);
}