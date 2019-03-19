import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Image,
  Easing,
  StyleSheet
} from "react-native";
import VehicleInofPanel from "../property/VehicleInofPanel";

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
            {missionItem.taskGroupName + missionItem.taskGroupCode}
          </Text>
          <Text style={styles.missionCreateTime}>
            {"创建时间:" + missionItem.createTime}
          </Text>
        </View>
        {this._getDividerView()}
        {/* ==================== content ========================== */}
        <TouchableOpacity
          activeOpacity={1}
          style={styles.content}
          onPress={() => {
            this.props.onTaskGroupPress
              ? this.props.onTaskGroupPress(missionItem)
              : this._missionContentOnPress(missionItem);
          }}
        >
          <View style={styles.sourceNumber}>
            <Text style={styles.contentTextKey}>来源单号</Text>
            <Text style={styles.contentTextValue}>
              {missionItem.sourceCode}
            </Text>
            <Text style={this._getMissionStatusStyle(missionItem.status)}>
              {this._getMissionStatusLabel(missionItem.status)}
            </Text>
          </View>
          <View style={styles.sourceNumber}>
            <Text style={styles.contentTextKey}>车架号</Text>
            <Text style={styles.contentTextValue}>{missionItem.frameNo}</Text>
          </View>
          <View style={styles.vehicleModel}>
            <Text style={styles.contentTextKey}>车型</Text>
            <VehicleInofPanel
              style={styles.contentTextValue}
              vehicle={missionItem.modeName}
              vehicleType={missionItem.vehicleTypeName}
              vehicleColor={missionItem.exteriorColor}
            />
          </View>
        </TouchableOpacity>

        {/* ==================== footer ========================== */}
        {this._showConcurrentMissions(missionItem.status) &&
          this._getDividerView()}
        {this._showConcurrentMissions(missionItem.status) &&
          this._getConcurrentMissionViews(missionItem)}
      </View>
    );
  }

  //================================== 自定义方法 ========================

  /**
   * 任务集合内容点击事件
   */
  _missionContentOnPress = item => {
    console.warn("任务集合点击事件");
  };

  /**
   * 获取分割线
   */
  _getDividerView = () => {
    return <View style={styles.divider} />;
  };
  /**
   * 显示并行任务集合
   */
  _getConcurrentMissionViews = missionItem => {
    let missionArray = missionItem.taskList;
    return missionArray.map((item, index, missionArray) => {
      return this._getConcurrentMissionItemView(
        item,
        index,
        missionArray.length
      );
    });
  };
  /**
   * 显示并行任务中的item
   */
  _getConcurrentMissionItemView = (item, index, total) => {
    return (
      <View style={{ flexDirection: "column", justifyContent: "center" }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            this.props.onTaskListItemPress
              ? this.props.onTaskListItemPress(item)
              : this._concurrentMissionOnPress(item);
          }}
          style={styles.concurrentMissionItem}
        >
          <Image
            resizeMode={"contain"}
            style={styles.concurrentMissionItemLeftImg}
            source={require("../../res/img/icon_app_date.png")}
          />
          <Text style={styles.concurrentMissionItemUpdateTime}>
            {item.modifyTime}
          </Text>
          <Text style={styles.concurrentMissionItemTask}>
            {item.taskName + item.taskCode + item.taskStatus}
          </Text>
          <Image
            resizeMode={"contain"}
            style={styles.concurrentMissionItemRightImg}
            source={require("../../res/img/icon_app_arrow_right.png")}
          />
        </TouchableOpacity>

        {index !== total - 1 && (
          <View style={styles.concurrentMissionItemDivider} />
        )}
      </View>
    );
  };
  /**
   * 并行任务 子item 点击事件
   */
  _concurrentMissionOnPress = item => {
    console.warn("并行任务 子item 点击事件", item);
  };
  /**
   * 是否需要显示并行任务：任务集合状态为处理完毕及已取消，不显示当前进行任务。
   */
  _showConcurrentMissions = missionStatus => {
    return missionStatus === "已取消" || missionStatus === "处理完毕"
      ? false
      : true;
  };
  /**
   * item点击事件
   */
  _missionItemPress = () => {
    console.log("lfj mission item click");
  };



  /**
   * 根据任务集合状态获取style
   */
  _getMissionStatusStyle = missionStatus => {
    switch (missionStatus) {
      case 1:
        return styles.missionStatusStandby;
        break;
      case 2:
        return styles.missionStatusProcessing;
        break;
      case 3:
        return styles.missionStatusProcessed;
        break;
      case 4:
      default:
        return styles.missionStatusCancel;
    }
  };
  /**
   * 根据任务集合状态获取label
   */
  _getMissionStatusLabel = missionStatus => {
    switch (missionStatus) {
      case 1:
        return "待处理";
        break;
      case 2:
        return "处理中";
        break;
      case 3:
        return "处理完毕";
        break;
      case 4:
      default:
        return "已取消";
    }
  };
}
MissionItemView.propTypes = {
  missionItem: PropTypes.object, // 任务集合item
  onTaskListItemPress: PropTypes.func ,// taskList item 点击事件
  onTaskGroupPress: PropTypes.func // taskGroup content 点击事件
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    backgroundColor: "#FFFFFF",
    marginTop: 10
  },
  concurrentMissionItem: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  concurrentMissionItemLeftImg: {
    marginLeft: 20,
    height: 15,
    width: 14,
    marginTop: 18,
    marginBottom: 18
  },
  concurrentMissionItemRightImg: {
    marginRight: 20,
    marginTop: 18,
    height: 10,
    width: 6,
    marginBottom: 18
  },
  concurrentMissionItemTask: {
    fontSize: 14,
    color: "#333333",
    flex: 1,
    textAlign: "right",
    marginTop: 18,
    marginRight: 10,
    marginBottom: 18
  },
  concurrentMissionItemUpdateTime: {
    fontSize: 14,
    color: "#666666",
    marginLeft: 10,
    marginTop: 18,
    marginBottom: 18
  },
  concurrentMissionItemDivider: {
    height: 0.5,
    flex: 1,
    backgroundColor: "#E5E5E5",
    marginLeft: 20,
    marginRight: 20
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
  vehicleModel: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginBottom: 15
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