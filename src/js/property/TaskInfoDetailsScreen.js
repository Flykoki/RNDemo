import React, { Component } from "react";
import { View, Clipboard, Text, FlatList, StyleSheet } from "react-native";
import { titleOptions } from "../component/Titie";
import { RootView } from "../component/CommonView";
import SettingsList from "../component/SettingsList";

class InfoBaseScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "loading"
    };
  }

  componentDidMount() {
    this._initData();
  }

  _cutomView() {
    return <SettingsList data={this.state.data} />;
  }

  render() {
    return (
      <RootView
        style={{ backgroundColor: "#F8F8F8", flex: 1 }}
        status={this.state.status}
        custom={this._cutomView()}
      />
    );
  }
}

export class TaskBasicInfo extends InfoBaseScreen {
  static navigationOptions = ({ navigation }) => {
    return titleOptions({
      navigation,
      title: "基础信息"
    });
  };

  _initData() {
    setTimeout(() => {
      this.setState({
        status: "custom",
        data: this._fetchData({
          NO: "SD283238923472283789320",
          status: "待整备",
          applyDepartment: "长沙",
          applyReason: "新车分期销售",
          handoverDepartment: "资产",
          from: "ASFDGRT45342EWFASH46",
          integratedNo: "FDGDT3423",
          cancelReason: "按施工方突然收到"
        })
      });
    }, 500);
  }

  _fetchData(taskInfo) {
    return [
      {
        key: "0",
        type: "margin",
        margin: 12
      },
      {
        key: "1",
        name: "任务编号",
        type: "item",
        value: taskInfo.NO
      },
      {
        key: "10",
        type: "divider"
      },
      {
        key: "2",
        name: "任务状态",
        value: taskInfo.status,
        type: "item"
      },
      {
        key: "0",
        type: "divider"
      },
      {
        key: "3",
        name: "申请部门",
        value: taskInfo.applyDepartment,
        type: "item"
      },
      {
        key: "0",
        type: "divider"
      },
      {
        key: "4",
        name: "申请原因",
        value: taskInfo.applyReason,
        type: "item"
      },
      {
        key: "12",
        type: "divider"
      },
      {
        key: "5",
        name: "归属部门",
        value: taskInfo.handoverDepartment,
        type: "item"
      },
      {
        key: "13",
        type: "divider"
      },
      {
        key: "6",
        name: "来源单据号",
        value: taskInfo.from,
        rightIcon: require("../../res/img/copy.png"),
        type: "item",
        onPress: () => {
          Clipboard.setString("22233232");
        }
      },
      {
        key: "13",
        type: "divider"
      },
      {
        key: "6",
        name: "任务集合编号",
        value: taskInfo.integratedNo,
        rightIcon: require("../../res/img/copy.png"),
        type: "item",
        onPress: () => {
          Clipboard.setString("22233232");
        }
      },
      {
        key: "13",
        type: "divider"
      },
      {
        key: "6",
        name: "取消原因",
        value: taskInfo.cancelReason,
        type: "item"
      }
    ];
  }
}

export class InsuranceDetailScreen extends InfoBaseScreen {
  static navigationOptions = ({ navigation }) => {
    return titleOptions({
      navigation,
      title: "保险信息"
    });
  };

  _initData() {
    setTimeout(() => {
      this.setState({
        status: "custom",
        data: this._fetchData({
          status: "正常",
          NO: "SD283238923472283789320",
          type: "三方保险",
          insured: "李二狗",
          company: "中国平安保险北京分公司",
          startTime: "2019-3-5",
          endTime: "2020-3-4",
          applicant: "李二狗",
          beneficiary: "李二狗",
          value: "5000",
          tax: "85"
        })
      });
    }, 500);
  }

