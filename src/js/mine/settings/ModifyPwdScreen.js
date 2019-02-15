import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Modal,
  CheckBox,
  Text,
  Platform,
  TextInput,
  Dimensions,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Image,
  StatusBar
} from "react-native";

const width = Dimensions.get("window").width;
const feedbackContentMaxLength = 500;

export default class ModifyPwdScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "密码修改",
      headerRight: <View />,
      headerLeft: (
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={styles.backButtonStyle}
        >
          <Image source={require("../../../res/img/icon_back.png")} />
        </TouchableOpacity>
      )
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      oriPassword: "",
      newPassword: "",
      confirmPassword: "",
      showOriPasswordClearButton: false,
      OriPasswordClearButtonFocus: false,
      showNewPasswordClearButton: false,
      newPasswordClearButtonFocus: false,
      showConfirmPasswordClearButton: false,
      confirmPasswordClearButtonFocus: false,
      commitEnable: false
    };

    this._validFormData.bind(this);
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.modifyPasswordContainer}>
          <View style={styles.modifyInputTextContainer}>
            <TextInput
              style={styles.modifyInputText}
              placeholder={"请输入旧密码"}
              secureTextEntry={true}
              underlineColorAndroid="transparent"
              placeholderTextColor={"#999999"}
              selectionColor={"#CCCCCC"}
              maxLength={20}
              onFocus={() => {
                this.state.OriPasswordClearButtonFocus = true;
              }}
              onBlur={() => {
                this.setState({ showOriPasswordClearButton: false });
              }}
              value={this.state.oriPassword}
              onChangeText={text => {
                let enableCommit =
                  text.length > 0 &&
                  this.state.newPassword.length > 0 &&
                  this.state.confirmPassword.length > 0;
                let enableClearButton =
                  text.length > 0 && this.state.OriPasswordClearButtonFocus;
                this.setState({
                  oriPassword: text,
                  commitEnable: enableCommit,
                  showOriPasswordClearButton: enableClearButton
                });
              }}
            />
            <TouchableHighlight
              style={
                this.state.showOriPasswordClearButton
                  ? styles.clearButtonShow
                  : styles.clearButtonHide
              }
              disabled={this.state.showOriPasswordClearButton ? false : true}
              underlayColor={"transparent"}
              onPress={() =>
                this.setState({
                  oriPassword: "",
                  showOriPasswordClearButton: false
                })
              }
            >
              <Image
                source={
                  this.state.showOriPasswordClearButton
                    ? require("../../../res/img/icon_app_clear_button.png")
                    : {}
                }
              />
            </TouchableHighlight>
          </View>

          <View style={styles.modifyInputTextDivider} />
          <View style={styles.modifyInputTextContainer}>
            <TextInput
              style={styles.modifyInputText}
              placeholderTextColor={"#999999"}
              selectionColor={"#CCCCCC"}
              secureTextEntry={true}
              placeholder={"请输入新密码，6-20位数字，字母或符号组合"}
              maxLength={20}
              underlineColorAndroid="transparent"
              value={this.state.newPassword}
              onFocus={() => {
                this.state.newPasswordClearButtonFocus = true;
              }}
              onBlur={() => {
                this.setState({ showNewPasswordClearButton: false });
              }}
              onChangeText={text => {
                let enable =
                  text.length > 0 &&
                  this.state.oriPassword.length > 0 &&
                  this.state.confirmPassword.length > 0;

                let enableClearButton =
                  text.length > 0 && this.state.newPasswordClearButtonFocus;
                this.setState({
                  newPassword: text,
                  commitEnable: enable,
                  showNewPasswordClearButton: enableClearButton
                });
              }}
            />
            <TouchableHighlight
              style={
                this.state.showNewPasswordClearButton
                  ? styles.clearButtonShow
                  : styles.clearButtonHide
              }
              disabled={this.state.showNewPasswordClearButton ? false : true}
              underlayColor={"transparent"}
              onPress={() => {
                this.setState({
                  newPassword: "",
                  showNewPasswordClearButton: false
                });
              }}
            >
              <Image
                source={
                  this.state.showNewPasswordClearButton
                    ? require("../../../res/img/icon_app_clear_button.png")
                    : {}
                }
              />
            </TouchableHighlight>
          </View>

          <View style={styles.modifyInputTextDivider} />
          <View style={styles.modifyInputTextContainer}>
            <TextInput
              style={styles.modifyInputText}
              placeholderTextColor={"#999999"}
              selectionColor={"#CCCCCC"}
              secureTextEntry={true}
              placeholder={"请再次输入新密码"}
              maxLength={20}
              underlineColorAndroid="transparent"
              value={this.state.confirmPassword}
              onFocus={() => {
                this.state.confirmPasswordClearButtonFocus = true;
              }}
              onBlur={() => {
                this.setState({ showConfirmPasswordClearButton: false });
              }}
              onChangeText={text => {
                let enable =
                  text.length > 0 &&
                  this.state.newPassword.length > 0 &&
                  this.state.oriPassword.length > 0;

                let enableClearButton =
                  text.length > 0 && this.state.confirmPasswordClearButtonFocus;
                this.setState({
                  confirmPassword: text,
                  commitEnable: enable,
                  showConfirmPasswordClearButton: enableClearButton
                });
              }}
            />
            <TouchableHighlight
              style={
                this.state.showConfirmPasswordClearButton
                  ? styles.clearButtonShow
                  : styles.clearButtonHide
              }
              disabled={
                this.state.showConfirmPasswordClearButton ? false : true
              }
              underlayColor={"transparent"}
              onPress={() => {
                this.setState({
                  confirmPassword: "",
                  showConfirmPasswordClearButton: false
                });
              }}
            >
              <Image
                source={
                  this.state.showConfirmPasswordClearButton
                    ? require("../../../res/img/icon_app_clear_button.png")
                    : {}
                }
              />
            </TouchableHighlight>
          </View>
          <View style={styles.modifyInputTextDivider} />
        </View>

        <TouchableHighlight
          style={
            this.state.commitEnable
              ? styles.modifyCommitEnable
              : styles.modifyCommitDisable
          }
          disabled={this.state.commitEnable ? false : true}
          onPress={this._validFormData}
        >
          <Text
            style={
              this.state.commitEnable
                ? styles.modifyCommitTextEnable
                : styles.modifyCommitTextDisable
            }
          >
            确认修改
          </Text>
        </TouchableHighlight>
      </View>
    );
  }

  /**
   * 检验textinput 内容的合法性
   */
  _validFormData = () => {
    let oriPwd = this.state.oriPassword;
    let newPwd = this.state.newPassword;
    let confirmPwd = this.state.confirmPassword;

    console.warn(oriPwd, newPwd, confirmPwd);
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    justifyContent: "flex-start",
    flexDirection: "column"
  },
  clearButtonShow: {
    height: "90%",
    width: 50,
    position: "absolute",
    right: 0,
    justifyContent: "center",
    alignItems: "center"
  },
  clearButtonHide: {
    height: "90%",
    width: 50,
    position: "absolute",
    right: 0,
    display: "none",
    justifyContent: "center",
    alignItems: "center"
  },
  modifyInputText: {
    width: "85%",
    position: "absolute",
    right: 50
  },
  modifyPasswordContainer: {
    marginTop: 10,
    backgroundColor: "#FFFFFF",
    alignItems: "center"
  },
  modifyInputTextDivider: {
    height: 1,
    width: "87%",
    backgroundColor: "#F0F0F0"
  },
  modifyInputTextContainer: {
    height: 50,
    width: "85%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center"
  },
  modifyCommitEnable: {
    height: 42,
    marginLeft: 30,
    borderRadius: 6,
    marginTop: 30,
    backgroundColor: "#F12E49",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 30
  },
  modifyCommitDisable: {
    height: 42,
    marginLeft: 30,
    borderRadius: 6,
    marginTop: 30,
    backgroundColor: "#DDDDDD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 30
  },
  modifyCommitTextEnable: {
    color: "white",
    fontSize: 16
  },
  modifyCommitTextDisable: {
    color: "#BBBBBB",
    fontSize: 16
  },
  backButtonStyle: { marginLeft: 20, width: 50 }
});
