import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  StatusBar
} from "react-native";
import SettingsList from "../../component/SettingsList";

export default class PersonalInfoScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "个人信息",
      headerRight: <View />,
      headerLeft: (
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={styles.backButtonStyle}
        >
          <Image source={require("../../../res/img/icon_back.png")} />
        </TouchableOpacity>
      )
    };
  };

  constructor(props) {
    super(props);
    this._initData();
  }

  _initEmployeeData() {
    return [
      {
        key: 0,
        type: "margin",
        margin: 10
      },
      {
        key: 1,
        name: "姓名",
        type: "item",
        value: "懒懒岚"
      },
      {
        key: 10,
        type: "divider"
      },
      {
        key: 2,
        name: "二维码",
        value: "立即设置",
        type: "item"
      },
      {
        key: 11,
        type: "divider"
      },
      {
        key: 3,
        name: "邀请码",
        value: "22233232",
        type: "item"
      },
      {
        key: 0,
        type: "margin",
        margin: 9.7
      },
      {
        key: 4,
        name: "登录账号",
        value: "18888888888",
        type: "item"
      },
      {
        key: 12,
        type: "divider"
      },
      {
        key: 5,
        name: "员工编号",
        value: "aaaaa",
        type: "item"
      },
      {
        key: 13,
        type: "divider"
      },
      {
        key: 6,
        name: "手机",
        value: "1888888888",
        type: "item"
      },
      {
        key: 14,
        type: "divider"
      },
      {
        key: 7,
        name: "所在部门",
        value: "运营管理部",
        type: "item"
      },
      {
        key: 15,
        type: "divider"
      },
      {
        key: 8,
        name: "账号角色",
        value: "普通管理员",
        type: "item"
      }
    ];
  }

  _initDealerData() {
    return [
      {
        key: 1,
        name: "修改密码",
        showArrow: "1",
        type: "item",
        onPress: () => {
          this.props.navigation.goBack();
        }
      },
      {
        key: 10,
        type: "divider"
      },
      {
        key: 2,
        name: "密保手机号",
        value: "立即设置",
        showArrow: "1",
        type: "item"
      },
      {
        key: 0,
        type: "margin",
        margin: 9.7
      },
      {
        key: 3,
        name: "消息通知",
        showArrow: "1",
        type: "item"
      },
      {
        key: 0,
        type: "margin",
        margin: 9.7
      },
      {
        key: 4,
        name: "清空缓存",
        showArrow: "1",
        type: "item"
      },
      {
        key: 12,
        type: "divider"
      },
      {
        key: 5,
        name: "检测新版本",
        showArrow: "1",
        type: "item"
      },
      {
        key: 13,
        type: "divider"
      },
      {
        key: 6,
        name: "版本说明",
        showArrow: "1",
        type: "item"
      }
    ];
  }

  _initData() {
    this.state = { data: this._initEmployeeData() };
  }

  render() {
    return (
      <View style={{ backgroundColor: "#F8F8F8", flex: 1 }}>
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
  backButtonStyle: { marginLeft: 20, width: 50 }
});
