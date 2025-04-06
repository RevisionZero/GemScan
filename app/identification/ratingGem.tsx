// File: app/identification/ratingGem.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, TextInput } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { db } from '../../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default function RatingScreen() {
  const router = useRouter();
  const { id, gemName } = useLocalSearchParams<{ id: string; gemName: string }>();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const submitRating = async () => {
    if (rating === 0) {
      Alert.alert('Please select a rating.');
      return;
    }

    try {
      await updateDoc(doc(db, 'historydata', id), {
        rating: rating,
        feedback: feedback,
      });
      Alert.alert('Thank you!', 'Your rating and feedback have been submitted.');
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
      <TextInput
        style={styles.feedbackInput}
        placeholder="Leave your feedback..."
        value={feedback}
        onChangeText={setFeedback}
      />
      <Button title="Submit Rating" onPress={submitRating} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 16 
  },
  title: { 
    fontSize: 20, 
    marginBottom: 20 
  },
  feedbackInput: {
    height: 40,
    width: '80%',
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
});
