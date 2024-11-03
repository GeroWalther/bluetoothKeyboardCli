/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
//import type {PropsWithChildren} from 'react';
import {
  NativeModules,
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  // StyleSheet,
  // Text,
  useColorScheme,
  View,
  Text,
} from 'react-native';

import {
  Colors,
  // DebugInstructions,
  Header,
  // LearnMoreLinks,
  // ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

// type SectionProps = PropsWithChildren<{
//   title: string;
// }>;

const { BLEHIDManager } = NativeModules;

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'light';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const onPress = (key: String) => {
    BLEHIDManager.sendKeys(key);
  };

  const moveMouse = (direction: String) => {
    BLEHIDManager.moveMouse(direction);
  };

  const mouseClick = (button: String) => {
    BLEHIDManager.mouseClick(button);
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior='automatic'
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Button title='A' color='#841584' onPress={() => onPress('A')} />

          <Button title='B' color='#841584' onPress={() => onPress('B')} />

          <Button
            title='Move Mouse right'
            color='#841584'
            onPress={() => moveMouse('right')}
          />

          <Button
            title='Move Mouse left'
            color='#841584'
            onPress={() => moveMouse('left')}
          />

          <Button
            title='Move Mouse Up'
            color='#841584'
            onPress={() => moveMouse('up')}
          />

          <Button
            title='Move Mouse down'
            color='#841584'
            onPress={() => moveMouse('down')}
          />

          <Button
            title='RightClick'
            color='#841584'
            onPress={() => mouseClick('right')}
          />

          <Button
            title='LeftClick'
            color='#841584'
            onPress={() => mouseClick('left')}
          />
        </View>
        <Text>Test</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// const styles = StyleSheet.create({
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//   },
//   highlight: {
//     fontWeight: '700',
//   },
// });

export default App;
