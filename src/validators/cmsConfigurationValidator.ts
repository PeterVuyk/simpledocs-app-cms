import { getNonBookAggregates } from '../model/Aggregate';

const validateBooks = (cmsConfiguration: any, errorMessages: string[]) => {
  if (!('books' in cmsConfiguration)) {
    errorMessages.push(`- 'books' ontbreekt.`);
    return errorMessages;
  }
  if (!('title' in cmsConfiguration.books)) {
    errorMessages.push(`- 'books.title' ontbreekt.`);
  }
  if (
    !('bookItems' in cmsConfiguration.books) ||
    cmsConfiguration.books.bookItems.length === 0
  ) {
    errorMessages.push(`- 'books.bookItems' ontbreekt of is leeg.`);
    return errorMessages;
  }
  for (const bookType of Object.keys(cmsConfiguration.books.bookItems)) {
    const bookInfo = cmsConfiguration.books.bookItems[bookType];
    if (getNonBookAggregates().includes(bookType)) {
      errorMessages.push(
        `- Één van de toegevoegde boeken '${bookType}' gebruikt voor 'bookType' een gereserveerde benaming (lijst van gereserveerde benamingen: ${getNonBookAggregates().join(
          ', '
        )}).`
      );
    }
    if (!('title' in bookInfo)) {
      errorMessages.push(`- 'books.bookItems.${bookType}.title' ontbreekt.`);
    }
    if (!('navigationIndex' in bookInfo)) {
      errorMessages.push(
        `- 'books.bookItems.${bookType}.navigationIndex' ontbreekt.`
      );
    }
    if (!('urlSlug' in bookInfo)) {
      errorMessages.push(`- 'books.bookItems.${bookType}.urlSlug' ontbreekt.`);
    }
    if (!('icon' in bookInfo)) {
      errorMessages.push(`- 'books.bookItems.${bookType}.icon' ontbreekt.`);
    }
  }
  return errorMessages;
};

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

const validateExternalLinks = (
  cmsConfiguration: any,
  errorMessages: string[]
) => {
  if (
    !('externalLinks' in cmsConfiguration) ||
    cmsConfiguration.externalLinks.length !== 0
  ) {
    return errorMessages;
  }
  if (!('title' in cmsConfiguration.externalLinks)) {
    errorMessages.push(`- 'externalLinks.title' ontbreekt.`);
  }
  for (const externalLinks of Object.keys(cmsConfiguration.externalLinks)) {
    const link = cmsConfiguration.externalLinks.listItems[externalLinks];
    if (!('navigationIndex' in link)) {
      errorMessages.push(
        `- 'menu.menuItems.${link}.navigationIndex' ontbreekt.`
      );
    }
    if (!('id' in link)) {
      errorMessages.push(`- 'externalLinks.listItems.${link}.id' ontbreekt.`);
    }
    if (!('url' in link)) {
      errorMessages.push(`- 'externalLinks.listItems.${link}.url' ontbreekt.`);
    }
    if (!('icon' in link)) {
      errorMessages.push(`- 'externalLinks.listItems.${link}.icon' ontbreekt.`);
    }
  }
  return errorMessages;
};

const validateCms = (cmsConfiguration: any, errorMessages: string[]) => {
  if (!('cms' in cmsConfiguration)) {
    errorMessages.push(`- 'menu' ontbreekt.`);
    return errorMessages;
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
  errorMessages = validateBooks(cmsConfiguration, errorMessages);
  errorMessages = validateMenu(cmsConfiguration, errorMessages);
  errorMessages = validateExternalLinks(cmsConfiguration, errorMessages);
  errorMessages = validateCms(cmsConfiguration, errorMessages);

  return errorMessages.length === 0
    ? ''
    : createValidationErrorMessage(errorMessages);
};

const cmsConfigurationValidator = {
  validate,
};

export default cmsConfigurationValidator;
