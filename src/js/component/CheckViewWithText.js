import React, { Component } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  CheckBox,
  Image,
  Text
} from "react-native";

export default class CheckViewWithText extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stateValue: this.props.defaultState
    };
  }
  render() {
    const checkImg = this.props.checkImgSrc
      ? this.props.checkImgSrc
      : require("../../res/img/app_feed_checked.png");
    const defaultImg = this.props.defaultImgSrc
      ? this.props.defaultImgSrc
      : require("../../res/img/app_feed_normal.png");

    return (
      <TouchableOpacity
        style={this.props.Container ? this.props.Container : styles.Container}
        onStartShouldSetResponder={() => true}
        onResponderGrant={evt => {
          // 事件处理申请成功
          console.log("lfj onResponderGrant:" + evt);
        }}
        onResponderReject={evt => {
          // 事件处理申请失败
          console.log("lfj onResponderReject:" + evt);
        }}
        onResponderStart={evt => {
          //down 事件回调
        }}
        onResponderMove={evt => {
          //move 事件回调
        }}
        onResponderRelease={evt => {
          //up 事件回调
        }}
        onResponderEnd={evt => {
          //结束 事件回调
        }}
        onPress={() => this._checkBoxContainerOnPress()}
      >
        <Image
          style={this.props.imgStyle ? this.props.imgStyle : styles.imgDefault}
          source={this.state.stateValue ? checkImg : defaultImg}
        />
        <Text style={this.props.textStyle ? this.props.textStyle : styles.text}>
          {this.props.text ? this.props.text : ""}
        </Text>
      </TouchableOpacity>
    );
  }

  _checkBoxContainerOnPress = () => {
    this.props.onValueChangeCallback(!this.state.stateValue);
    this.setState({
      stateValue: !this.state.stateValue
    });
  };
}

const styles = StyleSheet.create({
  Container: { flexDirection: "row", alignItems: "center", marginBottom: 18 },
  imgDefault: {
    height: 20,
    width: 20
  },
  text: {
    color: "#666666",
    fontSize: 12,
    marginLeft: 10
  }
});
