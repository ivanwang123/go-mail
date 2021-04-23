export function timestampToStr(timestamp: string): string {
  const date = new Date(timestamp);

  const today = new Date();
  const yesterday = new Date(today.getTime() - 86400000);

  if (isSameDay(today, date)) {
    return getFormattedTime(date);
  } else if (isSameDay(yesterday, date)) {
    return "Yesterday";
  } else {
    return getFormattedDay(date);
  }
}

function getFormattedTime(date: Date): string {
  const minute = ("0" + date.getMinutes()).slice(-2);
  const meridiem = date.getHours() < 12 ? "AM" : "PM";
  const hour = date.getHours() % 12 || 12;

  return `${hour}:${minute} ${meridiem}`;
}

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
function getFormattedDay(date: Date): string {
  const month = months[date.getMonth()];
  const day = date.getDate();
  return `${month} ${day}`;
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getDate() == date2.getDate() &&
    date1.getMonth() == date2.getMonth() &&
    date1.getFullYear() == date2.getFullYear()
  );
}
