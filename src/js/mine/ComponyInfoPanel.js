import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

export default class ComponyInfoPanel extends Component {
  _renderIconList() {
    let icons = [];
    icons.push(
      <Image
        style={styles.icon}
        source={require("../../res/img/app_mine_label_4s_finance.png")}
      />
    );
    icons.push(
      <Image
        style={styles.icon}
        source={require("../../res/img/app_mine_label_car_supply.png")}
      />
    );
    icons.push(
      <Image
        style={styles.icon}
        source={require("../../res/img/app_mine_label_finance_distribution.png")}
      />
    );
    return icons;
  }
  render() {
    return (
      <TouchableOpacity
        style={[this.props.style]}
        onPress={this.props.onPress}
        activeOpacity={1}
      >
        <Text style={styles.name}>{"神州买买车分销商有限公司"}</Text>

        <View style={styles.iconsList}>{this._renderIconList()}</View>
        <Image
          style={styles.rightArrow}
          source={require("../../res/img/icon_left_arrow_black.png")}
        />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  name: {
    color: "#333333",
    fontSize: 18,
    marginStart: 15,
    marginTop: 15
  },
  iconsList: { marginTop: 10, marginLeft: 12, flexDirection: "row" },
  rightArrow: {
    position: "absolute",
    top: 36,
    right: 15,
    width: 6,
    height: 10
  },
  icon: { height: 18, width: 51, marginLeft: 5 }
});
