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

export default class InitSecurityPhoneStep2 extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "设置密保手机号2/2",
      headerRight: <View />,
      headerLeft: (
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={styles.backButtonStyle}
        >
          <Image source={require("../../../../res/img/icon_back.png")} />
        </TouchableOpacity>
      )
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      showClearButton: false,
      commitEnable: false,
      sendVerificationCodeEnable: true,
      securityPhone: "",
      timeLeft: 60,
      countDownTextContent: "发送验证码",
      verificationCode: ""
    };

    this._validFormData.bind(this);
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.tip}>请设置密保手机号</Text>
        {/* =================== 密保手机 ===================== */}

        <View style={styles.textInputContainer}>
          <Image
            style={styles.textInputLeftImg}
            source={require("../../../../res/img/app_phoneno_icon.png")}
          />
          <TextInput
            style={styles.textInput}
            placeholder={"密保手机号"}
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
            value={this.state.securityPhone}
            onChangeText={text => {
              let enableCommit =
                text.length > 0 && this.state.verificationCode.length > 0;
              let enableClearButton =
                text.length > 0 && this.state.clearButtonFocus;
              this.setState({
                commitEnable: enableCommit,
                securityPhone: text,
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
            underlayColor={"black"}
            onPress={() =>
              this.setState({
                securityPhone: "",
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
        <View style={styles.divider} />
        {/* =================== 密保手机 ===================== */}

        {/* =================== 验证码 ===================== */}
        <View style={styles.textInputContainer}>
          <Image
            style={styles.textInputLeftImg}
            source={require("../../../../res/img/app_login_account_number_password.png")}
          />
          <TextInput
            style={styles.textInput}
            placeholder={"验证码"}
            onFocus={() => {}}
            onBlur={() => {}}
            maxLength={6}
            placeholderTextColor={"#999999"}
            selectionColor={"#CCCCCC"}
            keyboardType={"number-pad"}
            value={this.state.verificationCode}
            onChangeText={text => {
              let enableCommit =
                text.length > 0 && this.state.securityPhone.length > 0;
              this.setState({
                commitEnable: enableCommit,
                verificationCode: text
              });
            }}
          />
          {/* =================== 验证码发送view ===================== */}
          <TouchableHighlight
            style={styles.verificationCodeContainer}
            disabled={this.state.sendVerificationCodeEnable ? false : true}
            underlayColor={"transparent"}
            onPress={() => {
              if (this.state.sendVerificationCodeEnable) {
                //onPress前为ture,开始倒计时 todo lfj
                if (this.state.timeLeft > 0) {
                  let that = this;
                  let interval = setInterval(function() {
                    if (that.state.timeLeft < 1) {
                      clearInterval(interval);
                      that.setState({
                        sendVerificationCodeEnable: !that.state
                          .sendVerificationCodeEnable
                      });
                    } else {
                      let totalTime = that.state.timeLeft;
                      that.setState({

                        countDownTextContent: totalTime + "S",
                        timeLeft: totalTime - 1
                      });
                    }
                  }, 1000);
                }
              } else {
                //显示重新发送
                this.setState({
                  sendVerificationCodeEnable: !this.state
                    .sendVerificationCodeEnable,
                  countDownTextContent: "重新发送"
                });
              }
            }}
          >
            <Text
              style={
                this.state.sendVerificationCodeEnable
                  ? styles.sendVerificationCodeEnable
                  : styles.sendVerificationCodeDisable
              }
            >
              {this.state.countDownTextContent}
            </Text>
          </TouchableHighlight>
        </View>
        <View style={styles.divider} />
        {/* =================== 验证码 ===================== */}
        {/* =================== 设置按钮 ===================== */}

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
            立即设置
          </Text>
        </TouchableHighlight>
        {/* =================== 设置按钮 ===================== */}
      </View>
    );
  }

  /**
   * 检验textinput 内容的合法性
   */
  _validFormData = () => {
    let securityPhone = this.state.securityPhone;
    console.warn(securityPhone);
  };
}

const styles = StyleSheet.create({
  backButtonStyle: { marginLeft: 20, width: 50 },
  divider: {
    backgroundColor: "#F0F0F0",
    marginLeft: 30,
    marginRight: 30,
    height: 1
  },
  sendVerificationCodeEnable: {
    color: "#F12E49",
    fontSize: 16
  },
  sendVerificationCodeDisable: {
    color: "#999999",
    fontSize: 16
  },
  modifyCommitTextEnable: {
    color: "white",
    fontSize: 16
  },
  modifyCommitTextDisable: {
    color: "#BBBBBB",
    fontSize: 16
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
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    justifyContent: "flex-start",
    flexDirection: "column"
  },
  textInputContainer: {
    marginLeft: 30,
    marginRight: 30,
    height: 50,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center"
  },
  textInputLeftImg: {
    height: 15,
    width: 15
  },
  textInput: {
    flex: 1,
    marginLeft: 11
  },
  clearButtonShow: {
    width: 80,
    height: 50,
    flexDirection: "column",
    justifyContent: "center",
    paddingRight: 8,
    alignItems: 'flex-end'
  },
  verificationCodeContainer: {
    width: 80,
    height: 50,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },

  tip: {
    color: "#333333",
    fontSize: 14,
    marginLeft: 30,
    marginTop: 15,
    marginBottom: 15
  }
});
