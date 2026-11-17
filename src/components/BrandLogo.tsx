import { Image, StyleSheet } from "react-native";

export default function BrandLogo() {
  return (
    <Image
      source={require("../img/logotranslucent.png")}
      style={styles.image}
      resizeMode="contain"
      accessibilityLabel="Logo de STUDAYS"
    />
  );
}

const styles = StyleSheet.create({
  image: {
    width: 64,
    height: 64,
    marginBottom: 5,
  },
});
