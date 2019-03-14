import React, { Component } from "react";
import { Image, StyleSheet, Dimensions, StatusBar } from "react-native";
import AccountHelper from "../login/AccountHelper";
import { NavigationActions } from "react-navigation";

const { width, height } = Dimensions.get("window");

export default class SplashView extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: null
    };
  };

  componentDidMount() {
    this._navListener = this.props.navigation.addListener("didFocus", () => {
      StatusBar.setTranslucent(true); //开启沉浸式
      StatusBar.setBackgroundColor("transparent");
    });
    setTimeout(() => {
      AccountHelper.getAccountInfo().then(result => {
        if (result) {
          this._jumpToHomeTab();
        } else {
          this._jumpToDistributePage();
        }
      });
    }, 2000);
  }

  componentWillUnmount = () => {
    this._navListener.remove();
  };

  _jumpToHomeTab() {
    this.props.navigation.reset(
      [NavigationActions.navigate({ routeName: "HomeTab" })],
      0
    );
  }

  _jumpToDistributePage() {
    this.props.navigation.reset(
      [NavigationActions.navigate({ routeName: "DistributePage" })],
      0
    );
  }

  render() {
    return (
      <Image
        style={styles.container}
        source={require("../../res/img/splash_view_bg.png")}
        resizeMode="contain"
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height: height
  }
});
