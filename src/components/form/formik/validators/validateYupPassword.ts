import * as Yup from 'yup';
import { StringSchema } from 'yup';

const validateYupPassword = (): StringSchema<string | null | undefined> => {
  return Yup.string()
    .required('Geen wachtwoord opgegeven.')
    .min(8, 'Het wachtwoord moet uit ten minste 8 tekens bestaan.');
};

export default validateYupPassword;
