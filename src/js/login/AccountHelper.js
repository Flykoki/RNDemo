import React, { Component } from "react";
import { AsyncStorage } from "react-native";
import { FetchUtils } from "sz-network-module";
const ACCOUNT_KEY = "account_key";
export const ACCOUNT_TYPE_EMPLOYEE = 0;
export const ACCOUNT_TYPE_DISTRIBUTOR = 1;
const LOGIN_BASE_URL = "http://mapiproxytest.maimaiche.com/ucarmapiproxy/";
const LOGIN_CID = "502109";
const EMPLOYEE_LOGIN_API = "action/employee/login";
const DISTRIBUTOR_LOGIN_API = "action/distributor/login";
const LOGIN_OUT_API = "action/admin/logout";
const DISTRIBUTOR_USER_INFO = "action/distributor/getBusinessInfo";
const EMPLOYEE_USER_INFO = "action/employee/getEmployeeInfo";

export default class AccountHelper extends Component {
  static accountInfo;

  static employeeLogin(name, password, success, error) {
    AccountHelper._login(
      ACCOUNT_TYPE_EMPLOYEE,
      {
        account: name,
        passwd: password
      },
      success,
      error
    );
  }

  static distributorLogin(name, password, success, error) {
    AccountHelper._login(
      ACCOUNT_TYPE_DISTRIBUTOR,
      {
        userName: name,
        password: password
      },
      success,
      error
    );
  }

  static _login(accountType, params, success, error) {
    FetchUtils.fetch({
      url: LOGIN_BASE_URL,
      customCid: LOGIN_CID,
      params: params,
      api:
        accountType === ACCOUNT_TYPE_EMPLOYEE
          ? EMPLOYEE_LOGIN_API
          : DISTRIBUTOR_LOGIN_API,
      success: response => {
        console.log("login success = ", response);
        response.localType = accountType;
        AccountHelper.refreshAccountInfo(response);
        success();
      },
      error: err => {
        console.log("login error = ", err);
        error({ msg: "登录失败" });
      }
    });
  }

  static getDistributorInfo(distributorCode, success, error) {
    FetchUtils.fetch({
      url: LOGIN_BASE_URL,
      customCid: LOGIN_CID,
      params: { distributorCode: distributorCode },
      api: DISTRIBUTOR_USER_INFO,
      success: response => {
        if (success) {
          success(response);
        }
      },
      error: err => {
        if (error) {
          error(err);
        }
      }
    });
  }

  static getEmployeeInfo(success, error) {
    FetchUtils.fetch({
      url: LOGIN_BASE_URL,
      customCid: LOGIN_CID,
      params: {},
      api: EMPLOYEE_USER_INFO,
      success: response => {
        if (success) {
          success(response);
        }
      },
      error: err => {
        if (error) {
          error(err);
        }
      }
    });
  }

  static loginOut(result) {
    FetchUtils.fetch({
      url: LOGIN_BASE_URL,
      customCid: LOGIN_CID,
      params: {},
      api: LOGIN_OUT_API,
      success: response => {
        AccountHelper.clearAccountInfo();
        AccountHelper.accountInfo = null;
        result(true);
      },
      error: err => {
        console.log("loginOut code = ", err.code, " err = ", err);
        if (err.code === 5) {
          AccountHelper.clearAccountInfo();
          AccountHelper.accountInfo = null;
          result(true);
          return;
        }
        result(false);
      }
    });
  }

  static getAccountInfo() {
    return new Promise((resolve, reject) => {
      console.log("getAccountInfo = ", AccountHelper.accountInfo);
      if (AccountHelper.accountInfo) {
        resolve(AccountHelper.accountInfo);
      } else {
        AccountHelper.getSavedAccountInfo().then(accountInfo => {
          // console.log("getAccountInfo from saved = ", accountInfo);
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
