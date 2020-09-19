import { StyleSheet } from "react-native";

export const styleGen = () => {
  return StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "black",
    },
    image: {
      ...StyleSheet.absoluteFillObject,
      width: undefined,
      height: undefined,
      resizeMode: "cover",
    },
  })
};
