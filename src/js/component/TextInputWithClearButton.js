import React, { Component } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  CheckBox,
  Image,
  Text
} from "react-native";
export default class TextInputWithClearButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clearButtonFocus: false
    };
  }

  render() {
    const _props = this.props;
    const leftImg = this.LeftImg;
    return (
      <View style={_props.containerStyle ? _props.container : styles.container}>
        {leftImg && <Image style={styles.leftImage} source={leftImg} />}
        <TextInput
          style={[
            _props.textInputStyle ? _props.textInputStyle : styles.textInput,
            { flex: 1 }
          ]}
          placeholder={_props.placeholder ? _props.placeholder : ""}
          onFocus={() => {
            this.state.clearButtonFocus = true;
          }}
          onBlur={() => {
            this.setState({ showClearButton: false });
          }}
          maxLength={20}
          placeholderTextColor={"#999999"}
          selectionColor={"#CCCCCC"}
          secureTextEntry={true}
          value={this.state.oriPassword}
          onChangeText={text => {
            let enableCommit = text.length > 0;
            let enableClearButton =
              text.length > 0 && this.state.clearButtonFocus;
            this.setState({
              commitEnable: enableCommit,
              oriPassword: text,
              showClearButton: enableClearButton
            });
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
          onPress={() =>
            this.setState({
              oriPassword: "",
              commitEnable: false,
              showClearButton: false
            })
          }
        >
          <Image
            source={
              this.state.showClearButton
                ? require("../../../../res/img/icon_app_clear_button.png")
                : {}
            }
          />
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center"
  },
  leftImage: {
    height: 15,
    width: 15
  },
  textInput: {
    flex: 1,
    marginLeft: 11
  },
  text: {
    color: "#666666",
    fontSize: 12,
    marginLeft: 10
  }
});
