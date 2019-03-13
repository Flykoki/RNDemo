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
              this._goLogin(0);
            }}
          >
            员工入口
          </Text>
          <View style={styles.loginDivider} />
          <Text
            style={styles.loginText}
            onPress={() => {
              this._goLogin(1);
            }}
          >
            渠道账号入口
          </Text>
        </View>
      </View>
    );
  }

  _goLogin = type => {
    switch (type) {
      case 0: //员工
        _navigation.navigate("LoginPage", { title: "员工入口" });
        break;
      case 1: // 渠道商
        _navigation.navigate("LoginPage", { title: "渠道账号入口" });
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
    height: "100%",
    marginTop: 7.5,
    marginBottom: 7.5
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
