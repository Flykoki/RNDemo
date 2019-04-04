import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Dimensions
} from "react-native";
import Workbench, { TopBarItem } from "./Workbench";
import { FetchUtils } from "react-native-sz-network";
import AccountHelper from "../login/AccountHelper";
const Pubsub = require("pubsub-js");

export default class PropertyTab extends Component {
  static hasTips = false;
  static navigationOptions = ({ navigation }) => {
    return {
      title: "资产",
      tabBarLabel: "资产",
      tabBarIcon: ({ focused, tintColor }) => (
        <TopBarItem
          focused={focused}
          text={"资产"}
          tips={PropertyTab.hasTips}
        />
      )
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      schedule: []
    };
  }

  componentDidMount() {
    this._fetchData({ businessId: "ZC" });
  }

  _fetchData(params) {
    FetchUtils.fetch({
      customCid: "650100",
      api: "action/employee/homeInfo",
      params: params,
      success: response => {
        console.log("PropertyTab response = ", response);
        businessInfos = response.businessInfos;
        if (businessInfos) {
          businessInfos.forEach(element => {
            if (element.businessId === "ZC") {
              if (element.menuInfos) {
                AccountHelper.saveExecDeptIds(element.storeInfo.storeId);
                this.setState({
                  schedule: element.menuInfos,
                  storeInfo: element.storeInfo
                });
                return;
              }
            }
          });
        }
      },
      error: err => {
        console.log("PropertyTab response = ", response);
      }
    });
  }

  _renderPanels() {
    itemView = [];
    this.state.schedule.forEach(menuInfo => {
      itemView.push(this._renderSchedulePanels(menuInfo));
    });
    return itemView;
  }

  _renderSchedulePanels(menuInfo) {
    if (menuInfo) {
      return (
        <SchedulePanel
          style={{ marginTop: 10 }}
          schedule={menuInfo.subMenuInfos}
          title={menuInfo.menuGroupName}
          topRightText={
            this.state.storeInfo ? this.state.storeInfo.storeName : "全部"
          }
          topRightIcon={require("../../res/img/icon_store_select.png")}
          topRightPress={() => {
            Workbench.getAppNavigation().navigate("StoreSelectionScreen", {
              storeInfo: this.state.storeInfo,
              returnTag: storeInfo => {
                console.log("return tag ", storeInfo);
                this._fetchData({
                  businessId: "ZC",
                  storeId: storeInfo.storeId
                });
              }
            });
          }}
        />
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <SearchPanel style={{ marginTop: 14 }} />
        {this._renderPanels()}
        <TouchableOpacity onPress={this._jumpToMissionCenter.bind(this)}>
          <Text style={styles.missionCenterContainer}>{"任务查询中心"}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  _jumpToMissionCenter() {
    Workbench.jumptoMissionCenter();
  }
}

class SchedulePanel extends Component {
  constructor(props) {
    super(props);
    this.state = { show: true };
  }
  _renderItems(scheduleList) {
    itemView = [];
    scheduleList.forEach(element => {
      if (element.count > 0) {
        PubSub.publish("资产", true);
      }
      itemView.push(
        <ScheduleItem
          icon={element.icon}
          text={element.menuName}
          count={element.count + ""}
          showCount={element.count > 0}
        />
      );
    });
    return itemView;
  }

  showHiddenPanel() {
    show = this.state.show;
    this.setState({ show: !show });
  }

  render() {
    return (
      <View style={[this.props.style, styles.scheduleContainer]}>
        <Text style={styles.scheduleTitle}>{this.props.title}</Text>
        <TouchableOpacity
          style={styles.schedulePanelTopRightContainer}
          onPress={
            this.props.topRightPress
              ? this.props.topRightPress
              : this.showHiddenPanel.bind(this)
          }
        >
          <Text style={styles.schedulePanelTopRightText}>
            {this.props.topRightText}
          </Text>
          <Image
            style={styles.schedulePanelTopRightIcon}
            source={
              this.props.topRightIcon
                ? this.props.topRightIcon
                : this.state.show
                ? require("../../res/img/icon_items_hidden.png")
                : require("../../res/img/icon_items_show.png")
            }
          />
        </TouchableOpacity>
        {this.state.show && this._renderItems(this.props.schedule)}
      </View>
    );
  }
}

class ScheduleItem extends Component {
  render() {
    return (
      <TouchableOpacity style={styles.scheduleItemContainer}>
        <Image
          style={styles.scheduleItemIcon}
          source={{ uri: this.props.icon }}
        />
        <Text style={styles.scheduleItemText}>{this.props.text}</Text>
        {this.props.showCount && (
          <Text style={styles.scheduleItemCount}>{this.props.count}</Text>
        )}
      </TouchableOpacity>
    );
  }
}

class SearchPanel extends Component {
  render() {
    return (
      <View style={[styles.searchContainer, this.props.style]}>
        <Text style={styles.searchText}>{"请输入车架号或车牌号"}</Text>
        <Image
          style={styles.searchIcon}
          source={require("../../res/img/icon_app_scan.png")}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F8F8F8",
    flex: 1,
    paddingLeft: 8,
    paddingRight: 8
  },
  searchContainer: {
    backgroundColor: "white",
    paddingLeft: 16,
    height: 32,
    flexDirection: "row",
    borderRadius: 3
  },
  searchText: {
    flex: 1,
    color: "#CCCCCC",
    fontSize: 14,
    textAlignVertical: "center"
  },
  searchIcon: {
    width: 32,
    height: 32,
    resizeMode: "center"
  },
  scheduleContainer: {
    backgroundColor: "white",
    borderRadius: 3,
    flexWrap: "wrap",
    flexDirection: "row"
  },
  scheduleTitle: {
    width: "100%",
    height: 25,
    marginTop: 16,
    marginLeft: 20,
    marginBottom: 10,
    fontSize: 18,
    color: "#333333"
  },
  scheduleItemContainer: {
    width: "25%",
    alignItems: "center",
    marginBottom: 20
  },
  scheduleItemIcon: { width: 30, height: 30, resizeMode: "center" },
  scheduleItemText: { color: "#333333", fontSize: 12, marginTop: 4 },
  scheduleItemCount: {
    width: 14,
    height: 12,
    textAlignVertical: "center",
    textAlign: "center",
    position: "absolute",
    right: "30%",
    top: "5%",
    backgroundColor: "#F12E49",
    color: "#FDFDFD",
    fontSize: 7,
    borderRadius: 6
  },
  schedulePanelTopRightContainer: {
    position: "absolute",
    top: 21,
    right: 15,
    height: 21,
    flexDirection: "row",
    alignItems: "center"
  },
  schedulePanelTopRightText: { color: "#333333", fontSize: 14, marginRight: 4 },
  schedulePanelTopRightIcon: { height: 14, width: 14, resizeMode: "center" },
  missionCenterContainer: {
    height: 39,
    marginTop: 10,
    backgroundColor: "white",
    textAlignVertical: "center",
    textAlign: "center",
    borderRadius: 3,
    color: "#333333",
    fontSize: 15
  }
});
