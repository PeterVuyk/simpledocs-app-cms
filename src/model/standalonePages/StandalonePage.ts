import { ContentType } from '../ContentType';

export interface StandalonePage {
  id: string;
  title: string;
  content: string;
  contentType: ContentType;
  isDisabled: boolean;
}
