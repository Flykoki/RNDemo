import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  Easing,
  FlatList,
  StyleSheet,
  BackHandler
} from "react-native";
import FilterView from "./FilterView";

export default class SortWithFilterView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSortDataPanel: this.props.showLeftPanel
        ? this.props.showLeftPanel
        : false, //排序面板是否显示
      lastSortDataIndex:
        this.props.sortDataObj.sortDataIndex !== undefined
          ? this.props.sortDataObj.sortDataIndex
          : -1, //默认选中排序项
      filterResponse: [], //筛选结果
      leftTitleText: this.props.leftTitleText
        ? this.props.leftTitleText
        : "新建时间倒序", //左侧点击区域title
      rightTitleText: this.props.rightTitleText
        ? this.props.rightTitleText
        : "筛选",
      normalFilterPress: this.props.showRightPanel
        ? this.props.showRightPanel
        : false, //筛选title点击状态
      normalFilterItems: this.props.normalFilterItems
        ? this.props.normalFilterItems
        : new Map() //筛选内容
    };
    console.log("lfj sortViewFilter constructor");
    this.titleItemHight = this.props.titleItemHight
      ? this.props.titleItemHight
      : 46;
    this.onSortDataSelectedCallback = this.props.onSortDataSelectedCallback;
  }

  componentDidMount() {
    if (Platform.OS === "android") {
      BackHandler.addEventListener("hardwareBackPress", this._onBackHandler);
    }
  }
  componentWillUnmount = () => {
    if (Platform.OS === "android") {
      BackHandler.removeEventListener("hardwareBackPress", this._onBackHandler);
    }
  };
  render() {
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={
          this.state.showSortDataPanel || this.state.normalFilterPress
            ? [styles.container, this.props.style]
            : [
                styles.container,
                this.props.style,
                { height: this.titleItemHight }
              ]
        }
        onPress={() => {
          console.warn("sortView click");
          this.setState({
            showSortDataPanel: false,
            normalFilterPress: false
          });
        }}
      >
        {/* ============================== top click view =========================== */}
        <View
          style={[styles.filterWholeContainer, { height: this.titleItemHight }]}
        >
          <View style={styles.filterContainer}>
            <TouchableOpacity
              onPress={() => {
                let showPanel = !this.state.showSortDataPanel;
                this.setState({
                  showSortDataPanel: showPanel,
                  normalFilterPress: false
                });
                this.props.showLeftPanelCallback &&
                  this.props.showLeftPanelCallback(showPanel);
                this.props.showRightPanelCallback &&
                  this.props.showRightPanelCallback(false);
                this._showSortPanel(showPanel);
              }}
              style={styles.filter}
            >
              <Text
                style={
                  // this.state.lastSortDataIndex !== -1
                  //   ? styles.filterTextPress
                  //   : this.state.showSortDataPanel
                  //   ? styles.filterTextPress
                  //   :
                  styles.filterTextDefault
                }
              >
                {this.state.leftTitleText}
              </Text>
              <Image
                style={{ marginLeft: 7.2, height: 8, width: 8 }}
                resizeMode={"contain"}
                source={
                  this.state.lastSortDataIndex !== -1
                    ? this.state.showSortDataPanel
                      ? require("../../res/img/icon_app_retract_up.png")
                      : require("../../res/img/icon_app_retract_down.png")
                    : this.state.showSortDataPanel
                    ? require("../../res/img/icon_app_retract_up.png")
                    : require("../../res/img/icon_app_retract_down.png")
                }
              />
            </TouchableOpacity>
            <View style={styles.filterDivider} />
            <TouchableOpacity
              onPress={() => {
                let showPanel = !this.state.normalFilterPress;
                this.setState({
                  normalFilterPress: showPanel,
                  showSortDataPanel: false
                });
                this.props.showRightPanelCallback &&
                  this.props.showRightPanelCallback(showPanel);
                this.props.showLeftPanelCallback &&
                  this.props.showLeftPanelCallback(false);
              }}
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
                {this.state.rightTitleText}
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
        </View>

        {/* ================================== 显示左边排序面板 =========================== */}
        {this.state.showSortDataPanel &&
          this._showSortPanel(this.props.sortDataObj.sortData)}

        {/* ================================== 显示右边筛选面板 =========================== */}
        {this.state.normalFilterPress &&
          this._showFilterPanel(this.props.filterData)}
      </TouchableOpacity>
    );
  }

  _onBackHandler = () => {
    if (this.state.showSortDataPanel || this.state.normalFilterPress) {
      this.setState({
        showSortDataPanel: false,
        normalFilterPress: false
      });
      return true;
    }
    return false;
  };

  /**
   * 显示筛选面板
   */
  _showFilterPanel = filterData => {
    return (
      <TouchableOpacity activeOpacity={1}>
        <FilterView
          {...this.props}
          style={this.props.filterViewStyle}
          data={this.props.filterData}
          navigation={this.props.navigation}
          searchButtonRightCallback={() => this._onBackHandler()}
          onNormalFilterCallback={(filterMaps, callback) => {
            this.state.normalFilterItems = filterMaps;
            this.props.onNormalFilterCallback &&
              this.props.onNormalFilterCallback(filterMaps, callback);
          }}
          normalFilterMap={this.state.normalFilterItems}
          filterResponse={this.state.filterResponse}
        />
      </TouchableOpacity>
    );
  };

  /**
   * 自定义日期点击事件
   */
  _onCalenderPress = () => {};

  /**
   * 显示排序面板
   */
  _showSortPanel = sortData => {
    return (
      <View>
        <FlatList
          style={[styles.sortPanel]}
          data={sortData}
          ItemSeparatorComponent={this._itemSeparatorSortView}
          renderItem={this._renderItemSortView}
        />
      </View>
    );
  };

  /**
   * flat list item分割线
   */
  _itemSeparatorSortView = () => {
    return <View style={styles.flatListDivider} />;
  };
  /**
   * 排序面板item
   */
  _renderItemSortView = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={styles.sortItemContainer}
        activeOpacity={1}
        onPress={() => {
          console.log("lfj sort item", item);
          this.setState({
            lastSortDataIndex: index,
            leftTitleText: item
          });
          this.props.onSortDataSelectedCallback &&
            this.props.onSortDataSelectedCallback(item, index, () =>
              this._onBackHandler()
            );
        }}
      >
        <Text
          style={
            this.state.lastSortDataIndex === index
              ? styles.sortItemTextSelected
              : styles.sortItemTextDefault
          }
        >
          {item}
        </Text>
        <Image
          style={styles.sortItemImg}
          resizeMode={"contain"}
          source={
            this.state.lastSortDataIndex === index
              ? require("../../res/img/icon_app_selected.png")
              : {}
          }
        />
      </TouchableOpacity>
    );
  };
}

