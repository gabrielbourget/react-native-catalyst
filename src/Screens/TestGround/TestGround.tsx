import React from "react";
import { View } from "react-native";

import CarouselDemo from "../../Components/Carousel/CarouselDemo";

const TestGround: React.FC = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "lightblue" }}>
      <CarouselDemo />
    </View>
  );
}

export default TestGround;