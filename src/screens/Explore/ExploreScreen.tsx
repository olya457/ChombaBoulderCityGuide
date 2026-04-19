import React, { useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ScreenWrapper from '../../components/ScreenWrapper';
import CategoryChip from '../../components/CategoryChip';
import LocationCard from '../../components/LocationCard';
import { categories } from '../../data/categories';
import { locationsData } from '../../data/locations';
import { CategoryId, Location, RootStackParamList } from '../../types';
import { colors, fontSizes, radius, spacing } from '../../theme/theme';

const ExploreScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [activeCat, setActiveCat] = useState<CategoryId | 'all'>('all');
  const [query, setQuery] = useState('');

  const filtered = useMemo<Location[]>(() => {
    return locationsData.filter((l: Location) => {
      const byCat = activeCat === 'all' || l.category === activeCat;
      const byQuery = !query.trim() || l.title.toLowerCase().includes(query.toLowerCase());
      return byCat && byQuery;
    });
  }, [activeCat, query]);

  const renderItem = ({ item }: { item: Location }) => (
    <LocationCard
      location={item}
      onPress={() => navigation.navigate('LocationDetail', { locationId: item.id })}
    />
  );

  return (
    <ScreenWrapper variant="main" withTabBarSpace>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.kicker}>BOULDER, COLORADO</Text>
          <Text style={styles.title}>Explore</Text>
        </View>
        <View style={styles.compassBtn}>
          <Text style={styles.compassIcon}>🧭</Text>
        </View>
      </View>

      <View style={styles.searchWrap}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search locations..."
          placeholderTextColor={colors.textDim}
          style={styles.searchInput}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {categories.map(c => (
          <CategoryChip key={c.id} category={c} active={activeCat === c.id} onPress={() => setActiveCat(c.id)} />
        ))}
      </ScrollView>

      <Text style={styles.count}>
        <Text style={styles.countNum}>{filtered.length}</Text> locations found
      </Text>

      <FlatList
        data={filtered}
        keyExtractor={i => i.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    marginBottom: spacing.md,
  },
  kicker: { color: colors.primary, fontSize: fontSizes.xs, fontWeight: '800', letterSpacing: 1.2 },
  title: { color: colors.text, fontSize: fontSizes.xxl, fontWeight: '800', marginTop: 2 },
  compassBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compassIcon: { fontSize: 18 },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  searchIcon: { fontSize: 14, marginRight: spacing.sm },
  searchInput: { flex: 1, color: colors.text, fontSize: fontSizes.md, paddingVertical: 10 },
  chips: { paddingHorizontal: spacing.xl, paddingBottom: spacing.sm },
  count: { color: colors.textMuted, fontSize: fontSizes.sm, paddingHorizontal: spacing.xl, marginBottom: spacing.sm },
  countNum: { color: colors.primary, fontWeight: '800' },
  list: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl },
});

export default ExploreScreen;