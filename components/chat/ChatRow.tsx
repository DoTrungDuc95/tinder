import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { MatchType, MessageType } from '../../types';
import { useNavigation } from '@react-navigation/native';
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import { db } from '../../config/firebase';

type ChatRowProps = {
  match: MatchType;
  myId: string;
};

const ChatRow = ({ match, myId }: ChatRowProps) => {
  const yourId = match.match.filter((id) => id !== myId)[0];
  const you = match.users[yourId];
  const me = match.users[myId];

  const [lastMessage, setLastMessage] = useState<MessageType>();

  const navigation = useNavigation();

  useEffect(() => {
    onSnapshot(
      query(
        collection(db, 'match', match.id, 'message'),
        orderBy('timestamp', 'desc'),
        limit(1)
      ),
      (data) => {
        if (data.docs[0]) {
          const { timestamp, ...rest } = data.docs[0].data();

          setLastMessage({ id: '', ...rest } as MessageType);
        } else
          setLastMessage({
            id: '',
            userId: '',
            message: 'admin: Say something',
          } as MessageType);
      }
    );
  }, []);

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('Messages', { you, me, chatId: match.id })
      }
      className="flex-row items-center space-x-4 p-3 px-5 bg-white rounded-lg"
      style={styles.cardShadow}
    >
      <Image source={{ uri: you.photo }} className="h-16 w-16 rounded-full" />

      <View className="flex-1">
        <Text className="text-lg font-bold">{you.name}</Text>

        <Text className="" numberOfLines={1}>
          {myId === lastMessage?.userId
            ? `you: ${lastMessage.message}`
            : lastMessage?.message}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ChatRow;

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
