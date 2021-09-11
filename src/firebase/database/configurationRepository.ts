import { database } from '../firebaseConnection';
import { AGGREGATE_CONFIGURATIONS } from '../../model/Aggregate';
import { ConfigInfo } from '../../model/ConfigInfo';
import logger from '../../helper/logger';
import { EDIT_STATUS_DRAFT, EditStatus } from '../../model/EditStatus';
import { APP_CONFIG, APP_CONFIG_DRAFT } from '../../model/Configurations';

async function getAppConfig(
  editStatus: EditStatus
): Promise<ConfigInfo | void> {
  return database
    .collection(AGGREGATE_CONFIGURATIONS)
    .doc(editStatus === EDIT_STATUS_DRAFT ? APP_CONFIG_DRAFT : APP_CONFIG)
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
    .collection(AGGREGATE_CONFIGURATIONS)
    .doc(APP_CONFIG_DRAFT);

  configurationRef.get().then(async (docSnapshot) => {
    if (docSnapshot.exists) {
      await database
        .collection(AGGREGATE_CONFIGURATIONS)
        .doc(AGGREGATE_CONFIGURATIONS)
        .set(configInfo);
    } else {
      await configurationRef.set(configInfo);
    }
  });
}

async function removeConfigurationDraft(): Promise<void> {
  await database
    .collection(AGGREGATE_CONFIGURATIONS)
    .doc(APP_CONFIG_DRAFT)
    .delete();
}

const decisionTreeRepository = {
  updateAppConfig,
  getAppConfig,
  removeConfigurationDraft,
};

export default decisionTreeRepository;
