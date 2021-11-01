export const AGGREGATE_ARTIFACTS = 'artifacts';
export const AGGREGATE_DECISION_TREE = 'decisionTree';
export const AGGREGATE_CALCULATIONS = 'calculations';
export const AGGREGATE_APP_CONFIGURATIONS = 'appConfigurations';
export const AGGREGATE_CMS_CONFIGURATIONS = 'cmsConfigurations';
export const AGGREGATE_STYLEGUIDE = 'styleguide';

export const getNonBookAggregates = (): string[] => {
  return [
    AGGREGATE_ARTIFACTS,
    AGGREGATE_DECISION_TREE,
    AGGREGATE_CALCULATIONS,
    AGGREGATE_CMS_CONFIGURATIONS,
    AGGREGATE_APP_CONFIGURATIONS,
    AGGREGATE_STYLEGUIDE,
  ];
};
