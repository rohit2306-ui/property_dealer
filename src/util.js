import { put } from "@vercel/blob";

export async function uploadImage(file) {
  try {
    const { url } = await put(`property-images/${file.name}`, file, {
      access: "public", // Public URL milega
    });
    return url; // Ye URL database me store karna
  } catch (error) {
    console.error("Image Upload Error:", error);
    return null;
  }
}
