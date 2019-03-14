import React, { Component } from "react";
import { AsyncStorage } from "react-native";
import { FetchUtils } from "sz-network-module";
const ACCOUNT_KEY = "account_key";

export default class AccountHelper extends Component {
  static accountInfo;

  static login(name, password, success, error) {
    FetchUtils.fetch({
      url: "http://mapiproxytest.maimaiche.com/ucarmapiproxy/",
      customCid: "502109",
      params: {
        account: name,
        passwd: password
      },
      api: "action/employee/login",
      success: response => {
        console.warn("login success = ", response);
        AccountHelper.refreshAccountInfo(response);
        success();
      },
      error: err => {
        console.warn("login error = ", err);
        error({ msg: "登录失败" });
      },
      final: () => {
        console.log("login final");
      }
    });
  }

  static loginOut() {
    AccountHelper.clearAccountInfo();
    AccountHelper.accountInfo = null;
  }

  static getAccountInfo() {
    return new Promise((resolve, reject) => {
      console.log("getAccountInfo = ", AccountHelper.accountInfo);
      if (AccountHelper.accountInfo) {
        resolve(AccountHelper.accountInfo);
      } else {
        AccountHelper.getSavedAccountInfo().then(accountInfo => {
          console.log("getAccountInfo from saved = ", accountInfo);
          AccountHelper.accountInfo = accountInfo;
          resolve(accountInfo);
        });
      }
    });
  }

  static getSavedAccountInfo() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(ACCOUNT_KEY, (error, result) => {
        console.log("getSavedAccountInfo() ", result, " e = ", error);
        if (result) {
          json = JSON.parse(result);
          resolve(json);
        } else {
          resolve(null);
        }
      });
    });
  }

  static refreshAccountInfo(accountInfo) {
    AccountHelper.accountInfo = accountInfo;
    AccountHelper.saveAccountInfo(accountInfo);
  }

  static saveAccountInfo(key) {
    var jsonStr = JSON.stringify(key);
    AsyncStorage.setItem(ACCOUNT_KEY, jsonStr, error => {
      if (error) {
        console.warn("saveAccountInfo error", error);
      } else {
        console.warn("save account info successful");
      }
    });
  }

  static clearAccountInfo() {
    AsyncStorage.clear(error => {
      console.log("clearDynamicKey() result = ", error);
    });
  }
}
