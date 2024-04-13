export const isImageFile = (value: any) => {
  if (value) {
    const file = value as File;
    const validFileExtensions = ["jpg", "gif", "png", "jpeg", "svg", "webp"];
    const fileEnd = file.name.split(".").pop() || "";
    return (
      file &&
      file.name.length > 0 &&
      validFileExtensions.includes(fileEnd.toLowerCase())
    );
  }
  return true;
};

export const allowedFileMessage =
  "The following file types are allowed: jpg, gif, png, jpeg, svg, webp";

type B64StringWithMimeType = {
  data: string;
  mimeType: string;
};

export const extractFileData = async (
  input: any,
  fieldNames: string[]
): Promise<B64StringWithMimeType[]> => {
  const promises: Promise<B64StringWithMimeType>[] = [];

  fieldNames.forEach((fieldName) => {
    const file = input[fieldName];
    if (file instanceof File) {
      const promise = file.arrayBuffer().then((data) => {
        let binary = "";
        const bytes = new Uint8Array(data);
        const len = bytes.length;
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        return {
          data: window.btoa(binary),
          mimeType: file.type,
        };
      });
      promises.push(promise);
    }
  });

  return Promise.all(promises);
};
