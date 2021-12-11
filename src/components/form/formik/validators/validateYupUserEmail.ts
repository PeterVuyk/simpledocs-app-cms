import * as Yup from 'yup';
import { StringSchema } from 'yup';

const validateYupUserEmail = (): StringSchema<string | null | undefined> => {
  return Yup.string()
    .email('ongeldig emailadres')
    .required('Het emailadres is een verplicht veld.');
};

export default validateYupUserEmail;
