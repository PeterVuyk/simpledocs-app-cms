import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebaseConnection';

const getDownloadUrlFromFilePath = async (
  filePath: string
): Promise<string> => {
  return getDownloadURL(ref(storage, filePath));
};

export default getDownloadUrlFromFilePath;
