import React, { Component } from "react";
import { AsyncStorage } from "react-native";
import { FetchUtils } from "sz-network-module";

const URI = "action/personal/feedBackSubmit";

export default class FeedbackHelper extends Component {
  static feedBackSubmit({
    contactPhone,
    content,
    accountId,
    accountName,
    feedBackType,
    accountType,
    onSuccess,
    onError,
    onFinally
  }) {
    FetchUtils.fetch({
      params: {
        contactPhone: contactPhone,
        content: content,
        accountId: accountId,
        accountName: accountName,
        feedBackType: feedBackType,
        accountType: accountType
      },
      api: URI,
      success: response => onSuccess(response),
      error: err => onError(err),
      final: () => onFinally()
    });
  }
}
