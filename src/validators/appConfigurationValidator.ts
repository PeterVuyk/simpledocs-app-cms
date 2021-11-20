import { getNonBookAggregates } from '../model/Aggregate';

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

const validateBookTypeTab = (
  tabName: string,
  appConfiguration: any,
  errorMessages: string[]
) => {
  const result = validateBottomTab(appConfiguration, tabName, errorMessages);
  if (
    !('bookTypes' in appConfiguration[tabName]) ||
    appConfiguration[tabName].bookTypes.length === 0
  ) {
    result.push(`- '${tabName}.bookTypes' ontbreekt of is leeg.`);
    return result;
  }

  // Validate bookTypes:
  for (const bookInfo of appConfiguration[tabName].bookTypes) {
    if (!('bookType' in bookInfo)) {
      result.push(
        `- 'bookType' in 1 van de bookTypes in '${tabName}.bookTypes' ontbreekt.`
      );
      return result;
    }
    if (getNonBookAggregates().includes(bookInfo.bookType)) {
      result.push(
        `- Één van de toegevoegde boeken '${
          bookInfo.bookType
        }' gebruikt voor 'bookType' een gereserveerde benaming (lijst van gereserveerde benamingen: ${getNonBookAggregates().join(
          ', '
        )}).`
      );
    }
    if (!('index' in bookInfo)) {
      result.push(
        `- 'index' for bookType ${bookInfo.bookType} in '${tabName}.bookTypes' ontbreekt.`
      );
    }
    if (!('title' in bookInfo)) {
      result.push(
        `- 'title' for bookType ${bookInfo.bookType} in '${tabName}.bookTypes' ontbreekt.`
      );
    }
    if (!('subTitle' in bookInfo)) {
      result.push(
        `- 'subTitle' for bookType ${bookInfo.bookType} in '${tabName}.bookTypes' ontbreekt.`
      );
    }
    if (!('chapterDivisionsInIntermediateList' in bookInfo)) {
      result.push(
        `- 'chapterDivisionsInIntermediateList' for bookType ${bookInfo.bookType} in '${tabName}.bookTypes' ontbreekt.`
      );
    }
    if (!('chapterDivisionsInList' in bookInfo)) {
      result.push(
        `- 'chapterDivisionsInList' for bookType ${bookInfo.bookType} in '${tabName}.bookTypes' ontbreekt.`
      );
    }
  }
  // If a tab contains more then one bookType, then the the title and subTitle is required for the overview page.
  if (appConfiguration[tabName].bookTypes.length > 1) {
    if (!('subTitle' in appConfiguration[tabName])) {
      result.push(`- '${tabName}.subTitle' ontbreekt.`);
    }
    if (!('subTitle' in appConfiguration[tabName])) {
      result.push(`- '${tabName}.title' ontbreekt.`);
    }
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
    errorMessages = validateBookTypeTab(
      'firstBookTab',
      appConfiguration,
      errorMessages
    );
  }
  if ('secondBookTab' in appConfiguration) {
    errorMessages = validateBookTypeTab(
      'secondBookTab',
      appConfiguration,
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
