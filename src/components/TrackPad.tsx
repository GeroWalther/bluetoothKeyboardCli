import React from 'react';
import {View, TouchableOpacity, Text} from 'react-native';

const TrackpadComponent = () => {
  return (
    <View className="items-center">
      <TouchableOpacity
        className="w-[95%] h-[70%] bg-gray-300 justify-center items-center rounded-lg mb-2"
        onPress={() => console.log('Trackpad pressed')}>
        <Text className="text-gray-800 text-lg">Trackpad</Text>
      </TouchableOpacity>
      <View className="flex-row justify-between mt-2">
        <TouchableOpacity
          className="w-[65%] h-20 bg-slate-500 justify-center items-center rounded-lg mr-2"
          onPress={() => console.log('Left Click')}>
          <Text className="text-white text-lg">Left Click</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="w-[28%] h-20 bg-slate-600 justify-center items-center rounded-lg"
          onPress={() => console.log('Right Click')}>
          <Text className="text-white text-lg">Right Click</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TrackpadComponent;
