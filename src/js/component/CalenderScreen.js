import React, { Component } from "react";
import {
  SectionList,
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar
} from "react-native";
import PropTypes from "prop-types";
import { stat } from "react-native-fs";

const { width } = Dimensions.get("window");
const dayItemWidth = width / 7;
const rangedDate = [0, 0];
const today = [0];

const PubSub = require("pubsub-js");

class MonthPanel extends Component {
  constructor(props) {
    super(props);
    this.state = { days: [] };
    this.daysItems = [];
    this._initData();

    this.firstDayInWeek = 0;
  }

  _initData() {
    year = this.props.section.year;
    month = this.props.section.month;
    date = new Date();

    YEAR = date.getFullYear();
    MONTH = date.getMonth();
    DAY = date.getDate();
    date.setFullYear(this.props.section.year); //把当前年份设为某年
    date.setMonth(this.props.section.month);
    date.setDate(0);
    monthTotalDate = date.getDate();
    date.setMonth(this.props.section.month - 1); //把当前月份设为某月
    date.setDate(1);

    this.firstDayInWeek = date.getDay();
    days = [];
    this.state.yearNMonth = year * 10000 + month * 100;
    for (i = 0; i < monthTotalDate; i++) {
      days.push({
        day: i + 1,
        yearNMonth: this.state.yearNMonth,
        holiday: this._getHoliday(month, i + 1),
        firstDayInWeek: this.firstDayInWeek,
        onDayPress: this.props.section.onDayPress
      });
    }

    days.forEach(element => {
      this.daysItems.push(this._renderDayItem(element));
    });
    return this.daysItems;
  }

  _getHoliday(month, day) {
    if (month === 1 && day === 1) return "元旦";

    if (month === 5 && day === 1) return "劳动节";

    if (month === 10 && day === 1) return "国庆";
    return "";
  }

  _renderDayItem(day) {
    return <DayItem day={day} />;
  }

  render() {
    return (
      <View style={[styles.monthContainer, this.props.style]}>
        {this.daysItems}
      </View>
    );
  }
}

class DayItem extends Component {
  constructor(props) {
    super(props);
    PubSub.subscribe("MY TOPIC", this.refreshItems.bind(this));
  }

  refreshItems(msg, data) {
    dayData = this.props.day;
    day = dayData.yearNMonth + dayData.day;
    if (rangedDate[0] === day || rangedDate[1] === day) {
      this.setState({});
    } else if (rangedDate[0] < day && rangedDate[1] > day) {
      this.setState({});
    } else if (this.current != "normal" && this.current != "unavailable") {
      this.setState({});
    }
  }

  _getItemStatus(day) {
    value = day.yearNMonth + day.day;
    this.current = "normal";
    if (value === today[0]) {
      day.today = true;
    }

    if (value < today[0]) {
      this.current = "unavailable";
    } else if (value === rangedDate[0]) {
      this.current = "start";
    } else if (value === rangedDate[1]) {
      this.current = "end";
    } else if (value < rangedDate[1] && value > rangedDate[0]) {
      this.current = "contain";
    }

    switch (this.current) {
      case "start":
        containerStyle = styles.dayStartContainer;
        dayStyle = styles.dayStart;
        dayHoliday = styles.holidayContain;
        break;
      case "end":
        containerStyle = styles.dayEndContainer;
        dayStyle = styles.dayEnd;
        dayHoliday = styles.holidayContain;
        break;
      case "contain":
        containerStyle = styles.dayContainContainer;
        dayStyle = styles.dayContain;
        dayHoliday = styles.holidayContain;
        break;
      case "unavailable":
        containerStyle = styles.dayNormalContainer;
        dayStyle = styles.dayUnavailable;
        dayHoliday = styles.holidayUnavailable;
        break;
      case "normal":
      default:
        containerStyle = styles.dayNormalContainer;
        dayStyle = styles.dayNormal;
        dayHoliday = styles.holidayNormal;
        break;
    }
  }
  render() {
    const dayData = this.props.day;
    this._getItemStatus(dayData);

    return (
      <TouchableOpacity
        style={[
          containerStyle,
          {
            marginLeft:
              dayData.day === 1 ? dayItemWidth * dayData.firstDayInWeek : 0
          }
        ]}
        onPress={() => {
          ynm = dayData.yearNMonth;
          ynd = ynm + dayData.day;
          if (rangedDate[0] === ynd) {
            rangedDate[0] = 0;
            rangedDate[1] = 0;
          } else if (
            (rangedDate[0] != 0 && rangedDate[1] != 0) ||
            (rangedDate[0] === 0 && rangedDate[1] === 0) ||
            ynd < rangedDate[0]
          ) {
            rangedDate[0] = ynd;
            rangedDate[1] = 0;
          } else if (rangedDate[0] != 0 && rangedDate[1] === 0) {
            rangedDate[1] = ynd;
          }
          PubSub.publish("MY TOPIC", "hello world!");
        }}
      >
        <Text style={dayHoliday}>{dayData.holiday}</Text>
        <Text style={dayStyle}>{dayData.day}</Text>
        <Text style={dayHoliday}>{dayData.today ? "今天" : ""}</Text>
      </TouchableOpacity>
    );
  }
}

