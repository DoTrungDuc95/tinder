import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation/type';
import HomeScreen from '../screens/HomeScreen';
import ChatScreen from '../screens/ChatScreen';
import LoginScreen from '../screens/LoginScreen';
import useAuth from '../hooks/useAuth';
import ModalScreen from '../screens/ModalScreen';
import MatchScreen from '../screens/MatchScreen';
import MessagesScreen from '../screens/MessagesScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const StackNavigator = () => {
  const { user } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Group>
          <Stack.Group>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="Messages" component={MessagesScreen} />
          </Stack.Group>

          <Stack.Group screenOptions={{ presentation: 'modal' }}>
            <Stack.Screen name="Modal" component={ModalScreen} />
          </Stack.Group>

          <Stack.Group screenOptions={{ presentation: 'transparentModal' }}>
            <Stack.Screen
              name="Match"
              component={MatchScreen}
              options={{ animation: 'slide_from_bottom' }}
            />
          </Stack.Group>
        </Stack.Group>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
};

export default StackNavigator;
