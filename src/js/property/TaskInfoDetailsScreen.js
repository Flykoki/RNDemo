import React, { Component } from "react";
import { View, Clipboard, Text, FlatList, StyleSheet } from "react-native";
import { titleOptions } from "../component/Titie";
import { RootView } from "../component/CommonView";
import SettingsList from "../component/SettingsList";
import AccountHelper from "../login/AccountHelper";
import { FetchUtils } from "../../../modules/sz-network-module/src/js/network/Network";
import { getTaskStatus, getInsurStatus } from "./TaskUtils";

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
        failed={this.state.failed}
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
    data = this.props.navigation.getParam("data");
    console.log("TaskBasicInfo data = ", data);

    this.setState({
      status: "custom",
      data: this._fetchData({
        NO: data.taskNo,
        status: getTaskStatus(data.taskStatus),
        applyDepartment: data.applyDept,
        applyReason: data.applyReason,
        handoverDepartment: data.attributionDept,
        from: data.sourceCode,
        integratedNo: data.groupNo,
        cancelReason: data.cancelReason
      })
    });
  }

  _fetchData(taskInfo) {
    data = [
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
      }
    ];
    if (taskInfo.cancelReason) {
      data.push({
        key: "13",
        type: "divider"
      });
      data.push({
        key: "6",
        name: "取消原因",
        value: taskInfo.cancelReason,
        type: "item"
      });
    }
    return data;
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
    data = this.props.navigation.getParam("data");
    console.log("InsuranceDetailScreen data ", data);

    this.setState({
      status: "custom",
      data: this._fetchData({
        status: getInsurStatus(data.insurPolicyStatus),
        NO: data.insurPolicyNo,
        type: data.insurType,
        insured: data.insurInsurant,
        company: data.insurCompany,
        startTime: data.insurStart,
        endTime: data.insurEnd,
        applicant: data.insurPolicyHolder,
        beneficiary: data.insurBeneficiary,
        value: data.insurCost,
        tax: data.insurVehicleVesselsTax
      })
    });
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
    carInfo = this.props.navigation.getParam("data");
    console.log("CarInfoScreen carinfo", carInfo);

    this.setState({
      status: "custom",
      data: this._fetchData({
        type: carInfo.carTypeName
          ? carInfo.carTypeName
          : carInfo.vehicleTypeName,
        frameNo: carInfo.frameNo,
        plateNo: carInfo.vehicleNo,
        engineNo: carInfo.engineNo,
        brand: carInfo.brandName,
        series: carInfo.carSeries ? carInfo.carSeries : carInfo.seriesName,
        model: carInfo.modelName,
        color: carInfo.outColorName
          ? carInfo.outColorName
          : carInfo.exteriorColorName
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
    data = this.props.navigation.getParam("data");
    console.log("InvoiceInfoScreen data ", data);

    this.setState({
      status: "custom",
      data: this._fetchLines({
        purchaser: data.purchaserName,
        licenseNo: data.idCard,
        valueWithTax: data.totalTaxMoney,
        valueWithOutTax: "2435463.22",
        seller: "北京神州汽车租赁有限公司",
        phone: data.phone,
        taxPayerNo: "3243546576543524",
        address: data.address,
        account: data.account,
        bank: data.bank
      })
    });
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
    // taskGroupId = 1674;
    this.props.navigation.getParam("taskGroupId");

    if (taskGroupId) {
      AccountHelper.getAccountInfo().then(accountInfo => {
        FetchUtils.fetch({
          api: "action/task/taskGroupDetail",
          params: {
            taskGroupId: taskGroupId,
            accountId: accountInfo.accountId,
            execDeptIds: AccountHelper.getExecDeptIds()
          },
          success: response => {
            console.log("IntegratedTaskInfo init data", response);
            this._processResponse(response);
          },
          error: err => {
            console.log("IntegratedTaskInfo init data", err);
            this.setState({
              status: "loadingFailed",
              failed: { tips: err.msg }
            });
          }
        });
      });
    } else {
      this.setState({
        status: "loadingFailed",
        failed: { tips: "加载数据为空" }
      });
    }
  }

  _processResponse(response) {
    this.setState({
      status: "custom",
      data: this._fetchLines(response)
    });
  }

  _parsetRoleListToDeptIdList(roleList) {
    deptIdList = [];
    for (let i in roleList) {
      deptIdList.push(roleList[i].id);
    }
    return deptIdList;
  }

  _processOperationDept(allExecutiveDepartments) {
    result = [];
    for (let i in allExecutiveDepartments) {
      dept = allExecutiveDepartments[i];
      result.push({ key: i, department: dept.deptName, status: dept.status });
    }
    return result;
  }

  /**(1 待处理、2 处理中、3处理完毕、4已取消) */
  _getStatus(status) {
    switch (status) {
      default:
      case 1:
        return "待处理";
      case 2:
        return "处理中";
      case 3:
        return "处理完毕";
      case 4:
        return "已取消";
    }
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
        value: returnData.taskGroupCode,
        rightIcon: require("../../res/img/copy.png"),
        type: "item",
        onPress: () => {
          Clipboard.setString(returnData.taskGroupCode);
        }
      },
      {
        key: "10",
        type: "divider"
      },
      {
        key: "2",
        name: "任务集合状态",
        value: this._getStatus(returnData.status),
        type: "item"
      },
      {
        key: "11",
        type: "divider"
      },
      {
        key: "3",
        name: "来源单号",
        value: returnData.sourceCode,
        rightIcon: require("../../res/img/copy.png"),
        type: "item",
        onPress: () => {
          Clipboard.setString(returnData.sourceCode);
        }
      },
      {
        key: "0",
        type: "divider"
      },
      {
        key: "4",
        name: "申请部门",
        value: returnData.applyDeptName,
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
        value: returnData.deliveryDept,
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
        value: returnData.taskProgress,
        type: "item"
      },
      {
        key: "12",
        type: "divider"
      },
      {
        key: "9",
        customView: (
          <TaskFlowPanel title="全部执行部门" data={returnData.deptInfo} />
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
        value: returnData.completeDays,
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

  _renderItem({ item, index }) {
    return (
      <View style={styles.taskFlowPanelItemTextContainer}>
        <DeptListItem data={item.itemList} />
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

class DeptListItem extends Component {
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

  _renderDept(dept) {
    return (
      <Text
        style={[
          styles.taskFlowPanelItemText,
          { color: this._getColor(dept.status) }
        ]}
      >
        {dept.deptName}
      </Text>
    );
  }

  _renderItem() {
    list = this.props.data;
    if (list) {
      view = [];
      list.forEach(dept => {
        view.push(this._renderDept(dept));
        view.push(
          <Text
            style={[
              styles.taskFlowPanelItemText,
              { color: this._getColor(dept.status) }
            ]}
          >
            {","}
          </Text>
        );
      });
      view.pop();
      return view;
    }
    return null;
  }

  render() {
    return (
      <View style={styles.taskFlowPanelItemTextContainer}>
        {this._renderItem()}
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