class WeekPanel extends Component {
  render() {
    return (
      <View style={styles.weekPanel}>
        <Text style={[styles.dayItemContainer, styles.weekEndColor]}>
          {"日"}
        </Text>
        <Text style={[styles.dayItemContainer, styles.weekDayColor]}>
          {"一"}
        </Text>
        <Text style={[styles.dayItemContainer, styles.weekDayColor]}>
          {"二"}
        </Text>
        <Text style={[styles.dayItemContainer, styles.weekDayColor]}>
          {"三"}
        </Text>
        <Text style={[styles.dayItemContainer, styles.weekDayColor]}>
          {"四"}
        </Text>
        <Text style={[styles.dayItemContainer, styles.weekDayColor]}>
          {"五"}
        </Text>
        <Text style={[styles.dayItemContainer, styles.weekEndColor]}>
          {"六"}
        </Text>
      </View>
    );
  }
}

export default class CalenderScreen extends Component {
  static navigationOptions = {
    title: "请选择日期",
    headerLeft: null
  };

  constructor(props) {
    super(props);
    this.panels = new Map();
  }

  _initData(cYear, cMonth) {
    startYear = this.props.navigation.getParam("startYear");
    startMonth = this.props.navigation.getParam("startMonth");
    endYear = this.props.navigation.getParam("endYear");
    endMonth = this.props.navigation.getParam("endMonth");
    limit = this.props.navigation.getParam("limit");

    if (startYear) {
      if (endYear) {
      } else if (limit) {
        month = startMonth + (limit % 12) - 1;
        if (month > 12) {
          endMonth = month - 12;
          endYear = startYear + Math.floor(limit / 12) + 1;
        } else {
          endMonth = month;
          endYear = startYear + Math.floor(limit / 12);
        }
      } else if (startYear < cYear) {
        endYear = cYear;
        if (startMonth) {
          endMonth = startMonth - 1;
        } else {
          startMonth = 1;
          endMonth = 12;
        }
      } else if (startYear === cYear) {
        if (startMonth) {
          if (startMonth < cMonth) {
            endYear = cYear;
            endMonth = cMonth;
          } else if (cMonth < startMonth) {
            endYear = cYear;
            endMonth = startMonth;
            startMonth = cMonth;
          } else {
            endYear = startYear + 1;
            endMonth = startMonth - 1;
          }
        } else {
          endYear = startYear + 1;
          endMonth = startMonth - 1;
        }
      }
    } else {
      if (endYear) {
        if (!limit) {
          limit = 12;
        }
        if (!endMonth) {
          endMonth = 12;
        }
        month = endMonth - (limit % 12);
        if (month < 1) {
          endMonth = 12 + month;
          startYear = endYear - Math.floor(limit / 12) - 1;
        } else {
          endMonth = month;
          startYear = endYear - Math.floor(limit / 12);
        }
      } else {
        if (!limit) {
          limit = 12;
        }
        startYear = cYear;
        startMonth = cMonth;
        month = cMonth + (limit % 12);
        if (month > 12) {
          endMonth = month - 12;
          endYear = startYear + Math.floor(limit / 12) + 1;
        } else {
          endMonth = month;
          endYear = startYear + Math.floor(limit / 12);
        }
      }
    }

    this.setState({
      date: this._fetchMonth(startYear, startMonth, endYear, endMonth)
    });
  }

  _fetchMonth(startYear, startMonth, endYear, endMonth) {
    console.log(
      "_fetchMonth() startYear = ",
      startYear,
      " startMonth = ",
      startMonth,
      " endYear = ",
      endYear,
      " endMonth = ",
      endMonth
    );
    data = [];
    for (y = startYear; y <= endYear; y++) {
      m = y === startYear ? startMonth : 1;
      for (; m <= 12; m++) {
        if (y === endYear && m === endMonth) {
          data.push({ year: y, month: m, data: [11] });
          break;
        }
        data.push({ year: y, month: m, data: [11] });
      }
    }
    return data;
  }

  componentWillMount() {
    param = this.props.navigation.getParam("startYear");
    console.log("componentWillMount() param = ", param);
    date = new Date();
    year = date.getFullYear();
    month = date.getMonth() + 1;
    today[0] = year * 10000 + month * 100 + date.getDate();
    console.log("mount today = " + today);
    this._initData(year, month);
  }

  componentWillUnmount() {
    today[0] = 0;
    rangedDate[0] = 0;
    rangedDate[1] = 0;
  }

  _renderListItem({ item, index, section }) {
    return <MonthPanel section={section} />;
  }

