import React, { Component } from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StatusBar,
  StyleSheet
} from "react-native";

import SortWithFilterView from "../component/SortWithFilterView";

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
          <Image source={require("../../res/img/icon_back.png")} />
        </TouchableOpacity>
      )
    };
  };

  constructor(props) {
    super(props);
    this.state = { sortDataIndex: 0 };
  }

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
    return (
      <SortWithFilterView
        onSortDataSelectedCallback={(item, index) => {
          //排序item点击事件
          console.log("lfj sortData callback");
        }}
        sortDataIndex={this.state.sortDataIndex}
        sortDataObj={{
          sortData: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
          index: 1
        }}
      />
    );
  }
}
const styles = StyleSheet.create({
  backButtonStyle: { marginLeft: 20, width: 50 }
});
