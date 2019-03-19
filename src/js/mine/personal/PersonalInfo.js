import React, { Component } from "react";
import { StyleSheet, View, StatusBar, Clipboard } from "react-native";
import { NavigationActions } from "react-navigation";
import SettingsList from "../../component/SettingsList";
import { titleOptions } from "../../component/Titie";
import { RootView } from "../../component/CommonView";
import AccountHelper, {
  ACCOUNT_TYPE_DISTRIBUTOR,
  ACCOUNT_TYPE_EMPLOYEE
} from "../../login/AccountHelper";

export default class PersonalInfoScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return titleOptions({
      navigation,
      title: "个人信息"
    });
  };

  constructor(props) {
    super(props);
    this.state = {
      status: "loading"
    };
    this._initData();
  }

  componentDidMount() {
    this._navListener = this.props.navigation.addListener("didFocus", () => {
      StatusBar.setBarStyle("dark-content");
      StatusBar.setBackgroundColor("#FFFFFF");
    });
  }

  componentWillUnmount = () => {
    this._navListener.remove();
  };

  _initData() {
    AccountHelper.getAccountInfo().then(accountInfo => {
      if (accountInfo) {
        switch (accountInfo.localType) {
          case ACCOUNT_TYPE_DISTRIBUTOR:
            this._getDistributorInfo(accountInfo.accountInfo);
            return;
          case ACCOUNT_TYPE_EMPLOYEE:
            this._getEmployeeInfo();
            return;
          default:
            break;
        }
      }
      this._onErrorLogin();
    });
  }

  _onErrorLogin() {
    this.props.navigation.reset(
      [NavigationActions.navigate({ routeName: "DistributePage" })],
      0
    );
  }

  _getEmployeeInfo() {
    AccountHelper.getEmployeeInfo(
      content => {
        console.log("getEmployeeInfo content = ", content);
        this.setState({
          data: this._initEmployeeData(content),
          userInfo: {
            name: content.empName,
            invitationCode: content.invitationCode,
            company: "神州优车集团"
          },
          status: "custom"
        });
      },
      err => {
        console.log("getEmployeeInfo err = ", err);
        this.setState({ status: "loadingFailed" });
      }
    );
  }

  _getDistributorInfo(accountInfo) {
    this.setState({
      data: this._initDealerData(accountInfo),
      userInfo: {
        name: accountInfo.contacts,
        invitationCode: accountInfo.marketingInvitationCode,
        company: "神州渠道商"
      },
      status: "custom"
    });
  }

  _funcustomConfirm() {
    this.props.navigation.navigate("QrCodeInfoScreen", {
      userInfo: this.state.userInfo
    });
  }

  _customView() {
    return <SettingsList data={this.state.data} />;
  }

  render() {
    const { status } = this.state;
    return (
      <View style={styles.container}>
        <RootView
          status={status}
          failed={{
            tips: "加载失败",
            onPress: () => {
              this.setState({ status: "loading" });
              this._initData();
            },
            btnText: "重新加载"
          }}
          custom={this._customView()}
        />
      </View>
    );
  }

  _initEmployeeData(data) {
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
        value: data.empName
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
        value: data.invitationCode,
        rightIcon: require("../../../res/img/copy.png"),
        type: "item",
        onPress: () => {
          Clipboard.setString(data.invitationCode);
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
        value: data.account,
        type: "item"
      },
      {
        key: "12",
        type: "divider"
      },
      {
        key: "5",
        name: "员工编号",
        value: data.empNo,
        type: "item"
      },
      {
        key: "13",
        type: "divider"
      },
      {
        key: "6",
        name: "手机",
        value: data.empMobile,
        type: "item"
      },
      {
        key: "14",
        type: "divider"
      },
      {
        key: "7",
        name: "所在部门",
        value: data.deptName,
        type: "item"
      },
      {
        key: "15",
        type: "divider"
      },
      {
        key: "8",
        name: "账号角色",
        value: data.accountRole,
        type: "item"
      }
    ];
  }

  _initDealerData(accountInfo) {
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
        value: accountInfo.contacts
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
        value: accountInfo.marketingInvitationCode,
        rightIcon: require("../../../res/img/copy.png"),
        type: "item",
        onPress: () => {
          Clipboard.setString(accountInfo.marketingInvitationCode);
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
        value: accountInfo.account,
        type: "item"
      },
      {
        key: "12",
        type: "divider"
      },
      {
        key: "5",
        name: "联系电话",
        value: accountInfo.contactsTel,
        type: "item"
      },
      {
        key: "12",
        type: "divider"
      },
      {
        key: "6",
        name: "渠道商",
        value: accountInfo.distributorName,
        type: "item"
      },
      {
        key: "12",
        type: "divider"
      },
      {
        key: "7",
        name: "账号权限",
        value: this._getPermissionByType(accountInfo.permissionType),
        type: "item"
      },
      {
        key: "12",
        type: "divider"
      },
      {
        key: "8",
        name: "支持操作业务",
        value: accountInfo.businessInfoString,
        type: "item"
      },
      {
        key: "12",
        type: "divider"
      },
      {
        key: "9",
        name: "支持门店",
        value: accountInfo.storeInfoString,
        type: "item"
      }
    ];
  }

  /**
   * int类型 权限类型（1：超级管理员，2：管理员，3：普通员工）
   */
  _getPermissionByType(type) {
    switch (type) {
      case 1:
        return "超级管理员";
      case 2:
        return "管理员";
      default:
        return "普通员工";
    }
  }
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#F8F8F8", flex: 1 },
  backButtonStyle: { marginLeft: 20, width: 50 }
});
