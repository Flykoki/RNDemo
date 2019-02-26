import React, { Component } from "react";
import {
  Text,
  View,
  PanResponder,
  NativeModules,
  ImageBackground,
  StyleSheet
} from "react-native";
const rightIndex = [
  { title: "最近" },
  { title: "全部" },
  { title: "A" },
  { title: "B" },
  { title: "C" },
  { title: "D" },
  { title: "E" },
  { title: "F" },
  { title: "G" },
  { title: "H" },
  { title: "I" },
  { title: "J" },
  { title: "K" },
  { title: "L" },
  { title: "M" },
  { title: "N" },
  { title: "O" },
  { title: "P" },
  { title: "Q" },
  { title: "R" },
  { title: "S" },
  { title: "T" },
  { title: "U" },
  { title: "V" },
  { title: "W" },
  { title: "X" },
  { title: "Y" },
  { title: "Z" }
];

export default class ListScrollBar extends Component {
  constructor(props) {
    super(props);
    const { data } = this.props;
    this._siderBarList = data ? data : rightIndex;
    this.state = {
      pressed: false,
      position: 0,
      barY: 0,
      pageY: 0,
      height: 0,
      currentLetter: "A",
      currentIndex: -1
    };
  }
  _onLayout(event) {
    NativeModules.UIManager.measure(
      event.target,
      (x, y, width, height, pageX, pageY) => {
        const viewHeight = this.state.height > 0 ? this.state.height : height;
        this.setState({ pageY: pageY, height: viewHeight });
      }
    );
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      // 要求成为响应者：
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        // 开始手势操作。给用户一些视觉反馈，让他们知道发生了什么事情！
        // gestureState.{x,y} 现在会被设置为0
      },
      onPanResponderMove: (evt, gestureState) => {
        // 最近一次的移动距离为gestureState.move{X,Y}
        // 从成为响应者开始时的累计手势移动距离为gestureState.d{x,y}
        let margin = gestureState.moveY - this.state.pageY;
        let index = Math.floor(margin / 16);
        index =
          index > -1
            ? index < rightIndex.length
              ? index
              : rightIndex.length - 1
            : 0;
        margin = index * 16 - 17;
        this.setState({
          pressed: true,
          currentLetter: rightIndex[index].title,
          currentIndex: index,
          position:
            margin > -17
              ? margin > this.state.height - 33
                ? this.state.height - 33
                : margin
              : -17
        });
        this.props.onScroll(index);
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        this.setState({ pressed: false });
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // 另一个组件已经成为了新的响应者，所以当前手势将被取消。
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // 返回一个布尔值，决定当前组件是否应该阻止原生组件成为JS响应者
        // 默认返回true。目前暂时只支持android。
        return true;
      }
    });
  }

  render() {
    let rightData = [
      this._siderBarList.map((item, index) => {
        let currentIndex = this.state.currentIndex;
        let isCurrentFoucesd = this.state.pressed && index === currentIndex;
        let backgroundColor = isCurrentFoucesd ? "#F12E49" : "transparent";
        return (
          <View style={[styles.indexBox, { backgroundColor: backgroundColor }]}>
            {isCurrentFoucesd && (
              <Text style={[styles.indexText, { color: "#FFFFFF" }]}>
                {item["title"]}
              </Text>
            )}
            {!isCurrentFoucesd && (
              <Text style={[styles.indexText, { color: "#2A2A2A" }]}>
                {item["title"]}
              </Text>
            )}
          </View>
        );
      })
    ];
    return (
      <View
        style={styles.container}
        onLayout={e => this._onLayout(e)}
        ref="root"
      >
        <View>
          {this.state.pressed && (
            <ImageBackground
              style={[
                styles.currentLetterContainer,
                { marginTop: this.state.position }
              ]}
              source={require("../../../res/img/bg_list_scroll_bar_item.png")}
            >
              <Text style={styles.currentLetterText}>
                {this.state.currentLetter}
              </Text>
            </ImageBackground>
          )}
        </View>
        <View {...this._panResponder.panHandlers} style={styles.rightContainer}>
          {rightData}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "transparent"
  },
  currentLetterContainer: {
    width: 61,
    height: 50,
    marginRight: 20
  },
  currentLetterText: {
    color: "#FFFFFF",
    fontSize: 30,
    width: 50,
    height: 50,
    textAlign: "center"
  },
  rightContainer: { backgroundColor: "transparent" },
  indexBox: {
    height: 16,
    width: 35,
    backgroundColor: "transparent",
    borderRadius: 8
  },
  indexText: {
    fontSize: 11,
    textAlign: "center",
    color: "#2A2A2A",
    backgroundColor: "transparent"
  }
});
