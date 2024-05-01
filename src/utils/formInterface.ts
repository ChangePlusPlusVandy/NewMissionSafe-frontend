import { formType, responseType } from "./models/formModel";
import {
  handleImageResponse,
  handleJsonResponse,
  handleMiscResponse,
} from "./responseHelpers";

const BACKEND_ROUTE = `${import.meta.env.VITE_BACKEND_ROUTE}/forms`;

export const createForm = async (formFields: formType, token: string) => {
  const response = await fetch(BACKEND_ROUTE, {
    method: "POST",
    body: JSON.stringify(formFields),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return await handleJsonResponse(response);
};

export const getAllForms = async (token: string) => {
  const response = await fetch(BACKEND_ROUTE, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await handleJsonResponse(response);
};

export const createAndAddResponseFormData = async (
  formID: string,
  responseFields: responseType,
  token: string
) => {
  const response = await fetch(`${BACKEND_ROUTE}/${formID}`, {
    method: "PUT",
    body: responseFields as any,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await handleMiscResponse(response);
};

export const createAndAddResponseJson = async (
  formID: string,
  responseFields: responseType,
  token: string
) => {
  const response = await fetch(`${BACKEND_ROUTE}/${formID}`, {
    method: "PUT",
    body: JSON.stringify(responseFields),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return await handleMiscResponse(response);
};

export const getFormResponse = async (
  formID: string,
  responseID: string,
  token: string
) => {
  const response = await fetch(`${BACKEND_ROUTE}/${formID}/${responseID}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await handleJsonResponse(response);
};

export const getFormByID = async (formID: string, token: string) => {
  const response = await fetch(`${BACKEND_ROUTE}/${formID}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await handleJsonResponse(response);
};

export const getImage = async (key: string, token: string) => {
  const response = await fetch(`${BACKEND_ROUTE}/images/${key}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleImageResponse(response);
};

export const fetchImage = async (key: string, token: string) => {
  try {
    if (token) {
      const imageBlob = await getImage(key, token);
      const imageUrl = URL.createObjectURL(imageBlob);
      return imageUrl;
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw err;
    } else {
      throw new Error("Image retrieval failed for unknown reasons");
    }
  }
};
