import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  StatusBar
} from "react-native";

export default class FeedbackScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "意见反馈",
      headerRight: <View />,
      headerLeft: (
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={styles.backButtonStyle}
        >
          <Image source={require("../../res/img/icon_back.png")} />
        </TouchableOpacity>
      )
    };
  };
  render() {
    return (
      <View>
        <StatusBar barStyle="dark-content" backgroundColor="white" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    justifyContent: "space-between",
    flexDirection: "column"
  },
  loginOutStyle: {
    height: 39,
    marginLeft: 14,
    marginRight: 14,
    marginBottom: 21,
    borderRadius: 3,
    backgroundColor: "#F12E49",
    alignItems: "center",
    justifyContent: "center"
  },
  loginOutTextStyle: {
    color: "white",
    textAlign: "center"
  },
  backButtonStyle: { marginLeft: 20, width: 50 }
});
