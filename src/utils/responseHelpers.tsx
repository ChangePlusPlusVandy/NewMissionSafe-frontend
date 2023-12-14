// JSON response checker
export async function handleJsonResponse(response: Response) { //equivalent to checkJSONResponseStatus in old code
  if (!response.ok) {
    try {
      const failedResponse = await response.json();
      if (failedResponse.error != null) { //ideally all of the errors we defined on the backend have error prop
        throw new Error(failedResponse.error);
      } else { //case for no error prop
        throw new Error(response.statusText);
      }
    } catch (err) { //case for response isn't json
      throw new Error(response.statusText);
    }
  }
  const parsedResponse = await response.json();
  return parsedResponse;
}

export async function handleMiscResponse(response: Response) {
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return true;
}