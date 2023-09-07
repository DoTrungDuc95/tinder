import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import Radio from '../components/Radio';
import { RootStackScreenProps } from '../types/navigation/type';
import { StatusBar } from 'expo-status-bar';

type InfoType = {
  img: string;
  job: string;
  age: string;
  gender: 'male' | 'female';
};

type ModalScreenProps = {
  navigation: RootStackScreenProps<'Modal'>['navigation'];
};

const ModalScreen = ({ navigation }: ModalScreenProps) => {
  const { user } = useAuth();
  const inset = useSafeAreaInsets();

  const [info, setInfo] = useState<InfoType>({
    img: '',
    job: '',
    age: '',
    gender: 'male',
  });

  const setState = (name: string, value: any) => {
    setInfo((p) => {
      return { ...p, [name]: value };
    });
  };

  const setGender = (value: 'male' | 'felmale') => setState('gender', value);

  const updateProfile = () => {
    const { age, img, job, gender } = info;

    if (!age || !img || !job) return;

    setDoc(doc(db, 'user', user?.user.id!), {
      id: user?.user.id,
      name: user?.user.name,
      photo: img !== 'none' ? img : user?.user.photo,
      job,
      age,
      gender,
      timestamp: serverTimestamp(),
    })
      .then(() => navigation.navigate('Home'))
      .catch((err) => console.log(err));
  };

  return (
    <ScrollView
      style={{ marginTop: inset.top }}
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar />

      <View className="flex-1 pb-8 items-center justify-between gap-10">
        <View>
          <View>
            <Image
              source={require('../assets/images/Tinder-logo.png')}
              className="h-20 w-full"
              resizeMode="contain"
            />
          </View>

          <Text className="text-xl text-center font-bold text-gray-500">
            Welcome {user?.user.name}
          </Text>

          <View className="gap-2 mt-4 items-center">
            <Text className="font-bold text-red-400">
              Step 1: The Profile Picture
            </Text>

            <TextInput
              value={info?.img}
              onChangeText={(value) => setState('img', value)}
              className="text-lg text-center"
              placeholder="Enter your profile picture url"
            />
          </View>

          <View className="gap-2 mt-4 items-center">
            <Text className="font-bold text-red-400">Step 2: The Job</Text>

            <TextInput
              value={info?.job}
              onChangeText={(value) => setState('job', value)}
              className="text-lg text-center"
              placeholder="Enter your occupation"
            />
          </View>

          <View className="gap-2 mt-4 items-center">
            <Text className="font-bold text-red-400">Step 3: The Age</Text>

            <TextInput
              keyboardType="numeric"
              value={info?.age}
              onChangeText={(value) => setState('age', value)}
              className="text-lg text-center"
              placeholder="Enter your age"
              maxLength={2}
            />
          </View>

          <View className="gap-2 mt-4 space-y-4">
            <Text className="font-bold text-center text-red-400">
              Step 4: The Gender
            </Text>

            <View className="flex-row items-center justify-center">
              <Radio
                label="male"
                value="male"
                checked={info.gender === 'male'}
                textSize="lg"
                onPress={setGender}
                mr={20}
              />

              <Radio
                label="female"
                value="female"
                checked={info.gender === 'female'}
                textSize="lg"
                onPress={setGender}
              />
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={updateProfile}
          className="p-4 px-20 bg-red-400 rounded-lg"
        >
          <Text className="text-white text-lg font-bold">Update profile</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ModalScreen;
