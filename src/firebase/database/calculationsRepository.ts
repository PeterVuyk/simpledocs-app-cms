import { database } from '../firebaseConnection';

export interface CalculationInfo {
  calculationType: string;
  title: string;
  explanation: string;
  regulationButtonText: string;
  htmlFile: string;
  iconFile: string;
  calculationImage: string;
}

async function getCalculationsInfo(): Promise<CalculationInfo[]> {
  const querySnapshot = await database.collection('calculations').get();
  return querySnapshot.docs.map((result) => result.data() as CalculationInfo);
}

async function updateCalculationsInfo(calculationInfo: CalculationInfo) {
  const querySnapshot = await database
    .collection('calculations')
    .where('calculationType', '==', calculationInfo.calculationType)
    .get();
  await database
    .collection('calculations')
    .add(calculationInfo)
    .then(() => {
      const batch = database.batch();
      querySnapshot.forEach((documentSnapshot) => {
        batch.delete(documentSnapshot.ref);
      });
      return batch.commit();
    });
}

const versioningRepository = {
  getCalculationsInfo,
  updateCalculationsInfo,
};

export default versioningRepository;
