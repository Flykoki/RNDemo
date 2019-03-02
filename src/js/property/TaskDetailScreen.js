import React, { Component } from "react";
import { RootView } from "../component/CommonView";
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Clipboard
} from "react-native";
import { titleOptions } from "../component/Titie";
import VehicleInfoPanel from "./VehicleInofPanel";

export default class TaskDetailScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return titleOptions({
      navigation,
      title: navigation.getParam("otherParam", "")
    });
  };

  constructor(props) {
    super(props);
    this.props.navigation.setParams({ otherParam: "车辆整备详情" });
    this.state = {
      status: "loading",
      operation: "开始整备",
      data: [
        {
          key: "0",
          type: "baseInfo",
          title: "基础信息",
          taskNo: "KH232244",
          business: "一级业务线 - 二级业务线",
          fromNo: "SD283238923472283789320"
        },
        {
          key: "1",
          type: "carInfo",
          title: "车辆信息",
          vehicle: {
            model: "宝沃 BX6 四驱锋锐 GT SUV",
            type: "新",
            color: "宝蓝",
            frameNo: "SD283238923472283789320"
          }
        },
        {
          key: "2",
          type: "invoiceInfo",
          compony: "北京神州汽车租赁有限公司",
          invoiceNo: "32435443783294837823234",
          invoiceValue: "税价合计: 112,123.00"
        },
        {
          key: "3",
          type: "expressInfo",
          contract: "李二狗 1588888888",
          address: "北京市海淀区中关村东路118号",
          express: "顺丰快递 134627381736173"
        },
        {
          key: "4",
          type: "insuranceInfo",
          applicant: "李二狗",
          insured: "李二狗",
          beneficiary: "李二狗",
          company: "中国平安保险有限公司"
        },
        {
          key: "10",
          type: "taskFollower",
          title: "车辆信息",
          tasks: [
            {
              key: "0",
              taskName: "分配 - 状态一",
              status: "done",
              taskTime: "系统 2019/03/04 12:42:11",
              taskInfo: "1D5H"
            },
            {
              key: "1",
              taskName: "操作类型 - 状态二",
              status: "doing"
            },
            {
              key: "2",
              taskName: "操作类型 - 状态三",
              status: "cancel"
            }
          ]
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
      <View style={styles.customViewContainer}>
        <FlatList
          style={styles.listContainer}
          data={this.state.data}
          renderItem={this._renderItem.bind(this)}
          ItemSeparatorComponent={this._renderSeparator}
        />

        {this.state.operation && (
          <TouchableOpacity style={styles.operationContainer}>
            <Text style={styles.operationText}>{this.state.operation}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  render() {
    return (
      <RootView
        style={styles.container}
        status={this.state.status}
        custom={this._customView()}
      />
    );
  }

  _renderSeparator = () => {
    return <View style={styles.listSeparater} />;
  };

  _renderItem({ item }) {
    if (item.type === "carInfo") {
      return <CarInfoPanel item={item} />;
    }

    if (item.type === "taskFollower") {
      return <TaskFollower item={item} />;
    }

    if (item.type === "invoiceInfo") {
      return <InvoicePanel item={item} />;
    }

    if (item.type === "expressInfo") {
      return <ExpressPanel item={item} />;
    }

    if (item.type === "insuranceInfo") {
      return <InsurancePanel item={item} />;
    }

    return <BaseInfoPanel item={item} />;
  }
}

class ItemTitle extends Component {
  render() {
    return (
      <TouchableOpacity
        style={[styles.panelTitle, this.props.style]}
        activeOpacity={1}
        onPress={this.props.onPress}
      >
        <Text style={styles.panelTitleText}>{this.props.title}</Text>

        {this.props.onPress && (
          <Image
            source={require("../../res/img/icon_left_arrow_black.png")}
            style={styles.panelTitleRightArrow}
          />
        )}
        <View style={styles.panelTitleDivider} />
      </TouchableOpacity>
    );
  }
}

export class BaseInfoPanel extends Component {
  render() {
    return (
      <View style={styles.baseInfoContainer}>
        <ItemTitle
          title={this.props.item.title}
          onPress={this.props.item.titlePress}
        />
        <Text style={[styles.panelLeftText, styles.panelFirstLineTop]}>
          {"任务编号"}
        </Text>

        <Text style={[styles.panelRightText, styles.panelFirstLineTop]}>
          {this.props.item.taskNo}
        </Text>
        <Text style={[styles.panelLeftText, styles.panelSecondLineTop]}>
          {"业务线"}
        </Text>
        <Text style={[styles.panelRightText, styles.panelSecondLineTop]}>
          {this.props.item.business}
        </Text>
        <Text style={[styles.panelLeftText, styles.panelThirdLineTop]}>
          {"来源编号"}
        </Text>
        <TextWithCopy
          style={[styles.panelRightText, styles.panelThirdLineTop]}
          text={this.props.item.fromNo}
        />
      </View>
    );
  }
}

export class CarInfoPanel extends Component {
  render() {
    return (
      <View style={styles.carInfoContainer}>
        <ItemTitle
          title={this.props.item.title}
          onPress={this.props.item.titlePress}
        />
        <VehicleInfoPanel
          style={styles.carInfoVehiclePanel}
          vehicle={this.props.item.vehicle.model}
          vehicleType={this.props.item.vehicle.type}
          vehicleColor={this.props.item.vehicle.color}
        />

        <Text style={[styles.panelLeftText, styles.panelSecondLineTop]}>
          {"车架号"}
        </Text>

        <TextWithCopy
          style={styles.carInfoFrameNoText}
          text={this.props.item.vehicle.frameNo}
        />
      </View>
    );
  }
}

export class TaskFollower extends Component {
  constructor(props) {
    super(props);
  }
  _renderTasks() {
    let taskItems = [];
    let tasks = this.props.item.tasks;

    for (i = 0; i < tasks.length; i++) {
      task = tasks[i];
      task.notLast = i === tasks.length - 1 ? false : true;
      taskItems.push(this._renderItem(task, i === 0));
    }
    return taskItems;
  }
  _renderItem(step, isFirst) {
    return (
      <TaskFollowerItem
        style={{ height: step.notLast ? 57 : 35, marginTop: isFirst ? 66 : 0 }}
        step={step}
      />
    );
  }
  render() {
    return (
      <View style={styles.taskFollowerContainer}>
        <ItemTitle title="任务跟踪" />
        {this._renderTasks()}
      </View>
    );
  }
}

export class TaskFollowerItem extends Component {
  render() {
    const step = this.props.step;
    statusDone = step.status === "done";
    return (
      <View style={this.props.style}>
        <Image
          style={styles.taskFollowerItemStatusImg}
          source={
            statusDone
              ? require("../../res/img/icon_task_done.png")
              : step.status === "cancel"
              ? require("../../res/img/icon_task_cancel.png")
              : require("../../res/img/icon_task_doing.png")
          }
        />
        {step.notLast && (
          <View
            style={[
              styles.taskFollowerTimeLine,
              { backgroundColor: statusDone ? "#2D72D9" : "#E5E5E5" }
            ]}
          />
        )}

        <Text
          style={[
            styles.taskFollowerItemName,
            { color: statusDone ? "#333333" : "#666666" }
          ]}
        >
          {step.taskName}
        </Text>

        <Text style={styles.taskFollowerTime}>{step.taskTime}</Text>

        {step.notLast && (
          <Text
            style={[
              styles.taskFollowerInfo,
              { color: statusDone ? "#2D72D9" : "#E5E5E5" }
            ]}
          >
            {step.taskInfo}
          </Text>
        )}
      </View>
    );
  }
}

export class InvoicePanel extends Component {
  render() {
    return (
      <View style={styles.invoiceContainer}>
        <ItemTitle title="发票信息" onPress={() => {}} />
        <Text style={styles.invoiceCompony}>{this.props.item.compony}</Text>
        <Text style={styles.invoiceNo}>{this.props.item.invoiceNo}</Text>
        <Text style={styles.invoiceValue}>{this.props.item.invoiceValue}</Text>
      </View>
    );
  }
}

export class ExpressPanel extends Component {
  render() {
    return (
      <View style={styles.invoiceContainer}>
        <ItemTitle title="邮寄信息" />
        <Text style={[styles.panelLeftText, styles.panelFirstLineTop]}>
          {"收件人"}
        </Text>
        <Text style={styles.expressContract}>{this.props.item.contract}</Text>
        <Text style={styles.expressAddress}>{this.props.item.address}</Text>
        <Text style={[styles.panelLeftText, styles.expressNoName]}>
          {"快递"}
        </Text>
        <TextWithCopy style={styles.expressNo} text={this.props.item.express} />
      </View>
    );
  }
}

export class InsurancePanel extends Component {
  render() {
    return (
      <View style={styles.insuranceContainer}>
        <ItemTitle title="保险信息" onPress={() => {}} />
        <Text style={[styles.panelLeftText, styles.panelFirstLineTop]}>
          {"投保人"}
        </Text>
        <Text style={[styles.panelLeftText, styles.panelSecondLineTop]}>
          {"被保险人"}
        </Text>
        <Text style={[styles.panelLeftText, styles.panelThirdLineTop]}>
          {"受益人"}
        </Text>
        <Text style={[styles.panelLeftText, styles.panelFourthLineTop]}>
          {"保险公司"}
        </Text>
        <Text style={[styles.panelRightText, styles.panelFirstLineTop]}>
          {this.props.item.applicant}
        </Text>
        <Text style={[styles.panelRightText, styles.panelSecondLineTop]}>
          {this.props.item.insured}
        </Text>
        <Text style={[styles.panelRightText, styles.panelThirdLineTop]}>
          {this.props.item.beneficiary}
        </Text>
        <Text style={[styles.panelRightText, styles.panelFourthLineTop]}>
          {this.props.item.company}
        </Text>
      </View>
    );
  }
}

export class TextWithCopy extends Component {
  render() {
    return (
      <TouchableOpacity
        style={[styles.textCopyContainer, this.props.style]}
        onPress={() => {
          Clipboard.setString(this.props.text);
        }}
      >
        <Text style={styles.textCopyText}>{this.props.text}</Text>

        <Image
          style={styles.copyIcon}
          source={require("../../res/img/copy.png")}
        />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#F8F8F8", flex: 1, paddingTop: 10 },
  customViewContainer: { flex: 1, justifyContent: "space-between" },
  listContainer: { flex: 1, backgroundColor: "transparent" },
  operationContainer: {
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F12E49"
  },
  operationText: { color: "#FFFFFF", fontSize: 15 },
  listSeparater: {
    height: 10,
    backgroundColor: "transparent"
  },
  panelTitle: {
    height: 46,
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0
  },
  panelTitleText: {
    color: "#333333",
    fontSize: 15
  },
  panelTitleDivider: {
    height: 1,
    backgroundColor: "#E5E5E5",
    position: "absolute",
    bottom: 1,
    left: 0,
    right: 0
  },
  panelTitleRightArrow: { width: 6, height: 10 },
  baseInfoContainer: { backgroundColor: "white", height: 153 },
  panelLeftText: {
    position: "absolute",
    left: 20,
    fontSize: 14,
    color: "#666666"
  },
  panelRightText: {
    position: "absolute",
    right: 20,
    fontSize: 14,
    color: "#333333"
  },
  panelFirstLineTop: {
    top: 61
  },
  panelSecondLineTop: {
    top: 90
  },
  panelThirdLineTop: {
    top: 119
  },
  panelFourthLineTop: {
    top: 148
  },
  carInfoContainer: {
    backgroundColor: "white",
    height: 124
  },
  carInfoVehiclePanel: { position: "absolute", top: 61, left: 20 },
  carInfoFrameNoText: {
    position: "absolute",
    right: 20,
    top: 90
  },
  copyIcon: {
    height: 10,
    width: 10,
    resizeMode: "contain",
    marginLeft: 6,
    alignSelf: "center"
  },
  taskFollowerContainer: { flex: 1, backgroundColor: "white" },
  taskFollowerItemStatusImg: {
    width: 20,
    height: 20,
    position: "absolute",
    left: 18
  },
  taskFollowerTimeLine: {
    width: 2,
    left: 27,
    height: 38,
    position: "absolute",
    top: 20
  },
  taskFollowerItemName: {
    position: "absolute",
    left: 46,
    fontSize: 14
  },
  taskFollowerTime: {
    position: "absolute",
    right: 20,
    fontSize: 12,
    color: "#666666"
  },
  taskFollowerInfo: {
    position: "absolute",
    left: 46,
    top: 30,
    fontSize: 12
  },
  textCopyContainer: { flexDirection: "row" },
  textCopyText: { fontSize: 14, color: "#333333" },
  invoiceContainer: {
    height: 144,
    backgroundColor: "white"
  },
  invoiceCompony: {
    position: "absolute",
    top: 60,
    left: 20,
    fontSize: 14,
    color: "#333333"
  },
  invoiceNo: {
    position: "absolute",
    top: 90,
    fontSize: 12,
    left: 20,
    color: "#666666"
  },
  invoiceValue: {
    position: "absolute",
    top: 112,
    fontSize: 12,
    left: 20,
    color: "#666666"
  },
  expressContract: {
    position: "absolute",
    top: 61,
    right: 20,
    fontSize: 14,
    color: "#333333"
  },
  expressAddress: {
    position: "absolute",
    top: 78,
    right: 20,
    fontSize: 14,
    color: "#333333"
  },
  expressNo: {
    position: "absolute",
    top: 109,
    right: 20,
    fontSize: 14,
    color: "#333333"
  },
  expressNoName: {
    top: 109
  },
  insuranceContainer: {
    height: 182,
    backgroundColor: "white"
  }
});
