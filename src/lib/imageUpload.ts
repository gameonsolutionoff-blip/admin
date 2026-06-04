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

export const uploadMediaDirectly = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("secret", "gameon-super-secret-key-123");

  const response = await fetch("https://gameonsolution.gameonsolution.in/upload.php", {
    method: "POST",
    body: formData,
  });

  const result = await response.json();
  if (result.success && result.url) {
    return result.url;
  }
  throw new Error(result.message || "Upload failed");
};

export const isInlineImage = (value?: string | null) =>
  typeof value === "string" && value.startsWith("data:image/");

export const isInlineVideo = (value?: string | null) =>
  typeof value === "string" && value.startsWith("data:video/");
