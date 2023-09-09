import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
  Pressable,
  Keyboard,
  FlatList,
} from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import SafeView from '../components/safeAreas/SafeView';
import { StatusBar } from 'expo-status-bar';
import Header from '../components/Header';
import { RootStackScreenProps } from '../types/navigation/type';
import Sender from '../components/chat/Sender';
import Receiver from '../components/chat/Receiver';
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { MessageType } from '../types';

type MessagesScreenProps = {
  route: RootStackScreenProps<'Messages'>['route'];
};

const MessagesScreen = ({ route }: MessagesScreenProps) => {
  const { you, me, chatId } = route.params;
  const [messages, setMessages] = useState<MessageType[]>();
  const text = useRef('');
  const inputRef = useRef<TextInput>(null);

  const sendMessage = () => {
    addDoc(collection(db, 'match', chatId, 'message'), {
      userId: me.id,
      message: text.current,
      timestamp: serverTimestamp(),
    });

    text.current = '';
    inputRef.current?.clear();
  };

  useEffect(() => {
    onSnapshot(
      query(
        collection(db, 'match', chatId, 'message'),
        orderBy('timestamp', 'desc')
      ),
      (data) => {
        const r = data.docs.map((doc) => {
          const { timestamp, ...rest } = doc.data();

          return { id: doc.id, ...rest } as MessageType;
        });

        setMessages(r);
      }
    );
  }, [chatId]);

  return (
    <SafeView top bottom>
      <StatusBar />

      <Header callEnable title={you.name!} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={10}
      >
        <Pressable className="flex-1" onPress={() => Keyboard.dismiss()}>
          <FlatList
            data={messages}
            inverted
            showsVerticalScrollIndicator={false}
            bounces={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 16 }}
            renderItem={({ item }) =>
              item.userId === me.id ? (
                <Sender message={item.message} />
              ) : (
                <Receiver message={item.message} photo={you.photo} />
              )
            }
          />
        </Pressable>

        <View className="p-4">
          <View className="flex-row items-center rounded-lg">
            <TextInput
              ref={inputRef}
              placeholder="write something..."
              onChangeText={(val) => (text.current = val)}
              className="flex-1 text-lg p-4 bg-white rounded-l-lg"
            />

            <TouchableOpacity
              className="bg-[#ff5864] rounded-r-lg"
              onPress={sendMessage}
            >
              <Text className="font-semibold text-lg p-4 text-white">SEND</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeView>
  );
};

export default MessagesScreen;
