const validateMenu = (cmsConfiguration: any, errorMessages: string[]) => {
  if (!('menu' in cmsConfiguration)) {
    errorMessages.push(`- 'menu' ontbreekt.`);
    return errorMessages;
  }
  if (!('title' in cmsConfiguration.menu)) {
    errorMessages.push(`- 'menu.title' ontbreekt.`);
  }
  if (
    !('menuItems' in cmsConfiguration.menu) ||
    cmsConfiguration.menu.menuItems.length === 0
  ) {
    errorMessages.push(`- 'menu.menuItems' ontbreekt of is leeg.`);
    return errorMessages;
  }
  for (const menuItem of Object.keys(cmsConfiguration.menu.menuItems)) {
    const item = cmsConfiguration.menu.menuItems[menuItem];
    if (!('navigationIndex' in item)) {
      errorMessages.push(
        `- 'menu.menuItems.${menuItem}.navigationIndex' ontbreekt.`
      );
    }
    if (!('title' in item)) {
      errorMessages.push(`- 'menu.menuItems.${menuItem}.title' ontbreekt.`);
    }
    if (!('urlSlug' in item)) {
      errorMessages.push(`- 'menu.menuItems.${menuItem}.urlSlug' ontbreekt.`);
    }
    if (!('icon' in item)) {
      errorMessages.push(`'menu.menuItems.${menuItem}.icon' ontbreekt.`);
    }
  }
  return errorMessages;
};

const createValidationErrorMessage = (errorMessages: string[]): string => {
  return `De aangepaste configuratie is gevalideerd, hierbij zijn de volgende fouten gevonden:\n${errorMessages.join(
    '\n'
  )}`;
};

const validate = (cmsConfiguration: any) => {
  if (!cmsConfiguration) {
    return 'De aangepaste configuratie is leeg. Geef een correcte configuratie op.';
  }
  let errorMessages: string[] = [];
  errorMessages = validateMenu(cmsConfiguration, errorMessages);

  return errorMessages.length === 0
    ? ''
    : createValidationErrorMessage(errorMessages);
};

const cmsConfigurationValidator = {
  validate,
};

export default cmsConfigurationValidator;
