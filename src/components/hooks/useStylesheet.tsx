import { useEffect, useState } from 'react';
import { Artifact } from '../../model/Artifact';
import artifactsRepository from '../../firebase/database/artifactsRepository';
import { ARTIFACT_TYPE_CSS_STYLESHEET } from '../../model/ArtifactType';
import logger from '../../helper/logger';

function useStylesheet() {
  const [stylesheet, setStylesheet] = useState<Artifact>();
  useEffect(() => {
    artifactsRepository
      .getArtifactsByCategories([ARTIFACT_TYPE_CSS_STYLESHEET])
      .then((artifacts) => {
        if (artifacts.length === 1) {
          setStylesheet(artifacts[0]);
        } else {
          throw new Error(
            `Tried to collect stylesheet but unexpected result, expected 1 stylesheet but got ${artifacts.length}`
          );
        }
      })
      .catch((reason) =>
        logger.errorWithReason(
          'Failed to collect stylesheet for stylesheet page',
          reason
        )
      );
  }, []);

  return stylesheet;
}

export default useStylesheet;
