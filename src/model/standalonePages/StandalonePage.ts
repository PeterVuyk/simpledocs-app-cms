import { ContentType } from '../ContentType';
import { StandalonePageType } from './StandalonePageType';

export interface StandalonePage {
  standalonePageType: StandalonePageType;
  id: string;
  title: string;
  content: string;
  contentType: ContentType;
  isDraft: boolean;
  markedForDeletion: boolean;
}
