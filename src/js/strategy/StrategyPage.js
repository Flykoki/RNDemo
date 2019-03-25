import React, { Component, PureComponent } from "react";
import {
  View,
  Text,
  Image,
  StatusBar,
  Dimensions,
  PanResponder,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import BannerView from "../component/BannerView";
import { RootView } from "../component/CommonView";
import { PullFlatList } from "urn-pull-to-refresh";
// import { PullFlatList, PullView } from "react-native-rk-pull-to-refresh";
import { FetchUtils } from "sz-network-module";
import StrategyHelper from "./StrategyHelper";

let _navigation;
const screenWidth = Dimensions.get("window").width;
let _statusBarHeight;
export default class StrategyPage extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    _navigation = navigation;
    return {
      title: "咨询攻略",
      header: null,
      headerTitleStyle: { flex: 1, textAlign: "center" }
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      infomationUnreadCount: 0, //神州资讯未读数量
      marketingUnreadCount: 0, //营销的资讯未读数量
      policyUnreadCount: 0, //政策的资讯未读数量
      status: "loading",
      showFoot: 0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
      isRefreshing: false, //下拉控制
      showType: 0, //页面展示类型。 0：默认加载中，1，加载完成，显示数据，2，加载失败显示失败页面
      dataSource: [], //
      refreshEnable: true, //是否支持下拉刷新，解决banner左右滑动时与 pullFlatList冲突
      bannerDisplayList: [], //头部banner数据源
      hotDisplayList: {}, //热门活动数据源
      latestPublishList: [], //最新发布数据源

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
          key: "新闻资讯",
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
      ],
      errorMsg: "加载失败"
    };
  }

  componentDidMount() {
    this._navListener = this.props.navigation.addListener("willFocus", () => {
      console.log("lfj currentHeight", StatusBar.currentHeight);
      _statusBarHeight = StatusBar.currentHeight;
      StatusBar.setBarStyle("dark-content");
      StatusBar.setBackgroundColor("#FFFFFF");
      // StatusBar.setBackgroundColor("transparent");
      // StatusBar.setTranslucent(true); //是否沉浸式

      this._fetchData();
    });

    this._panResponder = PanResponder.create({
      // 要求成为响应者：
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        // 开始手势操作。给用户一些视觉反馈，让他们知道发生了什么事情！
        // gestureState.{x,y} 现在会被设置为0
      },
      onPanResponderMove: (evt, gestureState) => {
        // 最近一次的移动距离为gestureState.move{X,Y}
        // 从成为响应者开始时的累计手势移动距离为gestureState.d{x,y}
      },
      onPanResponderTerminationRequest: (evt, gestureState) => false,
      onPanResponderRelease: (evt, gestureState) => {},
      onPanResponderTerminate: (evt, gestureState) => {
        // 另一个组件已经成为了新的响应者，所以当前手势将被取消。
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // 返回一个布尔值，决定当前组件是否应该阻止原生组件成为JS响应者
        // 默认返回true。目前暂时只支持android。
        return true;
      }
    });
  }
  componentWillUnmount = () => {
    this._navListener.remove();
  };

  render() {
    console.log("lfj render strategy");
    return (
      <RootView
        style={{ flex: 1, backgroundColor: "#F8F8F8" }}
        status={this.state.status}
        failed={{
          tips: this.state.errorMsg,
          onPress: () => {
            this.setState({ status: "loading" });
            this._fetchData();
          },
          btnText: "重新加载"
        }}
        custom={this._getCustomView()}
      />
    );
  }

  _getCustomView = () => {
    let showBanner =
      this.state.bannerDisplayList && this.state.bannerDisplayList.length > 0;
    return (
      <View
        style={
          showBanner
            ? { height: "100%" }
            : { height: "100%", marginTop: _statusBarHeight }
        }
      >
        <PullFlatList
          ref={c => (this.pull = c)}
          isContentScroll={true}
          refreshable={this.state.refreshEnable}
          // style={{ flex: 1, width: screenWidth }}
          onPullRelease={this._onPullRelease}
          data={this.state.dataSource}
          topIndicatorHeight={50}
          refreshing={this.state.isRefreshing}
          onStartShouldSetPanResponderCapture={e => true}
          onMoveShouldSetPanResponderCapture={e => true}
          renderItem={({ item, index, separators }) => this._renderItem(item)}
          onTouchStart={e => {
            this.pageX = e.nativeEvent.pageX;
            this.pageY = e.nativeEvent.pageY;
          }}
          onTouchMove={e => {
            console.log("lfj full list onTouchMove");
            if (
              Math.abs(this.pageY - e.nativeEvent.pageY) >
              Math.abs(this.pageX - e.nativeEvent.pageX)
            ) {
              //下拉
              this.setState({ refreshEnable: true });
            } else {
              //左右
              this.setState({ refreshEnable: false });
            }
          }}
        />
      </View>
    );
  };
  //返回footer
  _renderFooter = () => {};
  //滑动到底部
  _onEndReached = () => {};
  //下拉释放回调
  _onPullRelease = () => {
    this.setState({
      isRefreshing: true //tag,下拉刷新中，加载完全，就设置成flase
    });
    this._fetchData();
  };

  _fetchData = () => {
    //一：获取资讯列表queryExhibitionList
    StrategyHelper.queryExhibitionList(
      this._onQueryExhibitionListSuccess.bind(this),
      this._onQueryExhibitionListError.bind(this),
      this._onQueryExhibitionListFinally.bind(this)
    );

    // 二：获取用户未读资讯数量
    StrategyHelper.getInformationUnreadCount(
      this._onGetInformationUnreadCountSuccess.bind(this),
      this._onGetInformationUnreadCountError.bind(this),
      this._onGetInformationUnreadCountFinally.bind(this)
    );
  };

  //获取用户未读资讯数量成功
  _onGetInformationUnreadCountSuccess = response => {
    console.log("lfj 获取未读数量:", response);
    this.setState({
      policyUnreadCount: response.policyUnreadCount,
      infomationUnreadCount: response.infomationUnreadCount,
      marketingUnreadCount: response.marketingUnreadCount
    });
  };
  //获取用户未读资讯数量失败
  _onGetInformationUnreadCountError = error => {
    this.setState({
      errorMsg: error.msg,
      status: "loadingFailed",
      isRefreshing: false
    });
  };
  //获取用户未读资讯数量
  _onGetInformationUnreadCountFinally = () => {
    this.pull && this.pull.finishRefresh();
  };

  //获取资讯攻略成功回调
  _onQueryExhibitionListSuccess = response => {
    console.log("资讯攻略 success = ", response);
    let content = response;
    let operationBannerDisplayList = content.operationBannerDisplayList; //banner list
    let operationHotDisplay = content.operationHotDisplayList[0]; //热门活动
    let operationInfoList = content.operationInfoList; //最新发布
    let tempData = [];
    tempData.push({
      key: "banner",
      data: operationBannerDisplayList
        ? operationBannerDisplayList
        : this.state.bannerDisplayList
    }); //banner图片
    tempData.push({ key: "strategy", data: this.state.infos }); //业务入口
    tempData.push({
      key: "hot",
      data: operationHotDisplay
        ? operationHotDisplay
        : this.state.hotDisplayList
    }); //热门活动
    tempData.push({
      key: "publish",
      data: operationInfoList ? operationInfoList : this.state.latestPublishList
    }); //热门活动

    this.setState({
      dataSource: tempData,
      status: "custom",
      hotDisplayList: operationHotDisplay,
      latestPublishList: operationInfoList,
      bannerDisplayList: operationBannerDisplayList,
      isRefreshing: false
    });
  };
  //获取资讯攻略失败回调
  _onQueryExhibitionListError = error => {
    console.log("资讯攻略.js error = ", error);
    this.setState({
      errorMsg: error.msg,
      status: "loadingFailed",
      isRefreshing: false
    });
  };
  //获取资讯攻略finally回调
  _onQueryExhibitionListFinally = () => {
    this.pull && this.pull.finishRefresh();
  };

  _renderItem = item => {
    let data = item.data;
    switch (item.key) {
      case "banner":
        return (
          data &&
          data.length > 0 && (
            <View style={{ flex: 1, marginBottom: 10 }}>
              <BannerView
                data={data}
                onBannerItemPress={onBannerItemPress =>
                  this._onBannerPress(onBannerItemPress)
                }
                onTouchMove={e => console.log("lfj banner onTouchMove ")}
                // onStartShouldSetPanResponderCapture={e => true}
                // onStartShouldSetPanResponder={e => true}
                // onMoveShouldSetPanResponder={e => true}
                // onMoveShouldSetPanResponderCapture={e => true}
                // onPanResponderTerminationRequest={e => true}
                // {...this._panResponder.panHandlers}
              />
            </View>
          )
        );
        break;
      case "strategy":
        return (
          <View
            style={[
              styles.strategyList
              // ,
              // this.state.bannerDisplayList.length == 0
              //   ? { marginTop: StatusBar.currentHeight }
              //   : {}
            ]}
          >
            {this._renderStrategyList(data)}
          </View>
        );
        break;
      case "publish":
        return (
          <View style={{ marginBottom: 10 }}>
            {this._renderLatestPublishHeader()}
            {this._renderLatestPublishItem(data)}
          </View>
        );
        break;
      case "hot":
        return (
          data.banner !== undefined && (
            <TouchableOpacity
              onPress={() => {
                this._onHotDisplayPress(data);
              }}
            >
              <Image
                style={styles.topBusiness}
                resizeMode={"stretch"}
                source={
                  data.banner !== undefined
                    ? { uri: data.banner }
                    : require("../../res/img/app_strategy_banner.png")
                }
              />
            </TouchableOpacity>
          )
        );
        break;

      default:
        break;
    }
  };
  _onBannerPress = item => {};
  _onHotDisplayPress = data => {
    _navigation.navigate("PolicyDetail", { data: data });
  };
  _keyExtractor = (item, index) => {
    return item.key;
  };

  _renderStrategyList = dataArray => {
    return dataArray.map((item, index) => {
      return this._renderStrategyListItem({ item });
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
  _renderLatestPublishItem = itemArray => {
    return itemArray.map((item, index, itemArray) => {
      return (
        <View style={{ flex: 1, flexDirection: "column" }}>
          <TouchableOpacity
            style={styles.latestPublishIemWithShadow}
            onPress={() => {
              console.warn("lfj publish", item);
              StrategyHelper.readInformation(
                item.infoId,
                response => this._onReadInformationSuccess(response),
                error => this._onReadInformationError(error),
                () => this._onReadInformationFinally()
              );
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
                item.banner.length > 0
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
              <View
                style={{
                  marginTop: 16,
                  marginLeft: 15,
                  marginRight: 19,
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center"
                }}
              >
                {item.readStatus == 0 && (
                  <Image
                    style={{ width: 8, height: 8, marginRight: 1 }}
                    resizeMode={"contain"}
                    source={require("../../res/img/icon_app_unread_count.png")}
                  />
                )}
                <Text style={styles.latestPublishIemTitle}>{item.title}</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  marginLeft: 15,
                  marginRight: 19
                }}
              >
                {this._getBusinessLineTag(item.businessLine)}
                {this._getConsultingType(item.consultingType)}
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
          {index != itemArray.length - 1 && (
            <View
              style={{
                backgroundColor: "#E3E3E3",
                height: 0.5,
                marginLeft: 17,
                marginRight: 13
              }}
            />
          )}
        </View>
      );
    });
  };

  _onReadInformationSuccess = response => {};
  _onReadInformationError = error => {};
  _onGetInformationUnreadCountFinally = () => {};

  _getBusinessLineTag = businessLine => {
    if (businessLine) {
      businessLine = businessLine + "";
      let array = businessLine.includes(";")
        ? businessLine.split(";")
        : [businessLine];
      return array.map((item, index, array) => {
        let img;
        switch (item) {
          case "1":
            img = require("../../res/img/icon_app_strategy_4s_finance.png");
            break;
          case "3":
            img = require("../../res/img/icon_app_mine_label_finance_distribution.png");
            break;
          case "4":
            img = require("../../res/img/icon_app_mine_label_car_supply.png");
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
    } else {
      return null;
    }
  };
  _getConsultingType = type => {
    type = type + "";
    let array = type.includes(";") ? type.split(";") : [type];
    return array.map((item, index, array) => {
      let img;
      switch (item) {
        case "0":
          img = require("../../res/img/icon_app_info_label_policy_statement.png");
          break;
        case "1":
          img = require("../../res/img/icon_app_info_label_marketing_strategy.png");
          break;
        case "2":
          img = require("../../res/img/icon_app_info_label_sz_information.png");
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

  _renderStrategyListItem = ({ item }) => {
    return (
      <TouchableOpacity
        key={item.key}
        style={styles.strategyListItem}
        onPress={() => this._onStrategyListItemPress(item)}
      >
        <View>
          <Image
            key={item.key}
            resizeMode={"contain"}
            style={styles.strategyListItemImg}
            source={item.icon}
          />
          {this._getUnReadCountView(item)}
        </View>
        <Text style={styles.strategyListItemText}>{item.key}</Text>
      </TouchableOpacity>
    );
  };

  _getUnReadCountView = item => {
    switch (item.key) {
      case "政策公告":
        return this.state.policyUnreadCount != 0 && this._renderUnReadView();
        break;
      case "营销攻略":
        return this.state.marketingUnreadCount != 0 && this._renderUnReadView();
        break;
      case "新闻资讯":
        return (
          this.state.infomationUnreadCount != 0 && this._renderUnReadView()
        );
        break;
      default:
        break;

        return <View />;
    }
  };

  _renderUnReadView = () => {
    return (
      <Image
        style={{ position: "absolute", right: 0, top: 0, height: 8, width: 8 }}
        resizeMode={"contain"}
        source={require("../../res/img/icon_app_unread_count.png")}
      />
    );
  };

  _onStrategyListItemPress = item => {
    // 0政策公告1营销攻略2神州资讯
    switch (item.key) {
      case "政策公告":
        _navigation.navigate("PolicyList", { data: 0 });
        break;
      case "营销攻略":
        _navigation.navigate("PolicyList", { data: 1 });
        break;
      case "新闻资讯":
        _navigation.navigate("PolicyList", { data: 2 });
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
    color: "#333333"
  },
  latestPublishTitle: {
    width: screenWidth,
    height: 51.5,
    backgroundColor: "#FFFFFF",
    color: "#333333",
    fontSize: 16,
    paddingLeft: 19,
    textAlignVertical: "center",
    textAlign: "left"
  },
  topBusiness: {
    height: 80,
    width: screenWidth,
    marginBottom: 10
  },

  strategyList: {
    marginBottom: 10,
    width: screenWidth,
    flex: 1,
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
