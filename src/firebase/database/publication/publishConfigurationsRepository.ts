import { database } from '../../firebaseConnection';
import { Versioning, Versions } from '../../../model/Versioning';
import {
  APP_CONFIGURATIONS,
  ConfigurationType,
  getDraftFromConfigurationType,
} from '../../../model/configurations/ConfigurationType';
import clone from '../../../helper/object/clone';

const getConfigurationSnapshot = async (
  configurationType: ConfigurationType
) => {
  return database.collection('configurations').doc(configurationType).get();
};

async function publish(
  configurationType: ConfigurationType,
  versioning: Versioning,
  newVersion: string
): Promise<void> {
  const batch = database.batch();

  const configurationSnapshot = await getConfigurationSnapshot(
    configurationType
  );

  // 1: Update version
  batch.update(configurationSnapshot.ref, {
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
  const draftConfig = await draftConfigurationRef
    .get()
    .then((value) => value.data());
  batch.delete(draftConfigurationRef);

  const config = clone(configurationSnapshot.data());
  const configVersioning = config.versioning as Versions;

  // 4: Add bookTypes to firstBookTab and secondBookTab
  if (configurationType === APP_CONFIGURATIONS) {
    draftConfig!.firstBookTab.bookTypes = config.firstBookTab.bookTypes;
    draftConfig!.secondBookTab.bookTypes = config.secondBookTab.bookTypes;
    draftConfig!.thirdBookTab.bookTypes = config.thirdBookTab.bookTypes;
  }

  // 5: overwrite published met draft
  const publishedConfigurationRef = database
    .collection('configurations')
    .doc(configurationType);
  batch.set(publishedConfigurationRef, {
    ...draftConfig,
    versioning: configVersioning,
  });
  batch.update(configurationSnapshot.ref, {
    [`versioning.${versioning.aggregate}.version`]: newVersion,
  });

  return batch.commit();
}

const publishRepository = {
  publish,
};

export default publishRepository;
