import { MaterialCommunityIcons } from '@expo/vector-icons';
import { memo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '@/context/ThemeContext';

type SkillChipsProps = {
  items: string[];
  onRemove?: (index: number) => void;
  onAdd?: () => void;
  addLabel?: string;
};

function SkillChipsComponent({
  items,
  onRemove,
  onAdd,
  addLabel = '+ Add Skill',
}: SkillChipsProps) {
  const { colors } = useAppTheme();
  const styles = getStyles(colors);
  return (
    <View style={styles.wrap}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {items.map((label, index) => (
          <View key={`${label}-${index}`} style={styles.chip}>
            <Text style={styles.chipText} numberOfLines={1}>
              {label}
            </Text>
            {onRemove ? (
              <Pressable
                hitSlop={8}
                onPress={() => onRemove(index)}
                style={styles.remove}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={14}
                  color={colors.textSecondary}
                />
              </Pressable>
            ) : null}
          </View>
        ))}
        {onAdd ? (
          <Pressable style={styles.addButton} onPress={onAdd}>
            <Text style={styles.addText}>{addLabel}</Text>
          </Pressable>
        ) : null}
      </ScrollView>
    </View>
  );
}

export const SkillChips = memo(SkillChipsComponent);

function getStyles(colors: any) {
  return StyleSheet.create({
  wrap: {
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surfaceIcon,
    borderRadius: 999,
    paddingVertical: 8,
    paddingLeft: 14,
    paddingRight: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    maxWidth: 140,
  },
  remove: {
    padding: 2,
  },
  addButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderStyle: 'dashed',
  },
  addText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});
}
