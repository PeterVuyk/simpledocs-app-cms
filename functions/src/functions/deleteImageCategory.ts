import * as functions from 'firebase-functions';
import {admin} from '../firebase';

export const deleteImageCategory = functions
    .region(functions.config().api.firebase_region)
    .https.onCall(async (data, context) => {
      // For now we distinguish app users (anonymous without email address) and cms users (with email address).
      // Later we could add something like a admin boolean inside a custom claim
      if (context.auth?.token.email === undefined) {
        return {success: false, message: 'unauthorized to call this function', result: null};
      }
      const path = data.imageLibraryType === 'imageLibrary' ? 'image-library' : 'icon-library';
      return admin.storage().bucket().deleteFiles({prefix: `${path}/${data.category}`})
          .then(() => {
            return {success: true, message: null, result: null};
          })
          .catch((reason) => {
            functions.logger.info(`Failed deleting category ${data.category} for ${data.imageLibraryType}`, reason);
            return {
              success: false,
              message: `Failed deleting category ${data.category} for ${data.imageLibraryType}`,
              result: null,
            };
          });
    });
