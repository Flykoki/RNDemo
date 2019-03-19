import React, { Component } from "react";
import { View } from "react-native";
import { RootView } from "./../../component/CommonView";
import { titleOptions } from "./../../component/Titie";
import QrCodeScreen from "./QrCodeScreen";

export default class QrCodeInfoScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return titleOptions({
      navigation,
      title: "二维码"
    });
  };

  constructor(props) {
    super(props);
    this.state = { status: "loading" };
  }

  componentDidMount() {
    userInfo = this.props.navigation.getParam("userInfo");
    console.log("userInfo", userInfo);
    this.setState({ status: "custom", info: userInfo });
  }

  render() {
    return (
      <RootView status={this.state.status} custom={this._renderCustomView()} />
    );
  }

  _renderCustomView() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#F8F8F8",
          alignContent: "center",
          alignItems: "center"
        }}
      >
        <QrCodeScreen
          info={this.state.info}
          style={{
            width: 325,
            height: 436,
            marginTop: 41
          }}
        />
      </View>
    );
  }
}
