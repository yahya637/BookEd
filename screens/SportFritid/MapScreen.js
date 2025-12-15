import React, { useEffect, useMemo, useState } from 'react';
import { View, Text } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { g } from '../../styles/styles';
import { VENUES, getVenuesBySport, getVenueById } from '../../data/venues';

export default function MapScreen({ route, navigation }) {
  const { sportId, focusVenueId } = route.params || {};
  const [region, setRegion] = useState({
    latitude: 55.6761, longitude: 12.5683, latitudeDelta: 0.1, longitudeDelta: 0.1,
  });

  const data = useMemo(() => sportId ? getVenuesBySport(sportId) : VENUES, [sportId]);

  // Zoom på valgt venue hvis angivet
  useEffect(() => {
    if (!focusVenueId) return;
    const v = getVenueById(focusVenueId);
    if (v?.coords) {
      setRegion({
        latitude: v.coords.latitude,
        longitude: v.coords.longitude,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03,
      });
    }
  }, [focusVenueId]);

  // (Valgfrit) find brugerens lokation – i simulator: Features → Location → Custom Location (sæt Kbh)
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;
      } catch {}
    })();
  }, []);

  return (
    <View style={g.screen}>
      <Text style={g.title}>Kort</Text>
      <View style={{ flex: 1, borderRadius: 12, overflow: 'hidden' }}>
        <MapView style={{ flex: 1 }} region={region} onRegionChangeComplete={setRegion}>
          {data.map(v => (
            <Marker
              key={v.id}
              coordinate={v.coords}
              title={v.name}
              description={v.city}
              pinColor={v.id === focusVenueId ? 'tomato' : undefined}
            >
              <Callout onPress={() => navigation.navigate('Booking', { venueId: v.id })}>
                <View style={{ maxWidth: 220 }}>
                  <Text style={{ fontWeight: '700' }}>{v.name}</Text>
                  <Text style={{ color: '#6b7280' }}>{v.city}</Text>
                  <Text style={{ marginTop: 4 }}>{v.pricePerHour} kr./t</Text>
                  <Text style={{ marginTop: 4, color: '#0a84ff' }}>Tryk for at booke</Text>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
      </View>
    </View>
  );
}
