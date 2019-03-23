import React, { Component } from "react";
import { View, StatusBar } from "react-native";
import {
  createMaterialTopTabNavigator,
  createAppContainer
} from "react-navigation";
import { RootView } from "../component/CommonView";
import MaimaicheTab from "./MaimaicheTab";
import PropertyTab from "./PropertyTab";

const tabNavigator = createMaterialTopTabNavigator(
  {
    Maimaiche: {
      title: "买买车",
      screen: MaimaicheTab
    },
    Property: {
      title: "资产",
      screen: PropertyTab
    }
  },
  {
    tabBarOptions: {
      activeTintColor: "white",
      labelStyle: {
        fontSize: 15
      },
      tabStyle: {
        width: 100
      },
      style: {
        backgroundColor: "#FFFFFF"
      },
      indicatorStyle: {
        backgroundColor: "#F12E49",
        height: 3
      },
      activeTintColor: "tomato",
      inactiveTintColor: "gray"
    },
    initialRouteName: "Property"
  }
);

const AppContainer = createAppContainer(tabNavigator);

export default class Workbench extends Component {
  static _navigation;
  constructor(props) {
    super(props);
    Workbench._navigation = props.navigation;
  }
  componentDidMount() {
    this._navListener = this.props.navigation.addListener("didFocus", () => {
      StatusBar.setTranslucent(false); //关闭沉浸式
      StatusBar.setBarStyle("dark-content");
      StatusBar.setBackgroundColor("#FFFFFF");
    });
  }

  componentWillUnmount = () => {
    this._navListener.remove();
  };

  static jumptoMissionCenter() {
    Workbench._navigation.navigate("MissionsCenterPage");
  }
  render() {
    return <AppContainer />;
  }
}
