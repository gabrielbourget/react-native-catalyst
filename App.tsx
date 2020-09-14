import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import LoadAssets from "./src/Components/LoadAssets";

import Home from "./src/Screens/Home";

const HomeStack = createStackNavigator();

const HomeNavigator = () => {
  return (
    <HomeStack.Navigator headerMode="none">
      <HomeStack.Screen name="Home" component={Home} />
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
