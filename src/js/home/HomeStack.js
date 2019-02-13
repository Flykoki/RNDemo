import React, { Component } from "react";
import { View } from "react-native";
import { HomePage } from "./HomePage";
import { DetailPage } from "./DetailPage";
import { createStackNavigator } from "react-navigation";

export const HomeStack = createStackNavigator(
  {
    Home: HomePage,
    Detail: DetailPage
  },
  { initialRouteName: "Home" }
);
