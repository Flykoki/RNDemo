import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  ScrollView,
  Image,
  Easing,
  StyleSheet
} from "react-native";

export default class FilterView extends Component {
  animationLoading;
  _navigation;
  constructor(props) {
    super(props);
    // console.log("lfj this.props:", this.props);
    this.state = {
      rotateVal: new Animated.Value(0),
      searchButtonOnPress: false,
      isLoading: false,
      filterResponse: this.props.filterResponse
        ? this.props.filterResponse
        : [], //后台返回的筛选结果
      normalFilterMap: this.props.normalFilterMap
        ? this.props.normalFilterMap
        : new Map()
    };
    _navigation = this.props.navigation;
    animationLoading = Animated.timing(
      this.state.rotateVal, // 初始值
      {
        toValue: 360, // 终点值
        easing: Easing.linear // 这里使用匀速曲线，详见RN-api-Easing
      }
    );
  }
  render() {
    return (
      <ScrollView
        onStartShouldSetResponder={event => {
          console.warn("scrollView 注册,", event);
          return true;
        }}
        onResponderGrant={event => {
          console.warn("scrollView 注册成功");
        }}
        onResponderReject={event => {
          console.warn("scrollView 注册失败");
        }}
        onResponderRelease={event => {
          console.warn("scrollView 响应结束");
          this.props.onTouchCancel();
        }}
        onPress={() => {
          console.warn("scrollview onPress");
          this.props.onTouchCancel();
        }}
        style={[styles.filterContainer, this.props.style]}
      >
        <View style={styles.filterContent}>
          {this.props.data &&
            this.props.data.length > 0 &&
            this._initFilterViews(this.props.data)}
          {this.props.data &&
            this.props.data.length > 0 &&
            this._initFilterDivider()}
          {this.props.data &&
            this.props.data.length > 0 &&
            this._initButtonViews()}
        </View>
      </ScrollView>
    );
  }

  //============================= 自定义方法 ===================================
  /**
   * 启动loading动画
   */
  _startLoadingAnimated() {
    Animated.loop(animationLoading).start();
  }
  /**
   * 结束loading动画
   */
  _stopLoadingAnimated() {
    Animated.loop(animationLoading).stop();
  }
  /**
   * 获取 Filters 布局
   */
  _initFilterViews = dataArray => {
    // console.log('lfj dataArray,',dataArray)
    let items = dataArray.map((item, index, dataArray) => {
      return this._initFilterItem(item);
    });
    return items;
  };

  /**
   * 获取 filter item 布局
   */
  _initFilterItem = item => {
    if (item.type === "normal") {
      let items = this._initFilterItemNormal(item);
      return items;
    } else if (item.type === "date") {
      let items = this._initFilterItemDate(item);
      return items;
    }
    return null;
  };

  /**
   * 初始化普通filter
   */
  _initFilterItemNormal = item => {
    return (
      <View style={styles.normalItem}>
        <Text style={styles.normalItemTitle}>{item.title}</Text>
        <View style={styles.normalItems}>
          {item.items && this._getNormalItemChild(item)}
        </View>
      </View>
    );
  };

  /**
   * 获取具体  时间筛选选项
   */
  _getDateItemChild = item => {
    let itemArray = item.items;
    let itemTitle = item.title;
    let tempMap = this.state.normalFilterMap;
    let lastDate = tempMap.get(itemTitle);
    return (
      <View style={styles.calenderContainer}>
        <Text
          style={
            lastDate && this._lastDateIsCusDefined(lastDate, itemArray)
              ? styles.calenderSelected
              : styles.calenderDefault
          }
          onPress={() => {
            console.warn("calender 事件");
            //先将已选date数据清空
            tempMap.delete(itemTitle);
            // 启动日历控件选择时间
            console.log('lfj start calender screen')
            _navigation &&
              this.props.navigation.navigate("CalenderScreen", {
                onConfirm: item => {
                  console.log("lfj item = ", item);
                  tempMap.set(itemTitle, item[0] + "-" + item[1]);
                  this.setState({ normalFilterMap: tempMap });
                  this.props.onNormalFilterCallback(tempMap);
                  //todo 到后台请求数据
                  this._getFilterResponse(tempMap);
                }
              });
          }}
        >
          {lastDate && this._lastDateIsCusDefined(lastDate, itemArray)
            ? lastDate
            : "自定义日期"}
        </Text>
        <Text
          style={
            lastDate && this._lastDateIsCusDefined(lastDate, itemArray)
              ? styles.calenderClearEnable
              : styles.calenderClearDisable
          }
          onPress={() => {
            if (lastDate && this._lastDateIsCusDefined(lastDate, itemArray)) {
              tempMap.delete(itemTitle);
              this.setState({ normalFilterMap: tempMap });
              this.props.onNormalFilterCallback(tempMap);
            }
          }}
        >
          清空
        </Text>
      </View>
    );
  };

