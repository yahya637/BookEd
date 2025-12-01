// screens/SportFritid/BookingScreen.js
import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { g, colors } from '../../styles/styles';
import { getVenueById } from '../../data/venues';
import { useBookings } from '../../store/bookings';
import PrimaryButton from '../../components/PrimaryButton';
import ProgressSteps from '../../components/ProgressSteps';

/* Helpers */
const daysAhead = 14;

const getNextDays = (n = 14) => {
  const out = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < n; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    out.push(d);
  }
  return out;
};

const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const slotIsPastToday = (date, slotHHMM) => {
  const now = new Date();
  if (!isSameDay(date, now)) return false;
  const [hh, mm] = (slotHHMM || '00:00').split(':').map(Number);
  const slotDate = new Date(date);
  slotDate.setHours(hh, mm, 0, 0);
  return slotDate.getTime() <= now.getTime();
};

export default function BookingScreen({ route, navigation }) {
  const { venueId } = route.params || {};
  const venue = useMemo(() => getVenueById(venueId), [venueId]);

  const [selectedDate, setSelectedDate] = useState(getNextDays(daysAhead)[0]);
  const [slot, setSlot] = useState(null);
  const { add } = useBookings();

  if (!venue) {
    return (
      <View style={[g.screen, g.center]}>
        <Text style={{ color: colors.text }}>Venue ikke fundet.</Text>
      </View>
    );
  }

  const days = getNextDays(daysAhead);
  const visibleSlots = (venue.slots || []).filter(
    (s) => !slotIsPastToday(selectedDate, s)
  );

  const confirm = () => {
    if (!slot || !selectedDate) return;
    const iso = selectedDate.toISOString().slice(0, 10); // YYYY-MM-DD
    add({
      id: `${venue.id}-${Date.now()}`,
      venueId: venue.id,
      venueName: venue.name,
      city: venue.city,
      price: venue.pricePerHour,
      dateISO: iso,
      time: slot,
    });
    const root = navigation.getParent?.();
    root?.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'TabBookings' }],
      })
    );
  };

  return (
    <View style={g.screen}>
      <Text style={g.title}>Vælg dato og tid</Text>
      <ProgressSteps current="book" style={g.progressTop} />

      {/* Dato */}
      <View style={[g.card, { marginTop: 8 }]}>
        <Text style={styles.heading}>{venue.name}</Text>
        <Text style={styles.heading}>Dato</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 4 }}
        >
          {days.map((d) => {
            const focused = isSameDay(d, selectedDate);
            const label = d.toLocaleDateString('da-DK', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
            });
            return (
              <Pressable
                key={d.toISOString()}
                onPress={() => {
                  setSelectedDate(d);
                  setSlot(null);
                }}
                style={[styles.chip, focused ? styles.chipActive : styles.chipIdle]}
              >
                <Text style={[styles.chipText, focused && styles.chipTextActive]}>
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Tider */}
      <View style={[g.card, { marginTop: 12 }]}>
        <Text style={styles.heading}>Tilgængelige tider</Text>
        <View style={[g.row, { flexWrap: 'wrap' }]}>
          {visibleSlots.length === 0 ? (
            <Text style={g.muted}>Ingen ledige tider på denne dato.</Text>
          ) : (
            visibleSlots.map((s) => {
              const focused = slot === s;
              return (
                <Pressable
                  key={s}
                  onPress={() => setSlot(s)}
                  style={[
                    styles.timeChip,
                    focused ? styles.timeChipActive : styles.timeChipIdle,
                  ]}
                >
                  <Text
                    style={[styles.timeText, focused && styles.timeTextActive]}
                  >
                    {s}
                  </Text>
                </Pressable>
              );
            })
          )}
        </View>
      </View>

      <PrimaryButton
        title="Bekræft booking"
        onPress={confirm}
        // hvis din PrimaryButton bruger mørk tekst, kan du tvinge hvid her:
        // textStyle={{ color: '#fff' }}
        style={{ marginTop: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontWeight: '700',
    marginBottom: 8,
    color: colors.text,           // ← vigtig: tydelig på mørk baggrund
  },

  // Dato-chips
  chip: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipIdle: {},
  chipText: {
    color: colors.text,           // lys tekst på mørk chip
    fontWeight: '700',
  },
  chipTextActive: {
    color: '#fff',                // hvid tekst på grøn chip
  },

  // Tid-chips
  timeChip: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  timeChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  timeChipIdle: {},
  timeText: {
    color: colors.text,           // ← manglede før (var sort / default)
    fontWeight: '700',
  },
  timeTextActive: {
    color: '#fff',                // ← manglede før
    fontWeight: '800',
  },
});