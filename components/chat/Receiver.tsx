import { View, Text, Image } from 'react-native';
import React from 'react';

type ReceiverProps = {
  message: string;
  photo: string;
};

const Receiver = ({ message, photo }: ReceiverProps) => {
  return (
    <View className="flex-row items-end ">
      <Image source={{ uri: photo }} className="w-10 h-10 rounded-full" />
      <View className="bg-red-500 rounded-lg rounded-bl-none px-5 py-3 mx-3 my-2 mr-auto max-w-[70%]">
        <Text className="text-white">{message}</Text>
      </View>
    </View>
  );
};

export default Receiver;
