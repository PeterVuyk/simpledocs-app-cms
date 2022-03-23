import firebase from 'firebase/compat';
import { Versioning } from '../../../model/Versioning';
import { database } from '../../firebaseConnection';
import { AGGREGATE_STANDALONE_PAGES } from '../../../model/Aggregate';
import { Page } from '../../../model/Page';

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

const removeMarkedForDeletionPages = async (
  batch: firebase.firestore.WriteBatch
) => {
  const querySnapshotDeletion = await database
    .collection(AGGREGATE_STANDALONE_PAGES)
    .where('markedForDeletion', '==', true)
    .get();
  querySnapshotDeletion.forEach((documentSnapshot) => {
    batch.delete(documentSnapshot.ref);
  });
};

const publishDraftPages = async (batch: firebase.firestore.WriteBatch) => {
  const querySnapshotToBePublished = await database
    .collection(AGGREGATE_STANDALONE_PAGES)
    .where('isDraft', '==', true)
    .get();

  querySnapshotToBePublished.forEach((documentSnapshot) => {
    const page = documentSnapshot.data() as Page;
    page.isDraft = false;
    const documentReference = database
      .collection(AGGREGATE_STANDALONE_PAGES)
      .doc(documentSnapshot.ref.id.replace('-draft', ''));
    batch.set(documentReference, page);
    batch.delete(documentSnapshot.ref);
  });
};

async function publish(
  versioning: Versioning,
  newVersion: string
): Promise<void> {
  const batch = database.batch();
  await updateVersion(batch, versioning, newVersion);
  await removeMarkedForDeletionPages(batch);
  await publishDraftPages(batch);

  return batch.commit();
}

const publishStandalonePagesRepository = {
  publish,
};

export default publishStandalonePagesRepository;
