import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import { titleOptions } from "../component/Titie";
import VehicleInofPanel from "./VehicleInofPanel";
import { RootView } from "../component/CommonView";

export default class InstallmentSalesOfNewCars extends Component {
  static navigationOptions = ({ navigation }) => {
    return titleOptions({ navigation, title: "新车分期销售" });
  };

  constructor(props) {
    super(props);
    this.state = {
      status: "loading",
      data: [
        {
          key: "1",
          status: "waiting",
          taskNo: "1",
          taskName: "车辆入库 K2323",
          taskTime: "创建时间: 11/11 09:22",
          current: "待入库"
        },
        {
          key: "2",
          status: "done",
          taskNo: "2",
          taskName: "新车发票 K2323",
          taskTime: "创建时间: 11/11 09:22",
          current: "已开票"
        },
        {
          key: "3",
          status: "done",
          taskNo: "3",
          taskName: "车辆保险 K2323",
          taskTime: "创建时间: 11/11 09:22",
          current: "已投保"
        },
        {
          key: "4",
          status: "done",
          taskNo: "4",
          taskName: "绑定GPS K2323",
          taskTime: "创建时间: 11/11 09:22",
          current: "已绑定"
        },
        {
          key: "5",
          status: "cancel",
          taskNo: "5",
          taskName: "车辆过户 K2323",
          taskTime: "创建时间: 11/11 09:22",
          current: "已取消"
        },
        {
          key: "6",
          status: "waiting",
          taskNo: "6",
          taskName: "车辆出库 K2323",
          taskTime: "创建时间: 11/11 09:22",
          current: ""
        }
      ]
    };
    this._initData();
  }

  _initData() {
    setTimeout(() => {
      this.setState({ status: "custom" });
    }, 500);
  }

  _customView() {
    return (
      <View>
        <TaskInfoPanel
          onPress={() => {
            this.props.navigation.navigate("IntegratedTaskInfo");
          }}
        />
        <View style={styles.dividerBg}>
          <View style={styles.divider} />
        </View>
        <CarInfoPanel />
        <FlatList data={this.state.data} renderItem={this._renderTaskItem} />
      </View>
    );
  }

  render() {
    return (
      <RootView
        style={{ backgroundColor: "#F8F8F8", flex: 1 }}
        status={this.state.status}
        failed={{
          tips: "加载失败",
          onPress: () => {
            this.setState({ status: "custom" });
          },
          btnText: "重新加载"
        }}
        custom={this._customView()}
      />
    );
  }

  _renderTaskItem({ item }) {
    return <TaskItem data={item} />;
  }
}

class TaskInfoPanel extends Component {
  render() {
    return (
      <TouchableOpacity
        style={styles.salesTaskInfoContainer}
        onPress={this.props.onPress}
      >
        <Text style={styles.firstLineName}>{"任务集合"}</Text>
        <Text style={styles.firstLineValue}>{"DKJF3288"}</Text>
        <Text style={styles.secondLineName}>{"来源单号"}</Text>
        <Text style={styles.secondLineValue}>{"ALJSD8FJOA323232323"}</Text>
        <Image
          style={styles.salesTaskInfoRightArrow}
          source={require("../../res/img/icon_left_arrow_black.png")}
        />
      </TouchableOpacity>
    );
  }
}

class CarInfoPanel extends Component {
  render() {
    return (
      <TouchableOpacity style={styles.carInfoContainer}>
        <Text style={styles.firstLineName}>{"车牌号"}</Text>
        <Text style={styles.firstLineValue}>{"京P E2342"}</Text>
        <Text style={styles.secondLineName}>{"车架号"}</Text>
        <Text style={styles.secondLineValue}>{"ASDFUAOJSDKBF872983IUR"}</Text>
        <Text style={styles.thirdLineName}>{"车型"}</Text>
        <VehicleInofPanel
          style={styles.thirdLineValue}
          vehicle="哈弗F5"
          vehicleType="准"
          vehicleColor="银灰"
        />

        <Image
          style={styles.carInfoRightArrow}
          source={require("../../res/img/icon_left_arrow_black.png")}
        />
      </TouchableOpacity>
    );
  }
}

