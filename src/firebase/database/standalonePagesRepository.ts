import firebase from 'firebase/compat';
import { database } from '../firebaseConnection';
import { AGGREGATE_STANDALONE_PAGES } from '../../model/Aggregate';
import { StandalonePage } from '../../model/standalonePages/StandalonePage';
import omit from '../../helper/object/omit';

async function getStandalonePageById(
  id: string
): Promise<StandalonePage | null> {
  const documentSnapshot = await database
    .collection(AGGREGATE_STANDALONE_PAGES)
    .doc(id.trim())
    .get();
  return {
    id: documentSnapshot.id,
    ...documentSnapshot.data(),
  } as StandalonePage;
}

async function updateOrCreatePage(
  standalonePage: StandalonePage
): Promise<void> {
  return database
    .collection(AGGREGATE_STANDALONE_PAGES)
    .doc(standalonePage.id)
    .set(omit(standalonePage, ['id']));
}

async function markPageForDeletion(id: string): Promise<void> {
  return database
    .collection(AGGREGATE_STANDALONE_PAGES)
    .doc(id)
    .update({ markedForDeletion: true });
}

async function updateStandalonePage(
  standalonePage: StandalonePage
): Promise<void> {
  const originalId = standalonePage.id?.replace('-draft', '') ?? '';
  const originalPage = await getStandalonePageById(originalId);

  await updateOrCreatePage(standalonePage);
  if (originalPage) {
    await markPageForDeletion(originalId);
  }
}

async function getStandalonePages(): Promise<StandalonePage[]> {
  const querySnapshot = await database
    .collection(AGGREGATE_STANDALONE_PAGES)
    .get();
  return querySnapshot.docs.map((result) => {
    return { id: result.id, ...result.data() } as StandalonePage;
  });
}

async function removeDraft(draftId: string): Promise<void> {
  const publishedRef = database
    .collection(AGGREGATE_STANDALONE_PAGES)
    .doc(draftId.replace('-draft', ''));
  const draftRef = database.collection(AGGREGATE_STANDALONE_PAGES).doc(draftId);

  const batch = database.batch();
  batch.delete(draftRef);
  batch.update(publishedRef, { markedForDeletion: false });
  return batch.commit();
}

const standalonePagesRepository = {
  getStandalonePages,
  updateStandalonePage,
  getStandalonePageById,
  removeDraft,
};

export default standalonePagesRepository;
