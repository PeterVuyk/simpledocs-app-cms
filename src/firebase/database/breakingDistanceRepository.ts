import { database } from '../firebaseConnection';

export interface BreakingDistanceInfo {
  title: string;
  explanation: string;
  iconFile: string;
  breakingDistanceImage: string;
  regulationChapter: string;
}

async function getBreakingDistanceInfo(): Promise<BreakingDistanceInfo[]> {
  const querySnapshot = await database.collection('breakingDistance').get();
  return querySnapshot.docs.map(
    (result) => result.data() as BreakingDistanceInfo
  );
}

async function updateBreakingDistanceInfo(
  breakingDistance: BreakingDistanceInfo
) {
  const querySnapshot = await database.collection('breakingDistance').get();
  await database
    .collection('breakingDistance')
    .add(breakingDistance)
    .then(() => {
      const batch = database.batch();
      querySnapshot.forEach((documentSnapshot) => {
        batch.delete(documentSnapshot.ref);
      });
      return batch.commit();
    });
}

const versioningRepository = {
  getBreakingDistanceInfo,
  updateBreakingDistanceInfo,
};

export default versioningRepository;
