import React, { Component } from "react";
import { View, Clipboard } from "react-native";
import { titleOptions } from "../component/Titie";
import { RootView } from "../component/CommonView";
import SettingsList from "../component/SettingsList";

export default class CarInfoScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return titleOptions({ navigation, title: "车辆信息" });
  };
  constructor(props) {
    super(props);
    this.state = {
      status: "loading"
    };
    this._initData();
  }

  _initData() {
    setTimeout(() => {
      this.setState({
        status: "custom",
        data: this._fetchData({
          type: "新车",
          frameNo: "SD283238923472283789320",
          plateNo: "闽D 88888",
          engineNo: "SD283238923472283789320",
          brand: "宝沃",
          series: "BX7",
          model: "SUV",
          color: "宝蓝"
        })
      });
    }, 500);
  }

  _fetchData(carInfo) {
    return [
      { key: "0", type: "margin", margin: 10 },
      { key: "11", type: "item", name: "车况类型", value: carInfo.type },
      { key: "01", type: "divider" },
      {
        key: "12",
        type: "item",
        name: "车架号",
        value: carInfo.frameNo,
        rightIcon: require("../../res/img/copy.png"),
        onPress: () => {
          Clipboard.setString(carInfo.frameNo);
        }
      },
      {
        key: "02",
        type: "divider"
      },
      {
        key: "13",
        name: "车牌号",
        value: carInfo.plateNo,
        type: "item"
      },
      {
        key: "03",
        type: "divider"
      },
      {
        key: "14",
        name: "发动机号",
        value: carInfo.engineNo,
        type: "item",
        rightIcon: require("../../res/img/copy.png"),
        onPress: () => {
          Clipboard.setString(carInfo.engineNo);
        }
      },
      {
        key: "04",
        type: "divider"
      },
      {
        key: "15",
        name: "品牌",
        value: carInfo.brand,
        type: "item"
      },
      {
        key: "05",
        type: "divider"
      },
      {
        key: "16",
        name: "车系",
        value: carInfo.series,
        type: "item"
      },
      { key: "06", type: "divider" },
      {
        key: "17",
        name: "车型",
        value: carInfo.model,
        type: "item"
      },
      {
        key: "07",
        type: "divider"
      },
      {
        key: "18",
        name: "外观颜色",
        value: carInfo.color,
        type: "item"
      }
    ];
  }

  _cutomView() {
    return <SettingsList data={this.state.data} />;
  }

  render() {
    return (
      <RootView
        style={{ backgroundColor: "#F8F8F8", flex: 1 }}
        status={this.state.status}
        custom={this._cutomView()}
      />
    );
  }
}
