import { View, Text } from 'react-native';
import React from 'react';

type SenderProps = {
  message: string;
};

const Sender = ({ message }: SenderProps) => {
  return (
    <View className="bg-purple-600 rounded-lg rounded-tr-none px-5 py-3 mx-3 my-2 ml-auto max-w-[70%]">
      <Text className="text-white">{message}</Text>
    </View>
  );
};

export default Sender;
