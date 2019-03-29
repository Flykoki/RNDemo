import React, { Component } from "react";
import { View, StatusBar, Dimensions, Text, StyleSheet } from "react-native";
import {
  createMaterialTopTabNavigator,
  createAppContainer
} from "react-navigation";
import MaimaicheTab from "./MaimaicheTab";
import PropertyTab from "./PropertyTab";
const screenWidth = Dimensions.get("screen").width;
const tabBarViewMargin = screenWidth / 2 - 80;
const Pubsub = require("pubsub-js");

const tabNavigator = createMaterialTopTabNavigator(
  {
    Maimaiche: {
      screen: MaimaicheTab,
      navigationOptions: {
        tabBarLabel: "买买车",
        tabBarIcon: ({ focused, tintColor }) => (
          <TopBarItem focused={focused} text={"买买车"} />
        )
      }
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
        width: 80
      },
      style: {
        backgroundColor: "#FFFFFF",
        paddingStart: tabBarViewMargin
      },
      indicatorStyle: {
        backgroundColor: "#F12E49",
        height: 3,
        width: 50,
        marginStart: tabBarViewMargin + 15,
        borderRadius: 2
      },
      activeTintColor: "tomato",
      inactiveTintColor: "gray",
      showIcon: true,
      showLabel: false
    },
    initialRouteName: "Property"
  }
);

const AppContainer = createAppContainer(tabNavigator);

export class TopBarItem extends Component {
  constructor(props) {
    super(props);
    this.state = { tips: false };
    Pubsub.subscribe(this.props.text, (msg, data) => {
      if (msg === this.props.text) {
        this.setState({ tips: data });
      }
    });
  }

  componentWillUnmount() {
    PubSub.unsubscribe(this.props.text);
  }

  render() {
    return (
      <View style={styles.topBarItemContainer}>
        <Text
          style={[
            { color: this.props.focused ? "#333333" : "#999999" },
            styles.topBarItemText
          ]}
        >
          {this.props.text}
        </Text>
        {this.state.tips && <View style={styles.topBarItemTips} />}
      </View>
    );
  }
}

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

  static getAppNavigation() {
    return Workbench._navigation;
  }

  render() {
    return <AppContainer />;
  }
}

const styles = StyleSheet.create({
  topBarItemContainer: { width: 60, height: 21, alignItems: "center" },
  topBarItemText: { fontSize: 15 },
  topBarItemTips: {
    position: "absolute",
    top: 0,
    right: 0,
    borderRadius: 3,
    height: 6,
    width: 6,
    backgroundColor: "#F12E49"
  }
});
