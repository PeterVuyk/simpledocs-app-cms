import firebase from 'firebase';
import { database } from '../firebaseConnection';
import {
  AGGREGATE_APP_CONFIGURATIONS,
  AGGREGATE_CALCULATIONS,
  AGGREGATE_CMS_CONFIGURATIONS,
  AGGREGATE_DECISION_TREE,
} from '../../model/Aggregate';
import { Versioning, Versions } from '../../model/Versioning';
import { DecisionTreeStep } from '../../model/DecisionTreeStep';
import { CalculationInfo } from '../../model/CalculationInfo';
import artifactsRepository from './artifactsRepository';
import {
  APP_CONFIGURATIONS,
  CMS_CONFIGURATIONS,
  ConfigurationType,
  getDraftFromConfigurationType,
} from '../../model/ConfigurationType';
import { CmsConfiguration } from '../../model/CmsConfiguration';

async function addVersion(versioning: Versioning): Promise<void> {
  await database
    .collection('configurations')
    .doc('appConfigurations')
    .update({
      [`versioning.${versioning.aggregate}`]: {
        version: versioning.version,
        isBookType: versioning.isBookType,
      },
    });
}

async function removeVersion(versioning: Versioning): Promise<void> {
  await database
    .collection('configurations')
    .doc('appConfigurations')
    .update({
      [`versioning.${versioning.aggregate}`]:
        firebase.firestore.FieldValue.delete(),
    });
}

async function publishDecisionTree(
  versioning: Versioning,
  newVersion: string
): Promise<void> {
  const batch = database.batch();

  // 1: Update version
  const snapshot = await database
    .collection('configurations')
    .doc('appConfigurations')
    .get();
  batch.update(snapshot.ref, {
    [`versioning.${versioning.aggregate}.version`]: newVersion,
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

  // 4: Replace contentId reference with content
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

async function publishUpdatedConfigurations(
  configurationType: ConfigurationType,
  versioning: Versioning,
  newVersion: string
): Promise<void> {
  const batch = database.batch();

  // 1: Update version
  const snapshot = await database
    .collection('configurations')
    .doc(configurationType)
    .get();
  batch.update(snapshot.ref, {
    [`versioning.${versioning.aggregate}.version`]: newVersion,
  });

  // 2: if a draft from the app/cmsConfiguration does not exist, return
  const draftConfigurationRef = database
    .collection('configurations')
    .doc(getDraftFromConfigurationType(configurationType));
  const docSnapshot = await draftConfigurationRef.get();
  if (!docSnapshot.exists) {
    return batch.commit();
  }
  // 3: remove draft
  const draftConfig = await draftConfigurationRef.get();
  batch.delete(draftConfigurationRef);

  const config = snapshot.data() as any;
  const configVersioning = config.versioning as Versions;

  // 4: overwrite published met draft
  const publishedConfigurationRef = database
    .collection('configurations')
    .doc(configurationType);
  batch.set(publishedConfigurationRef, {
    ...draftConfig.data(),
    versioning: configVersioning,
  });
  batch.update(snapshot.ref, {
    [`versioning.${versioning.aggregate}.version`]: newVersion,
  });

  return batch.commit();
}

async function publishUpdatedArticles(
  versioning: Versioning,
  newVersion: string
): Promise<void> {
  const batch = database.batch();

  // 1: Update version
  const snapshot = await database
    .collection('configurations')
    .doc('appConfigurations')
    .get();
  batch.update(snapshot.ref, {
    [`versioning.${versioning.aggregate}.version`]: newVersion,
  });

  // 2: Remove articles that are marked for deletion:
  const querySnapshotDeletion = await database
    .collection('books')
    .doc(versioning.aggregate)
    .collection(versioning.aggregate)
    .where('markedForDeletion', '==', true)
    .get();
  querySnapshotDeletion.forEach((documentSnapshot) => {
    batch.delete(documentSnapshot.ref);
  });

  // 3: Publish drafts:
  const querySnapshotToBePublished = await database
    .collection('books')
    .doc(versioning.aggregate)
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
  const snapshot = await database
    .collection('configurations')
    .doc('appConfigurations')
    .get();
  batch.update(snapshot.ref, {
    [`versioning.${versioning.aggregate}.version`]: newVersion,
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
  configuration: CmsConfiguration,
  versioning: Versioning,
  newVersion: string
): Promise<void> {
  if (
    Object.keys(configuration.books.bookItems).includes(versioning.aggregate)
  ) {
    await publishUpdatedArticles(versioning, newVersion);
    return;
  }
  switch (versioning.aggregate) {
    case AGGREGATE_DECISION_TREE:
      await publishDecisionTree(versioning, newVersion);
      break;
    case AGGREGATE_APP_CONFIGURATIONS:
      await publishUpdatedConfigurations(
        APP_CONFIGURATIONS,
        versioning,
        newVersion
      );
      break;
    case AGGREGATE_CMS_CONFIGURATIONS:
      await publishUpdatedConfigurations(
        CMS_CONFIGURATIONS,
        versioning,
        newVersion
      );
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
  addVersion,
  removeVersion,
  updateVersion,
};

export default publishRepository;
