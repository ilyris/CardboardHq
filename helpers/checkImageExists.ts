export const checkImageExists = async (url: string) => {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok; // Returns true if the image exists (status code 200)
  } catch (error) {
    console.error("Error fetching the image:", error);
    return false; // Return false if there's an error (e.g., network issue)
  }
};
