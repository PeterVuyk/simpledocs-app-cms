import { database } from '../firebaseConnection';

export interface DecisionTreeStep {
  id: number;
  label: string;
  parentId?: number;
  lineLabel?: string;
  regulationChapter?: string;
}

async function createDecisionTreeSteps(
  decisionTreeSteps: DecisionTreeStep[]
): Promise<void> {
  await decisionTreeSteps.forEach((decisionTreeStep) =>
    database.collection('decisionTree').add(decisionTreeStep)
  );
}

async function getDecisionTreeSteps(): Promise<DecisionTreeStep[]> {
  const querySnapshot = await database
    .collection('decisionTree')
    .orderBy('id', 'asc')
    .get();
  return querySnapshot.docs.map((doc) => {
    return doc.data() as DecisionTreeStep;
  });
}

async function updateDecisionTreeSteps(
  decisionTreeSteps: DecisionTreeStep[]
): Promise<void> {
  const querySnapshot = await database.collection('decisionTree').get();
  createDecisionTreeSteps(decisionTreeSteps).then(() => {
    const batch = database.batch();
    querySnapshot.forEach((documentSnapshot) => {
      batch.delete(documentSnapshot.ref);
    });
    return batch.commit();
  });
}

const decisionTreeRepository = {
  updateDecisionTreeSteps,
  getDecisionTreeSteps,
};

export default decisionTreeRepository;
