import React, { Component } from "react";
import { AsyncStorage } from "react-native";
import { FetchUtils } from "react-native-sz-network";

const QUERY_TASK_GROUP = "action/task/searchTaskGroup";

export default class MissionCenterHelper extends Component {
  static searchTaskGroup(
    searchWord,
    accountInfo,
    pageSize,
    page,
    onSuccess,
    onError,
    onFinally
  ) {
    searchWord &&
      FetchUtils.fetch({
        // url: "http://ampmapiproxytest.ucarinc.com/",
        // customCid: "691100",
        params: {
          accountId: accountInfo.accountId,
          execDeptIds: accountInfo.roleList,
          pageSize: pageSize,
          pageNum: page,
          searchWord: searchWord
        },
        api: QUERY_TASK_GROUP,
        success: response => onSuccess(response),
        error: err => onError(err),
        final: () => {
          onFinally();
        }
      });
  }
}
