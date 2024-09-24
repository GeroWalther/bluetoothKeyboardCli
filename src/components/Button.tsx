import { Pressable, Text } from 'react-native';
import React from 'react';

const Button = ({ onPress, children, disconnect = false }: any) => {
  return (
    <Pressable
      className={`rounded-lg bg-blue-900 py-6 px-4 mx-10 mt-10 ${
        disconnect ? 'bg-red-500 py-1 px-2 mt-2' : ''
      }`}
      onPress={onPress}>
      <Text className='text-white text-xl font-semibold'>{children}</Text>
    </Pressable>
  );
};

export default Button;
