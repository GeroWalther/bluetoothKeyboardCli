import type { StackScreenProps } from '@react-navigation/stack';

export type RootStackParamList = {
  MainScreen: undefined;
  KeyboardMouseScreen: undefined;
};

export type RootScreenProps<
  S extends keyof RootStackParamList = keyof RootStackParamList
> = StackScreenProps<RootStackParamList, S>;
