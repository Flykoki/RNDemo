import React, { Component } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";

export default class ListItem extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {
      name,
      value,
      showArrow,
      onPress,
      style,
      rightIcon,
      leftIcon
    } = this.props;
    return (
      <TouchableOpacity
        style={[style, styles.containerStyle]}
        onPress={onPress}
        activeOpacity={1}
      >
        <View style={styles.leftContaierStyle}>
          {leftIcon && (
            <Image
              style={styles.leftIconStyle}
              source={leftIcon}
              resizeMode="contain"
            />
          )}
          <Text style={styles.textStyle}>{name}</Text>
        </View>

        <View style={styles.leftContaierStyle}>
          <Text style={styles.textStyle}>{value}</Text>

          {rightIcon && (
            <Image
              style={[
                styles.rightIconStyle,
                {
                  display: rightIcon ? "flex" : "none"
                }
              ]}
              source={rightIcon}
              resizeMode="contain"
            />
          )}
          <Image
            style={[
              styles.rightArrowStyle,
              {
                display: showArrow ? "flex" : "none"
              }
            ]}
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
  },
  leftContaierStyle: { flexDirection: "row", alignItems: "center" },
  leftIconStyle: { width: 23, height: 23, marginLeft: 9, marginRight: 12 },
  rightIconStyle: {
    height: 20,
    width: 20,
    marginLeft: 7
  },
  rightArrowStyle: {
    width: 6,
    height: 10,
    marginLeft: 10
  }
});
