import { useQuery } from './query.utils';

export const useHelloWorld = () => useQuery<string>('hello');

