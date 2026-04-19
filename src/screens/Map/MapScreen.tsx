import React, { useRef, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import ScreenWrapper from '../../components/ScreenWrapper';
import { locationsData } from '../../data/locations';
import {
  categoryColors,
  colors,
  fontSizes,
  IS_ANDROID,
  IS_SMALL_SCREEN,
  radius,
  SCREEN_WIDTH,
  spacing,
} from '../../theme/theme';
import { Location, RootStackParamList } from '../../types';

const MapScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const mapRef = useRef<MapView>(null);
  const [selected, setSelected] = useState<Location | null>(null);
  const [zoom, setZoom] = useState({ latitudeDelta: 0.08, longitudeDelta: 0.08 });

  const zoomBy = (factor: number) => {
    const next = {
      latitudeDelta: zoom.latitudeDelta * factor,
      longitudeDelta: zoom.longitudeDelta * factor,
    };
    setZoom(next);
    mapRef.current?.animateToRegion({ latitude: 39.9956, longitude: -105.2797, ...next }, 250);
  };

  const handleMarkerPress = (loc: Location) => {
    setSelected(loc);
    mapRef.current?.animateToRegion(
      {
        latitude: loc.latitude,
        longitude: loc.longitude,
        latitudeDelta: zoom.latitudeDelta,
        longitudeDelta: zoom.longitudeDelta,
      },
      300,
    );
  };

  const openDetails = () => {
    if (!selected) return;
    navigation.navigate('LocationDetail', { locationId: selected.id });
  };

  return (
    <ScreenWrapper variant="main" withTabBarSpace>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.kicker}>INTERACTIVE</Text>
          <Text style={styles.title}>Map</Text>
        </View>
        <View style={styles.spots}>
          <Text style={styles.spotsText}>{locationsData.length} spots</Text>
        </View>
      </View>

      <View style={styles.legend}>
        {Object.entries(categoryColors).map(([k, v]) => (
          <View key={k} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: v }]} />
            <Text style={styles.legendText}>{k.charAt(0).toUpperCase() + k.slice(1)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.mapWrap}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={IS_ANDROID ? PROVIDER_GOOGLE : undefined}
          initialRegion={{
            latitude: 39.9956,
            longitude: -105.2797,
            latitudeDelta: 0.08,
            longitudeDelta: 0.08,
          }}
        >
          {locationsData.map((loc: Location) => (
            <Marker
              key={loc.id}
              identifier={loc.id}
              coordinate={{ latitude: loc.latitude, longitude: loc.longitude }}
              pinColor={categoryColors[loc.category]}
              onPress={e => {
                e.stopPropagation();
                handleMarkerPress(loc);
              }}
              tracksViewChanges={false}
            />
          ))}
        </MapView>

        <View pointerEvents="box-none" style={styles.overlay}>
          <View style={styles.zoomBtns}>
            <Pressable style={styles.zoomBtn} onPress={() => zoomBy(0.5)}>
              <Text style={styles.zoomIcon}>+</Text>
            </Pressable>
            <Pressable style={styles.zoomBtn} onPress={() => zoomBy(2)}>
              <Text style={styles.zoomIcon}>−</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {selected ? (
        <Pressable
          style={styles.backdrop}
          onPress={() => setSelected(null)}
        >
          <Pressable style={styles.popup} onPress={() => {}}>
            <Pressable style={styles.closeBtn} onPress={() => setSelected(null)} hitSlop={8}>
              <Text style={styles.closeText}>✕</Text>
            </Pressable>

            <Image source={selected.image} style={styles.popupImage} resizeMode="cover" />

            <View style={styles.popupBody}>
              <View style={styles.popupTag}>
                <Text style={styles.popupTagText}>{selected.category.toUpperCase()}</Text>
              </View>
              <Text style={styles.popupTitle} numberOfLines={2}>{selected.title}</Text>
              <Text style={styles.popupSub} numberOfLines={2}>{selected.subtitle}</Text>
              <Text style={styles.popupCoords} numberOfLines={1}>{selected.gpsText}</Text>

              <Pressable onPress={openDetails} style={styles.detailsBtn}>
                <LinearGradient
                  colors={[colors.gradientStart, colors.gradientEnd]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.detailsBtnGradient}
                >
                  <Text style={styles.detailsBtnText}>VIEW DETAILS</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      ) : null}
    </ScreenWrapper>
  );
};

const POPUP_WIDTH = Math.min(SCREEN_WIDTH - 32, 360);
const POPUP_IMAGE_HEIGHT = IS_SMALL_SCREEN ? 110 : 140;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  kicker: { color: colors.primary, fontSize: fontSizes.xs, fontWeight: '800', letterSpacing: 1.2 },
  title: { color: colors.text, fontSize: fontSizes.xxl, fontWeight: '800', marginTop: 2 },
  spots: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.chipBg,
  },
  spotsText: { color: colors.primary, fontSize: fontSizes.sm, fontWeight: '700' },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.sm,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginRight: spacing.md, marginBottom: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  legendText: { color: colors.textMuted, fontSize: fontSizes.xs, fontWeight: '600' },
  mapWrap: { flex: 1, margin: spacing.md, borderRadius: radius.lg, overflow: 'hidden' },
  map: { ...StyleSheet.absoluteFillObject },
  overlay: { ...StyleSheet.absoluteFillObject },
  zoomBtns: { position: 'absolute', top: 12, right: 12 },
  zoomBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.tabBarBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  zoomIcon: { color: colors.text, fontSize: 18, fontWeight: '700' },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    zIndex: 100,
  },
  popup: {
    width: POPUP_WIDTH,
    maxHeight: '90%',
    backgroundColor: colors.tabBarBg,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 14,
  },
  closeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 2,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: { color: colors.text, fontSize: 14, fontWeight: '700' },
  popupImage: {
    width: '100%',
    height: POPUP_IMAGE_HEIGHT,
  },
  popupBody: {
    padding: IS_SMALL_SCREEN ? spacing.md : spacing.lg,
  },
  popupTag: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.sm,
    marginBottom: 8,
  },
  popupTagText: { color: colors.text, fontSize: fontSizes.xs, fontWeight: '800' },
  popupTitle: { color: colors.text, fontSize: fontSizes.lg, fontWeight: '800' },
  popupSub: { color: colors.textMuted, fontSize: fontSizes.sm, marginTop: 4 },
  popupCoords: { color: colors.textDim, fontSize: fontSizes.xs, marginTop: 6 },
  detailsBtn: {
    marginTop: IS_SMALL_SCREEN ? spacing.md : spacing.lg,
    borderRadius: 32,
    overflow: 'hidden',
    height: IS_SMALL_SCREEN ? 44 : 50,
  },
  detailsBtnGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 32,
  },
  detailsBtnText: {
    color: colors.text,
    fontSize: fontSizes.sm,
    fontWeight: '800',
    letterSpacing: 0.5,
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
});

export default MapScreen;