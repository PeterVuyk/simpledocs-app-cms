import { database } from '../firebaseConnection';
import { AGGREGATE_STANDALONE_PAGES } from '../../model/Aggregate';
import { StandalonePage } from '../../model/standalonePages/StandalonePage';

async function getStandalonePages(): Promise<StandalonePage[]> {
  const querySnapshot = await database
    .collection(AGGREGATE_STANDALONE_PAGES)
    .get();
  return querySnapshot.docs.map((result) => result.data() as StandalonePage);
}

const standalonePagesRepository = { getStandalonePages };

export default standalonePagesRepository;
