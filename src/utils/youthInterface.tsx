//Server-client interface for /api/users/youth
import { youthType } from "./models/youthModel";
// import { handleJsonResponse, handleMiscResponse } from "./responseHelpers";

//TODO: Replace handler functions with Jack's imports once merged.

async function handleJsonResponse(response: Response) {
    if(!response.ok) {
        throw new Error(response.statusText);
    }
    const parsedResponse = await response.json();
    return parsedResponse;
}

async function handleMiscResponse(response : Response) {
    if(!response.ok) {
        throw new Error(response.statusText);
    }
    return true;
}

const BACKEND_ROUTE = `${import.meta.env.VITE_BACKEND_ROUTE}/users/youth`;

//#region GET Requests

// GET all Youth
export const getAllYouth = async (token: string) => {
    const response = await fetch(`${BACKEND_ROUTE}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return await handleJsonResponse(response);
}

// GET youth with @fireID
export const getYouthByID = async (firebaseUID: string, token: string) => {
    const response = await fetch(`${BACKEND_ROUTE}/byID/${firebaseUID}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return await handleJsonResponse(response);
}

// GET youth by @email
export const getYouthByEmail = async (email: string, token: string) => {
    const response = await fetch(`${BACKEND_ROUTE}/byEmail/${email}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return await handleJsonResponse(response);
}

// GET all youth in @program
export const getYouthByProgram = async (program: string, token: string) => {
    const response = await fetch(`${BACKEND_ROUTE}/byProgram/${program}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return await handleJsonResponse(response);
}

// GET all active youth
export const getActiveYouth = async (token: string) => {
    const response = await fetch(`${BACKEND_ROUTE}/active`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return await handleJsonResponse(response);
}

// GET all inactive youth
export const getInactiveYouth = async (token: string) => {
    const response = await fetch(`${BACKEND_ROUTE}/inactive`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return await handleJsonResponse(response);
}
//#endregion GET Requests

//#region POST Requests 

// POST create Youth
export const createYouth = async (youth: youthType, token: string) => {
    const response = await fetch(`${BACKEND_ROUTE}`, {
        method: 'POST',
        body: JSON.stringify(youth),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    return await handleJsonResponse(response);
}

//#endregion POST Requests

//#region PUT Requests

//PUT update youth
export const updateYouth = async (youth: youthType, firebaseUID: string, token: string) => {
    const response = await fetch(`${BACKEND_ROUTE}/${firebaseUID}`, {
        method: 'PUT',
        body: JSON.stringify(youth),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    return await handleJsonResponse(response);
}

// PUT activate youth with @fireID
export const activateYouth = async (firebaseUID: string, token: string) => {
    const response = await fetch(`${BACKEND_ROUTE}/activate/${firebaseUID}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return await handleMiscResponse(response);
}

// PUT deactivate youth with @fireID
export const deactivateYouth = async (firebaseUID: string, token: string) => {
    const response = await fetch(`${BACKEND_ROUTE}/deactivate/${firebaseUID}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return await handleMiscResponse(response);
}

//#endregion PUT Requests