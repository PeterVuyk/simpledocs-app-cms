import { database } from '../firebaseConnection';
import {
  AGGREGATE_APP_CONFIG,
  AGGREGATE_APP_CONFIG_DRAFT,
} from '../../model/Aggregate';
import { ConfigInfo } from '../../model/ConfigInfo';
import logger from '../../helper/logger';
import { EDIT_STATUS_DRAFT, EditStatus } from '../../model/EditStatus';

async function getAppConfig(
  editStatus: EditStatus
): Promise<ConfigInfo | void> {
  return database
    .collection('config')
    .doc(
      editStatus === EDIT_STATUS_DRAFT
        ? AGGREGATE_APP_CONFIG_DRAFT
        : AGGREGATE_APP_CONFIG
    )
    .get()
    .then((value) => value.data() as ConfigInfo)
    .then((value) => value)
    .catch((reason) =>
      logger.errorWithReason(
        'Failed collecting articles from config file',
        reason
      )
    );
}

async function updateAppConfig(configInfo: ConfigInfo): Promise<void> {
  const configurationRef = database
    .collection('config')
    .doc(AGGREGATE_APP_CONFIG_DRAFT);

  configurationRef.get().then(async (docSnapshot) => {
    if (docSnapshot.exists) {
      await database
        .collection('config')
        .doc(AGGREGATE_APP_CONFIG)
        .set(configInfo);
    } else {
      await configurationRef.set(configInfo);
    }
  });
}

async function removeConfigurationDraft(): Promise<void> {
  await database.collection('config').doc(AGGREGATE_APP_CONFIG_DRAFT).delete();
}

const decisionTreeRepository = {
  updateAppConfig,
  getAppConfig,
  removeConfigurationDraft,
};

export default decisionTreeRepository;
