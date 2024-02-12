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

// PUT new @firstName for staff w/ @fireID
// TODO: Should this take a fireID or staffType?
export const updateFirstName = async (firstName: string, fireID: string, token: string) => {
    const response = await fetch(`${BACKEND_ROUTE}/updateFirstName/${fireID}`, {
        method: "PUT",
        body: JSON.stringify(firstName),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return await handleMiscResponse(response);
}

// PUT new @lastName for staff w/ @fireID
// TODO: Should this take a fireID or staffType?
export const updateLastName = async (lastName: string, fireID: string, token: string) => {
    const response = await fetch(`${BACKEND_ROUTE}/updateLastName/${fireID}`, {
        method: "PUT",
        body: JSON.stringify(lastName),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return await handleMiscResponse(response);
}

// PUT new @email for staff w/ @fireID
// TODO: Should this take a fireID or staffType?
export const updateEmail = async (email: string, fireID: string, token: string) => {
    const response = await fetch(`${BACKEND_ROUTE}/updateEmail/${fireID}`, {
        method: "PUT",
        body: JSON.stringify(email),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return await handleMiscResponse(response);
}
