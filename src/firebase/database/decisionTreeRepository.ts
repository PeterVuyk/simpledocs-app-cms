import { database } from '../firebaseConnection';
import { AGGREGATE_DECISION_TREE } from '../../model/Aggregate';
import { DecisionTreeStep } from '../../model/DecisionTreeStep';
import {
  EDIT_STATUS_DRAFT,
  EDIT_STATUS_PUBLISHED,
  EditStatus,
} from '../../model/EditStatus';

async function getDecisionTreeSteps(
  draftPage: boolean
): Promise<DecisionTreeStep[]> {
  const querySnapshot = await database
    .collection(AGGREGATE_DECISION_TREE)
    .orderBy('title', 'desc')
    .orderBy('id', 'asc')
    .get();
  const steps = querySnapshot.docs.map((doc) => {
    return doc.data() as DecisionTreeStep;
  });
  if (draftPage) {
    return steps.filter((step) => step.isDraft || step.markedForDeletion);
  }
  return steps.filter((step) => !step.isDraft);
}

async function updateDecisionTreeSteps(
  decisionTreeSteps: DecisionTreeStep[]
): Promise<void> {
  const querySnapshot = await database
    .collection(AGGREGATE_DECISION_TREE)
    .where('title', '==', decisionTreeSteps[0].title)
    .get();

  const batch = database.batch();
  querySnapshot.forEach((documentSnapshot) => {
    const step = documentSnapshot.data() as DecisionTreeStep;
    if (step.isDraft) {
      batch.delete(documentSnapshot.ref);
    } else {
      batch.update(documentSnapshot.ref, { markedForDeletion: true });
    }
  });

  decisionTreeSteps.forEach((decisionTreeStep) =>
    database.collection(AGGREGATE_DECISION_TREE).add(decisionTreeStep)
  );

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
    const decisionTreeStep = documentSnapshot.data() as DecisionTreeStep;
    if (editStatus === EDIT_STATUS_DRAFT && decisionTreeStep.isDraft) {
      batch.delete(documentSnapshot.ref);
    }
    if (editStatus === EDIT_STATUS_PUBLISHED && !decisionTreeStep.isDraft) {
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
    const decisionTreeStep = documentSnapshot.data() as DecisionTreeStep;
    if (decisionTreeStep.isDraft) {
      batch.delete(documentSnapshot.ref);
    } else {
      batch.update(documentSnapshot.ref, { markedForDeletion: false });
    }
  });
  return batch.commit();
}

const decisionTreeRepository = {
  updateDecisionTreeSteps,
  getDecisionTreeSteps,
  deleteByTitle,
  removeMarkForDeletion,
};

export default decisionTreeRepository;
