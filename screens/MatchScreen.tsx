import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { RootStackScreenProps } from '../types/navigation/type';

type MatchScreenProps = {
  navigation: RootStackScreenProps<'Match'>['navigation'];
  route: RootStackScreenProps<'Match'>['route'];
};

const MatchScreen = ({ navigation, route }: MatchScreenProps) => {
  const { me, you } = route.params;

  return (
    <View className="flex-1 bg-red-500/95 justify-center px-5">
      <Image
        source={{ uri: 'https://links.papareact.com/mg9' }}
        className="w-full h-20"
      />
      <Text className="text-white text-center text-base font-semibold mt-5">
        You and {you.name} have linked to each other
      </Text>

      <View className="flex-row items-center justify-evenly mt-5">
        <Image source={{ uri: me.photo }} className="w-32 h-32 rounded-full" />

        <Image source={{ uri: you.photo }} className="w-32 h-32 rounded-full" />
      </View>

      <TouchableOpacity
        className="bg-white p-5 mt-16 rounded-full"
        onPress={() => navigation.replace('Chat')}
      >
        <Text className="text-center font-bold text-lg">Send a message</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MatchScreen;
