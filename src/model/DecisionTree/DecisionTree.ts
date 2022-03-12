import { DecisionTreeStep } from './DecisionTreeStep';

export interface DecisionTree {
  title: string;
  steps: DecisionTreeStep[];
  isDraft: boolean;
  markedForDeletion?: boolean;
}
