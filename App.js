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
import { PolicyList } from "./src/js/strategy/policy/PolicyList";
import { PolicyDetail } from "./src/js/strategy/policy/PolicyDetail";
import { HomePage } from "./src/js/home/HomePage";
import { MissionsCenterPage } from "./src/js/missionscenter/MissionsCenterPage";
import SettingsScreen from "./src/js/mine/settings/SettingsScreen";
import FeedbackScreen from "./src/js/mine/feedback/FeedbackScreen";
import InitSecurityPhoneStep1 from "./src/js/mine/settings/initsecurityphone/InitSecurityPhoneStep1";
import InitSecurityPhoneStep2 from "./src/js/mine/settings/initsecurityphone/InitSecurityPhoneStep2";
import ChangeSecurityPhoneStep1 from "./src/js/mine/settings/changesecurityphone/ChangeSecurityPhoneStep1";
import ChangeSecurityPhoneStep2 from "./src/js/mine/settings/changesecurityphone/ChangeSecurityPhoneStep2";
import PersonalInfoScreen from "./src/js/mine/personal/PersonalInfo";
import ModifyPwdScreen from "./src/js/mine/settings/ModifyPwdScreen";
import QrCodeScreen from "./src/js/mine/personal/QrCodeScreen";
import NotificationManager from "./src/js/mine/settings/notification/NotificationManager";
import CityList from "./src/js/component/city/CityList";
import InstallmentSalesOfNewCars from "./src/js/property/InstallmentSalesOfNewCars";
import SearchViewPage from "./src/js/missionscenter/SearchViewPage";
import TaskDetailScreen from "./src/js/property/TaskDetailScreen";
import CalenderScreen from "./src/js/component/CalenderScreen";
import StrategyPage from "./src/js/strategy/StrategyPage";
import TestPage from "./src/js/home/TestPage";
import LoginPage from "./src/js/login/LoginPage";
import DistributePage from "./src/js/login/DistributePage";
import SplashView from "./src/js/splash/SplashView";
import BusinessInfoScreen from "./src/js/mine/business/BusinessInfoScreen";
import QrCodeInfoScreen from "./src/js/mine/personal/QrCodeInfoScreen";
import StoreSelectionScreen from "./src/js/store/StoreSelectionScreen";
import {
  InsuranceDetailScreen,
  CarInfoScreen,
  IntegratedTaskInfo,
  TaskBasicInfo,
  InvoiceInfoScreen
} from "./src/js/property/TaskInfoDetailsScreen";
import Workbench from "./src/js/workbench/Workbench";
const TabNavigator = createBottomTabNavigator(
  {
    工作台: Workbench,
    咨询攻略: StrategyPage,
    我的: MineScreen
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === "工作台") {
          iconName = focused
            ? require("./src/res/img/app_info_tab_pre.png")
            : require("./src/res/img/app_info_tab_nor.png");
        } else if (routeName === "我的") {
          iconName = focused
            ? require("./src/res/img/app_mine_tab_pre.png")
            : require("./src/res/img/app_mine_tab_nor.png");
        } else if (routeName === "咨询攻略") {
          iconName = focused
            ? require("./src/res/img/app_strategy_tab_pre.png")
            : require("./src/res/img/app_strategy_tab_nor.png");
        }

        return <Image style={{ width: 20, height: 18 }} source={iconName} />;
      }
    }),
    tabBarOptions: {
      activeTintColor: "tomato",
      inactiveTintColor: "gray"
    },
    initialRouteName: "工作台"
  }
);

const StackContainer = createStackNavigator(
  {
    SplashView: SplashView,
    LoginPage: LoginPage,
    DistributePage: DistributePage,
    StrategyPage: StrategyPage,
    TestPage: TestPage,
    SearchViewPage: SearchViewPage,
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
    TaskBasicInfo: TaskBasicInfo,
    InstallmentSalesOfNewCars: InstallmentSalesOfNewCars,
    IntegratedTaskInfo: IntegratedTaskInfo,
    CarInfoScreen: CarInfoScreen,
    TaskDetailScreen: TaskDetailScreen,
    InsuranceDetailScreen: InsuranceDetailScreen,
    InvoiceInfoScreen: InvoiceInfoScreen,
    CalenderScreen: CalenderScreen,
    BusinessInfoScreen: BusinessInfoScreen,
    QrCodeInfoScreen: QrCodeInfoScreen,
    StoreSelectionScreen: StoreSelectionScreen,
    HomeTab: {
      screen: TabNavigator,
      navigationOptions: ({ navigation }) => {
        const { index } = navigation.state;
        return { header: null };
      }
    }
  },
  {
    initialRouteName: "SplashView",
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
