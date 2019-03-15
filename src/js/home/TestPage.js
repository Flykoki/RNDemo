import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet
} from "react-native";

import SearchView from "../component/SearchView";
let _navigation;
export default class TestPage extends Component {

  static navigationOptions = ({ navigation }) => {
    _navigation = navigation;
    return {
      header: null,
      title: null,
      headerRight: null,
      headerLeft: null
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      sortDataIndex: 0,
      updatePanelState: 0,
      searchResponseData: [],
      selectedItem: {}
    };
    this.searchView = React.createRef();
  }
  render() {
    return (
      <View
        style={{ flex: 1 }}
        onTouchStart={e => console.log("lfj View onTouchStart")}
      >
        <FlatList
          onTouchStart={e => console.log("lfj FlatList onTouchStart")}
          style={{ flex: 1 }}
          data={[{ key: "a" }, { key: "b" }]}
          ItemSeparatorComponent={() => (
            <View
              style={{ height: 1, width: "100%", backgroundColor: "green" }}
            />
          )}
          renderItem={({ item }) => (
            <View style={{ flexDirection: "column" }}>
              <TouchableOpacity
                onTouchStart={e =>
                  console.log("lfj TouchableOpacity onTouchStart")
                }
                style={{ height: 40, width: "100%", backgroundColor: "grey" }}
              >
                <Text
                  onStartShouldSetResponderCapture={e => true}
                  onMoveShouldSetResponderCapture={e => true}
                  onTouchStart={e =>
                    console.log("lfj Text onTouchStart", e.nativeEvent)
                  }
                >
                  {item.key}
                </Text>
              </TouchableOpacity>
              <SearchView
                ref="searchView"
                placeholder={"请输入车架号或车牌号"}
                onCancelCallback={() => {
                  _navigation.goBack();
                }}
                onChangeText={text => {
                  this.props.onChangeText
                    ? this.props.onChangeText()
                    : this._onChangeText(text);
                }}
                onHistoryItemCallback={item => {
                  console.warn("lfj test page get history item", item);
                  this.setState({ updatePanelState: 2 });
                }}
                searchType={0}
                searchResponseData={this.state.searchResponseData}
                selectedItem={this.state.selectedItem}
                renderItem={this._renderItem}
                updatePanelState={this.state.updatePanelState}
              />
            </View>
          )}
        />
      </View>
    );
  }

  /**
   * 搜索框文本变化事件
   */
  _onChangeText = text => {
    if (text) {
      this.setState({ updatePanelState: 1 });
      clearTimeout(this.timerId); //如搜索的内容变化在1秒之中，可以清除变化前的fetch请求，继而减少fetch请求。但不能中断fetch请求
      this.timerId = setTimeout(() => {
        let random = Math.floor(Math.random() * (9 - 1 + 1)) + 1;
        let result = [];
        for (let i = 0; i < random; i++) {
          result.push({ key: text + i, value: text + i });
        }
        console.log("lfj random result", result);
        this.setState({ updatePanelState: 3, searchResponseData: result });
      }, 500); //让每次要进行fetch请求时先延迟1秒在进行
    }
  };
}
