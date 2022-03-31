import { functions } from '../firebaseConnection';
import { ApiResponse } from '../../model/ApiResponse';

async function getTextFromHtml(html: string): Promise<string> {
  return functions
    .httpsCallable('cms-getTextFromHtml')({ html })
    .then((value) => value.data as ApiResponse)
    .then((response) => {
      if (!response.success) {
        throw new Error(
          `Failed collecting getTextFromHtml from server, message server: ${response.message}`
        );
      }
      return response.result! as string;
    });
}

export default getTextFromHtml;
