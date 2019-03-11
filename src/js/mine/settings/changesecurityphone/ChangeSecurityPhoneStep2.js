import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  StatusBar
} from "react-native";
import TextInputWithClearButton from '../../../component/TextInputWithClearButton'

export default class ChangeSecurityPhoneStep2 extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "修改密保手机号2/2",
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
      sendVerificationCodeEnable: false,
      securityPhone: "",
      timeLeft: countDownTotalTime,
      countDownTextContent: "发送验证码",
      verificationCode: ""
    };

    this._validFormData.bind(this);
  }
  componentDidMount() {
    this._navListener = this.props.navigation.addListener("didFocus", () => {
      StatusBar.setTranslucent(false);//关闭沉浸式
      StatusBar.setBarStyle("dark-content");
      StatusBar.setBackgroundColor("#FFFFFF");
    });
  }

  componentWillUnmount = () => {
    this._navListener.remove();
  };
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.tip}>请设置新的密保手机号</Text>
        {/* =================== 密保手机 ===================== */}
        <TextInputWithClearButton
          bodyStyle={{ marginLeft: 30, marginRight: 30 }}
          textInputStyle={{ color: "black", fontSize: 16 }}
          maxLength={11}
          selectionColor={"#CCCCCC"}
          keyboardType={"number-pad"}
          placeholder={"密保手机号"}
          leftImg={require("../../../../res/img/app_phoneno_icon.png")}
          onChangeText={text => {
            let enableCommit =
              text.length > 0 && this.state.verificationCode.length > 0;
            let enableSendCode = text.length === 11;
            this.setState({
              commitEnable: enableCommit,
              sendVerificationCodeEnable: enableSendCode,
              securityPhone: text
            });
          }}
          onClearButtonPress={() =>
            this.setState({
              securityPhone: "",
              commitEnable: false
            })
          }
        />
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
              if (this.state.timeLeft > 0) {
                let that = this;

                //点击时候马上显示倒计时
                let totalTime = that.state.timeLeft;
                that.setState({
                  sendVerificationCodeEnable: false,
                  countDownTextContent: totalTime + "S",
                  timeLeft: totalTime - 1
                });

                let interval = setInterval(function() {
                  if (that.state.timeLeft < 1) {
                    clearInterval(interval);
                    that.setState({
                      sendVerificationCodeEnable: true,
                      countDownTextContent: "重新发送",
                      timeLeft: countDownTotalTime
                    });
                  } else {
                    let totalTime = that.state.timeLeft;
                    that.setState({
                      sendVerificationCodeEnable: false,
                      countDownTextContent: totalTime + "S",
                      timeLeft: totalTime - 1
                    });
                  }
                }, 1000);
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
const countDownTotalTime = 9;

const styles = StyleSheet.create({
  header: { fontSize: 15, fontFamily: "PingFangSC-Regular", color: "#000000" },
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
    alignItems: "flex-end"
  },
  verificationCodeContainer: {
    width: 80,
    height: 50,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-end"
  },

  tip: {
    color: "#333333",
    fontSize: 14,
    marginLeft: 30,
    marginTop: 15,
    marginBottom: 15
  }
});
