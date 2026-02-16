import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

type StepIndicatorProps = {
  currentStep: number;
  totalSteps?: number;
};

export default function StepIndicator({ currentStep, totalSteps = 5 }: StepIndicatorProps) {
  const activeAnim = useRef(new Animated.Value(0)).current;

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

const styles = StyleSheet.create({
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
    backgroundColor: '#D7E2EE',
  },
  lineHidden: {
    opacity: 0,
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D7E2EE',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotActive: {
    borderColor: '#0BA0B2',
    backgroundColor: '#0BA0B2',
  },
  dotDone: {
    borderColor: '#0B2D3E',
    backgroundColor: '#0B2D3E',
  },
  dotText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9AA7B6',
  },
  dotTextActive: {
    color: '#FFFFFF',
  },
  dotTextDone: {
    color: '#FFFFFF',
  },
});
