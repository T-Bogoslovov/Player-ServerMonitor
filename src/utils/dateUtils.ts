import { formatDistanceToNow } from 'date-fns';

export const getAccountAge = (createdAt?: string): string => {
  if (!createdAt) return '';
  return formatDistanceToNow(new Date(createdAt), { addSuffix: true });
};