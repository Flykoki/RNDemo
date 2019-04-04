import React, { Component } from "react";
import { AsyncStorage } from "react-native";
import { FetchUtils } from "react-native-sz-network";

const CUS_CID = "650100";

export default class StrategyHelper extends Component {
  /**
   *主界面-资讯
   * @param {成功} onSuccess
   * @param {失败} onError
   * @param {finally} onFinally
   */
  static queryExhibitionList(onSuccess, onError, onFinally) {
    FetchUtils.fetch({
      customCid: CUS_CID,
      params: {},
      api: "action/cmt/queryExhibitionList",
      success: response => onSuccess(response),
      error: err => onError(err),
      final: () => onFinally()
    });
  }

  /**
   * 获取当前用户未读资讯记录数量
   * @param {成功回调} onSuccess
   * @param {失败回调} onError
   * @param {finally} onFinally
   */
  static getInformationUnreadCount(onSuccess, onError, onFinally) {
    FetchUtils.fetch({
      customCid: CUS_CID,
      params: {},
      api: "action/cmt/getInformationUnreadCount",
      success: response => onSuccess(response),
      error: err => onError(err),
      final: () => onFinally()
    });
  }
  /**
   * 设置资讯为已读状态
   * @param {*成功回调} onSuccess
   * @param {*失败回调} onError
   * @param {*finally} onFinally
   */
  static readInformation(id, onSuccess, onError, onFinally) {
    FetchUtils.fetch({
      customCid: CUS_CID,
      params: { articleId: id },
      api: "action/cmt/readInformation",
      success: response => onSuccess(response),
      error: err => onError(err),
      final: () => onFinally()
    });
  }
}
