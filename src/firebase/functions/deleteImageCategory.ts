import { functions } from '../firebaseConnection';
import { ApiResponse } from '../../model/ApiResponse';

async function deleteImageCategory(category: string): Promise<void> {
  const response = await functions
    .httpsCallable('cms-deleteImageCategory')({ category })
    .then((value) => value.data as ApiResponse);
  if (!response.success) {
    throw new Error(
      `Failed deleting category, message server: ${response.message}`
    );
  }
}

export default deleteImageCategory;
