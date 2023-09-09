import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SwiperCard } from '..';

export type RootStackParamList = {
  Home: undefined;
  Chat: undefined;
  Login: undefined;
  Modal: undefined;
  Messages: { me: SwiperCard; you: SwiperCard; chatId: string };
  Match: { me: SwiperCard; you: SwiperCard };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
