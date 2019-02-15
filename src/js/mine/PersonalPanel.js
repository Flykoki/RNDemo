import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

export default class PersonalPanel extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { name, phoneNumber, avaterUrl, onPress } = this.props;
    const avater = avaterUrl
      ? { uri: avaterUrl }
      : require("../../res/img/icon_default_avater.png");
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={onPress}
        activeOpacity={1}
      >
        <Image style={styles.avaterStyle} source={avater} />

        <View style={styles.messagePanelStyle}>
          <Text style={[styles.messageTextStyle, { marginTop: 5 }]}>
            {name ? name : "请登录"}
          </Text>
          <Text style={[styles.messageTextStyle, { marginBottom: 5 }]}>
            {phoneNumber}
          </Text>
        </View>
        <Image
          style={styles.rightArrowStyle}
          source={require("../../res/img/icon_left_arrow.png")}
        />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 21,
    flexDirection: "row",
    alignContent: "flex-start",
    justifyContent: "space-between"
  },
  avaterStyle: { height: 57, width: 57, marginRight: 21, marginLeft: 24 },
  messagePanelStyle: {
    width: "70%",
    flexDirection: "column",
    justifyContent: "space-between"
  },
  messageTextStyle: { color: "white", fontSize: 15 },
  rightArrowStyle: { width: 10, marginRight: 21, marginTop: 16 }
});
