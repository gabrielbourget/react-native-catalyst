// -> Beyond Codebase
import React from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import Animated, {
  add, clockRunning, cond, onChange,
  divide, eq, floor, not, set,
  useCode, multiply, sub, and, neq
} from "react-native-reanimated";
import {
  snapPoint, timing, useClock, clamp,
  usePanGestureHandler, useValue,
} from "react-native-redash";
// -> Within Component
import { styleGen } from "./CarouselStyles";
import { ICarouselProps } from "./helpers";
import CarouselImage from "./InternalComponents/CarouselImage/CarouselImage";

const { width, height } = Dimensions.get("window");

const Carousel: React.FC<ICarouselProps> = ({ images }) => {
  const { container, pictures, picture, image } = styleGen({ images }, { height, width });

  const snapPoints = images.map((_, i: number) => i * -width);
  const clock = useClock();
  const index = useValue(0);
  const offsetX = useValue(0);
  const translationX = useValue(0);
  const translateX = useValue(0);
  const {
    gestureHandler, state, velocity, translation,
  } = usePanGestureHandler();
  // -> The snapPoint() call determines the next snap point
  //    to go towards based on the current translation and
  //    velocity vectors.
  // -> This is bounded by a clamp so that you can only ever
  //    move one image at a time.
  const to = clamp(
    snapPoint(translateX, velocity.x, snapPoints),
    multiply(-width, add(index, 1)),
    multiply(-width, sub(index, 1))
  );

  useCode(
    () => [
      onChange(
        translationX,
        cond(eq(state, State.ACTIVE), [
          set(translateX, add(offsetX, translationX)),
        ])
      ),
      cond(and(eq(state, State.END), neq(translationX, 0)), [
        set(translateX, timing({ clock, from: translateX, to })),
        set(offsetX, translateX),
        cond(not(clockRunning(clock)), [
          set(index, floor(divide(translateX, -width))),
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
            {images.map((source, i) => (
              <View key={source} style={picture}>
                <CarouselImage
                  isActive={eq(index, i)}
                  panState={state}
                  panTranslation={translation}
                  panVelocity={velocity}
                  swipeX={translationX}
                  {...{ source }}
                />
              </View>
            ))}
          </Animated.View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

export default Carousel;
