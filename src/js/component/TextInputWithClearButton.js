import React, { Component } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableHighlight,
  Image,
  Text
} from "react-native";
export default class TextInputWithClearButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clearButtonFocus: false,
      value: "",
      showClearButton: false
    };
  }

  render() {
    const _props = this.props;
    const leftImg = _props.leftImg;
    const clearImg = _props.clearImg;
    return (
      <View
        style={[
          { height: 50, flexDirection: "column", justifyContent: "flex-start" },
          this.props.bodyStyle
        ]}
      >
        <View
          style={_props.containerStyle ? _props.container : styles.container}
        >
          {leftImg && (
            <Image
              resizeMode={"contain"}
              style={[styles.leftImage, this.props.leftImgStyle]}
              source={leftImg}
            />
          )}
          <TextInput
            style={[styles.textInput, { flex: 1 }, _props.textInputStyle]}
            {...this.props}
            onFocus={() => {
              let enableClearButton = this.state.value.length != 0;
              this.setState({
                clearButtonFocus: true,
                showClearButton: enableClearButton
              });
              this.props.onFocus && this.props.onFocus();
            }}
            onBlur={() => {
              this.setState({ showClearButton: false });
              this.props.onBlur && this.props.onBlur();
            }}
            value={this.state.value}
            onChangeText={text => {
              let enableClearButton =
                text.length > 0 && this.state.clearButtonFocus;
              this.setState({
                value: text,
                showClearButton: enableClearButton
              });

              this.props.onChangeText && this.props.onChangeText(text);
            }}
          />
          <TouchableHighlight
            style={
              this.state.showClearButton
                ? styles.clearButtonShow
                : styles.clearButtonHide
            }
            disabled={this.state.showClearButton ? false : true}
            underlayColor={"transparent"}
            onPress={() => {
              this.setState({
                value: "",
                showClearButton: false
              });

              this.props.onClearButtonPress && this.props.onClearButtonPress();
            }}
          >
            <Image
              source={
                this.state.showClearButton
                  ? clearImg
                    ? clearImg
                    : require("../../res/img/icon_app_clear_button.png")
                  : {}
              }
            />
          </TouchableHighlight>
        </View>
        <View style={styles.diver} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  diver: {
    height: 1,
    width: "100%",
    backgroundColor: "#E5E5E5"
  },
  container: {
    height: 50,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center"
  },
  leftImage: {
    height: 15,
    width: 15,
    marginRight: 11
  },
  clearButtonShow: {
    width: 50,
    height: 50,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  clearButtonHide: {
    width: 50
  },
  textInput: {
    color: "#666666",
    fontSize: 12,
    flex: 1
  },
  text: {
    color: "#666666",
    marginLeft: 10
  }
});
