import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Ctx = createContext();

export function BookingsProvider({ children }) {
  const [bookings, setBookings] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('@bookings');
        if (raw) setBookings(JSON.parse(raw));
      } catch {}
      setReady(true);
    })();
  }, []);

  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem('@bookings', JSON.stringify(bookings)).catch(() => {});
  }, [bookings, ready]);

  const add = (b) => setBookings(prev => [b, ...prev]);
  const remove = (id) => setBookings(prev => prev.filter(b => b.id !== id));
  const clear = () => setBookings([]);

  return <Ctx.Provider value={{ bookings, add, remove, clear, ready }}>{children}</Ctx.Provider>;
}

export const useBookings = () => useContext(Ctx);