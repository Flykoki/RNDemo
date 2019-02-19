import React, { Component } from "react";
import { TouchableOpacity, Image } from "react-native";

export default class Switch extends Component {
  constructor(props) {
    super(props);
    const { status } = this.props;
    this.state = {
      stateValue: status
    };
  }
  render() {
    const { openimg, closeimg } = this.props;
    const openStatus = this.props.openimg
      ? openimg
      : require("../../res/img/app_msg_setting_open_icon.png");
    const closeStatus = closeimg
      ? this.props.closeimg
      : require("../../res/img/app_msg_setting_close_icon.png");
    return (
      <TouchableOpacity
        onPress={() => {
          this.setState({ stateValue: !this.state.stateValue });
        }}
      >
        <Image
          style={{ height: 24, width: 50 }}
          source={this.state.stateValue ? openStatus : closeStatus}
        />
      </TouchableOpacity>
    );
  }
}
