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
import { FlatList } from "react-native-gesture-handler";

export default class SortView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortDataPress: false, //排序title点击状态
      sortDataItems: new Map(), //排序内容
      filterResponse: [], //筛选结果
      normalFilterPress: false, //筛选title点击状态
      normalFilterItems: new Map() //筛选内容
    };

    this.titleItemHight = this.props.titleItemHight
      ? this.props.titleItemHight
      : 46;
  }

  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <View
          style={[styles.filterWholeContainer, { height: this.titleItemHight }]}
        >
          <View style={styles.filterContainer}>
            <TouchableOpacity
              onPress={() => {
                let showPanel = !this.state.sortDataPress;
                this.setState({
                  sortDataPress: showPanel,
                  normalFilterPress: false
                });
                this._showSortPanel(showPanel);
              }}
              style={styles.filter}
            >
              <Text
                style={
                  this.state.sortDataItems.size > 0
                    ? styles.filterTextPress
                    : this.state.sortDataPress
                    ? styles.filterTextPress
                    : styles.filterTextDefault
                }
              >
                {this.props.leftTitleText
                  ? this.props.leftTitleText
                  : "最近创建日期"}
              </Text>
              <Image
                style={{ marginLeft: 7.2, height: 8, width: 8 }}
                resizeMode={"contain"}
                source={
                  this.state.sortDataItems.size > 0
                    ? this.state.sortDataPress
                      ? require("../../res/img/icon_app_retract_up.png")
                      : require("../../res/img/icon_app_retract_down_chosen.png")
                    : this.state.sortDataPress
                    ? require("../../res/img/icon_app_retract_up_chosen.png")
                    : require("../../res/img/icon_app_retract_down.png")
                }
              />
            </TouchableOpacity>
            <View style={styles.filterDivider} />
            <TouchableOpacity
              onPress={() =>
                this.setState({
                  normalFilterPress: !this.state.normalFilterPress,
                  sortDataPress: false
                })
              }
              style={styles.filter}
            >
              <Text
                style={
                  this.state.normalFilterItems.size > 0
                    ? styles.filterTextPress
                    : this.state.normalFilterPress
                    ? styles.filterTextPress
                    : styles.filterTextDefault
                }
              >
                {this.props.rightTitleText ? this.props.rightTitleText : "筛选"}
              </Text>
              <Image
                style={{ marginLeft: 7.2, height: 8, width: 8 }}
                resizeMode={"contain"}
                source={
                  this.state.normalFilterItems.size > 0
                    ? this.state.normalFilterPress
                      ? require("../../res/img/icon_app_retract_up_chosen.png")
                      : require("../../res/img/icon_app_retract_down_chosen.png")
                    : this.state.normalFilterPress
                    ? require("../../res/img/icon_app_retract_up_chosen.png")
                    : require("../../res/img/icon_app_retract_down.png")
                }
              />
            </TouchableOpacity>
          </View>
          <View style={styles.topDivider} />

          <TouchableOpacity
            style={styles.touchCancel}
            onPress={() => {
              console.warn("touchCancel onPress");
            }}
          />
        </View>
      </View>
    );
  }

  /**
   * 显示排序面板
   */
  _showSortPanel = showPanel => {
    console.warn("lfj showPanel=", showPanel);
    showPanel;
  };

  _renderItem = ({ item }) => {
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.itemText}>{item}</Text>
      </View>
    );
  };
}

SortView.propTypes = {
  data: PropTypes.array,
  style: PropTypes.object, //全部
  leftTitleText: PropTypes.string, //左边排序title item 标题
  titleItemHight: PropTypes.number, //头部点击view高度
  rightTitleText: PropTypes.string //右边排序title item 标题
};
const styles = StyleSheet.create({
  touchCancel: {
    height:'100%',
    backgroundColor: "rgba(0,0,0,0.3)"
  },
  filterDivider: {
    width: 0.5,
    backgroundColor: "#E5E5E5",
    height: "100%"
  },
  container: {
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.3)"
  },
  topDivider: {
    backgroundColor: "#F0F0F0",
    height: 0.5,
    width: "100%"
  },
  itemContainer: {
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  itemTextDefault: {
    color: "#333333",
    fontSize: 14
  },
  itemTextSelected: {
    color: "#F12E49",
    fontSize: 14
  },
  filterTextPress: {
    color: "#F12E49",
    fontSize: 14
  },
  filterTextDefault: {
    color: "#333333",
    fontSize: 14
  },
  filterContainer: {
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    justifyContent: "space-between"
  },
  filterWholeContainer: {
    // height: "6.7%",
    height: 46,
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    justifyContent: "flex-start"
  },

  filter: {
    flex: 1,
    height: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  }
});
