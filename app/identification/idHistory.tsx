// File: app/identification/history.tsx
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function History() {
  const router = useRouter();
  const [historyData, setHistoryData] = useState<any[]>([]);

  const fetchHistory = async () => {
    try {
      const q = query(collection(db, 'identifications'), orderBy('date', 'desc'));
      const snapshot = await getDocs(q);
      const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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

  return (
    <View style={styles.container}>
      <FlatList
        data={historyData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const date = item.date instanceof Timestamp ? item.date.toDate().toLocaleString() : 'Unknown Date';
          return (
            <TouchableOpacity
              style={styles.item}
              disabled={item.rating != null}
              onPress={() =>
                router.push({
                  pathname: '/identification/ratingGem' as const,
                  params: {
                    id: String(item.id),
                    gemName: String(item.gemName),
                  },
                })
              }
            >
              <Text style={styles.title}>{item.gemName}</Text>
              <Text>{date}</Text>
              <Text style={item.rating ? styles.rated : styles.unrated}>
                {item.rating ? `Rating: ${item.rating} ★` : 'Tap to Rate ★'}
              </Text>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={<Text style={styles.empty}>No identification history yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  item: {
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 10
  },
  title: { fontSize: 18, fontWeight: 'bold' },
  rated: { color: 'green', marginTop: 4 },
  unrated: { color: '#007bff', marginTop: 4 },
  empty: { textAlign: 'center', marginTop: 20, color: '#555' },
});