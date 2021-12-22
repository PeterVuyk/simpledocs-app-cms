import { functions } from '../firebaseConnection';
import { ApiResponse } from '../../model/ApiResponse';

async function getTextFromHtml(html: string): Promise<string> {
  const response = await functions
    .httpsCallable('cms-getTextFromHtml')({ html })
    .then((value) => value.data as ApiResponse);
  if (!response.success) {
    throw new Error(
      `Failed collecting getTextFromHtml from server, message server: ${response.message}`
    );
  }
  return response.result! as string;
}

export default getTextFromHtml;
