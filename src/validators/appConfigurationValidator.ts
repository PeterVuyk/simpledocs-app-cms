const validateBottomTab = (
  config: any,
  tabName: string,
  errorMessages: string[]
) => {
  if (!('bottomTab' in config[tabName])) {
    errorMessages.push(`- '${tabName}.bottomTab' ontbreekt.`);
    return errorMessages;
  }
  if (!('familyType' in config[tabName].bottomTab)) {
    errorMessages.push(`- '${tabName}.bottomTab.familyType' ontbreekt.`);
  }
  if (!('icon' in config[tabName].bottomTab)) {
    errorMessages.push(`- '${tabName}.bottomTab.icon' ontbreekt.`);
  }
  if (!('title' in config[tabName].bottomTab)) {
    errorMessages.push(`- '${tabName}.bottomTab.title' ontbreekt.`);
  }
  return errorMessages;
};

const validateDecisionTab = (
  appConfiguration: any,
  errorMessages: string[]
) => {
  const result = validateBottomTab(
    appConfiguration,
    'decisionsTab',
    errorMessages
  );

  if (!('subTitle' in appConfiguration.decisionsTab)) {
    result.push(`- 'decisionsTab.subTitle' ontbreekt.`);
  }
  if (!('title' in appConfiguration.decisionsTab)) {
    result.push(`- 'decisionsTab.title' ontbreekt.`);
  }
  if (
    !('indexDecisionType' in appConfiguration.decisionsTab) ||
    appConfiguration.decisionsTab.indexDecisionType.length === 0
  ) {
    result.push(`- 'decisionsTab.indexDecisionType' ontbreekt of is leeg.`);
  }
  if (!('bottomTab' in appConfiguration.decisionsTab)) {
    result.push(`- 'decisionsTab.bottomTab' ontbreekt.`);
    return result;
  }
  if (!('familyType' in appConfiguration.decisionsTab.bottomTab)) {
    result.push(`- 'decisionsTab.bottomTab.familyType' ontbreekt.`);
  }
  if (!('icon' in appConfiguration.decisionsTab.bottomTab)) {
    result.push(`- 'decisionsTab.bottomTab.icon' ontbreekt.`);
  }
  if (!('title' in appConfiguration.decisionsTab.bottomTab)) {
    result.push(`- 'decisionsTab.bottomTab.title' ontbreekt.`);
  }
  return result;
};

const validateDrawer = (appConfiguration: any, errorMessages: string[]) => {
  if (!('drawer' in appConfiguration)) {
    errorMessages.push(`- 'drawer' ontbreekt.`);
    return errorMessages;
  }
  if (!('links' in appConfiguration.drawer)) {
    errorMessages.push(`- 'drawer.links' ontbreekt.`);
    return errorMessages;
  }
  for (const link of appConfiguration.drawer.links) {
    if (!('iconName' in link)) {
      errorMessages.push(`- 'drawer.links[].iconName' ontbreekt.`);
    }
    if (!('iconType' in link)) {
      errorMessages.push(`- 'drawer.links[].iconType' ontbreekt.`);
    }
    if (!('index' in link)) {
      errorMessages.push(`- 'drawer.links[].index' ontbreekt.`);
    }
    if (!('title' in link)) {
      errorMessages.push(`- 'drawer.links[].title' ontbreekt.`);
    }
    if (!('url' in link)) {
      errorMessages.push(`- 'drawer.links[].url' ontbreekt.`);
    }
  }
  return errorMessages;
};

const validateConfig = (appConfiguration: any, errorMessages: string[]) => {
  if (!('defaultSearchChip' in appConfiguration)) {
    errorMessages.push(`- 'defaultSearchChip' ontbreekt.`);
  }
  if (!('defaultInitialTab' in appConfiguration)) {
    errorMessages.push(`- 'defaultInitialTab' ontbreekt.`);
  }
  return errorMessages;
};

const createValidationErrorMessage = (errorMessages: string[]): string => {
  return `De aangepaste configuratie is gevalideerd, hierbij zijn de volgende fouten gevonden:\n${errorMessages.join(
    '\n'
  )}`;
};

const validate = (appConfiguration: any) => {
  if (!appConfiguration) {
    return 'De aangepaste configuratie is leeg. Geef een correcte configuratie op.';
  }
  let errorMessages: string[] = [];

  errorMessages = validateConfig(appConfiguration, errorMessages);
  errorMessages = validateDrawer(appConfiguration, errorMessages);

  if ('decisionsTab' in appConfiguration) {
    errorMessages = validateDecisionTab(appConfiguration, errorMessages);
  }
  if ('firstBookTab' in appConfiguration) {
    errorMessages = validateBottomTab(
      appConfiguration,
      'firstBookTab',
      errorMessages
    );
  }
  if ('secondBookTab' in appConfiguration) {
    errorMessages = validateBottomTab(
      appConfiguration,
      'secondBookTab',
      errorMessages
    );
  }

  return errorMessages.length === 0
    ? ''
    : createValidationErrorMessage(errorMessages);
};

const appConfigurationValidator = {
  validate,
};

export default appConfigurationValidator;
