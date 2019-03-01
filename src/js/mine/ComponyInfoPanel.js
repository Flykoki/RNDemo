import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

export default class ComponyInfoPanel extends Component {
  _renderIconList(business) {
    let icons = [];
    if (business.indexOf("4s") > -1) {
      icons.push(
        <Image
          key="1"
          style={styles.icon}
          source={require("../../res/img/app_mine_label_4s_finance.png")}
        />
      );
    }

    if (business.indexOf("car") > -1) {
      icons.push(
        <Image
          key="2"
          style={styles.icon}
          source={require("../../res/img/app_mine_label_car_supply.png")}
        />
      );
    }

    if (business.indexOf("finance") > -1) {
      icons.push(
        <Image
          key="3"
          style={styles.icon}
          source={require("../../res/img/app_mine_label_finance_distribution.png")}
        />
      );
    }

    return icons;
  }
  render() {
    return (
      <TouchableOpacity
        style={[this.props.style]}
        onPress={this.props.onPress}
        activeOpacity={1}
      >
        <Text style={styles.name}>{this.props.info.company}</Text>

        <View style={styles.iconsList}>
          {this._renderIconList(this.props.info.business)}
        </View>
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
