import { View, Text } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type SafeViewProps = {
  children: React.ReactNode;
  top?: boolean;
  bottom?: boolean;
  left?: boolean;
  right?: boolean;
  flex?: number;
  safeClassName?: string;
};

const SafeView = ({
  children,
  safeClassName,
  top,
  bottom,
  left,
  right,
  flex = 1,
}: SafeViewProps) => {
  const inset = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingBottom: bottom ? inset.bottom : 0,
        paddingLeft: left ? inset.left : 0,
        paddingRight: right ? inset.right : 0,
        paddingTop: top ? inset.top : 0,
        flex,
      }}
      className={safeClassName}
    >
      {children}
    </View>
  );
};

export default SafeView;
