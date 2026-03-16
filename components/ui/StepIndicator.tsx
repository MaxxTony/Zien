import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/context/ThemeContext';

type StepIndicatorProps = {
  currentStep: number;
  totalSteps?: number;
};

export default function StepIndicator({ currentStep, totalSteps = 5 }: StepIndicatorProps) {
  const activeAnim = useRef(new Animated.Value(0)).current;
  const { colors } = useAppTheme();
  const styles = getStyles(colors);

  useEffect(() => {
    activeAnim.setValue(0);
    Animated.timing(activeAnim, {
      toValue: 1,
      duration: 280,
      useNativeDriver: true,
    }).start();
  }, [activeAnim, currentStep]);

  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const step = index + 1;
        const isActive = step === currentStep;
        const isDone = step < currentStep;

        return (
          <View key={step} style={styles.stepWrapper}>
            <View style={[styles.line, step === 1 ? styles.lineHidden : null]} />
            <Animated.View
              style={[
                styles.dot,
                isDone ? styles.dotDone : null,
                isActive ? styles.dotActive : null,
                isActive
                  ? {
                      transform: [
                        {
                          scale: activeAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.9, 1.12],
                          }),
                        },
                      ],
                    }
                  : null,
              ]}>
              <Text
                style={[
                  styles.dotText,
                  isDone ? styles.dotTextDone : null,
                  isActive ? styles.dotTextActive : null,
                ]}>
                {step}
              </Text>
            </Animated.View>
            <View style={[styles.line, step === totalSteps ? styles.lineHidden : null]} />
          </View>
        );
      })}
    </View>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 18,
  },
  stepWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  line: {
    width: 24,
    height: 2,
    backgroundColor: colors.divider,
  },
  lineHidden: {
    opacity: 0,
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.divider,
    backgroundColor: colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotActive: {
    borderColor: colors.accentTeal,
    backgroundColor: colors.accentTeal,
  },
  dotDone: {
    borderColor: colors.accentDark,
    backgroundColor: colors.accentDark,
  },
  dotText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
  },
  dotTextActive: {
    color: colors.textOnAccent,
  },
  dotTextDone: {
    color: colors.textOnAccent,
  },
});
