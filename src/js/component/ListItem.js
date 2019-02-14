import React, { Component } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";

export default class ListItem extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { name, value, showArrow, onPress, style } = this.props;
    return (
      <TouchableOpacity
        style={[style, styles.containerStyle]}
        onPress={onPress}
        activeOpacity={1}
      >
        <Text style={styles.textStyle}>{name}</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={[
              styles.textStyle,
              {
                marginRight: 10
              }
            ]}
          >
            {value}
          </Text>
          <Image
            style={{
              width: 6,
              height: 10,
              display: showArrow ? "flex" : "none"
            }}
            source={require("../../res/img/icon_left_arrow_black.png")}
          />
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  textStyle: {
    color: "#333333",
    fontSize: 15
  },
  containerStyle: {
    height: 50,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingRight: 16,
    paddingLeft: 16,
    backgroundColor: "white"
  }
});
