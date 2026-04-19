import React, { useState } from 'react';
import { ImageBackground, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import ScreenWrapper from '../../components/ScreenWrapper';
import { locationsData } from '../../data/locations';
import { Location, RootStackParamList } from '../../types';
import { categoryColors, colors, fontSizes, IS_ANDROID, radius, spacing } from '../../theme/theme';
import { useFavorites } from '../../storage/FavoritesContext';

type Props = NativeStackScreenProps<RootStackParamList, 'LocationDetail'>;

const LocationDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const location = locationsData.find((l: Location) => l.id === route.params.locationId);
  const { isFavorite, toggle } = useFavorites();
  const [mapOpen, setMapOpen] = useState(false);

  if (!location) {
    return (
      <ScreenWrapper variant="main">
        <Text style={styles.title}>Not found</Text>
      </ScreenWrapper>
    );
  }

  const fav = isFavorite(location.id);

  const onShare = () => {
    Share.share({ message: `${location.title} — ${location.address}` });
  };

  return (
    <ScreenWrapper variant="main" contentPaddingTop={false}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <ImageBackground source={location.image} style={styles.cover} imageStyle={styles.coverImage}>
          <View style={styles.coverTop}>
            <Pressable onPress={() => navigation.goBack()} style={styles.roundBtn}>
              <Text style={styles.roundIcon}>‹</Text>
              <Text style={styles.backLabel}>Back</Text>
            </Pressable>
            <Pressable onPress={() => toggle(location.id)} style={styles.roundBtn}>
              <Text style={styles.roundIcon}>{fav ? '🔖' : '📑'}</Text>
            </Pressable>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{location.category.toUpperCase()}</Text>
          </View>
        </ImageBackground>

        <View style={styles.body}>
          <Text style={styles.title}>{location.title}</Text>
          <Text style={styles.address}>{location.address}</Text>

          <View style={styles.gpsCard}>
            <LinearGradient
              colors={[colors.gradientStart, colors.gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gpsIconWrap}
            >
              <Text style={styles.gpsIcon}>📍</Text>
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <Text style={styles.gpsLabel}>GPS COORDINATES</Text>
              <Text style={styles.gpsText}>{location.gpsText}</Text>
              <Text style={styles.gpsDecimal}>{location.gpsDecimal}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>About this place</Text>
          <Text style={styles.description}>{location.description}</Text>

          {mapOpen ? (
            <View style={styles.mapBlock}>
              <View style={styles.mapHeader}>
                <Text style={styles.mapTitle}>Location on map</Text>
                <Pressable onPress={() => setMapOpen(false)} style={styles.closeMapBtn}>
                  <Text style={styles.closeMapText}>✕ Close</Text>
                </Pressable>
              </View>
              <View style={styles.mapWrap}>
                <MapView
                  style={styles.map}
                  provider={IS_ANDROID ? PROVIDER_GOOGLE : undefined}
                  initialRegion={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02,
                  }}
                >
                  <Marker
                    coordinate={{ latitude: location.latitude, longitude: location.longitude }}
                    title={location.title}
                    description={location.subtitle}
                    pinColor={categoryColors[location.category]}
                  />
                </MapView>
              </View>
            </View>
          ) : null}

          <View style={styles.actions}>
            <Pressable
              style={[styles.actionBtn, styles.actionMap]}
              onPress={() => setMapOpen(v => !v)}
            >
              <Text style={styles.actionIcon}>🗺️</Text>
              <Text style={styles.actionText}>{mapOpen ? 'HIDE' : 'MAP'}</Text>
            </Pressable>
            <Pressable
              style={[styles.actionBtn, styles.actionSaved]}
              onPress={() => toggle(location.id)}
            >
              <Text style={styles.actionIcon}>{fav ? '🔖' : '📑'}</Text>
              <Text style={styles.actionText}>{fav ? 'SAVED' : 'SAVE'}</Text>
            </Pressable>
            <Pressable style={[styles.actionBtn, styles.actionShare]} onPress={onShare}>
              <Text style={styles.actionIcon}>🔗</Text>
              <Text style={[styles.actionText, { color: colors.purple }]}>SHARE</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  scroll: { paddingBottom: spacing.xxl },
  cover: { height: 280, padding: spacing.lg, justifyContent: 'space-between' },
  coverImage: { resizeMode: 'cover' },
  coverTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xxl + 20,
  },
  roundBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
  },
  roundIcon: { color: colors.text, fontSize: 16 },
  backLabel: { color: colors.text, fontSize: fontSizes.sm, marginLeft: 6, fontWeight: '600' },
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.sm,
  },
  tagText: { color: colors.text, fontSize: fontSizes.xs, fontWeight: '800', letterSpacing: 0.5 },
  body: { padding: spacing.xl },
  title: { color: colors.text, fontSize: fontSizes.xl, fontWeight: '800' },
  address: { color: colors.textMuted, fontSize: fontSizes.sm, marginTop: 4, marginBottom: spacing.lg },
  gpsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  gpsIconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  gpsIcon: { fontSize: 20 },
  gpsLabel: { color: colors.textMuted, fontSize: fontSizes.xs, fontWeight: '700', letterSpacing: 1 },
  gpsText: { color: colors.primary, fontSize: fontSizes.md, fontWeight: '700', marginTop: 2 },
  gpsDecimal: { color: colors.textDim, fontSize: fontSizes.xs, marginTop: 2 },
  sectionTitle: { color: colors.text, fontSize: fontSizes.lg, fontWeight: '700', marginBottom: spacing.sm },
  description: { color: colors.textMuted, fontSize: fontSizes.md, lineHeight: fontSizes.md * 1.55 },
  mapBlock: {
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  mapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  mapTitle: {
    color: colors.text,
    fontSize: fontSizes.md,
    fontWeight: '700',
  },
  closeMapBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.chipBg,
  },
  closeMapText: {
    color: colors.primary,
    fontSize: fontSizes.xs,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  mapWrap: {
    height: 220,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  map: { flex: 1 },
  actions: { flexDirection: 'row', marginTop: spacing.xl, justifyContent: 'space-between' },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    marginHorizontal: 4,
  },
  actionMap: { backgroundColor: colors.primary },
  actionSaved: { backgroundColor: colors.purple },
  actionShare: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  actionIcon: { fontSize: 18, marginBottom: 4 },
  actionText: { color: colors.text, fontSize: fontSizes.xs, fontWeight: '800', letterSpacing: 0.5 },
});

export default LocationDetailScreen;