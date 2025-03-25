import {
  useEffect,
  useState,
} from "react";
import {
  Canvas,
  Circle,
} from "@shopify/react-native-skia";
import {
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const MySkiaComponent = () => {
  const radius = useSharedValue(128);
  useEffect(() => {
    radius.value = withTiming(50, { duration: 2000 });
  }, []);
  return (
    <div>
      <Canvas style={{ flex: 1 }}>
        <Circle r={radius} cx={128} cy={128} color="red" />
      </Canvas>
    </div>
  );
}
export default MySkiaComponent;
