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
      const res = await getImage(key, token);
      if (res) {
        const reader = res.getReader();
        const chunks: Uint8Array[] = [];
        let chunk;

        // Read the stream and collect chunks
        while (!(chunk = await reader.read()).done) {
          chunks.push(chunk.value);
        }

        // Concatenate all chunks into a single Uint8Array
        const imageData = new Uint8Array(
          chunks.reduce((acc, chunk) => acc + chunk.byteLength, 0)
        );
        let offset = 0;
        for (const chunk of chunks) {
          imageData.set(chunk, offset);
          offset += chunk.byteLength;
        }

        // Convert Uint8Array to Base64 string
        const base64String = btoa(String.fromCharCode(...imageData));

        // Create data URL
        const url = `data:image/png;base64,${base64String}`;

        // Set the URL to state
        return url;
      }
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw err;
    } else {
      throw new Error("Image retrieval failed for unknown reasons");
    }
  }
};
