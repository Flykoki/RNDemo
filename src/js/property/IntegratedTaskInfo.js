import React, { Component } from "react";
import { View, Text, Image, Clipboard } from "react-native";
import SettingsList from "../component/SettingsList";
import { titleOptions } from "../component/Titie";
import { RootView } from "../component/CommonView";
import { FlatList } from "react-native-gesture-handler";

export default class IntegratedTaskInfo extends Component {
  static navigationOptions = ({ navigation }) => {
    return titleOptions({ navigation, title: "任务集合信息" });
  };

  constructor(props) {
    super(props);
    this.state = { status: "loading" };
    this._initData();
  }

  _initData() {
    setTimeout(() => {
      this.setState({
        status: "custom",
        data: this._fetchLines({
          taskNo: "SD283238923472283789320",
          taskStatus: "处理中",
          from: "SD283238923472283789320",
          applyDepartment: "市场部",
          applyReason: "购买",
          handoverDepartment: "资产部",
          taskTarget: "客户",
          taskPerformance: "完成/4",
          createTime: "2019/03/04 12:42:11",
          completeTime: "2019/03/10 13:44:07",
          elapsed: 6
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
        customView: <TaskFlowPanel title="全部执行部门" />,
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

  _customView() {
    return <SettingsList data={this.state.data} />;
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
}

class TaskFlowPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        { key: "1", department: "部门1" },
        { key: "1", department: "部门1" },
        { key: "1", department: "部门1" },
        { key: "1", department: "部门1" },
        { key: "1", department: "部门1" },
        { key: "1", department: "部门1" },
        { key: "1", department: "部门1" },
        { key: "1", department: "部门1" },
        { key: "1", department: "部门1" },
        { key: "1", department: "部门1" },
        { key: "1", department: "部门1" },
        { key: "1", department: "部门1" },
        { key: "1", department: "部门1" },
        { key: "1", department: "部门1", current: true },
        { key: "1", department: "部门1" },
        { key: "1", department: "部门1" },
        { key: "1", department: "部门1" }
      ]
    };
  }
  _renderItem({ item, index }) {
    return (
      <View style={{ flexDirection: "row" }}>
        <Text
          style={{ color: item.current ? "#F12E49" : "#333333", fontSize: 14 }}
        >
          {item.department}
        </Text>
        {!(index === 16) && (
          <Text style={{ marginLeft: 5, marginRight: 5 }}>></Text>
        )}
      </View>
    );
  }
  render() {
    return (
      <View
        style={{
          height: 75,
          paddingLeft: 16,
          paddingRight: 20,
          backgroundColor: "#FFFFFF"
        }}
      >
        <Text
          style={{ marginTop: 11, height: 20, color: "#666666", fontSize: 14 }}
        >
          {this.props.title}
        </Text>
        <FlatList
          style={{ marginTop: 10, height: 20 }}
          data={this.state.data}
          renderItem={this._renderItem}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  }
}
