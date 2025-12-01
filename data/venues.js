// data/venues.js
import { SPORT_IMAGES } from './sports';
import { CITY_COORDS, haversineKm } from './geo';

/**
 * Laver en lille, deterministisk offset ud fra venue-id,
 * så venues i samme by får unikke coords (ca. ±0.01° ~ op til ~1 km).
 */
function hashId(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0; // keep 32-bit
  }
  return Math.abs(h);
}
function offsetFromId(id, maxDeltaDeg = 0.01) {
  const h = hashId(id);
  // To "uniforme" tal i intervallet [-0.5, 0.5]
  const n1 = ((h % 1000) / 1000) - 0.5;
  const n2 = (((Math.floor(h / 1000)) % 1000) / 1000) - 0.5;
  return {
    dLat: n1 * 2 * maxDeltaDeg, // [-maxDeltaDeg, +maxDeltaDeg]
    dLon: n2 * 2 * maxDeltaDeg,
  };
}
function cityWithOffset(cityName, id) {
  const base = CITY_COORDS[cityName] || CITY_COORDS['København K'];
  const off = offsetFromId(id, 0.0085); // ~ op til 0.0085° ≈ ~950 m
  return {
    latitude: base.latitude + off.dLat,
    longitude: base.longitude + off.dLon,
  };
}

