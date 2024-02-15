import {formType, responseType } from "./models/formModel";
import { handleJsonResponse, handleMiscResponse } from "./responseHelpers";

const BACKEND_ROUTE = `${import.meta.env.VITE_BACKEND_ROUTE}/forms`;

export const createForm = async(formFields: formType, token: string) => {
    const response = await fetch(BACKEND_ROUTE, {
        method: 'POST',
        body: JSON.stringify(formFields),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    });
    return await handleJsonResponse(response);
}

export const getAllForms = async(token: string) =>{
    const response = await fetch(BACKEND_ROUTE, {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });
    return await handleJsonResponse(response);
}

export const createAndAddResponseToForm = async(
    formID: string,
    responseFields: responseType,
    token: string,
) => {
    const response = await fetch(
        `${BACKEND_ROUTE}/${formID}`, {
            method: 'PUT',
            body: JSON.stringify(responseFields),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        }
    )
    return await handleJsonResponse(response)
}

export const getFormResponse = async (
    formID: string,
    responseID: string,
    token: string
) => {
    const response = await fetch(
        `${BACKEND_ROUTE}/${formID}/${responseID}`,{
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    }
    );
    return await handleJsonResponse(response);
}

