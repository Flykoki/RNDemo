import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  DeviceInfo,
  CameraRoll,
  ToastAndroid,
  Alert
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import RNFS from "react-native-fs";
import { captureScreen, captureRef } from "react-native-view-shot";
import RNFetchBlob from "rn-fetch-blob";

export default class QrCodeScreen extends Component {
  constructor(props) {
    super(props);
    this.mainViewRef = React.createRef();
    this.state = {
      makingImage: false
    };
  }
  _saveQrToDisk() {
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

  async _shareScreenShot() {
    const { makingImage } = this.state;
    if (makingImage) return;

    this.setState({ makingImage: true }, async () => {
      try {
        const captureConfig = {
          format: "png",
          quality: 0.7,
          // result: Platform.OS==='ios'? 'data-uri':'base64',
          // result: 'tmpfile',
          result: "base64",
          width: 750
        };
        let imgBase64 = "";
        try {
          try {
            imgBase64 = await captureRef(
              this.mainViewRef.current,
              captureConfig
            );
          } catch (ex) {
            throw ex;
          }
        } catch (e) {
          imgBase64 = await captureScreen(captureConfig);
        }
        this.imgBase64 = imgBase64;
        this.setState({ showTitle: true });
        const screenShotShowImg = `data:image/png;base64,${this.imgBase64}`;
        //FIXME screenShotShowImg可直接在Image中展示
        // console.log('this.screenShotShowImg====', this.screenShotShowImg);
        this._saveForAndroid(screenShotShowImg);
      } catch (e) {
        Alert.alert(`${e.toString()}`);
        console.warn(e);
      } finally {
        this.setState({ makingImage: false });
      }
    });
  }

  async _saveImage(screenShotShowImg) {
    Toast.showShortCenter("图片保存中...");
    if (IS_IOS) {
      CameraRoll.saveToCameraRoll(screenShotShowImg)
        .then(result => {
          Toast.showShortCenter(`保存成功！地址如下：\n${result}`);
        })
        .catch(error => {
          Toast.showShortCenter(`保存失败！\n${error}`);
        });
    } else {
      //调用该方法是 对 截屏的图片进行拼接，仅限Android端拼接，IOS的我不会，切此处的base64Img是未进行拼接‘data:image/png;base64’字段的base64图片格式
      // await NativeModules.UtilsModule.contactImage(base64Img).then((newImg) => {
      //   // console.log('path====', newImg);
      //   const screenShotShowImg = `data:image/png;base64,${newImg}`;
      //
      // }, (ex) => {
      //   console.log('ex====', ex);
      // });
      //不经过拼接直接保存到相册
      this._saveForAndroid(
        screenShotShowImg,
        result => {
          ToastAndroid.show(`保存成功！地址如下：\n${result}`);
        },
        () => {
          ToastAndroid.show("保存失败！");
        }
      );
    }
  }

  _saveForAndroid(base64Img, success, fail) {
    const dirs = RNFS.ExternalDirectoryPath; // 外部文件，共享目录的绝对路径（仅限android）
    const downloadDest = `${dirs}/${Math.random() * 10000000 || 0}.png`;
    const imageDatas = base64Img.split("data:image/png;base64,");
    const imageData = imageDatas[1];
    RNFetchBlob.fs.writeFile(downloadDest, imageData, "base64").then(result => {
      console.log("result=====", result);
      try {
        CameraRoll.saveToCameraRoll(downloadDest)
          .then(e1 => {
            console.log("success", e1);
            success && success(e1);
          })
          .catch(e2 => {
            console.log("failed", e2);
            Alert.alert("没有读写权限。请在[设置]-[应用权限]-[XX应用]开启");
          });
      } catch (e3) {
        console.warn("catch", e3);
        fail && fail();
      }
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
          ref={this.mainViewRef}
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
              this._shareScreenShot();
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
