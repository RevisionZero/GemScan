import { View, Text, StyleSheet, TextInput, Button, useColorScheme } from "react-native";
import { getAuth } from 'firebase/auth';
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import GemIdentificationManager from "@/gemIdentification/gemIdentificationManagement/gemIdentificationManager";
import { router, useRouter } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function describeGem(){
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const backgroundColor = isDark ? '#121212' : '#f9f9f9';
  const textColor = isDark ? '#ffffff' : '#000000';
  const inputBackground = isDark ? '#1e1e1e' : '#ffffff';

  const [color, setColor] = useState("red");
  const [size, setSize] = useState("0");
  const [transparency, setTransparency] = useState("transparent");
  const [fluorescence, setFluorescence] = useState("");
  const [shape, setShape] = useState("");
  const [luster, setLuster] = useState("metallic");

  const router = useRouter();

  async function submitDescription(){
    const gemManager = GemIdentificationManager.getInstance();
    console.log('Gemstone desc from describeGem:', color, size, transparency, luster);
    gemManager.describeGemstone(color, +size, transparency, luster);
    let finalResult = await gemManager.identifyGemstone();
    console.log('Received Final Result:', finalResult);

    // Save the result in the database
    try {
      await saveResult(
        finalResult.name,
        String(finalResult.result),
        String(finalResult.confidence)
      );
    } catch (error) {
      console.error("Error saving the result: ", error);
    }

    router.push({
      pathname: '/identification/identificationResult',
      params: {
        result: String(finalResult.result),
        name: finalResult.name,
        confidence: String(finalResult.confidence),
        image: finalResult.gemstone.getImage(),
        color: finalResult.gemstone.getColorString(),
        size: String(finalResult.gemstone.getSize()),
        transparency: finalResult.gemstone.getTransparency(),
        shininess: finalResult.gemstone.getShininess()
      }
    });
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
        <View style={[styles.container, { backgroundColor }]}>
          <Text style={[styles.title, { color: textColor }]}>Provide Gemstone Description</Text>
          <View style={styles.row}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: textColor }]}>Closest Color:</Text>
              <Picker
                selectedValue={color}
                onValueChange={(itemValue, itemIndex) => {
                  setColor(itemValue);
                  console.log('COLOR STATE:', itemValue);
                }}
                style={[styles.picker, { color: textColor, backgroundColor: inputBackground }]}
              >
                <Picker.Item label="Red" value="red" />
                <Picker.Item label="Blue" value="blue" />
                <Picker.Item label="Green" value="green" />
                <Picker.Item label="Yellow" value="yellow" />
                <Picker.Item label="White" value="white" />
              </Picker>
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: textColor }]}>Transparency:</Text>
              <Picker
                selectedValue={transparency}
                onValueChange={(itemValue, itemIndex) => setTransparency(itemValue)}
                style={[styles.picker, { color: textColor, backgroundColor: inputBackground }]}
              >
                <Picker.Item label="Transparent" value="transparent" />
                <Picker.Item label="Translucent" value="translucent" />
                <Picker.Item label="Opaque" value="opaque" />
              </Picker>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: textColor }]}>Size:</Text>
              <TextInput
                style={[styles.input, { color: textColor, backgroundColor: inputBackground }]}
                placeholder="cm³"
                placeholderTextColor={isDark ? '#888' : '#666'}
                value={size}
                onChangeText={setSize}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: textColor }]}>Shininess:</Text>
              <Picker
                selectedValue={luster}
                onValueChange={(itemValue, itemIndex) => setLuster(itemValue)}
                style={[styles.picker, { color: textColor, backgroundColor: inputBackground }]}
              >
                <Picker.Item label="Metallic" value="metallic" />
                <Picker.Item label="Waxy" value="waxy" />
                <Picker.Item label="Dull" value="dull" />
                <Picker.Item label="Pearly" value="pearly" />
              </Picker>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <Button title="Submit" onPress={submitDescription} color="#4CAF50" />
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const saveResult = async (
  gemName: string, 
  result: string, 
  confidence: string
): Promise<void> => {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const uid = currentUser ? currentUser.uid : null; // null if not logged in

  await addDoc(collection(db, 'historydata'), {
    gemName,
    result,
    confidence,
    timing: serverTimestamp(),
    rating: null,
    userID: uid,
    feedback: null,
  });
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  inputGroup: {
    flex: 1,
    marginHorizontal: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  buttonContainer: {
    marginTop: 20,
    alignSelf: 'center',
    width: '60%',
  },
});
