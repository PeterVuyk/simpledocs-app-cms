import { database } from '../firebaseConnection';
import { AGGREGATE_DECISION_TREE } from '../../model/Aggregate';
import { DecisionTreeStep } from '../../model/DecisionTreeStep';

async function createDecisionTreeSteps(
  decisionTreeSteps: DecisionTreeStep[]
): Promise<void> {
  // TODO... await heeft hier geen zin.
  await decisionTreeSteps.forEach((decisionTreeStep) =>
    database.collection(AGGREGATE_DECISION_TREE).add(decisionTreeStep)
  );
}

async function getDecisionTreeSteps(): Promise<DecisionTreeStep[]> {
  const querySnapshot = await database
    .collection(AGGREGATE_DECISION_TREE)
    .orderBy('title', 'desc')
    .orderBy('id', 'asc')
    .get();
  return querySnapshot.docs.map((doc) => {
    return doc.data() as DecisionTreeStep;
  });
}

async function updateDecisionTreeSteps(
  decisionTreeSteps: DecisionTreeStep[]
): Promise<void> {
  const querySnapshot = await database
    .collection(AGGREGATE_DECISION_TREE)
    .where('title', '==', decisionTreeSteps[0].title)
    .get();
  createDecisionTreeSteps(decisionTreeSteps).then(() => {
    const batch = database.batch();
    querySnapshot.forEach((documentSnapshot) => {
      batch.delete(documentSnapshot.ref);
    });
    return batch.commit();
  });
}

async function deleteByTitle(title: string): Promise<void> {
  const querySnapshot = await database
    .collection(AGGREGATE_DECISION_TREE)
    .where('title', '==', title)
    .get();

  const batch = database.batch();
  querySnapshot.forEach((documentSnapshot) => {
    batch.delete(documentSnapshot.ref);
  });
  return batch.commit();
}

const decisionTreeRepository = {
  updateDecisionTreeSteps,
  getDecisionTreeSteps,
  deleteByTitle,
};

export default decisionTreeRepository;
