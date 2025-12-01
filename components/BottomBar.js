// components/BottomBar.js
import React from 'react';
import { View, Text, Pressable, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { g, colors } from '../styles/styles';

export default function BottomBar() {
  const insets = useSafeAreaInsets();
  const nav = useNavigation();
  const root = nav.getParent?.() || nav;

  const state = root.getState?.();
  const active = state?.routes?.[state.index]?.name; // 'TabExplore' | 'TabBookings' | 'TabProfile'

  const goTab = (name) => {
    root.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name }],
      })
    );
  };

  const Item = ({ tabName, icon, label }) => {
    const focused = active === tabName;
    return (
      <Pressable style={g.bottomItem} onPress={() => goTab(tabName)}>
        <Ionicons name={icon} size={22} color={focused ? colors.primary : colors.muted} />
        <Text style={[g.bottomLabel, { color: focused ? colors.primary : colors.muted }]}>{label}</Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView
      pointerEvents="box-none"
      style={[g.bottomBarContainer, { paddingBottom: Math.max(insets.bottom, 6) }]}
    >
      <View style={g.bottomBar}>
        <Item tabName="TabExplore"  icon="search-outline"   label="Søg" />
        <Item tabName="TabBookings" icon="calendar-outline" label="Bookinger" />
        <Item tabName="TabProfile"  icon="person-outline"   label="Profil" />
      </View>
    </SafeAreaView>
  );
}