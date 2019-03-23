import React, { Component } from "react";
import { View, Text, SectionList, Dimensions, StyleSheet } from "react-native";
import ListScrollBar from "./ListScrollBar";
import CityListData from "../../../../assets/citylist";
import { FetchUtils } from "sz-network-module";

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
          {item.cityName}
        </Text>

        <Text style={styles.itemRightText} key={index}>
          {item.cityName}
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
    FetchUtils.fetch({
      params: {},
      api: "action/employee/queryStoresInfo",
      success: response => {
        console.log("getCityInfos response = ", response);
        cityInfos = response.cityInfo;
        citySections = new Map();
        citySections.set("全部", {
          title: "全部",
          data: [{ cityName: "全部", cityId: 1 }]
        });
        sections = [];
        sections.push({ title: "↑" });
        cityInfos.forEach(cityInfo => {
          capital = cityInfo.capital;
          citySection = citySections.get(capital);
          if (citySection) {
          } else {
            citySection = { title: capital };
            citySections.set(capital, citySection);
            sections.push({ title: capital });
          }
          sectionData = citySection.data;
          if (sectionData) {
          } else {
            sectionData = [];
            citySection.data = sectionData;
          }
          sectionData.push({
            cityName: cityInfo.cityName,
            cityId: cityInfo.cityId
          });
        });
        // citySections.
        citySectionList = [];
        citySections.forEach(element => {
          console.log("map for each ", element);
          citySectionList.push(element);
        });
        this.setState({
          data: citySectionList,
          sections: sections
        });
      },
      error: err => {
        console.log("getCityInfos err = ", err);
      }
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
