import React, { Component, PureComponent } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StatusBar,
  Platform,
  Dimensions,
  BackHandler,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import { fetchRequest } from "../utils/FetchUtil";
import { PullFlatList } from "urn-pull-to-refresh";
// import { PullFlatList } from "react-native-rk-pull-to-refresh";
import FilterView from "../component/FilterView";
import MissionItemView from "../component/MissionItemView";
import SortWithFilterView from "../component/SortWithFilterView";
import { RootView, LoadingView, LoadFailedView } from "../component/CommonView";
import AccountHelper from "../login/AccountHelper";
import MissionCenterHelper from "./MissionCenterHelper";

let _navigation;
let imageUrlIndex = 0;
const width = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const topIndicatorHeight = 30;
export class MissionsCenterPage extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "全部任务",
      headerLeft: (
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={styles.backButtonStyle}
        >
          <Image
            source={require("../../res/img/icon_back.png")}
            resizeMode={"contain"}
            style={{ height: 14.6, width: 8.3 }}
          />
        </TouchableOpacity>
      ),
      headerRight: (
        <TouchableOpacity
          onPress={() => {
            //todo 弹出搜索框
            _navigation.navigate("SearchViewPage");
          }}
          style={styles.searchButtonStyle}
        >
          <Image
            resizeMode={"contain"}
            style={{ height: 20, width: 20, paddingRight: 20 }}
            source={require("../../res/img/icon_app_search.png")}
          />
        </TouchableOpacity>
      )
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      pageSize: 10,
      pageCount: 0,
      isLoading: true,
      accountInfo: {}, //用户信息
      isLastPage: false,
      updatePanelState: 0,
      searchResponseData: [],
      selectedItem: {},
      status: "loading",
      errorMsg: "加载失败",
      //网络请求状态
      dataArray: [],
      showHeader: 0, //控制header 0:隐藏 1：显示加载中
      showFoot: 0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
      isRefreshing: false //下拉控制
    };
    _navigation = this.props.navigation;
    this.sortDataIndex = 0; //排序选中item
    this.sortDataLabel = "新建事件倒序"; //排序label，默认倒序
    this.filterResponse = []; //筛选结果
    this.filterResponseCallback; //筛选结果回调，通知filterView button 接触loading动画展示筛选结果条目
    this.normalFilterItems = new Map(); //筛选内容
    this.topClickViewHight = 46; //头部条件选择高度
  }
  componentDidMount() {
    this._navListener = this.props.navigation.addListener("didFocus", () => {
      StatusBar.setTranslucent(false); //关闭沉浸式
      StatusBar.setBarStyle("dark-content");
      StatusBar.setBackgroundColor("#FFFFFF");
    });
    AccountHelper.accountInfo
      ? (this.state.accountInfo = AccountHelper.accountInfo) &&
        this.fetchData(this.normalFilterItems)
      : AccountHelper.getAccountInfo().then(data => {
          console.log("lfj getAccountInfo", data);
          this.state.accountInfo = data;
          this.fetchData(this.normalFilterItems);
        });
  }

  componentWillUnmount = () => {
    this._navListener.remove();
  };

  render() {
    //加载数据
    return (
      <View style={styles.flatListContain}>
        <RootView
          style={{ flex: 1, marginTop: this.topClickViewHight }}
          status={this.state.status}
          failed={{
            tips: this.state.errorMsg,
            onPress: () => {
              this.fetchData(this.normalFilterItems);
            },
            btnText: "重新加载"
          }}
          custom={this.renderData()}
        />
        <SortWithFilterView
          style={{ position: "absolute", top: 0, left: 0 }}
          titleItemHight={this.topClickViewHight}
          onSortDataSelectedCallback={(item, index, onBackHandler) => {
            //排序item点击
            this.sortDataIndex = index;
            this.sortDataLabel = index == 0 ? "新建时间正序" : "新建时间倒序";
            createTimeSort = index == 0 ? "ASC" : "DESC";
            this.normalFilterItems.set("createTimeSort", createTimeSort);
            this.fetchData(this.normalFilterItems);
            onBackHandler(); //关闭面板
            this.setState({ status: "loading" });
          }}
          leftTitleText={this.sortDataLabel}
          sortDataObj={{
            sortData: ["新建时间正序", "新建时间倒序"],
            sortDataIndex: 1
          }}
          navigation={_navigation}
          onNormalFilterCallback={(filterMaps, callback) => {
            this.normalFilterItems = filterMaps;
            this.filterResponseCallback = callback; //筛选结果通过此函数回调给view
            this.fetchData(filterMaps);
          }}
          rightTitleText={"筛选"}
          response={this.state.searchResponseData}
          filterData={[
            {
              type: "normal",
              filterMultiple: true,
              title: "状态",
              key: "statusList", //List<Integer>
              items: ["待处理", "处理中", "处理完毕", "已取消"]
            },
            {
              type: "normal",
              title: "参与人",
              filterMultiple: true,
              key: "userType",
              items: ["我"]
            },
            {
              type: "date",
              title: "创建时间",
              filterMultiple: false,
              key: "createDate",
              items: ["今天", "近3天", "近7天", "近15天"]
            },
            {
              type: "customDate",
              title: "完成时间",
              key: "completeDate",
              filterMultiple: false
            },
            {
              type: "customDate",
              title: "取消时间",
              key: "cancelDate",
              filterMultiple: false
            }
          ]}
        />
      </View>
    );
  }
  //=========================== 自定义方法 =========================

  //显示FlatList
  renderData() {
    return (
      <PullFlatList
        ref={c => (this.pull = c)}
        isContentScroll={true}
        topIndicatorHeight={topIndicatorHeight}
        style={{
          height: "100%"
        }}
        onPullRelease={this._onPullRelease}
        data={this.state.dataArray}
        onEndReached={this._onEndReached}
        onEndReachedThreshold={0.1}
        ListFooterComponent={this._renderFooter}
        ListEmptyComponent={this._renderEmpty}
        refreshing={this.state.isRefreshing}
        renderItem={this._renderItemView}
      />
      // <FlatList
      //   style={{ height: "100%" }}
      //   data={this.state.dataArray}
      //   renderItem={this._renderItemView.bind(this)}
      //   ListFooterComponent={this._renderFooter}
      //   ListEmptyComponent={this._renderEmpty}
      //   onEndReached={this._onEndReached.bind(this)}
      //   onEndReachedThreshold={0.1}
      //   // onContentSizeChange={() => {
      //   //   this.isCanLoadMore = true; // flatview内部组件布局完成以后会调用这个方法
      //   // }}
      //   refreshing={this.state.isRefreshing}
      //   onRefresh={this.handleRefresh} //因为涉及到this.state
      //   keyExtractor={this._keyExtractor}
      // />
    );
  }

  //请求后台
  fetchData = filterMaps => {
    //请求接口
    MissionCenterHelper.queryTaskGroupWithFilter(
      filterMaps,
      this.state.accountInfo,
      this.state.pageSize,
      this.state.page,
      this._onQueryTaskGroupWithFilterSuccess.bind(this),
      this._onQueryTaskGroupWithFilterError.bind(this),
      this._onQueryTaskGroupWithFilterFinally.bind(this)
    );
  };

  //请求成功回调
  _onQueryTaskGroupWithFilterSuccess = response => {
    this.filterResponseCallback && this.filterResponseCallback(response.list);
    console.log("missionCenter success = ", response);
    let foot = 0;
    let lastPage = false;
    if (response.total < this.state.pageSize && response.list.length > 0) {
      // if (this.state.page >= data.pageCount) {
      lastPage = true;
      foot = 1; //listView底部显示没有更多数据了
    }

    //如果是下拉刷新就清空数据源
    if (this.state.isRefreshing) {
      this.state.dataArray = [];
    }

    this.setState({
      //复制数据源
      dataArray: this.state.dataArray.concat(response.list),
      isLoading: false,
      showFoot: foot,
      isLastPage: lastPage,
      showHeader: 0,
      isRefreshing: false,
      status: "custom"
    });
  };
  //请求失败回调
  _onQueryTaskGroupWithFilterError = error => {
    this.filterResponseCallback && this.filterResponseCallback([]);
    this.setState({
      errorMsg: error.msg,
      status: "loadingFailed",
      isRefreshing: false
    });
  };

  //请求finally回调
  _onQueryTaskGroupWithFilterFinally = () => {
    this.pull && this.pull.finishRefresh();
  };

  //下拉释放回调
  _onPullRelease = () => {
    this.handleRefresh();
  };
  //key
  _keyExtractor = (item, index) => item.key;

  //返回itemView
  _renderItemView({ item }) {
    return (
      <MissionItemView
        onTaskGroupPress={pressItem => {
          pressItem.sourceCode = item.sourceCode;
          pressItem.taskGroupId = item.taskGroupId;
          pressItem.taskGroupCode = item.taskGroupCode;
          _navigation.navigate("InstallmentSalesOfNewCars", {
            data: pressItem,
            title: item.taskGroupName
          });
        }}
        onTaskListItemPress={dataItem => {
          dataItem.sourceCode = item.sourceCode;
          dataItem.taskGroupId = item.taskGroupId;
          dataItem.taskGroupCode = item.taskGroupCode;
          _navigation.navigate("TaskDetailScreen", {
            data: dataItem
          });
        }}
        missionItem={item}
      />
    );
  }

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
      this.fetchData(this.normalFilterItems);
      this.isCanLoadMore = false; // 加载更多时，不让再次的加载更多
    }
  };

  _renderEmpty = () => {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Image
          style={{ height: 100, width: 110, marginTop: 80 }}
          source={require("../../res/img/icon_load_failed.png")}
          resizeMode={"contain"}
        />
        <Text style={{ color: "#999999", marginTop: 20, fontSize: 15 }}>
          当前暂无数据
        </Text>
      </View>
    );
  };

  //返回footer
  _renderFooter = () => {
    if (this.state.showFoot === 1) {
      return (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            marginTop: 20,
            marginBottom: 20,
            justifyContent: "center",
            flexDirection: "row"
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
              flex: 1,
              color: "#999999",
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
      return (
        <View style={styles.footer}>
          <ActivityIndicator />
          <Text>正在加载更多数据...</Text>
        </View>
      );
    } else if (this.state.showFoot === 0) {
      return (
        <View style={styles.footer}>
          <Text />
        </View>
      );
    }
  };
  //分割线
  _separator() {
    return (
      <View
        style={{
          height: 1,
          backgroundColor: "#E3E3E3",
          marginLeft: 17,
          marginRight: 13
        }}
      />
    );
  }
  //刷新时
  handleRefresh = () => {
    this.setState({
      page: 1,
      showHeader: 1,
      isRefreshing: true //tag,下拉刷新中，加载完全，就设置成flase
    });
    this.fetchData(this.normalFilterItems);
  };
  //加载等待页
  renderLoadingView() {
    return (
      <LoadingView
        style={{
          flex: 1,
          alignContent: "center",
          alignItems: "center",
          paddingTop: 128
        }}
      />
    );
  }
  //加载失败view
  renderErrorView() {
    return (
      <LoadFailedView
        tips={"加载失败"}
        btnText={"重新加载"}
        onPress={this._onLoadFailedButtonPress()}
      />
    );
  }

  /**
   * 加载失败按钮点击事件
   */
  _onLoadFailedButtonPress = () => {
    this._onPullRelease();
  };

  //=========================== 自定义方法 =========================
}

