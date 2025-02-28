import React from "react";
import { View } from "react-native";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming 
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons"; 

const AnimatedSettingsIcon = () => {
  const scale = useSharedValue(0.5); 
  const translateX = useSharedValue(0);
  const rotate = useSharedValue("0deg");

  React.useEffect(() => {
    scale.value = withTiming(1.5, { duration: 1500 });

    setTimeout(() => {
      translateX.value = withTiming(100, { duration: 3000 });
      rotate.value = withTiming("180deg", { duration: 3000 }); 

      setTimeout(() => {
        translateX.value = withTiming(-100, { duration: 3000 }); 
        rotate.value = withTiming("-180deg", { duration: 3000 });

        setTimeout(() => {
          translateX.value = withTiming(0, { duration: 1500 });
          rotate.value = withTiming("180deg", { duration: 1500 });
        }, 3000);
      }, 3000);
    }, 1500);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translateX.value },
      { rotate: rotate.value }
    ],
  }));

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Animated.View style={animatedStyle}>
        <Ionicons name="settings" size={90} color="black" />
      </Animated.View>
    </View>
  );
};

export default AnimatedSettingsIcon;
