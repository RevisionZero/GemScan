import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, TextInput, useColorScheme } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { db } from '../../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default function RatingScreen() {
  const router = useRouter();
  const { id, gemName } = useLocalSearchParams<{ id: string; gemName: string }>();
  const colorScheme = useColorScheme();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const backgroundColor = colorScheme === 'dark' ? '#121212' : '#ffffff';
  const textColor = colorScheme === 'dark' ? '#ffffff' : '#000000';
  const placeholderTextColor = '#888888';

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
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: textColor }]}>Rate: {gemName}</Text>
      <AirbnbRating
        count={5}
        defaultRating={0}
        showRating={false}
        onFinishRating={setRating}
        starContainerStyle={styles.starContainer}
      />
      <TextInput
        style={[styles.feedbackInput, { color: textColor, borderColor: textColor }]}
        placeholder="Leave your feedback..."
        placeholderTextColor={placeholderTextColor}
        value={feedback}
        onChangeText={setFeedback}
      />
      <View style={styles.buttonContainer}>
        <Button
          title="Submit Rating"
          onPress={submitRating}
          color={colorScheme === 'dark' ? '#2196F3' : '#007AFF'}
        />
      </View>
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
    fontSize: 22, 
    marginBottom: 20, 
    fontWeight: 'bold'
  },
  feedbackInput: {
    height: 40,
    width: '90%',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 15,
  },
  buttonContainer: {
    width: '90%',
    marginTop: 10,
  },
  starContainer: {
    marginVertical: 10,
  },
});
// This code is a React Native component for a rating screen.
// It allows users to rate a gem and leave feedback.