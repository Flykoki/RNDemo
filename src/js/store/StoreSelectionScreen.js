import React, { Component } from "react";

import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
  StyleSheet,
  AsyncStorage
} from "react-native";
import { FetchUtils } from "sz-network-module";
import AccountHelper from "../login/AccountHelper";
const { width, height } = Dimensions.get("screen");
const STORE_HISTORY_KEY = "store_history_key";
export default class StoreSelectionScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: (
        <HeaderCity
          city={{
            cityName: navigation.getParam("cityInfo", {
              cityId: -1,
              cityName: ""
            }).cityName
          }}
          onCityPress={() => {
            navigation.navigate("CityList", {
              cityInfo: navigation.getParam("cityInfo"),
              cityList: navigation.getParam("cityList")
            });
          }}
        />
      ),
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
  constructor(props) {
    super(props);
    this.list = React.createRef();
    this.state = {
      data: []
    };
  }

  componentDidMount() {
    this._fetchStoreData();
  }

  _fetchStoreData() {
    getStoreHistorys().then(result => {
      console.log("store data = ", result);
    });
    storeInfo = this.props.navigation.getParam("storeInfo");
    this.props.navigation.setParams({
      cityInfo: { cityId: storeInfo.cityId, cityName: storeInfo.cityName }
    });
    AccountHelper.getAccountInfo().then(accountInfo => {
      api = accountInfo.localType
        ? "action/distributor/getDistributeCityInfo"
        : "action/employee/queryStoresInfo";
      FetchUtils.fetch({
        params: {},
        api: api,
        success: response => {
          console.log("getCityInfos response = ", response);
          this.props.navigation.setParams({ cityList: response });
          this._processStoreData(response, storeInfo);
        },
        error: err => {
          console.log("getCityInfos err = ", err);
        }
      });
    });
  }

  _processStoreData(response, storeInfo) {
    storeInfos = [];
    cityInfos = response.cityInfo;

    cityInfos.forEach(cityInfo => {
      if (
        cityInfo &&
        cityInfo.cityId === storeInfo.cityId &&
        cityInfo.deliveryCenterInfo
      ) {
        cityInfo.deliveryCenterInfo.forEach(deliveryCenterInfo => {
          if (deliveryCenterInfo.storeId === storeInfo.storeId) {
            deliveryCenterInfo.current = true;
          }
          storeInfos.push(deliveryCenterInfo);
        });
      }
    });
    this.setState({ data: storeInfos });

    console.log("getCityInfos storeInfos = ", storeInfos);
  }

  render() {
    return (
      <View style={{ backgroundColor: "#F8F8F8", flex: 1 }}>
        <StoreHistoryPanel />

        <FlatList
          renderItem={this._renderStoreItems.bind(this)}
          data={this.state.data}
          ItemSeparatorComponent={this._renderItemSeparatorComponent}
        />
      </View>
    );
  }

  _renderItemSeparatorComponent() {
    return <View style={styles.storeListDivider} />;
  }
  _renderStoreItems({ item }) {
    return (
      <StoreItem
        store={item}
        onItemPress={item => {
          saveStoreHistory(item);
          this.props.navigation.state.params.returnTag(item);
          this.props.navigation.goBack();
        }}
      />
    );
  }
}

class HeaderCity extends Component {
  render() {
    return (
      <TouchableOpacity
        style={{ flexDirection: "row", alignItems: "center" }}
        onPress={this.props.onCityPress}
      >
        <Text style={{ color: "#333333", fontSize: 14, marginLeft: 20 }}>
          {this.props.city.cityName}
        </Text>
        <Image
          style={{ width: 10, height: 10, resizeMode: "center", marginLeft: 5 }}
          source={require("../../res/img/icon_down_arrow.png")}
        />
      </TouchableOpacity>
    );
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

class StoreItem extends Component {
  render() {
    return (
      <TouchableOpacity
        style={styles.storeListItem}
        onPress={() => {
          this.props.onItemPress(this.props.store);
        }}
      >
        <Text style={styles.storeListItemTitle}>
          {this.props.store.storeName}
        </Text>
        {this.props.store.address && (
          <Text style={styles.storeListItemAddress}>
            {this.props.store.address}
          </Text>
        )}
        {this.props.store.current && (
          <Image
            style={styles.storeListItemSelectIcon}
            source={require("../../res/img/icon_store_selected.png")}
          />
        )}
      </TouchableOpacity>
    );
  }
}

class StoreHistoryPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      historys: null
    };
  }

  componentDidMount() {
    getStoreHistorys().then(result => {
      this.setState({ historys: result.reverse() });
    });
  }

  _renderHistoryItems(historys) {
    itemViews = [];
    historys.forEach(store => {
      itemViews.push(<StoreHistoryItem store={store} />);
    });
    return itemViews;
  }

  render() {
    if (this.state.historys) {
      return (
        <View style={styles.historyPanelContainer}>
          <Text style={styles.historyPanelTitle}>{"最近选择"}</Text>

          <StoreHistoryClearButton
            style={styles.historyPanelClearContainer}
            onPress={() => {
              clearStoreHistory().then(result => {
                if (result) {
                } else {
                  this.setState({ historys: null });
                }
              });
            }}
          />
          {this._renderHistoryItems(this.state.historys)}
        </View>
      );
    }
    return null;
  }
}

