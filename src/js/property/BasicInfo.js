import React, { Component } from "react";
import { View, StatusBar, Text, StyleSheet, Clipboard } from "react-native";
import SettingsList from "../../js/component/SettingsList";
import { titleOptions } from "../../js/component/Titie";

export default class SettingsScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return titleOptions({ navigation, title: "基础信息" });
  };

  constructor(props) {
    super(props);
    this.state = {
      data: [
        {
          key: "0",
          type: "margin",
          margin: 12
        },
        {
          key: "1",
          name: "任务编号",
          type: "item",
          value: "JLASDFJ2L39408UJFLAJ"
        },
        {
          key: "10",
          type: "divider"
        },
        {
          key: "2",
          name: "任务状态",
          value: "待整备",
          type: "item"
        },
        {
          key: "0",
          type: "divider"
        },
        {
          key: "3",
          name: "申请部门",
          value: "长沙",
          type: "item"
        },
        {
          key: "0",
          type: "divider"
        },
        {
          key: "4",
          name: "申请原因",
          value: "新车分期销售",
          type: "item"
        },
        {
          key: "12",
          type: "divider"
        },
        {
          key: "5",
          name: "归属部门",
          value: "资产",
          type: "item"
        },
        {
          key: "13",
          type: "divider"
        },
        {
          key: "6",
          name: "来源单据号",
          value: "ASFDGRT45342EWFASH46",
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
          value: "FDGDT3423",
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
          value: "按施工方突然收到",
          type: "item"
        }
      ]
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        <SettingsList data={this.state.data} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    justifyContent: "space-between",
    flexDirection: "column"
  },
  loginOutStyle: {
    height: 39,
    marginLeft: 14,
    marginRight: 14,
    marginBottom: 21,
    borderRadius: 3,
    backgroundColor: "#F12E49",
    alignItems: "center",
    justifyContent: "center"
  },
  loginOutTextStyle: {
    color: "white",
    textAlign: "center"
  },
  backButtonStyle: {
    marginLeft: 20,
    width: 50,
    height: 50,
    flex: 1,
    justifyContent: "center"
  }
});
