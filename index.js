import { AppRegistry } from "react-native";
import { LoadSkiaWeb } from "@shopify/react-native-skia/lib/module/web";

globalThis.setImmediate = requestAnimationFrame;
globalThis.process = {
  env: {
    CI: "false",
  },
};

LoadSkiaWeb().then(async () => {
  const App = (await import("./MySkiaComponent")).default;
  const appInfo = await import("./app.json");
  AppRegistry.registerComponent(appInfo.name, () => App);
  AppRegistry.runApplication(appInfo.name, {
    initialProps: {},
    rootTag: document.getElementById("app-root"),
  });
});
