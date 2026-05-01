export const imageFileToDataUrl = (file: File): Promise<string> => {
  if (!file.type.startsWith("image/")) {
    return Promise.reject(new Error("Please upload a valid image file."));
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read image file."));
    reader.readAsDataURL(file);
  });
};

export const mediaFileToDataUrl = (file: File): Promise<string> => {
  if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
    return Promise.reject(new Error("Please upload a valid image or video file."));
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read media file."));
    reader.readAsDataURL(file);
  });
};

export const isInlineImage = (value?: string | null) =>
  typeof value === "string" && value.startsWith("data:image/");

export const isInlineVideo = (value?: string | null) =>
  typeof value === "string" && value.startsWith("data:video/");
