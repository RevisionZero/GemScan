import React, { useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  useColorScheme, 
  Alert 
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  where, 
  Timestamp, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';
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

  // Function to delete a document from Firestore
  const handleDelete = async (itemId: string) => {
    try {
      await deleteDoc(doc(db, 'historydata', itemId));
      // Refetch history after deletion
      fetchHistory();
    } catch (error) {
      console.error("Error deleting item: ", error);
      Alert.alert("Error", "Could not delete the item.");
    }
  };

  // Dynamic colors based on device theme
  const backgroundColor = colorScheme === 'dark' ? '#121212' : '#ffffff';
  const itemBackgroundColor = colorScheme === 'dark' ? '#1e1e1e' : '#f9f9f9';
  const textColor = colorScheme === 'dark' ? '#ffffff' : '#000000';
  const secondaryTextColor = colorScheme === 'dark' ? '#aaaaaa' : '#555555';
  // Choose delete background based on theme: a medium gray for light and a dark gray for dark mode.
  const deleteBackgroundColor = colorScheme === 'dark' ? '#444444' : '#999999';

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
            <View style={[styles.item, { backgroundColor: itemBackgroundColor }]}>
              <TouchableOpacity
                style={styles.itemContent}
                // Tapping the left 75% navigates to rating
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
                <Text style={[styles.title, { color: textColor }]}>
                  Gem: {item.gemName}
                </Text>
                <Text style={[styles.text, { color: secondaryTextColor }]}>
                  Result: {item.result}
                </Text>
                <Text style={[styles.text, { color: secondaryTextColor }]}>
                  Confidence: {item.confidence}
                </Text>
                <Text style={[styles.text, { color: secondaryTextColor }]}>
                  Date: {date}
                </Text>
                {item.feedback && (
                  <Text style={[styles.text, { color: secondaryTextColor }]}>
                    Feedback: {item.feedback}
                  </Text>
                )}
                <Text style={item.rating ? styles.rated : styles.unrated}>
                  {item.rating ? `Rating: ${item.rating} ★` : 'Tap to Rate ★'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.deleteSection, { backgroundColor: deleteBackgroundColor }]}
                // Tapping the right 25% deletes the item
                onPress={() =>
                  Alert.alert(
                    "Delete",
                    "Are you sure you want to delete this item?",
                    [
                      { text: "Cancel", style: "cancel" },
                      { text: "Delete", style: "destructive", onPress: () => handleDelete(item.id) }
                    ]
                  )
                }
              >
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
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
    flexDirection: 'row',
    alignItems: 'stretch', // ensure children stretch to full height
    padding: 12,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 3, // Android shadow
  },
  itemContent: {
    flex: 3, // 75% width
    justifyContent: 'center',
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
  deleteSection: {
    flex: 1, // 25% width
    alignSelf: 'stretch', // take up full height of parent
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginLeft: 8,
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
