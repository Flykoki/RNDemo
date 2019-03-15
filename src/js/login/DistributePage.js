import React, { Component, PureComponent } from "react";
import {
  View,
  Text,
  Image,
  StatusBar,
  Dimensions,
  StyleSheet
} from "react-native";
import {
  ACCOUNT_TYPE_DISTRIBUTOR,
  ACCOUNT_TYPE_EMPLOYEE
} from "./AccountHelper";

const screenWidth = Dimensions.get("window").width;
let _navigation;

export default class DistributePage extends Component {
  static navigationOptions = ({ navigation }) => {
    _navigation = navigation;
    return {
      title: "咨询攻略",
      header: null,
      headerTitleStyle: { flex: 1, textAlign: "center" }
    };
  };
  componentDidMount() {
    this._navListener = this.props.navigation.addListener("didFocus", () => {
      StatusBar.setTranslucent(true); //开启沉浸式
      StatusBar.setBackgroundColor("transparent");
    });
  }
  componentWillUnmount = () => {
    this._navListener.remove();
  };

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.logo}
          resizeMode={"stretch"}
          source={require("../../res/img/icon_app_distributary_logo.png")}
        />
        <View style={styles.loginContainer}>
          <Text
            style={styles.loginText}
            onPress={() => {
              this._goLogin(ACCOUNT_TYPE_EMPLOYEE);
            }}
          >
            员工入口
          </Text>
          <View style={styles.loginDivider} />
          <Text
            style={styles.loginText}
            onPress={() => {
              this._goLogin(ACCOUNT_TYPE_DISTRIBUTOR);
            }}
          >
            渠道账号入口
          </Text>
        </View>
      </View>
    );
  }

  _goLogin = type => {
    console.log('lfj goLogin',type,_navigation)
    switch (type) {
      case ACCOUNT_TYPE_EMPLOYEE: //员工
        _navigation.navigate("LoginPage", {
          title: "员工入口",
          accountType: type
        });
        break;
      case ACCOUNT_TYPE_DISTRIBUTOR: // 渠道商
        _navigation.navigate("LoginPage", {
          title: "渠道账号入口",
          accountType: type
        });
        break;
      default:
        break;
    }
  };
}

const styles = StyleSheet.create({
  logo: { width: screenWidth, flex: 1 },
  loginContainer: {
    width: screenWidth,
    height: 44,
    backgroundColor: "#F12E49",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  loginDivider: {
    width: 0.8,
    backgroundColor: "#FFFFFF",
    height: 30
  },
  loginText: {
    color: "#FFFFFF",
    fontSize: 15,
    flex: 1,
    textAlign: "center",
    textAlignVertical: "center"
  },
  container: { flex: 1, flexDirection: "column" }
});
