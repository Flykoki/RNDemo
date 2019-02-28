import React, { Component } from "react";
import { FlatList, View } from "react-native";
import ListItem from "./ListItem";

export default class SettingsList extends Component {
  _renderItem({ item }) {
    if (item.type === "item") {
      return (
        <ListItem
          name={item.name}
          value={item.value}
          showArrow={item.showArrow}
          onPress={item.onPress}
          rightIcon={item.rightIcon}
          leftIcon={item.leftIcon}
          switchStatus={item.switchStatus}
        />
      );
    }

    if (item.type === "margin") {
      const style = { height: item.margin };
      return <View style={style} />;
    }

    if (item.type === "divider") {
      return (
        <View style={{ backgroundColor: "white" }}>
          <View
            style={{ height: 0.5, backgroundColor: "#E3E3E3", marginLeft: 17 }}
          />
        </View>
      );
    }

    if (item.type === "custom") {
      return item.customView;
    }
  }
  render() {
    const { data } = this.props;
    return (
      <FlatList
        data={data}
        renderItem={this._renderItem}
        style={this.props.styles}
      />
    );
  }
}
