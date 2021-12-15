import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebaseConnection';

const fileInImageLibraryExists = async (
  category: string,
  filename: string
): Promise<boolean> => {
  return getDownloadURL(ref(storage, `image-library/${category}/${filename}`))
    .then(() => true)
    .catch(() => false);
};

export default fileInImageLibraryExists;
