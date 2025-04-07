import React from "react";
import { StyleSheet, useColorScheme, View, Button } from "react-native";
import { ThemedText } from '@/components/ThemedText';
import { useRouter } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const backgroundColor = isDark ? "#121212" : "#f9f9f9";
  const primaryTextColor = isDark ? "#ffffff" : "#000000";
  const buttonColor = isDark ? "#007AFF" : "#4CAF50";

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
        <View style={styles.headerContainer}>
          <ThemedText type="title" style={[styles.title, { color: primaryTextColor }]}>
            GemScan
          </ThemedText>
        </View>
        <View style={styles.contentContainer}>
          <Button
            title="Identify Gemstone"
            onPress={() => router.navigate('/identification/scan')}
            color={buttonColor}
          />
          <View style={styles.buttonSpacer} />
          <Button
            title="View Identification History"
            onPress={() => router.navigate('/identification/idHistory')}
            color={buttonColor}
          />
        </View>
        <View style={styles.buttonSpacer} />
                  <Button
                    title="Upgrade Account"
                    onPress={() => router.navigate('/payment/payment')}
                    color={buttonColor}
                  />

      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    padding: 16,
  },
  headerContainer: {
    marginBottom: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonSpacer: {
    height: 20,
  },
});
