import { Button, Text, StyleSheet, View, useColorScheme } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import Result from '@/gemIdentification/types/result';

export default function IdentificationResult() {
  const { 
    result, 
    name, 
    confidence, 
    image, 
    color, 
    size, 
    transparency, 
    shininess 
  } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  
  const backgroundColor = isDark ? "#121212" : "#f9f9f9";
  const textColor = isDark ? "#ffffff" : "#000000";

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        {result === 'true' ? (
          <View style={styles.contentContainer}>
            <Text style={[styles.title, { color: textColor }]}>
              Identification Success!
            </Text>
            <Text style={[styles.subtitle, { color: textColor }]}>
              Your gemstone is:
            </Text>
            <Text style={[styles.name, { color: textColor }]}>{name}</Text>
            <Text style={[styles.details, { color: textColor }]}>
              Confidence: {confidence}
            </Text>
            <Text style={[styles.details, { color: textColor }]}>
              Color: {color}
            </Text>
            <Text style={[styles.details, { color: textColor }]}>
              Size: {size}
            </Text>
            <Text style={[styles.details, { color: textColor }]}>
              Transparency: {transparency}
            </Text>
            <Text style={[styles.details, { color: textColor }]}>
              Shininess: {shininess}
            </Text>
            <View style={styles.buttonWrapper}>
              <Button
                title="Back to Home"
                onPress={() => router.replace("/")}
                color={isDark ? "#007AFF" : "#4CAF50"}
              />
            </View>
          </View>
        ) : (
          <View style={styles.contentContainer}>
            <Text style={[styles.title, { color: textColor }]}>
              Identification Failure
            </Text>
            <View style={styles.buttonWrapper}>
              <Button
                title="Try Again"
                onPress={() => router.back()}
                color={isDark ? "#007AFF" : "#4CAF50"}
              />
            </View>
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 5,
    textAlign: "center",
  },
  name: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 15,
  },
  details: {
    fontSize: 16,
    marginBottom: 3,
  },
  buttonWrapper: {
    marginTop: 20,
    width: "60%",
  },
});
