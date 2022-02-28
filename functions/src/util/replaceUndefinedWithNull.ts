const replaceUndefinedWithNull = (val: any) => {
  const updatedResult = JSON.stringify(val, function (key, value) {
    return value === '' ? undefined : value;
  });
  return JSON.parse(updatedResult);
};

export default replaceUndefinedWithNull;
