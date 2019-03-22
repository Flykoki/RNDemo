import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  ToastAndroid,
  TouchableOpacity,
  TouchableHighlight,
  Image
} from "react-native";
import TextInputWithClearButton from "../../component/TextInputWithClearButton";
import { FetchUtils } from "sz-network-module";
import AccountHelper from "../../login/AccountHelper";
import { NavigationActions } from "react-navigation";

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
          <Image
            source={require("../../../res/img/icon_back.png")}
            resizeMode={"contain"}
            style={{ height: 14.6, width: 8.3 }}
          />
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
          <TextInputWithClearButton
            bodyStyle={{ marginLeft: 30, marginRight: 30 }}
            textInputStyle={{ color: "#999999", fontSize: 14 }}
            placeholder={"请输入旧密码"}
            secureTextEntry={true}
            underlineColorAndroid="transparent"
            selectionColor={"#CCCCCC"}
            maxLength={20}
            onChangeText={text => {
              let enableCommit =
                text.length > 5 &&
                this.state.newPassword.length > 5 &&
                this.state.confirmPassword.length > 5;
              this.setState({
                oriPassword: text,
                commitEnable: enableCommit
              });
            }}
            onClearButtonPress={() => {
              this.setState({
                oriPassword: "",
                commitEnable: false
              });
            }}
          />

          <TextInputWithClearButton
            bodyStyle={{ marginLeft: 30, marginRight: 30 }}
            textInputStyle={{ color: "#999999", fontSize: 14 }}
            placeholder={"请输入新密码，6-20位数字，字母或符号组合"}
            secureTextEntry={true}
            underlineColorAndroid="transparent"
            selectionColor={"#CCCCCC"}
            maxLength={20}
            onChangeText={text => {
              let enable =
                text.length > 5 &&
                this.state.oriPassword.length > 5 &&
                this.state.confirmPassword.length > 5;

              text.length > 0 && this.state.newPasswordClearButtonFocus;
              this.setState({
                newPassword: text,
                commitEnable: enable
              });
            }}
            onClearButtonPress={() => {
              this.setState({
                newPassword: "",
                commitEnable: false
              });
            }}
          />
          <TextInputWithClearButton
            bodyStyle={{ marginLeft: 30, marginRight: 30 }}
            textInputStyle={{ color: "#999999", fontSize: 14 }}
            placeholder={"请再次输入新密码"}
            secureTextEntry={true}
            underlineColorAndroid="transparent"
            selectionColor={"#CCCCCC"}
            maxLength={20}
            onChangeText={text => {
              let enable =
                text.length > 5 &&
                this.state.newPassword.length > 5 &&
                this.state.oriPassword.length > 5;

              this.setState({
                confirmPassword: text,
                commitEnable: enable
              });
            }}
            onClearButtonPress={() => {
              this.setState({
                confirmPassword: "",
                commitEnable: false
              });
            }}
          />
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

    if (newPwd !== confirmPwd) {
      ToastAndroid.show("两次输入新密码不一致", ToastAndroid.SHORT);
      return;
    }

    this._modifyPwd();
  };

  _modifyPwd = () => {
    FetchUtils.fetch({
      params: {
        confirmPassword: this.state.confirmPassword,
        newPassword: this.state.newPassword,
        oldPassword: this.state.oriPassword
      },
      api: "action/distributor/modifyPassword",
      success: this._onSuccess.bind(this),
      error: err => this._onError(err),
      final: () => this._onFinally()
    });
  };

  _onSuccess = response => {
    if (response.status) {
      AccountHelper.refreshAccountInfo(null);
      this.props.navigation.reset(
        [NavigationActions.navigate({ routeName: "DistributePage" })],
        0
      );
    }
  };
  _onError = error => {
    ToastAndroid.show(error.msg, ToastAndroid.SHORT);
  };
  _onFinally = () => {};
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
    backgroundColor: "#FFFFFF"
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
