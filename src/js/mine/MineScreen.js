import React, { Component } from "react";
import { View, Text, StatusBar, StyleSheet } from "react-native";
import SettingsList from "../component/SettingsList";
import PersonalPanel from "./PersonalPanel";

export class MineScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listData: [
        { key: 1, type: "margin", margin: 10 },
        {
          key: 2,
          type: "item",
          name: "意见反馈",
          showArrow: "1",
          onPress: () => {
            this.props.navigation.navigate("Feedback");
          }
        },
        { key: 3, type: "divider" },
        {
          key: 4,
          type: "item",
          name: "设置",
          showArrow: "1",
          onPress: () => {
            this.props.navigation.navigate("Settings");
          }
        }
      ]
    };
  }
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
      <View style={styles.container}>
        <View style={styles.panelContainer}>
          <Text style={styles.title}>我的</Text>
          <PersonalPanel
            onPress={() => {
              this.props.navigation.navigate("PersonalInfo");
            }}
            name="懒懒岚"
            phoneNumber="18888888888"
          />
        </View>

        <SettingsList data={this.state.listData} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "stretch",
    backgroundColor: "#F8F8F8"
  },
  panelContainer: {
    paddingTop: 13,
    backgroundColor: "#F1314B",
    flexDirection: "column",
    alignItems: "stretch"
  },
  title: {
    fontSize: 18,
    justifyContent: "center",
    textAlign: "center",
    color: "white",
    marginBottom: 17,
    alignItems: "center"
  }
});
