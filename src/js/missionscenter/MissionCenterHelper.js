import React, { Component } from "react";
import { AsyncStorage } from "react-native";
import { FetchUtils } from "react-native-sz-network";
import AccountHelper from "../login/AccountHelper";

const QUERY_TASK_GROUP_FILTER = "action/task/taskGroup";
const sortBy = "DESC"; //排序规则 “ASC”-升序 "DESC" - 降序 。默认降序
let temp = {};
let statusArray = [];
export default class MissionCenterHelper extends Component {
  static queryTaskGroupWithFilter(
    map,
    accountInfo,
    pageSize,
    page,
    onSuccess,
    onError,
    onFinally
  ) {
    let {
      createDateStart,
      createDateEnd,
      userType,
      statusList,
      completeDateStart,
      completeDateEnd,
      cancelDateStart,
      cancelDateEnd,
      sortBy = "DESC",
      createTimeSort = "DESC"
    } = MissionCenterHelper._iteratorMaps(map);
    FetchUtils.fetch({
      // url: "http://ampmapiproxytest.ucarinc.com/",
      // customCid: "691100",
      params: {
        accountId: accountInfo.accountId,
        execDeptIds: AccountHelper.getExecDeptIds(),
        pageSize: pageSize,
        pageNum: page,
        sortBy: sortBy,
        createDateStart: createDateStart,
        createDateEnd: createDateEnd,
        userType: userType,
        statusList: statusList,
        createTimeSort: createTimeSort,
        cancelDateEnd: cancelDateEnd,
        cancelDateStart: cancelDateStart,
        completeDateStart: completeDateStart,
        completeDateEnd: completeDateEnd
      },
      api: QUERY_TASK_GROUP_FILTER,
      success: response => onSuccess(response),
      error: err => onError(err),
      final: () => {
        onFinally();
        //需要清空筛选条件
        statusArray = [];
        temp = {};
      }
    });
  }

  //过滤查询条件
  static _iteratorMaps = filterMap => {
    for (let [key, value] of filterMap) {
      key.indexOf("-") === -1
        ? MissionCenterHelper._filterMaps(key, value)
        : MissionCenterHelper._filterMaps(
            key.substring(0, key.indexOf("-")),
            value
          );
    }
    console.log("lfj 过滤查询条件", temp);
    return temp;
  };

  static _filterMaps = (key, value) => {
    switch (key) {
      case "userType": //存在这个key说明被选中了
        value = 0;
        temp.userType = value;
        break;
      case "statusList":
        value = MissionCenterHelper._getStatus(value);
        statusArray.push(value);
        //去重
        let obj = {};
        statusArray = statusArray.reduce((cur, next) => {
          obj[next] ? "" : (obj[next] = true && cur.push(next));
          return cur;
        }, []);
        break;
      case "createTimeSort":
        temp.createTimeSort = value;
        temp.sortBy = value;
        break;
      case "completeDate":
        let date = value.split("-");

        temp.completeDateStart = MissionCenterHelper._changeDateDisplay(
          date[0]
        );
        temp.completeDateEnd = MissionCenterHelper._changeDateDisplay(date[1]);
        break;
      case "cancelDate":
        let cancelDate = value.split("-");
        temp.cancelDateStart = MissionCenterHelper._changeDateDisplay(
          cancelDate[0]
        );
        temp.cancelDateEnd = MissionCenterHelper._changeDateDisplay(
          cancelDate[1]
        );
        break;
      case "createDate":
        let createDate =
          value.indexOf("-") === -1
            ? MissionCenterHelper._getCreateDate(value)
            : value.split("-");
        temp.createDateStart = MissionCenterHelper._changeDateDisplay(
          createDate[0]
        );
        temp.createDateEnd = MissionCenterHelper._changeDateDisplay(
          createDate[1]
        );
        break;
      default:
        break;
    }

    statusArray.length > 0 ? (temp.statusList = statusArray) : {};
  };

  static _changeDateDisplay = date => {
    return date.replace("/", "-");
  };

  static _getCreateDate = date => {
    let array = [];
    let today = MissionCenterHelper.getLastDate(0);
    switch (date) {
      case "今天":
        return [today, today];
        break;
      case "近3天":
        let last3Day = MissionCenterHelper.getLastDate(-3);
        return [last3Day, today];
        break;
      case "近7天":
        let last7Day = MissionCenterHelper.getLastDate(-7);
        return [last7Day, today];
        break;
      case "近15天":
        let last15Day = MissionCenterHelper.getLastDate(-15);
        return [last15Day, today];
        break;

      default:
        break;
    }

    return array;
  };

  static getLastDate(AddDayCount) {
    var dd = new Date();
    dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
    var y = dd.getFullYear();
    var m = (dd.getMonth() + 1).toString().padStart(2, "0"); //获取当前月份的日期
    var d = dd
      .getDate()
      .toString()
      .padStart(2, "0");
    return y + "-" + m + "-" + d;
  }

  static _getStatus = status => {
    switch (status) {
      case "待处理":
        return 1;
        break;
      case "处理中":
        return 2;
        break;
      case "处理完毕":
        return 3;
        break;
      case "已取消":
        return 4;
        break;

      default:
        break;
    }
  };
}
