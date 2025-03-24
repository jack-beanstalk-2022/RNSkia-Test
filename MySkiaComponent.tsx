import {
  Canvas,
  Circle,
} from "@shopify/react-native-skia";

const MySkiaComponent = () => {
  return (
    <Canvas style={{ flex: 1 }}>
      <Circle r={128} cx={128} cy={128} color="red" />
    </Canvas>
  );
}
export default MySkiaComponent;