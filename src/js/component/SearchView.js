import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  Animated,
  TextInput,
  TouchableOpacity,
  AsyncStorage,
  ScrollView,
  Image,
  Easing,
  FlatList,
  Keyboard,
  StyleSheet,
  Dimensions
} from "react-native";

export default class SearchView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: "",
      searchResponseData: this.props.searchResponseData
        ? this.props.searchResponseData
        : [], //即时搜索结果 { key: string, object: obj }
      panelState: this.props.panelState ? this.props.panelState : 0, //当前panel状态{0:"默认",1:"搜索中",2:"未找到结果",3:"搜索结果",4:"历史搜索记录"}
      selectedItem: {}, //选中的搜索结果
      showClearHistoryConfirm: false, //显示删除历史记录确认按钮
      historyType: 0, // 历史搜索类型{0:"资产",1:"买买车",2:"闪贷"}
      showHistoryData: new Set(), //默认显示不重复的8条历史记录
      historyData: [] //历史搜索记录[{type:historyType,data:itemData},{type:historyType,data:itemData}] 由于AsynStorage中数组转为字符串存入后取出转为数组有问题，暂时先用JsonString保存历史记录
    };
  }

  componentDidMount() {
    this._getHistoryData().then(value => {
      let json = JSON.parse(value);
      json && this.setState({ panelState: 4, historyData: json });
    }); //从asyncStorage中获取历史记录
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this._keyboardDidShow
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this._keyboardDidHide
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  render() {
    console.log("lfj render searchView", this.state);
    {
      this._updateStateFromProps(this.props);
    }
    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <View style={styles.topInputTextContainer}>
            <TextInput
              ref={c => (this.textInputRef = c)}
              style={styles.topInputText}
              autoFocus={true}
              maxLength={20}
              placeholder={"请输入车架号或车牌号"}
              selectionColor={"#CCCCCC"}
              onSubmitEditing={Keyboard.dismiss}
              onChangeText={text => {
                console.log("lfj text", text);
                this.setState({ searchText: text, panelState: 1 });
                if (text) {
                  this.props.onChangeText
                    ? this.props.onChangeText(text)
                    : this._onSearchTextChange(text);
                } else {
                  this.state.historyData.length > 0
                    ? this.setState({
                        searchText: "",
                        panelState: 4,
                        searchResponseData: []
                      })
                    : this.setState({
                        searchText: "",
                        panelState: 0,
                        searchResponseData: []
                      });
                }
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

  /**
   * 获取历史记录
   */
  _getHistoryData = async () => {
    try {
      return await AsyncStorage.getItem(String(this.state.historyType));
    } catch (error) {
      // Error retrieving data
      console.log(error);
    }
  };

  /**
   * 保存历史记录
   */
  _saveHistoryData = async item => {
    let lastData = this.state.historyData;
    lastData.push({ type: this.state.historyType, data: item });
    let jsonStr = JSON.stringify(lastData);
    try {
      await AsyncStorage.setItem(String(this.state.historyType), jsonStr);
    } catch (error) {
      // Error saving data
      console.log(error);
    }
  };

  /**
   * 删除历史记录
   */
  _deleteHistoryData = () => {
    try {
      AsyncStorage.removeItem(this.state.historyType + "");
    } catch (e) {
      console.log(e);
    }
  };
  lastUpdatePanelState = this.props.updatePanelState; //用户保存外部传入的panel状态
  /**
   * 根据props更新state
   */
  _updateStateFromProps = props => {
    this.lastUpdatePanelState !== props.updatePanelState
      ? (this.state.panelState = props.updatePanelState) &&
        (this.lastUpdatePanelState = props.updatePanelState)
      : {};
    this.state.searchResponseData = props.searchResponseData;
    props.selectedItem.data !== undefined
      ? this._saveHistoryData(props.selectedItem.data)
      : {};
  };
  /**
   * 显示键盘
   */
  _keyboardDidShow() {}
  /**
   * 隐藏键盘
   */
  _keyboardDidHide() {}

  /**
   * 根据当前状态获取panel 显示view
   */
  _getPanelViewFromPanelState = panelState => {
    console.log("lfj currentState", panelState);
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
   * panelState:1, 搜索中
   */
  _getSearchView = () => {
    return <Text style={styles.panelStateSearching}>正在搜索…</Text>;
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
  /**
   * panelState:4 ，展示历史记录
   */
  _getSearchHistory = () => {
    console.log("lfj render history view", this.state);
    let tempData;
    return (
      <View style={styles.searchHistoryContainer}>
        <View style={styles.searchHistoryTitle}>
          <Text style={styles.searchHistoryTitleLeft}>历史搜索记录</Text>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.searchHistoryTitleRightContainer}
            onPress={() => {
              this._searchHistoryTitleClearOnPress();
            }}
          >
            <Image
              resizeMode={"contain"}
              style={
                this.state.showClearHistoryConfirm
                  ? styles.searchHistoryTitleRightConfirm
                  : styles.searchHistoryTitleRight
              }
              source={
                this.state.showClearHistoryConfirm
                  ? require("../../res/img/icon_app_delete_confirm.png")
                  : require("../../res/img/icon_app_delete.png")
              }
            />
          </TouchableOpacity>
        </View>
        <FlatList
          style={styles.searchHistoryList}
          data={this._getData(this.state.historyData, 8)}
          renderItem={this._renderHistoryListItem}
        />
      </View>
    );
  };

  /**
   * 获取去重后的最近 n 个搜索历史记录
   */
  _getData = (data, count) => {
    let obj = {};
    //去重
    data = data.reduce((cur, next) => {
      obj[next.data.key] ? "" : (obj[next.data.key] = true && cur.push(next));
      return cur;
    }, []);
    data.reverse();
    //截取前count 个数据
    data = data.slice(0, count);
    return data;
  };

  /**
   * render 历史记录item
   */
  _renderHistoryListItem = ({ item }) => {
    let value = item.data.value;
    return this._renderHistoryListItemView(value);
    // let showHistoryData = this.state.showHistoryData;
    // console.log("lfj current history", showHistoryData, item);
    // if (showHistoryData.size < 8 && !showHistoryData.has(value)) {
    //   showHistoryData.add(value);
    //   return this._renderHistoryListItemView(value);
    // } else {
    //   return null;
    // }
  };

  _renderHistoryListItemView = value => {
    console.log("lfj render history item ", value);
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          this.setState({ panelState: 1 });
          this.props.onHistoryItemCallback &&
            this.props.onHistoryItemCallback(value);
        }}
        style={styles.searchHistoryListItemContainer}
      >
        <Text style={{ color: "#666666", fontSize: 14, marginLeft: 5 }}>
          {value}
        </Text>
      </TouchableOpacity>
    );
  };

  _renderSearchResultItem = ({ item }) => {
    return this.props.renderItem ? (
      this.props.renderItem
    ) : (
      <TouchableOpacity
        onPress={() => {
          console.warn("selected", item.object);
        }}
        style={styles.searchResultItemContainer}
      >
        <Text style={{ padding: 10 }}>{item.object}</Text>
      </TouchableOpacity>
    );
  };

  /**
   * 删除历史记录按钮点击事件
   */
  _searchHistoryTitleClearOnPress = () => {
    if (this.state.showClearHistoryConfirm) {
      this.setState({
        showClearHistoryConfirm: false,
        panelState: 0,
        historyData: []
      });

      this._deleteHistoryData();
    } else {
      this.setState({ showClearHistoryConfirm: true });
    }
    // this.state.showClearHistoryConfirm
    //   ? this.setState({
    //       showClearHistoryConfirm: false,
    //       panelState: 0,
    //       historyData: []
    //     })
    //   : this.setState({ showClearHistoryConfirm: true });
  };

  /**
   * textInput 文本变化事件
   */
  _onSearchTextChange = text => {
    //todo 间隔1s没文本变化就搜索
    if (text) {
      clearTimeout(this.timerId); //如搜索的内容变化在1秒之中，可以清除变化前的fetch请求，继而减少fetch请求。但不能中断fetch请求
      this.setState({ searchText: text, panelState: 1 });
      this.timerId = setTimeout(() => {
        let random = Math.floor(Math.random() * (9 - 1 + 1)) + 1;
        let result = [];
        for (let i = 0; i < random; i++) {
          result.push({ key: text + i, object: text + i });
        }
        this.setState({ panelState: 3, searchResponseData: result });
        this.props.searchResultCallback &&
          this.props.searchResultCallback(result);
      }, 500); //让每次要进行fetch请求时先延迟1秒在进行
    } else {
      this.setState({ searchText: "", panelState: 0, searchResponseData: [] });
    }
  };
  /**
   * 右上角取消按钮点击事件
   */
  _topCancelTextOnPress = () => {
    this.props.onCancelCallback && this.props.onCancelCallback();
  };
  /**
   *  textInput右侧图标点击事件
   */
  _onTextInputRightImgPress = () => {
    this.state.searchText.length > 0
      ? this.state.historyData.length > 0
        ? this.setState({
            searchText: "",
            panelState: 4,
            searchResponseData: []
          })
        : this.setState({
            searchText: "",
            panelState: 0,
            searchResponseData: []
          })
      : console.warn("start scan view");
  };
}
SearchView.Prototype = {
  searchResultCallback: PropTypes.func, //搜索结果回调
  onCancelCallback: PropTypes.func, //取消事件回调
  onSearchCallback: PropTypes.func, //搜索事件回调
  onChangeText: PropTypes.func, //搜索框文本变化事件回调
  searchResponseData: PropTypes.array, //搜索结果,外部根据自己业务传入搜索结果，searchView来显示
  onItemViewClick: PropTypes.func, //搜索结果item点击事件，将item内容保存到 historyView中
  onHistoryItemCallback: PropTypes.func, //历史记录中item的点击事件
  panelState: PropTypes.number, //当前panel状态{0:"默认",1:"搜索中",2:"未找到结果",3:"搜索结果",4:"历史搜索记录"}
  selectedItem: PropTypes.object, //搜索结果中选中的item，存于historyData数组中用于历史记录展示
  historyType: PropTypes.number, // 历史搜索类型{0:"资产",1:"买买车",2:"闪贷"}
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
  searchHistoryContainer: {
    backgroundColor: "#FFFFFF",
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center"
  },
  searchHistoryList: {
    width: "100%"
  },
  searchHistoryTitle: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 22,
    marginRight: 22,
    marginBottom: 5,
    marginTop: 17,
    alignItems: "center"
  },
  searchHistoryTitleLeft: {
    flex: 1,
    color: "#666666",
    fontSize: 14
  },
  searchHistoryTitleRightConfirm: {
    height: 15,
    width: 31
  },
  searchHistoryTitleRightContainer: {
    height: 31,
    justifyContent: "center",
    alignItems: "center",
    width: 31
  },
  searchHistoryTitleRight: {
    height: 15,
    width: 15
  },
  searchResultItemContainer: {
    backgroundColor: "#FFFFFF",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10
  },
  searchHistoryListItemContainer: {
    width: "100%",
    height: 45,
    marginLeft: 15,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E5E5",
    justifyContent: "flex-start"
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
    backgroundColor: "white",
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
