import { http, HttpResponse } from 'msw';

import { locations} from './data';
import type { Location } from './schema';

export const MOCK_API = 'https://mock.cunen/msw/';

export const handlers = [
  http.get(MOCK_API + 'maps/locations', () => {
    // Convert locations to GeoJSON format
    const geoJSON = {
      type: 'FeatureCollection',
      features: locations.map((loc: Location) => {
        const { geometry, ...props } = loc;
        return {
          type: 'Feature',
          id: loc.id,
          geometry: {
            type: 'Polygon',
            coordinates: [geometry],
          },
          properties: props,
        };
      }),
    };
    return HttpResponse.json(geoJSON);
  }),
];
