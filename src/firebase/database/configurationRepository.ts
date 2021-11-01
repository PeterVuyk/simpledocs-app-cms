import firebase from 'firebase/compat/app';
import { database } from '../firebaseConnection';
import logger from '../../helper/logger';
import {
  APP_CONFIGURATIONS,
  CMS_CONFIGURATIONS,
  ConfigurationType,
  ConfigurationTypeStatus,
  getDraftFromConfigurationType,
} from '../../model/ConfigurationType';
import { AppConfigurations } from '../../model/AppConfigurations';
import { CmsConfiguration } from '../../model/CmsConfiguration';
import { Configurations } from '../../model/Configurations';

const CONFIGURATION_COLLECTION = 'configurations';

async function getAllConfigurations(): Promise<Configurations | null> {
  const querySnapshot = await database
    .collection(CONFIGURATION_COLLECTION)
    .where(firebase.firestore.FieldPath.documentId(), 'in', [
      APP_CONFIGURATIONS,
      CMS_CONFIGURATIONS,
    ])
    .get()
    .catch((reason) =>
      logger.errorWithReason(
        'Failed collecting allConfigurations from firestore',
        reason
      )
    );
  if (!querySnapshot) {
    return null;
  }
  const appConfigurations = querySnapshot.docs
    .filter((value) => value.id === APP_CONFIGURATIONS)
    .map((value) => value.data() as AppConfigurations);
  const cmsConfigurations = querySnapshot.docs
    .filter((value) => value.id === CMS_CONFIGURATIONS)
    .map((value) => value.data() as CmsConfiguration);
  return {
    appConfigurations:
      appConfigurations.length === 1 ? appConfigurations[0] : null,
    cmsConfigurations:
      cmsConfigurations.length === 1 ? cmsConfigurations[0] : null,
  };
}

async function getConfigurations(
  configurationTypeStatus: ConfigurationTypeStatus
): Promise<AppConfigurations | CmsConfiguration | void> {
  return database
    .collection(CONFIGURATION_COLLECTION)
    .doc(configurationTypeStatus)
    .get()
    .then((value) => value.data() as AppConfigurations | CmsConfiguration)
    .catch((reason) =>
      logger.errorWithReason(
        'Failed collecting configurations from firestore',
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
        .doc(getDraftFromConfigurationType(configurationType))
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

const configurationRepository = {
  updateConfigurations,
  getConfigurations,
  getAllConfigurations,
  removeConfigurationDraft,
};

export default configurationRepository;
