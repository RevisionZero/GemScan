import { View, Text } from "react-native";

export default function describeGem(){
    return(
        <View>
            <Text>Provide Description:</Text>
        </View>
    );
};

import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const saveResult = async (gemName: string) => {
  await addDoc(collection(db, 'identifications'), {
    gemName,
    date: serverTimestamp(),
    rating: null,
  });
};
