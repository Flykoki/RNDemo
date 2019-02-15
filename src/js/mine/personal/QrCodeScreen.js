import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  DeviceInfo,
  CameraRoll,
  ToastAndroid
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import RNFS from "react-native-fs";

export default class QrCodeScreen extends Component {
  saveQrToDisk() {
    this.svg.toDataURL(data => {
      RNFS.writeFile(
        RNFS.CachesDirectoryPath + "/some-name.png",
        data,
        "base64"
      )
        .then(success => {
          return CameraRoll.saveToCameraRoll(
            RNFS.CachesDirectoryPath + "/some-name.png",
            "photo"
          );
        })
        .then(() => {
          this.setState({ busy: false, imageSaved: true });
          ToastAndroid.show("Saved to gallery !!", ToastAndroid.SHORT);
        });
    });
  }

  render() {
    const { onCloseIconPressed, menus, onSelect, theme } = this.props;
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          backgroundColor: "transparent",
          alignItems: "center"
        }}
      >
        <View
          style={{
            flex: 1,
            width: 320,
            flexDirection: "column",
            backgroundColor: "white",
            alignItems: "center"
          }}
        >
          <Text style={{ marginTop: 30, fontSize: 25, marginBottom: 15 }}>
            神州优车
          </Text>
          <View
            style={{ height: 1, width: "90%", backgroundColor: "#E3E3E3" }}
          />
          <Text style={{ marginTop: 10, fontSize: 15 }}>神州优车</Text>
          <Text style={{ marginTop: 10, fontSize: 15, marginBottom: 10 }}>
            神州优车
          </Text>
          <QRCode
            value="Just some string value" // 生成二维码的value
            size={260} // 二维码大小
            logo={require("../../../res/img/app_icon.png")} // 二维码中间加载显示的logo
            logoSize={60} // 二维码logo大小
            logoMargin={5}
            logoBackgroundColor="transparent" // 二维码logo背景色
            getRef={c => (this.svg = c)}
            backgroundColor="white"
          />

          <Text style={{ marginTop: 10 }}>
            使用车主APP扫一扫我的二维码下订单
          </Text>
          <TouchableOpacity
            style={{ marginTop: 10 }}
            onPress={() => {
              this.saveQrToDisk();
            }}
          >
            <Text style={{ color: "#007ACC" }}>保存到相册</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={{ marginTop: 50 }}
          onPress={() => {
            onCloseIconPressed();
          }}
        >
          <Image
            style={{ width: 60, height: 60 }}
            source={require("../../../res/img/close.png")}
          />
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "flex-end"
  },
  arrow: {
    //适配iPhoneX
    marginTop: 50 + (DeviceInfo.isIphoneX_deprecated ? 24 : 0),
    width: 16,
    height: 6,
    marginRight: 18,
    resizeMode: "contain"
  },
  content: {
    backgroundColor: "white",
    borderRadius: 3,
    paddingTop: 3,
    paddingBottom: 3,
    marginRight: 3
  },
  text: {
    fontSize: 16,
    color: "black",
    fontWeight: "400",
    paddingRight: 15
  },
  icon: {
    width: 16,
    height: 16,
    margin: 10,
    marginLeft: 15
  }
});
