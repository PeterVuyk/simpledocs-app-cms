const convertTimezone = (date: Date) => {
  return new Date(
    date.toLocaleString('nl-NL', {
      timeZone: 'europe/amsterdam',
    })
  );
};

const dateString = (date: Date) => {
  const dd = (date.getDate() + 100).toString().slice(-2);
  const mm = (date.getMonth() + 101).toString().slice(-2);
  const yyyy = date.getFullYear().toString();
  return `${dd}-${mm}-${yyyy}`;
};

const dateTimeHelper = {
  convertTimezone,
  dateString,
};

export default dateTimeHelper;
