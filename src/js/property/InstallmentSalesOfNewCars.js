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
import AccountHelper from "../login/AccountHelper";
import { FetchUtils } from "sz-network-module";

export default class InstallmentSalesOfNewCars extends Component {
  static navigationOptions = ({ navigation }) => {
    return titleOptions({ navigation, title: "新车分期销售" });
  };

  constructor(props) {
    super(props);
    this.state = {
      status: "loading"
    };
  }

  componentDidMount() {
    this._initData();
  }

  _initData() {
    taskGroup = this.props.navigation.getParam("data");
    console.log("InstallmentSalesOfNewCars taskGroupId = ", taskGroup);
    taskGroupId = taskGroup ? taskGroup.taskGroupId : 1;
    AccountHelper.getAccountInfo().then(accountInfo => {
      FetchUtils.fetch({
        api: "action/task/taskGroupDetail",
        params: {
          taskGroupId: taskGroupId,
          accountId: accountInfo.accountId,
          execDeptIds: this._parsetRoleListToDeptIdList(accountInfo.roleList)
        },
        success: response => {
          console.log("InstallmentSalesOfNewCars init data", response);
          this._processResponse(response);
        },
        error: err => {
          console.log("InstallmentSalesOfNewCars init data", err);
          this.setState({ status: "loadingFailed" });
        }
      });
    });
  }

  _processResponse(response) {
    this.setState({
      status: "custom",
      carInfo: {
        plateNo: response.vehicleNo,
        frameNo: response.frameNo,
        model: {
          series: response.modeName,
          type: response.vehicleTypeName,
          color: response.exteriorColor
        }
      },
      data: this._parseTaskList(response.taskList),
      taskInfo: response
    });
  }

  _parsetRoleListToDeptIdList(roleList) {
    deptIdList = [];
    for (let i in roleList) {
      deptIdList.push(roleList[i].id);
    }
    return deptIdList;
  }

  _parseTaskList(taskList) {
    result = [];
    for (let i in taskList) {
      taskDetail = taskList[i];
      taskInfo = this._parseTask(taskDetail);
      no = parseInt(i) + 1;
      taskInfo.key = no + "";
      result.push(taskInfo);
    }
    return result;
  }

  _parseTask(task) {
    return {
      taskNo: task.taskCode,
      taskName: task.taskName,
      taskTime: task.createTime ? task.createTime : "未创建",
      status: task.taskStatus
    };
  }

  _customView() {
    return (
      <View>
        <TaskInfoPanel
          onPress={() => {
            this.props.navigation.navigate(
              "IntegratedTaskInfo",
              (params = { taskInfo: this.state.taskInfo })
            );
          }}
          taskInfo={this.state.taskInfo}
        />
        <View style={styles.dividerBg}>
          <View style={styles.divider} />
        </View>
        <CarInfoPanel
          onPress={() => {
            this.props.navigation.navigate("CarInfoScreen");
          }}
          carInfo={this.state.carInfo}
        />
        <FlatList
          data={this.state.data}
          renderItem={this._renderTaskItem.bind(this)}
        />
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
    return (
      <TaskItem
        data={item}
        onPress={() => {
          this._startTaskDetailScreen(item);
        }}
      />
    );
  }

  _startTaskDetailScreen(item) {
    this.props.navigation.navigate("TaskDetailScreen");
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
        <Text style={styles.firstLineValue}>
          {this.props.taskInfo.taskGroupCode}
        </Text>
        <Text style={styles.secondLineName}>{"来源单号"}</Text>
        <Text style={styles.secondLineValue}>
          {this.props.taskInfo.sourceCode}
        </Text>
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
      <TouchableOpacity
        style={styles.carInfoContainer}
        onPress={this.props.onPress}
      >
        <Text style={styles.firstLineName}>{"车牌号"}</Text>
        <Text style={styles.firstLineValue}>{this.props.carInfo.plateNo}</Text>
        <Text style={styles.secondLineName}>{"车架号"}</Text>
        <Text style={styles.secondLineValue}>{this.props.carInfo.frameNo}</Text>
        <Text style={styles.thirdLineName}>{"车型"}</Text>
        <VehicleInofPanel
          style={styles.thirdLineValue}
          vehicle={this.props.carInfo.model.series}
          vehicleType={this.props.carInfo.model.type}
          vehicleColor={this.props.carInfo.model.color}
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
  /**(1 待处理、2 处理中、3处理完毕、4已取消) */
  _getLeftColor(status) {
    switch (status) {
      default:
      case 1:
        this.state = {
          color: "#F12E49",
          current: "待处理"
        };
        return;
      case 2:
        this.state = {
          color: "#F49C2F",
          current: "处理中"
        };
        return;
      case 4:
        this.state = {
          color: "#999999",
          current: "已取消"
        };
        return;
      case 3:
        this.state = {
          color: "#75C17D",
          current: "处理完毕"
        };
        return;
    }
  }

  render() {
    const item = this.props.data;
    this._getLeftColor(item.status);
    console.log("taskItem key = ", item.key);

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={this.props.onPress}
      >
        <View
          style={[styles.itemLeftView, { backgroundColor: this.state.color }]}
        />
        <Text style={styles.itemTaskNo}>{item.key}</Text>
        <Text style={styles.itemTaskName}>{item.taskName}</Text>
        <Text style={styles.itemTaskTime}>{"创建时间：" + item.taskTime}</Text>
        <Text style={[styles.itemRightText, { color: this.state.color }]}>
          {this.state.current}
        </Text>
      </TouchableOpacity>
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
