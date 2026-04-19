import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ExploreScreen from '../screens/Explore/ExploreScreen';
import SavedScreen from '../screens/Saved/SavedScreen';
import MapScreen from '../screens/Map/MapScreen';
import BlogScreen from '../screens/Blog/BlogScreen';
import FactsScreen from '../screens/Facts/FactsScreen';
import QuizIntroScreen from '../screens/Quiz/QuizIntroScreen';
import CustomTabBar from '../components/CustomTabBar';
import { MainTabParamList } from '../types';

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabs: React.FC = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }} tabBar={props => <CustomTabBar {...props} />}>
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Saved" component={SavedScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Blog" component={BlogScreen} />
      <Tab.Screen name="Facts" component={FactsScreen} />
      <Tab.Screen name="Quiz" component={QuizIntroScreen} />
    </Tab.Navigator>
  );
};

export default MainTabs;