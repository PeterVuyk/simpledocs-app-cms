import firebase from 'firebase/compat/app';
import { database } from '../../firebaseConnection';
import { Versioning } from '../../../model/Versioning';
import { Page } from '../../../model/Page';
import decisionTreeRepository from '../decisionTreeRepository';
import {
  CONTENT_TYPE_CALCULATIONS,
  CONTENT_TYPE_DECISION_TREE,
} from '../../../model/ContentType';
import { DecisionTree } from '../../../model/DecisionTree/DecisionTree';
import logger from '../../../helper/logger';
import { CalculationInfo } from '../../../model/calculations/CalculationInfo';
import calculationsRepository from '../calculationsRepository';

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
    [`versioning.${versioning.aggregate}.updateMoment`]:
      versioning.updateMoment,
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

const validateAndUpdateContentByType = async (
  aggregate: string
): Promise<void> => {
  // 1: get all pages
  const querySnapshot = await database
    .collection('books')
    .doc(aggregate)
    .collection(aggregate)
    .get();

  // 2: Get all decision trees
  const batch = database.batch();
  const decisionTrees = await decisionTreeRepository.getDecisionTree(false);
  const calculationInfos = await calculationsRepository.getCalculationsInfo(
    false
  );

  // 3: loop through the pages and update the content if decision tree.
  querySnapshot.forEach((documentSnapshot) => {
    const page = documentSnapshot.data() as Page;
    if (page.contentType === CONTENT_TYPE_DECISION_TREE) {
      const decisionTreeTitle = (JSON.parse(page.content) as DecisionTree)
        .title;
      const decisionTree = decisionTrees.find(
        (tree) =>
          tree.title === (JSON.parse(page.content) as DecisionTree).title
      );
      if (decisionTree) {
        batch.update(documentSnapshot.ref, {
          content: JSON.stringify(decisionTree),
        });
      } else {
        logger.error(
          `Tried to update decisionTree from pageId ${page.id} by publishing book pages but the desired decision tree with title ${decisionTreeTitle} doesn't exist, please check it and update the page manually`
        );
      }
    }
    if (page.contentType === CONTENT_TYPE_CALCULATIONS) {
      const content = JSON.parse(page.content) as CalculationInfo;
      const calculation = calculationInfos.find(
        (calculationInfo) =>
          calculationInfo.calculationType === content.calculationType
      );
      if (calculation) {
        batch.update(documentSnapshot.ref, {
          content: JSON.stringify(calculation),
        });
      } else {
        logger.error(
          `Tried to update calculationIno from pageId ${page.id} by publishing book pages but the desired calculationType ${content.calculationType} doesn't exist, please check it and update the page manually`
        );
      }
    }
  });
  return batch.commit();
};

async function publish(
  versioning: Versioning,
  newVersion: string
): Promise<void> {
  await validateAndUpdateContentByType(versioning.aggregate);
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
