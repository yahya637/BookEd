// screens/SportFritid/FacilityDetailsScreen.js
import React, { useEffect, useMemo, useState, useLayoutEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { Image } from "expo-image";
import * as Location from "expo-location";

import { g, colors } from "../../styles/styles";
import PrimaryButton from "../../components/PrimaryButton";
import ProgressSteps from "../../components/ProgressSteps";
import FilterBar from "../../components/FilterBar";
import { getVenuesBySport, sortByDistance, distanceFromUser } from "../../data/venues";
import { useFilters } from "../../store/filters";
import { SPORTS } from "../../data/sports";

const BLURHASH = "L5H2EC=PM+yV0g-mq.wG9c010J}I";

export default function FacilityDetailsScreen({ route, navigation }) {
  const { sportId } = route.params || {};
  const [user, setUser] = useState(null);
  const { state: filters } = useFilters();

  const sportName = SPORTS.find((s) => s.id === sportId)?.name || "—";
  useLayoutEffect(() => {
    navigation.setOptions({ title: `Vælg bane · ${sportName}` });
  }, [navigation, sportName]);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") return;
        const pos = await Location.getCurrentPositionAsync({});
        setUser({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
      } catch {}
    })();
  }, []);

  const base = useMemo(() => getVenuesBySport(sportId), [sportId]);

  useEffect(() => {
    base.forEach((v) => {
      if (typeof v.image === "string") Image.prefetch(v.image);
    });
  }, [base]);

  const baseSorted = useMemo(() => sortByDistance(base, user), [base, user]);

  const filtered = useMemo(() => {
    return baseSorted.filter((v) => {
      if (filters.maxPrice !== null && v.pricePerHour > filters.maxPrice) return false;
      if (filters.maxDistanceKm !== null && user) {
        const d = distanceFromUser(v, user);
        if (d !== null && d > filters.maxDistanceKm) return false;
      }
      if (filters.cities.length > 0 && !filters.cities.includes(v.city)) return false;
      return true;
    });
  }, [baseSorted, filters, user]);

  const venues = useMemo(() => {
    if (filters.sortBy === "price") return [...filtered].sort((a, b) => a.pricePerHour - b.pricePerHour);
    return filtered;
  }, [filtered, filters.sortBy]);

  return (
    <View style={g.screen}>
      <ProgressSteps current="venue" style={g.progressTop} />
      <FilterBar />

      <FlatList
        data={venues}
        keyExtractor={(v) => v.id}
        contentContainerStyle={{ paddingBottom: 140 }}
        initialNumToRender={6}
        windowSize={5}
        maxToRenderPerBatch={8}
        updateCellsBatchingPeriod={50}
        removeClippedSubviews
        renderItem={({ item }) => {
          const dist = user ? distanceFromUser(item, user) : null;
          const imgSource = typeof item.image === "string" ? { uri: item.image } : item.image;

          return (
            <View style={g.card}>
              <Image
                source={imgSource}
                style={g.venueImage}
                contentFit="cover"
                placeholder={BLURHASH}
                transition={150}
                cachePolicy="memory-disk"
                recyclingKey={item.id}
              />

              <Text style={g.venueTitle}>{item.name}</Text>

              <Text style={g.venueMeta}>
                {item.city}
                {dist !== null ? ` • ${dist} km` : ""}
              </Text>

              {/* FIX: pris-tekst farve */}
              <Text style={styles.priceText}>{item.pricePerHour} kr./t</Text>

              <View style={[g.row, { marginTop: 10 }]}>
                <PrimaryButton
                  title="Vælg tid"
                  onPress={() => navigation.navigate("Booking", { venueId: item.id, sportId })}
                  style={{ flex: 1, marginRight: 8 }}
                />

                <PrimaryButton
                  title="Se kort"
                  onPress={() => navigation.navigate("Map", { focusVenueId: item.id })}
                  style={[styles.mapBtn, { flex: 1 }]}
                  textStyle={styles.mapBtnText}
                />
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={[g.card, { alignItems: "center" }]}>
            <Text style={{ color: colors.textMuted }}>Ingen venues matcher dine filtre.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  priceText: {
    marginTop: 4,
    color: colors.text,
    fontWeight: "700",
  },

  mapBtn: {
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  mapBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primary,
  },
});

