/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React from "react";
import { Image } from "react-native";
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
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === "首页") {
          iconName = focused
            ? require("./src/res/img/app_info_tab_pre.png")
            : require("./src/res/img/app_info_tab_nor.png");
        } else if (routeName === "我的") {
          iconName = focused
            ? require("./src/res/img/app_mine_tab_pre.png")
            : require("./src/res/img/app_mine_tab_nor.png");
        }

        return <Image style={{ width: 20, height: 18 }} source={iconName} />;
      }
    }),
    tabBarOptions: {
      activeTintColor: "tomato",
      inactiveTintColor: "gray"
    },
    initialRouteName: "我的"
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
