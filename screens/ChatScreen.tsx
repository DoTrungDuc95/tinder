import { View, Text } from 'react-native';
import React from 'react';
import SafeView from '../components/safeAreas/SafeView';
import Header from '../components/Header';
import ChatList from '../components/chat/ChatList';
import { StatusBar } from 'expo-status-bar';

const ChatScreen = () => {
  return (
    <SafeView top>
      <StatusBar />
      
      <Header title="Chat" />

      <ChatList />
    </SafeView>
  );
};

export default ChatScreen;
