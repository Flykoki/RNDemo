import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { RootView } from "../../component/CommonView";
import { titleOptions } from "../../component/Titie";
import AccountHelper from "../../login/AccountHelper";

export default class BusinessInfoScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return titleOptions({
      navigation,
      title: "基本信息"
    });
  };

  constructor(props) {
    super(props);
    this.state = { status: "loading", distributor: {} };
  }

  componentDidMount() {
    this._loadData();
  }

  render() {
    return (
      <RootView
        style={styles.root}
        status={this.state.status}
        custom={this._renderCustomView()}
      />
    );
  }

  _loadData() {
    distributorInfo = this.props.navigation.getParam("distributorInfo");
    userInfo = distributorInfo.userInfo;
    console.log("_loadData info", distributorInfo);

    this.setState({
      status: "custom",
      distributor: {
        name: userInfo.distributorName,
        license: userInfo.registrationCode,
        type: userInfo.distributorType === 0 ? "企业" : "个人",
        opend: this._parseToBusinessString(userInfo.businessInfos),
        stores: userInfo.storeInfoString.replace(/,/g, "\n"),
        code: userInfo.distributorCode
      }
    });
  }

  _parseToBusinessString(businessList) {
    strings = [];
    for (let i in businessList) {
      business = businessList[i];
      if (business.businessStatus === "3") {
        string = this._parseBusinessCodeToString(business.businessType);
        if (string) {
          strings.push(string);
        }
      }
    }
    return strings.join(",");
  }

  _parseBusinessCodeToString(code) {
    switch (code) {
      case 1:
        return "4S金融";
      case 2:
        return "全款购车";
      case 3:
        return "金融分销";
      case 4:
        return "供应商";
      case 5:
        return "宝沃营销";
      default:
        return null;
    }
  }

  _renderCustomView() {
    return (
      <View style={styles.container}>
        <ItemView name="渠道商" value={this.state.distributor.name} />
        <ItemView name="执照号" value={this.state.distributor.license} />
        <ItemView name="类型" value={this.state.distributor.type} />
        <ItemView name="已开通" value={this.state.distributor.opend} />
        <ItemView name="门店" value={this.state.distributor.stores} />
        <View style={styles.divider} />

        <ItemView name="渠道标识" value={this.state.distributor.code} />
      </View>
    );
  }
}

class ItemView extends Component {
  render() {
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.leftText} color="#666666">
          {this.props.name}
        </Text>
        <Text style={styles.rightText} color="#333333">
          {this.props.value}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: { backgroundColor: "#F8F8F8", flex: 1, paddingTop: 10 },
  container: {
    backgroundColor: "#FFFFFF",
    marginLeft: 10,
    marginRight: 10,
    flexDirection: "column",
    paddingBottom: 15,
    borderRadius: 3
  },
  itemContainer: {
    width: "100%",
    justifyContent: "space-between",
    paddingLeft: 25,
    paddingRight: 25,
    paddingTop: 15,
    flexDirection: "row"
  },
  leftText: {
    fontSize: 14
  },
  rightText: {
    fontSize: 14,
    textAlign: "right"
  },
  divider: {
    height: 0.5,
    backgroundColor: "#E5E5E5",
    marginLeft: 15,
    marginRight: 15,
    marginTop: 14.5
  }
});
