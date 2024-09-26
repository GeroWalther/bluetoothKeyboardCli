import React, { useEffect } from 'react';
import BleManager from 'react-native-ble-manager';
import { View, StyleSheet, Text, SafeAreaView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { Buffer } from 'buffer';

import Button from '@/components/Button';
import Input from '@/components/TextInput';
import TrackpadComponent from '@/components/TrackPad';

const KeyboardMouseScreen = ({ navigation, route }: any) => {
  const { peripheralData } = route.params;
  // console.log('PERIPHERAL DATA: ' + JSON.stringify(peripheralData, null, 2));

  const [input, onChangeInput] = React.useState('');
  const [deviceName, setDeviceName] = React.useState('Geros Mac');
  const [sps, setSps] = React.useState([]);

  useEffect(() => {
    console.log(peripheralData.characteristics)
    const pds = peripheralData.characteristics.filter((ch: any) => ch.properties.hasOwnProperty('Write')).map((ch: any) => ({ sid: ch.service, cid: ch.characteristic }))
    // const pds = peripheralData.characteristics.map((ch: any) => ({ sid: ch.service, cid: ch.characteristic }))

    setDeviceName(peripheralData.name)
    setSps(pds)
  }, [])

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
    try {
      const buffer = Buffer.from(e);

      await BleManager
        .startNotification(peripheralData.id, sps[0]?.sid, sps[0]?.cid)
        .then(async (response) => {
          await BleManager.write(
            peripheralData.id,
            sps[0].sid,
            sps[0].cid,
            buffer.toJSON().data,
            1024
          );
          console.log('Data sent:', e);
        })
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
