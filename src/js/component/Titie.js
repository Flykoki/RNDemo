import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Image } from "react-native";

export function titleOptions({ navigation, title }) {
  return {
    title: title,
    headerRight: <View />,
    headerLeft: (
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
        style={styles.backButtonStyle}
      >
        <Image
        style={{ height: 14.6, width: 8.3 }}
          source={require("../../res/img/icon_back.png")}
          resizeMode="cover"
        />
      </TouchableOpacity>
    )
  };
}

const styles = StyleSheet.create({
  backButtonStyle: {
    marginLeft: 20,
    width: 50,
    height: 50,
    flex: 1,
    justifyContent: "center"
  }
});
