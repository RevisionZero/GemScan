import React from "react";
import { signOut } from "firebase/auth";
import { FIREBASE_AUTH } from "../../lib/firebase";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Platform, Text, View, Button } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
    const router = useRouter();
    const handleLogout = async () => {
        try {
            await signOut(FIREBASE_AUTH);
            router.replace("/auth/Authentication"); // redirect to login screen
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <View className="flex-1 justify-center items-center">
            <Button title="Log Out" onPress={handleLogout} />
        </View>
    );
}
