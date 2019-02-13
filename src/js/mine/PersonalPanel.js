import React, { Component } from "react";
import { View, Text, Image } from "react-native";

export default class PersonalPanel extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { name, phoneNumber, avaterUrl } = this.props;
    const avater = avaterUrl
      ? { uri: avaterUrl }
      : require("../../res/img/icon_default_avater.png");
    return (
      <View
        style={{
          marginBottom: 21,
          flexDirection: "row",
          alignContent: "flex-start",
          justifyContent: "space-between"
        }}
      >
        <Image
          style={{ height: 57, width: 57, marginRight: 21, marginLeft: 24 }}
          source={avater}
        />

        <View
          style={{
            width: 280,
            flexDirection: "column",
            justifyContent: "space-between"
          }}
        >
          <Text style={{ color: "white", fontSize: 15, marginTop: 5 }}>
            {name ? name : "请登录"}
          </Text>
          <Text style={{ color: "white", fontSize: 15, marginBottom: 5 }}>
            {phoneNumber}
          </Text>
        </View>
        <Image
          style={{ width: 10, marginRight: 21, marginTop: 16 }}
          source={require("../../res/img/icon_left_arrow.png")}
        />
      </View>
    );
  }
}
