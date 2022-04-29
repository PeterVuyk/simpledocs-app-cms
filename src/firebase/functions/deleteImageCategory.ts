import { functions } from '../firebaseConnection';
import { ApiResponse } from '../../model/ApiResponse';
import { ImageLibraryType } from '../../model/imageLibrary/ImageLibraryType';

async function deleteImageCategory(
  category: string,
  imageLibraryType: ImageLibraryType
): Promise<void> {
  return functions
    .httpsCallable('cms-deleteImageCategory')({ category, imageLibraryType })
    .then((value) => value.data as ApiResponse)
    .then((response) => {
      if (!response.success) {
        throw new Error(
          `Failed deleting category, message server: ${response.message}`
        );
      }
    });
}

export default deleteImageCategory;
