import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState, useEffect } from 'react';

import Swiper from 'react-native-deck-swiper';
import { AntDesign, Entypo, Ionicons } from '@expo/vector-icons';

import useAuth from '../hooks/useAuth';
import SafeView from '../components/safeAreas/SafeView';
import { RootStackScreenProps } from '../types/navigation/type';
import { people } from '../client-data';
import type { SwiperCard } from '../types';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';

type HomeScreenProps = {
  navigation: RootStackScreenProps<'Home'>['navigation'];
};

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const { signOut, user: userInfo } = useAuth();
  const user = userInfo!.user;

  const [profiles, setProfiles] = useState<SwiperCard[]>([]);
  const [cardIndex, setCardIndex] = useState(-1);

  const swiperRef = useRef<Swiper<SwiperCard>>(null);

  useEffect(() => {
    onSnapshot(doc(db, 'user', user.id), (data) => {
      if (!data.exists()) navigation.replace('Modal');
    });
  }, []);

  useEffect(() => {
    onSnapshot(collection(db, 'user'), (data) => {
      const users = data.docs.map((doc) => {
        const copy = { ...doc.data() };
        delete copy.timestamp;
        copy.id = doc.id;

        return copy as SwiperCard;
      });

      setProfiles(users);
    });
  }, []);

  return (
    <SafeView top>
      <StatusBar />

      <View className="flex-row justify-between items-center px-5 pt-2">
        <TouchableOpacity onPress={signOut}>
          <Image
            source={{ uri: user.photo! }}
            className="h-10 w-10 rounded-full"
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Modal')}>
          <Image
            source={require('../assets/images/logo.png')}
            className="w-12 h-14"
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Chat')}>
          <Ionicons name="chatbubbles-sharp" size={40} color={'#ff5864'} />
        </TouchableOpacity>
      </View>

      <View className="flex-1 -mt-6">
        {cardIndex < profiles.length - 1 ? (
          <Swiper
            ref={swiperRef}
            cards={profiles}
            cardIndex={0}
            stackSize={5}
            verticalSwipe={false}
            animateCardOpacity
            backgroundColor="#ccc0"
            keyExtractor={(card) => card.id.toString()}
            onSwiped={(index) => setCardIndex(index)}
            onSwipedLeft={(index) => {
              console.log(index);
            }}
            onSwipedRight={(index) => {
              console.log(index);
            }}
            overlayLabels={{
              left: {
                title: 'NOPE',
                style: {
                  label: {
                    textAlign: 'right',
                    color: 'red',
                    padding: 10,
                    paddingTop: -10,
                  },
                },
              },
              right: {
                title: 'OK',
                style: {
                  label: {
                    textAlign: 'left',
                    color: 'green',
                    padding: 10,
                    paddingTop: -10,
                  },
                },
              },
            }}
            renderCard={(card) => (
              <View className="bg-white h-3/4 rounded-xl">
                <Image
                  source={{
                    uri: card.photo,
                  }}
                  className="absolute w-full h-full rounded-xl"
                />

                <View
                  style={styles.cardShadow}
                  className="absolute bottom-0 bg-white flex-row justify-between items-center w-full p-4 rounded-b-lg"
                >
                  <View>
                    <Text className="text-xl font-bold">
                      {card.name
                        ? card.name
                        : card.firstName + '' + card.lastName}
                    </Text>

                    <Text>{card.job}</Text>
                  </View>

                  <View className="items-center">
                    <Text className="text-gray-500">Age</Text>

                    <Text className="text-xl font-bold">{card.age}</Text>
                  </View>
                </View>
              </View>
            )}
          />
        ) : (
          <View className="h-3/4 mt-6 items-center justify-center px-5 ">
            <View
              className="bg-white flex-1 mt-10 items-center justify-center w-full rounded-xl"
              style={styles.cardShadow}
            >
              <Text className="text-lg font-bold">
                There is no more profile!
              </Text>
            </View>
          </View>
        )}
      </View>

      {cardIndex < profiles.length - 1 && (
        <View className="flex-row items-center justify-evenly p-4">
          <TouchableOpacity
            onPress={() => {
              if (!swiperRef?.current) return;
              if (cardIndex >= profiles.length - 1) return;
              swiperRef.current.swipeLeft();
            }}
            className="bg-red-300 p-4 rounded-full"
          >
            <Entypo name="cross" size={24} color={'green'} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              if (!swiperRef?.current) return;
              if (cardIndex >= profiles.length - 1) return;
              swiperRef.current.swipeRight();
            }}
            className="bg-green-300 p-4 rounded-full"
          >
            <AntDesign name="heart" size={24} color={'#ff5864'} />
          </TouchableOpacity>
        </View>
      )}
    </SafeView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 5,
  },
});
