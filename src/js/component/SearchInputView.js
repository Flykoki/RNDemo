import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  Animated,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Easing,
  FlatList,
  StyleSheet,
  Dimensions
} from "react-native";

export default class SearchInputView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: "",
      searchResponseData: [], //即时搜索结果
      panelState: 0, //当前panel状态{0:"默认",1:"搜索中",2:"未找到结果",3:"搜索结果",4:"历史搜索记录"}
      historyType: 0, // 搜索类型{0:"资产",1:"买买车",2:"闪贷"}
      historyData:[]//历史抖索记录 [{type:historyType,data:{}}]
    };
  }

  render() {
    {
      this._updateStateFromProps(this.props);
    }
    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <View style={styles.topInputTextContainer}>
            <TextInput
              style={styles.topInputText}
              maxLength={20}
              placeholder={"请输入车架号或车牌号"}
              selectionColor={"#CCCCCC"}
              onChangeText={text => {
                this.props.onChangeText
                  ? this.props.onChangeText
                  : this._onSearchTextChange(text);
                this.setState({ searchText: text, panelState: 1 });
              }}
              value={this.state.searchText}
            />
            <TouchableOpacity
              activeOpacity={1}
              style={styles.topInputTextRightImgContainer}
              onPress={() => {
                this._onTextInputRightImgPress();
              }}
            >
              <Image
                resizeMode={"contain"}
                style={{ width: 18, height: 18 }}
                source={
                  this.state.searchText.length > 0
                    ? require("../../res/img/icon_app_delete.png")
                    : require("../../res/img/icon_app_scan.png")
                }
              />
            </TouchableOpacity>
          </View>

          <Text
            style={styles.topCancelText}
            onPress={() => {
              this._topCancelTextOnPress();
            }}
          >
            取消
          </Text>
        </View>
        {this.state.panelState !== 4 && <View style={styles.topDivider} />}
        {this._getPanelViewFromPanelState(this.state.panelState)}
      </View>
    );
  }

  //================================== 自定义方法 =====================================
  /**根据props获取更新state
   */
  _updateStateFromProps = props => {
    props.panelState && (this.state.panelState = props.panelState);
    props.searchResponseData &&
      (this.state.searchResponseData = props.searchResponseData);
      props.selectedItem.data && (this.state.historyData)
  };
  /**
   * 根据当前状态获取panel 显示view
   */
  _getPanelViewFromPanelState = panelState => {
    //当前panel状态{0:"默认",1:"搜索中",2:"未找到结果",3:"搜索结果",4:"历史搜索记录"}
    switch (panelState) {
      case 1:
        return this._getSearchView();
        break;
      case 2:
        return this._getSearchNoResult();
        break;
      case 3:
        return this._getSearchWithResult();
        break;
      case 4:
        return this._getSearchHistory();
        break;
      default:
        break;
    }
  };

  /**
   * panelState:4 ，展示搜索历史记录
   */
  _getSearchHistory = () => {
    return (
      <View style={styles.searchNoResultContainer}>
        <Image
          resizeMode={"contain"}
          style={styles.searchNoResultImg}
          source={require("../../res/img/icon_app_search_no_result.png")}
        />
        <Text style={styles.searchNoResultText}>
          {"未搜索到结果\n请核对您输入的信息,或换个关键词重新搜索"}
        </Text>
      </View>
    );
  };
  /**
   * panelState:3 ，展示搜索结果
   */
  _getSearchWithResult = () => {
    return (
      <View>
        <FlatList
          data={this.state.searchResponseData}
          renderItem={
            this.props.renderItem
              ? this.props.renderItem
              : this._renderSearchResultItem
          }
        />
      </View>
    );
  };

  _renderSearchResultItem = ({ item }) => {
    return (
      <View style={styles.searchResultItemContainer}>
        <View style={styles.searchResultItem}>
          <Tex style={styles.searchResultItemName}>{item.vehicleName}</Tex>
          <Text style={styles.searchResultItemType}>{item.vehicleType}</Text>
          <Tex style={styles.searchResultItemTime}>{item.time}</Tex>
        </View>
      </View>
    );
  };

  /**
   * panelState:2 ，未找到结果
   */
  _getSearchNoResult = () => {
    return (
      <View style={styles.searchNoResultContainer}>
        <Image
          resizeMode={"contain"}
          style={styles.searchNoResultImg}
          source={require("../../res/img/icon_app_search_no_result.png")}
        />
        <Text style={styles.searchNoResultText}>
          {"未搜索到结果\n请核对您输入的信息,或换个关键词重新搜索"}
        </Text>
      </View>
    );
  };

  /**
   * panelState:1, 搜索中
   */
  _getSearchView = () => {
    return <Text style={styles.panelStateSearching}>正在搜索…</Text>;
  };

  /**
   * textInput 文本变化事件
   */
  _onSearchTextChange = text => {
    //todo 间隔1s没文本变化就搜索
    let currentDate = new Date().getSeconds;
    console.log("lfj searchText", currentDate, this.lastSearchData);
    if (text) {
      clearTimeout(this.timerId); //如搜索的内容变化在1秒之中，可以清除变化前的fetch请求，继而减少fetch请求。但不能中断fetch请求
      this.setState({ searchText: text, panelState: 1 });
      this.timerId = setTimeout(() => {
        let random = Math.floor(Math.random() * (9 - 1 + 1)) + 1;
        let result = new Array(random);
        for (let i = 0; i < random; i++) {
          result.push(text + i);
        }
        this.setState({ panelState: 3, searchResponseData: result });
        this.props.searchResultCallback &&
          this.props.searchResultCallback(result);
      }, 500); //让每次要进行fetch请求时先延迟1秒在进行
    } else {
      this.setState({ searchText: "" });
    }
  };

  /**
   * 右上角取消按钮点击事件
   */
  _topCancelTextOnPress = () => {
    console.warn("取消点击事件");
  };
  /**
   *  textInput右侧图标点击事件
   */
  _onTextInputRightImgPress = () => {
    this.state.searchText.length > 0
      ? this.setState({ searchText: "" })
      : console.warn("start scan view");
  };
}

