import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import ScreenWrapper from '../../components/ScreenWrapper';
import LocationCard from '../../components/LocationCard';
import { locationsData } from '../../data/locations';
import { useFavorites } from '../../storage/FavoritesContext';
import { Location, RootStackParamList } from '../../types';
import { colors, fontSizes, radius, spacing } from '../../theme/theme';

const SavedScreen: React.FC = () => {
  const { favorites } = useFavorites();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const items = locationsData.filter((l: Location) => favorites.includes(l.id));

  return (
    <ScreenWrapper variant="main" withTabBarSpace>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.kicker}>YOUR COLLECTION</Text>
          <Text style={styles.title}>Saved</Text>
        </View>
        <View style={styles.counter}>
          <Text style={styles.counterText}>{items.length}</Text>
        </View>
      </View>

      {items.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🗺️</Text>
          <Text style={styles.emptyTitle}>No Saved Places Yet</Text>
          <Text style={styles.emptyText}>
            Explore locations and tap the bookmark icon to save your favorites here.
          </Text>
          <Pressable
            onPress={() => navigation.navigate('Main', { screen: 'Explore' })}
            style={styles.button}
          >
            <LinearGradient
              colors={[colors.gradientStart, colors.gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Explore Locations</Text>
            </LinearGradient>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={i => i.id}
          renderItem={({ item }) => (
            <LocationCard
              location={item}
              layout="row"
              onPress={() => navigation.navigate('LocationDetail', { locationId: item.id })}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  kicker: { color: colors.primary, fontSize: fontSizes.xs, fontWeight: '800', letterSpacing: 1.2 },
  title: { color: colors.text, fontSize: fontSizes.xxl, fontWeight: '800', marginTop: 2 },
  counter: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterText: { color: colors.primary, fontSize: fontSizes.sm, fontWeight: '800' },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyEmoji: { fontSize: 72, marginBottom: spacing.lg },
  emptyTitle: {
    color: colors.text,
    fontSize: fontSizes.lg,
    fontWeight: '800',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: fontSizes.md,
    textAlign: 'center',
    lineHeight: fontSizes.md * 1.4,
    marginBottom: spacing.xl,
  },
  button: {
    alignSelf: 'stretch',
    borderRadius: 32,
    overflow: 'hidden',
    height: 56,
  },
  buttonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 32,
  },
  buttonText: {
    color: colors.text,
    fontSize: fontSizes.md,
    fontWeight: '700',
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  list: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl },
});

export default SavedScreen;