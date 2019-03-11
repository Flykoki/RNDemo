import React, { Component, PureComponent } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import BannerView from "../component/BannerView";
import ListItem from "../component/ListItem";
import { RootView } from "../component/CommonView";
import { fetchRequest } from "../utils/FetchUtil";

let _navigation;
const screenWidth = Dimensions.get("window").width;

export default class StrategyPage extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    _navigation = navigation;
    return {
      title: "咨询攻略",
      headerTitleStyle: { flex: 1, textAlign: "center" }
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      status: "loading",
      bannerDisplayList: [1, 2, 3, 4], //头部banner数据源
      hotDisplayList: {}, //热门活动数据源
      latestPublishList: [
        {
          key: "1",
          publishTimeStr: "2017/05/25",
          businessLine: "1;2;3",
          title: "神州买买车荣获“2017诚信"
        },
        {
          key: "1",
          publishTimeStr: "2017/05/25",
          businessLine: "1;2",
          title: "神州买买车荣获“2017诚信消费品牌”奖"
        },
        {
          key: "1",
          publishTimeStr: "2017/05/25",
          businessLine: "1",
          title: "神州买买车荣获“2017诚信消费品牌”奖"
        },
        {
          key: "1",
          publishTimeStr: "2017/05/25",
          businessLine: "1;2",
          title: "神州买买车荣获“2017诚信消费品牌”奖"
        },
        {
          key: "1",
          publishTimeStr: "2017/05/25",
          businessLine: "1;2",
          title: "神州买买车荣获“2017诚信消费品牌”奖"
        }
      ], //最新发布数据源

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
          icon: require("../../res/img/app_strategy_business.png")
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
    console.log("lfj componentDidMount");
    this._navListener = this.props.navigation.addListener("didFocus", () => {
      StatusBar.setTranslucent(true); //开启沉浸式
      StatusBar.setBackgroundColor("transparent");
    });

    this._initData();
  }

  render() {
    return (
      <RootView
        style={{ backgroundColor: "#F8F8F8" }}
        status={this.state.status}
        failed={{
          tips: "加载失败",
          onPress: () => {
            this.setState({ status: "custom" });
          },
          btnText: "重新加载"
        }}
        custom={this._getCustomView()}
      />
    );
  }

  _initData = () => {
    setTimeout(() => {
      this.setState({ status: "custom" });
    }, 300);

    this._fetchData();
  };

  _fetchData = () => {
    url = "http://www.wanandroid.com/article/list/" + this.state.page + "/json";
    // url = "http://www.wanandroid.com/article/list/" + '/action/cmt/queryExhibitionList';
    fetchRequest(url, "GET")
      .then(responseData => {
        if (responseData.code == 1) {
          let content = responseData.content;
          let operationBannerDisplayList = content.operationBannerDisplayList; //banner list
          let operationHotDisplay = content.operationHotDisplayList[0]; //热门活动
          let operationInfoList = content.operationInfoList; //最新发布
          this.setState({
            hotDisplayList: operationHotDisplay,
            latestPublishList: operationInfoList,
            bannerDisplayList: operationBannerDisplayList
          });
        } else {
        }
      })
      .catch(error => {
        console.log(error);
        this.setState({
          status: "failed"
        });
      })
      .finally()
      .done();
  };

  _getCustomView = () => {
    return (
      <View style={styles.container}>
        <BannerView
          data={this.state.bannerDisplayList}
          onBannerItemPress={onBannerItemPress =>
            this._onBannerPress(onBannerItemPress)
          }
        />
        <View style={styles.strategyList}>{this._renderStrategyList()}</View>
        <TouchableOpacity
          onPress={() => {
            this._onHotDisplayPress();
          }}
        >
          <Image
            style={styles.topBusiness}
            resizeMode={"stretch"}
            source={
              this.state.hotDisplayList.banner
                ? { uri: this.state.hotDisplayList.banner }
                : require("../../res/img/app_strategy_banner.png")
            }
          />
        </TouchableOpacity>
        <FlatList
          keyExtractor={this._keyExtractor}
          key={this._keyExtractor}
          style={styles.latestPublishList}
          data={this.state.latestPublishList}
          renderItem={this._renderLatestPublishItem}
          ItemSeparatorComponent={this._renderLatestPublishItemSeparator}
          ListHeaderComponent={this._renderLatestPublishHeader}
        />
      </View>
    );
  };
  _onBannerPress = item => {
    console.warn("banner item", item);
  };
  _onHotDisplayPress = () => {
    console.warn("hot display", this.state.hotDisplayList);
  };
  _keyExtractor = (item, index) => {
    return item.key;
  };

  _renderStrategyList = () => {
    return this.state.infos.map((item, index) => {
      return this._renderItem({ item });
    });
  };
  //分割线
  _renderLatestPublishItemSeparator = () => {
    return (
      <View
        style={{
          marginLeft: 17,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 13,
          height: 0.5,
          backgroundColor: "#E3E3E3",
          width: "100%"
        }}
      />
    );
  };

  //最新发布头部控件
  _renderLatestPublishHeader = () => {
    return (
      <View>
        <Text style={styles.latestPublishTitle}>最新发布</Text>
        <View
          style={{ height: 1, backgroundColor: "#E5E5E5", width: screenWidth }}
        />
      </View>
    );
  };
  //最新发布flat item
  _renderLatestPublishItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.latestPublishIemWithShadow}
        onPress={() => {
          _navigation.navigate("PolicyDetail", { data: item });
        }}
      >
        <Image
          style={{
            width: 100,
            height: 90,
            marginLeft: 15,
            marginTop: 16,
            marginBottom: 15.6
          }}
          resizeMode={"stretch"}
          source={
            item.banner
              ? { uri: item.banner }
              : require("../../res/img/swiper_1.jpg")
          }
        />
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between"
          }}
        >
          <Text style={styles.latestPublishIemTitle}>{item.title}</Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              marginLeft: 15,
              marginRight: 19
            }}
          >
            {this._getBusinessLineTag(item.businessLine)}
          </View>
          <Text
            style={{
              marginLeft: 15,
              marginBottom: 15.6
            }}
          >
            {item.publishTimeStr}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  _getBusinessLineTag = businessLine => {
    let array = businessLine.split(";");
    return array.map((item, index, array) => {
      let img;
      switch (item) {
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
          img = require("../../res/img/icon_app_strategy_4s_finance.png");
          break;

        default:
          break;
      }
      return (
        <Image
          style={{ height: 17, width: 50, marginRight: 5 }}
          resizeMode={"stretch"}
          source={img}
        />
      );
    });
  };

  _renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.strategyListItem}
        onPress={() => this._onStrategyListItemPress(item)}
      >
        <Image
          resizeMode={"contain"}
          style={styles.strategyListItemImg}
          source={item.icon}
        />
        <Text style={styles.strategyListItemText}>{item.key}</Text>
      </TouchableOpacity>
    );
  };

  _onStrategyListItemPress = item => {
    _navigation.navigate("PolicyList");
    return;
    switch (item.key) {
      case "政策公告":
        _navigation.navigate("PolicyList");
        break;

      default:
        break;
    }
    console.warn("item press", item);
  };
}
const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: screenWidth,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#F8F8F8"
  },
  banner: {
    width: screenWidth,
    height: 172
  },
  latestPublishIemWithShadow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    backgroundColor: "white"
  },
  latestPublishIemTitle: {
    fontSize: 16,
    marginTop: 16,
    marginRight: 19,
    marginLeft: 15,
    color: "#333333"
  },
  latestPublishTitle: {
    width: screenWidth,
    height: 51.5,
    backgroundColor: "#FFFFFF",
    color: "#333333",
    fontSize: 16,
    marginLeft: 19,
    textAlignVertical: "center",
    textAlign: "left"
  },
  topBusiness: {
    height: 80,
    width: screenWidth,
    marginTop: 10
  },

  strategyList: {
    marginTop: 10,
    width: screenWidth,
    flexWrap: "wrap",
    flexDirection: "row"
  },
  latestPublishList: {
    width: screenWidth,
    marginTop: 10,
    backgroundColor: "#FFFFFF",
    marginBottom: 10
  },
  strategyListItem: {
    width: screenWidth / 3,
    height: 90,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF"
  },
  strategyListItemImg: {
    width: 30,
    height: 30
    // marginTop: 24
  },
  strategyListItemText: {
    color: "#333333",
    marginTop: 8,
    fontSize: 14
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
