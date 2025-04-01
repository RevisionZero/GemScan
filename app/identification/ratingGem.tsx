// File: app/identification/ratingGem.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { db } from '../../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default function RatingScreen() {
  const router = useRouter();
  const { id, gemName } = useLocalSearchParams<{ id: string; gemName: string }>();
  const [rating, setRating] = useState(0);

  const submitRating = async () => {
    if (rating === 0) {
      Alert.alert('Please select a rating.');
      return;
    }

    try {
      await updateDoc(doc(db, 'identifications', id), {
        rating: rating,
      });
      Alert.alert('Thank you!', 'Your rating has been submitted.');
      router.back();
    } catch (error) {
      console.error('Rating error:', error);
      Alert.alert('Error submitting rating');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rate: {gemName}</Text>
      <AirbnbRating
        count={5}
        defaultRating={0}
        showRating={false}
        onFinishRating={setRating}
      />
      <Button title="Submit Rating" onPress={submitRating} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { fontSize: 20, marginBottom: 20 },
});