  /**
   * 调用后台接口获取筛选结果
   */
  _getFilterResponse = tempMap => {
    // console.log("lfj start request ");
    this.setState({ isLoading: true, normalFilterMap: tempMap });
    this._startLoadingAnimated();
    // todo
    setTimeout(() => {
      // console.log("lfj end request");
      let random = Math.floor((Math.random() * 100) % 100);
      // console.log("lfj random：", random);
      this.setState({ isLoading: false, filterResponse: new Array(random) });
      this._stopLoadingAnimated();
      this.props.onFilterResponseCallback &&
        this.props.onFilterResponseCallback(this.state.filterResponse);
    }, 1000);
  };

  /**
   * 获取日历时间
   */
  _getDateFromCalenderView = calender => {
    // todo 调用日历控件获取时间

    calender = "22-11";
  };

  /**
   * 判断当前时期是否为自定义日期
   */
  _lastDateIsCusDefined = (lastDate, dataArray) => {
    let isCusDefined = true;

    for (let i = 0; i < dataArray.length; i++) {
      if (dataArray[i] === lastDate) {
        return false;
      }
    }
    return isCusDefined;
  };

  /**
   * 获取具体筛选选项
   */
  _getNormalItemChild = item => {
    let itemArray = item.items;
    let multiple = item.filterMultiple;
    let type = item.type;
    let itemTitle = item.title;
    // console.log("lfj _getNormalItemChild:", this.state);
    return itemArray.map((detail, index) => {
      return (
        <TouchableOpacity
          style={
            multiple
              ? this.state.normalFilterMap.has(itemTitle + detail)
                ? styles.normalItemSelected
                : styles.normalItemDefault
              : this.state.normalFilterMap.has(itemTitle) &&
                this.state.normalFilterMap.get(itemTitle) === detail
              ? styles.normalItemSelected
              : styles.normalItemDefault
          }
          onPress={() => {
            let tempMap = this.state.normalFilterMap;
            if (multiple) {
              if (tempMap.has(itemTitle + detail)) {
                tempMap.delete(itemTitle + detail);
              } else {
                tempMap.set(itemTitle + detail, detail);
              }
            } else {
              //日期只能单选，以title 作为 map的 key
              if (tempMap.has(itemTitle) && tempMap.get(itemTitle) === detail) {
                tempMap.delete(itemTitle);
              } else {
                tempMap.set(itemTitle, detail);
              }
            }
            // console.log("lfj map size", tempMap.size);
            // this.setState({ normalFilterMap: tempMap });
            this.props.onNormalFilterCallback &&
              this.props.onNormalFilterCallback(tempMap);

            //todo 到后台请求数据
            this._getFilterResponse(tempMap);
          }}
        >
          <Text
            style={
              multiple
                ? this.state.normalFilterMap.has(itemTitle + detail)
                  ? styles.normalItemTextSelected
                  : styles.normalItemTextDefault
                : this.state.normalFilterMap.has(itemTitle) &&
                  this.state.normalFilterMap.get(itemTitle) === detail
                ? styles.normalItemTextSelected
                : styles.normalItemTextDefault
            }
          >
            {detail}
          </Text>
        </TouchableOpacity>
      );
    });
  };

  /**
   * 初始化日期filter
   */
  _initFilterItemDate = item => {
    return (
      <View style={styles.normalItem}>
        <Text style={styles.normalItemTitle}>{item.title}</Text>
        <View style={styles.normalItems}>
          {item.items && this._getNormalItemChild(item)}
        </View>
        {item.items && this._getDateItemChild(item)}
      </View>
    );
  };

