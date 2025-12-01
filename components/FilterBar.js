// components/FilterBar.js
import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { g, colors } from '../styles/styles';
import { useFilters } from '../store/filters';
import { VENUES } from '../data/venues';

const PRICE_STEPS = [200, 250, 300, 350];
const DIST_STEPS = [2, 5, 10, 20];

export default function FilterBar() {
  const { state, setMaxPrice, setMaxDistance, toggleCity, setSortBy, clear } = useFilters();
  const [open, setOpen] = useState(false);

  const cities = useMemo(
    () => Array.from(new Set(VENUES.map((v) => v.city))).sort(),
    []
  );

  const Chip = ({ active, label, onPress, pill = false }) => (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        pill && styles.pill,
        active ? styles.chipActive : styles.chipIdle,
      ]}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );

  return (
    <View style={[g.card, { marginBottom: 10 }]}>
      {/* Quick actions row */}
      <View style={g.rowBetween}>
        <View style={g.row}>
          <Text style={g.h2}>Filtre</Text>
        </View>
        <View style={g.row}>
          <Pressable onPress={() => setOpen((v) => !v)} style={styles.linkBtn}>
            <Text style={styles.linkText}>{open ? 'Skjul' : 'Vis'}</Text>
          </Pressable>
          <Pressable onPress={clear} style={[styles.linkBtn, { marginLeft: 8 }]}>
            <Text style={styles.linkText}>Nulstil</Text>
          </Pressable>
        </View>
      </View>

      {/* Collapsible body */}
      {open && (
        <View style={{ marginTop: 8 }}>
          {/* Sortering */}
          <Text style={styles.sectionLabel}>Sortér</Text>
          <View style={[g.row, { flexWrap: 'wrap', marginTop: 8 }]}>
            <Chip
              label="Afstand"
              active={state.sortBy === 'distance'}
              onPress={() => setSortBy('distance')}
              pill
            />
            <Chip
              label="Pris"
              active={state.sortBy === 'price'}
              onPress={() => setSortBy('price')}
              pill
            />
          </View>

          {/* Pris */}
          <Text style={[styles.sectionLabel, { marginTop: 12 }]}>Maks pris (kr./t)</Text>
          <View style={[g.row, { flexWrap: 'wrap', marginTop: 8 }]}>
            <Chip
              label="Ingen"
              active={state.maxPrice === null}
              onPress={() => setMaxPrice(null)}
              pill
            />
            {PRICE_STEPS.map((p) => (
              <Chip
                key={p}
                label={`≤ ${p}`}
                active={state.maxPrice === p}
                onPress={() => setMaxPrice(p)}
                pill
              />
            ))}
          </View>

          {/* Afstand */}
          <Text style={[styles.sectionLabel, { marginTop: 12 }]}>Maks afstand (km)</Text>
          <View style={[g.row, { flexWrap: 'wrap', marginTop: 8 }]}>
            <Chip
              label="Alle"
              active={state.maxDistanceKm === null}
              onPress={() => setMaxDistance(null)}
              pill
            />
            {DIST_STEPS.map((d) => (
              <Chip
                key={d}
                label={`≤ ${d}`}
                active={state.maxDistanceKm === d}
                onPress={() => setMaxDistance(d)}
                pill
              />
            ))}
          </View>

          {/* Byer */}
          <Text style={[styles.sectionLabel, { marginTop: 12 }]}>Byer</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 4 }}
          >
            {cities.map((city) => (
              <Chip
                key={city}
                label={city}
                active={state.cities.includes(city)}
                onPress={() => toggleCity(city)}
              />
            ))}
          </ScrollView>
          <Text style={[g.muted, { marginTop: 6 }]}>(Ingen by valgt = alle byer)</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  pill: { borderRadius: 20 },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipIdle: {},
  chipText: { color: colors.text, fontWeight: '700' },
  chipTextActive: { color: '#fff' },
  linkBtn: { paddingVertical: 6, paddingHorizontal: 8 },
  linkText: { color: colors.primary, fontWeight: '700' },
  sectionLabel: { fontWeight: '700', color: colors.text },
});