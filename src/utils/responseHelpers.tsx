// JSON response checker
export async function handleJsonResponse(response: Response) {
  //equivalent to checkJSONResponseStatus in old code
  if (!response.ok) {
    let failedResponse;
    try {
      failedResponse = await response.json();
    } catch (err) {
      //case where response isn't json
      throw new Error(response.statusText);
    }
    //ideally all of the errors we defined on the backend have error prop
    if (failedResponse.error != null) {
      throw new Error(failedResponse.error);
    } else {
      //case for no error prop
      throw new Error(response.statusText);
    }
  }
  const parsedResponse = await response.json();
  return parsedResponse;
}

export async function handleMiscResponse(response: Response) {
  if (!response.ok) {
    let failedResponse;
    try {
      failedResponse = await response.json();
    } catch (err) {
      //case where response isn't json
      throw new Error(response.statusText);
    }
    //ideally all of the errors we defined on the backend have error prop
    if (failedResponse.error != null) {
      throw new Error(failedResponse.error);
    } else {
      //case for no error prop
      throw new Error(response.statusText);
    }
  }
  return true;
}
