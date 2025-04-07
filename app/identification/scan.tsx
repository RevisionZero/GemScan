import { View, Text, TouchableOpacity, Button, StyleSheet, Alert, useColorScheme } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import { useRouter } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import GemIdentificationManager from "@/gemIdentification/gemIdentificationManagement/gemIdentificationManager";

export default function Scan() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const router = useRouter();

  async function scanGem() {
    if (cameraRef.current) {
      const pic = await cameraRef.current.takePictureAsync();
      console.log("Picture:", pic);
      const gemManager: GemIdentificationManager = GemIdentificationManager.getInstance();
      if (gemManager.scanGemstone(pic?.uri)) {
        console.log('Navigate to describe');
        router.navigate('/identification/describeGem');
      } else {
        Alert.alert('Scan Unsuccessful', 'Scan Unsuccessful', [
          { text: 'Retry Scan', onPress: () => {} },
          { text: 'Home', onPress: () => { router.navigate('/'); gemManager.scanGemstone(""); }, style: 'cancel' }
        ]);
      }
    }
  };

  async function uploadImage() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(result);
  }

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={[styles.permissionContainer, { backgroundColor: isDark ? '#121212' : '#fff' }]}>
        <Text style={[styles.permissionText, { color: isDark ? '#fff' : '#000' }]}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" color="#007AFF" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#000' : '#fff' }]}>
        <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
          <CameraView style={styles.camera} facing={facing} ref={(ref) => { cameraRef.current = ref }}>
            <View style={styles.overlay}>
              <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
                <Text style={styles.flipButtonText}>Flip Camera</Text>
              </TouchableOpacity>
            </View>
          </CameraView>
          <View style={styles.controls}>
            <Button title="Scan" onPress={scanGem} color="#4CAF50" />
            <View style={styles.spacer} />
            <Button title="Upload Image" onPress={uploadImage} color="#2196F3" />
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 16,
  },
  flipButton: {
    alignSelf: 'center',
    backgroundColor: '#ffffff80',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  flipButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 16,
  },
  spacer: {
    width: 20,
  },
});
// This code is a React Native component that uses Expo's Camera API to scan gemstones.
// It includes camera permissions, a camera view, and buttons to scan or upload images.