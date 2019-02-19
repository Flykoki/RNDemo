import React, { PureComponent } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TouchableNativeFeedback,
  Dimensions
} from "react-native";
import { fetchRequest } from "../utils/FetchUtil";
import { PullFlatList } from "react-native-rk-pull-to-refresh";
import reactNavigation from "react-navigation";
const width = Dimensions.get("window").width;
const topIndicatorHeight = 50;
let _navigation;
let imageUrlIndex = 0;
export class PolicyDetail extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "政策公告详情",
      headerTitleStyle: { flex: 1, textAlign: "center" },
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
  componentDidMount() {
    //设置statusbar样式
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
      <Text style={{ justifyContent: "center", textAlign: "center" }}>
        政策公告详情
      </Text>
    );
  }
}
