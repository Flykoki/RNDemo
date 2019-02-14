/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React from "react";
import {
  createBottomTabNavigator,
  createAppContainer,
  createStackNavigator
} from "react-navigation";
import HomeStack from "./src/js/home/HomeStack";
import { MineScreen } from "./src/js/mine/MineScreen";
import SettingsScreen from "./src/js/mine/settings/SettingsScreen";
import FeedbackScreen from "./src/js/mine/Feedback";
import PersonalInfoScreen from "./src/js/mine/personal/PersonalInfo";
const TabNavigator = createBottomTabNavigator(
  {
    首页: HomeStack,
    我的: MineScreen
  },
  {
    tabBarOptions: {
      activeTintColor: "tomato",
      inactiveTintColor: "gray"
    }
  }
);

const StackContainer = createStackNavigator(
  {
    Feedback: FeedbackScreen,
    Settings: SettingsScreen,
    PersonalInfo: PersonalInfoScreen,
    HomeTab: {
      screen: TabNavigator,
      navigationOptions: {
        header: null
      }
    }
  },
  {
    initialRouteName: "HomeTab",
    defaultNavigationOptions: {
      headerTitleStyle: { flex: 1, textAlign: "center" }
    }
  }
);

const AppContainer = createAppContainer(StackContainer);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