/* ---------- Base data (samme som før) ---------- */
const BASE_VENUES = [
  // Padel (s1)
  { id: 'v001', sportId: 's1', name: 'Ørestad Padel – Bane 1', city: 'Ørestad', pricePerHour: 330, slots: ['16:30','17:30','19:00'] },
  { id: 'v002', sportId: 's1', name: 'Amager Padel Center – Bane 2', city: 'Amager', pricePerHour: 320, slots: ['17:00','18:00','19:30'] },
  { id: 'v003', sportId: 's1', name: 'Nørrebro Padel – Court A', city: 'Nørrebro', pricePerHour: 340, slots: ['16:00','17:30','18:30'] },
  { id: 'v004', sportId: 's1', name: 'Vesterbro Padel – Court 1', city: 'Vesterbro', pricePerHour: 345, slots: ['17:15','18:15','19:15'] },
  { id: 'v005', sportId: 's1', name: 'Frederiksberg Padelhal – Bane 3', city: 'Frederiksberg', pricePerHour: 350, slots: ['16:45','17:45','18:45'] },
  { id: 'v006', sportId: 's1', name: 'Valby Padel Club – Court 2', city: 'Valby', pricePerHour: 325, slots: ['17:00','18:00','19:00'] },
  { id: 'v007', sportId: 's1', name: 'Nordhavn Padel – Court 4', city: 'Nordhavn', pricePerHour: 355, slots: ['16:30','17:30','18:30'] },
  { id: 'v008', sportId: 's1', name: 'Glostrup Padel – Bane 1', city: 'Glostrup', pricePerHour: 320, slots: ['17:30','18:30','20:00'] },
  { id: 'v009', sportId: 's1', name: 'Brøndby Padel – Court 2', city: 'Brøndby', pricePerHour: 335, slots: ['17:00','18:00','19:30'] },
  { id: 'v010', sportId: 's1', name: 'Rødovre Padel – Court 1', city: 'Rødovre', pricePerHour: 315, slots: ['16:30','17:30','18:30'] },

  // Fodbold (s2)
  { id: 'v011', sportId: 's2', name: 'Fælledparken – Bane 1', city: 'Østerbro', pricePerHour: 300, slots: ['17:00','18:00','19:00'] },
  { id: 'v012', sportId: 's2', name: 'Valby Idrætspark – Kunstgræs 2', city: 'Valby', pricePerHour: 320, slots: ['16:30','17:30','19:00'] },
  { id: 'v013', sportId: 's2', name: 'Østerbro Stadion – Træningsbane', city: 'Østerbro', pricePerHour: 310, slots: ['17:15','18:15','19:15'] },
  { id: 'v014', sportId: 's2', name: 'Frederiksberg Stadion – Kunstgræs', city: 'Frederiksberg', pricePerHour: 330, slots: ['17:00','18:00','20:00'] },
  { id: 'v015', sportId: 's2', name: 'Sundby Idrætspark – Bane 3', city: 'Amager', pricePerHour: 300, slots: ['16:45','17:45','18:45'] },
  { id: 'v016', sportId: 's2', name: 'Nørrebroparken – 7M Bane', city: 'Nørrebro', pricePerHour: 280, slots: ['16:00','17:00','18:00'] },
  { id: 'v017', sportId: 's2', name: 'Glostrup Idrætspark – Hal A', city: 'Glostrup', pricePerHour: 250, slots: ['17:00','18:00','19:00'] },
  { id: 'v018', sportId: 's2', name: 'Brøndby Stadion – Træning', city: 'Brøndby', pricePerHour: 340, slots: ['17:30','18:30','20:00'] },
  { id: 'v019', sportId: 's2', name: 'Albertslund Stadion – Kunstgræs', city: 'Albertslund', pricePerHour: 290, slots: ['17:00','18:00','19:00'] },
  { id: 'v020', sportId: 's2', name: 'Rødovre – 7M Bane A', city: 'Rødovre', pricePerHour: 270, slots: ['16:30','17:30','18:30'] },

  // Svømning (s3)
  { id: 'v021', sportId: 's3', name: 'Bellahøj Svømmestadion – Bane 1', city: 'Bellahøj', pricePerHour: 190, slots: ['16:00','17:00','18:00'] },
  { id: 'v022', sportId: 's3', name: 'Frederiksberg Svømmehal – Bane 2', city: 'Frederiksberg', pricePerHour: 185, slots: ['16:30','17:30','18:30'] },
  { id: 'v023', sportId: 's3', name: 'Øbrohallen – Bane 3', city: 'Østerbro', pricePerHour: 180, slots: ['17:00','18:00','19:00'] },
  { id: 'v024', sportId: 's3', name: 'DGI Byen – Vandkultur – Bane 2', city: 'Vesterbro', pricePerHour: 200, slots: ['16:45','17:45','18:45'] },
  { id: 'v025', sportId: 's3', name: 'Sundby Bad – Bane 1', city: 'Amager', pricePerHour: 170, slots: ['16:00','17:00','18:00'] },
  { id: 'v026', sportId: 's3', name: 'Valby Vandkulturhus – Bane 2', city: 'Valby', pricePerHour: 175, slots: ['17:00','18:00','19:00'] },
  { id: 'v027', sportId: 's3', name: 'Rødovre Svømmehal – Bane 2', city: 'Rødovre', pricePerHour: 170, slots: ['16:30','17:30','18:30'] },
  { id: 'v028', sportId: 's3', name: 'Hvidovre Svømmehal – Bane 3', city: 'Hvidovre', pricePerHour: 165, slots: ['17:00','18:00','19:00'] },
  { id: 'v029', sportId: 's3', name: 'Tårnby Svømmehal – Bane 1', city: 'Tårnby', pricePerHour: 160, slots: ['16:30','17:30','18:30'] },
  { id: 'v030', sportId: 's3', name: 'Kastrup Svømmehal – Bane 2', city: 'Kastrup', pricePerHour: 160, slots: ['17:00','18:00','19:00'] },

  // Badminton (s4)
  { id: 'v031', sportId: 's4', name: 'Frederiksberg Badminton – Bane 1', city: 'Frederiksberg', pricePerHour: 210, slots: ['16:00','17:00','18:00'] },
  { id: 'v032', sportId: 's4', name: 'DGI Byen – Badminton 3', city: 'Vesterbro', pricePerHour: 220, slots: ['17:00','18:00','19:00'] },
  { id: 'v033', sportId: 's4', name: 'Østerbrohallen – Bane 2', city: 'Østerbro', pricePerHour: 200, slots: ['16:30','17:30','18:30'] },
  { id: 'v034', sportId: 's4', name: 'Bellahøj Hallen – Bane 4', city: 'Bellahøj', pricePerHour: 205, slots: ['17:00','18:00','19:00'] },
  { id: 'v035', sportId: 's4', name: 'Ryparken – Badminton 5', city: 'Ryparken', pricePerHour: 200, slots: ['16:45','17:45','18:45'] },
  { id: 'v036', sportId: 's4', name: 'Valbyhallen – Bane 3', city: 'Valby', pricePerHour: 195, slots: ['16:00','17:00','18:00'] },
  { id: 'v037', sportId: 's4', name: 'Rødovrehallen – Bane 1', city: 'Rødovre', pricePerHour: 190, slots: ['17:00','18:00','19:00'] },
  { id: 'v038', sportId: 's4', name: 'Hvidovre Badminton – Bane 2', city: 'Hvidovre', pricePerHour: 200, slots: ['16:30','17:30','18:30'] },
  { id: 'v039', sportId: 's4', name: 'Glostrup Badminton – Bane 4', city: 'Glostrup', pricePerHour: 205, slots: ['17:00','18:00','19:00'] },
  { id: 'v040', sportId: 's4', name: 'Albertslund Badminton – Bane 6', city: 'Albertslund', pricePerHour: 195, slots: ['17:15','18:15','19:15'] },

  // Basket (s5)
  { id: 'v041', sportId: 's5', name: 'DGI Byen – Basket Court A', city: 'Vesterbro', pricePerHour: 260, slots: ['17:00','18:00','19:00'] },
  { id: 'v042', sportId: 's5', name: 'Vesterbrohallen – Court 1', city: 'Vesterbro', pricePerHour: 255, slots: ['16:30','17:30','18:30'] },
  { id: 'v043', sportId: 's5', name: 'Østerbrohuset – Court 2', city: 'Østerbro', pricePerHour: 250, slots: ['17:00','18:00','19:00'] },
  { id: 'v044', sportId: 's5', name: 'Grøndal Multicenter – Court 4', city: 'Grøndal', pricePerHour: 270, slots: ['16:45','17:45','18:45'] },
  { id: 'v045', sportId: 's5', name: 'Bellahøj – Court 1', city: 'Bellahøj', pricePerHour: 255, slots: ['17:00','18:00','19:00'] },
  { id: 'v046', sportId: 's5', name: 'Valbyhallen – Court 2', city: 'Valby', pricePerHour: 245, slots: ['16:00','17:00','18:00'] },
  { id: 'v047', sportId: 's5', name: 'Rødovrehallen – Court B', city: 'Rødovre', pricePerHour: 240, slots: ['17:00','18:00','19:00'] },
  { id: 'v048', sportId: 's5', name: 'Hvidovre Hallen – Court A', city: 'Hvidovre', pricePerHour: 240, slots: ['16:30','17:30','18:30'] },
  { id: 'v049', sportId: 's5', name: 'Brøndby Hallen – Court 2', city: 'Brøndby', pricePerHour: 250, slots: ['18:00','19:00','20:00'] },
  { id: 'v050', sportId: 's5', name: 'Frederiksberg – Center Court', city: 'Frederiksberg', pricePerHour: 265, slots: ['17:15','18:15','19:15'] },

  // Håndbold (s6)
  { id: 'v051', sportId: 's6', name: 'Bellahøj Hallen – Håndbold', city: 'Bellahøj', pricePerHour: 240, slots: ['17:00','18:00','19:00'] },
  { id: 'v052', sportId: 's6', name: 'Frederiksberg Hallen – Håndbold', city: 'Frederiksberg', pricePerHour: 245, slots: ['16:30','17:30','18:30'] },
  { id: 'v053', sportId: 's6', name: 'Ryparken – Hal 2 (Håndbold)', city: 'Ryparken', pricePerHour: 235, slots: ['17:00','18:00','19:00'] },
  { id: 'v054', sportId: 's6', name: 'Grøndal – Hal 3 (Håndbold)', city: 'Grøndal', pricePerHour: 240, slots: ['16:45','17:45','18:45'] },
  { id: 'v055', sportId: 's6', name: 'Valbyhallen – Håndbold', city: 'Valby', pricePerHour: 235, slots: ['16:00','17:00','18:00'] },
  { id: 'v056', sportId: 's6', name: 'Rødovre – Håndbold', city: 'Rødovre', pricePerHour: 230, slots: ['17:00','18:00','19:00'] },
  { id: 'v057', sportId: 's6', name: 'Hvidovre – Håndbold', city: 'Hvidovre', pricePerHour: 230, slots: ['16:30','17:30','18:30'] },
  { id: 'v058', sportId: 's6', name: 'Brøndby – Håndbold', city: 'Brøndby', pricePerHour: 240, slots: ['17:30','18:30','20:00'] },
  { id: 'v059', sportId: 's6', name: 'Glostrup – Håndbold', city: 'Glostrup', pricePerHour: 225, slots: ['17:00','18:00','19:00'] },
  { id: 'v060', sportId: 's6', name: 'Tingbjerg Hallen – Håndbold', city: 'Tingbjerg', pricePerHour: 235, slots: ['16:45','17:45','18:45'] },

  // Golf (s7)
  { id: 'v061', sportId: 's7', name: 'Royal Golf Center – Range', city: 'Ørestad', pricePerHour: 280, slots: ['16:00','17:00','18:00'] },
  { id: 'v062', sportId: 's7', name: 'Vallensbæk Golfklub – Par 3', city: 'Vallensbæk', pricePerHour: 220, slots: ['16:40','17:20','18:00'] },
  { id: 'v063', sportId: 's7', name: 'Hedeland Golfklub – Tee 1', city: 'Hedehusene', pricePerHour: 260, slots: ['16:10','17:10','18:10'] },
  { id: 'v064', sportId: 's7', name: 'Copenhagen Golf Center – Tee 2', city: 'Amager', pricePerHour: 270, slots: ['17:00','18:00','19:00'] },
  { id: 'v065', sportId: 's7', name: 'Kokkedal Golf – Range', city: 'Kokkedal', pricePerHour: 290, slots: ['16:30','17:30','18:30'] },
  { id: 'v066', sportId: 's7', name: 'Brøndby Golf – Tee 2', city: 'Brøndby', pricePerHour: 240, slots: ['16:00','17:00','18:00'] },
  { id: 'v067', sportId: 's7', name: 'Glostrup Golf – Putting Green', city: 'Glostrup', pricePerHour: 210, slots: ['16:15','17:15','18:15'] },
  { id: 'v068', sportId: 's7', name: 'Frederiksberg Pitch & Putt', city: 'Frederiksberg', pricePerHour: 230, slots: ['16:30','17:30','18:30'] },
  { id: 'v069', sportId: 's7', name: 'Amager Golf Træning', city: 'Amager', pricePerHour: 240, slots: ['17:00','18:00','19:00'] },
  { id: 'v070', sportId: 's7', name: 'Indre By – Urban Putting', city: 'København K', pricePerHour: 220, slots: ['16:45','17:45','18:45'] },

  // Volleyball (s8)
  { id: 'v071', sportId: 's8', name: 'DGI Byen – Volleyball', city: 'Vesterbro', pricePerHour: 220, slots: ['17:00','18:00','19:00'] },
  { id: 'v072', sportId: 's8', name: 'Frederiksberg Hallen – Volleyball', city: 'Frederiksberg', pricePerHour: 210, slots: ['16:30','17:30','18:30'] },
  { id: 'v073', sportId: 's8', name: 'Østerbrohallen – Volleyball', city: 'Østerbro', pricePerHour: 215, slots: ['17:15','18:15','19:15'] },
  { id: 'v074', sportId: 's8', name: 'Nørrebrohallen – Volleyball', city: 'Nørrebro', pricePerHour: 205, slots: ['16:45','17:45','18:45'] },
  { id: 'v075', sportId: 's8', name: 'Bellahøj – Volleyball', city: 'Bellahøj', pricePerHour: 210, slots: ['17:00','18:00','19:00'] },
  { id: 'v076', sportId: 's8', name: 'Valbyhallen – Volleyball', city: 'Valby', pricePerHour: 200, slots: ['16:30','17:30','18:30'] },
  { id: 'v077', sportId: 's8', name: 'Rødovre – Volleyball', city: 'Rødovre', pricePerHour: 195, slots: ['17:00','18:00','19:00'] },
  { id: 'v078', sportId: 's8', name: 'Hvidovre – Volleyball', city: 'Hvidovre', pricePerHour: 195, slots: ['16:30','17:30','18:30'] },
  { id: 'v079', sportId: 's8', name: 'Grøndal – Volleyball', city: 'Grøndal', pricePerHour: 205, slots: ['17:15','18:15','19:15'] },
  { id: 'v080', sportId: 's8', name: 'Amagerhallen – Volleyball', city: 'Amager', pricePerHour: 210, slots: ['17:00','18:00','19:00'] },
];

/* ---------- Berig venues med coords + billede ---------- */
export const VENUES = BASE_VENUES.map(v => {
  const coords = cityWithOffset(v.city, v.id); // unikke coords pr. venue
  return {
    ...v,
    coords,
    image: SPORT_IMAGES[v.sportId],
  };
});

/* ---------- Helpers ---------- */
export const getVenuesBySport = (sportId) =>
  VENUES.filter(v => v.sportId === sportId);

export const getVenueById = (venueId) =>
  VENUES.find(v => v.id === venueId) || null;

export const sortByDistance = (venues, userCoords) => {
  if (!userCoords) return venues;
  return [...venues].sort((a, b) => {
    const da = haversineKm(userCoords, a.coords) ?? Infinity;
    const db = haversineKm(userCoords, b.coords) ?? Infinity;
    return da - db;
  });
};

export const distanceFromUser = (venue, userCoords) =>
  haversineKm(userCoords, venue?.coords);