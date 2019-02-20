import React, { Component } from "react";
import { View, StyleSheet, Text } from "react-native";
import SettingsList from "../../../component/SettingsList";
import { titleOptions } from "../../../component/Titie";
export default class NotificationManager extends Component {
  static navigationOptions = ({ navigation }) => {
    return titleOptions({ navigation, title: "消息通知" });
  };

  constructor(props) {
    super(props);
    this.state = {
      data: [
        {
          key: "11",
          type: "margin",
          margin: 9.7
        },
        {
          key: "0",
          name: "接收新消息",
          switchStatus: {
            status: false
          },
          type: "item"
        },
        {
          key: "12",
          type: "margin",
          margin: 9.7
        },
        {
          key: "1",
          name: "资讯攻略",
          switchStatus: {
            status: false
          },
          type: "item"
        },
        {
          key: "21",
          type: "divider"
        },
        {
          key: "2",
          name: "系统消息",
          switchStatus: {
            status: false
          },
          type: "item"
        },
        {
          key: "13",
          type: "custom",
          customView: this._customView("关闭后将可能错过系统重要资讯与消息")
        },
        {
          key: "3",
          name: "业务状态通知",
          switchStatus: {
            status: false
          },
          type: "item"
        },
        {
          key: "14",
          type: "custom",
          customView: this._customView(
            "可实时接收订单状态变更，如驳回等流转的情况"
          )
        }
      ]
    };
  }

  _customView(string) {
    return (
      <View style={styles.tipsStyle}>
        <Text>{string}</Text>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
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
  tipsStyle: { marginBottom: 4, marginLeft: 16, marginTop: 4 }
});
