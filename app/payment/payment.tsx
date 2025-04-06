import React, { useEffect, useState } from "react";
import { View, Button, Alert, ActivityIndicator } from "react-native";
import {
  useStripe,
  initPaymentSheet,
  presentPaymentSheet,
} from "@stripe/stripe-react-native";

export default function Payment() {
  const [payableAmount, setPayableAmount] = useState(600);
  const [paymentReady, setPaymentReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const API_URL = "http://10.0.2.2:8080"; // Replace this

  const fetchPaymentSheetParams = async () => {
    const response = await fetch(`${API_URL}/payment-sheet`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: payableAmount }),
    });
    const { paymentIntent, ephemeralKey, customer } = await response.json();
    return { paymentIntent, ephemeralKey, customer };
  };

  const initializePaymentSheet = async () => {
    const { paymentIntent, ephemeralKey, customer } =
      await fetchPaymentSheetParams();

    const { error } = await initPaymentSheet({
      merchantDisplayName: "Example, Inc.",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: "Jane Doe",
      },
    });

    if (!error) {
      setPaymentReady(true);
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();
    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert("Success", "Your order is confirmed!");
    }
  };
   useEffect(() => {
      initializePaymentSheet();
    }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
      {loading && <ActivityIndicator size="large" />}
      <Button
        title="Pay $0.99"
        onPress={async () => {
          setLoading(true);
          await initializePaymentSheet().then(async () => {
            await openPaymentSheet();
            setLoading(false);
          });
        }}
     disabled={ loading}

      />
    </View>
  );
}
