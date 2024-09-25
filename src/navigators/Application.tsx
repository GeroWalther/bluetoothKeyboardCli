import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useTheme } from '@/theme';

import type { RootStackParamList } from '@/types/navigation';
import KeyboardMouseScreen from '@/screens/KeyboardMouseScreen';
import MainScreen from '@/screens/MainScreen';

const Stack = createStackNavigator<RootStackParamList>();

function ApplicationNavigator() {
  const { variant, navigationTheme } = useTheme();

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navigationTheme}>
        <Stack.Navigator
          initialRouteName='MainScreen'
          key={variant}
          screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name='KeyboardMouseScreen'
            component={KeyboardMouseScreen}
          />
          <Stack.Screen name='MainScreen' component={MainScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default ApplicationNavigator;
