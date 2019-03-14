import React, { PureComponent } from "react";
import {
  View,
  Text,
  Image,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TouchableNativeFeedback,
  Dimensions
} from "react-native";
import { fetchRequest } from "../../utils/FetchUtil";
import {
  RootView,
  LoadFailedView,
  LoadingView
} from "../../component/CommonView";
import reactNavigation from "react-navigation";
import { WebView } from "react-native-gesture-handler";
const width = Dimensions.get("window").width;
const topIndicatorHeight = 50;
let _navigation;
let imageUrlIndex = 0;
export class PolicyDetail extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    _navigation = navigation;
    return {
      title: "政策公告详情",
      headerTitleStyle: { flex: 1, textAlign: "center" },
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
      data: {},
      status: "loading"
    };
  }

  componentWillMount() {
    //设置statusbar样式
    this._navListener = this.props.navigation.addListener("didFocus", () => {
      StatusBar.setTranslucent(false); //关闭沉浸式
      StatusBar.setBarStyle("dark-content");
      StatusBar.setBackgroundColor("#FFFFFF");
    });

    let data = _navigation.getParam("data", {});
    this.state.data = data;
  }

  componentWillUnmount = () => {
    this._navListener.remove();
  };
  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.state.status !== "loadingFailed" && (
          <WebView
            style={{ flex: 1 }}
            onError={() => {
              this.setState({ status: "loadingFailed" });
            }}
            onLoad={() => {
              this.setState({ status: "custom" });
            }}
            onLoadStart={() => {
              this.setState({ status: "loading" });
            }}
            source={{ uri: this.state.data.linkAddress }}
          />
        )}
        {this.state.status === "loading" && (
          <LoadingView style={styles.loadingView} />
        )}
        {this.state.status === "loadingFailed" && (
          <LoadFailedView
            style={styles.loadFailedView}
            tips={"加载失败"}
            onPress={() => {
              this.setState({ status: "custom" });
            }}
            btnText={"重新加载"}
          />
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  backButtonStyle: { marginLeft: 20, width: 50 },
  loadingView: {
    flex: 1,
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    justifyContent: "center",
    alignItems: "center"
  },
  loadFailedView: {
    flex: 1,
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0
  },
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F8F8"
  },
  title: {
    fontSize: 16,
    marginTop: 16,
    marginRight: 19,
    marginLeft: 15,
    color: "#333333"
  },
  footer: {
    flexDirection: "row",
    flex: 1,
    marginTop: 20,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10
  },
  content: {
    marginBottom: 8,
    marginLeft: 8,
    marginRight: 8,
    fontSize: 12,
    color: "black"
  },
  flatListItemWithShadow: {
    // margin: 5,
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    backgroundColor: "white"
    // shadowColor: "#000",
    // shadowOpacity: 0.8,
    // shadowRadius: 6,
    // elevation: 9,
    // borderRadius: 8
  },
  flatListContain: {
    backgroundColor: "#F8F8F8"
  }
});
