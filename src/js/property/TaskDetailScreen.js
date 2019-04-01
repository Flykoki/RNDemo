import React, { Component } from "react";
import { RootView } from "../component/CommonView";
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Clipboard,
  Dimensions
} from "react-native";
import { titleOptions } from "../component/Titie";
import VehicleInfoPanel from "./VehicleInofPanel";
import AccountHelper from "../login/AccountHelper";
import { FetchUtils } from "sz-network-module";

export default class TaskDetailScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return titleOptions({
      navigation,
      title: navigation.getParam("otherParam", "")
    });
  };

  constructor(props) {
    super(props);
    this.state = {
      status: "loading"
      // operation: "开始整备",
      // data: demoData(this.props)
    };
  }

  componentDidMount() {
    this._initData();
  }

  _initData() {
    data = this.props.navigation.getParam("data");
    console.log("TaskDetailScreen data ", data);

    if (data) {
      this._fetchData(data);
    } else {
      this.setState({
        status: "loadingFailed",
        failed: { tips: "加载数据失败" }
      });
    }
  }

  _fetchData(data) {
    this.props.navigation.setParams({ otherParam: data.taskName });
    AccountHelper.getAccountInfo().then(accountInfo => {
      FetchUtils.fetch({
        api: "action/task/taskInfo",
        params: {
          taskId: data.taskId,
          // taskType: data.taskType,
          taskType: 1,
          accountId: accountInfo.accountId,
          execDeptIds: AccountHelper.getExecDeptIds()
        },
        success: response => {
          console.log("TaskDetailScreen init data", response);
          this._processTaskListData(response);
        },
        error: err => {
          console.log("TaskDetailScreen init data", err);
          this.setState({
            status: "loadingFailed",
            failed: { tips: err.msg }
          });
        }
      });
    });
  }

  _processTaskListData(content) {
    data = [];
    baseDetail = content.taskBaseDetail;
    if (baseDetail) {
      baseDetail.title = "基础信息";
      baseDetail.titlePress = () => {
        this.props.navigation.navigate("TaskBasicInfo", { data: baseDetail });
      };
      data.push(baseDetail);
    }

    vehicleInfo = content.vehicleInfo;
    if (vehicleInfo) {
      vehicleInfo.type = "carInfo";
      vehicleInfo.title = "车辆信息";
      vehicleInfo.titlePress = () => {
        this.props.navigation.navigate("CarInfoScreen", { data: vehicleInfo });
      };
      data.push(vehicleInfo);
    }

    invoiceInfo = content.invoiceInfo;
    if (invoiceInfo) {
      invoiceInfo.type = "invoiceInfo";
      invoiceInfo.titlePress = () => {
        this.props.navigation.navigate("InvoiceInfoScreen", {
          data: invoiceInfo
        });
      };
      data.push(invoiceInfo);

      invoicePostInfo = content.invoicePostInfo;
      item = { type: "expressInfo" };
      if (invoicePostInfo) {
        item.express = invoicePostInfo;
      }
      data.push(item);
    }

    vinsInfo = content.vinsInfo;
    if (vinsInfo) {
      vinsInfo.type = "insuranceInfo";
      vinsInfo.titlePress = () => {
        this.props.navigation.navigate("InsuranceDetailScreen", {
          data: vinsInfo
        });
      };
      data.push(vinsInfo);
      insuranceAccessories = content.insuranceAccessories;
      if (insuranceAccessories) {
        urls = insuranceAccessories.idCardURL.split(",");
        attachment = {
          type: "attachmentInfo",
          imageUris: urls
        };
        data.push(attachment);
      }
    }

    taskTracking = content.taskTracking;
    if (taskTracking) {
      taskTracking.type = "taskFollower";
      data.push(taskTracking);
    }

    this.setState({ status: "custom", data: data });
  }

  _parsetRoleListToDeptIdList(roleList) {
    deptIdList = [];
    for (let i in roleList) {
      deptIdList.push(roleList[i].id);
    }
    return deptIdList;
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
        failed={this.state.failed}
        custom={this._customView()}
      />
    );
  }

  _renderSeparator = () => {
    return <View style={styles.listSeparater} />;
  };

  _renderItem({ item }) {
    switch (item.type) {
      case "carInfo":
        return <CarInfoPanel item={item} />;

      case "taskFollower":
        return <TaskFollower item={item} />;

      case "invoiceInfo":
        return <InvoicePanel item={item} />;

      case "expressInfo":
        return <ExpressPanel item={item} />;

      case "insuranceInfo":
        return <InsurancePanel item={item} />;

      case "attachmentInfo":
        return <AttachmentPanel item={item} />;

      default:
        return <BaseInfoPanel item={item} />;
    }
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
          {this.props.item.businessLine}
        </Text>
        <Text style={[styles.panelLeftText, styles.panelThirdLineTop]}>
          {"来源编号"}
        </Text>
        <TextWithCopy
          style={[styles.panelRightText, styles.panelThirdLineTop]}
          text={this.props.item.sourceCode}
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
          vehicle={this.props.item.modelName}
          vehicleType={this.props.item.vehicleTypeName}
          vehicleColor={this.props.item.exteriorColorName}
        />

        <Text style={[styles.panelLeftText, styles.panelSecondLineTop]}>
          {"车架号"}
        </Text>

        <TextWithCopy
          style={styles.carInfoFrameNoText}
          text={this.props.item.frameNo}
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
    let tasks = this.props.item;

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
          source={this._getIcon(step.status)}
        />
        {step.notLast && (
          <View
            style={[
              styles.taskFollowerTimeLine,
              { backgroundColor: this._getBgColor(step.status) }
            ]}
          />
        )}

        <Text
          style={[
            styles.taskFollowerItemName,
            { color: this._getTextColor(step.status) }
          ]}
        >
          {step.operator + this._getStatus(step.status)}
        </Text>

        <Text style={styles.taskFollowerTime}>{step.changeTime}</Text>

        {step.notLast && (
          <Text
            style={[
              styles.taskFollowerInfo,
              { color: this._getBgColor(step.status) }
            ]}
          >
            {step.duration}
          </Text>
        )}
      </View>
    );
  }

  _getBgColor(status) {
    switch (status) {
      case 1:
      // return "待整备";
      case 8:
      // return "整备中";
      case 22:
      // return "已取消";
      case 28:
      // return "待开票";
      case 30:
      // return "待退票";
      case 32:
      // return "处理中";
      case 33:
      // return "已取消";
      case 34:
      // return "待绑定";
      case 36:
      // return "待解绑";
      case 38:
      // return "已取消";
      case 39:
      // return "待确认";
      case 40:
      // return "待处理";
      case 41:
      // return "处理中";
      case 43:
      // return "无需处理";
      case 44:
      // return "已取消";
      case 45:
      // return "待落户";
      case 47:
      // return "已取消";
      case 48:
      // return "待过户";
      case 50:
      // return "已取消";
      case 51:
      // return "待出库";
      case 53:
      // return "已取消";
      case 54:
      // return "待入库";
      case 56:
      // return "已取消";
      case 57:
      // return "通知客户提车";
      case 58:
      // return "交车审核中";
      case 60:
      // return "已取消";
      case 31:
        // return "已退票";
        return "#E5E5E5";

      case 15:
      // return "整备完毕";
      case 29:
      // return "已开票";
      case 35:
      // return "已绑定";
      case 37:
      // return "已解绑";
      case 42:
      // return "处理完毕";
      case 46:
      // return "已落户";
      case 49:
      // return "已过户";
      case 52:
      // return "已出库";
      case 55:
      // return "已入库";
      case 59:
        // return "交车审核通过";
        return "#2D72D9";
    }
  }

  _getTextColor(status) {
    switch (status) {
      case 1:
      // return "待整备";
      case 8:
      // return "整备中";
      case 22:
      // return "已取消";
      case 28:
      // return "待开票";
      case 30:
      // return "待退票";
      case 32:
      // return "处理中";
      case 33:
      // return "已取消";
      case 34:
      // return "待绑定";
      case 36:
      // return "待解绑";
      case 38:
      // return "已取消";
      case 39:
      // return "待确认";
      case 40:
      // return "待处理";
      case 41:
      // return "处理中";
      case 43:
      // return "无需处理";
      case 44:
      // return "已取消";
      case 45:
      // return "待落户";
      case 47:
      // return "已取消";
      case 48:
      // return "待过户";
      case 50:
      // return "已取消";
      case 51:
      // return "待出库";
      case 53:
      // return "已取消";
      case 54:
      // return "待入库";
      case 56:
      // return "已取消";
      case 57:
      // return "通知客户提车";
      case 58:
      // return "交车审核中";
      case 60:
      // return "已取消";
      case 31:
        // return "已退票";
        return "#666666";

      case 15:
      // return "整备完毕";
      case 29:
      // return "已开票";
      case 35:
      // return "已绑定";
      case 37:
      // return "已解绑";
      case 42:
      // return "处理完毕";
      case 46:
      // return "已落户";
      case 49:
      // return "已过户";
      case 52:
      // return "已出库";
      case 55:
      // return "已入库";
      case 59:
        // return "交车审核通过";
        return "#333333";
    }
  }

  _getIcon(status) {
    switch (status) {
      case 1:
      // return "待整备";
      case 8:
      // return "整备中";
      case 28:
      // return "待开票";
      case 30:
      // return "待退票";
      case 32:
      // return "处理中";
      case 34:
      // return "待绑定";
      case 36:
      // return "待解绑";
      case 39:
      // return "待确认";
      case 40:
      // return "待处理";
      case 41:
      // return "处理中";
      case 43:
      // return "无需处理";
      case 45:
      // return "待落户";
      case 48:
      // return "待过户";
      case 51:
      // return "待出库";
      case 54:
      // return "待入库";
      case 57:
      // return "通知客户提车";
      case 58:
      // return "交车审核中";
      case 31:
        // return "已退票";
        return require("../../res/img/icon_task_doing.png");

      case 22:
      // return "已取消";
      case 33:
      // return "已取消";
      case 38:
      // return "已取消";
      case 44:
      // return "已取消";
      case 47:
      // return "已取消";
      case 50:
      // return "已取消";
      case 53:
      // return "已取消";
      case 56:
      // return "已取消";
      case 60:
        // return "已取消";
        return require("../../res/img/icon_task_cancel.png");

      case 15:
      // return "整备完毕";
      case 29:
      // return "已开票";
      case 35:
      // return "已绑定";
      case 37:
      // return "已解绑";
      case 42:
      // return "处理完毕";
      case 46:
      // return "已落户";
      case 49:
      // return "已过户";
      case 52:
      // return "已出库";
      case 55:
      // return "已入库";
      case 59:
        // return "交车审核通过";
        return require("../../res/img/icon_task_done.png");
    }
  }

  _getStatus(status) {
    switch (status) {
      case 1:
        return "待整备";
      case 8:
        return "整备中";
      case 15:
        return "整备完毕";
      case 22:
        return "已取消";
      case 28:
        return "待开票";
      case 29:
        return "已开票";
      case 30:
        return "待退票";
      case 31:
        return "已退票";
      case 32:
        return "处理中";
      case 33:
        return "已取消";
      case 34:
        return "待绑定";
      case 35:
        return "已绑定";
      case 36:
        return "待解绑";
      case 37:
        return "已解绑";
      case 38:
        return "已取消";
      case 39:
        return "待确认";
      case 40:
        return "待处理";
      case 41:
        return "处理中";
      case 42:
        return "处理完毕";
      case 43:
        return "无需处理";
      case 44:
        return "已取消";
      case 45:
        return "待落户";
      case 46:
        return "已落户";
      case 47:
        return "已取消";
      case 48:
        return "待过户";
      case 49:
        return "已过户";
      case 50:
        return "已取消";
      case 51:
        return "待出库";
      case 52:
        return "已出库";
      case 53:
        return "已取消";
      case 54:
        return "待入库";
      case 55:
        return "已入库";
      case 56:
        return "已取消";
      case 57:
        return "通知客户提车";
      case 58:
        return "交车审核中";
      case 59:
        return "交车审核通过";
      case 60:
        return "已取消";
    }
  }
}

