import { View, Text, TouchableOpacity, Button, StyleSheet, Alert } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Camera, CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import { useRouter } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import GemIdentificationManager from "@/gemIdentification/gemIdentificationManagement/gemIdentificationManager";

export default function Scan(){
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView | null>(null);
    const router = useRouter();

    function imageFail(){
      Alert.alert('Scan Unsuccessful', 'Scan Unsuccessful', [
        {
          text: 'Retry Scan',
          onPress: () => {},
        },
        {
          text: 'Home',
          onPress: () => {router.navigate('/');GemIdentificationManager.getInstance().scanGemstone("")},
          style: 'cancel',
        }
      ]);
    }

    async function scanGem(){
      if(cameraRef.current){
        const pic = await cameraRef.current.takePictureAsync();
        console.log("Picture:", pic);
        const gemManager:GemIdentificationManager = GemIdentificationManager.getInstance();
        if(gemManager.scanGemstone(pic?.uri)){
          console.log('Navigate to describe')
          router.navigate('/identification/describeGem')
        }
        else{
          imageFail();
        }
      }
    };

    async function uploadImage() {
      let gemManager = GemIdentificationManager.getInstance();
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images', 'videos'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if(result["assets"]){
        let uri = result["assets"][0].uri;
        if(uri){
          gemManager.scanGemstone(uri);
          router.navigate('/identification/describeGem');
        }
        else{
          imageFail();
        }
        console.log('UPLOADED IMAGE:\n',result["assets"][0].uri);
      }
      else{
        imageFail();
      }
  
      // if (!result.canceled) {
      //   setImage(result.assets[0].uri);
      // }
    }

    if (!permission) {
        // Camera permissions are still loading.
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
          <View>
            <Text>We need your permission to show the camera</Text>
            <Button onPress={requestPermission} title="grant permission" />
          </View>
        );
    }

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }
    return(
        <SafeAreaProvider>
            <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={(ref) => { cameraRef.current = ref }}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
        <Button title="Scan" onPress={scanGem}></Button>
      </CameraView>
      <Button title="Upload Image" onPress={uploadImage}></Button>
    </View>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
    },
    message: {
      textAlign: 'center',
      paddingBottom: 10,
    },
    camera: {
      flex: 1,
    },
    buttonContainer: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: 'transparent',
      margin: 64,
    },
    button: {
      flex: 1,
      alignSelf: 'flex-end',
      alignItems: 'center',
    },
    text: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'white',
    },
  });