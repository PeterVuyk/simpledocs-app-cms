import { ref, listAll } from 'firebase/storage';
import { storage } from '../firebaseConnection';

// Create a reference under which you want to list
const listRef = ref(storage, 'image-library/');

const getImageLibraryCategories = async (): Promise<string[]> => {
  return listAll(listRef)
    .then((res) => res.prefixes.map((folderRef) => folderRef.name))
    .then((result) => result.sort((a, b) => a.localeCompare(b)));
};

export default getImageLibraryCategories;
