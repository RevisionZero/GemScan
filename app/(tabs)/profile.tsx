import React from "react";
import { signOut } from "firebase/auth";
import { FIREBASE_AUTH } from "../../lib/firebase";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, View, Button, useColorScheme } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Get current user data from Firebase Auth
  const currentUser = FIREBASE_AUTH.currentUser;
  const userEmail = currentUser ? currentUser.email : "Unknown Email";
  // Use the user's photo if available, otherwise fallback to a default avatar
  const userPhoto = currentUser && currentUser.photoURL 
    ? { uri: currentUser.photoURL } 
    : require("../../assets/images/defaultuser.png");

  const handleLogout = async () => {
    try {
      await signOut(FIREBASE_AUTH);
      router.replace("/auth/Authentication"); // redirect to login screen
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.container, { backgroundColor: isDark ? "#121212" : "#f9f9f9" }]}>
        <View style={styles.profileContainer}>
          <Image source={userPhoto} style={styles.avatar} />
          <Text style={[styles.email, { color: isDark ? "#fff" : "#000" }]}>{userEmail}</Text>
          <View style={styles.buttonContainer}>
            <Button title="Log Out" onPress={handleLogout} color={isDark ? "#007AFF" : "#4CAF50"} />
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  email: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 30,
  },
  buttonContainer: {
    width: "60%",
  },
});