  _fetchData(insuranceInfo) {
    return [
      { key: "0", type: "margin", margin: 10 },
      {
        key: "11",
        type: "item",
        name: "保单状态",
        value: insuranceInfo.status
      },
      { key: "01", type: "divider" },
      {
        key: "12",
        type: "item",
        name: "保险单号",
        value: insuranceInfo.NO,
        rightIcon: require("../../res/img/copy.png"),
        onPress: () => {
          Clipboard.setString(insuranceInfo.frameNo);
        }
      },
      {
        key: "02",
        type: "divider"
      },
      {
        key: "13",
        name: "保险类型",
        value: insuranceInfo.type,
        type: "item"
      },
      {
        key: "03",
        type: "divider"
      },
      {
        key: "14",
        name: "被保险人",
        value: insuranceInfo.insured,
        type: "item"
      },
      {
        key: "04",
        type: "divider"
      },
      {
        key: "15",
        name: "保险公司名称",
        value: insuranceInfo.company,
        type: "item"
      },
      {
        key: "05",
        type: "divider"
      },
      {
        key: "16",
        name: "起保日期",
        value: insuranceInfo.startTime,
        type: "item"
      },
      { key: "06", type: "divider" },
      {
        key: "17",
        name: "止保日期",
        value: insuranceInfo.endTime,
        type: "item"
      },
      {
        key: "07",
        type: "divider"
      },
      {
        key: "18",
        name: "投保人",
        value: insuranceInfo.applicant,
        type: "item"
      },
      {
        key: "07",
        type: "divider"
      },
      {
        key: "18",
        name: "受益人",
        value: insuranceInfo.beneficiary,
        type: "item"
      },
      {
        key: "07",
        type: "divider"
      },
      {
        key: "18",
        name: "保费（元）",
        value: insuranceInfo.value,
        type: "item"
      },
      {
        key: "07",
        type: "divider"
      },
      {
        key: "18",
        name: "车船税（元）",
        value: insuranceInfo.tax,
        type: "item"
      }
    ];
  }
}

export class CarInfoScreen extends InfoBaseScreen {
  static navigationOptions = ({ navigation }) => {
    return titleOptions({ navigation, title: "车辆信息" });
  };

  _initData() {
    carInfo = this.props.navigation.getParam("carInfo");
    console.log("CarInfoScreen carinfo", carInfo);

    this.setState({
      status: "custom",
      data: this._fetchData({
        type: carInfo.carTypeName,
        frameNo: carInfo.frameNo,
        plateNo: carInfo.vehicleNo,
        engineNo: carInfo.engineNo,
        brand: carInfo.brandName,
        series: carInfo.carSeries,
        model: carInfo.modelName,
        color: carInfo.outColorName
      })
    });
  }

  _fetchData(carInfo) {
    return [
      { key: "0", type: "margin", margin: 10 },
      { key: "11", type: "item", name: "车况类型", value: carInfo.type },
      { key: "01", type: "divider" },
      {
        key: "12",
        type: "item",
        name: "车架号",
        value: carInfo.frameNo,
        rightIcon: require("../../res/img/copy.png"),
        onPress: () => {
          Clipboard.setString(carInfo.frameNo);
        }
      },
      {
        key: "02",
        type: "divider"
      },
      {
        key: "13",
        name: "车牌号",
        value: carInfo.plateNo,
        type: "item"
      },
      {
        key: "03",
        type: "divider"
      },
      {
        key: "14",
        name: "发动机号",
        value: carInfo.engineNo,
        type: "item",
        rightIcon: require("../../res/img/copy.png"),
        onPress: () => {
          Clipboard.setString(carInfo.engineNo);
        }
      },
      {
        key: "04",
        type: "divider"
      },
      {
        key: "15",
        name: "品牌",
        value: carInfo.brand,
        type: "item"
      },
      {
        key: "05",
        type: "divider"
      },
      {
        key: "16",
        name: "车系",
        value: carInfo.series,
        type: "item"
      },
      { key: "06", type: "divider" },
      {
        key: "17",
        name: "车型",
        value: carInfo.model,
        type: "item"
      },
      {
        key: "07",
        type: "divider"
      },
      {
        key: "18",
        name: "外观颜色",
        value: carInfo.color,
        type: "item"
      }
    ];
  }
}

export class InvoiceInfoScreen extends InfoBaseScreen {
  static navigationOptions = ({ navigation }) => {
    return titleOptions({ navigation, title: "发票信息" });
  };

