import { CalculationType } from './CalculationType';
import { ContentType } from '../artifacts/Artifact';

export interface CalculationInfo {
  listIndex: number;
  calculationType: CalculationType;
  title: string;
  explanation: string;
  content: string;
  contentType: ContentType;
  iconFile: string;
  isDraft: boolean;
}