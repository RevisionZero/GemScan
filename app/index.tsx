import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, StyleSheet, useColorScheme } from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "../lib/firebase";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const Index = () => {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === "dark" ? "#121212" : "#ffffff";
  const textColor = colorScheme === "dark" ? "#ffffff" : "#000000";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (user) {
        router.replace("/(tabs)");
      } else {
        router.replace("/auth/Authentication");
      }
      setAuthChecked(true);
    });

    return unsubscribe;
  }, []);

  if (!authChecked) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={[styles.container, { backgroundColor }]}>
          <Text style={[styles.text, { color: textColor }]}>Loading...</Text>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return null;
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  text: {
    fontSize: 18,
    fontWeight: "600",
  },
});
