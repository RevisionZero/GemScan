import { useRootNavigationState } from "expo-router";
import { useRouter, useSegments } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { FIREBASE_AUTH, onAuthStateChanged } from "../lib/firebase";

// Import Firebase auth

const Index = () => {
    const segments = useSegments();
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigationState = useRootNavigationState();
    const auth = FIREBASE_AUTH;

    useEffect(() => {
        if (!navigationState?.key) return;

        // Set up an auth state listener
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
            }
        });

        return () => unsubscribe(); // Clean up the listener on unmount
    }, [navigationState?.key]);

    useEffect(() => {
        if (!navigationState?.key) return;

        const inAuthGroup = segments[0] === "auth";

        if (
            // If the user is not signed in and the initial segment is not in the auth group
            !isLoggedIn &&
            !inAuthGroup
        ) {
            // Redirect to the login page
            router.replace("/auth/Authentication");
        } else if (isLoggedIn) {
            // Redirect to the home page if logged in
            router.replace("/(tabs)");
        }
    }, [isLoggedIn, segments, navigationState?.key]);

    return (
        <View>{!navigationState?.key ? <Text>LOADING...</Text> : <></>}</View>
    );
};

export default Index;
