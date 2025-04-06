import { Button,Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Result from '@/gemIdentification/types/result';
import { useRouter } from "expo-router";
import { useLocalSearchParams } from 'expo-router';

interface IdentificationResultProps {
    result: Result;
}

export default function IdentificationResult(){
    const {
        result, name, confidence,
        image, color, size, transparency,
        shininess
    } = useLocalSearchParams();
    const router = useRouter();
    console.log('RES:\n',name)
    return(
        <SafeAreaProvider>
            <SafeAreaView>
                {result == 'true' ? (
                    <SafeAreaView>
                        <Text>Identification Success! Your gemstone is:</Text>
                        <Text>{name}</Text>
                    </SafeAreaView>
                    ) : (
                    <Text>Identification Failure</Text>
                    )}
            </SafeAreaView>
        </SafeAreaProvider>
    );
}