/**
 * 作者：请叫我百米冲刺 on 2018/1/5 上午9:19
 * 邮箱：mail@hezhilin.cc
 */
"use strict";
import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { ActivityIndicator, Image, Text, StyleSheet, View } from "react-native";
import * as index from "./info";
import { LoadingView } from "../view/CommonView";
import { FlatList } from "react-native-gesture-handler";

export default class PullRoot extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pulling: false,
      pullOk: false,
      pullRelease: false
    };
  }

  static propTypes = {
    refreshable: PropTypes.bool,
    isContentScroll: PropTypes.bool,
    onPullRelease: PropTypes.func, //下拉刷新的回调
    onPushing: PropTypes.func, //此时正在下拉刷新，通知外界

    topIndicatorRender: PropTypes.func, //下拉刷新的render
    topIndicatorHeight: PropTypes.number, //头部的高度
    onPullStateChangeHeight: PropTypes.func //状态的回调
  };

  static defaultProps = {
    refreshable: true, //是否需要下拉刷新
    isContentScroll: true //内容是否需要跟着滚动，默认为false
  };

  renderTopIndicator = () => {
    if (this.props.topIndicatorRender == null) {
      return this.defaultTopIndicatorRender();
    } else {
      return this.props.topIndicatorRender();
    }
  };

  defaultTopIndicatorRender = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          height: this.props.topIndicatorHeight
            ? this.props.topIndicatorHeight
            : index.defaultTopIndicatorHeight
        }}
      >
        <Image
          style={this.state.pulling ? styles.show : styles.hide}
          ref={c => (this.imgPulling = c)}
          source={require("../res/img/icon_arrow_down.png")}
        />
        <Text
          ref={c => (this.txtPulling = c)}
          style={this.state.pulling ? styles.show : styles.hide}
        >
          下拉可以刷新
        </Text>
        <Image
          style={this.state.pullOk ? styles.show : styles.hide}
          ref={c => (this.imgPullok = c)}
          source={require("../res/img/icon_arrow_up.png")}
        />
        <Text
          ref={c => (this.txtPullok = c)}
          style={this.state.pullOk ? styles.show : styles.hide}
        >
          释放立即刷新
        </Text>
        <LoadingView
          style={[
            this.state.pullRelease ? styles.show : styles.hide,
            { marginRight: 5 }
          ]}
          imgStyle={{ height: 20, width: 20 }}
          showText={false}
          // source={require('../res/img/icon_loading.png')}
          ref={c => (this.imgPullrelease = c)}
        />
        <Text
          ref={c => (this.txtPullrelease = c)}
          style={this.state.pullRelease ? styles.show : styles.hide}
        >
          加载中...
        </Text>
        <Text ref={c => (this.txtPullDone = c)} style={styles.hide}>
          刷新完成
        </Text>
      </View>
    );
  };

  defaultTopSetting = () => {
    if (this.props.topIndicatorRender == null) {
      //没有就自己来
      if (this.pullState == "pulling") {
        this.setState({ pullOk: false, pulling: true, pullRelease: false });
      } else if (this.pullState == "pullok") {
        this.setState({ pullOk: true, pullRelease: false, pulling: false });
      } else if (this.pullState == "pullrelease") {
        this.setState({ pullRelease: true, pullOk: false, pulling: false });
      } else if (this.pullState == "pullDone") {
        this.setState({ pullOk: false, pullRelease: false, pulling: false });
      }
    }
  };
}

const styles = StyleSheet.create({
  hide: {
    position: "absolute",
    left: 10000,
    backgroundColor: "transparent"
  },
  show: {
    position: "relative",
    left: 0,
    backgroundColor: "transparent"
  }
});
