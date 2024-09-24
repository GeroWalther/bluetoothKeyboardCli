// nativewind.d.ts

import 'nativewind';
import { TextProps, ViewProps } from 'react-native';

// Extending Text to support `className` prop
declare module 'react-native' {
  interface TextProps {
    className?: string;
  }

  interface ViewProps {
    className?: string;
  }

  interface ButtonProps {
    className?: string;
  }
  interface TouchableOpacityProps {
    className?: string;
  }
}
