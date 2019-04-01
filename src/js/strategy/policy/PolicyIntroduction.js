import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  StatusBar,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ToastAndroid,
  Dimensions
} from "react-native";
import { FetchUtils } from "sz-network-module";

let _navigation;
export default class PolicyIntroduction extends Component {
  static navigationOptions = ({ navigation }) => {
    _navigation = navigation;
    return {
      title: "业务介绍",
      headerTitleStyle: { flex: 1, textAlign: "center" },
      headerRight: <View />,
      headerLeft: (
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={styles.backButtonStyle}
        >
          <Image
            source={require("../../../res/img/icon_back.png")}
            resizeMode={"contain"}
            style={{ height: 14.6, width: 8.3 }}
          />
        </TouchableOpacity>
      )
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      uri: "", //业务介绍跳转uri 到后台获取
      data: [
        {
          icon: require("../../../res/img/icon_app_icon_4s_finance.png"),
          title: "宝沃新零售",
          content:
            "宝沃汽车为新零售合作伙伴提供线索引流、车源、金融方案、车辆交付、售后服务等全方位支持，最终实现与新零售合作伙伴合作共赢"
        }
      ]
    };
  }

  componentWillMount() {
    //设置statusbar样式
    this._navListener = this.props.navigation.addListener("didFocus", () => {
      StatusBar.setTranslucent(false); //关闭沉浸式
      StatusBar.setBarStyle("dark-content");
      StatusBar.setBackgroundColor("#FFFFFF");
    });
    this._getAppConfig();
  }

  componentWillUnmount = () => {
    this._navListener.remove();
  };

  render() {
    return (
      <FlatList
        style={{ flex: 1, flexDirection: "column", backgroundColor: "#F8F8F8" }}
        renderItem={this._renderItem}
        data={this.state.data}
      />
    );
  }

  _renderItem = ({ item }) => {
    return (
      <View style={{ flexDirection: "column", backgroundColor: "white" }}>
        <TouchableOpacity
          style={styles.touchableOpacity}
          onPress={() => {
            this._onPress();
          }}
        >
          <Image
            style={styles.leftImg}
            resizeMode={"contain"}
            source={item.icon}
          />
          <View style={{ flex: 1, flexDirection: "column" }}>
            <Text style={{ color: "#333333", fontSize: 16 }}>{item.title}</Text>
            <Text style={{ color: "#999999", fontSize: 12 }}>
              {item.content}
            </Text>
          </View>
          <Image
            style={{ height: 9.3, width: 5.3, marginLeft: 20, marginRight: 20 }}
            resizeMode={"contain"}
            source={require("../../../res/img/icon_left_arrow_black.png")}
          />
        </TouchableOpacity>
        <View style={styles.divider} />
      </View>
    );
  };

  _onPress = () => {
    if (this.state.uri && this.state.uri.length > 0) {
      _navigation.navigate("PolicyDetail", {
        data: {
          linkAddress: this.state.uri
        },
        title: "宝沃汽车新零售全国招商"
      });
    } else {
      ToastAndroid.show("系统异常 请稍后再试", ToastAndroid.SHORT);
    }
  };

  _getAppConfig = () => {
    FetchUtils.fetch({
      customCid: "650100",
      params: { code: 1 },
      api: "action/common/getAppConfig",
      success: response => this._onSuccess(response),
      error: err => this._onError(err),
      final: () => this._onFinally()
    });
  };
  _onSuccess = response => {
    this.state.uri = response.value;
  };

  _onError = error => {
    console.log("_getAppConfig onError", error);
  };

  _onFinally = () => {};
}

const styles = StyleSheet.create({
  divider: {
    backgroundColor: "#E5E5E5",
    height: 0.5,
    width: "100%",
    marginLeft: 14
  },
  leftImg: { height: 30, width: 25, marginLeft: 17, marginRight: 14 },
  backButtonStyle: { marginLeft: 20, width: 50 },
  touchableOpacity: {
    height: 90,
    width: "100%",
    flexDirection: "row",
    alignItems: "center"
  }
});
