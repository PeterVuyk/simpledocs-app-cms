import { ref, listAll } from 'firebase/storage';
import { storage } from '../firebaseConnection';
import {
  IMAGE_LIBRARY_IMAGES,
  ImageLibraryType,
} from '../../model/imageLibrary/ImageLibraryType';

// Create a reference under which you want to list
const imageLibraryRef = ref(storage, 'image-library/');
const iconLibraryRef = ref(storage, 'icon-library/');

const getImageLibraryCategories = async (
  imageLibraryType: ImageLibraryType
): Promise<string[]> => {
  const libraryRef =
    imageLibraryType === IMAGE_LIBRARY_IMAGES
      ? imageLibraryRef
      : iconLibraryRef;

  return listAll(libraryRef)
    .then((res) => res.prefixes.map((folderRef) => folderRef.name))
    .then((result) => result.sort((a, b) => a.localeCompare(b)));
};

export default getImageLibraryCategories;
