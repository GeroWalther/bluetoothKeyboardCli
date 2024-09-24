import React, { useEffect, useState } from 'react';
import {
  TextInput,
  Pressable,
  Text,
  Keyboard,
  View,
  TextInputProps,
} from 'react-native';

const Input = (
  props: React.JSX.IntrinsicAttributes &
    React.JSX.IntrinsicClassAttributes<TextInput> &
    Readonly<TextInputProps>
) => {
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setIsKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsKeyboardVisible(false);
      }
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  return (
    <View className='flex-row my-2'>
      <TextInput
        className='h-14 border border-gray-400 px-3 bg-white text-xl py-2 flex-1'
        placeholder='Type here...'
        multiline
        autoCapitalize='none'
        {...props}
      />
      {isKeyboardVisible && (
        <Pressable
          onPress={dismissKeyboard}
          className='h-14 p-2 rounded-lg bg-orange-400 justify-center items-center'>
          <Text className='text-sm text-center'>Dismiss{'\n'}Keyboard</Text>
        </Pressable>
      )}
    </View>
  );
};

export default Input;
