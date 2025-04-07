import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ActivityIndicator,
    Button,
    KeyboardAvoidingView,
    Platform,
    useColorScheme,
  } from "react-native";
  import React, { useState } from "react";
  import { FIREBASE_AUTH } from "../../lib/firebase";
  import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
  } from "firebase/auth";
  import { useRouter } from "expo-router";
  import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
  
  export default function Authentication() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
  
    const signIn = async () => {
      setLoading(true);
      try {
        const response = await signInWithEmailAndPassword(auth, email, password);
        console.log(response);
        router.replace("/(tabs)");
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
  
    const signUp = async () => {
      setLoading(true);
      try {
        const response = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        console.log(response);
      } catch (error: any) {
        console.log(error);
        alert("Sign up Failed: " + error.message);
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <SafeAreaProvider>
        <SafeAreaView
          style={[
            styles.container,
            { backgroundColor: isDark ? "#121212" : "#f9f9f9" },
          ]}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardView}
          >
            <Text style={[styles.header, { color: isDark ? "#fff" : "#000" }]}>
              Welcome
            </Text>
            <TextInput
              value={email}
              style={[
                styles.input,
                {
                  backgroundColor: isDark ? "#333" : "#fff",
                  color: isDark ? "#fff" : "#000",
                },
              ]}
              placeholder="Email"
              placeholderTextColor={isDark ? "#ccc" : "#888"}
              autoCapitalize="none"
              onChangeText={(text) => setEmail(text)}
            />
            <TextInput
              secureTextEntry={true}
              value={password}
              style={[
                styles.input,
                {
                  backgroundColor: isDark ? "#333" : "#fff",
                  color: isDark ? "#fff" : "#000",
                },
              ]}
              placeholder="Password"
              placeholderTextColor={isDark ? "#ccc" : "#888"}
              autoCapitalize="none"
              onChangeText={(text) => setPassword(text)}
            />
  
            {loading ? (
              <ActivityIndicator size="large" color={isDark ? "#fff" : "#0000ff"} />
            ) : (
              <View style={styles.buttonContainer}>
                <View style={styles.button}>
                  <Button
                    title="Login"
                    onPress={signIn}
                    color={isDark ? "#007AFF" : "#4CAF50"}
                  />
                </View>
                <View style={styles.button}>
                  <Button
                    title="Create Account"
                    onPress={signUp}
                    color={isDark ? "#007AFF" : "#4CAF50"}
                  />
                </View>
              </View>
            )}
          </KeyboardAvoidingView>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      paddingHorizontal: 20,
    },
    keyboardView: {
      flex: 1,
      justifyContent: "center",
    },
    header: {
      fontSize: 28,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 20,
    },
    input: {
      height: 50,
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 15,
      marginVertical: 8,
      borderColor: "#ccc",
    },
    buttonContainer: {
      marginTop: 20,
    },
    button: {
      marginVertical: 5,
    },
  });
  