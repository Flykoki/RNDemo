import React, { Component, PureComponent } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  TouchableNativeFeedback,
  StyleSheet
} from "react-native";
import BannerView from "../component/BannerView";
import ListItem from '../component/ListItem';

let _navigation;
const screenWidth = Dimensions.get("window").width;

export default class StrategyPage extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "咨询攻略",
      headerTitleStyle: { flex: 1, textAlign: "center" }
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      infos: [
        {
          key: "政策公告",
          icon: require("../../res/img/app_strategy_policy.png")
        },
        {
          key: "营销攻略",
          icon: require("../../res/img/app_strategy_marketing.png")
        },
        {
          key: "神州资讯",
          icon: require("../../res/img/app_strategy_ucar.png")
        },
        {
          key: "业务介绍",
          icon: require("../../res/img/app_strategy_guide.png")
        },
        {
          key: "操作指南",
          icon: require("../../res/img/app_strategy_guide.png")
        },
        {
          key: "常见问题",
          icon: require("../../res/img/app_strategy_question.png")
        }
      ]
    };
  }
  componentDidMount() {
    this._navListener = this.props.navigation.addListener("didFocus", () => {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor("transparent");
    });
  }

  componentWillUnmount = () => {
    this._navListener.remove();
  };
  render() {
    return (
      <View style={styles.container}>
        <BannerView onBannerItemPress={() => console.warn("banner press")} />
        <FlatList
          data={this.state.infos}
          renderItem={this._renderItem}
          numColumns={3}
        />
      </View>
    );
  }

  _renderItem = ({ item }) => {
      return<Text>{item.key}</Text>
  };
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#F8F8F8"
  },
  banner: {
    width: screenWidth,
    height: 172
  },
  bannerItemShow: { fontSize: 30, color: "green" },
  bannerItemHide: { fontSize: 40, color: "grey" },
  circleWrapperStyle: {
    flexDirection: "row",
    padding: 0,
    backgroundColor: "transparent",
    bottom: 0,
    position: "absolute"
  }
});
