// utils/shareUtils.ts
import { Share } from 'react-native';

interface ShareGemResultOptions {
  result: string;
  name?: string;
  confidence?: string;
  color?: string;
  size?: string;
  transparency?: string;
  shininess?: string;
}

export const shareGemResult = async ({
  result,
  name,
  confidence,
  color,
  size,
  transparency,
  shininess,
}: ShareGemResultOptions) => {
  try {
    const message = result === 'true'
      ? `Gemstone Identification Success! 🎉\n\nName: ${name}\nConfidence: ${confidence}%\nColor: ${color}\nSize: ${size}\nTransparency: ${transparency}\nShininess: ${shininess}`
      : 'Gemstone Identification Failed. Try again!';

    await Share.share({ message });
  } catch (error) {
    console.error('Error sharing result:', error);
  }
};
