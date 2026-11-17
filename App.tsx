import { useEffect, useState } from "react";
import { Image, StatusBar, StyleSheet, View } from "react-native";

import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  const [showStartupScreen, setShowStartupScreen] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setShowStartupScreen(false), 1800);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar hidden={showStartupScreen} />
      {showStartupScreen ? (
        <Image
          source={require("./src/img/loadscreen.png")}
          style={styles.startupImage}
          resizeMode="cover"
          accessibilityLabel="Pantalla de carga de STUDAYS"
        />
      ) : (
        <AppNavigator />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  startupImage: {
    width: "100%",
    height: "100%",
  },
});