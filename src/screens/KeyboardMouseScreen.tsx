import Button from '@/components/Button';
import Input from '@/components/TextInput';
import TrackpadComponent from '@/components/TrackPad';
import BleManager from 'react-native-ble-manager';

import React from 'react';
import {
  KeyboardAvoidingView,
  View,
  Platform,
  StyleSheet,
  Text,
  SafeAreaView,
} from 'react-native';

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

  return (
    <KeyboardAvoidingView
      contentContainerStyle={styles.screen}
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      enabled
      keyboardVerticalOffset={Platform.OS === 'ios' ? 500 : 100}>
      <SafeAreaView>
        <View>
          <Button disconnect onPress={disconnectDevice}>
            Disconnect
          </Button>
          <Text className='text-lg font-semibold text-center'>
            Connected to: {deviceName}
          </Text>
        </View>
        <View>
          <Input onChangeText={onChangeInput} value={input} />
          <TrackpadComponent />
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default KeyboardMouseScreen;
const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
