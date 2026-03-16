import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, ImageStyle, StyleProp, Text, TextStyle, ViewStyle } from 'react-native';

import { useAppTheme } from '@/context/ThemeContext';

type AuthLogoBrandProps = {
  brandLabel?: string;
  logoStyle?: StyleProp<ImageStyle>;
  brandStyle?: StyleProp<TextStyle>;
  gradientStyle?: StyleProp<ViewStyle>;
};

const defaultLogoSize = { width: 86, height: 86 };
const defaultGradientSize = { height: 26, width: 140 };

export default function AuthLogoBrand({
  brandLabel = 'ZIEN',
  logoStyle,
  brandStyle,
  gradientStyle,
}: AuthLogoBrandProps) {
  const { colors } = useAppTheme();
  return (
    <>
      <Image
        source={require('@/assets/images/icon.png')}
        style={[defaultLogoSize, { marginBottom: 8 }, logoStyle]}
        resizeMode="contain"
      />
      {brandLabel ? (
        <MaskedView
          maskElement={
            <Text
              style={[
                {
                  fontSize: 20,
                  letterSpacing: 2.2,
                  fontWeight: '700',
                  color: colors.textPrimary,
                  textAlign: 'center',
                },
                brandStyle,
              ]}>
              {brandLabel}
            </Text>
          }>
          <LinearGradient
            colors={[...colors.brandGradient] as any}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              defaultGradientSize,
              { alignSelf: 'center', marginBottom: 18 },
              gradientStyle,
            ]}
          />
        </MaskedView>
      ) : null}
    </>
  );
}
