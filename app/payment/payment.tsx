


import React, { useEffect, useState } from "react";
import { View, Button, Alert, ActivityIndicator, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";
import {
  useStripe,
  initPaymentSheet,
  presentPaymentSheet,
} from "@stripe/stripe-react-native";

export default function Payment() {
  const [selectedPlan, setSelectedPlan] = useState("basic");
  const [paymentReady, setPaymentReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const planPrices = {
    basic: 999,
    advanced: 1299,
    elite: 1999,
  };


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
  }, [selectedPlan]); // Re-init when plan changes

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
      <Text>Select a Subscription Plan:</Text>
      <Picker
        selectedValue={selectedPlan}
        onValueChange={(itemValue) => {
          setPaymentReady(false); // prevent accidental double payment while reloading
          setSelectedPlan(itemValue);
        }}
      >
        <Picker.Item label="Basic – $9.99" value="basic" />
        <Picker.Item label="Advanced – $12.99" value="advanced" />
        <Picker.Item label="Elite – $19.99" value="elite" />
      </Picker>

      {loading && <ActivityIndicator size="large" />}
      <Button
        title={`Subscribe – $${(planPrices[selectedPlan] / 100).toFixed(2)}`}
        onPress={async () => {
          setLoading(true);
          await openPaymentSheet();
          setLoading(false);
        }}
        disabled={!paymentReady || loading}
      />
    </View>
  );
}
