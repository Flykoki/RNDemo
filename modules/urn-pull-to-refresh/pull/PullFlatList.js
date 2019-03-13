"use strict";
import React from "react";
import {
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  View,
  Image
} from "react-native";
import Pullable from "../local/Pullable";
import * as index from "../local/info";

export default class PullFlatList extends Pullable {
  getScrollable = () => {
    return (
      <FlatList
        onEndReachedThreshold={
          this.props.onEndReachedThreshold
            ? this.props.onEndReachedThreshold
            : 0.1
        }
        ref={c => (this.scroll = c)}
        {...this.props}
      />
    );
  };

  //header view
  _topIndicatorRender = () => {
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
          style={styles.hide}
          ref={c => (this.imgPulling = c)}
          source={require("../res/img/icon_arrow_down.png")}
        />
        <Text ref={c => (this.txtPulling = c)} style={styles.hide}>
          下拉可以刷新
        </Text>
        <Image
          style={styles.hide}
          ref={c => (this.imgPullok = c)}
          source={require("../res/img/icon_arrow_up.png")}
        />
        <Text ref={c => (this.txtPullok = c)} style={styles.hide}>
          释放立即刷新
        </Text>
        <ActivityIndicator
          style={[styles.hide, { marginRight: 5 }]}
          ref={c => (this.imgPullrelease = c)}
          size="small"
          color="gray"
        />
        <Text ref={c => (this.txtPullrelease = c)} style={styles.hide}>
          正在刷新...
        </Text>
        <Text ref={c => (this.txtPullDone = c)} style={styles.hide}>
          刷新完成
        </Text>
      </View>
    );
  };

  //header 在不同的状态下的样式
  _onPullStateChangeHeight = (pullState, moveHeight) => {
    if (pullState == "pulling") {
      this.txtPulling && this.txtPulling.setNativeProps({ style: styles.show });
      this.txtPullok && this.txtPullok.setNativeProps({ style: styles.hide });
      this.txtPullrelease &&
        this.txtPullrelease.setNativeProps({ style: styles.hide });
      this.txtPullDone &&
        this.txtPullDone.setNativeProps({ style: styles.hide });
      //设置img
      this.imgPulling && this.imgPulling.setNativeProps({ style: styles.show });
      this.imgPullok && this.imgPullok.setNativeProps({ style: styles.hide });
      this.imgPullrelease &&
        this.imgPullrelease.setNativeProps({ style: styles.hide });
    } else if (pullState == "pullok") {
      this.txtPulling && this.txtPulling.setNativeProps({ style: styles.hide });
      this.txtPullok && this.txtPullok.setNativeProps({ style: styles.show });
      this.txtPullrelease &&
        this.txtPullrelease.setNativeProps({ style: styles.hide });
      this.txtPullDone &&
        this.txtPullDone.setNativeProps({ style: styles.hide });
      //设置img
      this.imgPulling && this.imgPulling.setNativeProps({ style: styles.hide });
      this.imgPullok && this.imgPullok.setNativeProps({ style: styles.show });
      this.imgPullrelease &&
        this.imgPullrelease.setNativeProps({ style: styles.hide });
    } else if (pullState == "pullrelease") {
      this.txtPulling && this.txtPulling.setNativeProps({ style: styles.hide });
      this.txtPullok && this.txtPullok.setNativeProps({ style: styles.hide });
      this.txtPullrelease &&
        this.txtPullrelease.setNativeProps({ style: styles.show });
      this.txtPullDone &&
        this.txtPullDone.setNativeProps({ style: styles.hide });
      //设置img
      this.imgPulling && this.imgPulling.setNativeProps({ style: styles.hide });
      this.imgPullok && this.imgPullok.setNativeProps({ style: styles.hide });
      this.imgPullrelease &&
        this.imgPullrelease.setNativeProps({ style: styles.show });
    } else if (pullState == "pullDone") {
      this.txtPulling && this.txtPulling.setNativeProps({ style: styles.hide });
      this.txtPullok && this.txtPullok.setNativeProps({ style: styles.hide });
      this.txtPullrelease &&
        this.txtPullrelease.setNativeProps({ style: styles.hide });
      //设置img
      this.imgPulling && this.imgPulling.setNativeProps({ style: styles.hide });
      this.imgPullok && this.imgPullok.setNativeProps({ style: styles.hide });
      this.imgPullrelease &&
        this.imgPullrelease.setNativeProps({ style: styles.hide });

      this.txtPullDone &&
        this.txtPullDone.setNativeProps({ style: styles.show });
    }
  };
}

const styles = StyleSheet.create({
  hide: {
    position: "absolute",
    left: 10000
  },
  show: {
    position: "relative",
    left: 0,
    backgroundColor: "transparent"
  }
});
