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
  FlatList,
  StyleSheet,
  Dimensions
} from "react-native";
import FilterView from "./FilterView";

export default class SortWithFilterView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSortDataPanel: false, //排序面板是否显示
      lastSortDataIndex: this.props.sortDataObj.sortDataIndex
        ? this.props.sortDataObj.sortDataIndex
        : -1, //默认选中排序项
      filterResponse: [], //筛选结果
      normalFilterPress: false, //筛选title点击状态
      normalFilterItems: this.props.normalFilterItems
        ? this.props.normalFilterItems
        : new Map() //筛选内容
    };
    console.log('lfj sortViewFilter constructor')
    this.titleItemHight = this.props.titleItemHight
      ? this.props.titleItemHight
      : 46;
    this.onSortDataSelectedCallback = this.props.onSortDataSelectedCallback;
  }
  render() {
    console.log('lfj sortView render')
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={
          this.state.showSortDataPanel || this.state.normalFilterPress
            ? [styles.container, this.props.style]
            : [styles.container,this.props.style, { height: this.titleItemHight }]
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
                this._showSortPanel(showPanel);
              }}
              style={styles.filter}
            >
              <Text
                style={
                  this.state.lastSortDataIndex !== -1
                    ? styles.filterTextPress
                    : this.state.showSortDataPanel
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
                  this.state.lastSortDataIndex !== -1
                    ? this.state.showSortDataPanel
                      ? require("../../res/img/icon_app_retract_up_chosen.png")
                      : require("../../res/img/icon_app_retract_down_chosen.png")
                    : this.state.showSortDataPanel
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
                  showSortDataPanel: false
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

  /**
   * 显示筛选面板
   */
  _showFilterPanel = filterData => {
    console.log("lfj showFilterPanel props", this.props);
    return (
      <TouchableOpacity activeOpacity={1}>
        <FilterView
          style={this.props.filterViewStyle}
          data={this.props.filterData}
          navigation={this.props.navigation}
          onFilterResponseCallback={response => {
            this.setState({ filterResponse: response });
            this.props.onFilterResponseCallback &&
              this.props.onFilterResponseCallback(response);
          }}
          onNormalFilterCallback={filterMaps => {
            console.log("lfj filter  onFilterResponseCallback", filterMaps);
            this.setState({ normalFilterItems: filterMaps });
            this.props.onNormalFilterCallback &&
              this.props.onNormalFilterCallback(filterMaps);
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
  _onCalenderPress=()=>{}

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
          this.setState({
            lastSortDataIndex: index
          });
          this.props.onSortDataSelectedCallback &&
            this.props.onSortDataSelectedCallback(item, index);
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
  //============== filter view =====================
  filterViewStyle: PropTypes.object, //filter View 样式
  filterData: PropTypes.array, // 所有的filter集合
  items: PropTypes.array, // 具体的子 item 中 filter数组
  title: PropTypes.string, //filter的标题
  type: PropTypes.oneOf(["date", "normal"]), //filter 类型 ：日期和普通
  filterMultiple: PropTypes.bool, // 是否多选
  normalFilterMap: PropTypes.object, // 已选中普通filter map
  onNormalFilterCallback: PropTypes.func, // 普通筛选item点击事件回调
  onFilterResponseCallback: PropTypes.func, // 后台返回筛选结果回调
  //================= sort view ===================
  style: PropTypes.object, //全部
  onSortDataSelectedCallback: PropTypes.func, // 排序列表item点击事件回调
  sortDataIndex: PropTypes.number, //排序默认选中item
  leftTitleText: PropTypes.string, //左边排序title item 标题
  titleItemHight: PropTypes.number, //头部点击view高度
  sortDataObj: PropTypes.object, //排序列表data与默认选中排序项
  rightTitleText: PropTypes.string //右边排序title item 标题
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
    position: "absolute",
    top: 0,
    left: 0,
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
