import { CalculationType } from './CalculationType';
import { ContentType } from './Artifact';

export interface CalculationInfo {
  listIndex: number;
  calculationType: CalculationType;
  title: string;
  explanation: string;
  articleButtonText: string;
  content: string;
  contentType: ContentType;
  iconFile: string;
  calculationImage: string;
  isDraft: boolean;
}
