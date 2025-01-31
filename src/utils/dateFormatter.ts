import { formatDistanceStrict } from 'date-fns';

const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleString('en-US', DATE_OPTIONS);
};

export const formatDuration = (start: Date, end: Date): string => {
  return formatDistanceStrict(start, end);
};

export const formatHours = (minutes: number): string => {
  const hours = minutes / 60;
  return `${hours.toFixed(1)}h`;
};