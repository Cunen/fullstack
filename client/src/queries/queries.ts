import { useQuery } from './query.utils';

export const useUsers = () => useQuery<string[]>('users');

