import React, { Component } from "react";
import {
  View,
  Text,
  SectionList,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Image
} from "react-native";
import ListScrollBar from "./ListScrollBar";
import CityListData from "../../../../assets/citylist";
import { FetchUtils } from "react-native-sz-network";

const { width, height } = Dimensions.get("window");
const ITEM_HEIGHT = 47;
export default class CityList extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "选择城市",
      headerLeft: <View />,
      headerRight: (
        <HeaderCancel
          onCancel={() => {
            navigation.goBack();
          }}
          cancel={"取消"}
        />
      )
    };
  };
  constructor(props, context) {
    super(props, context);
    this.state = { data: [] };
  }

  componentDidMount() {
    cityList = this.props.navigation.getParam("cityList");
    this.state.cityInfo = this.props.navigation.getParam("cityInfo");

    if (cityList) {
      this._processCityData(cityList);
      return;
    }
    this.getCityInfos();
  }

  _renderListItem({ item, index, section }) {
    selected = item.cityId === this.state.cityInfo.cityId;
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => {
          this.props.navigation.state.params.returnTag(item);
          this.props.navigation.goBack();
        }}
      >
        <Text style={styles.itemLeftText} key={index}>
          {item.cityName}
        </Text>
        {/* <Text style={styles.itemRightText} key={index}>
          {item.cityName}
        </Text> */}
        {selected && (
          <Image
            style={{ position: "absolute", width: 13, height: 10, right: 40 }}
            source={require("../../../res/img/icon_store_selected.png")}
          />
        )}
      </TouchableOpacity>
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
        this._processCityData(response);
      },
      error: err => {
        console.log("getCityInfos err = ", err);
      }
    });
  }

  _processCityData(response) {
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
          renderItem={this._renderListItem.bind(this)}
          renderSectionHeader={this._renderListHeader}
          sections={this.state.data}
          keyExtractor={(item, index) => item + index}
          stickySectionHeadersEnabled={true}
          getItemLayout={this._getItemLayout}
          ItemSeparatorComponent={this._renderItemSeparatorComponent}
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

  _renderItemSeparatorComponent() {
    return <View style={styles.storeListDivider} />;
  }
}

class HeaderCancel extends Component {
  render() {
    return (
      <TouchableOpacity
        style={{ flexDirection: "row", alignItems: "center" }}
        onPress={this.props.onCancel}
      >
        <Text style={{ color: "#333333", fontSize: 14, marginRight: 20 }}>
          {this.props.cancel}
        </Text>
      </TouchableOpacity>
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
  sectionHeaderText: { fontSize: 14, color: "#666666" },
  storeListDivider: { backgroundColor: "#E5E5E5", height: 0.5, width: "100%" }
});