class TaskItem extends Component {
  _getLeftColor(status) {
    switch (status) {
      case "waiting":
        return "#F12E49";
      case "done":
        return "#75C17D";
      default:
        return "#999999";
    }
  }
  render() {
    const item = this.props.data;
    const color = this._getLeftColor(item.status);
    return (
      <View style={styles.itemContainer}>
        <View style={[styles.itemLeftView, { backgroundColor: color }]} />
        <Text style={styles.itemTaskNo}>{item.taskNo}</Text>
        <Text style={styles.itemTaskName}>{item.taskName}</Text>
        <Text style={styles.itemTaskTime}>{item.taskTime}</Text>
        <Text style={[styles.itemRightText, { color: color }]}>
          {item.current}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F8F8" },
  dividerBg: { height: 1, backgroundColor: "white" },
  divider: { marginLeft: 20, height: 1, backgroundColor: "#F8F8F8" },
  firstLineName: {
    position: "absolute",
    color: "#666666",
    top: 14,
    left: 20,
    fontSize: 14
  },
  firstLineValue: {
    color: "#333333",
    position: "absolute",
    top: 14,
    left: 100,
    fontSize: 14
  },
  secondLineName: {
    color: "#666666",
    position: "absolute",
    top: 44,
    left: 20,
    fontSize: 14
  },
  secondLineValue: {
    color: "#333333",
    position: "absolute",
    top: 44,
    left: 100,
    fontSize: 14
  },
  thirdLineName: {
    color: "#666666",
    position: "absolute",
    top: 73,
    left: 20,
    fontSize: 14
  },
  thirdLineValue: {
    position: "absolute",
    top: 73,
    left: 100,
    height: 18
  },
  carType: {
    color: "#333333",
    fontSize: 14,
    textAlignVertical: "center"
  },
  carTypeText: {
    position: "relative",
    height: 18,
    left: 10,
    borderRadius: 2.7,
    borderColor: "#F12E49",
    borderWidth: 0.5,
    fontSize: 12,
    color: "#F12E49",
    paddingLeft: 6,
    paddingRight: 6
  },
  carColorText: {
    position: "relative",
    height: 18,
    left: 20,
    borderRadius: 2.7,
    borderColor: "#F49C2F",
    borderWidth: 0.5,
    color: "#F49C2F",
    fontSize: 12,
    paddingLeft: 6,
    paddingRight: 6
  },
  salesTaskInfoContainer: {
    height: 72,
    marginTop: 9,
    backgroundColor: "white"
  },
  salesTaskInfoRightArrow: {
    position: "absolute",
    right: 20,
    top: 28,
    width: 9,
    height: 16
  },
  carInfoContainer: {
    height: 102,
    marginBottom: 4,
    backgroundColor: "white",
    flexDirection: "row"
  },
  carInfoRightArrow: {
    position: "absolute",
    right: 20,
    top: 43,
    width: 9,
    height: 16
  },
  itemContainer: {
    height: 67,
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 3,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    marginTop: 12
  },
  itemLeftView: {
    width: 3,
    height: 67,
    backgroundColor: "#F12E49",
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
    position: "absolute",
    left: 0,
    top: 0
  },
  itemTaskNo: {
    position: "absolute",
    left: 21,
    top: 13,
    width: 18,
    height: 42,
    fontSize: 30,
    color: "#333333"
  },
  itemTaskName: {
    position: "absolute",
    left: 57,
    top: 15,
    fontSize: 15,
    color: "#333333"
  },
  itemTaskTime: {
    position: "absolute",
    left: 57,
    top: 40,
    fontSize: 12,
    color: "#666666"
  },
  itemRightText: {
    position: "absolute",
    right: 8,
    top: 0,
    width: 51,
    height: 67,
    textAlign: "center",
    textAlignVertical: "center",
    borderRadius: 3
  }
});
