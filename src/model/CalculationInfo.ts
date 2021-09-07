import { CalculationType } from './CalculationType';

export interface CalculationInfo {
  listIndex: number;
  calculationType: CalculationType;
  title: string;
  explanation: string;
  articleButtonText: string;
  content: string;
  contentType: string;
  iconFile: string;
  calculationImage: string;
  isDraft: boolean;
}
