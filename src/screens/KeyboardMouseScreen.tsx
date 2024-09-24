import Button from '@/components/Button';
import Input from '@/components/TextInput';
import TrackpadComponent from '@/components/TrackPad';
import React from 'react';
import {
  KeyboardAvoidingView,
  View,
  Platform,
  StyleSheet,
  Text,
} from 'react-native';

const KeyboardMouseScreen = ({ navigation }: any) => {
  const [input, onChangeInput] = React.useState('');
  const [deviceName, _setDeviceName] = React.useState('Geros Mac');
  return (
    <KeyboardAvoidingView
      contentContainerStyle={styles.screen}
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      enabled
      keyboardVerticalOffset={Platform.OS === 'ios' ? 500 : 100}>
      <View>
        <View>
          <Button
            disconnect
            onPress={() => {
              // TODO: Disconnect the Bluetooth connection and navigate back to the main screen.
              navigation.navigate('Main');
            }}>
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
      </View>
    </KeyboardAvoidingView>
  );
};

export default KeyboardMouseScreen;
const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
