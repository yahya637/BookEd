import React from 'react';
import { Pressable, Text } from 'react-native';
import { g } from '../styles/styles';

export default function PrimaryButton({ title, onPress, style, textStyle }) {
  return (
    <Pressable onPress={onPress} style={[g.btn, g.btnPrimary, style]}>
      <Text style={[g.btnText, textStyle]}>{title}</Text>
    </Pressable>
  );
}
