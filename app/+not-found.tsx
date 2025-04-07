import React from 'react';
import { Link, Stack } from 'expo-router';
import { StyleSheet, useColorScheme } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function NotFoundScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  // Set a link background color that adapts to the current mode.
  const linkBackground = isDark ? '#1E90FF' : '#007AFF';

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          This screen doesn't exist.
        </ThemedText>
        <Link href="/" style={[styles.linkContainer, { backgroundColor: linkBackground }]}>
          <ThemedText type="link" style={styles.linkText}>
            Go to home screen!
          </ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    textAlign: 'center',
  },
  linkContainer: {
    marginTop: 15,
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  linkText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});
// This code defines a NotFoundScreen component for a React Native application using Expo Router.
// It displays a message indicating that the requested screen does not exist and provides a link to navigate back to the home screen.