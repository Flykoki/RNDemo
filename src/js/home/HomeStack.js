import React, { Component } from "react";
import { StatusBar } from "react-native";
import { HomePage } from "./HomePage";
import { DetailPage } from "./DetailPage";
import { createStackNavigator, createAppContainer } from "react-navigation";

const HomeNavigator = createStackNavigator(
  {
    Home: HomePage,
    Detail: DetailPage
  },
  { initialRouteName: "Home" }
);

const AppContainer = createAppContainer(HomeNavigator);

export default class HomeStack extends Component {
  componentDidMount() {
    this._navListener = this.props.navigation.addListener("didFocus", () => {
      StatusBar.setBarStyle("dark-content");
      StatusBar.setBackgroundColor("#FFFFFF");
    });
  }

  componentWillUnmount = () => {
    this._navListener.remove();
  };

  render() {
    return <AppContainer />;
  }
}
