import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet
} from "react-native";

export default class TestPage extends Component {
  render() {
    return (
      <View
        style={{ flex: 1 }}
        onTouchStart={e => console.log("lfj View onTouchStart")}
      >
        <FlatList
          onTouchStart={e => console.log("lfj FlatList onTouchStart")}
          style={{ flex: 1 }}
          data={[{ key: "a" }, { key: "b" }]}
          ItemSeparatorComponent={() => (
            <View
              style={{ height: 1, width: "100%", backgroundColor: "green" }}
            />
          )}
          renderItem={({ item }) => (
            <TouchableOpacity
              onTouchStart={e =>
                console.log("lfj TouchableOpacity onTouchStart")
              }
              style={{ height: 40, width: "100%", backgroundColor: "grey" }}
            >
              <Text
                onTouchStart={e =>
                  console.log("lfj Text onTouchStart", e.nativeEvent)
                }
              >
                {item.key}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }
}
