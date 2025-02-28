// types.ts (yoki src/types.ts, agar papkada saqlamoqchi bo'lsangiz)
import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  Home: undefined;
  EditPassword: undefined;
  // Qo'shimcha ekranlar bo'lsa, shu yerda qo'shishingiz mumkin
};

export type NavigationProps = StackNavigationProp<RootStackParamList>;