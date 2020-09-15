import React from "react";
import { View } from "react-native";
import Carousel from "./Carousel";

export const photos = [
  require("./assets/3.jpg"),
  require("./assets/2.jpg"),
  require("./assets/4.jpg"),
  require("./assets/5.jpg"),
  require("./assets/1.jpg"),
];

const CarouselDemo: React.FC = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <Carousel images={photos} />
    </View>
  );
}

export default CarouselDemo;
