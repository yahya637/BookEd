// screens/SportFritid/AuthScreen.js
import React, { useState } from "react";
import { View, Text, TextInput, Alert } from "react-native";
import { g, colors } from "../../styles/styles";
import PrimaryButton from "../../components/PrimaryButton";
import { login, signUpOrLink } from "../../services/auth";
import { ensureProfile } from "../../services/profile";

export default function AuthScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = async () => {
    try {
      await login(email, password);
      await ensureProfile();
      navigation.goBack();
    } catch (e) {
      Alert.alert("Login fejlede", e?.message || "Prøv igen.");
    }
  };

  const onSignUp = async () => {
    try {
      await signUpOrLink(email, password);
      await ensureProfile();
      Alert.alert("Done", "Din bruger er klar.");
      navigation.goBack();
    } catch (e) {
      Alert.alert("Signup fejlede", e?.message || "Prøv igen.");
    }
  };

  return (
    <View style={[g.screen, { paddingTop: 24 }]}>
      <Text style={g.title}>Login</Text>

      <View style={g.card}>
        <Text style={g.inputLabel}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="email@eksempel.dk"
          placeholderTextColor={colors.textMuted}
          style={g.input}
        />

        <Text style={g.inputLabel}>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="mindst 6 tegn"
          placeholderTextColor={colors.textMuted}
          style={g.input}
        />

        <View style={{ marginTop: 16, gap: 10 }}>
          {/* Primary */}
          <PrimaryButton title="Log ind" onPress={onLogin} style={[g.btn, g.btnPrimary]} />

          {/* Outline secondary */}
          <PrimaryButton
            title="Opret bruger"
            onPress={onSignUp}
            style={[g.btn, g.btnOutline]}
            textStyle={g.btnOutlineText}
          />
        </View>
      </View>
    </View>
  );
}

