import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState, useEffect } from 'react';

import Swiper from 'react-native-deck-swiper';
import { AntDesign, Entypo, Ionicons } from '@expo/vector-icons';

import useAuth from '../hooks/useAuth';
import SafeView from '../components/safeAreas/SafeView';
import { RootStackScreenProps } from '../types/navigation/type';
import type { SwiperCard } from '../types';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { generateId } from '../lib';

type HomeScreenProps = {
  navigation: RootStackScreenProps<'Home'>['navigation'];
};

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const { signOut, user: userInfo } = useAuth();
  const user = userInfo!.user;

  const [profiles, setProfiles] = useState<SwiperCard[]>();
  const [myProfiles, setMyProfiles] = useState<SwiperCard>();
  const [cardIndex, setCardIndex] = useState(-1);

  const swiperRef = useRef<Swiper<SwiperCard>>(null);

  useEffect(() => {
    onSnapshot(doc(db, 'user', user.id), (data) => {
      if (!data.exists()) navigation.replace('Modal');
    });
  }, [user.id]);

  useEffect(() => {
    const getMine = async () => {
      const mine = await getDoc(doc(db, 'user', user.id));

      const { timestamp, ...rest } = mine.data() as SwiperCard & {
        timestamp: any;
      };

      setMyProfiles(rest);
    };

    getMine();
  }, [user.id]);

  useEffect(() => {
    const getProfiles = async () => {
      try {
        const pass = ['test'];

        // await getDocs(collection(db, 'user', user.id, 'pass')).then((data) => {
        //   const temp = data.docs.map((doc) => doc.id);
        //   pass.push(...temp);
        // });

        // await getDocs(collection(db, 'user', user.id, 'ok')).then((data) => {
        //   const temp = data.docs.map((doc) => doc.id);
        //   pass.push(...temp);
        // });

        onSnapshot(
          query(collection(db, 'user'), where('id', 'not-in', pass)),
          (data) => {
            const users = data.docs
              .filter((doc) => doc.id !== user.id)
              .map((doc) => {
                const { timestamp, ...rest } = doc.data();
                return { id: doc.id, ...rest } as SwiperCard;
              });

            setProfiles(users);
          }
        );
      } catch (error) {
        console.log(error);
      }
    };

    getProfiles();
  }, [user.id]);

  const swipeLeft = async (index: number) => {
    if (!profiles || !profiles[index]) return;

    const profile = profiles[index];

    setDoc(doc(db, 'user', user.id, 'pass', profile.id), { profile });
  };

  const swipeRight = async (index: number) => {
    if (!profiles || !profiles[index]) return;

    const profile = profiles[index];

    getDoc(doc(db, 'user', profile.id, 'ok', user.id)).then((data) => {
      if (data.exists()) {
        setDoc(doc(db, 'match', generateId(user.id, profile.id)), {
          users: {
            [user.id]: myProfiles!,
            [profile.id]: profile,
          },
          match: [user.id, profile.id],
          timestamp: serverTimestamp(),
        });

        navigation.navigate('Match', {
          me: myProfiles!,
          you: profile,
        });
      }

      setDoc(doc(db, 'user', user.id, 'ok', profile.id), { profile });
    });
  };

  if (!profiles)
    return (
      <View className="flex-1 items-center justify-center">
        <StatusBar />

        <ActivityIndicator size={'large'} color={'#ff5864'} />
      </View>
    );

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
            onSwipedLeft={swipeLeft}
            onSwipedRight={swipeRight}
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
