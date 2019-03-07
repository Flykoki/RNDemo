import React, { Component } from "react";
import { View, Text, StatusBar, StyleSheet } from "react-native";
import SettingsList from "../component/SettingsList";
import PersonalPanel from "./PersonalPanel";
import ComponyInfoPanel from "./ComponyInfoPanel";

export class MineScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCompany: true,
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
        },
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
        { key: "7", type: "divider" },
        {
          key: "8",
          type: "item",
          name: "新车分期销售",
          showArrow: "1",
          onPress: () => {
            this.props.navigation.navigate("InstallmentSalesOfNewCars");
          }
        },
        { key: "7", type: "divider" },
        {
          key: "8",
          type: "item",
          name: "全部任务",
          showArrow: "1",
          onPress: () => {
            this.props.navigation.navigate("MissionsCenterPage");
          }
        },
        { key: "9", type: "divider" },
        {
          key: "10",
          type: "item",
          name: "测试item",
          showArrow: "1",
          onPress: () => {
            this.props.navigation.navigate("SearchViewPage");
          }
        }
      ]
    };
  }
  componentDidMount() {
    this._navListener = this.props.navigation.addListener("didFocus", () => {
      StatusBar.setBarStyle("light-content");
      StatusBar.setBackgroundColor("#F1314B");
    });
  }

  componentWillUnmount = () => {
    this._navListener.remove();
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.panelContainer}>
          <Text style={styles.title}>我的</Text>
          <PersonalPanel
            style={{ marginBottom: this.state.isCompany ? 46 : 21 }}
            onPress={() => {
              this.props.navigation.navigate("PersonalInfo");
            }}
            name="懒懒岚"
            phoneNumber="18888888888"
          />
        </View>

        {this.state.isCompany && (
          <ComponyInfoPanel
            style={styles.companyPanelStyle}
            info={{ company: "神州买买车分销商有限公司", business: ["4s"] }}
          />
        )}

        <SettingsList
          styles={{ marginTop: this.state.isCompany ? 55 : 0 }}
          data={this.state.listData}
        />
      </View>
    );
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
