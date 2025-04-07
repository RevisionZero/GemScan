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

  const fetchPaymentSheetParams = async () => {
    const stripeSecretKey = 'sk_test_51RAF0eRonbo1nkc2n4Huib5tfOk0HEgqLv9Pm3WNtRkLiKUw4kQGhWCr3yMGfUpn4WLDZ69q9vyMYihokB442Ug400aScOey9N';
    const selectedAmount = planPrices[selectedPlan];

    // 1. Create customer
    const customerRes = await fetch("https://api.stripe.com/v1/customers", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeSecretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    const customer = await customerRes.json();

    // 2. Create ephemeral key
    const ephemeralKeyRes = await fetch("https://api.stripe.com/v1/ephemeral_keys", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeSecretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "Stripe-Version": "2023-10-16",
      },
      body: `customer=${customer.id}`,
    });
    const ephemeralKey = await ephemeralKeyRes.json();

    // 3. Create payment intent
    const paymentIntentRes = await fetch("https://api.stripe.com/v1/payment_intents", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeSecretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `amount=${selectedAmount}&currency=cad&customer=${customer.id}&automatic_payment_methods[enabled]=true`,
    });
    const paymentIntent = await paymentIntentRes.json();

    return {
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
    };
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
  }, [selectedPlan]);

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
      <Text>Select a Subscription Plan:</Text>
      <Picker
        selectedValue={selectedPlan}
        onValueChange={(itemValue) => {
          setPaymentReady(false);
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
