import * as Yup from 'yup';
import { StringSchema } from 'yup';
import getUserByEmail from '../../../../firebase/functions/getUserByEmail';

const validateYupUserEmail = (): StringSchema<string | null | undefined> => {
  return Yup.string()
    .email('ongeldig emailadres')
    .required('Het emailadres is een verplicht veld.');
  // .test('email', 'Het opgegeven emailadres bestaat al.', async (email) => {
  //   if (email === null || email === undefined) {
  //     return false;
  //   }
  //   return getUserByEmail(email).then((userInfo) => userInfo === null);
  // });
};

export default validateYupUserEmail;
