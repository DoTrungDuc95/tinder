import { View, Text, Pressable } from 'react-native';
import React from 'react';

type RadioProps = {
  label: string;
  value: string;
  w?: number;
  h?: number;
  checked: boolean;
  textSize?: 'lg' | 'base' | 'xl' | 'sm' | 'xs';
  onPress: (value: any) => void;
  mr?: number;
};

const Radio = ({
  label,
  value,
  w = 30,
  h = 30,
  checked,
  textSize = 'base',
  onPress,
  mr = 0,
}: RadioProps) => {
  return (
    <Pressable
      className="flex-row items-center gap-2"
      style={{ marginRight: mr }}
      onPress={() => onPress(value)}
    >
      <View
        className="rounded-full border-2 border-red-500 items-center justify-center"
        style={{ width: w, height: h }}
      >
        {checked && (
          <View
            style={{ width: w - 10, height: h - 10 }}
            className="rounded-full bg-red-500"
          />
        )}
      </View>

      <Text className={`text-${textSize}`}>{label}</Text>
    </Pressable>
  );
};

export default Radio;
