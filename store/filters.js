// store/filters.js
import React, { createContext, useContext, useMemo, useState } from 'react';

const FiltersContext = createContext(null);

const DEFAULT = {
  maxPrice: null,       // fx 250 (kr./t) eller null = ingen grænse
  maxDistanceKm: null,  // fx 5 (km) eller null = ingen grænse
  cities: [],           // [] = alle
  sortBy: 'distance',   // 'distance' | 'price'
};

export function FiltersProvider({ children }) {
  const [state, setState] = useState(DEFAULT);

  const value = useMemo(() => ({
    state,
    setMaxPrice: (v) => setState((s) => ({ ...s, maxPrice: v })),
    setMaxDistance: (v) => setState((s) => ({ ...s, maxDistanceKm: v })),
    toggleCity: (city) =>
      setState((s) => {
        const on = s.cities.includes(city);
        const cities = on ? s.cities.filter((c) => c !== city) : [...s.cities, city];
        return { ...s, cities };
      }),
    setSortBy: (sortBy) => setState((s) => ({ ...s, sortBy })),
    clear: () => setState(DEFAULT),
  }), [state]);

  return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>;
}

export const useFilters = () => useContext(FiltersContext);