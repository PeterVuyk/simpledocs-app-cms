import { database } from '../firebaseConnection';
import { AGGREGATE_CALCULATIONS } from '../../model/Aggregate';
import { CalculationInfo } from '../../model/CalculationInfo';
import { CalculationType } from '../../model/CalculationType';

async function removeCalculationsDraft(
  calculationType: CalculationType
): Promise<void> {
  const querySnapshot = await database
    .collection(AGGREGATE_CALCULATIONS)
    .where('calculationType', '==', calculationType)
    .where('isDraft', '==', true)
    .get();

  if (querySnapshot.size !== 1) {
    throw new Error(
      `Tried to remove a calculation draft but found not 1 but ${querySnapshot.size}, nothing removed.`
    );
  }

  await database
    .collection(AGGREGATE_CALCULATIONS)
    .doc(querySnapshot.docs[0].id)
    .delete();
}

async function getCalculationsInfo(
  isDraft: boolean
): Promise<CalculationInfo[]> {
  const querySnapshot = await database
    .collection(AGGREGATE_CALCULATIONS)
    .where('isDraft', '==', isDraft)
    .get();
  return querySnapshot.docs.map((result) => result.data() as CalculationInfo);
}

async function getCalculationsInfoToEdit(
  calculationType: CalculationType
): Promise<CalculationInfo | null> {
  const querySnapshot = await database
    .collection(AGGREGATE_CALCULATIONS)
    .where('calculationType', '==', calculationType)
    .get();
  const calculationInfos = querySnapshot.docs.map(
    (result) => result.data() as CalculationInfo
  );

  if (calculationInfos.length === 0) {
    return null;
  }
  return calculationInfos.find((info) => info.isDraft) || calculationInfos[0];
}

async function updateCalculationsInfo(
  calculationInfo: CalculationInfo
): Promise<void> {
  const querySnapshot = await database
    .collection(AGGREGATE_CALCULATIONS)
    .where('calculationType', '==', calculationInfo.calculationType)
    .where('isDraft', '==', true)
    .limit(1)
    .get();

  if (querySnapshot.empty) {
    await database.collection(AGGREGATE_CALCULATIONS).add(calculationInfo);
    return;
  }

  await database
    .collection(AGGREGATE_CALCULATIONS)
    .doc(querySnapshot.docs[0].id)
    .set(calculationInfo);
}

const calculationsRepository = {
  getCalculationsInfoToEdit,
  getCalculationsInfo,
  updateCalculationsInfo,
  removeCalculationsDraft,
};

export default calculationsRepository;
