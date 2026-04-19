import React from 'react';
import { ImageBackground, Pressable, StyleSheet, Text, View, Image } from 'react-native';
import { Location } from '../types';
import { colors, fontSizes, radius, spacing } from '../theme/theme';
import { useFavorites } from '../storage/FavoritesContext';

interface Props {
  location: Location;
  onPress: () => void;
  layout?: 'large' | 'row';
}

const LocationCard: React.FC<Props> = ({ location, onPress, layout = 'large' }) => {
  const { isFavorite, toggle } = useFavorites();
  const fav = isFavorite(location.id);

  if (layout === 'row') {
    return (
      <Pressable style={styles.row} onPress={onPress}>
        <Image source={location.image} style={styles.rowImage} />
        <View style={styles.rowContent}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{location.category.toUpperCase()}</Text>
          </View>
          <Text style={styles.rowTitle} numberOfLines={1}>{location.title}</Text>
          <Text style={styles.rowSubtitle} numberOfLines={2}>{location.subtitle}</Text>
          <Text style={styles.rowCoords} numberOfLines={1}>{location.gpsText}</Text>
        </View>
        <Pressable onPress={() => toggle(location.id)} hitSlop={8} style={styles.rowBookmark}>
          <Text style={styles.bookmarkEmoji}>{fav ? '🔖' : '📑'}</Text>
        </Pressable>
      </Pressable>
    );
  }

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <ImageBackground source={location.image} style={styles.cardImage} imageStyle={styles.cardImageInner}>
        <View style={styles.cardTop}>
          <View style={styles.tag}><Text style={styles.tagText}>{location.category.toUpperCase()}</Text></View>
          <Pressable onPress={() => toggle(location.id)} hitSlop={8} style={styles.bookmarkBtn}>
            <Text style={styles.bookmarkEmoji}>{fav ? '🔖' : '📑'}</Text>
          </Pressable>
        </View>
        <View style={styles.cardBottom}>
          <Text style={styles.cardTitle}>{location.title}</Text>
          <Text style={styles.cardSubtitle} numberOfLines={2}>{location.subtitle}</Text>
        </View>
      </ImageBackground>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 220,
    borderRadius: radius.xl,
    overflow: 'hidden',
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
  },
  cardImage: { flex: 1, justifyContent: 'space-between', padding: spacing.md },
  cardImageInner: { borderRadius: radius.xl },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between' },
  cardBottom: {
    backgroundColor: 'rgba(0,0,0,0.55)',
    padding: spacing.md,
    borderRadius: radius.md,
    marginHorizontal: -4,
  },
  cardTitle: { color: colors.text, fontSize: fontSizes.lg, fontWeight: '700' },
  cardSubtitle: { color: colors.textMuted, fontSize: fontSizes.sm, marginTop: 2 },
  tag: {
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.sm,
    alignSelf: 'flex-start',
  },
  tagText: { color: colors.text, fontSize: fontSizes.xs, fontWeight: '800', letterSpacing: 0.5 },
  bookmarkBtn: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookmarkEmoji: { fontSize: 16 },
  row: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    alignItems: 'center',
  },
  rowImage: { width: 86, height: 86, borderRadius: radius.md, marginRight: spacing.md },
  rowContent: { flex: 1 },
  rowTitle: { color: colors.text, fontSize: fontSizes.md, fontWeight: '700', marginTop: 4 },
  rowSubtitle: { color: colors.textMuted, fontSize: fontSizes.sm, marginTop: 2 },
  rowCoords: { color: colors.textDim, fontSize: fontSizes.xs, marginTop: 4 },
  rowBookmark: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LocationCard;