import { StyleSheet } from "react-native";
import { ICarouselProps, IAdditionalInfo } from "./helpers";

export const styleGen = (
  { images }: ICarouselProps,
  { height, width }: IAdditionalInfo
) => {
  return StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "black",
    },
    pictures: {
      width: width * images.length,
      height,
      flexDirection: "row",
    },
    picture: {
      width,
      height,
      overflow: "hidden",
    },
    image: {
      ...StyleSheet.absoluteFillObject,
      width: undefined,
      height: undefined,
    },
  });
};
