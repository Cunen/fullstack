import type { Location } from '../msw/schema';
import { useMockQuery, useQuery } from './query.utils';

export const useUsers = () => useQuery<string[]>('users');

export const useLocations = () => useMockQuery<Location[]>('maps/locations');