export class InvoicePanel extends Component {
  render() {
    invoice = this.props.item;
    return (
      <View style={styles.invoiceContainer}>
        <ItemTitle title="发票信息" onPress={this.props.item.titlePress} />
        <Text style={styles.invoiceCompony}>{invoice.purchaserName}</Text>
        <Text style={styles.invoiceNo}>{invoice.invoiceNo}</Text>
        <Text style={styles.invoiceValue}>
          {"税价合计：" + invoice.totalTaxMoney}
        </Text>
      </View>
    );
  }
}

export class ExpressPanel extends Component {
  render() {
    express = this.props.item.express;
    if (express) {
      return (
        <View style={styles.invoiceContainer}>
          <ItemTitle title="邮寄信息" />
          <Text style={[styles.panelLeftText, styles.panelFirstLineTop]}>
            {"收件人"}
          </Text>
          <Text style={styles.expressContract}>{express.expressReceiver}</Text>
          <Text style={styles.expressAddress}>{express.expressAddress}</Text>
          <Text style={[styles.panelLeftText, styles.expressNoName]}>
            {"快递"}
          </Text>
          <TextWithCopy
            style={styles.expressNo}
            copy={express.expressNo}
            text={express.expressCompany + " " + express.expressNo}
          />
        </View>
      );
    }
    return <TaskUndo title="邮寄信息" status="待邮寄" />;
  }
}

