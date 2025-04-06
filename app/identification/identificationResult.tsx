import { Button,Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Result from '@/gemIdentification/types/result';
import { useRouter } from "expo-router";
import { useLocalSearchParams } from 'expo-router';
import { shareGemResult } from '../../lib/shareUtils';
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

    const handleShare = () => {
        shareGemResult({
          result: String(result),
          name: String(name),
          confidence: String(confidence),
          color: String(color),
          size: String(size),
          transparency: String(transparency),
          shininess: String(shininess)
        });
      };
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
        <Button title="Share" onPress={handleShare} />

            </SafeAreaView>



        </SafeAreaProvider>
    );
}