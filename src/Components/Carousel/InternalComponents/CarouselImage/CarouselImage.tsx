// -> Beyond Codebase
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  Clock, and, block, cond, diff, eq,
  multiply, neq, not, or, set, stopClock,
  sub, useCode,
} from "react-native-reanimated";
import { PinchGestureHandler, State } from "react-native-gesture-handler";
import {
  Vector, pinchActive, pinchBegan, translate,
  usePinchGestureHandler, useValue, useVector, vec,
} from "react-native-redash";
// -> Within Codebase
import { decayVector } from "../../AnimationUtils";
// -> Within Component
import { styleGen } from "./CarouselImageStyles";

const { width, height } = Dimensions.get("window");
const CANVAS = vec.create(width, height);
const CENTER = vec.divide(CANVAS, 2);

interface ICarouselImageProps {
  panState: Animated.Node<State>;
  panTranslation: Vector;
  panVelocity: Vector;
  isActive: Animated.Node<0 | 1>;
  swipeX: Animated.Value<number>;
  source: number;
}

const CarouselImage = ({
  panState, panTranslation, panVelocity,
  isActive, swipeX, source,
}: ICarouselImageProps) => {
  const { image, container } = styleGen();
  
  // -> Animation resources
  const shouldDecay = useValue(0);
  const clock = vec.create(new Clock(), new Clock());
  const origin = useVector(0, 0);
  const scale = useValue(1);
  const scaleOffset = useValue(1);
  const translation = vec.createValue(0, 0);
  const offset = useVector(0, 0);
  const {
    gestureHandler,
    numberOfPointers,
    state,
    scale: gestureScale,
    focal,
  } = usePinchGestureHandler();
  const adjustedFocal = vec.sub(focal, vec.add(CENTER, offset));
  const minVec = vec.multiply(-0.5, CANVAS, sub(scale, 1));
  const maxVec = vec.minus(minVec);
  const clamped = vec.sub(
    vec.clamp(vec.add(offset, panTranslation), minVec, maxVec),
    offset
  );

  useCode(
    () =>
      block([
        // -> Currently the active image and the pan gesture handler is active.
        cond(and(isActive, eq(panState, State.ACTIVE)), [
          vec.set(translation, clamped),
          set(swipeX, sub(panTranslation.x, clamped.x)),
        ]),
        // -> Set the focal point of a pinch as it begins
        cond(pinchBegan(state), vec.set(origin, adjustedFocal)),
        // -> Set the translation vector as the image is panned around
        //    with the pinch pointers.
        cond(pinchActive(state, numberOfPointers), [
          vec.set(
            translation,
            vec.add(
              vec.sub(adjustedFocal, origin),
              origin,
              vec.multiply(-1, gestureScale, origin)
            )
          ),
        ]),
        // -> Currently the active image and the pinch and pan state are either
        //    done or undetermined.
        cond(
          and(
            isActive,
            or(eq(panState, State.END), eq(panState, State.UNDETERMINED)),
            or(eq(state, State.END), eq(state, State.UNDETERMINED))
          ),
          [
            vec.set(offset, vec.add(offset, translation)),
            set(scaleOffset, scale),
            set(gestureScale, 1),
            vec.set(translation, 0),
            vec.set(focal, 0),
          ]
        ),
        // -> Pinch and pan states are let go of, decay image velocity.
        cond(
          and(
            isActive,
            neq(diff(panState), 0),
            eq(panState, State.END),
            neq(state, State.ACTIVE)
          ),
          [set(shouldDecay, 1)]
        ),
        // -> Run 2-dimensional velocity decay
        cond(shouldDecay, [
          vec.set(
            offset,
            vec.clamp(decayVector(offset, panVelocity, clock), minVec, maxVec)
          ),
        ]),
        // -> Pinching or panning begins again, cancel decays.
        cond(
          and(
            isActive,
            or(eq(panState, State.ACTIVE), eq(state, State.ACTIVE))
          ),
          [stopClock(clock.x), stopClock(clock.y), set(shouldDecay, 0)]
        ),
        // -> Reset gesture resources to defaults once not the active image anymore.
        cond(not(isActive), [
          stopClock(clock.x),
          stopClock(clock.y),
          set(shouldDecay, 0),
          vec.set(offset, 0),
          set(scaleOffset, 1),
          set(gestureScale, 1),
          vec.set(translation, 0),
          vec.set(focal, 0),
        ]),
        set(scale, multiply(gestureScale, scaleOffset)),
      ]),
    []
  );

  return (
    <View style={container}>
      <PinchGestureHandler {...gestureHandler}>
        <Animated.View style={StyleSheet.absoluteFill}>
          <Animated.Image
            style={[
              image,
              {
                transform: [
                  ...translate(vec.add(offset, translation)),
                  { scale },
                ],
              },
            ]}
            {...{ source }}
          />
        </Animated.View>
      </PinchGestureHandler>
    </View>
  );
};

export default CarouselImage;
