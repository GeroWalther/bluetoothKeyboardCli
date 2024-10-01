import React, { useEffect, useState } from 'react';
import BleManager from 'react-native-ble-manager';
import { View, StyleSheet, Text, SafeAreaView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Buffer } from 'buffer';

import Button from '@/components/Button';
import Input from '@/components/TextInput';
import TrackpadComponent from '@/components/TrackPad';

const KeyboardMouseScreen = ({ navigation, route }: any) => {
  const { peripheralData } = route.params;

  const [input, onChangeInput] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [writableCharacteristics, setWritableCharacteristics] = useState([]);

  useEffect(() => {
    console.log('Available Characteristics:', peripheralData.characteristics);

    // Filter characteristics with Write property
    const writableChars = peripheralData.characteristics
      .filter((ch: any) => ch.properties.Write)
      .map((ch: any) => {
        console.log('Writable Characteristic found:', ch);
        return { sid: ch.service, cid: ch.characteristic };
      });

    if (writableChars.length === 0) {
      console.error('No writable characteristics found.');
    } else {
      setWritableCharacteristics(writableChars);
      console.log('Writable characteristics found:', writableChars);
    }

    setDeviceName(peripheralData.name || 'Unknown Device');
  }, [peripheralData]);

  const disconnectDevice = async () => {
    try {
      await BleManager.disconnect(peripheralData.id);
      console.log('Device disconnected:', peripheralData.id);
      navigation.navigate('MainScreen');
    } catch (error) {
      console.error('Failed to disconnect device:', error);
    }
  };

  const sendInputData = async (keyCode: number) => {
    try {
      if (!writableCharacteristics.length) {
        console.error('No writable characteristics available.');
        return;
      }

      // Choose first writable characteristic for experimentation
      const { sid, cid } = writableCharacteristics[1];

      const report = Buffer.alloc(8);
      report[0] = 0; // Modifier byte (no modifiers)
      report[1] = keyCode; // Key code
      report.fill(0, 2); // Fill the rest with zeros

      await BleManager.writeWithoutResponse(
        peripheralData.id,
        sid, // Use the selected writable service
        cid, // Use the selected writable characteristic
        report.toJSON().data,
        1024
      );
      console.log('Data sent using characteristic:', cid);
    } catch (error) {
      console.error('Error sending data via BLE:', error);
    }
  };

  const inputHandler = (text: string) => {
    onChangeInput(text);
    const keyCode = getKeyCode(text);
    if (keyCode) {
      sendInputData(keyCode);
    }
  };

  const getKeyCode = (input: string) => {
    const keyCodes: { [key: string]: number } = {
      a: 4,
      b: 5,
      c: 6,
      d: 7,
      e: 8,
      f: 9,
      g: 10,
      h: 11,
      i: 12,
      j: 13,
      k: 14,
      l: 15,
      m: 16,
      n: 17,
      o: 18,
      p: 19,
      q: 20,
      r: 21,
      s: 22,
      t: 23,
      u: 24,
      v: 25,
      w: 26,
      x: 27,
      y: 28,
      z: 29,
      Enter: 40,
      Space: 44,
      Backspace: 42,
    };
    return keyCodes[input] || null;
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.screen}>
      <SafeAreaView style={styles.screen}>
        <View>
          <Button disconnect onPress={disconnectDevice}>
            Disconnect
          </Button>
          <Text className='text-lg font-semibold text-center'>
            Connected to: {deviceName}
          </Text>
        </View>
        <View>
          <Input onChangeText={inputHandler} value={input} />
          <TrackpadComponent />
        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};

export default KeyboardMouseScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
