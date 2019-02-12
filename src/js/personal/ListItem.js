import React, { Component } from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default class ListItem extends Component {
  render() {
    return (
      <View
        style={{
          height: 45,
          flex: 1,
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Text>key</Text>
        <TouchableOpacity>
          <Text>value</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
