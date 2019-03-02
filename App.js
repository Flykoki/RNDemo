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
import { PolicyList } from "./src/js/policy/PolicyList";
import { PolicyDetail } from "./src/js/policy/PolicyDetail";
import { HomePage } from "./src/js/home/HomePage";
import { MissionsCenterPage } from "./src/js/missionscenter/MissionsCenterPage";
import SettingsScreen from "./src/js/mine/settings/SettingsScreen";
import FeedbackScreen from "./src/js/mine/FeedbackScreen";
import InitSecurityPhoneStep1 from "./src/js/mine/settings/initsecurityphone/InitSecurityPhoneStep1";
import InitSecurityPhoneStep2 from "./src/js/mine/settings/initsecurityphone/InitSecurityPhoneStep2";
import ChangeSecurityPhoneStep1 from "./src/js/mine/settings/changesecurityphone/ChangeSecurityPhoneStep1";
import ChangeSecurityPhoneStep2 from "./src/js/mine/settings/changesecurityphone/ChangeSecurityPhoneStep2";
import PersonalInfoScreen from "./src/js/mine/personal/PersonalInfo";
import ModifyPwdScreen from "./src/js/mine/settings/ModifyPwdScreen";
import QrCodeScreen from "./src/js/mine/personal/QrCodeScreen";
import NotificationManager from "./src/js/mine/settings/notification/NotificationManager";
import CityList from "./src/js/component/city/CityList";
import BasicInfo from "./src/js/property/BasicInfo";
import InstallmentSalesOfNewCars from "./src/js/property/InstallmentSalesOfNewCars";
import IntegratedTaskInfo from "./src/js/property/IntegratedTaskInfo";
import CarInfoScreen from "./src/js/property/CarInfoScreen";
import TestPage from "./src/js/home/TestPage";
const TabNavigator = createBottomTabNavigator(
  {
    首页: HomePage,
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
    TestPage: TestPage,
    Feedback: FeedbackScreen,
    PolicyList: PolicyList,
    MissionsCenterPage: MissionsCenterPage,
    PolicyDetail: PolicyDetail,
    ChangeSecurityPhoneStep1: ChangeSecurityPhoneStep1,
    ChangeSecurityPhoneStep2: ChangeSecurityPhoneStep2,
    InitSecurityPhoneStep1: InitSecurityPhoneStep1,
    InitSecurityPhoneStep2: InitSecurityPhoneStep2,
    ModifyPwd: ModifyPwdScreen,
    Settings: SettingsScreen,
    PersonalInfo: PersonalInfoScreen,
    QrCode: QrCodeScreen,
    NotificationManager: NotificationManager,
    CityList: CityList,
    BasicInfo: BasicInfo,
    InstallmentSalesOfNewCars: InstallmentSalesOfNewCars,
    IntegratedTaskInfo: IntegratedTaskInfo,
    CarInfoScreen: CarInfoScreen,
    HomeTab: {
      screen: TabNavigator,
      navigationOptions: ({ navigation }) => {
        const { index } = navigation.state;
        if (index === 1) {
          return { header: null };
        }
        if (index === 0) {
          return HomePage.navigationOptions(navigation);
        }
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
