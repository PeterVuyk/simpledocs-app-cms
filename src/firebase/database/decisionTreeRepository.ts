import { database } from '../firebaseConnection';
import { AGGREGATE_DECISION_TREE } from '../../model/Aggregate';
import {
  EDIT_STATUS_DRAFT,
  EDIT_STATUS_PUBLISHED,
  EditStatus,
} from '../../model/EditStatus';
import { DecisionTree } from '../../model/DecisionTree/DecisionTree';

async function getDecisionTree(draftPage: boolean): Promise<DecisionTree[]> {
  const querySnapshot = await database
    .collection(AGGREGATE_DECISION_TREE)
    .orderBy('title', 'desc')
    .get();
  const steps = querySnapshot.docs.map((doc) => {
    return doc.data() as DecisionTree;
  });
  if (draftPage) {
    return steps.filter((tree) => tree.isDraft || tree.markedForDeletion);
  }
  return steps.filter((step) => !step.isDraft);
}

async function updateDecisionTree(decisionTree: DecisionTree): Promise<void> {
  const querySnapshot = await database
    .collection(AGGREGATE_DECISION_TREE)
    .where('title', '==', decisionTree.title)
    .get();

  const batch = database.batch();
  querySnapshot.forEach((documentSnapshot) => {
    const existingDecisionTree = documentSnapshot.data() as DecisionTree;
    if (existingDecisionTree.isDraft) {
      batch.delete(documentSnapshot.ref);
    } else {
      batch.update(documentSnapshot.ref, { markedForDeletion: true });
    }
  });
  await database.collection(AGGREGATE_DECISION_TREE).add(decisionTree);
  return batch.commit();
}

async function deleteByTitle(
  title: string,
  editStatus: EditStatus
): Promise<void> {
  const querySnapshot = await database
    .collection(AGGREGATE_DECISION_TREE)
    .where('title', '==', title)
    .get();

  const batch = database.batch();
  querySnapshot.forEach((documentSnapshot) => {
    const decisionTree = documentSnapshot.data() as DecisionTree;
    if (editStatus === EDIT_STATUS_DRAFT && decisionTree.isDraft) {
      batch.delete(documentSnapshot.ref);
    }
    if (editStatus === EDIT_STATUS_PUBLISHED && !decisionTree.isDraft) {
      batch.update(documentSnapshot.ref, { markedForDeletion: true });
    }
  });
  return batch.commit();
}

async function removeMarkForDeletion(title: string): Promise<void> {
  const querySnapshot = await database
    .collection(AGGREGATE_DECISION_TREE)
    .where('title', '==', title)
    .get();

  const batch = database.batch();
  querySnapshot.forEach((documentSnapshot) => {
    const decisionTree = documentSnapshot.data() as DecisionTree;
    if (decisionTree.isDraft) {
      batch.delete(documentSnapshot.ref);
    } else {
      batch.update(documentSnapshot.ref, { markedForDeletion: false });
    }
  });
  return batch.commit();
}

const decisionTreeRepository = {
  updateDecisionTree,
  getDecisionTree,
  deleteByTitle,
  removeMarkForDeletion,
};

export default decisionTreeRepository;
