const convertTimezone = (date: Date) => {
  return new Date(
    date.toLocaleString('nl-NL', {
      timeZone: 'europe/amsterdam',
    })
  );
};

const dateString = (date: Date) => {
  const dd = (date.getDate() + 100).toString().slice(-2);
  const MM = (date.getMonth() + 101).toString().slice(-2);
  const yyyy = date.getFullYear().toString();
  return `${dd}-${MM}-${yyyy}`;
};

const dateTimeString = (date: Date) => {
  const dd = (date.getDate() + 100).toString().slice(-2);
  const MM = (date.getMonth() + 101).toString().slice(-2);
  const yyyy = date.getFullYear().toString();
  const HH = date.getHours().toString();
  let mm = date.getMinutes().toString();
  mm = mm.length === 1 ? `0${mm}` : mm;
  return `${dd}-${MM}-${yyyy} - ${HH}:${mm} uur`;
};

const dateTimeHelper = {
  convertTimezone,
  dateString,
  dateTimeString,
};

export default dateTimeHelper;
