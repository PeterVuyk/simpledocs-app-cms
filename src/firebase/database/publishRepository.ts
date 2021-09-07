import { database } from '../firebaseConnection';
import {
  AGGREGATE_APP_CONFIG,
  AGGREGATE_APP_CONFIG_DRAFT,
  AGGREGATE_CALCULATIONS,
  AGGREGATE_DECISION_TREE,
  AGGREGATE_INSTRUCTION_MANUAL,
  AGGREGATE_REGULATION_BRANCHERICHTLIJN_MEDISCHE_HULPVERLENING,
  AGGREGATE_REGULATION_OGS_2009,
  AGGREGATE_REGULATION_ONTHEFFING_GOEDE_TAAKUITVOERING,
  AGGREGATE_REGULATION_RVV_1990,
} from '../../model/Aggregate';
import { Versioning } from '../../model/Versioning';
import { DecisionTreeStep } from '../../model/DecisionTreeStep';
import { CalculationInfo } from '../../model/CalculationInfo';
import artifactsRepository from './artifactsRepository';

async function getVersions(): Promise<Versioning[]> {
  const versioning = await database
    .collection('versioning')
    .doc('aggregate')
    .get();
  // @ts-ignore
  return Object.entries(versioning.data())
    .map(([key, value]) => {
      return { aggregate: key, version: value } as Versioning;
    })
    .sort((a, b) => a.aggregate.localeCompare(b.aggregate));
}

async function publishDecisionTree(
  versioning: Versioning,
  newVersion: string
): Promise<void> {
  const batch = database.batch();

  // 1: Update version
  const DocumentSnapshotAggregate = await database
    .collection('versioning')
    .doc('aggregate')
    .get();
  batch.update(DocumentSnapshotAggregate.ref, {
    [versioning.aggregate]: newVersion,
  });

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
    const querySnapshotUpdatedTitles = await database
      .collection(AGGREGATE_DECISION_TREE)
      .where('isDraft', '==', false)
      .where('title', 'in', updatedTitles)
      .get();
    querySnapshotUpdatedTitles.forEach((documentSnapshot) => {
      batch.delete(documentSnapshot.ref);
    });
  }

  // 4: Replace contentId reference with htmlFile
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
          content: value.file,
          contentType: value.extension,
        });
      });
  });

  // 5: Update draft true to false
  const querySnapshotToBePublished = await database
    .collection(versioning.aggregate)
    .where('isDraft', '==', true)
    .get();

  querySnapshotToBePublished.forEach((documentSnapshot) => {
    batch.update(documentSnapshot.ref, { isDraft: false });
  });

  return batch.commit();
}

async function publishUpdatedAppConfig(
  versioning: Versioning,
  newVersion: string
): Promise<void> {
  const batch = database.batch();

  // 1: Update version
  const DocumentSnapshotAggregate = await database
    .collection('versioning')
    .doc('aggregate')
    .get();
  batch.update(DocumentSnapshotAggregate.ref, {
    [versioning.aggregate]: newVersion,
  });

  // 2: if a draft from the appConfig does not exist, return
  const draftConfigurationRef = database
    .collection('config')
    .doc(AGGREGATE_APP_CONFIG_DRAFT);
  const docSnapshot = await draftConfigurationRef.get();
  if (!docSnapshot.exists) {
    return batch.commit();
  }

  // 3: remove draft
  const draftConfig = await draftConfigurationRef.get();
  batch.delete(draftConfigurationRef);

  // 4: overwrite published met draft
  const publishedConfigurationRef = database
    .collection('config')
    .doc(AGGREGATE_APP_CONFIG);
  batch.set(publishedConfigurationRef, draftConfig.data());

  return batch.commit();
}

async function publishUpdatedArticles(
  versioning: Versioning,
  newVersion: string
): Promise<void> {
  const batch = database.batch();

  // 1: Update version:
  const documentSnapshotAggregate = await database
    .collection('versioning')
    .doc('aggregate')
    .get();
  batch.update(documentSnapshotAggregate.ref, {
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

async function publishUpdatedCalculations(
  versioning: Versioning,
  newVersion: string
): Promise<void> {
  const batch = database.batch();

  // 1: Update version
  const DocumentSnapshotAggregate = await database
    .collection('versioning')
    .doc('aggregate')
    .get();
  batch.update(DocumentSnapshotAggregate.ref, {
    [versioning.aggregate]: newVersion,
  });

  // 2: if drafts from the calculations does not exist, return
  const querySnapshot = await database
    .collection(AGGREGATE_CALCULATIONS)
    .where('isDraft', '==', true)
    .get();
  if (querySnapshot.size === 0) {
    return batch.commit();
  }

  // 3: Remove calculations that need to be replaced
  const calculationInfos = querySnapshot.docs
    .map((result) => result.data() as CalculationInfo)
    .filter((value) => value.isDraft);
  const querySnapshotCalculations = await database
    .collection(versioning.aggregate)
    .where('isDraft', '==', false)
    .get();
  querySnapshotCalculations.forEach((documentSnapshot) => {
    const calculation = documentSnapshot.data() as CalculationInfo;
    if (
      calculationInfos.find(
        (value) => value.calculationType === calculation.calculationType
      )
    ) {
      batch.delete(documentSnapshot.ref);
    }
  });

  // 4: Remove 'draft' from calculations
  const querySnapshotDrafts = await database
    .collection(versioning.aggregate)
    .where('isDraft', '==', true)
    .get();
  querySnapshotDrafts.forEach((documentSnapshot) => {
    batch.update(documentSnapshot.ref, { isDraft: false });
  });

  return batch.commit();
}

async function updateVersion(
  versioning: Versioning,
  newVersion: string
): Promise<void> {
  switch (versioning.aggregate) {
    case AGGREGATE_DECISION_TREE:
      await publishDecisionTree(versioning, newVersion);
      break;
    case AGGREGATE_REGULATION_BRANCHERICHTLIJN_MEDISCHE_HULPVERLENING:
    case AGGREGATE_REGULATION_ONTHEFFING_GOEDE_TAAKUITVOERING:
    case AGGREGATE_REGULATION_OGS_2009:
    case AGGREGATE_REGULATION_RVV_1990:
    case AGGREGATE_INSTRUCTION_MANUAL:
      await publishUpdatedArticles(versioning, newVersion);
      break;
    case AGGREGATE_APP_CONFIG:
      await publishUpdatedAppConfig(versioning, newVersion);
      break;
    case AGGREGATE_CALCULATIONS:
      await publishUpdatedCalculations(versioning, newVersion);
      break;
    default:
      throw new Error(
        `Nothing to update, no aggregates found for aggregate: ${versioning.aggregate}, version: ${versioning.version}`
      );
  }
}

const publishRepository = {
  getVersions,
  updateVersion,
};

export default publishRepository;
