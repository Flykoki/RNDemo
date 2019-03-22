import React, { Component } from "react";
import { AsyncStorage } from "react-native";
import { FetchUtils } from "sz-network-module";

export default class StrategyHelper extends Component {
  static queryExhibitionList(onSuccess, onError, onFinally) {
    FetchUtils.fetch({
      params: {},
      api: "action/cmt/queryExhibitionList",
      success: response => onSuccess(response),
      error: err => onError(err),
      final: () => onFinally()
    });
  }
}