  /**
   * 获取 divider 布局
   */
  _initFilterDivider = () => {
    return <View style={styles.divider} />;
  };
  /**
   * 获取 buttonViews 布局
   */
  _initButtonViews = () => {
    // console.log(
    //   "init button:",
    //   this.state.isLoading,
    //   this.state.filterResponse,
    //   this.state.normalFilterMap
    // );
    return (
      <View style={styles.searchButtonContainer}>
        <TouchableOpacity
          style={styles.searchButtonLeft}
          onPress={() => {
            let temp = new Map();
            this.setState({
              normalFilterMap: temp,
              filterResponse: []
            });
            this.props.onNormalFilterCallback &&
              this.props.onNormalFilterCallback(temp);
              // todo
            this._getFilterResponse(temp);
          }}
        >
          <Text style={styles.searchButtonLeftText}>重置</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={
            this.state.isLoading || this.state.filterResponse.length > 0
              ? styles.searchButtonRightSelected
              : styles.searchButtonRightDefault
          }
        >
          {this.state.isLoading ? (
            <Animated.Image
              style={[
                {
                  transform: [
                    {
                      // 动画属性
                      rotate: this.state.rotateVal.interpolate({
                        inputRange: [0, 360],
                        outputRange: ["0deg", "360deg"]
                      })
                    }
                  ]
                }
              ]}
              source={require("../../res/img/icon_app_loading.png")}
            />
          ) : this.state.normalFilterMap.size > 0 ||
            this.state.filterResponse.length > 0 ? (
            <Text style={styles.searchButtonRightTextResponse}>
              {"查看" + this.state.filterResponse.length + "个结果"}
            </Text>
          ) : (
            <Text style={styles.searchButtonRightText}>查看</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  _startAnimation() {
    this.state.rotateValue.setValue(0);
    Animated.timing(this.state.rotateValue, {
      toValue: 1,
      duration: 800,
      easing: Easing.linear
    }).start(() => this.startAnimation());
  }
}

FilterView.propTypes = {
  data: PropTypes.array, // 所有的filter集合
  items: PropTypes.array, // 具体的子 item 中 filter数组
  title: PropTypes.string, //filter的标题
  type: PropTypes.oneOf(["date", "normal"]), //filter 类型 ：日期和普通
  filterMultiple: PropTypes.bool, // 是否多选
  normalFilterMap: PropTypes.object, // 已选中普通filter map
  onNormalFilterCallback: PropTypes.func, // 普通筛选item点击事件回调
  onFilterResponseCallback: PropTypes.func // 后台返回筛选结果回调
};
const styles = StyleSheet.create({
  calenderContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  calenderDefault: {
    color: "#474747",
    borderColor: "#DDDDDD",
    borderRadius: 6,
    textAlign: "center",
    borderWidth: 1,
    flex: 1,
    paddingTop: 6,
    paddingBottom: 6,
    marginTop: 10,
    marginLeft: 8,
    fontSize: 14
  },
  calenderSelected: {
    color: "#F12E49",
    borderColor: "#F12E49",
    borderRadius: 6,
    textAlign: "center",
    borderWidth: 1,
    flex: 1,
    paddingTop: 6,
    paddingBottom: 6,
    marginTop: 10,
    marginLeft: 8,
    fontSize: 14
  },
  calenderClearEnable: {
    color: "#4A90E2",
    marginTop: 10,
    paddingBottom: 6,
    paddingTop: 6,
    fontSize: 14,
    textAlign: "center",
    marginLeft: 15,
    marginRight: 15
  },
  calenderClearDisable: {
    color: "transparent",
    marginTop: 10,
    paddingBottom: 6,
    paddingTop: 6,
    fontSize: 14,
    textAlign: "center",
    marginLeft: 15,
    marginRight: 15
  },
  normalItemTextDefault: {
    borderColor: "#333333",
    fontSize: 14,
    height: "100%",
    textAlign: "center",
    textAlignVertical: "center"
  },
  normalItemTextSelected: {
    borderColor: "#F12E49",
    height: "100%",
    fontSize: 14,
    textAlign: "center",
    textAlignVertical: "center"
  },
  normalItemDefault: {
    borderColor: "#DDDDDD",
    borderWidth: 1,
    marginTop: 10,
    marginLeft: 8,
    marginRight: 8,
    width: 94,
    height: 32,
    borderRadius: 6
  },
  normalItemSelected: {
    borderColor: "#F12E49",
    borderWidth: 1,
    marginTop: 10,
    marginLeft: 8,
    marginRight: 8,
    width: 94,
    height: 32,
    borderRadius: 6
  },
  normalItems: {
    flexDirection: "row",
    flexWrap: "wrap"
  },
  normalItemTitle: {
    color: "#333333",
    fontSize: 14,
    marginTop: 18,
    marginLeft: 8
  },
  normalItem: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginLeft: 22,
    marginRight: 22
  },
  searchButtonLeftText: {
    zIndex: 1,
    color: "#666666",
    fontSize: 16
  },
  searchButtonRightText: {
    color: "#666666",
    zIndex: 2,
    fontSize: 16
  },
  searchButtonRightTextResponse: {
    color: "#FFFFFF",
    zIndex: 2,
    fontSize: 16
  },
  divider: {
    backgroundColor: "#F0F0F0",
    height: 1,
    marginTop: 20,
    marginLeft: 25,
    marginRight: 25
  },
  searchButtonLeft: {
    position: "relative",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    marginTop: 15,
    height: 42,
    width: 152,
    justifyContent: "center",
    alignItems: "center"
  },
  searchButtonRightDefault: {
    position: "relative",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    marginTop: 15,
    height: 42,
    width: 152,
    justifyContent: "center",
    alignItems: "center"
  },
  searchButtonRightSelected: {
    position: "relative",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#F12E49",
    backgroundColor: "#F12E49",
    marginTop: 15,
    height: 42,
    width: 152,
    justifyContent: "center",
    alignItems: "center"
  },
  searchButtonContainer: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 15
  },
  filterContainer: {
    // width: "100%",
    // height: "100%",
    // backgroundColor: "rgba(0,0,0,0.3)"
  },
  filterContent: {
    marginBottom: 46,
    flexDirection: "column",
    justifyContent: "flex-start",
    backgroundColor: "#FFFFFF"
  }
});
