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
import AccountHelper from "../login/AccountHelper";
import MissionCenterSearchHelper from "./MissionCenterSearchHelper";
import MissionItemView from "../component/MissionItemView";

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
      page: 1,
      pageSize: 10,
      text: "",
      accountInfo: {}
    };
    this.searchView = React.createRef();
  }

  componentDidMount() {
    this._navListener = this.props.navigation.addListener("didFocus", () => {
      StatusBar.setTranslucent(false); //关闭沉浸式
      StatusBar.setBarStyle("dark-content");
      StatusBar.setBackgroundColor("#FFFFFF");
    });

    AccountHelper.accountInfo
      ? (this.state.accountInfo = AccountHelper.accountInfo)
      : AccountHelper.getAccountInfo().then(data => {
          this.state.accountInfo = data;
        });
  }

  componentWillUnmount = () => {
    this._navListener.remove();
  };

  render() {
    return (
      <View style={{flex:1,}}>
        <SearchView
          ref="confirmPassText"
          placeholder={"请输入车架号或车牌号"}
          onCancelCallback={() => {
            _navigation.goBack();
          }}
          searchType={0}
          renderItem={(item, onItemClick) =>
            this._renderItem(item, onItemClick)
          }
          fetchData={(text, pageSize, page, onSuccess, onError, onFinally) =>
            this._fetchData(text, pageSize, page, onSuccess, onError, onFinally)
          }
        />
      </View>
    );
  }

  _fetchData = (text, pageSize, page, onSuccess, onError, onFinally) => {
    //请求接口
    MissionCenterSearchHelper.searchTaskGroup(
      text,
      this.state.accountInfo,
      pageSize,
      page,
      onSuccess,
      onError,
      onFinally
    );

    // //Mock数据
    // let random = Math.floor(Math.random() * (9 - 1 + 1)) + 1;
    // let result = [];
    // for (let i = 0; i < random; i++) {
    //   result.push({ key: text + i, value: text + i });
    // }
    // onSuccess(result);
  };

  /**
   * 搜索结果flatLsit item view布局
   */
  _renderItem = (item, onItemClick) => {
    return (
      <MissionItemView
        onTaskGroupPress={pressItem => {
          onItemClick([pressItem.frameNo, pressItem.vehicleNo]);
          pressItem.sourceCode = item.sourceCode;
          pressItem.taskGroupCode = item.taskGroupCode;
          _navigation.navigate("InstallmentSalesOfNewCars", {
            data: pressItem
          });
        }}
        onTaskListItemPress={dataItem => {
          dataItem.sourceCode = item.sourceCode;
          dataItem.taskGroupCode = item.taskGroupCode;
          _navigation.navigate("TaskDetailScreen", {
            data: dataItem
          });
        }}
        missionItem={item}
      />
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
