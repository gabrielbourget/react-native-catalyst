import { ImageRequireSource } from "react-native";

export interface ICarouselProps {
  // - TODO: -> Change this when generalizing to any images rather than just those being 'require()'d 
  images: ImageRequireSource[];
}

export interface IAdditionalInfo {
  height: number;
  width: number;
}
