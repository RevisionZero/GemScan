// File: app/identification/history.tsx
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { collection, getDocs, query, orderBy, where, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../lib/firebase';

export default function History() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [historyData, setHistoryData] = useState<any[]>([]);

  const fetchHistory = async () => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.error('No user is logged in.');
        setHistoryData([]);
        return;
      }
      console.log('Current user UID:', currentUser.uid);
      // Query only the records for the current user
      const q = query(
        collection(db, 'historydata'),
        where('userID', '==', currentUser.uid),
        orderBy('timing', 'desc')
      );
      const snapshot = await getDocs(q);
      console.log('Number of docs found:', snapshot.size);
      const results = snapshot.docs.map(doc => {
        console.log('Doc data:', doc.data());
        return { id: doc.id, ...doc.data() };
      });
      setHistoryData(results);
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchHistory();
    }, [])
  );

  // Dynamic colors based on device theme
  const backgroundColor = colorScheme === 'dark' ? '#121212' : '#ffffff';
  const itemBackgroundColor = colorScheme === 'dark' ? '#1e1e1e' : '#f9f9f9';
  const textColor = colorScheme === 'dark' ? '#ffffff' : '#000000';
  const secondaryTextColor = colorScheme === 'dark' ? '#aaaaaa' : '#555555';

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <FlatList
        data={historyData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const date = item.timing instanceof Timestamp 
            ? item.timing.toDate().toLocaleString() 
            : 'Unknown Date';
          
          return (
            <TouchableOpacity
              style={[styles.item, { backgroundColor: itemBackgroundColor }]}
              // Disable rating if already provided
              disabled={item.rating != null}
              onPress={() =>
                router.push({
                  pathname: '/identification/ratingGem',
                  params: {
                    id: String(item.id),
                    gemName: String(item.gemName),
                  },
                })
              }
            >
              <Text style={[styles.title, { color: textColor }]}>Gem: {item.gemName}</Text>
              <Text style={[styles.text, { color: secondaryTextColor }]}>Result: {item.result}</Text>
              <Text style={[styles.text, { color: secondaryTextColor }]}>Confidence: {item.confidence}</Text>
              <Text style={[styles.text, { color: secondaryTextColor }]}>Date: {date}</Text>
              {item.userID && <Text style={[styles.text, { color: secondaryTextColor }]}>User: {item.userID}</Text>}
              {item.feedback && <Text style={[styles.text, { color: secondaryTextColor }]}>Feedback: {item.feedback}</Text>}
              <Text style={item.rating ? styles.rated : styles.unrated}>
                {item.rating ? `Rating: ${item.rating} ★` : 'Tap to Rate ★'}
              </Text>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: secondaryTextColor }]}>
            No identification history yet.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16 
  },
  item: {
    padding: 12,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 3, // Android shadow
  },
  title: { 
    fontSize: 18, 
    fontWeight: 'bold',
    marginBottom: 4,
  },
  text: { 
    fontSize: 14,
    marginBottom: 2,
  },
  rated: { 
    marginTop: 4,
    fontSize: 16,
    color: '#4CAF50', 
    fontWeight: 'bold',
  },
  unrated: { 
    marginTop: 4,
    fontSize: 16,
    color: '#2196F3', 
    fontWeight: 'bold',
  },
  empty: { 
    textAlign: 'center', 
    marginTop: 20,
    fontSize: 16,
  },
});
// This component fetches and displays the identification history from Firestore.
// It uses a FlatList to render the items and allows users to tap on an item to rate it.
// The component also handles dynamic theming based on the device's color scheme.