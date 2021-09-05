import { ArtifactType } from './ArtifactType';

export interface Artifact {
  id?: string;
  type: ArtifactType;
  file: string;
  extension: string;
  title: string;
}