  _renderListHeader({ section: { year, month, clear } }) {
    return (
      <View style={styles.sectionHeaderContainer}>
        <Text style={styles.sectionHeaderText}>{`${year}年${month}月`}</Text>
        <View style={styles.sectionHeaderDivider} />
      </View>
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        <WeekPanel />
        <SectionList
          ref="monthList"
          renderItem={this._renderListItem.bind(this)}
          renderSectionHeader={this._renderListHeader}
          sections={this.state.date}
          keyExtractor={(item, index) => {
            item + index;
          }}
          stickySectionHeadersEnabled={true}
        />

        <View style={styles.buttonPanel}>
          <TouchableOpacity
            style={[styles.buttonContainer, styles.cancelContainer]}
            onPress={() => {
              this.props.navigation.goBack();
            }}
          >
            <Text style={styles.disableTextColor}>{"取消"}</Text>
          </TouchableOpacity>

          <ConfirmButton onPress={this._onConfirmPressed.bind(this)} />
        </View>
      </View>
    );
  }

  _onConfirmPressed() {
    confirm = this.props.navigation.getParam("onConfirm");
    if (confirm) {
      confirm(rangedDate);
    }
    this.props.navigation.goBack();
  }
}

class ConfirmButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enable: false
    };
  }
  componentWillMount() {
    PubSub.subscribe("MY TOPIC", this._updateState.bind(this));
  }

  _updateState() {
    this.setState({ enable: rangedDate[0] != 0 && rangedDate[1] != 0 });
  }

  render() {
    style = this.state.enable
      ? styles.enableContainerColor
      : styles.disableContainerColor;
    textStyle = this.state.enable
      ? styles.enableTextColor
      : styles.disableTextColor;
    return (
      <TouchableOpacity
        style={[this.props.style, styles.buttonContainer, style]}
        activeOpacity={this.state.enable ? 0.5 : 1}
        onPress={() => {
          if (this.state.enable) {
            this.props.onPress();
          }
        }}
      >
        <Text style={textStyle}>{"确认"}</Text>
      </TouchableOpacity>
    );
  }
}

CalenderScreen.propTypes = {
  startYear: PropTypes.number,
  startMonth: PropTypes.oneOf([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
  endYear: PropTypes.number,
  endMonth: PropTypes.oneOf([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
  limit: PropTypes.number
};

const styles = StyleSheet.create({
  weekPanel: {
    height: 50.5,
    flexDirection: "row"
  },
  dayItemContainer: {
    height: dayItemWidth,
    width: dayItemWidth,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 13
  },
  weekDayColor: {
    color: "#1B2B3B"
  },
  weekEndColor: { color: "#F12E49" },
  sectionHeaderContainer: { height: 30, backgroundColor: "#FFFFFF" },
  sectionHeaderText: {
    height: 30,
    color: "#1B2B3B",
    fontSize: 18,
    textAlign: "center"
  },
  sectionHeaderDivider: { height: 0.5, backgroundColor: "#E5E5E5" },
  monthContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    paddingBottom: 21
  },
  dayNormalContainer: {
    height: dayItemWidth,
    width: dayItemWidth,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center"
  },
  dayStartContainer: {
    height: dayItemWidth,
    width: dayItemWidth,
    backgroundColor: "#F12E49",
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5,
    alignItems: "center",
    justifyContent: "center"
  },
  dayEndContainer: {
    height: dayItemWidth,
    width: dayItemWidth,
    backgroundColor: "#F12E49",
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    alignItems: "center",
    justifyContent: "center"
  },
  dayContainContainer: {
    height: dayItemWidth,
    width: dayItemWidth,
    backgroundColor: "#FFE7EA",
    alignItems: "center",
    justifyContent: "center"
  },
  dayNormal: {
    color: "#60606C",
    fontSize: 18,
    textAlignVertical: "center"
  },
  dayStart: {
    color: "#FFFFFF",
    fontSize: 18
  },
  dayEnd: {
    color: "#FFFFFF",
    fontSize: 18
  },
  dayContain: {
    color: "#60606C",
    fontSize: 18
  },
  dayUnavailable: {
    color: "#B2B2B2",
    fontSize: 18
  },
  holidayNormal: {
    fontSize: 10,
    color: "#60606C"
  },
  holidayContain: {
    fontSize: 10,
    color: "#FFFFFF"
  },
  holidayUnavailable: {
    fontSize: 10,
    color: "#B2B2B2"
  },
  buttonPanel: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingBottom: 14,
    paddingTop: 4
  },
  buttonContainer: {
    height: 42,
    width: 152,
    borderRadius: 6,
    alignItems: "center"
  },
  cancelContainer: {
    borderWidth: 1,
    borderColor: "#DDDDDD"
  },
  enableContainerColor: {
    backgroundColor: "#F12E49"
  },
  disableContainerColor: {
    backgroundColor: "#F6F6F6"
  },
  enableTextColor: {
    color: "#FFFFFF",
    textAlignVertical: "center",
    textAlign: "center",
    flex: 1
  },
  disableTextColor: {
    color: "#666666",
    textAlignVertical: "center",
    textAlign: "center",
    flex: 1
  }
});
