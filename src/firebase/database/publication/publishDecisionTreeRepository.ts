import firebase from 'firebase/compat/app';
import { database } from '../../firebaseConnection';
import { AGGREGATE_DECISION_TREE } from '../../../model/Aggregate';
import { Versioning } from '../../../model/Versioning';
import { DecisionTreeStep } from '../../../model/DecisionTreeStep';
import artifactsRepository from '../artifactsRepository';

const updateVersion = async (
  batch: firebase.firestore.WriteBatch,
  versioning: Versioning,
  newVersion: string
) => {
  // 1: Update version
  const snapshot = await database
    .collection('configurations')
    .doc('appConfigurations')
    .get();
  batch.update(snapshot.ref, {
    [`versioning.${versioning.aggregate}.version`]: newVersion,
  });
};

const removePublishedSteps = async (
  batch: firebase.firestore.WriteBatch,
  updatedTitles: string[]
) => {
  const querySnapshotUpdatedTitles = await database
    .collection(AGGREGATE_DECISION_TREE)
    .where('isDraft', '==', false)
    .where('title', 'in', updatedTitles)
    .get();
  querySnapshotUpdatedTitles.forEach((documentSnapshot) => {
    batch.delete(documentSnapshot.ref);
  });
};

const updateDraftTrueToFalse = async (
  batch: firebase.firestore.WriteBatch,
  versioning: Versioning
) => {
  // 5: Update draft true to false
  const querySnapshotToBePublished = await database
    .collection(versioning.aggregate)
    .where('isDraft', '==', true)
    .get();

  querySnapshotToBePublished.forEach((documentSnapshot) => {
    batch.update(documentSnapshot.ref, { isDraft: false });
  });
};

const updateContentIdWithContentFromArtifacts = async (
  batch: firebase.firestore.WriteBatch,
  versioning: Versioning
) => {
  const querySnapshotWithContentIdReference = await database
    .collection(versioning.aggregate)
    .where('isDraft', '==', true)
    .get();

  querySnapshotWithContentIdReference.forEach((documentSnapshot) => {
    const decisionTreeStep = documentSnapshot.data() as DecisionTreeStep;
    if (!decisionTreeStep.contentId) {
      return;
    }
    batch.update(documentSnapshot.ref, { contentId: null });
    artifactsRepository
      .getArtifactById(decisionTreeStep.contentId)
      .then((value) => {
        batch.update(documentSnapshot.ref, {
          content: value.content,
          contentType: value.contentType,
        });
      });
  });
};

async function publish(
  versioning: Versioning,
  newVersion: string
): Promise<void> {
  const batch = database.batch();

  await updateVersion(batch, versioning, newVersion);

  // 2: Remove markedForDeletion steps
  const querySnapshot = await database.collection(versioning.aggregate).get();
  querySnapshot.forEach((documentSnapshot) => {
    if ((documentSnapshot.data() as DecisionTreeStep).markedForDeletion)
      batch.delete(documentSnapshot.ref);
  });

  // 3: Remove published decision tree with updated decision tree
  // A: Get all decisionTreeSteps:
  const decisionTreeSteps = querySnapshot.docs.map(
    (queryDocumentSnapshot) => queryDocumentSnapshot.data() as DecisionTreeStep
  );
  // B: Get all unique titles (draft en published)
  const draftTitles = new Set(
    decisionTreeSteps.filter((step) => step.isDraft).map((step) => step.title)
  );
  const publishedTitles = new Set(
    decisionTreeSteps.filter((step) => !step.isDraft).map((step) => step.title)
  );

  const updatedTitles: string[] = [];
  draftTitles.forEach((draftTitle) => {
    if (publishedTitles.has(draftTitle)) {
      updatedTitles.push(draftTitle);
    }
  });

  // C: If title is both published and draft? then remove all published steps
  if (updatedTitles.length !== 0) {
    await removePublishedSteps(batch, updatedTitles);
  }

  await updateContentIdWithContentFromArtifacts(batch, versioning);
  await updateDraftTrueToFalse(batch, versioning);

  return batch.commit();
}

const publishRepository = {
  publish,
};

export default publishRepository;
