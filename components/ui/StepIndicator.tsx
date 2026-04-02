import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/context/ThemeContext';

type StepIndicatorProps = {
  currentStep: number;
  totalSteps?: number;
};

export default function StepIndicator({ currentStep, totalSteps = 3 }: StepIndicatorProps) {
  const activeAnim = useRef(new Animated.Value(0)).current;
  const { colors } = useAppTheme();
  const styles = getStyles(colors);

  useEffect(() => {
    activeAnim.setValue(0);
    Animated.timing(activeAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, [currentStep]);

  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const step = index + 1;
        const isActive = step === currentStep;
        const isDone = step < currentStep;

        return (
          <View key={step} style={styles.stepContainer}>
            {/* Line before except for first step */}
            {index !== 0 && (
              <View style={[styles.line, isDone ? styles.lineDone : null]} />
            )}
            
            <View style={styles.dotWrapper}>
              <Animated.View
                style={[
                  styles.dot,
                  isActive ? styles.dotActive : isDone ? styles.dotDone : styles.dotInactive,
                  isActive ? {
                    transform: [{
                      scale: activeAnim.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [1, 1.15, 1.1],
                      })
                    }]
                  } : null
                ]}
              >
                <Text style={[
                  styles.dotText,
                  isActive || isDone ? styles.dotTextActive : styles.dotTextInactive
                ]}>
                  {step}
                </Text>
              </Animated.View>
            </View>

            {/* Line after except for last step */}
            {index !== totalSteps - 1 && (
              <View style={[styles.line, isDone ? styles.lineDone : null]} />
            )}
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
    justifyContent: 'center',
    paddingVertical: 24,
    width: '100%',
    paddingHorizontal: 20,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  lineDone: {
    backgroundColor: colors.accent,
    opacity: 0.4,
  },
  dotWrapper: {
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  dotInactive: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
  },
  dotActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  dotDone: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  dotText: {
    fontSize: 13,
    fontWeight: '800',
  },
  dotTextInactive: {
    color: '#CBD5E1',
  },
  dotTextActive: {
    color: '#FFFFFF',
  },
});