  _initData() {
    setTimeout(() => {
      this.setState({
        status: "custom",
        data: this._fetchLines({
          purchaser: "北京神州汽车租赁有限公司",
          licenseNo: "23232119999091122",
          valueWithTax: "2342353.12",
          valueWithOutTax: "2435463.22",
          seller: "北京神州汽车租赁有限公司",
          phone: "010-33193944",
          taxPayerNo: "3243546576543524",
          address: "北京市海淀区中关村东路118号",
          account: "6226123243546576534",
          bank: "中国民生银行北京市海淀区支行"
        })
      });
    }, 500);
  }

  _fetchLines(returnData) {
    return [
      {
        key: "0",
        type: "margin",
        margin: 11
      },
      {
        key: "1",
        name: "购买方名称",
        type: "item",
        value: returnData.purchaser
      },
      {
        key: "10",
        type: "divider"
      },
      {
        key: "2",
        name: "身份证号码/组织机构代码",
        value: returnData.licenseNo,
        type: "item"
      },
      {
        key: "11",
        type: "divider"
      },
      {
        key: "3",
        name: "税价合计（元）",
        value: returnData.valueWithTax,
        type: "item"
      },
      {
        key: "0",
        type: "divider"
      },
      {
        key: "4",
        name: "不含税价（元）",
        value: returnData.valueWithOutTax,
        type: "item"
      },
      {
        key: "12",
        type: "divider"
      },
      {
        key: "5",
        name: "销货单位名称",
        value: returnData.seller,
        type: "item"
      },
      {
        key: "12",
        type: "divider"
      },
      {
        key: "6",
        name: "电话",
        value: returnData.phone,
        type: "item"
      },
      {
        key: "12",
        type: "divider"
      },
      {
        key: "7",
        name: "纳税人识别号",
        value: returnData.taxPayerNo,
        type: "item"
      },
      {
        key: "12",
        type: "divider"
      },
      {
        key: "8",
        name: "地址",
        value: returnData.address,
        type: "item"
      },
      {
        key: "12",
        type: "divider"
      },
      {
        key: "9",
        name: "账号",
        value: returnData.account,
        type: "item"
      },
      {
        key: "12",
        type: "divider"
      },
      {
        key: "9",
        name: "开户行",
        value: returnData.bank,
        type: "item"
      }
    ];
  }
}

export class IntegratedTaskInfo extends InfoBaseScreen {
  static navigationOptions = ({ navigation }) => {
    return titleOptions({ navigation, title: "任务集合信息" });
  };

  _initData() {
    taskInfo = this.props.navigation.getParam("taskInfo");
    console.log("IntegratedTaskInfo", "_initData()", taskInfo);

    setTimeout(() => {
      this.setState({
        status: "custom",
        data: this._fetchLines({
          taskNo: taskInfo.taskGroupCode,
          taskStatus: "处理中",
          from: taskInfo.sourceCode,
          applyDepartment: taskInfo.applyDeptName,
          applyReason: taskInfo.applyReason,
          handoverDepartment: taskInfo.deliveryDept,
          taskTarget: taskInfo.taskObject,
          taskPerformance: taskInfo.taskProgress,
          createTime: taskInfo.createTime,
          completeTime: taskInfo.completeTime,
          operationDepartment: this._processOperationDept(
            taskInfo.allExecutiveDepartments
          ),
          elapsed: taskInfo.completeDays
        })
      });
    }, 500);
  }

  _processOperationDept(allExecutiveDepartments) {
    result = [];
    for (let i in allExecutiveDepartments) {
      dept = allExecutiveDepartments[i];
      result.push({ key: i, department: dept.deptName, status: dept.status });
    }
    return result;
  }

