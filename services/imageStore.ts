const CREATURE_IMAGE_PREFIX = 'creature_image_';

export const getCustomCreatureImage = (creatureId: string): string | null => {
  try {
    return localStorage.getItem(`${CREATURE_IMAGE_PREFIX}${creatureId}`);
  } catch (error) {
    console.error("Failed to get image from localStorage", error);
    return null;
  }
};

export const saveCustomCreatureImage = (creatureId: string, base64Image: string) => {
  try {
    localStorage.setItem(`${CREATURE_IMAGE_PREFIX}${creatureId}`, base64Image);
  } catch (error) {
    console.error("Failed to save image to localStorage", error);
  }
};

export const removeCustomCreatureImage = (creatureId: string) => {
  try {
    localStorage.removeItem(`${CREATURE_IMAGE_PREFIX}${creatureId}`);
  } catch (error) {
    console.error("Failed to remove image from localStorage", error);
  }
};
