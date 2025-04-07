import React, { useEffect, useState } from "react";
import { 
  View, 
  Button, 
  Alert, 
  ActivityIndicator, 
  Text, 
  StyleSheet, 
  useColorScheme, 
  Platform 
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useStripe } from "@stripe/stripe-react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Payment() {
  const [selectedPlan, setSelectedPlan] = useState("basic");
  const [paymentReady, setPaymentReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const planPrices = {
    basic: 999,
    advanced: 1299,
    elite: 1999,
  };

  // Use your local backend endpoint; 10.0.2.2 is the correct alias for Android emulators.
  const API_URL = "http://10.0.2.2:8080";

  const fetchPaymentSheetParams = async () => {
    const response = await fetch(`${API_URL}/payment-sheet`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: planPrices[selectedPlan] }),
    });
    const { paymentIntent, ephemeralKey, customer } = await response.json();
    return { paymentIntent, ephemeralKey, customer };
  };

  const initializePaymentSheet = async () => {
    const { paymentIntent, ephemeralKey, customer } = await fetchPaymentSheetParams();

    const { error } = await initPaymentSheet({
      merchantDisplayName: "GemScan",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: "Jane Doe",
      },
    });

    if (!error) setPaymentReady(true);
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();
    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert("Success", "Your subscription is confirmed!");
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, [selectedPlan]); // reinitialize when plan changes

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.container, { backgroundColor: isDark ? "#121212" : "#f9f9f9" }]}>
        <Text style={[styles.header, { color: isDark ? "#fff" : "#000" }]}>
          Select a Subscription Plan:
        </Text>
        <Picker
          selectedValue={selectedPlan}
          onValueChange={(itemValue) => {
            setPaymentReady(false); // prevent accidental double payments while reloading
            setSelectedPlan(itemValue);
          }}
          style={[
            styles.picker,
            { color: isDark ? "#fff" : "#000", backgroundColor: isDark ? "#1e1e1e" : "#fff" }
          ]}
          dropdownIconColor={isDark ? "#fff" : "#000"}
        >
          <Picker.Item label="Basic – $9.99" value="basic" />
          <Picker.Item label="Advanced – $12.99" value="advanced" />
          <Picker.Item label="Elite – $19.99" value="elite" />
        </Picker>
        {loading && <ActivityIndicator style={styles.activityIndicator} size="large" color={isDark ? "#fff" : "#0000ff"} />}
        <View style={styles.buttonContainer}>
          <Button
            title={`Subscribe – $${(planPrices[selectedPlan] / 100).toFixed(2)}`}
            onPress={async () => {
              setLoading(true);
              await openPaymentSheet();
              setLoading(false);
            }}
            disabled={!paymentReady || loading}
            color={isDark ? "#007AFF" : "#4CAF50"}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  header: {
    fontSize: 20,
    marginBottom: 16,
    textAlign: "center",
  },
  picker: {
    marginHorizontal: 12,
    marginBottom: 24,
  },
  activityIndicator: {
    marginVertical: 16,
  },
  buttonContainer: {
    alignSelf: Platform.OS === "android" ? "center" : "flex-start",
    width: Platform.OS === "android" ? "80%" : "60%",
  },
});
