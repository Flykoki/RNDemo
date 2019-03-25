import React, { PureComponent } from "react";
import {
  View,
  Text,
  Image,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TouchableNativeFeedback,
  Dimensions
} from "react-native";
// import { PullFlatList } from "react-native-rk-pull-to-refresh";
import { PullFlatList } from "urn-pull-to-refresh";
import StrategyHelper from "../StrategyHelper";
import { FetchUtils } from "sz-network-module";
import { RootView } from "../../component/CommonView";

const width = Dimensions.get("window").width;
const topIndicatorHeight = 50;
let _navigation;
let type = 0;
export class PolicyList extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      title: PolicyList._getTitle(navigation),
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
    _navigation = this.props.navigation;
    this.state = {
      page: 1, //当前第几页
      pageSize: 10, //每页记录条数
      isLastPage: false, //是否是最后一页
      //网络请求状态
      status: "loading",
      errorMsg: "加载失败",
      dataArray: [],
      showFoot: 0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
      isRefreshing: false //下拉控制
    };
    // this._onPress.bind(this);
  }

  componentDidMount() {
    //设置statusbar样式
    this._navListener = this.props.navigation.addListener("willFocus", () => {
      StatusBar.setTranslucent(false); //关闭沉浸式
      StatusBar.setBarStyle("dark-content");
      StatusBar.setBackgroundColor("#FFFFFF");
      this.fetchData();
    });
  }

  componentWillUnmount = () => {
    this._navListener.remove();
  };

  render() {
    return (
      <RootView
        status={this.state.status}
        failed={{
          tips: this.state.errorMsg,
          onPress: () => {
            this.fetchData();
          },
          btnText: "重新加载"
        }}
        custom={this._renderData()}
      />
    );
  }

  // ======================================= 自定义方法 =======================================

  static _getTitle(navigation) {
    switch (navigation.getParam("data")) {
      case 0:
        type = 0;
        return "政策公告";
        break;
      case 1:
        type = 1;
        return "营销攻略";
        break;

      case 2:
        type = 2;
        return "新闻资讯";
        break;

      default:
        break;
    }
  }

  //加载数据显示FlatList
  _renderData() {
    return (
      <PullFlatList
        ref={c => (this.pull = c)}
        isContentScroll={true}
        style={{ flex: 1, width: width, backgroundColor: "#F8F8F8" }}
        onPullRelease={this._onPullRelease}
        data={this.state.dataArray}
        onEndReached={this._onEndReached}
        ListFooterComponent={this._renderFooter}
        refreshing={this.state.isRefreshing}
        renderItem={this._renderItemView.bind(this)}
        ItemSeparatorComponent={() => (
          <View style={{ flex: 1, height: 0.5, backgroundColor: "#cbcbcb" }} />
        )}
      />
    );
  }
  //刷新时
  _handleRefresh = () => {
    this.state.page = 1;
    this.state.isRefreshing = true;
    this.fetchData();
  };
  //滑动到底部
  _onEndReached = () => {
    //如果是正在加载中或没有更多数据了，则返回
    if (this.state.showFoot != 0) {
      return;
    }
    //如果当前页大于或等于总页数，那就是到最后一页了，返回
    if (this.state.page != 1 && this.state.isLastPage) {
      return;
    } else {
      this.state.page++;
    }
    //底部显示正在加载更多数据
    this.setState({ showFoot: 2 });
    //获取数据，在componentDidMount()已经请求过数据了
    if (this.state.page > 1) {
      this.fetchData();
    }
  };

  //返回footer
  _renderFooter = () => {
    if (this.state.showFoot === 1) {
      return (
        <View
          style={{
            backgroundColor: "#F8F8F8",
            flexDirection: "row",
            marginTop: 20,
            justifyContent: "flex-start",
            alignItems: "center"
          }}
        >
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: "#DADADF",
              marginLeft: 15,
              marginRight: 11
            }}
          />
          <Text
            style={{
              color: "#999999",
              width: 50,
              fontSize: 14,
              textAlign: "center"
            }}
          >
            到底啦
          </Text>
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: "#DADADF",
              marginLeft: 11,
              marginRight: 15
            }}
          />
        </View>
      );
    } else if (this.state.showFoot === 2) {
      console.log("lfj showfoot===2");
      return (
        <View style={styles.footer}>
          <ActivityIndicator />
          <Text>正在加载更多数据...</Text>
        </View>
      );
    } else if (this.state.showFoot === 0) {
      console.log("lfj showfoot===0");
      return (
        <View style={styles.footer}>
          <Text />
        </View>
      );
    }
  };

  //下拉释放回调
  _onPullRelease = () => {
    this._handleRefresh();
  };

  //item 点击事件
  _onPress = item => {
    console.log("policylist item onpress", item);
    const ret = _navigation.navigate("PolicyDetail");
    console.log("policylist item onpress result:", ret);
  };
  _onReadInformationSuccess = response => {};
  _onReadInformationError = error => {};
  _onGetInformationUnreadCountFinally = () => {};
  //init itemView
  _renderItemView({ item }) {
    //跳转并传值
    return (
      <TouchableNativeFeedback
        onPress={() => {
          StrategyHelper.readInformation(
            item.infoId,
            response => this._onReadInformationSuccess(response),
            error => this._onReadInformationError(error),
            () => this._onReadInformationFinally()
          );
          _navigation.navigate("PolicyDetail", { data: item });
        }}
      >
        <View style={styles.flatListItemWithShadow}>
          <Image
            style={{
              width: 100,
              height: 90,
              marginLeft: 15,
              marginTop: 16,
              marginBottom: 15.6
            }}
            source={
              item.banner !== undefined
                ? { uri: item.banner }
                : require("../../../res/img/swiper_1.jpg")
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
                  style={{ width: 8, height: 8, marginRight: 2 }}
                  resizeMode={"contain"}
                  source={require("../../../res/img/icon_app_unread_count.png")}
                />
              )}
              <Text style={styles.title}>{item.title}</Text>
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
        </View>
      </TouchableNativeFeedback>
    );
  }

  //获取数据
  fetchData() {
    FetchUtils.fetch({
      params: {
        pageIndex: this.state.page,
        pageSize: this.state.pageSize,
        type: type
      },
      api: "action/cmt/queryInformationList",
      success: content => {
        console.log("公告列表 success = ", content);
        let dataList = content.dataList; //dataList
        let foot = 0;
        let lastPage = false;
        //返回的数据小于pageSize表明最后一页了
        if (dataList.length < this.state.pageSize) {
          lastPage = true; //最后一页
          foot = 1; //listView底部显示没有更多数据了
        }

        //如果是下拉刷新就清空数据源
        if (this.state.isRefreshing) {
          console.log("lfj refershing clear data");
          this.state.dataArray = [];
        }

        this.setState({
          //复制数据源
          dataArray: this.state.dataArray.concat(dataList),
          // dataArray: dataList,
          showFoot: foot,
          isRefreshing: false,
          isLastPage: lastPage,
          status: "custom"
        });
      },
      error: err => {
        console.log("公告列表.js error = ", err);
        this.setState({
          errorMsg: err.msg,
          status: "loadingFailed",
          isRefreshing: false
        });
      },
      final: () => {
        console.log("公告列表 final");
        this.pull && this.pull.finishRefresh();
      }
    });
  }

  _getBusinessLineTag(businessLine) {
    if (businessLine) {
      businessLine = businessLine + "";
      let array = businessLine.includes(";")
        ? businessLine.split(";")
        : [businessLine];
      return array.map((item, index, array) => {
        let img;
        switch (item) {
          case "1":
            img = require("../../../res/img/app_mine_label_4s_finance.png");
            break;
          case "3":
            img = require("../../../res/img/icon_app_mine_label_finance_distribution.png");
            break;
          case "4":
            img = require("../../../res/img/icon_app_mine_label_car_supply.png");
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
  }
  _getConsultingType = type => {
    type = type + "";
    let array = type.includes(";") ? type.split(";") : [type];
    return array.map((item, index, array) => {
      let img;
      switch (item) {
        case "0":
          img = require("../../../res/img/icon_app_info_label_policy_statement.png");
          break;
        case "1":
          img = require("../../../res/img/icon_app_info_label_marketing_strategy.png");
          break;
        case "2":
          img = require("../../../res/img/icon_app_info_label_sz_information.png");
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
  // ======================================= 自定义方法 =======================================
}

const styles = StyleSheet.create({
  backButtonStyle: { marginLeft: 20, width: 50 },
  hide: {
    position: "absolute",
    left: 10000
  },
  show: {
    position: "relative",
    left: 0,
    backgroundColor: "transparent"
  },
  container: {
    padding: 10,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  title: {
    fontSize: 16,
    color: "#333333"
  },
  footer: {
    flexDirection: "row",
    flex: 1,
    marginTop: 20,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10
  },
  content: {
    marginBottom: 8,
    marginLeft: 8,
    marginRight: 8,
    fontSize: 12,
    color: "black"
  },
  flatListItemWithShadow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    backgroundColor: "white"
  },
  flatListContain: {
    backgroundColor: "#F8F8F8"
  }
});
