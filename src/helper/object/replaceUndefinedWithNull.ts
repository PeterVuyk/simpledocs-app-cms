const replaceUndefinedWithNull = (val: any) => {
  const updatedResult = JSON.stringify(val, (key, value) => {
    return value === '' ? undefined : value;
  });
  return JSON.parse(updatedResult);
};

export default replaceUndefinedWithNull;
