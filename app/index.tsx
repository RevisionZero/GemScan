import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "../lib/firebase";

const Index = () => {
    const router = useRouter();
    const [authChecked, setAuthChecked] = useState(false);

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
            <View className="flex-1 justify-center items-center">
                <Text>Loading...</Text>
            </View>
        );
    }

    return null;
};

export default Index;
