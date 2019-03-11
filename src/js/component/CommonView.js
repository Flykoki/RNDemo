import React, { Component } from "react";
import PropTypes from "prop-types";

import {
  View,
  Animated,
  Button,
  Image,
  Text,
  Easing,
  StyleSheet,
  TouchableOpacity,
  StatusBar
} from "react-native";

export class LoadingView extends Component {
  animationLoading;
  constructor(props) {
    super(props);
    animationLoading = Animated.timing(
      this.state.rotateVal, // 初始值
      {
        toValue: 360, // 终点值
        easing: Easing.linear // 这里使用匀速曲线，详见RN-api-Easing
      }
    );
  }

  state = {
    rotateVal: new Animated.Value(0)
  };
  componentDidMount() {
    Animated.loop(animationLoading).start();
  }

  componentWillUnmount() {
    Animated.loop(animationLoading).stop();
  }

  render() {
    return (
      <View style={this.props.style}>
        <Animated.Image
          style={[
            styles.loadingImg,
            {
              transform: [
                {
                  // 动画属性
                  rotate: this.state.rotateVal.interpolate({
                    inputRange: [0, 360],
                    outputRange: ["0deg", "360deg"]
                  })
                }
              ]
            }
          ]}
          source={require("../../res/img/icon_loading.png")}
        />
        <Text style={styles.loadingText} color="#9999999">
          加载中
        </Text>
      </View>
    );
  }
}

export class LoadFailedView extends Component {
  render() {
    const { tips, btnText, onPress } = this.props;
    return (
      <View style={styles.container}>
        <Image
          style={styles.failedImg}
          source={require("../../res/img/icon_load_failed.png")}
          resizeMode="contain"
        />
        <Text style={styles.failedText}>{tips}</Text>
        {onPress && (
          <TouchableOpacity style={styles.loadAgainBg} onPress={onPress}>
            <Text style={styles.loadingAgainText}>{btnText}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

export class RootView extends Component {
  render() {
    const { status, failed, custom } = this.props;
    return (
      <View style={[{ flex: 1 }, this.props.style]}>
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        {status === "loading" && <LoadingView style={styles.container} />}

        {status === "loadingFailed" && (
          <LoadFailedView
            tips={failed.tips}
            btnText={failed.btnText}
            onPress={failed.onPress}
          />
        )}

        {status === "custom" && custom}
      </View>
    );
  }
}

RootView.propTypes = {
  status: PropTypes.oneOf(["loading", "loadingFailed", "custom"])
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: "center",
    alignItems: "center",
    paddingTop: 128
  },
  loadingText: { marginTop: 8.4 },
  loadingImg: {
    width: 48,
    height: 48
  },
  failedText: {
    marginTop: 20,
    color: "#999999"
  },
  failedImg: {
    width: 100,
    height: 110,
    marginTop: 30
  },
  loadAgainBg: {
    backgroundColor: "#F12E49",
    height: 39,
    paddingLeft: 25,
    paddingRight: 25,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 3,
    marginTop: 10
  },
  loadingAgainText: {
    color: "white",
    fontSize: 15
  }
});
