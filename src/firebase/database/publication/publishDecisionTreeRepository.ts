import firebase from 'firebase/compat/app';
import { database } from '../../firebaseConnection';
import { AGGREGATE_DECISION_TREE } from '../../../model/Aggregate';
import { Versioning } from '../../../model/Versioning';
import artifactsRepository from '../artifactsRepository';
import { DecisionTree } from '../../../model/DecisionTree/DecisionTree';
import replaceUndefinedWithNull from '../../../helper/object/replaceUndefinedWithNull';

const updateVersion = async (
  batch: firebase.firestore.WriteBatch,
  versioning: Versioning,
  newVersion: string
) => {
  // 1: Update version
  const snapshot = await database
    .collection('configurations')
    .doc('cmsConfigurations')
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

const updateContentIdWithContentFromArtifacts = async (
  batch: firebase.firestore.WriteBatch,
  versioning: Versioning
) => {
  // Step 1: We get all the draft trees
  const querySnapshotWithContentIdReference = await database
    .collection(versioning.aggregate)
    .where('isDraft', '==', true)
    .get();
  const decisionTrees = querySnapshotWithContentIdReference.docs.map((doc) => {
    return doc.data() as DecisionTree;
  });
  // Step 2: We update the trees with the content info
  for (const tree of decisionTrees) {
    for (const step of tree.steps) {
      if (step.contentId) {
        // eslint-disable-next-line no-await-in-loop
        await artifactsRepository
          .getArtifactById(step.contentId)
          .then((artifact) => {
            step.contentId = undefined;
            step.content = artifact.content;
            step.contentType = artifact.contentType;
          });
      }
    }
  }
  // Step 3: We update the decision trees in firestore
  decisionTrees.forEach((tree) => {
    const ref = database.collection('decisionTree').doc();
    batch.set(ref, { ...replaceUndefinedWithNull(tree), isDraft: false });
  });
  // Step 4: Then we remove the trees
  querySnapshotWithContentIdReference.docs.forEach((value) =>
    batch.delete(value.ref)
  );
};

async function publish(
  versioning: Versioning,
  newVersion: string
): Promise<void> {
  const batch = database.batch();

  await updateVersion(batch, versioning, newVersion);

  // 2: Remove markedForDeletion decision trees
  const querySnapshot = await database.collection(versioning.aggregate).get();
  querySnapshot.forEach((documentSnapshot) => {
    if ((documentSnapshot.data() as DecisionTree).markedForDeletion)
      batch.delete(documentSnapshot.ref);
  });

  // 3: Remove published decision tree with updated decision tree
  // A: Get all decisionTrees:
  const decisionTrees = querySnapshot.docs.map(
    (queryDocumentSnapshot) => queryDocumentSnapshot.data() as DecisionTree
  );
  // B: Get all unique titles (draft en published)
  const draftTitles = new Set(
    decisionTrees.filter((step) => step.isDraft).map((step) => step.title)
  );
  const publishedTitles = new Set(
    decisionTrees.filter((step) => !step.isDraft).map((step) => step.title)
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

  return batch.commit();
}

const publishRepository = {
  publish,
};

export default publishRepository;
