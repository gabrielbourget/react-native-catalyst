import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import LoadAssets from "./src/Components/LoadAssets";

import Home from "./src/Screens/Home";
import TestGround from "./src/Screens/TestGround";

const HomeStack = createStackNavigator();

const HomeNavigator = () => {
  return (
    <HomeStack.Navigator headerMode="none">
      {/* <HomeStack.Screen name="Home" component={Home} /> */}
      <HomeStack.Screen name="TestGround" component={TestGround} />
    </HomeStack.Navigator>
  );
}

const App = () => {
  return (
    <LoadAssets>
      <HomeNavigator />
    </LoadAssets>
  );
}

export default App;
