import { View, Text, StyleSheet, TextInput, Button } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import GemIdentificationManager from "@/gemIdentification/gemIdentificationManagement/gemIdentificationManager";
// import { TextInput } from "react-native-gesture-handler";


export default function describeGem(){
    const [color, setColor] = useState("");
    const [size, setSize] = useState("");
    const [transparency, setTransparency] = useState("");
    const [fluorescence, setFluorescence] = useState("");
    const [shape, setShape] = useState("");
    const [luster, setLuster] = useState("");

    function submitDescription(){
      const gemManager = GemIdentificationManager.getInstance();
      gemManager.describeGemstone(color,+size, transparency, luster);
      gemManager.identifyGemstone();

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
                <Picker selectedValue={color} onValueChange={setColor}>
                  <Picker.Item label="Red" value="red" />
                  <Picker.Item label="Blue" value="blue" />
                  <Picker.Item label="Green" value="green" />
                  <Picker.Item label="Yellow" value="yellow" />
                  <Picker.Item label="White" value="white" />
                </Picker>
              </View>
              <View style={{flex:1}}>
                <Text>Transparency:</Text>
                <Picker selectedValue={transparency} onValueChange={setTransparency}>
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
                <Picker selectedValue={luster} onValueChange={setLuster}>
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

const saveResult = async (gemName: string) => {
  await addDoc(collection(db, 'identifications'), {
    gemName,
    date: serverTimestamp(),
    rating: null,
  });
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});