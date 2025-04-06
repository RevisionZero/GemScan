import { View, Text, StyleSheet, TextInput, Button } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import GemIdentificationManager from "@/gemIdentification/gemIdentificationManagement/gemIdentificationManager";
import DataExpert from "@/gemIdentification/experts/dataExpert";
import Gemstone from "@/gemIdentification/types/gemstone";
import Result from "@/gemIdentification/types/result";
import { router, useRouter } from "expo-router";
// import { TextInput } from "react-native-gesture-handler";


export default function describeGem(){
    const [color, setColor] = useState("red");
    const [size, setSize] = useState("0");
    const [transparency, setTransparency] = useState("transparent");
    const [fluorescence, setFluorescence] = useState("");
    const [shape, setShape] = useState("");
    const [luster, setLuster] = useState("metallic");

    const router = useRouter();

    async function submitDescription(){
      const gemManager = GemIdentificationManager.getInstance();
      console.log('Gemstone desc from describeGem:')
      console.log(color)
      console.log(size)
      console.log(transparency)
      console.log(luster)
      gemManager.describeGemstone(color,+size, transparency, luster);
      let finalResult = await gemManager.identifyGemstone();
      console.log('\n\n\nRECIEVED FINAL RESULT\n',finalResult)

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

    return(
        <View style={[styles.container,{flexDirection:"column"}]}>
          <Text>Provide Gemstone Description:</Text>
          <View style={[styles.container,{flexDirection:"row"}]}>
              {/* <View style={{flex:1}}>
                <Text>Color:</Text>
                <TextInput style={{borderWidth:1}} placeholder="Color" value={color} onChangeText={setColor}></TextInput>
              </View> */}
              <View style={{flex:1}}>
                <Text>Closest Color:</Text>
                <Picker selectedValue={color} onValueChange={(itemValue, itemIndex) => {setColor(itemValue), console.log('COLOR STATE:\n', color)}}>
                  <Picker.Item label="Red" value="red" />
                  <Picker.Item label="Blue" value="blue" />
                  <Picker.Item label="Green" value="green" />
                  <Picker.Item label="Yellow" value="yellow" />
                  <Picker.Item label="White" value="white" />
                </Picker>
              </View>
              <View style={{flex:1}}>
                <Text>Transparency:</Text>
                <Picker selectedValue={transparency} onValueChange={(itemValue, itemIndex) => setTransparency(itemValue)}>
                  <Picker.Item label="Transparent" value="transparent" />
                  <Picker.Item label="Translucent" value="translucent" />
                  <Picker.Item label="Opaque" value="opaque" />
                </Picker>
              </View>
          </View>
          <View style={[styles.container,{flexDirection:"row"}]}>
              <View style={{flex:1}}>
                <Text>Size:</Text>
                <TextInput style={{borderWidth:1}} placeholder="cm^3" value={size} onChangeText={setSize}></TextInput>
              </View>
              <View style={{flex:1}}>
                <Text>Shininess:</Text>
                <Picker selectedValue={luster} onValueChange={(itemValue, itemIndex) => setLuster(itemValue)}>
                  <Picker.Item label="Metallic" value="metallic" />
                  <Picker.Item label="Waxy" value="waxy" />
                  <Picker.Item label="Dull" value="dull" />
                  <Picker.Item label="Pearly" value="pearly" />
                </Picker>
              </View>
          </View>
          <View style={[styles.container,{flexDirection:"row"}]}>
              <View style={{flex:1}}>
                <Button title="Submit" onPress={submitDescription}></Button>
              </View>
          </View>
        </View>
    );
};

const saveResult = async (
  gemName: string, 
  result: string, 
  confidence: string
): Promise<void> => {
  await addDoc(collection(db, 'historydata'), {
    gemName,
    result,
    confidence,
    timing: serverTimestamp(),
    rating: null,
    userID: null,
    feedback: null,
  });
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});