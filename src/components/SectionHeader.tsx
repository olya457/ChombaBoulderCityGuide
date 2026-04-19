import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSizes, spacing } from '../theme/theme';

interface Props {
  kicker?: string;
  title: string;
  right?: React.ReactNode;
}

const SectionHeader: React.FC<Props> = ({ kicker, title, right }) => (
  <View style={styles.row}>
    <View style={styles.left}>
      {kicker ? <Text style={styles.kicker}>{kicker}</Text> : null}
      <Text style={styles.title}>{title}</Text>
    </View>
    {right ? <View>{right}</View> : null}
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    marginBottom: spacing.md,
  },
  left: { flex: 1 },
  kicker: { color: colors.primary, fontSize: fontSizes.xs, fontWeight: '800', letterSpacing: 1.2, marginBottom: 4 },
  title: { color: colors.text, fontSize: fontSizes.xxl, fontWeight: '700' },
});

export default SectionHeader;