import artifactsRepository from '../../firebase/database/artifactsRepository';
import { ARTIFACT_TYPE_CSS_STYLESHEET } from '../../model/artifacts/ArtifactType';
import logger from '../../helper/logger';

const getStylesheet = () => {
  return artifactsRepository
    .getArtifactsByCategories([ARTIFACT_TYPE_CSS_STYLESHEET])
    .then((artifacts) => {
      if (artifacts.length === 1) {
        return artifacts[0];
      }
      throw new Error(
        `Tried to collect stylesheet but unexpected result, expected 1 stylesheet but got ${artifacts.length}`
      );
    })
    .catch((reason) =>
      logger.errorWithReason(
        'Failed to collect stylesheet for stylesheet page',
        reason
      )
    );
};

export default getStylesheet;
