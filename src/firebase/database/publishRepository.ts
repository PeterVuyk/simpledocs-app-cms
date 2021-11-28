import firebase from 'firebase/compat/app';
import { database } from '../firebaseConnection';
import {
  AGGREGATE_APP_CONFIGURATIONS,
  AGGREGATE_CALCULATIONS,
  AGGREGATE_CMS_CONFIGURATIONS,
  AGGREGATE_DECISION_TREE,
} from '../../model/Aggregate';
import { Versioning } from '../../model/Versioning';
import {
  APP_CONFIGURATIONS,
  CMS_CONFIGURATIONS,
} from '../../model/configurations/ConfigurationType';
import { CmsConfigurations } from '../../model/configurations/CmsConfigurations';
import publishBookPagesRepository from './publication/publishBookPagesRepository';
import publishDecisionTreeRepository from './publication/publishDecisionTreeRepository';
import publishConfigurationsRepository from './publication/publishConfigurationsRepository';
import publishCalculationsRepository from './publication/publishCalculationsRepository';

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

async function updateVersion(
  configuration: CmsConfigurations,
  versioning: Versioning,
  newVersion: string
): Promise<void> {
  if (
    Object.keys(configuration.books.bookItems).includes(versioning.aggregate)
  ) {
    await publishBookPagesRepository.publish(versioning, newVersion);
    return;
  }
  switch (versioning.aggregate) {
    case AGGREGATE_DECISION_TREE:
      await publishDecisionTreeRepository.publish(versioning, newVersion);
      break;
    case AGGREGATE_APP_CONFIGURATIONS:
      await publishConfigurationsRepository.publish(
        APP_CONFIGURATIONS,
        versioning,
        newVersion
      );
      break;
    case AGGREGATE_CMS_CONFIGURATIONS:
      await publishConfigurationsRepository.publish(
        CMS_CONFIGURATIONS,
        versioning,
        newVersion
      );
      break;
    case AGGREGATE_CALCULATIONS:
      await publishCalculationsRepository.publish(versioning, newVersion);
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
