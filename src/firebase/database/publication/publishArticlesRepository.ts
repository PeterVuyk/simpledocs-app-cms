import firebase from 'firebase/compat/app';
import { database } from '../../firebaseConnection';
import { Versioning } from '../../../model/Versioning';

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

const removeMarkedForDeletionArticles = async (
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

const publishDraftArticles = async (
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
    batch.update(documentSnapshot.ref, { isDraft: false });
  });
};

async function publish(
  versioning: Versioning,
  newVersion: string
): Promise<void> {
  const batch = database.batch();

  await updateVersion(batch, versioning, newVersion);
  await removeMarkedForDeletionArticles(batch, versioning);
  await publishDraftArticles(batch, versioning);

  return batch.commit();
}

const publishRepository = {
  publish,
};

export default publishRepository;
