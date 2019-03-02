import React, { Component } from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StatusBar,
  StyleSheet
} from "react-native";

import SortView from "../component/SortView";

export default class MineScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "test",
      headerRight: <View />,
      headerLeft: (
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={styles.backButtonStyle}
        >
          <Image source={require("../../res/img/icon_left_arrow_black.png")} />
        </TouchableOpacity>
      )
    };
  };
  componentDidMount() {
    this._navListener = this.props.navigation.addListener("didFocus", () => {
      StatusBar.setBarStyle("dark-content");
      StatusBar.setBackgroundColor("#FFFFFF");
    });
  }

  componentWillUnmount = () => {
    this._navListener.remove();
  };

  render() {
    return <SortView />;
  }
}
const styles = StyleSheet.create({
  backButtonStyle: { marginLeft: 20, width: 50 }
});
