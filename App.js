/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React from "react";
import { createBottomTabNavigator, createAppContainer } from "react-navigation";
import HomeStack from "./src/js/home/HomeStack";
import SettingsScreen from "./src/js/personal/SettingsScreen";

const TabNavigator = createBottomTabNavigator(
  {
    首页: HomeStack,
    设置: SettingsScreen
  },
  {
    tabBarOptions: {
      activeTintColor: "tomato",
      inactiveTintColor: "gray"
    }
  }
);

const AppContainer = createAppContainer(TabNavigator);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
