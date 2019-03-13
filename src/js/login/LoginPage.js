import React, { Component, PureComponent } from "react";
import {
  View,
  Text,
  Image,
  Modal,
  Alert,
  FlatList,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  TouchableHighlight,
  TouchableNativeFeedback,
  StyleSheet
} from "react-native";
import TextInputWithClearButton from "../component/TextInputWithClearButton";

const screenWidth = Dimensions.get("window").width;
let _navigation;

export default class LoginPage extends Component {
  static navigationOptions = ({ navigation }) => {
    _navigation = navigation;
    return {
      title: null,
      header: null,
      headerLeft: (
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={styles.backButtonStyle}
        >
          <Image
            source={require("../../res/img/icon_back.png")}
            resizeMode="cover"
          />
        </TouchableOpacity>
      ),
      headerRight: null
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      title: _navigation.getParam("title", "员工登录"),
      loginName: "",
      loginPwd: "",
      commitEnable: false
    };
  }
  componentDidMount() {
    this._navListener = this.props.navigation.addListener("didFocus", () => {
      StatusBar.setTranslucent(false); //关闭沉浸式
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
        <TouchableOpacity
          style={styles.backButtonStyle}
          onPress={() => {
            _navigation.goBack();
          }}
        >
          <Image
            style={{ height: 14.6, width: 8.3 }}
            resizeMode={"contain"}
            source={require("../../res/img/icon_back.png")}
          />
        </TouchableOpacity>
        <Text style={styles.title}>{this.state.title}</Text>
        <TextInputWithClearButton
          bodyStyle={styles.loginName}
          textInputStyle={styles.textInputStyle}
          leftImg={require("../../res/img/icon_app_login_account.png")}
          multiline={true}
          blurOnSubmit={false}
          keyboardType={"default"}
          selectionColor={"#CCCCCC"}
          maxLength={20}
          placeholder="请输入登录账号"
          onChangeText={text => {
            let enable = text.length > 0 && this.state.loginPwd.length > 0;
            this.setState({ loginName: text, commitEnable: enable });
          }}
        />
        <TextInputWithClearButton
          bodyStyle={styles.loginPwd}
          textInputStyle={styles.textInputStyle}
          leftImg={require("../../res/img/icon_app_login_password.png")}
          multiline={true}
          blurOnSubmit={false}
          secureTextEntry={true}
          selectionColor={"#CCCCCC"}
          maxLength={20}
          placeholder="请输入密码"
          onChangeText={text => {
            let enable = text.length > 0 && this.state.loginName.length > 0;
            this.setState({ loginPwd: text, commitEnable: enable });
          }}
        />

        <TouchableOpacity
          style={
            this.state.commitEnable
              ? styles.modifyCommitEnable
              : styles.modifyCommitDisable
          }
          disabled={this.state.commitEnable ? false : true}
          onPress={() => {
            this._validFormData();
          }}
        >
          <Text
            style={
              this.state.commitEnable
                ? styles.modifyCommitTextEnable
                : styles.modifyCommitTextDisable
            }
          >
            登录
          </Text>
        </TouchableOpacity>

        <Text
          style={styles.forgetPwd}
          onPress={() => {
            this._forgetPwd();
          }}
        >
          忘记密码?
        </Text>
      </View>
    );
  }
  _forgetPwd = () => {
    console.warn("忘记密码");
    _navigation.navigate("HomeTab");
  };
  _validFormData = () => {
    let pwd = this.state.loginPwd;
    let name = this.state.loginName;
    if (pwd.length < 6) {
      console.warn("密码长度 6-20");
      return;
    }
  };
}

const styles = StyleSheet.create({
  textInputStyle: { color: "#333333", fontSize: 16 },
  forgetPwd: { fontSize: 12, color: "#666666", marginTop: 20, marginLeft: 30 },
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
    backgroundColor: "#FFFFFF",
    justifyContent: "flex-start",
    flexDirection: "column"
  },
  backButtonStyle: {
    marginLeft: 22,
    height: 22,
    width: 22,
    marginTop: 15,
    justifyContent: "center"
  },
  title: {
    color: "#333333",
    fontSize: 28,
    marginTop: 44.5,
    marginLeft: 30
  },
  loginName: {
    marginTop: 70,
    marginLeft: 30,
    marginRight: 30
  },
  loginPwd: {
    marginLeft: 30,
    marginRight: 30
  }
});
