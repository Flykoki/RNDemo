import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  ScrollView,
  Image,
  Easing,
  StyleSheet
} from "react-native";

export default class MissionItemView extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let missionItem = this.props.missionItem;
    return (
      <View style={styles.container}>
        {/* ==================== title ========================== */}
        <View style={styles.title}>
          <Text style={styles.missionName}>
            {missionItem.missionName + missionItem.missionNumber}
          </Text>
          <Text style={styles.missionCreateTime}>
            {"创建时间:" + missionItem.missionCreateTime}
          </Text>
        </View>
        <View style={styles.divider} />
        {/* ==================== content ========================== */}
        <View style={styles.content}>
          <View style={styles.sourceNumber}>
            <Text style={styles.contentTextKey}>来源单号</Text>
            <Text style={styles.contentTextValue}>
              {missionItem.sourceNumber}
            </Text>
            <Text
              style={this._getMissionStatusStyle(missionItem.missionStatus)}
            >
              {missionItem.missionStatus}
            </Text>
          </View>
          <View style={styles.sourceNumber}>
            <Text style={styles.contentTextKey}>车架号</Text>
            <Text style={styles.contentTextValue}>
              {missionItem.carFrame}
            </Text>
          </View>
        </View>

        {/* ==================== footer ========================== */}
        {/* {任务集} */}
      </View>
    );
  }

  //================================== 自定义方法 ========================
  /**
   * 根据任务集合状态获取style
   */
  _getMissionStatusStyle = missionStatus => {
    switch (missionStatus) {
      case "待处理":
        return styles.missionStatusStandby;
        break;
      case "处理中":
        return styles.missionStatusProcessing;
        break;
      case "处理完毕":
        return styles.missionStatusProcessed;
        break;
      case "已取消":
      default:
        return styles.missionStatusCancel;
    }
  };
}
MissionItemView.propTypes = {
  missionItem: PropTypes.object // 任务集合item
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    backgroundColor: "#FFFFFF",
    marginTop: 10
  },
  title: {
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  missionName: {
    color: "#333333",
    width: "50%",
    paddingLeft: 20,
    fontSize: 15
  },
  missionCreateTime: {
    color: "#666666",
    paddingRight: 20,
    textAlign: "right",
    width: "50%",
    fontSize: 12
  },
  divider: {
    backgroundColor: "#E5E5E5",
    width: "100%",
    height: 0.5
  },
  content: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start"
  },
  sourceNumber: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start"
  },
  contentTextKey: {
    color: "#666666",
    marginLeft: 20,
    marginTop: 15,
    fontSize: 14
  },
  contentTextValue: {
    color: "#333333",
    position: "absolute",
    left: 100,
    top: 15,
    fontSize: 14
  },
  missionStatusStandby: {
    color: "#F12E49",
    textAlign: "right",
    flex: 1,
    marginTop: 15,
    fontSize: 14,
    marginRight: 20
  },
  missionStatusProcessing: {
    color: "#F49C2F",
    textAlign: "right",
    flex: 1,
    marginTop: 15,
    fontSize: 14,
    marginRight: 20
  },
  missionStatusProcessed: {
    color: "#75C17D",
    textAlign: "right",
    flex: 1,
    marginTop: 15,
    fontSize: 14,
    marginRight: 20
  },
  missionStatusCancel: {
    color: "#999999",
    textAlign: "right",
    flex: 1,
    marginTop: 15,
    fontSize: 14,
    marginRight: 20
  }
});
