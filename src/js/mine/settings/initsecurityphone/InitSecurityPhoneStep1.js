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
import TextInputWithClearButton from "../../../component/TextInputWithClearButton";

export default class InitSecurityPhoneStep1 extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "设置密保手机号1/2",
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
      oriPassword: ""
    };

    this._validFormData.bind(this);
  }
  componentDidMount() {
    this._navListener = this.props.navigation.addListener("didFocus", () => {
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
        <Text style={styles.tip}>请先输入密码</Text>

        <TextInputWithClearButton
          bodyStyle={{ marginLeft: 30, marginRight: 30 }}
          textInputStyle={{ color: "#999999", fontSize: 16 }}
          leftImg={require("../../../../res/img/app_login_account_number_password.png")}
          placeholder={"请输入账号密码"}
          maxLength={20}
          selectionColor={"#CCCCCC"}
          secureTextEntry={true}
          onChangeText={text => {
            let enableCommit = text.length > 0;
            this.setState({
              commitEnable: enableCommit,
              oriPassword: text
            });
          }}
          onClearButtonPress={() => {
            this.setState({
              oriPassword: "",
              commitEnable: false
            });
          }}
        />


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
            下一步
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
    console.warn(oriPwd);

    this.props.navigation.navigate("InitSecurityPhoneStep2");
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
    width: 50,
    height: 50,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  clearButtonHide: {
    width: 50
  },

  tip: {
    color: "#333333",
    fontSize: 14,
    marginLeft: 30,
    marginTop: 15,
    marginBottom: 5
  }
});
