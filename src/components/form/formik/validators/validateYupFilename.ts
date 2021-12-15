import * as Yup from 'yup';
import { StringSchema } from 'yup';
import fileInImageLibraryExists from '../../../../firebase/storage/fileInImageLibraryExists';

const validateYupFilename = (): StringSchema<string | null | undefined> => {
  return Yup.string()
    .required('Het opgeven van een bestandsnaam is verplicht')
    .notOneOf(
      ['.', '..'],
      'Het is niet toegestaan om . of .. als bestandsnaam te gebruiken'
    )
    .matches(
      /^[a-zA-Z0-9_\-. ]+$/,
      'De opgegeven bestandsnaam mag geen speciale karakters bevatten'
    )
    .max(
      64,
      'De bestandsnaam naam is te lang en mag maximaal 64 karakaters bevatten'
    )
    .test(
      'filename',
      'De extensie van het bestand is een onderdeel van de bestandsnaam, geef deze hier ook op',
      async (filename) => {
        return (
          filename !== undefined &&
          (filename.endsWith('.png') ||
            filename.endsWith('.jpg') ||
            filename.endsWith('.jpeg') ||
            filename.endsWith('.svg'))
        );
      }
    )
    .test(
      'filename',
      'Het opgegeven bestand bestaat al in de opgegeven categorie',
      async (filename, context) => {
        if (filename === undefined) {
          return false;
        }
        const exists = await fileInImageLibraryExists(
          context.parent.category,
          filename
        );
        return !exists;
      }
    );
};

export default validateYupFilename;
