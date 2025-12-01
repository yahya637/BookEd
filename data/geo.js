// data/geo.js

// By-ankerpunkter (approx.)
export const CITY_COORDS = {
  'København K': { latitude: 55.679,  longitude: 12.58  },
  'Ørestad':     { latitude: 55.6296, longitude: 12.5776 },
  'Amager':      { latitude: 55.649,  longitude: 12.61  },
  'Sundby':      { latitude: 55.649,  longitude: 12.61  },
  'Tårnby':      { latitude: 55.63,   longitude: 12.61  },
  'Kastrup':     { latitude: 55.633,  longitude: 12.65  },
  'Nørrebro':    { latitude: 55.699,  longitude: 12.54  },
  'Vesterbro':   { latitude: 55.665,  longitude: 12.55  },
  'Frederiksberg': { latitude: 55.68, longitude: 12.53  },
  'Valby':       { latitude: 55.657,  longitude: 12.516 },
  'Nordhavn':    { latitude: 55.707,  longitude: 12.60  },
  'Østerbro':    { latitude: 55.706,  longitude: 12.58  },
  'Ryparken':    { latitude: 55.714,  longitude: 12.555 },
  'Grøndal':     { latitude: 55.704,  longitude: 12.509 },
  'Bellahøj':    { latitude: 55.704,  longitude: 12.514 },
  'Glostrup':    { latitude: 55.666,  longitude: 12.401 },
  'Brøndby':     { latitude: 55.649,  longitude: 12.418 },
  'Rødovre':     { latitude: 55.681,  longitude: 12.453 },
  'Hvidovre':    { latitude: 55.653,  longitude: 12.473 },
  'Albertslund': { latitude: 55.656,  longitude: 12.354 },
  'Vallensbæk':  { latitude: 55.617,  longitude: 12.387 },
  'Kokkedal':    { latitude: 55.903,  longitude: 12.50  },
  'Hedehusene':  { latitude: 55.645,  longitude: 12.206 },
};

// Haversine (km)
export function haversineKm(a, b) {
  if (!a || !b) return null;
  const toRad = d => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  const d = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  return Math.round(R * d * 10) / 10;
}