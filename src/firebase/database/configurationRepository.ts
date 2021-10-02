import { database } from '../firebaseConnection';
import logger from '../../helper/logger';
import {
  APP_CONFIGURATIONS,
  APP_CONFIGURATIONS_DRAFT,
  CMS_CONFIGURATIONS_DRAFT,
  ConfigurationType,
  ConfigurationTypeStatus,
  getDraftFromConfigurationType,
} from '../../model/ConfigurationType';
import { AppConfigurations } from '../../model/AppConfigurations';
import { CmsConfiguration } from '../../model/CmsConfiguration';

const CONFIGURATION_COLLECTION = 'configurations';
async function getConfigurations(
  configurationTypeStatus: ConfigurationTypeStatus
): Promise<AppConfigurations | void> {
  return database
    .collection(CONFIGURATION_COLLECTION)
    .doc(configurationTypeStatus)
    .get()
    .then((value) => value.data() as AppConfigurations)
    .then((value) => value)
    .catch((reason) =>
      logger.errorWithReason(
        'Failed collecting configurations from config file',
        reason
      )
    );
}

async function updateConfigurations(
  configurationType: ConfigurationType,
  configurations: AppConfigurations | CmsConfiguration
): Promise<void> {
  const configurationRef = database
    .collection(CONFIGURATION_COLLECTION)
    .doc(getDraftFromConfigurationType(configurationType));

  configurationRef.get().then(async (docSnapshot) => {
    if (docSnapshot.exists) {
      await database
        .collection('configurations')
        .doc(configurationType)
        .set(configurations);
    } else {
      await configurationRef.set(configurations);
    }
  });
}

async function removeConfigurationDraft(
  configurationType: ConfigurationType
): Promise<void> {
  await database
    .collection(CONFIGURATION_COLLECTION)
    .doc(getDraftFromConfigurationType(configurationType))
    .delete();
}

const decisionTreeRepository = {
  updateConfigurations,
  getConfigurations,
  removeConfigurationDraft,
};

export default decisionTreeRepository;
