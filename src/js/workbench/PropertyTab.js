import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Dimensions
} from "react-native";
import Workbench from "./Workbench";

export default class PropertyTab extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "资产"
    };
  };
  render() {
    return (
      <View style={styles.container}>
        <SearchPanel style={{ marginTop: 14 }} />
        <SchedulePanel style={{ marginTop: 10 }} />
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
  render() {
    return (
      <View style={[this.props.style, styles.scheduleContainer]}>
        <Text style={styles.scheduleTitle}>{"待办任务"}</Text>
        <ScheduleItem
          icon={require("../../res/img/icon_car_put_storage.png")}
          text="车辆入库"
          count="0"
        />
        <ScheduleItem
          icon={require("../../res/img/icon_car_settle.png")}
          text="车辆落户"
          count="1"
        />
        <ScheduleItem
          icon={require("../../res/img/icon_gps_manager.png")}
          text="gps管理"
          count="0"
        />
        <ScheduleItem
          icon={require("../../res/img/icon_car_out_storage.png")}
          text="车辆出库"
          count="0"
        />
        <ScheduleItem
          icon={require("../../res/img/icon_car_transfer.png")}
          text="车辆过户"
          count="0"
        />
      </View>
    );
  }
}

class ScheduleItem extends Component {
  render() {
    return (
      <TouchableOpacity style={styles.scheduleItemContainer}>
        <Image style={styles.scheduleItemIcon} source={this.props.icon} />
        <Text style={styles.scheduleItemText}>{this.props.text}</Text>
        {this.props.count && this.props.count != "0" && (
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
