import React, { Component } from "react";
import { View } from "react-native";

export default class SettingsScreen extends Component {
  static navigationOptions = {
    title: "设置"
  };

  render() {
    return <View style={{ backgroundColor: "#F8F8F8" }} />;
  }
}
