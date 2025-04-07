import { StyleSheet, Image, Platform } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function HelpScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="questionmark.circle" // updated icon for help screen
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Help & Support</ThemedText>
      </ThemedView>
      <ThemedText style={styles.introText}>
        Welcome to GemScan! This app is designed to help you quickly identify gemstones by using your device's camera.
      </ThemedText>
      <Collapsible title="How to Identify a Gemstone">
        <ThemedText>
          To identify a gemstone, navigate to the "Identify Gemstone" screen and follow these steps:
        </ThemedText>
        <ThemedText>
          1. Grant camera permissions when prompted.
        </ThemedText>
        <ThemedText>
          2. Align the gemstone within the on-screen frame and tap "Scan."
        </ThemedText>
        <ThemedText>
          3. Wait for the app to process the image and return the identification result.
        </ThemedText>
      </Collapsible>
      <Collapsible title="Viewing Your Identification History">
        <ThemedText>
          After scanning, each identification is saved to your history. You can view past identifications, rate them, and provide feedback.
        </ThemedText>
        <ThemedText>
          Simply tap on "View Identification History" from the home screen to see a list of your previous scans.
        </ThemedText>
      </Collapsible>
      <Collapsible title="Rating and Feedback">
        <ThemedText>
          You can rate the accuracy of each identification and leave comments to help improve the system.
        </ThemedText>
        <ThemedText>
          This helps us refine the technology and deliver a better experience.
        </ThemedText>
      </Collapsible>
      <Collapsible title="Support & Documentation">
        <ThemedText>
          For further assistance, please visit our documentation or contact our support team.
        </ThemedText>
        <ExternalLink href="https://docs.example.com/gemscan">
          <ThemedText type="link">Read the full documentation</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Light and Dark Mode">
        <ThemedText>
          GemScan supports both light and dark mode. The app automatically adapts to your device settings.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
          <ThemedText type="link">Learn more about color themes</ThemedText>
        </ExternalLink>
      </Collapsible>
      {Platform.select({
        ios: (
          <Collapsible title="Animations">
            <ThemedText>
              Enjoy smooth animations powered by <ThemedText type="defaultSemiBold">react-native-reanimated</ThemedText>.
            </ThemedText>
            <ThemedText>
              The parallax effect in the header provides an engaging user experience.
            </ThemedText>
          </Collapsible>
        ),
      })}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 20,
  },
  introText: {
    fontSize: 16,
    marginHorizontal: 16,
    marginBottom: 20,
  },
});
