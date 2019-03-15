"use strict";
import React from "react";
import {
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  View,
  Image
} from "react-native";
import Pullable from "../local/Pullable";
import * as index from "../local/info";
import { LoadingView } from "../view/CommonView";

export default class PullFlatList extends Pullable {
  getScrollable = () => {
    return (
      <FlatList
        onEndReachedThreshold={
          this.props.onEndReachedThreshold
            ? this.props.onEndReachedThreshold
            : 0.1
        }
        ref={c => (this.scroll = c)}
        {...this.props}
      />
    );
  };
}
