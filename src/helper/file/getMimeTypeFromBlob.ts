const getMimeTypeFromBlob = (base64: string): string => {
  const val = base64.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/);
  return val === null ? '' : val[0];
};

export default getMimeTypeFromBlob;