export class InsurancePanel extends Component {
  render() {
    insurance = this.props.item;
    if (insurance) {
      return (
        <View style={styles.insuranceContainer}>
          <ItemTitle title="保险信息" onPress={this.props.item.titlePress} />
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
            {insurance.insurPolicyHolder}
          </Text>
          <Text style={[styles.panelRightText, styles.panelSecondLineTop]}>
            {insurance.insurInsurant}
          </Text>
          <Text style={[styles.panelRightText, styles.panelThirdLineTop]}>
            {insurance.insurBeneficiary}
          </Text>
          <Text style={[styles.panelRightText, styles.panelFourthLineTop]}>
            {insurance.insurCompany}
          </Text>
        </View>
      );
    }
    return <TaskUndo title="保险信息" status="未投保" />;
  }
}

export class TaskUndo extends Component {
  render() {
    return (
      <View style={{ backgroundColor: "white", height: 92 }}>
        <ItemTitle title={this.props.title} />
        <Text style={[styles.panelFirstLineTop, styles.panelLeftText]}>
          {this.props.status}
        </Text>
      </View>
    );
  }
}

const { width } = Dimensions.get("window");
const imageWidth = width * 0.28;
const imageMargin = width * (10 / 375);
const panelPadding = width * (20 / 375);
export class AttachmentPanel extends Component {
  _renderImageItem(imageSource) {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.item.imagePress("CarInfoScreen");
        }}
      >
        <Image style={styles.imageStyles} source={{ uri: imageSource }} />
      </TouchableOpacity>
    );
  }

  _renderImages() {
    let images = [];
    if (this.props.item) {
      let imageUris = this.props.item.imageUris;
      imageUris.forEach(uri => {
        images.push(this._renderImageItem(uri));
      });

      return images;
    }
  }

  render() {
    return (
      <View style={styles.attachmentContainer}>
        <ItemTitle title="附件信息" />
        {this._renderImages()}
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
          Clipboard.setString(
            this.props.copy ? this.props.copy : this.props.text
          );
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
  },
  attachmentContainer: {
    backgroundColor: "white",
    flex: 1,
    paddingTop: 61,
    paddingLeft: panelPadding,
    flexWrap: "wrap",
    flexDirection: "row"
  },
  imageStyles: {
    height: imageWidth,
    width: imageWidth,
    marginRight: imageMargin,
    marginBottom: imageMargin
  }
});

