import { CalculationType } from './CalculationType';
import { ContentType } from '../ContentType';

export interface CalculationInfo {
  calculationType: CalculationType;
  title: string;
  explanation: string;
  content: string;
  contentType: ContentType;
  isDraft: boolean;
}
