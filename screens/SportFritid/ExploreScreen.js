import React from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import { g } from '../../styles/styles';
import { SPORTS } from '../../data/sports';
import BottomBar from '../../components/BottomBar';
import ProgressSteps from '../../components/ProgressSteps';

export default function ExploreScreen({ navigation }) {
  return (
    <View style={[g.screen, g.screenWithBar]}>
      <Text style={g.title}>Vælg sportsgren</Text>
      <ProgressSteps current="sport" style={g.progressTop} />

      <FlatList
        data={SPORTS}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={g.sportRow}
        contentContainerStyle={g.pb120}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable
            style={g.sportChip}
            onPress={() => navigation.navigate('FacilityDetails', { sportId: item.id })}
          >
            <Text style={g.sportIcon}>{item.icon}</Text>
            <Text style={g.sportName}>{item.name}</Text>
          </Pressable>
        )}
      />

      <BottomBar />
    </View>
  );
}