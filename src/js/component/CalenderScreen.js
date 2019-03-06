import React, { Component } from "react";
import {
  SectionList,
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity
} from "react-native";

const { width } = Dimensions.get("window");
const dayItemWidth = width / 7;
const rangedDate = [0, 0];

export default class CalenderScreen extends Component {
  static navigationOptions = {
    title: "请选择日期",
    headerLeft: null
  };

  constructor(props) {
    super(props);
    this.state = {
      xx: "",
      date: [
        {
          year: 2019,
          month: 3,
          data: [11],
          selected: 0,
          onDayPress: this._onDayPressed.bind(this)
        },
        {
          year: 2019,
          month: 4,
          data: [11],
          selected: 0,
          onDayPress: this._onDayPressed.bind(this)
        },
        {
          year: 2019,
          month: 5,
          data: [11],
          selected: 0,
          onDayPress: this._onDayPressed.bind(this)
        },
        {
          year: 2019,
          month: 6,
          data: [11],
          selected: 0,
          onDayPress: this._onDayPressed.bind(this)
        },
        {
          year: 2019,
          month: 7,
          data: [11],
          selected: 0,
          onDayPress: this._onDayPressed.bind(this)
        },
        {
          year: 2019,
          month: 8,
          data: [11],
          selected: 0,
          onDayPress: this._onDayPressed.bind(this)
        },
        {
          year: 2019,
          month: 9,
          data: [1],
          selected: 0,
          onDayPress: this._onDayPressed.bind(this)
        },
        {
          year: 2019,
          month: 10,
          data: [1],
          selected: 0,
          onDayPress: this._onDayPressed.bind(this)
        },
        {
          year: 2019,
          month: 11,
          data: [1],
          selected: 0,
          onDayPress: this._onDayPressed.bind(this)
        },
        { year: 2019, month: 12, data: [1], selected: 0 },
        { year: 2020, month: 1, data: [1], selected: 0 },
        { year: 2020, month: 2, data: [1], selected: 0 },
        { year: 2020, month: 3, data: [1], selected: 0 },
        { year: 2020, month: 4, data: [1], selected: 0 }
      ]
    };
  }

  _onDayPressed(pressDay) {
    if (rangedDate[0] === pressDay) {
      rangedDate[0] = 0;
      rangedDate[1] = 0;
    } else if (
      (rangedDate[0] != 0 && rangedDate[1] != 0) ||
      (rangedDate[0] === 0 && rangedDate[1] === 0)
    ) {
      rangedDate[0] = pressDay;
      rangedDate[1] = 0;
    } else if (rangedDate[0] != 0 && rangedDate[1] === 0) {
      rangedDate[1] = pressDay;
    }
    this.setState({ xx: "aaa" });
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
        <WeekPanel />
        <SectionList
          renderItem={this._renderListItem}
          renderSectionHeader={this._renderListHeader}
          sections={this.state.date}
          keyExtractor={(item, index) => item + index}
          stickySectionHeadersEnabled={true}
        />
      </View>
    );
  }
}

class MonthPanel extends Component {
  constructor(props) {
    super(props);
    this.state = { days: [] };
  }

  firstDayInWeek;
  _initData() {
    year = this.props.section.year;
    month = this.props.section.month - 1;
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

    firstDayInWeek = date.getDay();
    days = [];
    isCurrentMonth = month === MONTH && year === YEAR;
    yearNMonth = year * 10000 + month * 100;
    for (i = 0; i < monthTotalDate; i++) {
      value = yearNMonth + i + 1;
      current = "normal";
      if (isCurrentMonth && i < DAY - 1) {
        current = "unavailable";
      } else if (value === rangedDate[0]) {
        current = "start";
      } else if (value === rangedDate[1]) {
        current = "end";
      } else if (value < rangedDate[1] && value > rangedDate[0]) {
        current = "contain";
      }
      days.push({
        day: i + 1,
        status: current,
        today: isCurrentMonth && i === DAY - 1
      });
    }
    daysItems = [];
    days.forEach(element => {
      daysItems.push(this._renderDayItem(element));
    });
    return daysItems;
  }

  _renderDayItem({ day, status, today, holiday }) {
    switch (status) {
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

    return (
      <TouchableOpacity
        style={[
          containerStyle,
          { marginLeft: day === 1 ? dayItemWidth * firstDayInWeek : 0 }
        ]}
        onPress={() => {
          this.props.section.onDayPress(
            this.props.section.year * 10000 +
              (this.props.section.month - 1) * 100 +
              day
          );
        }}
      >
        <Text style={dayHoliday}>{holiday}</Text>
        <Text style={dayStyle}>{day}</Text>
        <Text style={dayHoliday}>{today ? "今天" : ""}</Text>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={[styles.monthContainer, this.props.style]}>
        {this._initData()}
      </View>
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
    color: "#FFFFFF"
  }
});