SearchInputView.Prototype = {
  searchResultCallback: PropTypes.func, //搜索结果回调
  renderItem: PropTypes.func //搜索结果展示默认flatList展示
};

const styles = StyleSheet.create({
  searchResultItemTypeNew: {},
  searchResultItemTime: {
    flex: 1,
    color: "#999999",
    fontSize: 14,
    marginLeft: 15,
    marginTop: 11
  },
  searchResultItemName: {
    flex: 1,
    color: "#333333",
    fontSize: 15,
    marginLeft: 35,
    marginTop: 11
  },
  searchResultItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  searchResultItemContainer: {
    backgroundColor: "#FFFFFF",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10
  },
  searchNoResultText: {
    textAlign: "center",
    color: "#999999",
    fontSize: 15
  },
  searchNoResultImg: {
    height: 130,
    width: 130
  },
  searchNoResultContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#666666",
    fontSize: 14
  },
  panelStateSearching: {
    marginTop: 22,
    width: "100%",
    textAlign: "center",
    color: "#666666",
    fontSize: 14
  },
  container: {
    height: "100%",
    width: "100%",
    flexDirection: "column",
    backgroundColor: "#F8F8F8",
    justifyContent: "flex-start"
  },
  topContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    justifyContent: "space-between"
  },
  topCancelText: {
    color: "#666666",
    fontSize: 14,
    margin: 15
  },
  topDivider: {
    backgroundColor: "#F0F0F0",
    height: 1
  },
  topInputText: {
    flex: 1,
    fontSize: 12,
    borderRadius: 3,
    borderColor: "#F7F7F8",
    backgroundColor: "#F7F7F8",
    color: "#333333"
  },
  topInputTextContainer: {
    flex: 1,
    height: 35,
    marginLeft: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  topInputTextRightImgContainer: {
    position: "absolute",
    right: 0,
    marginRight: 12,
    marginTop: 6,
    marginBottom: 6,
    marginLeft: 12
  }
});
