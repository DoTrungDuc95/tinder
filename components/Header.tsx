import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { Ionicons, Foundation } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

type HeaderProps = {
  title: string;
  callEnable?: boolean;
};

const Header = ({ title, callEnable }: HeaderProps) => {
  const navigation = useNavigation();

  return (
    <View className="flex-row items-center p-2 pr-4">
      <View className="flex-row items-center space-x-2">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
          <Ionicons name="chevron-back" size={34} color={'#ff5864'} />
        </TouchableOpacity>

        <Text className="flex-1 text-2xl font-bold pr-8" numberOfLines={1}>
          {title}
        </Text>

        {callEnable && (
          <TouchableOpacity className="h-10 w-10 bg-red-200 rounded-full justify-center items-center">
            <Foundation name="telephone" size={30} color={'#ff0000'} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Header;