const imageUris = [
  "http://c.hiphotos.baidu.com/image/pic/item/060828381f30e92452b0863f4e086e061d95f7ac.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/d4628535e5dde711cd2a5cfca5efce1b9d16613b.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/00e93901213fb80e31c566dd34d12f2eb93894a7.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/472309f790529822dff183cad5ca7bcb0b46d4fd.jpg",
  "http://a.hiphotos.baidu.com/image/pic/item/d1a20cf431adcbeffe42a207aeaf2edda3cc9fb9.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/5243fbf2b211931372c468a064380cd791238d1f.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/96dda144ad345982f06dfa980ef431adcaef84d0.jpg"
];

const demoData = props => {
  data = [
    {
      key: "0",
      type: "baseInfo",
      title: "基础信息",
      taskNo: "KH232244",
      business: "一级业务线 - 二级业务线",
      fromNo: "SD283238923472283789320",
      titlePress: () => {
        props.navigation.navigate("TaskBasicInfo");
      }
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
      },
      titlePress: () => {
        props.navigation.navigate("CarInfoScreen");
      }
    },
    {
      key: "2",
      type: "invoiceInfo",
      invoice: {
        compony: "北京神州汽车租赁有限公司",
        NO: "32435443783294837823234",
        value: "税价合计: 112,123.00"
      },
      titlePress: () => {
        props.navigation.navigate("InvoiceInfoScreen");
      }
    },
    {
      key: "3",
      type: "expressInfo",
      express: {
        contract: "李二狗 1588888888",
        address: "北京市海淀区中关村东路118号",
        NO: "顺丰快递 134627381736173"
      }
    },
    {
      key: "3",
      type: "expressInfo"
    },
    {
      key: "4",
      type: "insuranceInfo",
      insurance: {
        applicant: "李二狗",
        insured: "李二狗",
        beneficiary: "李二狗",
        company: "中国平安保险有限公司"
      },
      titlePress: () => {
        props.navigation.navigate("InsuranceDetailScreen");
      }
    },
    {
      key: "4",
      type: "insuranceInfo"
    },
    {
      key: "5",
      type: "attachmentInfo",
      imageUris: imageUris,
      imagePress: uri => {
        props.navigation.navigate("CarInfoScreen");
      }
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
  ];
  return data;
};
