import { database } from '../firebaseConnection';
import {
  AGGREGATE_INSTRUCTION_MANUAL,
  AGGREGATE_REGULATION_BRANCHERICHTLIJN_MEDISCHE_HULPVERLENING,
  AGGREGATE_REGULATION_OGS_2009,
  AGGREGATE_REGULATION_ONTHEFFING_GOEDE_TAAKUITVOERING,
  AGGREGATE_REGULATION_RVV_1990,
} from '../../model/Aggregate';
import { Versioning } from '../../model/Versioning';

async function getVersions(): Promise<Versioning[]> {
  const versioning = await database
    .collection('versioning')
    .doc('aggregate')
    .get();
  // @ts-ignore
  return Object.entries(versioning.data()).map(([key, value]) => {
    return { aggregate: key, version: value } as Versioning;
  });
}

async function publishUpdatedArticles(
  versioning: Versioning,
  newVersion: string
): Promise<void> {
  const batch = database.batch();

  // 1: Update version:
  const DocumentSnapshotAggregate = await database
    .collection('versioning')
    .doc('aggregate')
    .get();
  batch.update(DocumentSnapshotAggregate.ref, {
    [versioning.aggregate]: newVersion,
  });

  // 2: Remove articles that are marked for deletion:
  const querySnapshotDeletion = await database
    .collection(versioning.aggregate)
    .where('markedForDeletion', '==', true)
    .get();
  querySnapshotDeletion.forEach((documentSnapshot) => {
    batch.delete(documentSnapshot.ref);
  });

  // 3: Publish drafts:
  const querySnapshotToBePublished = await database
    .collection(versioning.aggregate)
    .where('isDraft', '==', true)
    .get();

  querySnapshotToBePublished.forEach((documentSnapshot) => {
    batch.update(documentSnapshot.ref, { isDraft: false });
  });

  return batch.commit();
}

async function updateVersion(
  versioning: Versioning,
  newVersion: string
): Promise<void> {
  if (
    versioning.aggregate ===
      AGGREGATE_REGULATION_BRANCHERICHTLIJN_MEDISCHE_HULPVERLENING ||
    versioning.aggregate ===
      AGGREGATE_REGULATION_ONTHEFFING_GOEDE_TAAKUITVOERING ||
    versioning.aggregate === AGGREGATE_REGULATION_OGS_2009 ||
    versioning.aggregate === AGGREGATE_REGULATION_RVV_1990 ||
    versioning.aggregate === AGGREGATE_INSTRUCTION_MANUAL
  ) {
    await publishUpdatedArticles(versioning, newVersion);
    return;
  }

  await database
    .collection('versioning')
    .doc('aggregate')
    .update({
      [versioning.aggregate]: newVersion,
    });
}

const publishRepository = {
  getVersions,
  updateVersion,
};

export default publishRepository;
