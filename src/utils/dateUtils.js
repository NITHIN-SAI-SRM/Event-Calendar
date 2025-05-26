export const getToday = () => new Date();

export const isSameDay = (date1, date2) =>
  date1.getFullYear() === date2.getFullYear() &&
  date1.getMonth() === date2.getMonth() &&
  date1.getDate() === date2.getDate();

export const generateMonthDays = (date) => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const startDay = start.getDay();
  const totalDays = end.getDate();

  const days = [];
  for (let i = 0; i < startDay; i++) {
    days.push(new Date(start.getFullYear(), start.getMonth(), i - startDay + 1));
  }
  for (let i = 1; i <= totalDays; i++) {
    days.push(new Date(start.getFullYear(), start.getMonth(), i));
  }
  return days;
};