import { database } from '../firebaseConnection';
import { AGGREGATE_CALCULATIONS } from '../../model/Aggregate';
import { CalculationInfo } from '../../model/CalculationInfo';

async function getCalculationsInfo(): Promise<CalculationInfo[]> {
  const querySnapshot = await database.collection(AGGREGATE_CALCULATIONS).get();
  return querySnapshot.docs.map((result) => result.data() as CalculationInfo);
}

async function updateCalculationsInfo(
  calculationInfo: CalculationInfo
): Promise<void> {
  const querySnapshot = await database
    .collection(AGGREGATE_CALCULATIONS)
    .where('calculationType', '==', calculationInfo.calculationType)
    .get();
  await database
    .collection(AGGREGATE_CALCULATIONS)
    .add(calculationInfo)
    .then(() => {
      const batch = database.batch();
      querySnapshot.forEach((documentSnapshot) => {
        batch.delete(documentSnapshot.ref);
      });
      return batch.commit();
    });
}

const calculationsRepository = {
  getCalculationsInfo,
  updateCalculationsInfo,
};

export default calculationsRepository;
