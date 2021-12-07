const convertTimezone = (date: Date | string) => {
  return new Date(
    (typeof date === 'string' ? new Date(date) : date).toLocaleString('nl-NL', {
      timeZone: 'europe/amsterdam',
    })
  );
};

const dateString = (date: Date) => {
  const dd = (date.getDate() + 100).toString().slice(-2);
  const mm = (date.getMonth() + 101).toString().slice(-2);
  const yyyy = date.getFullYear().toString();
  return `${mm}-${dd}-${yyyy}`;
};

const dateTimeHelper = {
  convertTimezone,
  dateString,
};

export default dateTimeHelper;