SortWithFilterView.propTypes = {
  style: PropTypes.object, //整个View style
  titleItemHight: PropTypes.number, //头部点击view高度

  //============== 右侧筛选View filter view =====================
  filterViewStyle: PropTypes.object, //filter View 面板 样式
  filterData: PropTypes.array, // 所有的filter集合[{},{}]
  items: PropTypes.array, // 具体的筛选项，filterData[0].items =>[]
  rightTitleText: PropTypes.string, //右侧filter的标题
  type: PropTypes.oneOf(["date", "normal", "customDate"]), //filter 类型 ：日期，普通，自定义日期
  filterMultiple: PropTypes.bool, // 是否支持多选
  normalFilterMap: PropTypes.object, // 已选中普通filter map
  onNormalFilterCallback: PropTypes.func, // 普通筛选item点击事件回调
  //================= 左侧排序View sort view ===================
  onSortDataSelectedCallback: PropTypes.func, // 排序列表item点击事件回调
  sortDataIndex: PropTypes.number, //排序选中item下标
  leftTitleText: PropTypes.string, //左边排序title item 标题
  sortDataObj: PropTypes.object //排序列表data => {sortData:[],sortDataIndex:number}
};
const styles = StyleSheet.create({
  touchCancel: {
    backgroundColor: "rgba(0,0,0,0.0)"
  },
  filterDivider: {
    width: 0.5,
    backgroundColor: "#E5E5E5",
    height: "100%"
  },
  container: {
    // position: "absolute",
    // top: 0,
    // left: 0,
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.3)"
  },
  topDivider: {
    backgroundColor: "#F0F0F0",
    height: 0.5,
    width: "100%"
  },
  flatListDivider: {
    backgroundColor: "#F0F0F0",
    height: 1,
    marginLeft: 30,
    marginRight: 30,
    flex: 1
  },
  sortPanel: {
    backgroundColor: "#FFFFFF"
  },
  sortItemContainer: {
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  sortItemImg: {
    height: 13,
    width: 10,
    marginRight: 30
  },
  sortItemTextDefault: {
    color: "#333333",
    fontSize: 14,
    marginLeft: 30
  },
  sortItemTextSelected: {
    color: "#F12E49",
    fontSize: 14,
    marginLeft: 30
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
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    justifyContent: "space-between"
  },
  filterWholeContainer: {
    // height: "6.7%",
    // height: 46,
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
