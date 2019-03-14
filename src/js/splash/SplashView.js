import React, { Component } from "react";
import { Image, StyleSheet, Dimensions } from "react-native";
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
