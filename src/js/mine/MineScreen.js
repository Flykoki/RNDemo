import React, { Component } from "react";
import { View, Text, StatusBar, StyleSheet } from "react-native";
import { NavigationActions } from "react-navigation";
import SettingsList from "../component/SettingsList";
import { RootView } from "../component/CommonView";
import PersonalPanel from "./PersonalPanel";
import ComponyInfoPanel from "./ComponyInfoPanel";
import AccountHelper, {
  ACCOUNT_TYPE_DISTRIBUTOR,
  ACCOUNT_TYPE_EMPLOYEE
} from "../login/AccountHelper";

const BUSINESS_OPEN = "3";
const BUSINESS_PAUSE = "5";
const FOUR_S = 1; //: 自由贷分销（4S金融）；
const CAR = 2; //：全款购车，
const FINACE = 3; //：金融分销，
const DISTRIBUTOR = 4; //：供应商,
const BW = 5; //: 宝沃营销

export class MineScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "loading",
      isDistributor: false,
      listData: [
        { key: "1", type: "margin", margin: 10 },
        {
          key: "2",
          type: "item",
          name: "意见反馈",
          showArrow: "1",
          onPress: () => {
            this.props.navigation.navigate("Feedback");
          }
        },
        { key: "3", type: "divider" },
        {
          key: "4",
          type: "item",
          name: "设置",
          showArrow: "1",
          onPress: () => {
            this.props.navigation.navigate("Settings");
          }
        }
        // { key: "5", type: "divider" },
        // {
        //   key: "6",
        //   type: "item",
        //   name: "城市列表",
        //   showArrow: "1",
        //   onPress: () => {
        //     this.props.navigation.navigate("CityList");
        //   }
        // },
        // { key: "7", type: "divider" },
        // {
        //   key: "8",
        //   type: "item",
        //   name: "新车分期销售",
        //   showArrow: "1",
        //   onPress: () => {
        //     this.props.navigation.navigate("InstallmentSalesOfNewCars");
        //   }
        // },
        // { key: "7", type: "divider" },
        // {
        //   key: "8",
        //   type: "item",
        //   name: "全部任务",
        //   showArrow: "1",
        //   onPress: () => {
        //     this.props.navigation.navigate("MissionsCenterPage");
        //   }
        // },
        // { key: "9", type: "divider" },
        // {
        //   key: "10",
        //   type: "item",
        //   name: "测试item",
        //   showArrow: "1",
        //   onPress: () => {
        //     this.props.navigation.navigate("TestPage");
        //   }
        // },
        // { key: "9", type: "divider" },
        // {
        //   key: "10",
        //   type: "item",
        //   name: "日历",
        //   showArrow: "1",
        //   onPress: () => {
        //     this.props.navigation.navigate("CalenderScreen", {
        //       onConfirm: item => {
        //         console.log("item = ", item);
        //       }
        //     });
        //   }
        // }
      ]
    };
  }

  componentDidMount() {
    this._navListener = this.props.navigation.addListener("didFocus", () => {
      StatusBar.setTranslucent(false);
      StatusBar.setBarStyle("light-content");
      StatusBar.setBackgroundColor("#F1314B");
    });
    this._loadData();
  }

  componentWillUnmount = () => {
    this._navListener.remove();
  };

  render() {
    return (
      <RootView
        status={this.state.status}
        custom={this._renderCustomView()}
        failed={this.state.failed}
        customStatusBar={true}
      />
    );
  }

  _renderCustomView() {
    return (
      <View style={styles.container}>
        <View style={styles.panelContainer}>
          <Text style={styles.title}>我的</Text>
          <PersonalPanel
            style={{ marginBottom: this.state.isDistributor ? 46 : 21 }}
            onPress={this._onPersonalPanelPressed.bind(this)}
            name={this.state.name}
            phoneNumber={this.state.account}
          />
        </View>

        {this.state.isDistributor && (
          <ComponyInfoPanel
            style={styles.companyPanelStyle}
            info={this.state.info}
            onPress={() => {
              this.props.navigation.navigate(
                "BusinessInfoScreen",
                (params = { distributorInfo: info })
              );
            }}
          />
        )}

        <SettingsList
          styles={{ marginTop: this.state.isDistributor ? 55 : 0 }}
          data={this.state.listData}
        />
      </View>
    );
  }

  _loadData() {
    AccountHelper.getAccountInfo().then(accountInfo => {
      name = null;
      account = "";
      info = {};
      if (accountInfo) {
        isDistributor = accountInfo.localType === ACCOUNT_TYPE_DISTRIBUTOR;
        if (isDistributor) {
          this._processDistributorUserInfo(accountInfo.accountInfo);
          return;
        } else {
          name = accountInfo.empName;
          account = accountInfo.account;
        }
      }
      this.setState({
        status: "custom",
        isDistributor: false,
        name: name,
        account: account
      });
    });
  }

  _onPersonalPanelPressed() {
    if (this.state.name) {
      this.props.navigation.navigate("PersonalInfo");
    } else {
      this.props.navigation.reset(
        [NavigationActions.navigate({ routeName: "DistributePage" })],
        0
      );
    }
  }

  _processDistributorUserInfo(accountInfo) {
    AccountHelper.getDistributorInfo(
      accountInfo.distributorCode,
      userInfo => {
        console.log("_processDistributorUserInfo", userInfo);
        name = accountInfo.contacts;
        account = accountInfo.account;
        info = this._processDistributor(userInfo);
        this.setState({
          status: "custom",
          isDistributor: true,
          name: name,
          account: account,
          info: info
        });
      },
      err => {
        console.log("_processDistributorUserInfo =", err);
        this.setState({
          status: "loadingFailed",
          failed: { tips: err, onPress: this._loadData }
        });
      }
    );
  }

  _processDistributor(userInfo) {
    businessList = userInfo.businessInfos;
    business = [];
    company = "";
    for (index in businessList) {
      businessInfo = businessList[index];
      if (
        businessInfo.businessStatus === BUSINESS_OPEN ||
        businessInfo.businessStatus === BUSINESS_PAUSE
      ) {
        business.push(this._getNameByBusinessType(businessInfo.businessType));
      }
    }
    if (userInfo.distributorType == 0) {
      company = userInfo.distributorName;
    } else {
      company = userInfo.principalName;
    }
    return { company: company, business: business, userInfo: userInfo };
  }

  _getNameByBusinessType(type) {
    switch (type) {
      case FOUR_S:
        return "4s";
      case CAR:
        return "car";
      case FINACE:
        return "finance";
      case DISTRIBUTOR:
        return "distributor";
      case BW:
        return "bw";
      default:
        return "";
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "stretch",
    backgroundColor: "#F8F8F8"
  },
  panelContainer: {
    paddingTop: 13,
    backgroundColor: "#F1314B",
    flexDirection: "column",
    alignItems: "stretch"
  },
  title: {
    fontSize: 18,
    justifyContent: "center",
    textAlign: "center",
    color: "white",
    marginBottom: 17,
    alignItems: "center"
  },
  companyPanelStyle: {
    height: 83,
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
    position: "absolute",
    left: 8,
    right: 8,
    top: 130
  }
});
