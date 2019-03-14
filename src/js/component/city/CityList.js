import React, { Component } from "react";
import { View, Text, SectionList, Dimensions, StyleSheet } from "react-native";
import ListScrollBar from "./ListScrollBar";
import CityListData from "../../../../assets/citylist";

const { width, height } = Dimensions.get("window");
const ITEM_HEIGHT = 47;
export default class CityList extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = { data: [] };
  }

  componentDidMount() {
    this.getCityInfos();
  }

  _renderListItem({ item, index, section }) {
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.itemLeftText} key={index}>
          {item.city_child}
        </Text>

        <Text style={styles.itemRightText} key={index}>
          {item.city_child}
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

  async getCityInfos() {
    let data = await require("../../../../assets/citylist");
    let jsonData = data.data;
    //每组的开头在列表中的位置
    let totalSize = 0;
    //SectionList的数据源
    let cityInfos = [];
    //分组头的数据源
    let citySection = [];
    //分组头在列表中的位置
    let citySectionSize = [];
    for (let i = 0; i < jsonData.length; i++) {
      citySectionSize[i] = totalSize;
      //给右侧的滚动条进行使用的
      citySection[i] = { title: jsonData[i].title };
      let section = {};
      section.title = jsonData[i].title;
      section.data = jsonData[i].city;
      section.key = i.toString();
      for (let j = 0; j < section.data.length; j++) {
        section.data[j].key = (i * 1000 + j).toString();
      }
      cityInfos[i] = section;
      //每一项的header的index
      totalSize += section.data.length + 1;
    }
    this.setState({
      data: cityInfos,
      sections: citySection,
      sectionSize: citySectionSize
    });
  }

  _getItemLayout = (data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index
  });

  render() {
    const sectionList = this.state.sections;
    return (
      <View>
        <SectionList
          ref="list"
          renderItem={this._renderListItem}
          renderSectionHeader={this._renderListHeader}
          sections={this.state.data}
          keyExtractor={(item, index) => item + index}
          stickySectionHeadersEnabled={true}
          getItemLayout={this._getItemLayout}
        />
        <View style={styles.scrollBarContainer}>
          <ListScrollBar
            onScroll={position => {
              this.refs.list.scrollToLocation({
                sectionIndex: position,
                itemIndex: -1
              });
            }}
            data={sectionList}
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
