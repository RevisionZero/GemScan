import React from "react";
import { 
  StyleSheet, 
  useColorScheme, 
  View, 
  TouchableOpacity, 
  Text, 
  Image,
  Dimensions
} from "react-native";
import { ThemedText } from '@/components/ThemedText';
import { useRouter } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const { height } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const backgroundColor = isDark ? "#121212" : "#f9f9f9";
  const primaryTextColor = isDark ? "#ffffff" : "#000000";
  const buttonColor = isDark ? "#007AFF" : "#4CAF50";
  const borderColor = isDark ? "#444" : "#ccc";

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.safeArea, { backgroundColor, borderColor }]}>
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <ThemedText type="title" style={[styles.title, { color: primaryTextColor }]}>
            GemScan
          </ThemedText>
        </View>

        {/* Background Image Section */}
        <View style={styles.imageContainer}>
          <Image 
            source={require("../../assets/images/background.jpg")} 
            style={styles.backgroundImage} 
            resizeMode="cover"
          />
        </View>

        {/* Button Section (bottom half) */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: buttonColor }]}
            onPress={() => router.navigate('/identification/scan')}
          >
            <Text style={styles.buttonText}>Identify Gemstone</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: buttonColor }]}
            onPress={() => router.navigate('/identification/idHistory')}
          >
            <Text style={styles.buttonText}>View Identification History</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: buttonColor }]}
            onPress={() => router.navigate('/payment/payment')}
          >
            <Text style={styles.buttonText}>Upgrade Account</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    padding: 16,
    borderWidth: 2,
    // The borderColor is dynamically set via inline style
  },
  headerContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
  imageContainer: {
    // Reserve space for the background image between title and buttons.
    flex: 1,
    marginVertical: 20,
    borderRadius: 10,
    overflow: "hidden",
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
  },
  buttonContainer: {
    // Occupy the bottom half of the screen
    height: height * 0.5,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  button: {
    width: "80%",
    paddingVertical: 16,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3, // Android shadow
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
