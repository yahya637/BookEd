// screens/SportFritid/PreviousScreen.js
import React from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { g, colors } from '../../styles/styles';
import { useBookings } from '../../store/bookings';
import BottomBar from '../../components/BottomBar';

const fmt = (iso, time) => {
  try {
    const d = new Date(iso);
    const dStr = d.toLocaleDateString('da-DK', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
    return `${dStr} kl. ${time}`;
  } catch {
    return `${iso} kl. ${time}`;
  }
};

export default function PreviousScreen({ navigation }) {
  const { bookings, remove, clear, ready } = useBookings();

  if (!ready) {
    return (
      <View style={[g.screen, g.center]}>
        <Text style={{ color: colors.text }}>Indlæser…</Text>
      </View>
    );
  }

  return (
    <View style={[g.screen, g.screenWithBar]}>
      <Text style={g.title}>Mine bookinger</Text>

      {bookings.length === 0 ? (
        <View style={[g.card, g.center]}>
          <Text style={{ color: colors.textMuted }}>Ingen bookinger endnu.</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={bookings}
            keyExtractor={(b) => b.id}
            contentContainerStyle={s.pb80}
            ItemSeparatorComponent={() => <View style={g.divider} />}
            renderItem={({ item }) => (
              <View style={g.card}>
                <View style={g.rowBetween}>
                  <Text style={[g.text, g.semibold]}>{item.venueName}</Text>
                  <Text style={[g.text, s.price]}>{item.price} kr./t</Text>
                </View>

                <Text style={{ color: colors.textMuted }}>{item.city}</Text>
                <Text style={[{ color: colors.text }, s.mt8]}>
                  {fmt(item.dateISO, item.time)}
                </Text>

                <View style={[g.rowBetween, s.mt10]}>
                  <Pressable
                    onPress={() => remove(item.id)}
                    hitSlop={10}
                    style={s.linkHit}
                  >
                    <Text style={s.linkDanger}>Slet</Text>
                  </Pressable>
                  {/* plads til “Del” eller “Se kvittering” senere */}
                  <View />
                </View>
              </View>
            )}
          />

          <Pressable onPress={clear} hitSlop={10} style={s.clearAll}>
            <Text style={s.linkMuted}>Ryd alle</Text>
          </Pressable>
        </>
      )}

      <BottomBar navigation={navigation} active="bookings" />
    </View>
  );
}

const s = StyleSheet.create({
  price: { fontWeight: '700', color: colors.text },
  mt8: { marginTop: 8 },
  mt10: { marginTop: 10 },
  pb80: { paddingBottom: 80 },
  clearAll: { alignSelf: 'center', marginTop: 6 },
  linkHit: { paddingVertical: 4, paddingHorizontal: 2 },

  // “Link”-farver så de er tydelige på mørk baggrund
  linkDanger: { color: colors.danger, fontWeight: '700' },
  linkMuted: { color: colors.textMuted, fontWeight: '700' },
});