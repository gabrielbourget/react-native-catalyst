// -> Beyond Codebase
import React from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import Animated, {
  add, clockRunning, cond,
  debug, divide, eq, floor,
  not, set, useCode,
} from "react-native-reanimated";
import {
  snapPoint, timing, useClock,
  usePanGestureHandler, useValue,
} from "react-native-redash";
// -> Within Component
import { styleGen } from "./CarouselStyles";
import { ICarouselProps } from "./helpers";

const { width, height } = Dimensions.get("window");

const Carousel: React.FC<ICarouselProps> = ({ images }) => {
  const { container, pictures, picture, image } = styleGen({ images }, { height, width});

  const snapPoints = images.map((_, i: number) => i * -width);
  const clock = useClock();
  const index = useValue(0);
  const offsetX = useValue(0);
  const translateX = useValue(0);
  const {
    gestureHandler, state, velocity, translation,
  } = usePanGestureHandler();
  const to = snapPoint(translateX, velocity.x, snapPoints);

  useCode(
    () => [
      cond(eq(state, State.ACTIVE), [
        set(translateX, add(offsetX, translation.x)),
      ]),
      cond(eq(state, State.END), [
        set(translateX, timing({ clock, from: translateX, to })),
        set(offsetX, translateX),
        cond(not(clockRunning(clock)), [
          set(index, floor(divide(translateX, -width))),
          debug("index", index),
        ]),
      ]),
    ],
    []
  );

  return (
    <View style={container}>
      <PanGestureHandler {...gestureHandler}>
        <Animated.View style={StyleSheet.absoluteFill}>
          <Animated.View
            style={[pictures, { transform: [{ translateX }] }]}
          >
            {images.map((source) => (
              <View key={source} style={picture}>
                <Image style={image} {...{ source }} />
              </View>
            ))}
          </Animated.View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

export default Carousel;
