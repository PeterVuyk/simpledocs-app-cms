import { database } from '../firebaseConnection';
import { AGGREGATE_APP_CONFIG } from '../../model/Aggregate';
import { ConfigInfo } from '../../model/ConfigInfo';
import logger from '../../helper/logger';

async function getAppConfig(): Promise<ConfigInfo | void> {
  return database
    .collection('config')
    .doc(AGGREGATE_APP_CONFIG)
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
  await database.collection('config').doc(AGGREGATE_APP_CONFIG).set(configInfo);
}

const decisionTreeRepository = {
  updateAppConfig,
  getAppConfig,
};

export default decisionTreeRepository;
