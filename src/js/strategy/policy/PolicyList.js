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
import { fetchRequest } from "../../utils/FetchUtil";
import { PullFlatList } from "urn-pull-to-refresh";
import reactNavigation from "react-navigation";
import { RootView } from "../../component/CommonView";

const width = Dimensions.get("window").width;
const topIndicatorHeight = 50;
let _navigation;
let imageUrlIndex = 0;
export class PolicyList extends PureComponent {
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
      page: 0,
      pageCount: 0,
      //网络请求状态
      status: "loading",
      dataArray: [],
      showFoot: 0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
      isRefreshing: false //下拉控制
    };
    _navigation = this.props.navigation;
    // this._onPress.bind(this);
  }

  componentDidMount() {
    //设置statusbar样式
    this._navListener = this.props.navigation.addListener("didFocus", () => {
      StatusBar.setTranslucent(false); //关闭沉浸式
      StatusBar.setBarStyle("dark-content");
      StatusBar.setBackgroundColor("#FFFFFF");
    });
    this.fetchData();
  }

  componentWillUnmount = () => {
    this._navListener.remove();
  };

  render() {
    return (
      <RootView
        status={this.state.status}
        failed={{
          tips: "加载失败",
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
  //加载数据显示FlatList
  _renderData() {
    return (
      <PullFlatList
        ref={c => (this.pull = c)}
        isContentScroll={true}
        style={{ flex: 1, width: width }}
        onPullRelease={this._onPullRelease}
        data={this.state.dataArray}
        onEndReached={this._onEndReached}
        ListFooterComponent={this._renderFooter}
        refreshing={this.state.isRefreshing}
        renderItem={this._renderItemView}
        ItemSeparatorComponent={() => (
          <View style={{ flex: 1, height: 0.5, backgroundColor: "#cbcbcb" }} />
        )}
      />
    );
  }
  //刷新时
  _handleRefresh = () => {
    this.setState({
      page: 1,
      isRefreshing: true, //tag,下拉刷新中，加载完全，就设置成flase
      dataArray: []
    });
    this.fetchData();
  };
  //滑动到底部
  _onEndReached = () => {
    //如果是正在加载中或没有更多数据了，则返回
    if (this.state.showFoot != 0) {
      return;
    }
    //如果当前页大于或等于总页数，那就是到最后一页了，返回
    if (this.state.page != 0 && this.state.page >= this.state.pageCount) {
      return;
    } else {
      this.state.page++;
    }
    //底部显示正在加载更多数据
    this.setState({ showFoot: 2 });
    //获取数据，在componentDidMount()已经请求过数据了
    if (this.state.page > 0) {
      this.fetchData();
    }
  };

  //返回footer
  _renderFooter = () => {
    if (this.state.showFoot === 1) {
      return (
        <View
          style={{
            height: 267,
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

  //init itemView
  _renderItemView({ item }) {
    //跳转并传值
    return (
      <TouchableNativeFeedback
        onPress={() => {
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
            source={require("../../../res/img/swiper_1.jpg")}
            source={{ uri: item.key }}
          />
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text
              style={{
                marginLeft: 15,
                marginBottom: 15.6
              }}
            >
              {item.niceDate}
            </Text>
          </View>
        </View>
      </TouchableNativeFeedback>
    );
  }

  //获取数据
  fetchData() {
    url = "http://www.wanandroid.com/article/list/" + this.state.page + "/json";
    fetchRequest(url, "GET")
      .then(responseData => {
        let data = responseData.data; //获取json 数据并存在data数组中
        let dataBlob = []; //这是创建该数组，目的放存在key值的数据，就不会报黄灯了
        data.datas.map(function(item) {
          if (imageUrlIndex === 499) {
            imageUrlIndex = 0;
          }
          item.key = imageUrls[imageUrlIndex];
          imageUrlIndex++;
          dataBlob.push(item);
        });
        let foot = 0;
        if (this.state.page >= 5) {
          // if (this.state.page >= data.pageCount) {
          foot = 1; //listView底部显示没有更多数据了
        }

        this.setState({
          //复制数据源
          //  dataArray:this.state.dataArray.concat( responseData.results),
          dataArray: this.state.dataArray.concat(dataBlob),
          showFoot: foot,
          isRefreshing: false,
          status: "custom",
          pageCount: data.pageCount
        });

        data = null; //重置为空
        dataBlob = null;
      })
      .catch(error => {
        console.log(error);
        this.setState({
          status: "failed"
        });
      })
      .finally(this.pull && this.pull.finishRefresh())
      .done();
  }

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

const imageUrls = [
  "http://f.hiphotos.baidu.com/image/pic/item/ac4bd11373f082022707d43e49fbfbedab641b1d.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/0df431adcbef7609a4842f9e2cdda3cc7cd99e20.jpg",
  "http://a.hiphotos.baidu.com/image/pic/item/9922720e0cf3d7cacba28577f01fbe096b63a95f.jpg",
  "http://d.hiphotos.baidu.com/image/pic/item/0df3d7ca7bcb0a46b1cf40346963f6246a60afca.jpg",
  "http://b.hiphotos.baidu.com/image/pic/item/0df431adcbef76092a8cbd9c2cdda3cc7cd99e29.jpg",
  "http://d.hiphotos.baidu.com/image/pic/item/b58f8c5494eef01f19815dc4e2fe9925bc317d1d.jpg",
  "http://g.hiphotos.baidu.com/image/pic/item/63d0f703918fa0ec9687de0c249759ee3d6ddb6b.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/060828381f30e92452b0863f4e086e061d95f7ac.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/d4628535e5dde711cd2a5cfca5efce1b9d16613b.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/00e93901213fb80e31c566dd34d12f2eb93894a7.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/472309f790529822dff183cad5ca7bcb0b46d4fd.jpg",
  "http://a.hiphotos.baidu.com/image/pic/item/d1a20cf431adcbeffe42a207aeaf2edda3cc9fb9.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/5243fbf2b211931372c468a064380cd791238d1f.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/96dda144ad345982f06dfa980ef431adcaef84d0.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/d52a2834349b033b7e61e7d417ce36d3d439bdd6.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/7acb0a46f21fbe09b60091966a600c338644add2.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/10dfa9ec8a1363273fc83b33938fa0ec08fac78d.jpg",
  "http://a.hiphotos.baidu.com/image/pic/item/8694a4c27d1ed21bd6afe2e4af6eddc451da3f49.jpg",
  "http://d.hiphotos.baidu.com/image/pic/item/a044ad345982b2b72352760233adcbef77099b23.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/3b87e950352ac65c2f454c71f9f2b21193138a6b.jpg",
  "http://g.hiphotos.baidu.com/image/pic/item/bd3eb13533fa828b207b80edff1f4134970a5a67.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/dc54564e9258d109164262aad358ccbf6c814d01.jpg",
  "http://g.hiphotos.baidu.com/image/pic/item/0e2442a7d933c895f7056f7ad31373f0820200b3.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/023b5bb5c9ea15ce2c37e908b4003af33b87b2d1.jpg",
  "http://b.hiphotos.baidu.com/image/pic/item/b21c8701a18b87d60ea07416050828381e30fddd.jpg",
  "http://d.hiphotos.baidu.com/image/pic/item/6a600c338744ebf831ca4f3ddbf9d72a6059a77c.jpg",
  "http://g.hiphotos.baidu.com/image/pic/item/dcc451da81cb39dbd0ce2057d2160924ab1830a0.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/4d086e061d950a7b205086c908d162d9f2d3c952.jpg",
  "http://g.hiphotos.baidu.com/image/pic/item/55e736d12f2eb938cd2964f8d7628535e5dd6f77.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/8435e5dde71190efbb621cd2cc1b9d16fdfa6026.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/d1160924ab18972b7e1501c0e4cd7b899e510a88.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/242dd42a2834349b34c44086cbea15ce37d3bef6.jpg",
  "http://g.hiphotos.baidu.com/image/pic/item/d000baa1cd11728be11fa720cafcc3cec3fd2c85.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/2fdda3cc7cd98d104b3d173f233fb80e7aec90d6.jpg",
  "http://g.hiphotos.baidu.com/image/pic/item/c83d70cf3bc79f3d86309320bba1cd11738b29c8.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/8c1001e93901213f2de69ddd56e736d12e2e95de.jpg",
  "http://d.hiphotos.baidu.com/image/pic/item/cf1b9d16fdfaaf51909c9fb58e5494eef01f7ab8.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/8601a18b87d6277f3cbd75b52a381f30e824fc94.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/7c1ed21b0ef41bd56a58d17b53da81cb39db3d31.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/48540923dd54564e3ed424b0b1de9c82d0584f82.jpg",
  "http://a.hiphotos.baidu.com/image/pic/item/342ac65c103853435bc30d0e9013b07eca808895.jpg",
  "http://a.hiphotos.baidu.com/image/pic/item/c2cec3fdfc0392458e96a70e8594a4c27d1e258b.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/80cb39dbb6fd5266c539cc15a918972bd40736a4.jpg",
  "http://d.hiphotos.baidu.com/image/pic/item/7c1ed21b0ef41bd506cef5fa53da81cb39db3d1a.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/b21c8701a18b87d63b0d6916050828381f30fd68.jpg",
  "http://g.hiphotos.baidu.com/image/pic/item/d50735fae6cd7b89206f2b760d2442a7d8330ec7.jpg",
  "http://d.hiphotos.baidu.com/image/pic/item/aec379310a55b3199868317441a98226cffc1719.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/314e251f95cad1c853b80a267d3e6709c93d51b4.jpg",
  "http://b.hiphotos.baidu.com/image/pic/item/500fd9f9d72a6059a45d191b2a34349b033bba66.jpg",
  "http://a.hiphotos.baidu.com/image/pic/item/c995d143ad4bd11373bf693b58afa40f4bfb054c.jpg",
  "http://d.hiphotos.baidu.com/image/pic/item/c2cec3fdfc039245ed7b440e8594a4c27c1e25e0.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/8ad4b31c8701a18b054fb7469c2f07082838fe17.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/f2deb48f8c5494eeedbf4f1f2ff5e0fe99257e12.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/6159252dd42a28345026ee0a59b5c9ea15cebf2b.jpg",
  "http://g.hiphotos.baidu.com/image/pic/item/7af40ad162d9f2d3a1db3fe1abec8a136227ccf2.jpg",
  "http://b.hiphotos.baidu.com/image/pic/item/5bafa40f4bfbfbeda221eb7e7af0f736afc31fb2.jpg",
  "http://a.hiphotos.baidu.com/image/pic/item/91529822720e0cf3c71e55f50846f21fbf09aad6.jpg",
  "http://g.hiphotos.baidu.com/image/pic/item/b90e7bec54e736d1b97f500999504fc2d5626947.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/9345d688d43f87941b5972a1d01b0ef41ad53a9e.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/86d6277f9e2f0708c4fb350aeb24b899a901f23a.jpg",
  "http://a.hiphotos.baidu.com/image/pic/item/7c1ed21b0ef41bd5d5b9867953da81cb38db3d50.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/30adcbef76094b36f8be31efa1cc7cd98d109d87.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/b3b7d0a20cf431ada741723b4936acaf2edd9824.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/dc54564e9258d109573223bfd358ccbf6d814dee.jpg",
  "http://a.hiphotos.baidu.com/image/pic/item/a1ec08fa513d2697e932bd5c57fbb2fb4216d8ca.jpg",
  "http://a.hiphotos.baidu.com/image/pic/item/1e30e924b899a901548c6d381f950a7b0208f506.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/0823dd54564e92586b505bef9e82d158ccbf4e4f.jpg",
  "http://g.hiphotos.baidu.com/image/pic/item/38dbb6fd5266d016e7e84625952bd40734fa35ce.jpg",
  "http://g.hiphotos.baidu.com/image/pic/item/7acb0a46f21fbe09450fe0956a600c338644add9.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/5882b2b7d0a20cf4938906df74094b36acaf9991.jpg",
  "http://a.hiphotos.baidu.com/image/pic/item/5243fbf2b2119313880ae1ba67380cd791238d6a.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/b17eca8065380cd7a43da5e7a344ad345982819c.jpg",
  "http://a.hiphotos.baidu.com/image/pic/item/4bed2e738bd4b31c079c31b285d6277f9e2ff813.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/6a600c338744ebf8cedf2439dbf9d72a6059a70e.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/ac345982b2b7d0a20e315d9cc9ef76094b369a32.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/0dd7912397dda14491cc77bcb0b7d0a20df486f2.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/b17eca8065380cd7dcd98deea344ad34588281e9.jpg",
  "http://b.hiphotos.baidu.com/image/pic/item/2e2eb9389b504fc2ac278f0fe7dde71190ef6dbb.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/cf1b9d16fdfaaf519fbd96b18e5494eef01f7a65.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/6609c93d70cf3bc70270d9efd300baa1cd112a44.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/d62a6059252dd42a42e9d2aa013b5bb5c8eab8cb.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/d1160924ab18972b3ef2c143e4cd7b899f510a6b.jpg",
  "http://b.hiphotos.baidu.com/image/pic/item/8435e5dde71190efe7f851fbcd1b9d16fdfa6097.jpg",
  "http://a.hiphotos.baidu.com/image/pic/item/023b5bb5c9ea15ce763ec303b4003af33b87b2e3.jpg",
  "http://b.hiphotos.baidu.com/image/pic/item/ac345982b2b7d0a28da1dc90c9ef76094b369a57.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/63d0f703918fa0ec37e3bf0f249759ee3d6ddb88.jpg",
  "http://d.hiphotos.baidu.com/image/pic/item/3812b31bb051f8198d79c847d8b44aed2e73e75b.jpg",
  "http://g.hiphotos.baidu.com/image/pic/item/5366d0160924ab183921fb3937fae6cd7b890b8c.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/71cf3bc79f3df8dcedae3e90cf11728b4710281b.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/6f061d950a7b02083eded1e060d9f2d3572cc898.jpg",
  "http://g.hiphotos.baidu.com/image/pic/item/bd3eb13533fa828b207b80edff1f4134970a5a67.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/cc11728b4710b9123a8117fec1fdfc039245226a.jpg",
  "http://d.hiphotos.baidu.com/image/pic/item/0df3d7ca7bcb0a46b1cf40346963f6246a60afca.jpg",
  "http://b.hiphotos.baidu.com/image/pic/item/0df431adcbef76092a8cbd9c2cdda3cc7cd99e29.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/9e3df8dcd100baa1605b67b14510b912c8fc2e40.jpg",
  "http://a.hiphotos.baidu.com/image/pic/item/9922720e0cf3d7cacba28577f01fbe096b63a95f.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/b8014a90f603738de5b1812fb11bb051f919ecc0.jpg",
  "http://b.hiphotos.baidu.com/image/pic/item/3ac79f3df8dcd100637d2520708b4710b8122fca.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/c995d143ad4bd1132f5a0d3b58afa40f4bfb0527.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/63d0f703918fa0ec8443f31d279759ee3d6ddb1e.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/bd3eb13533fa828b1c655ce2ff1f4134970a5a69.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/9f510fb30f2442a71d50eaabd343ad4bd1130265.jpg",
  "http://d.hiphotos.baidu.com/image/pic/item/fd039245d688d43f642b4efb7f1ed21b0ef43b3d.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/622762d0f703918faae82ac4533d269759eec486.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/b7003af33a87e95047522c6512385343fbf2b476.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/6159252dd42a28342b92310559b5c9ea15cebf83.jpg",
  "http://g.hiphotos.baidu.com/image/pic/item/9345d688d43f87941a6b6d2dd01b0ef41bd53a18.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/91529822720e0cf3f89374740846f21fbf09aadc.jpg",
  "http://d.hiphotos.baidu.com/image/pic/item/a044ad345982b2b72352760233adcbef77099b23.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/dc54564e9258d109164262aad358ccbf6c814d01.jpg",
  "http://b.hiphotos.baidu.com/image/pic/item/023b5bb5c9ea15cebf201808b4003af33b87b2e1.jpg",
  "http://b.hiphotos.baidu.com/image/pic/item/b90e7bec54e736d17ed6970699504fc2d46269f2.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/960a304e251f95cae5f125b7cb177f3e670952ae.jpg",
  "http://d.hiphotos.baidu.com/image/pic/item/f31fbe096b63f62430bfe60a8544ebf81b4ca3dd.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/78310a55b319ebc4da4cce988026cffc1e1716fe.jpg",
  "http://a.hiphotos.baidu.com/image/pic/item/4b90f603738da977b9b1362ab251f8198618e311.jpg",
  "http://b.hiphotos.baidu.com/image/pic/item/060828381f30e92489cd41304e086e061d95f742.jpg",
  "http://d.hiphotos.baidu.com/image/pic/item/c2cec3fdfc039245ed7b440e8594a4c27c1e25e0.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/21a4462309f79052ca7e9b3f0ef3d7ca7bcbd54a.jpg",
  "http://b.hiphotos.baidu.com/image/pic/item/0b46f21fbe096b63e725585a0e338744ebf8acff.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/f9dcd100baa1cd11af62a121bb12c8fcc2ce2ddf.jpg",
  "http://g.hiphotos.baidu.com/image/pic/item/d058ccbf6c81800aa7e95707b33533fa828b47af.jpg",
  "http://d.hiphotos.baidu.com/image/pic/item/4a36acaf2edda3cc379ba62a03e93901213f92b8.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/63d9f2d3572c11dfee7f5522612762d0f703c201.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/10dfa9ec8a1363273fc83b33938fa0ec08fac78d.jpg",
  "http://b.hiphotos.baidu.com/image/pic/item/faedab64034f78f036af9cf97b310a55b3191c17.jpg",
  "http://d.hiphotos.baidu.com/image/pic/item/b151f8198618367a91b3f5f22d738bd4b31ce5e3.jpg",
  "http://g.hiphotos.baidu.com/image/pic/item/ca1349540923dd5448871069d309b3de9c82483e.jpg",
  "http://a.hiphotos.baidu.com/image/pic/item/c995d143ad4bd1139b7c813c58afa40f4bfb050e.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/f603918fa0ec08fa13a0ca7f5bee3d6d54fbda42.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/d058ccbf6c81800af3a80303b33533fa828b476a.jpg",
  "http://g.hiphotos.baidu.com/image/pic/item/11385343fbf2b211058c7c4ec88065380cd78e14.jpg",
  "http://g.hiphotos.baidu.com/image/pic/item/8ad4b31c8701a18bc179eb4f9c2f07082838fe24.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/6609c93d70cf3bc74bff12e5d300baa1cd112a38.jpg",
  "http://b.hiphotos.baidu.com/image/pic/item/0df3d7ca7bcb0a46ab4656386963f6246b60af4f.jpg",
  "http://d.hiphotos.baidu.com/image/pic/item/21a4462309f79052c3d6923f0ef3d7ca7acbd5e2.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/8644ebf81a4c510fd689eb1d6259252dd42aa563.jpg",
  "http://g.hiphotos.baidu.com/image/pic/item/d01373f082025aaf329d1249faedab64024f1a80.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/8435e5dde71190efbb621cd2cc1b9d16fdfa6026.jpg",
  "http://g.hiphotos.baidu.com/image/pic/item/b8389b504fc2d562f37bebeee51190ef76c66c45.jpg",
  "http://d.hiphotos.baidu.com/image/pic/item/738b4710b912c8fcd0c870e2ff039245d68821e1.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/f9dcd100baa1cd11afe3a121bb12c8fcc3ce2d5e.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/241f95cad1c8a7869d861a8c6609c93d71cf5087.jpg",
  "http://b.hiphotos.baidu.com/image/pic/item/3ac79f3df8dcd100636e2520708b4710b8122fc5.jpg",
  "http://g.hiphotos.baidu.com/image/pic/item/a9d3fd1f4134970acede910096cad1c8a7865d74.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/6609c93d70cf3bc70270d9efd300baa1cd112a44.jpg",
  "http://a.hiphotos.baidu.com/image/pic/item/c83d70cf3bc79f3d786bee29b8a1cd11728b2924.jpg",
  "http://b.hiphotos.baidu.com/image/pic/item/7e3e6709c93d70cf82f89b03fadcd100baa12bb9.jpg",
  "http://d.hiphotos.baidu.com/image/pic/item/4034970a304e251fb61543f9a586c9177e3e53d4.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/7acb0a46f21fbe0936be101569600c338644adcb.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/8694a4c27d1ed21bd289ee6caf6eddc450da3ff3.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/3b292df5e0fe9925d343745e36a85edf8db17174.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/060828381f30e924f48864314e086e061d95f786.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/83025aafa40f4bfb6f90f756014f78f0f736186b.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/e4dde71190ef76c6b31abb2d9f16fdfaae5167ef.jpg",
  "http://b.hiphotos.baidu.com/image/pic/item/b219ebc4b74543a94369f4cb1c178a82b9011442.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/bd3eb13533fa828b2aa08ae0ff1f4134970a5a35.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/f636afc379310a550f68d7f3b54543a98226106c.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/79f0f736afc37931f08f4e24e9c4b74542a911dc.jpg",
  "http://d.hiphotos.baidu.com/image/pic/item/b3fb43166d224f4a7b4f9a1e0bf790529922d1ed.jpg",
  "http://b.hiphotos.baidu.com/image/pic/item/03087bf40ad162d9f3a3751213dfa9ec8a13cd6a.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/f2deb48f8c5494eeedbf4f1f2ff5e0fe99257e12.jpg",
  "http://d.hiphotos.baidu.com/image/pic/item/ca1349540923dd54854a5f69d309b3de9c8248f2.jpg",
  "http://d.hiphotos.baidu.com/image/pic/item/96dda144ad345982e1b3c9910ef431adcbef84f3.jpg",
  "http://a.hiphotos.baidu.com/image/pic/item/dc54564e9258d109cb9cb7b8d358ccbf6c814db8.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/730e0cf3d7ca7bcbffb2b92dbc096b63f724a8e3.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/b90e7bec54e736d1403da98799504fc2d5626916.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/00e93901213fb80e31c566dd34d12f2eb93894a7.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/55e736d12f2eb93859b5f1ddd6628535e4dd6fc1.jpg",
  "http://b.hiphotos.baidu.com/image/pic/item/7dd98d1001e9390130d9d13f79ec54e737d196d3.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/b21bb051f81986183a13248948ed2e738bd4e663.jpg",
  "http://d.hiphotos.baidu.com/image/pic/item/0ff41bd5ad6eddc4124713023bdbb6fd536633a2.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/0df431adcbef76094e9dc2ef2fdda3cc7cd99e2f.jpg",
  "http://b.hiphotos.baidu.com/image/pic/item/9d82d158ccbf6c81997e96e9be3eb13533fa4061.jpg",
  "http://a.hiphotos.baidu.com/image/pic/item/14ce36d3d539b600321c6835e850352ac75cb765.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/5ab5c9ea15ce36d3078a333138f33a87e950b121.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/b21bb051f8198618f930e18348ed2e738bd4e646.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/0df3d7ca7bcb0a46906561386963f6246b60af68.jpg",
  "http://g.hiphotos.baidu.com/image/pic/item/e1fe9925bc315c60aaf9a5ee8fb1cb1349547747.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/b64543a98226cffc8276e8b0bb014a90f603ea50.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/bba1cd11728b471003e3c343c1cec3fdfd032374.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/3b87e950352ac65ce5e439f1faf2b21192138a4b.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/279759ee3d6d55fbd5808f276f224f4a20a4dd69.jpg",
  "http://g.hiphotos.baidu.com/image/pic/item/d01373f082025aafcacacbcaf9edab64034f1a32.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/a2cc7cd98d1001e9958fec0fba0e7bec54e7977b.jpg",
  "http://g.hiphotos.baidu.com/image/pic/item/b812c8fcc3cec3fd223b797cd488d43f879427b6.jpg",
  "http://d.hiphotos.baidu.com/image/pic/item/91529822720e0cf3f4b560f80846f21fbe09aa76.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/6f061d950a7b02084e5ae0ce61d9f2d3572cc80a.jpg",
  "http://d.hiphotos.baidu.com/image/pic/item/c9fcc3cec3fdfc0319a2e9a1d63f8794a5c226d4.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/64380cd7912397dd0ba0132b5a82b2b7d1a287c0.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/dc54564e9258d109164262aad358ccbf6c814d01.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/0824ab18972bd40791a9ddfa79899e510fb3094e.jpg",
  "http://g.hiphotos.baidu.com/image/pic/item/63d0f703918fa0ec9687de0c249759ee3d6ddb6b.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/54fbb2fb43166d2298df7f67442309f79152d29d.jpg",
  "http://d.hiphotos.baidu.com/image/pic/item/b8014a90f603738db22ad023b11bb051f819ec4b.jpg",
  "http://a.hiphotos.baidu.com/image/pic/item/96dda144ad3459821a2614900ef431adcbef8400.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/2fdda3cc7cd98d104b3d173f233fb80e7aec90d6.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/ca1349540923dd54f48e6c65d309b3de9c82483a.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/908fa0ec08fa513ddbbf6bd43f6d55fbb2fbd9a7.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/f2deb48f8c5494ee572dd1102ff5e0fe99257ea8.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/0bd162d9f2d3572c1b3cb2df8813632763d0c3d2.jpg",
  "http://g.hiphotos.baidu.com/image/pic/item/241f95cad1c8a78647cd55046509c93d71cf50d0.jpg",
  "http://g.hiphotos.baidu.com/image/pic/item/b90e7bec54e736d1b97f500999504fc2d5626947.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/8c1001e93901213f2de69ddd56e736d12e2e95de.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/eac4b74543a982268a3ea62a8882b9014b90ebc4.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/622762d0f703918faae82ac4533d269759eec486.jpg",
  "http://d.hiphotos.baidu.com/image/pic/item/a044ad345982b2b72352760233adcbef77099b23.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/0d338744ebf81a4cb3d7b1c8d52a6059242da6ce.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/1f178a82b9014a90ea6795bcab773912b31bee52.jpg",
  "http://a.hiphotos.baidu.com/image/pic/item/58ee3d6d55fbb2fb0b8681104d4a20a44623dc07.jpg",
  "http://g.hiphotos.baidu.com/image/pic/item/2cf5e0fe9925bc31eaabd6875cdf8db1cb13703f.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/ac4bd11373f082022707d43e49fbfbedab641b1d.jpg",
  "http://b.hiphotos.baidu.com/image/pic/item/f9198618367adab49ba3154489d4b31c8701e442.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/a9d3fd1f4134970af47bca2e97cad1c8a7865da3.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/7aec54e736d12f2e5c87006a4dc2d5628535683e.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/962bd40735fae6cd8cb174600db30f2442a70fae.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/d8f9d72a6059252d93f32f35379b033b5bb5b91e.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/5243fbf2b211931372c468a064380cd791238d1f.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/f2deb48f8c5494eeedbf4f1f2ff5e0fe99257e12.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/d1160924ab18972b7e1501c0e4cd7b899e510a88.jpg",
  "http://a.hiphotos.baidu.com/image/pic/item/962bd40735fae6cd7b087f600db30f2442a70f76.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/42a98226cffc1e1798d5543c4890f603738de951.jpg",
  "http://b.hiphotos.baidu.com/image/pic/item/5bafa40f4bfbfbeda221eb7e7af0f736afc31fb2.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/3c6d55fbb2fb4316271aa47322a4462309f7d3b6.jpg",
  "http://d.hiphotos.baidu.com/image/pic/item/c8177f3e6709c93d230252f69d3df8dcd100543a.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/279759ee3d6d55fbc6e5fc2b6f224f4a20a4dd98.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/f9198618367adab4b86834b689d4b31c8601e48f.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/0eb30f2442a7d9333a9724faaf4bd11373f00178.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/d009b3de9c82d15849414dbf820a19d8bd3e42f8.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/6159252dd42a28342b92310559b5c9ea15cebf83.jpg",
  "http://g.hiphotos.baidu.com/image/pic/item/0e2442a7d933c895f7056f7ad31373f0820200b3.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/2934349b033b5bb5fbe537f034d3d539b600bc89.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/00e93901213fb80eccc491d634d12f2eb938949e.jpg",
  "http://b.hiphotos.baidu.com/image/pic/item/4bed2e738bd4b31caed846ba85d6277f9f2ff8cf.jpg",
  "http://g.hiphotos.baidu.com/image/pic/item/8ad4b31c8701a18bc174eb4f9c2f07082838fe17.jpg",
  "http://b.hiphotos.baidu.com/image/pic/item/4034970a304e251f246fd5faa586c9177f3e5313.jpg",
  "http://d.hiphotos.baidu.com/image/pic/item/54fbb2fb43166d224c341417472309f79152d2f5.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/6f061d950a7b02086ebd01e260d9f2d3572cc8b8.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/f9dcd100baa1cd11afe3a121bb12c8fcc3ce2d5e.jpg",
  "http://a.hiphotos.baidu.com/image/pic/item/fd039245d688d43fdf04d1f47f1ed21b0ef43b02.jpg",
  "http://a.hiphotos.baidu.com/image/pic/item/08f790529822720e0480e2f879cb0a46f21fab61.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/37d3d539b6003af3bf663c60372ac65c1138b6d6.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/359b033b5bb5c9eadf33bde2d739b6003bf3b3eb.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/8cb1cb1349540923a220767c9058d109b3de4962.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/cf1b9d16fdfaaf519fbd96b18e5494eef01f7a65.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/9c16fdfaaf51f3de2b907c6596eef01f3a297995.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/b2de9c82d158ccbf995d32371bd8bc3eb03541de.jpg",
  "http://a.hiphotos.baidu.com/image/pic/item/8435e5dde71190ef0ed5b750cc1b9d16fdfa6016.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/35a85edf8db1cb13cd8c10d2df54564e93584b0d.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/8cb1cb1349540923c292d67f9058d109b3de4933.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/a8014c086e061d952d01f53179f40ad162d9ca70.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/0df431adcbef7609a4842f9e2cdda3cc7cd99e20.jpg",
  "http://a.hiphotos.baidu.com/image/pic/item/77c6a7efce1b9d16cd04f363f1deb48f8d5464f4.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/4b90f603738da9773e924d33b251f8198618e36d.jpg",
  "http://d.hiphotos.baidu.com/image/pic/item/267f9e2f0708283844835516ba99a9014c08f122.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/86d6277f9e2f070824e61503eb24b899a801f2d5.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/2934349b033b5bb5167a60ff34d3d539b600bc06.jpg",
  "http://b.hiphotos.baidu.com/image/pic/item/e7cd7b899e510fb3f66ea99edb33c895d1430c40.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/d788d43f8794a4c2d066f1df0ff41bd5ac6e39f8.jpg",
  "http://d.hiphotos.baidu.com/image/pic/item/d4628535e5dde7112b6bbaf7a5efce1b9d166172.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/8b82b9014a90f603be069f463b12b31bb051ed79.jpg",
  "http://b.hiphotos.baidu.com/image/pic/item/faedab64034f78f036af9cf97b310a55b3191c17.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/f11f3a292df5e0feab21d9835d6034a85edf7272.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/09fa513d269759ee0933a8c6b0fb43166d22df58.jpg",
  "http://d.hiphotos.baidu.com/image/pic/item/241f95cad1c8a786f2ca020f6509c93d71cf50ca.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/5ab5c9ea15ce36d3071e333138f33a87e950b19d.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/d52a2834349b033b7e61e7d417ce36d3d439bdd6.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/e4dde71190ef76c6386f24229f16fdfaaf51677e.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/9345d688d43f87941b5972a1d01b0ef41ad53a9e.jpg",
  "http://g.hiphotos.baidu.com/image/pic/item/d6ca7bcb0a46f21f68cf0790f4246b600d33ae7e.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/d788d43f8794a4c2a26e22290cf41bd5ad6e3967.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/e7cd7b899e510fb3d3e745a6da33c895d1430c00.jpg",
  "http://b.hiphotos.baidu.com/image/pic/item/5366d0160924ab184e1cd03537fae6cd7b890bad.jpg",
  "http://b.hiphotos.baidu.com/image/pic/item/91ef76c6a7efce1bbc7f97cbad51f3deb48f655e.jpg",
  "http://d.hiphotos.baidu.com/image/pic/item/91529822720e0cf3acf7b8fa0846f21fbe09aaab.jpg",
  "http://d.hiphotos.baidu.com/image/pic/item/6609c93d70cf3bc71c70c3ebd300baa1cd112a40.jpg",
  "http://a.hiphotos.baidu.com/image/pic/item/242dd42a2834349b6321a984cbea15ce36d3be88.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/b7fd5266d016092414c58a18d60735fae7cd34d4.jpg",
  "http://g.hiphotos.baidu.com/image/pic/item/d53f8794a4c27d1e4c123cca19d5ad6eddc43883.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/bd315c6034a85edf19b5cc2d4b540923dd547586.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/a8ec8a13632762d04db8e1bea2ec08fa513dc629.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/e850352ac65c10380e02f9c0b0119313b07e89b7.jpg",
  "http://a.hiphotos.baidu.com/image/pic/item/738b4710b912c8fc4b79fcd4fe039245d6882124.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/1e30e924b899a901d36112371f950a7b0208f55f.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/6a63f6246b600c33ababf0cb184c510fd8f9a1e6.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/472309f7905298228e0c4cdad5ca7bcb0a46d4e8.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/f9198618367adab4e838444289d4b31c8601e4c3.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/77c6a7efce1b9d16113d0e99f2deb48f8d546454.jpg",
  "http://d.hiphotos.baidu.com/image/pic/item/c2cec3fdfc039245ed7b440e8594a4c27c1e25e0.jpg",
  "http://b.hiphotos.baidu.com/image/pic/item/eac4b74543a982267e5253a58b82b9014b90eba5.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/0824ab18972bd40791a9ddfa79899e510fb3094e.jpg",
  "http://g.hiphotos.baidu.com/image/pic/item/63d0f703918fa0ec9687de0c249759ee3d6ddb6b.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/54fbb2fb43166d2298df7f67442309f79152d29d.jpg",
  "http://d.hiphotos.baidu.com/image/pic/item/b8014a90f603738db22ad023b11bb051f819ec4b.jpg",
  "http://a.hiphotos.baidu.com/image/pic/item/96dda144ad3459821a2614900ef431adcbef8400.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/2fdda3cc7cd98d104b3d173f233fb80e7aec90d6.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/ca1349540923dd54f48e6c65d309b3de9c82483a.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/908fa0ec08fa513ddbbf6bd43f6d55fbb2fbd9a7.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/f2deb48f8c5494ee572dd1102ff5e0fe99257ea8.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/0bd162d9f2d3572c1b3cb2df8813632763d0c3d2.jpg",
  "http://g.hiphotos.baidu.com/image/pic/item/241f95cad1c8a78647cd55046509c93d71cf50d0.jpg",
  "http://g.hiphotos.baidu.com/image/pic/item/b90e7bec54e736d1b97f500999504fc2d5626947.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/8c1001e93901213f2de69ddd56e736d12e2e95de.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/eac4b74543a982268a3ea62a8882b9014b90ebc4.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/622762d0f703918faae82ac4533d269759eec486.jpg",
  "http://d.hiphotos.baidu.com/image/pic/item/a044ad345982b2b72352760233adcbef77099b23.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/0d338744ebf81a4cb3d7b1c8d52a6059242da6ce.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/1f178a82b9014a90ea6795bcab773912b31bee52.jpg",
  "http://a.hiphotos.baidu.com/image/pic/item/58ee3d6d55fbb2fb0b8681104d4a20a44623dc07.jpg",
  "http://g.hiphotos.baidu.com/image/pic/item/2cf5e0fe9925bc31eaabd6875cdf8db1cb13703f.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/ac4bd11373f082022707d43e49fbfbedab641b1d.jpg",
  "http://b.hiphotos.baidu.com/image/pic/item/f9198618367adab49ba3154489d4b31c8701e442.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/a9d3fd1f4134970af47bca2e97cad1c8a7865da3.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/7aec54e736d12f2e5c87006a4dc2d5628535683e.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/962bd40735fae6cd8cb174600db30f2442a70fae.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/d8f9d72a6059252d93f32f35379b033b5bb5b91e.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/5243fbf2b211931372c468a064380cd791238d1f.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/f2deb48f8c5494eeedbf4f1f2ff5e0fe99257e12.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/d1160924ab18972b7e1501c0e4cd7b899e510a88.jpg",
  "http://a.hiphotos.baidu.com/image/pic/item/962bd40735fae6cd7b087f600db30f2442a70f76.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/42a98226cffc1e1798d5543c4890f603738de951.jpg",
  "http://b.hiphotos.baidu.com/image/pic/item/5bafa40f4bfbfbeda221eb7e7af0f736afc31fb2.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/3c6d55fbb2fb4316271aa47322a4462309f7d3b6.jpg",
  "http://d.hiphotos.baidu.com/image/pic/item/c8177f3e6709c93d230252f69d3df8dcd100543a.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/279759ee3d6d55fbc6e5fc2b6f224f4a20a4dd98.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/f9198618367adab4b86834b689d4b31c8601e48f.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/0eb30f2442a7d9333a9724faaf4bd11373f00178.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/d009b3de9c82d15849414dbf820a19d8bd3e42f8.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/6159252dd42a28342b92310559b5c9ea15cebf83.jpg",
  "http://g.hiphotos.baidu.com/image/pic/item/0e2442a7d933c895f7056f7ad31373f0820200b3.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/2934349b033b5bb5fbe537f034d3d539b600bc89.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/00e93901213fb80eccc491d634d12f2eb938949e.jpg",
  "http://b.hiphotos.baidu.com/image/pic/item/4bed2e738bd4b31caed846ba85d6277f9f2ff8cf.jpg",
  "http://g.hiphotos.baidu.com/image/pic/item/8ad4b31c8701a18bc174eb4f9c2f07082838fe17.jpg",
  "http://b.hiphotos.baidu.com/image/pic/item/4034970a304e251f246fd5faa586c9177f3e5313.jpg",
  "http://d.hiphotos.baidu.com/image/pic/item/54fbb2fb43166d224c341417472309f79152d2f5.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/6f061d950a7b02086ebd01e260d9f2d3572cc8b8.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/f9dcd100baa1cd11afe3a121bb12c8fcc3ce2d5e.jpg",
  "http://a.hiphotos.baidu.com/image/pic/item/fd039245d688d43fdf04d1f47f1ed21b0ef43b02.jpg",
  "http://a.hiphotos.baidu.com/image/pic/item/08f790529822720e0480e2f879cb0a46f21fab61.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/37d3d539b6003af3bf663c60372ac65c1138b6d6.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/359b033b5bb5c9eadf33bde2d739b6003bf3b3eb.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/8cb1cb1349540923a220767c9058d109b3de4962.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/cf1b9d16fdfaaf519fbd96b18e5494eef01f7a65.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/9c16fdfaaf51f3de2b907c6596eef01f3a297995.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/b2de9c82d158ccbf995d32371bd8bc3eb03541de.jpg",
  "http://a.hiphotos.baidu.com/image/pic/item/8435e5dde71190ef0ed5b750cc1b9d16fdfa6016.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/35a85edf8db1cb13cd8c10d2df54564e93584b0d.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/8cb1cb1349540923c292d67f9058d109b3de4933.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/a8014c086e061d952d01f53179f40ad162d9ca70.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/0df431adcbef7609a4842f9e2cdda3cc7cd99e20.jpg",
  "http://a.hiphotos.baidu.com/image/pic/item/77c6a7efce1b9d16cd04f363f1deb48f8d5464f4.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/4b90f603738da9773e924d33b251f8198618e36d.jpg",
  "http://d.hiphotos.baidu.com/image/pic/item/267f9e2f0708283844835516ba99a9014c08f122.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/86d6277f9e2f070824e61503eb24b899a801f2d5.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/2934349b033b5bb5167a60ff34d3d539b600bc06.jpg",
  "http://b.hiphotos.baidu.com/image/pic/item/e7cd7b899e510fb3f66ea99edb33c895d1430c40.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/d788d43f8794a4c2d066f1df0ff41bd5ac6e39f8.jpg",
  "http://d.hiphotos.baidu.com/image/pic/item/d4628535e5dde7112b6bbaf7a5efce1b9d166172.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/8b82b9014a90f603be069f463b12b31bb051ed79.jpg",
  "http://b.hiphotos.baidu.com/image/pic/item/faedab64034f78f036af9cf97b310a55b3191c17.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/f11f3a292df5e0feab21d9835d6034a85edf7272.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/09fa513d269759ee0933a8c6b0fb43166d22df58.jpg",
  "http://d.hiphotos.baidu.com/image/pic/item/241f95cad1c8a786f2ca020f6509c93d71cf50ca.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/5ab5c9ea15ce36d3071e333138f33a87e950b19d.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/d52a2834349b033b7e61e7d417ce36d3d439bdd6.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/e4dde71190ef76c6386f24229f16fdfaaf51677e.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/9345d688d43f87941b5972a1d01b0ef41ad53a9e.jpg",
  "http://g.hiphotos.baidu.com/image/pic/item/d6ca7bcb0a46f21f68cf0790f4246b600d33ae7e.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/d788d43f8794a4c2a26e22290cf41bd5ad6e3967.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/e7cd7b899e510fb3d3e745a6da33c895d1430c00.jpg",
  "http://b.hiphotos.baidu.com/image/pic/item/5366d0160924ab184e1cd03537fae6cd7b890bad.jpg",
  "http://b.hiphotos.baidu.com/image/pic/item/91ef76c6a7efce1bbc7f97cbad51f3deb48f655e.jpg",
  "http://d.hiphotos.baidu.com/image/pic/item/91529822720e0cf3acf7b8fa0846f21fbe09aaab.jpg",
  "http://d.hiphotos.baidu.com/image/pic/item/6609c93d70cf3bc71c70c3ebd300baa1cd112a40.jpg",
  "http://a.hiphotos.baidu.com/image/pic/item/242dd42a2834349b6321a984cbea15ce36d3be88.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/b7fd5266d016092414c58a18d60735fae7cd34d4.jpg",
  "http://g.hiphotos.baidu.com/image/pic/item/d53f8794a4c27d1e4c123cca19d5ad6eddc43883.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/bd315c6034a85edf19b5cc2d4b540923dd547586.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/a8ec8a13632762d04db8e1bea2ec08fa513dc629.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/e850352ac65c10380e02f9c0b0119313b07e89b7.jpg",
  "http://a.hiphotos.baidu.com/image/pic/item/738b4710b912c8fc4b79fcd4fe039245d6882124.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/1e30e924b899a901d36112371f950a7b0208f55f.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/6a63f6246b600c33ababf0cb184c510fd8f9a1e6.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/472309f7905298228e0c4cdad5ca7bcb0a46d4e8.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/f9198618367adab4e838444289d4b31c8601e4c3.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/77c6a7efce1b9d16113d0e99f2deb48f8d546454.jpg",
  "http://d.hiphotos.baidu.com/image/pic/item/c2cec3fdfc039245ed7b440e8594a4c27c1e25e0.jpg",
  "http://b.hiphotos.baidu.com/image/pic/item/eac4b74543a982267e5253a58b82b9014b90eba5.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/d000baa1cd11728b9a505eedcafcc3cec2fd2c84.jpg",
  "http://g.hiphotos.baidu.com/image/pic/item/63d0f703918fa0ec9687de0c249759ee3d6ddb6b.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/54fbb2fb43166d2298df7f67442309f79152d29d.jpg",
  "http://d.hiphotos.baidu.com/image/pic/item/b8014a90f603738db22ad023b11bb051f819ec4b.jpg",
  "http://a.hiphotos.baidu.com/image/pic/item/96dda144ad3459821a2614900ef431adcbef8400.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/2fdda3cc7cd98d104b3d173f233fb80e7aec90d6.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/ca1349540923dd54f48e6c65d309b3de9c82483a.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/908fa0ec08fa513ddbbf6bd43f6d55fbb2fbd9a7.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/f2deb48f8c5494ee572dd1102ff5e0fe99257ea8.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/0bd162d9f2d3572c1b3cb2df8813632763d0c3d2.jpg",
  "http://g.hiphotos.baidu.com/image/pic/item/241f95cad1c8a78647cd55046509c93d71cf50d0.jpg",
  "http://g.hiphotos.baidu.com/image/pic/item/b90e7bec54e736d1b97f500999504fc2d5626947.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/8c1001e93901213f2de69ddd56e736d12e2e95de.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/eac4b74543a982268a3ea62a8882b9014b90ebc4.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/622762d0f703918faae82ac4533d269759eec486.jpg",
  "http://d.hiphotos.baidu.com/image/pic/item/a044ad345982b2b72352760233adcbef77099b23.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/0d338744ebf81a4cb3d7b1c8d52a6059242da6ce.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/1f178a82b9014a90ea6795bcab773912b31bee52.jpg",
  "http://a.hiphotos.baidu.com/image/pic/item/58ee3d6d55fbb2fb0b8681104d4a20a44623dc07.jpg",
  "http://g.hiphotos.baidu.com/image/pic/item/2cf5e0fe9925bc31eaabd6875cdf8db1cb13703f.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/ac4bd11373f082022707d43e49fbfbedab641b1d.jpg",
  "http://b.hiphotos.baidu.com/image/pic/item/f9198618367adab49ba3154489d4b31c8701e442.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/a9d3fd1f4134970af47bca2e97cad1c8a7865da3.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/7aec54e736d12f2e5c87006a4dc2d5628535683e.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/962bd40735fae6cd8cb174600db30f2442a70fae.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/d8f9d72a6059252d93f32f35379b033b5bb5b91e.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/5243fbf2b211931372c468a064380cd791238d1f.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/f2deb48f8c5494eeedbf4f1f2ff5e0fe99257e12.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/d1160924ab18972b7e1501c0e4cd7b899e510a88.jpg",
  "http://a.hiphotos.baidu.com/image/pic/item/962bd40735fae6cd7b087f600db30f2442a70f76.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/42a98226cffc1e1798d5543c4890f603738de951.jpg",
  "http://b.hiphotos.baidu.com/image/pic/item/5bafa40f4bfbfbeda221eb7e7af0f736afc31fb2.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/3c6d55fbb2fb4316271aa47322a4462309f7d3b6.jpg",
  "http://d.hiphotos.baidu.com/image/pic/item/c8177f3e6709c93d230252f69d3df8dcd100543a.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/279759ee3d6d55fbc6e5fc2b6f224f4a20a4dd98.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/f9198618367adab4b86834b689d4b31c8601e48f.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/0eb30f2442a7d9333a9724faaf4bd11373f00178.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/d009b3de9c82d15849414dbf820a19d8bd3e42f8.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/6159252dd42a28342b92310559b5c9ea15cebf83.jpg",
  "http://g.hiphotos.baidu.com/image/pic/item/0e2442a7d933c895f7056f7ad31373f0820200b3.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/2934349b033b5bb5fbe537f034d3d539b600bc89.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/00e93901213fb80eccc491d634d12f2eb938949e.jpg",
  "http://b.hiphotos.baidu.com/image/pic/item/4bed2e738bd4b31caed846ba85d6277f9f2ff8cf.jpg",
  "http://g.hiphotos.baidu.com/image/pic/item/8ad4b31c8701a18bc174eb4f9c2f07082838fe17.jpg",
  "http://b.hiphotos.baidu.com/image/pic/item/4034970a304e251f246fd5faa586c9177f3e5313.jpg",
  "http://d.hiphotos.baidu.com/image/pic/item/54fbb2fb43166d224c341417472309f79152d2f5.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/6f061d950a7b02086ebd01e260d9f2d3572cc8b8.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/f9dcd100baa1cd11afe3a121bb12c8fcc3ce2d5e.jpg",
  "http://a.hiphotos.baidu.com/image/pic/item/fd039245d688d43fdf04d1f47f1ed21b0ef43b02.jpg",
  "http://a.hiphotos.baidu.com/image/pic/item/08f790529822720e0480e2f879cb0a46f21fab61.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/37d3d539b6003af3bf663c60372ac65c1138b6d6.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/359b033b5bb5c9eadf33bde2d739b6003bf3b3eb.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/8cb1cb1349540923a220767c9058d109b3de4962.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/cf1b9d16fdfaaf519fbd96b18e5494eef01f7a65.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/9c16fdfaaf51f3de2b907c6596eef01f3a297995.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/b2de9c82d158ccbf995d32371bd8bc3eb03541de.jpg",
  "http://a.hiphotos.baidu.com/image/pic/item/8435e5dde71190ef0ed5b750cc1b9d16fdfa6016.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/35a85edf8db1cb13cd8c10d2df54564e93584b0d.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/8cb1cb1349540923c292d67f9058d109b3de4933.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/a8014c086e061d952d01f53179f40ad162d9ca70.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/0df431adcbef7609a4842f9e2cdda3cc7cd99e20.jpg",
  "http://a.hiphotos.baidu.com/image/pic/item/77c6a7efce1b9d16cd04f363f1deb48f8d5464f4.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/4b90f603738da9773e924d33b251f8198618e36d.jpg",
  "http://d.hiphotos.baidu.com/image/pic/item/267f9e2f0708283844835516ba99a9014c08f122.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/86d6277f9e2f070824e61503eb24b899a801f2d5.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/2934349b033b5bb5167a60ff34d3d539b600bc06.jpg",
  "http://b.hiphotos.baidu.com/image/pic/item/e7cd7b899e510fb3f66ea99edb33c895d1430c40.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/d788d43f8794a4c2d066f1df0ff41bd5ac6e39f8.jpg",
  "http://d.hiphotos.baidu.com/image/pic/item/d4628535e5dde7112b6bbaf7a5efce1b9d166172.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/8b82b9014a90f603be069f463b12b31bb051ed79.jpg",
  "http://b.hiphotos.baidu.com/image/pic/item/faedab64034f78f036af9cf97b310a55b3191c17.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/f11f3a292df5e0feab21d9835d6034a85edf7272.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/09fa513d269759ee0933a8c6b0fb43166d22df58.jpg",
  "http://d.hiphotos.baidu.com/image/pic/item/241f95cad1c8a786f2ca020f6509c93d71cf50ca.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/5ab5c9ea15ce36d3071e333138f33a87e950b19d.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/d52a2834349b033b7e61e7d417ce36d3d439bdd6.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/e4dde71190ef76c6386f24229f16fdfaaf51677e.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/9345d688d43f87941b5972a1d01b0ef41ad53a9e.jpg",
  "http://g.hiphotos.baidu.com/image/pic/item/d6ca7bcb0a46f21f68cf0790f4246b600d33ae7e.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/d788d43f8794a4c2a26e22290cf41bd5ad6e3967.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/e7cd7b899e510fb3d3e745a6da33c895d1430c00.jpg",
  "http://b.hiphotos.baidu.com/image/pic/item/5366d0160924ab184e1cd03537fae6cd7b890bad.jpg",
  "http://b.hiphotos.baidu.com/image/pic/item/91ef76c6a7efce1bbc7f97cbad51f3deb48f655e.jpg",
  "http://d.hiphotos.baidu.com/image/pic/item/91529822720e0cf3acf7b8fa0846f21fbe09aaab.jpg",
  "http://d.hiphotos.baidu.com/image/pic/item/6609c93d70cf3bc71c70c3ebd300baa1cd112a40.jpg",
  "http://a.hiphotos.baidu.com/image/pic/item/242dd42a2834349b6321a984cbea15ce36d3be88.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/b7fd5266d016092414c58a18d60735fae7cd34d4.jpg",
  "http://g.hiphotos.baidu.com/image/pic/item/d53f8794a4c27d1e4c123cca19d5ad6eddc43883.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/bd315c6034a85edf19b5cc2d4b540923dd547586.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/a8ec8a13632762d04db8e1bea2ec08fa513dc629.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/e850352ac65c10380e02f9c0b0119313b07e89b7.jpg",
  "http://a.hiphotos.baidu.com/image/pic/item/738b4710b912c8fc4b79fcd4fe039245d6882124.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/1e30e924b899a901d36112371f950a7b0208f55f.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/6a63f6246b600c33ababf0cb184c510fd8f9a1e6.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/472309f7905298228e0c4cdad5ca7bcb0a46d4e8.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/f9198618367adab4e838444289d4b31c8601e4c3.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/77c6a7efce1b9d16113d0e99f2deb48f8d546454.jpg",
  "http://d.hiphotos.baidu.com/image/pic/item/c2cec3fdfc039245ed7b440e8594a4c27c1e25e0.jpg",
  "http://b.hiphotos.baidu.com/image/pic/item/eac4b74543a982267e5253a58b82b9014b90eba5.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/d000baa1cd11728b9a505eedcafcc3cec2fd2c84.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/c2cec3fdfc039245b4eabd0e8594a4c27d1e2557.jpg"
];
