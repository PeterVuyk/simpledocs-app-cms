import firebase from 'firebase/compat/app';
import { database } from '../../firebaseConnection';
import { AGGREGATE_CALCULATIONS } from '../../../model/Aggregate';
import { Versioning } from '../../../model/Versioning';
import { CalculationInfo } from '../../../model/calculations/CalculationInfo';

const updateVersion = async (
  batch: firebase.firestore.WriteBatch,
  versioning: Versioning,
  newVersion: string
) => {
  const snapshot = await database
    .collection('configurations')
    .doc('appConfigurations')
    .get();
  batch.update(snapshot.ref, {
    [`versioning.${versioning.aggregate}.version`]: newVersion,
    [`versioning.${versioning.aggregate}.updateMoment`]:
      versioning.updateMoment,
  });
};

const getDraftCalculations = async () => {
  const querySnapshot = await database
    .collection(AGGREGATE_CALCULATIONS)
    .where('isDraft', '==', true)
    .get();
  return querySnapshot.docs.map((value) => value.data() as CalculationInfo);
};

const replacePublishedCalculationsWithDraft = async (
  batch: firebase.firestore.WriteBatch,
  versioning: Versioning,
  draftCalculations: CalculationInfo[]
) => {
  // 3: Remove calculations that need to be replaced
  const querySnapshotCalculations = await database
    .collection(versioning.aggregate)
    .where('isDraft', '==', false)
    .get();
  querySnapshotCalculations.forEach((documentSnapshot) => {
    const calculation = documentSnapshot.data() as CalculationInfo;
    if (
      draftCalculations.find(
        (value) => value.calculationType === calculation.calculationType
      )
    ) {
      batch.delete(documentSnapshot.ref);
    }
  });
};

const removeDrafts = async (
  batch: firebase.firestore.WriteBatch,
  versioning: Versioning
) => {
  // 4: Remove 'draft' from calculations
  const querySnapshotDrafts = await database
    .collection(versioning.aggregate)
    .where('isDraft', '==', true)
    .get();
  querySnapshotDrafts.forEach((documentSnapshot) => {
    batch.update(documentSnapshot.ref, { isDraft: false });
  });
};

async function publish(
  versioning: Versioning,
  newVersion: string
): Promise<void> {
  const batch = database.batch();

  await updateVersion(batch, versioning, newVersion);
  const draftCalculations = await getDraftCalculations();
  if (draftCalculations.length === 0) {
    return batch.commit();
  }

  await replacePublishedCalculationsWithDraft(
    batch,
    versioning,
    draftCalculations
  );

  await removeDrafts(batch, versioning);

  return batch.commit();
}

const publishRepository = {
  publish,
};

export default publishRepository;
