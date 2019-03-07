import React, { Component } from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StatusBar,
  StyleSheet
} from "react-native";

import SearchView from "../component/SearchView";

export default class SearchViewPage extends Component {
  _navigation;
  static navigationOptions = ({ navigation }) => {
    this._navigation = navigation;
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

  componentDidMount() {
    this._navListener = this.props.navigation.addListener("didFocus", () => {
      StatusBar.setBarStyle("dark-content");
      StatusBar.setBackgroundColor("#FFFFFF");
    });
  }

  componentWillUnmount = () => {
    this._navListener.remove();
  };

  render() {
    return (
      <View>
        <SearchView
          ref="confirmPassText"
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
          searchResponseData={this.state.searchResponseData}
          selectedItem={this.state.selectedItem}
          renderItem={this._renderItem}
          updatePanelState={this.state.updatePanelState}
        />
      </View>
    );
  }

  _onChangeText = text => {
    this.setState({ updatePanelState: 1 });
    clearTimeout(this.timerId); //如搜索的内容变化在1秒之中，可以清除变化前的fetch请求，继而减少fetch请求。但不能中断fetch请求
    this.timerId = setTimeout(() => {
      let random = Math.floor(Math.random() * (9 - 1 + 1)) + 1;
      let result = [];
      for (let i = 0; i < random; i++) {
        result.push({ key: text + i, value: text + i });
      }
      this.setState({ updatePanelState: 3, searchResponseData: result });
    }, 500); //让每次要进行fetch请求时先延迟1秒在进行
  };

  _renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          // [{type:historyType,data:itemData},{type:historyType,data:itemData}]
          this.setState({ selectedItem: { data: item } });
          _navigation.goBack();
        }}
        style={styles.searchResultItemContainer}
      >
        <Text style={{ padding: 10 }}>{item.value}</Text>
      </TouchableOpacity>
    );
  };
}
const styles = StyleSheet.create({
  backButtonStyle: { marginLeft: 20, width: 50 },
  searchResultItemContainer: {
    backgroundColor: "#FFFFFF",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10
  }
});
