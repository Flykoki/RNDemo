import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

export default class VehicleInofPanel extends Component {
  render() {
    return (
      <View style={[this.props.style, styles.container]}>
        <Text style={styles.carType}>{this.props.vehicle}</Text>
        <Text style={styles.carTypeText}>{this.props.vehicleType}</Text>
        <Text style={styles.carColorText}>{this.props.vehicleColor}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flexDirection: "row" },
  carType: {
    color: "#333333",
    fontSize: 14,
    textAlignVertical: "center"
  },
  carTypeText: {
    position: "relative",
    height: 18,
    left: 10,
    borderRadius: 2.7,
    borderColor: "#F12E49",
    borderWidth: 0.5,
    fontSize: 12,
    color: "#F12E49",
    paddingLeft: 6,
    paddingRight: 6
  },
  carColorText: {
    position: "relative",
    height: 18,
    left: 20,
    borderRadius: 2.7,
    borderColor: "#F49C2F",
    borderWidth: 0.5,
    color: "#F49C2F",
    fontSize: 12,
    paddingLeft: 6,
    paddingRight: 6
  }
});
