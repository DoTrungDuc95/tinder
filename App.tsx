import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './navigators/StackNavigator';
import AuthProvider from './providers/AuthProvider';

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <StackNavigator />
      </AuthProvider>
    </NavigationContainer>
  );
}
