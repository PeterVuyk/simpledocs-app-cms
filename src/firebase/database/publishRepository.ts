import { database } from '../firebaseConnection';

export interface Versioning {
  aggregate: string;
  version: string;
}

async function getVersions(): Promise<Versioning[]> {
  const versioning = await database
    .collection('versioning')
    .doc('aggregate')
    .get();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
    versioning.aggregate === 'regulations' ||
    versioning.aggregate === 'instructionManual'
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
