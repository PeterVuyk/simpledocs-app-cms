import { database } from '../firebaseConnection';
import {
  AGGREGATE_ARTIFACTS,
  AGGREGATE_STANDALONE_PAGES,
} from '../../model/Aggregate';
import { StandalonePage } from '../../model/standalonePages/StandalonePage';
import omit from '../../helper/object/omit';
import { Artifact } from '../../model/artifacts/Artifact';

async function updateStandalonePage(
  standalonePage: StandalonePage
): Promise<void> {
  return database
    .collection(AGGREGATE_STANDALONE_PAGES)
    .doc(standalonePage.id)
    .set(omit(standalonePage, ['id']));
}

async function getStandalonePages(): Promise<StandalonePage[]> {
  const querySnapshot = await database
    .collection(AGGREGATE_STANDALONE_PAGES)
    .get();
  return querySnapshot.docs.map((result) => {
    return { id: result.id, ...result.data() } as StandalonePage;
  });
}

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

const standalonePagesRepository = {
  getStandalonePages,
  updateStandalonePage,
  getStandalonePageById,
};

export default standalonePagesRepository;
