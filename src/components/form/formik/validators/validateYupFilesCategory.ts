import * as Yup from 'yup';
import { StringSchema } from 'yup';

const validateYupFilesCategory = (): StringSchema<
  string | null | undefined
> => {
  return Yup.string()
    .required('Het opgeven van een categorie is verplicht.')
    .notOneOf(
      ['.', '..'],
      'Het is niet toegestaan om . of .. als categorie te gebruiken'
    )
    .matches(
      /^[a-zA-Z0-9_\-. ]+$/,
      'De opgegeven categorie mag geen speciale karakters bevatten.'
    )
    .max(
      32,
      'De categorie naam is te lang en mag maximaal 32 karakaters bevatten'
    );
};

export default validateYupFilesCategory;
