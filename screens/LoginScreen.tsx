import {
  View,
  Text,
  ActivityIndicator,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import useAuth from '../hooks/useAuth';

const LoginScreen = () => {
  const { signIn, isLoadingUser, isSigning } = useAuth();

  return (
    <View className="flex-1 justify-center items-center">
      <StatusBar />

      <ImageBackground
        source={{ uri: 'https://tinder.com/static/tinder.png' }}
        className="w-full h-full"
      >
        <View className="absolute bottom-20 flex-row justify-center w-full">
          {isLoadingUser || isSigning ? (
            <ActivityIndicator size={'large'} color={'#fff'} />
          ) : (
            <TouchableOpacity
              className="bg-white p-4 rounded-md"
              onPress={() => signIn()}
            >
              <Text className="text-lg font-bold">Sign in & Get swiping</Text>
            </TouchableOpacity>
          )}
        </View>
      </ImageBackground>
    </View>
  );
};

export default LoginScreen;
