import { View, Text, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import useAuth from '../../hooks/useAuth';
import { db } from '../../config/firebase';
import { MatchType } from '../../types';
import ChatRow from './ChatRow';

const ChatList = () => {
  const [matchs, setMatchs] = useState<MatchType[]>([]);

  const { user: userInfo } = useAuth();
  const user = userInfo?.user!;

  useEffect(() => {
    onSnapshot(
      query(collection(db, 'match'), where('match', 'array-contains', user.id)),
      (data) => {
        const r = data.docs.map((doc) => {
          const { timestamp, ...rest } = doc.data();

          return { id: doc.id, ...rest } as MatchType;
        });

        setMatchs(r);
      }
    );
  }, [user.id]);

  return matchs.length ? (
    <FlatList
      data={matchs}
      keyExtractor={(item) => item.id}
      bounces={false}
      decelerationRate={0}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => <ChatRow match={item} myId={user.id} />}
    />
  ) : (
    <View className="flex-1 items-center justify-center">
      <Text className="text-lg font-bold">No matchs at the moment</Text>
    </View>
  );
};

export default ChatList;
