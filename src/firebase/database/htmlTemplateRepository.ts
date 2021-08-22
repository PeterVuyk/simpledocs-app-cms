import { database } from '../firebaseConnection';
import { HtmlTemplate } from '../../model/HtmlTemplate';

async function getDefaultHtmlTemplate(): Promise<HtmlTemplate | null> {
  const result = await database
    .collection('htmlTemplates')
    .where('title', '==', 'standaard')
    .limit(1)
    .get()
    .then((querySnapshot) => {
      if (!querySnapshot.empty) {
        return {
          id: querySnapshot.docs[0].id,
          ...querySnapshot.docs[0].data(),
        } as HtmlTemplate;
      }
      return null;
    });
  return result;
}

async function getHtmlTemplates(): Promise<HtmlTemplate[]> {
  const querySnapshot = await database.collection('htmlTemplates').get();
  return querySnapshot.docs.map((doc) => {
    return { id: doc.id, ...doc.data() } as HtmlTemplate;
  });
}

const htmlTemplateRepository = {
  getHtmlTemplates,
  getDefaultHtmlTemplate,
};

export default htmlTemplateRepository;