const styles = StyleSheet.create({
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
    marginTop: 16,
    marginRight: 19,
    marginLeft: 15,
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
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
    backgroundColor: "white"
    // shadowColor: "#000",
    // shadowOpacity: 0.8,
    // shadowRadius: 6,
    // elevation: 9,
    // borderRadius: 8
  },
  backButtonStyle: {
    marginLeft: 20,
    flex: 1,
    justifyContent: "center"
  },
  searchButtonStyle: {
    height: 50,
    width: 50,
    alignItems: "center",
    justifyContent: "center"
  },
  filterContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    justifyContent: "space-between"
  },
  filterWholeContainer: {
    // height: "6.7%",
    height: 46,
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    justifyContent: "flex-start"
  },

  filter: {
    flex: 1,
    height: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  filterTextPress: {
    color: "#F12E49",
    fontSize: 14
  },
  filterTextDefault: {
    color: "#333333",
    fontSize: 14
  },
  filterDivider: {
    width: 0.5,
    backgroundColor: "#E5E5E5",
    height: "100%"
  },
  topDivider: {
    backgroundColor: "#F0F0F0",
    height: 1,
    width: "100%"
  },
  filterView: {
    position: "absolute",
    top: 46,
    flex: 1
  },
  flatListContain: {
    backgroundColor: "#F8F8F8",
    flexDirection: "column",
    justifyContent: "flex-start",
    flex: 1
  }
});