class StoreHistoryClearButton extends Component {
  constructor(props) {
    super(props);
    this.state = { firstClick: true };
  }
  render() {
    return (
      <TouchableOpacity
        style={[this.props.style]}
        onPress={() => {
          if (this.state.firstClick) {
            this.setState({ firstClick: false });
            return;
          }
          this.props.onPress();
        }}
      >
        {this.state.firstClick && (
          <Image
            style={styles.historyPanelClearImg}
            source={require("../../res/img/icon_history_clear.png")}
          />
        )}
        {!this.state.firstClick && (
          <Text
            style={{
              backgroundColor: "#8F8E94",
              color: "white",
              borderRadius: 8,
              height: 15,
              width: 31,
              textAlign: "center",
              textAlignVertical: "center",
              fontSize: 10
            }}
          >
            {"清除"}
          </Text>
        )}
      </TouchableOpacity>
    );
  }
}

class StoreHistoryItem extends Component {
  render() {
    return (
      <TouchableOpacity style={styles.historyPanelItemContainer}>
        <Text style={styles.historyPanelItemText}>
          {this.props.store.storeName}
        </Text>
      </TouchableOpacity>
    );
  }
}

class FirstView extends Component {
  render() {
    return (
      <View
        style={{
          backgroundColor: "green",
          flex: 1,
          width: width,
          height: height
        }}
      />
    );
  }
}

class SecondView extends Component {
  render() {
    return (
      <View
        style={{
          backgroundColor: "blue",
          flex: 1,
          width: width,
          height: height
        }}
      />
    );
  }
}

function getStoreHistorys() {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem(STORE_HISTORY_KEY, (error, result) => {
      list = JSON.parse(result);
      resolve(list);
    });
  });
}

function saveStoreHistory(history) {
  console.log("saveHistory ", history);

  getStoreHistorys().then(result => {
    if (result) {
      result.forEach(item => {
        if (item.storeId === history.storeId) {
          result = result.filter(elem => {
            return elem != item;
          });
        }
      });
    } else {
      result = [];
    }
    result.push(history);
    string = JSON.stringify(result);
    AsyncStorage.setItem(STORE_HISTORY_KEY, string, error => {});
  });
}

function clearStoreHistory() {
  return new Promise((resolve, reject) => {
    AsyncStorage.removeItem(STORE_HISTORY_KEY, error => {
      resolve(error);
    });
  });
}

const styles = StyleSheet.create({
  historyPanelContainer: {
    width: "100%",
    flexWrap: "wrap",
    flexDirection: "row",
    paddingLeft: "4.45%",
    paddingRight: "4.45%",
    backgroundColor: "white",
    paddingBottom: 12,
    marginBottom: 10
  },
  historyPanelTitle: {
    width: "100%",
    fontSize: 14,
    color: "#666666",
    marginLeft: "1.45%",
    marginTop: 13
  },
  historyPanelClearContainer: {
    position: "absolute",
    top: 13,
    right: "6.5%"
  },
  historyPanelClearImg: { width: 15, height: 15, resizeMode: "stretch" },
  historyPanelItemContainer: {
    width: "46.9%",
    marginLeft: "1.45%",
    marginRight: "1.45%",
    marginTop: 12
  },
  historyPanelItemText: {
    fontSize: 15,
    height: 32,
    borderRadius: 3,
    borderColor: "#DADADF",
    borderWidth: 0.5,
    textAlign: "center",
    textAlignVertical: "center"
  },
  storeListDivider: { backgroundColor: "#E5E5E5", height: 0.5, width: "100%" },
  storeListItem: {
    height: 70,
    justifyContent: "space-evenly",
    paddingLeft: 22,
    backgroundColor: "white"
  },
  storeListItemTitle: { color: "#333333", fontSize: 16 },
  storeListItemAddress: { color: "#666666", fontSize: 13 },
  storeListItemSelectIcon: {
    position: "absolute",
    right: "8.3%",
    top: 30,
    height: 10,
    width: 13
  }
});
