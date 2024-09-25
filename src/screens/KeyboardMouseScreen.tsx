import Button from '@/components/Button';
import Input from '@/components/TextInput';
import TrackpadComponent from '@/components/TrackPad';
import BleManager from 'react-native-ble-manager';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import React from 'react';
import { View, StyleSheet, Text, SafeAreaView } from 'react-native';

const KeyboardMouseScreen = ({ navigation, route }: any) => {
  const { peripheralData } = route.params;
  // console.log('PERIPHERAL DATA: ' + JSON.stringify(peripheralData, null, 2));

  const [input, onChangeInput] = React.useState('');
  const [deviceName, _setDeviceName] = React.useState('Geros Mac');

  const disconnectDevice = async () => {
    try {
      await BleManager.disconnect(peripheralData.id);
      console.log('Device disconnected:', peripheralData.id);
      navigation.navigate('MainScreen');
    } catch (error) {
      console.error('Failed to disconnect device:', error);
    }
  };

  const sendInputData = async (e: any) => {
    const data = new TextEncoder().encode(e); // Encode inputValue as a byte array
    console.log('DATA from SendInputData: ', data);
    console.log(
      peripheralData.id,
      peripheralData.services,
      peripheralData.characteristics
    );
    try {
      // await BleManager.write(
      //   peripheralData.id,
      //   peripheralData.services,
      //   peripheralData.characteristics,
      //   Array.from(data) // BLE expects data as an array of bytes
      // );

      await BleManager.write(
        peripheralData.id,
        '8667556c-9a37-4c91-84ed-54ee27d90049', // Another service UUID
        'af0badb1-5b99-43cd-917a-a77bc549e3cc', // Another characteristic UUID with Write permissions
        Array.from(data)
      );
      console.log('Data sent:', e);
    } catch (error) {
      console.error('Error sending data via BLE:', error);
    }
  };

  function inputHandler(e: any) {
    onChangeInput(e);

    // send via BLE manager over to the PC
    sendInputData(e);
  }

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
