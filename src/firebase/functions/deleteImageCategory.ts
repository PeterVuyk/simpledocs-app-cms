import { functions } from '../firebaseConnection';
import { ApiResponse } from '../../model/ApiResponse';

async function deleteImageCategory(category: string): Promise<void> {
  return functions
    .httpsCallable('cms-deleteImageCategory')({ category })
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
