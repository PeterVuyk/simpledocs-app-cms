import firebase from 'firebase/compat/app';
import { database } from '../../firebaseConnection';
import { Versioning } from '../../../model/Versioning';
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
  });
};

const removeMarkedForDeletionPages = async (
  batch: firebase.firestore.WriteBatch,
  versioning: Versioning
) => {
  const querySnapshotDeletion = await database
    .collection('books')
    .doc(versioning.aggregate)
    .collection(versioning.aggregate)
    .where('markedForDeletion', '==', true)
    .get();
  querySnapshotDeletion.forEach((documentSnapshot) => {
    batch.delete(documentSnapshot.ref);
  });
};

const publishDraftPages = async (
  batch: firebase.firestore.WriteBatch,
  versioning: Versioning
) => {
  const querySnapshotToBePublished = await database
    .collection('books')
    .doc(versioning.aggregate)
    .collection(versioning.aggregate)
    .where('isDraft', '==', true)
    .get();

  querySnapshotToBePublished.forEach((documentSnapshot) => {
    const page = documentSnapshot.data() as Page;
    page.isDraft = false;
    const documentReference = database
      .collection('books')
      .doc(versioning.aggregate)
      .collection(versioning.aggregate)
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
  await removeMarkedForDeletionPages(batch, versioning);
  await publishDraftPages(batch, versioning);

  return batch.commit();
}

const publishBookPagesRepository = {
  publish,
};

export default publishBookPagesRepository;