  _fetchLines(returnData) {
    return [
      {
        key: "0",
        type: "margin",
        margin: 11
      },
      {
        key: "1",
        name: "任务集合编号",
        type: "item",
        value: returnData.taskNo,
        rightIcon: require("../../res/img/copy.png"),
        type: "item",
        onPress: () => {
          Clipboard.setString(returnData.taskNo);
        }
      },
      {
        key: "10",
        type: "divider"
      },
      {
        key: "2",
        name: "任务集合状态",
        value: returnData.taskStatus,
        type: "item"
      },
      {
        key: "11",
        type: "divider"
      },
      {
        key: "3",
        name: "来源单号",
        value: returnData.from,
        rightIcon: require("../../res/img/copy.png"),
        type: "item",
        onPress: () => {
          Clipboard.setString(returnData.from);
        }
      },
      {
        key: "0",
        type: "divider"
      },
      {
        key: "4",
        name: "申请部门",
        value: returnData.applyDepartment,
        type: "item"
      },
      {
        key: "12",
        type: "divider"
      },
      {
        key: "5",
        name: "申请原因",
        value: returnData.applyReason,
        type: "item"
      },
      {
        key: "12",
        type: "divider"
      },
      {
        key: "6",
        name: "交车部门",
        value: returnData.handoverDepartment,
        type: "item"
      },
      {
        key: "12",
        type: "divider"
      },
      {
        key: "7",
        name: "任务对象",
        value: returnData.taskTarget,
        type: "item"
      },
      {
        key: "12",
        type: "divider"
      },
      {
        key: "8",
        name: "任务完成情况（完成/总数）",
        value: returnData.taskPerformance,
        type: "item"
      },
      {
        key: "12",
        type: "divider"
      },
      {
        key: "9",
        customView: (
          <TaskFlowPanel
            title="全部执行部门"
            data={returnData.operationDepartment}
          />
        ),
        type: "custom"
      },
      {
        key: "12",
        type: "divider"
      },
      {
        key: "9",
        name: "新建时间",
        value: returnData.createTime,
        type: "item"
      },
      {
        key: "12",
        type: "divider"
      },
      {
        key: "9",
        name: "完成时间",
        value: returnData.completeTime,
        type: "item"
      },
      {
        key: "12",
        type: "divider"
      },
      {
        key: "9",
        name: "完成天数",
        value: returnData.elapsed,
        type: "item"
      }
    ];
  }
}

class TaskFlowPanel extends Component {
  length;
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data
    };
    length = this._getDataLength(this.props.data);
  }

  _getDataLength(data) {
    size = 0;
    data.forEach(element => {
      size++;
    });
    return size;
  }

  /**(1 待处理、2 处理中、3处理完毕、4已取消) */
  _getColor(status) {
    switch (status) {
      case 1:
        return "#999999";
      case 2:
        return "#F12E49";
      case 3:
        return "#333333";
      default:
        return "#999999";
    }
  }

  _renderItem({ item, index }) {
    textColor = this._getColor(item.status);
    return (
      <View style={styles.taskFlowPanelItemTextContainer}>
        <Text style={[styles.taskFlowPanelItemText, { color: textColor }]}>
          {item.department ? item.department : "部门" + index}
        </Text>
        {!(index === length - 1) && (
          <Text style={styles.taskFlowPanelItemArrow}>></Text>
        )}
      </View>
    );
  }

  render() {
    return (
      <View style={styles.taskFlowPanelContainer}>
        <Text style={styles.taskFlowPanelTitle}>{this.props.title}</Text>
        <FlatList
          style={styles.taskFlowPanelList}
          data={this.state.data}
          renderItem={this._renderItem.bind(this)}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  taskFlowPanelContainer: {
    height: 75,
    paddingLeft: 16,
    paddingRight: 20,
    backgroundColor: "#FFFFFF"
  },
  taskFlowPanelTitle: {
    marginTop: 11,
    height: 20,
    color: "#666666",
    fontSize: 14
  },
  taskFlowPanelList: { marginTop: 10, height: 20 },
  taskFlowPanelItemTextContainer: { flexDirection: "row" },
  taskFlowPanelItemArrow: {
    fontSize: 14,
    marginLeft: 5,
    marginRight: 5,
    color: "#999999"
  },
  taskFlowPanelItemText: { fontSize: 14 }
});
