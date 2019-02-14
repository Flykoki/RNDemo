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
export class DetailPage extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "政策公告",
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

  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      pageCount: 0,
      isLoading: true,
      //网络请求状态
      error: false,
      errorInfo: "",
      dataArray: [],
      showHeader: 0, //控制header 0:隐藏 1：显示加载中
      showFoot: 0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
      isRefreshing: false //下拉控制
    };
  }
  componentDidMount() {
    this.fetchData();
  }
  render() {
    console.log(
      "lfj render data",
      this.state.dataArray.length,
      this.state.dataArray
    );
    return (
      <PullFlatList
        ref={c => (this.pull = c)}
        isContentScroll={true}
        onPullStateChangeHeight={this.onPullStateChangeHeight}
        topIndicatorRender={this.topIndicatorRender}
        topIndicatorHeight={topIndicatorHeight}
        style={{ flex: 1, width: width }}
        onPullRelease={this._onPullRelease}
        data={this.state.dataArray}
        renderItem={this._renderItemView}
        ItemSeparatorComponent={() => (
          <View style={{ flex: 1, height: 0.5, backgroundColor: "#cbcbcb" }} />
        )}
      />
    );
  }

  _onPullRelease = () => {
    setTimeout(() => {
      this.pull && this.pull.finishRefresh();
    }, 2000);
  };

  //返回itemView
  _renderItemView({ item }) {
    console.warn("lfj renderItemView:", item);
    //跳转并传值
    return (
      // <TouchableNativeFeedback onPress={() => {Actions.news({'url':item.url})}} >////切记不能带（）不能写成gotoDetails()
      <TouchableNativeFeedback onPress={this._onPress}>
        <View style={styles.flatListItemWithShadow}>
          <Image
            style={{
              width: 100,
              height: 90,
              marginLeft: 15,
              marginTop: 16,
              marginBottom: 15.6
            }}
            source={require("../../res/img/swiper_1.jpg")}
          />
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            <Text>aaaaaaa</Text>
          </View>
        </View>
      </TouchableNativeFeedback>
    );
  }

  //header在不同的pullstate下的展示
  onPullStateChangeHeight = (pullState, moveHeight) => {
    if (pullState == "pulling") {
      this.txtPulling && this.txtPulling.setNativeProps({ style: styles.show });
      this.txtPullok && this.txtPullok.setNativeProps({ style: styles.hide });
      this.txtPullrelease &&
        this.txtPullrelease.setNativeProps({ style: styles.hide });

      //设置img
      this.imgPulling && this.imgPulling.setNativeProps({ style: styles.show });
      this.imgPullok && this.imgPullok.setNativeProps({ style: styles.hide });
      this.imgPullrelease &&
        this.imgPullrelease.setNativeProps({ style: styles.hide });
    } else if (pullState == "pullok") {
      this.txtPulling && this.txtPulling.setNativeProps({ style: styles.hide });
      this.txtPullok && this.txtPullok.setNativeProps({ style: styles.show });
      this.txtPullrelease &&
        this.txtPullrelease.setNativeProps({ style: styles.hide });
      //设置img
      this.imgPulling && this.imgPulling.setNativeProps({ style: styles.hide });
      this.imgPullok && this.imgPullok.setNativeProps({ style: styles.show });
      this.imgPullrelease &&
        this.imgPullrelease.setNativeProps({ style: styles.hide });
    } else if (pullState == "pullrelease") {
      this.txtPulling && this.txtPulling.setNativeProps({ style: styles.hide });
      this.txtPullok && this.txtPullok.setNativeProps({ style: styles.hide });
      this.txtPullrelease &&
        this.txtPullrelease.setNativeProps({ style: styles.show });
      //设置img
      this.imgPulling && this.imgPulling.setNativeProps({ style: styles.hide });
      this.imgPullok && this.imgPullok.setNativeProps({ style: styles.hide });
      this.imgPullrelease &&
        this.imgPullrelease.setNativeProps({ style: styles.show });
    }
  };
  //获取数据
  fetchData() {
    url = "article/list/" + this.state.page + "/json";

    fetchRequest(url, "GET")
      .then(responseData => {
        let data = responseData.data; //获取json 数据并存在data数组中
        let dataBlob = []; //这是创建该数组，目的放存在key值的数据，就不会报黄灯了

        data.datas.map(function(item) {
          if (imageUrlIndex == 499) {
            imageUrlIndex = 0;
          }
          item.key = imageUrls[imageUrlIndex];
          imageUrlIndex++;
          dataBlob.push(item);
        });
        let foot = 0;
        // if (this.state.page >= 5) {
        if (this.state.page >= data.pageCount) {
          foot = 1; //listView底部显示没有更多数据了
        }
        this.setState({
          //复制数据源
          //  dataArray:this.state.dataArray.concat( responseData.results),
          dataArray: this.state.dataArray.concat(dataBlob),
          isLoading: false,
          showFoot: foot,
          showHeader: 0,
          isRefreshing: false,
          pageCount: data.pageCount
        });
        data = null; //重置为空
        dataBlob = null;
      })
      .catch(error => {
        this.setState({
          error: true,
          errorInfo: error
        });
      })
      .done();
  }
  //header view
  topIndicatorRender = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          height: topIndicatorHeight
        }}
      >
        <Image
          style={styles.hide}
          ref={c => (this.imgPulling = c)}
          source={require("../../res/img/icon_arrow_down.png")}
        />
        <Text ref={c => (this.txtPulling = c)} style={styles.hide}>
          下拉可以刷新
        </Text>
        <Image
          style={styles.hide}
          ref={c => (this.imgPullok = c)}
          source={require("../../res/img/icon_arrow_up.png")}
        />
        <Text ref={c => (this.txtPullok = c)} style={styles.hide}>
          释放立即刷新
        </Text>
        <ActivityIndicator
          style={styles.hide}
          ref={c => (this.imgPullrelease = c)}
          size="small"
          color="gray"
          style={{ marginRight: 5 }}
        />
        <Text ref={c => (this.txtPullrelease = c)} style={styles.hide}>
          正在刷新...
        </Text>
      </View>
    );
  };
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
    // margin: 5,
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    backgroundColor: "white"
    // shadowColor: "#000",
    // shadowOpacity: 0.8,
    // shadowRadius: 6,
    // elevation: 9,
    // borderRadius: 8
  },
  flatListContain: {
    backgroundColor: "#F8F8F8"
  }
});
