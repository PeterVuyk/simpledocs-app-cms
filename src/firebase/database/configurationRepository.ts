import { database } from '../firebaseConnection';
import { AGGREGATE_APP_CONFIGURATIONS } from '../../model/Aggregate';
import logger from '../../helper/logger';
import { EDIT_STATUS_DRAFT, EditStatus } from '../../model/EditStatus';
import {
  APP_CONFIGURATIONS,
  APP_CONFIGURATIONS_DRAFT,
} from '../../model/Configurations';
import { AppConfigurations } from '../../model/AppConfigurations';

async function getAppConfigurations(
  editStatus: EditStatus
): Promise<AppConfigurations | void> {
  return database
    .collection('configurations')
    .doc(
      editStatus === EDIT_STATUS_DRAFT
        ? APP_CONFIGURATIONS_DRAFT
        : APP_CONFIGURATIONS
    )
    .get()
    .then((value) => value.data() as AppConfigurations)
    .then((value) => value)
    .catch((reason) =>
      logger.errorWithReason(
        'Failed collecting articles from config file',
        reason
      )
    );
}

async function updateAppConfigurations(
  appConfigurations: AppConfigurations
): Promise<void> {
  const configurationRef = database
    .collection('configurations')
    .doc(APP_CONFIGURATIONS_DRAFT);

  configurationRef.get().then(async (docSnapshot) => {
    if (docSnapshot.exists) {
      await database
        .collection('configurations')
        .doc(AGGREGATE_APP_CONFIGURATIONS)
        .set(appConfigurations);
    } else {
      await configurationRef.set(appConfigurations);
    }
  });
}

async function removeConfigurationDraft(): Promise<void> {
  await database
    .collection(AGGREGATE_APP_CONFIGURATIONS)
    .doc(APP_CONFIGURATIONS_DRAFT)
    .delete();
}

const decisionTreeRepository = {
  updateAppConfigurations,
  getAppConfigurations,
  removeConfigurationDraft,
};

export default decisionTreeRepository;
