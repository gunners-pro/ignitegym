import {
  BottomTabNavigationProp,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import { gluestackUIConfig } from '../../config/gluestack-ui.config';

import HomeSvg from '@assets/home.svg';
import HistorySvg from '@assets/history.svg';
import ProfileSvg from '@assets/profile.svg';

import { Exercise } from '@screens/Exercise';
import { History } from '@screens/History';
import { Home } from '@screens/Home';
import { Profile } from '@screens/Profile';
import { Platform } from 'react-native';

type AppRoutes = {
  home: undefined;
  exercise: undefined;
  profile: undefined;
  history: undefined;
};

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRoutes>;

const { Navigator, Screen } = createBottomTabNavigator<AppRoutes>();

export function AppRoutes() {
  const { tokens } = gluestackUIConfig;
  const iconSize = tokens.space['6'];

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: tokens.colors.green500,
        tabBarInactiveTintColor: tokens.colors.gray200,
        tabBarStyle: {
          backgroundColor: tokens.colors.gray600,
          borderTopWidth: 0,
          height: Platform.OS === 'android' ? 'auto' : 96,
          paddingBottom: tokens.space['10'],
          paddingTop: tokens.space['6'],
        },
      }}
    >
      <Screen
        name="home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => HomeIcon({ color, iconSize }),
        }}
      />

      <Screen
        name="history"
        component={History}
        options={{
          tabBarIcon: ({ color }) => HistoryIcon({ color, iconSize }),
        }}
      />
      <Screen
        name="profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color }) => ProfileIcon({ color, iconSize }),
        }}
      />
      <Screen
        name="exercise"
        component={Exercise}
        options={{ tabBarButton: () => null }}
      />
    </Navigator>
  );
}

const HomeIcon = ({ color, iconSize }: { color: string; iconSize: number }) => (
  <HomeSvg fill={color} width={iconSize} height={iconSize} />
);

const HistoryIcon = ({
  color,
  iconSize,
}: {
  color: string;
  iconSize: number;
}) => <HistorySvg fill={color} width={iconSize} height={iconSize} />;

const ProfileIcon = ({
  color,
  iconSize,
}: {
  color: string;
  iconSize: number;
}) => <ProfileSvg fill={color} width={iconSize} height={iconSize} />;
