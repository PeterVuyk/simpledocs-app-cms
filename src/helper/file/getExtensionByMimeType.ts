const getExtensionByMimeType = (mimeType: string) => {
  // More extensions can be added later
  switch (mimeType ?? '') {
    case 'image/svg+xml':
      return 'svg';
    case 'image/jpeg':
      return 'jpeg';
    case 'image/jpg':
      return 'jpg';
    case 'image/png':
      return 'png';
    default:
      return null;
  }
};

export default getExtensionByMimeType;
