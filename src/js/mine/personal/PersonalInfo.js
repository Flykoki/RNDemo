import React, { Component } from "react";
import { StyleSheet, View, StatusBar, Clipboard } from "react-native";
import SettingsList from "../../component/SettingsList";
import CommonDialog from "../../component/CommonDialog";
import QrCodeScreen from "./QrCodeScreen";
import { titleOptions } from "../../component/Titie";
import { RootView } from "../../component/CommonView";

export default class PersonalInfoScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return titleOptions({
      navigation,
      title: "个人信息"
    });
  };

  constructor(props) {
    super(props);
    this._initData();
  }

  _initEmployeeData() {
    return [
      {
        key: "0",
        type: "margin",
        margin: 10
      },
      {
        key: "1",
        name: "姓名",
        type: "item",
        value: "懒懒岚"
      },
      {
        key: "10",
        type: "divider"
      },
      {
        key: "2",
        name: "二维码",
        rightIcon: require("../../../res/img/qr_code.png"),
        type: "item",
        onPress: () => {
          this._funcustomConfirm();
        }
      },
      {
        key: "11",
        type: "divider"
      },
      {
        key: "3",
        name: "邀请码",
        value: "22233232",
        rightIcon: require("../../../res/img/copy.png"),
        type: "item",
        onPress: () => {
          Clipboard.setString("22233232");
        }
      },
      {
        key: "0",
        type: "margin",
        margin: 9.7
      },
      {
        key: "4",
        name: "登录账号",
        value: "18888888888",
        type: "item"
      },
      {
        key: "12",
        type: "divider"
      },
      {
        key: "5",
        name: "员工编号",
        value: "aaaaa",
        type: "item"
      },
      {
        key: "13",
        type: "divider"
      },
      {
        key: "6",
        name: "手机",
        value: "1888888888",
        type: "item"
      },
      {
        key: "14",
        type: "divider"
      },
      {
        key: "7",
        name: "所在部门",
        value: "运营管理部",
        type: "item"
      },
      {
        key: "15",
        type: "divider"
      },
      {
        key: "8",
        name: "账号角色",
        value: "普通管理员",
        type: "item"
      }
    ];
  }

  _initDealerData() {
    return [
      {
        key: "0",
        type: "margin",
        margin: 10
      },
      {
        key: "1",
        name: "姓名",
        type: "item",
        value: "懒懒岚"
      },
      {
        key: "10",
        type: "divider"
      },
      {
        key: "2",
        name: "二维码",
        rightIcon: require("../../../res/img/qr_code.png"),
        type: "item",
        onPress: () => {
          this._funcustomConfirm();
        }
      },
      {
        key: "11",
        type: "divider"
      },
      {
        key: "3",
        name: "邀请码",
        value: "22233232",
        rightIcon: require("../../../res/img/copy.png"),
        type: "item",
        onPress: () => {
          Clipboard.setString("22233232");
        }
      },
      {
        key: "0",
        type: "margin",
        margin: 9.7
      },
      {
        key: "4",
        name: "登录账号",
        value: "18888888888",
        type: "item"
      },
      {
        key: "12",
        type: "divider"
      },
      {
        key: "5",
        name: "联系电话",
        value: "18999012123",
        type: "item"
      },
      {
        key: "12",
        type: "divider"
      },
      {
        key: "6",
        name: "渠道商",
        value: "才华有限公司",
        type: "item"
      },
      {
        key: "12",
        type: "divider"
      },
      {
        key: "7",
        name: "账号权限",
        value: "客户经理",
        type: "item"
      },
      {
        key: "12",
        type: "divider"
      },
      {
        key: "8",
        name: "支持操作业务",
        value: "4s金融",
        type: "item"
      },
      {
        key: "12",
        type: "divider"
      },
      {
        key: "9",
        name: "支持门店",
        value: "望京店、直营门店",
        type: "item"
      }
    ];
  }

  _initData() {
    this.state = { data: this._initDealerData(), status: "loading" };
    setTimeout(() => {
      this.setState({ status: "loadingFailed" });
    }, 5000);
  }

  _funcustomConfirm() {
    var options = {
      animationType: "none",
      title: "自定义组件",
      thide: true,
      clickScreen: true,
      innersHeight: 600
    };
    this.refs.dcustomConfirm.show(options);
  }

  _customView() {
    return <SettingsList data={this.state.data} />;
  }

  render() {
    const { status } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        <RootView
          status={status}
          failed={{
            tips: "加载失败",
            onPress: () => {
              this.setState({ status: "custom" });
            },
            btnText: "重新加载"
          }}
          custom={this._customView()}
        />

        <CommonDialog
          ref="dcustomConfirm"
          backgroundColor="transparent"
          components={
            <QrCodeScreen
              onCloseIconPressed={() => {
                this.refs.dcustomConfirm.hide();
              }}
            />
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#F8F8F8", flex: 1 },
  backButtonStyle: { marginLeft: 20, width: 50 }
});
