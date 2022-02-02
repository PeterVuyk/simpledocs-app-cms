const alphaNumericIdGenerator = (prefix: string): string =>
  Math.random().toString(36).replace('0.', prefix);

export default alphaNumericIdGenerator;
