import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Example, Example01, Example02, Startup } from '@/screens';
import { useTheme } from '@/theme';

import type { RootStackParamList } from '@/types/navigation';
import KeyboardMouseScreen from '@/screens/KeyboardMouseScreen';

const Stack = createStackNavigator<RootStackParamList>();

function ApplicationNavigator() {
  const { variant, navigationTheme } = useTheme();

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navigationTheme}>
        <Stack.Navigator
          initialRouteName='Example02'
          key={variant}
          screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name='KeyboardMouseScreen'
            component={KeyboardMouseScreen}
          />
          {/* <Stack.Screen name='Startup' component={Startup} />
          <Stack.Screen name='Example' component={Example} />
          <Stack.Screen name='Example01' component={Example01} /> */}
          <Stack.Screen name='Example02' component={Example02} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default ApplicationNavigator;
