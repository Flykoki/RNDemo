import React, { Component } from "react";
import { View, Text, SectionList, Dimensions, StyleSheet } from "react-native";
import ListScrollBar from "./ListScrollBar";

const { width, height } = Dimensions.get("window");

export default class CityList extends Component {
  constructor(props, context) {
    super(props, context);
  }

  _renderListItem({ item, index, section }) {
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.itemLeftText} key={index}>
          {item}
        </Text>

        <Text style={styles.itemRightText} key={index}>
          {item}
        </Text>
      </View>
    );
  }

  _renderListHeader({ section: { title, clear } }) {
    return (
      <View style={styles.sectionHeaderContainer}>
        <Text style={styles.sectionHeaderText}>{title}</Text>
      </View>
    );
  }

  render() {
    let rightIndex = [
      { title: "最近", data: ["安庆市", "鞍山市"], clear: "clear" },
      { title: "全部", data: ["全部"] },
      { title: "A", data: ["安庆市", "鞍山市"] },
      { title: "B", data: ["北京市"] },
      { title: "C", data: ["重庆市", "item6"] },
      {
        title: "D",
        data: ["重庆市", "item6"]
      },
      {
        title: "E",
        data: ["重庆市", "item6"]
      },
      {
        title: "F",
        data: ["重庆市", "item6"]
      },
      {
        title: "G",
        data: ["重庆市", "item6"]
      },
      {
        title: "H",
        data: ["重庆市", "item6"]
      },
      {
        title: "I",
        data: ["重庆市", "item6"]
      },
      {
        title: "J",
        data: ["重庆市", "item6"]
      },
      {
        title: "K",
        data: ["重庆市", "item6"]
      },
      {
        title: "L",
        data: ["重庆市", "item6"]
      },
      {
        title: "M",
        data: ["重庆市", "item6"]
      },
      {
        title: "N",
        data: ["重庆市", "item6"]
      },
      {
        title: "O",
        data: ["重庆市", "item6"]
      },
      {
        title: "P",
        data: ["重庆市", "item6"]
      },
      {
        title: "Q",
        data: ["重庆市", "item6"]
      },
      {
        title: "R",
        data: ["重庆市", "item6"]
      },
      {
        title: "S",
        data: ["重庆市", "item6"]
      },
      {
        title: "T",
        data: ["重庆市", "item6"]
      },
      {
        title: "U",
        data: ["重庆市", "item6"]
      },
      {
        title: "V",
        data: ["重庆市", "item6"]
      },
      {
        title: "W",
        data: ["重庆市", "item6"]
      },
      {
        title: "X",
        data: ["重庆市", "item6"]
      },
      {
        title: "Y",
        data: ["重庆市", "item6"]
      },
      {
        title: "Z",
        data: ["重庆市", "item6"]
      }
    ];

    return (
      <View>
        <SectionList
          ref="list"
          renderItem={this._renderListItem}
          renderSectionHeader={this._renderListHeader}
          sections={rightIndex}
          keyExtractor={(item, index) => item + index}
          stickySectionHeadersEnabled={true}
        />
        <View style={styles.scrollBarContainer}>
          <ListScrollBar
            onScroll={position => {
              this.refs.list.scrollToLocation({
                sectionIndex: position,
                itemIndex: -1
              });
            }}
            data={rightIndex}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  indexBox: {
    height: 16,
    backgroundColor: "transparent"
  },
  indexText: {
    fontSize: 11,
    color: "#2A2A2A",
    backgroundColor: "transparent"
  },
  scrollBarContainer: {
    position: "absolute",
    right: 0,
    top: 62,
    bottom: 0,
    height,
    backgroundColor: "transparent",
    alignItems: "center"
  },
  itemContainer: {
    height: 47,
    paddingStart: 15,
    alignItems: "center",
    flexDirection: "row"
  },
  sectionHeaderContainer: {
    paddingStart: 15,
    height: 20,
    backgroundColor: "#F8F8F8"
  },
  itemLeftText: { fontSize: 15, width: 125, color: "#333333" },
  itemRightText: {
    fontSize: 15,
    marginLeft: 10,
    color: "#333333"
  },
  sectionHeaderText: { fontSize: 14, color: "#666666" }
});
