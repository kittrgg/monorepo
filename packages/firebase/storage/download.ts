import { getDownloadURL, ref } from "firebase/storage";
import { storage } from ".";

/** Return the path to the Firebase document. */

export const download = async (
  fileName: string,
  handler?: (...args: any) => any,
) => {
  try {
    if (!storage) {
      console.log("No storage is up. You're probably testing?");
      return;
    }

    const storageRef = ref(storage, fileName);
    const path = await getDownloadURL(storageRef);

    if (path && handler) return handler(path);
    if (path) return path;
  } catch (err) {
    console.error(err);
    return handler?.(null);
  }
};
