import React, { Component } from "react";
import { View, Text, StatusBar } from "react-native";
import { createStackNavigator, createAppContainer } from "react-navigation";
import ListItem from "./ListItem";
import PersonalPanel from "./PersonalPanel";
import SettingsScreen from "./settings/SettingsScreen";
export class MineScreen extends Component {
  componentDidMount() {
    this._navListener = this.props.navigation.addListener("didFocus", () => {
      StatusBar.setBarStyle("light-content");
      StatusBar.setBackgroundColor("#F1314B");
    });
  }

  componentWillUnmount = () => {
    this._navListener.remove();
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "stretch",
          backgroundColor: "#F8F8F8"
        }}
      >
        <View
          style={{
            paddingTop: 13,
            backgroundColor: "#F1314B",
            flexDirection: "column",
            alignItems: "stretch"
          }}
        >
          <Text
            style={{
              fontSize: 18,
              justifyContent: "center",
              textAlign: "center",
              color: "white",
              marginBottom: 17,
              alignItems: "center"
            }}
          >
            我的
          </Text>
          <PersonalPanel name="懒懒岚" phoneNumber="18888888888" />
        </View>

        <View style={{ backgroundColor: "white", marginTop: 10 }}>
          <ListItem name="意见反馈" showArrow="1" />
          <View
            style={{ height: 0.5, backgroundColor: "#E3E3E3", marginLeft: 17 }}
          />
          <ListItem
            style={{ height: 50 }}
            name="设置"
            showArrow="1"
            onPress={() => {
              this.props.navigation.navigate("Settings");
            }}
          />
          <View
            style={{ height: 0.5, backgroundColor: "#E3E3E3", marginLeft: 17 }}
          />
          <ListItem style={{ height: 50 }} />
          <View
            style={{ height: 0.5, backgroundColor: "#E3E3E3", marginLeft: 17 }}
          />
          <ListItem style={{ height: 50 }} />
          <View
            style={{ height: 0.5, backgroundColor: "#E3E3E3", marginLeft: 17 }}
          />
        </View>
      </View>
    );
  }
}
