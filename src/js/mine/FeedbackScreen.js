import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Modal,
  CheckBox,
  Text,
  Platform,
  TextInput,
  Dimensions,
  TouchableOpacity,
  TouchableHighlight,
  TouchableNativeFeedback,
  Image,
  StatusBar
} from "react-native";
import CommonDialog from "../component/CommonDialog";

const width = Dimensions.get("window").width;
const feedbackContentMaxLength = 500;

export default class FeedbackScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "意见反馈",
      headerRight: <View />,
      headerLeft: (
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={styles.backButtonStyle}
        >
          <Image source={require("../../res/img/icon_back.png")} />
        </TouchableOpacity>
      )
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      feedbackContentText: "",
      feedbackPhoneNum: "",
      checkBoxGroupStatus: [
        { isChecked: true, label: "服务体验", uploadType: 0 },
        { isChecked: false, label: "其他", uploadType: 0 },
        { isChecked: false, label: "车源供应业务", uploadType: 0 },
        { isChecked: false, label: "使用操作", uploadType: 0 },
        { isChecked: false, label: "4S金融业务", uploadType: 0 },
        { isChecked: false, label: "金融分销业务", uploadType: 0 }
      ],
      currentFeedbackContentLength: 0
    };

    this._checkBoxContainerOnPress.bind(this);
    this._checkBoxOnPress.bind(this);
    this._onCommonDialogConfirm.bind(this);
    this._funcustomConfirm.bind(this);
  }

  _checkBoxContainerOnPress = index => {
    console.warn(index, this.state);
    this.state.checkBoxGroupStatus[index].isChecked = !this.state
      .checkBoxGroupStatus[index].isChecked;

    let checkBoxEnable =
      this.state.checkBoxGroupStatus[0].isChecked |
      this.state.checkBoxGroupStatus[1].isChecked |
      this.state.checkBoxGroupStatus[2].isChecked |
      this.state.checkBoxGroupStatus[3].isChecked |
      this.state.checkBoxGroupStatus[4].isChecked |
      this.state.checkBoxGroupStatus[5].isChecked;

    let enable = this.state.feedbackContentText.length > 0 && checkBoxEnable;

    this.setState({
      commitEnable: enable
    });
  };
  _checkBoxOnPress = () => {};

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="white" />

        <Text style={styles.feedbackTypeStyle}>请选择意见反馈类型</Text>

        <View style={styles.divider} />

        <View style={styles.checkBoxGroup}>
          <View style={{ flex: 1, marginLeft: 15, marginTop: 15 }}>
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
              onPress={() => {
                this.state.checkBoxGroupStatus[0].isChecked = !this.state
                  .checkBoxGroupStatus[0].isChecked;

                let checkBoxEnable =
                  this.state.checkBoxGroupStatus[0].isChecked |
                  this.state.checkBoxGroupStatus[1].isChecked |
                  this.state.checkBoxGroupStatus[2].isChecked |
                  this.state.checkBoxGroupStatus[3].isChecked |
                  this.state.checkBoxGroupStatus[4].isChecked |
                  this.state.checkBoxGroupStatus[5].isChecked;

                let enable =
                  this.state.feedbackContentText.length > 0 && checkBoxEnable;

                this.setState({
                  commitEnable: enable
                });
              }}
            >
              <CheckBox
                style={{ borderWidth: 1 }}
                value={this.state.checkBoxGroupStatus[0].isChecked}
                onValueChange={value => {
                  let arr = this.state.checkBoxGroupStatus;
                  arr[0].isChecked = value;

                  let checkBoxEnable =
                    arr[0].isChecked |
                    arr[1].isChecked |
                    arr[2].isChecked |
                    arr[3].isChecked |
                    arr[4].isChecked |
                    arr[5].isChecked;
                  let enable =
                    this.state.feedbackContentText.length > 0 && checkBoxEnable;
                  this.setState({
                    checkBoxGroupStatus: arr,
                    commitEnable: enable
                  });
                }}
              />
              <Text>服务体验</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
              onPress={() => {
                this.state.checkBoxGroupStatus[1].isChecked = !this.state
                  .checkBoxGroupStatus[1].isChecked;
                let checkBoxEnable =
                  this.state.checkBoxGroupStatus[0].isChecked |
                  this.state.checkBoxGroupStatus[1].isChecked |
                  this.state.checkBoxGroupStatus[2].isChecked |
                  this.state.checkBoxGroupStatus[3].isChecked |
                  this.state.checkBoxGroupStatus[4].isChecked |
                  this.state.checkBoxGroupStatus[5].isChecked;

                let enable =
                  this.state.feedbackContentText.length > 0 && checkBoxEnable;
                this.setState({
                  commitEnable: enable
                });
              }}
            >
              <CheckBox
                style={{ borderWidth: 1 }}
                value={this.state.checkBoxGroupStatus[1].isChecked}
                onValueChange={value => {
                  let arr = this.state.checkBoxGroupStatus;
                  arr[1].isChecked = value;
                  let checkBoxEnable =
                    arr[0].isChecked |
                    arr[1].isChecked |
                    arr[2].isChecked |
                    arr[3].isChecked |
                    arr[4].isChecked |
                    arr[5].isChecked;
                  let enable =
                    this.state.feedbackContentText.length > 0 && checkBoxEnable;
                  this.setState({
                    checkBoxGroupStatus: arr,
                    commitEnable: enable
                  });
                }}
              />
              <Text>其他</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
              onPress={() => {
                this.state.checkBoxGroupStatus[2].isChecked = !this.state
                  .checkBoxGroupStatus[2].isChecked;
                let checkBoxEnable =
                  this.state.checkBoxGroupStatus[0].isChecked |
                  this.state.checkBoxGroupStatus[1].isChecked |
                  this.state.checkBoxGroupStatus[2].isChecked |
                  this.state.checkBoxGroupStatus[3].isChecked |
                  this.state.checkBoxGroupStatus[4].isChecked |
                  this.state.checkBoxGroupStatus[5].isChecked;

                let enable =
                  this.state.feedbackContentText.length > 0 && checkBoxEnable;
                this.setState({
                  commitEnable: enable
                });
              }}
            >
              <CheckBox
                style={{ borderWidth: 1 }}
                value={this.state.checkBoxGroupStatus[2].isChecked}
                onValueChange={value => {
                  let arr = this.state.checkBoxGroupStatus;
                  arr[2].isChecked = value;
                  let checkBoxEnable =
                    arr[0].isChecked |
                    arr[1].isChecked |
                    arr[2].isChecked |
                    arr[3].isChecked |
                    arr[4].isChecked |
                    arr[5].isChecked;
                  let enable =
                    this.state.feedbackContentText.length > 0 && checkBoxEnable;
                  this.setState({
                    checkBoxGroupStatus: arr,
                    commitEnable: enable
                  });
                }}
              />
              <Text>车源供应业务</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, marginTop: 15 }}>
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
              onPress={() => {
                this.state.checkBoxGroupStatus[3].isChecked = !this.state
                  .checkBoxGroupStatus[3].isChecked;
                let checkBoxEnable =
                  this.state.checkBoxGroupStatus[0].isChecked |
                  this.state.checkBoxGroupStatus[1].isChecked |
                  this.state.checkBoxGroupStatus[2].isChecked |
                  this.state.checkBoxGroupStatus[3].isChecked |
                  this.state.checkBoxGroupStatus[4].isChecked |
                  this.state.checkBoxGroupStatus[5].isChecked;

                let enable =
                  this.state.feedbackContentText.length > 0 && checkBoxEnable;
                this.setState({
                  commitEnable: enable
                });
              }}
            >
              <CheckBox
                style={{ borderWidth: 1 }}
                value={this.state.checkBoxGroupStatus[3].isChecked}
                onValueChange={value => {
                  let arr = this.state.checkBoxGroupStatus;
                  arr[3].isChecked = value;
                  let checkBoxEnable =
                    arr[0].isChecked |
                    arr[1].isChecked |
                    arr[2].isChecked |
                    arr[3].isChecked |
                    arr[4].isChecked |
                    arr[5].isChecked;
                  let enable =
                    this.state.feedbackContentText.length > 0 && checkBoxEnable;
                  this.setState({
                    checkBoxGroupStatus: arr,
                    commitEnable: enable
                  });
                }}
              />
              <Text>使用操作</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
              onPress={() => {
                this.state.checkBoxGroupStatus[4].isChecked = !this.state
                  .checkBoxGroupStatus[4].isChecked;
                let checkBoxEnable =
                  this.state.checkBoxGroupStatus[0].isChecked |
                  this.state.checkBoxGroupStatus[1].isChecked |
                  this.state.checkBoxGroupStatus[2].isChecked |
                  this.state.checkBoxGroupStatus[3].isChecked |
                  this.state.checkBoxGroupStatus[4].isChecked |
                  this.state.checkBoxGroupStatus[5].isChecked;

                let enable =
                  this.state.feedbackContentText.length > 0 && checkBoxEnable;
                this.setState({
                  commitEnable: enable
                });
              }}
            >
              <CheckBox
                style={{ borderWidth: 1, color: "red" }}
                value={this.state.checkBoxGroupStatus[4].isChecked}
                onValueChange={value => {
                  let arr = this.state.checkBoxGroupStatus;
                  arr[4].isChecked = value;
                  let checkBoxEnable =
                    arr[0].isChecked |
                    arr[1].isChecked |
                    arr[2].isChecked |
                    arr[3].isChecked |
                    arr[4].isChecked |
                    arr[5].isChecked;
                  let enable =
                    this.state.feedbackContentText.length > 0 && checkBoxEnable;
                  this.setState({
                    checkBoxGroupStatus: arr,
                    commitEnable: enable
                  });
                }}
              />
              <Text>4S金融业务</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
              onPress={() => {
                this.state.checkBoxGroupStatus[5].isChecked = !this.state
                  .checkBoxGroupStatus[5].isChecked;
                let checkBoxEnable =
                  this.state.checkBoxGroupStatus[0].isChecked |
                  this.state.checkBoxGroupStatus[1].isChecked |
                  this.state.checkBoxGroupStatus[2].isChecked |
                  this.state.checkBoxGroupStatus[3].isChecked |
                  this.state.checkBoxGroupStatus[4].isChecked |
                  this.state.checkBoxGroupStatus[5].isChecked;

                let enable =
                  this.state.feedbackContentText.length > 0 && checkBoxEnable;
                this.setState({
                  commitEnable: enable
                });
              }}
            >
              <CheckBox
                style={{ borderWidth: 1 }}
                value={this.state.checkBoxGroupStatus[5].isChecked}
                onValueChange={value => {
                  let arr = this.state.checkBoxGroupStatus;
                  arr[5].isChecked = value;
                  let checkBoxEnable =
                    arr[0].isChecked |
                    arr[1].isChecked |
                    arr[2].isChecked |
                    arr[3].isChecked |
                    arr[4].isChecked |
                    arr[5].isChecked;
                  let enable =
                    this.state.feedbackContentText.length > 0 && checkBoxEnable;
                  this.setState({
                    checkBoxGroupStatus: arr,
                    commitEnable: enable
                  });
                }}
              />
              <Text>金融分销业务</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.feedbackTextInputContainer}>
          <TextInput
            style={styles.feedbackTextInput}
            placeholder={"请输入您的意见反馈内容"}
            multiline={true}
            blurOnSubmit={false}
            maxLength={500}
            selectionColor={"#CCCCCC"}
            onChangeText={text => {
              //判断commit button是否高亮
              let enable =
                text.length > 0 && this.state.checkBoxGroupStatus.length > 0
                  ? true
                  : false;

              this.setState({
                feedbackContentText: text,
                currentFeedbackContentLength: text.length,
                commitEnable: enable
              });
            }}
            value={this.state.feedbackContentText}
          />
          <Text style={styles.feedbackTextInputTips}>
            {this.state.currentFeedbackContentLength}/{feedbackContentMaxLength}
          </Text>
        </View>

        <View style={styles.feedbackPhoneContainer}>
          <Image
            style={styles.feedbackPhoneImg}
            source={require("../../res/img/app_feedback_icon_phone.png")}
          />
          <TextInput
            style={{ color: "#666666" }}
            multiline={true}
            blurOnSubmit={false}
            keyboardType={"numeric"}
            selectionColor={"#CCCCCC"}
            maxLength={11}
            placeholder="非必填，请输入常用手机号"
            onChangeText={text => this.setState({ feedbackPhoneNum: text })}
            value={this.state.feedbackPhoneNum}
          />
        </View>

        <View style={styles.feedbackPhoneDiver} />

        <Text style={styles.feedbackPhoneTip}>
          留下手机号，便于我们及时与您取得联系
        </Text>
        <TouchableHighlight
          style={
            this.state.commitEnable
              ? styles.feedbackCommitEnable
              : styles.feedbackCommitDisable
          }
          disabled={this.state.commitEnable ? false : true}
          underlayColor="white"
          onPress={() => {
            this._funcustomConfirm();
          }}
        >
          <Text
            style={
              this.state.commitEnable
                ? styles.feedbackCommitTextEnable
                : styles.feedbackCommitTextDisable
            }
          >
            提交
          </Text>
        </TouchableHighlight>

        {/* 提交提示框 */}
        <CommonDialog ref="dcustomConfirm" />
      </View>
    );
  }

  //========================= 自定义方法 =================================

  //弹窗提示
  _funcustomConfirm() {
    // var options = {
    //   animationType: "none",
    //   thide: true,
    //   messText: "感谢您的宝贵建议，我们将继续努力，为您提供更好服务！",
    //   clickScreen: true,
    //   button: [this._onCommonDialogConfirm]
    // };
    var options = {
      thide: true /*不显示头部标题*/,
      // innersHeight: 160,
      messText: "感谢您的宝贵建议，我们将继续努力，为您提供更好服务！",
      messTextStyle: styles.commonDialogContentText,
      buttons: [
        {
          txt: "确定",
          txtStyle: styles.commonDialogBtnContentText,
          btnStyle: styles.commonDialogButton,
          onClick: this._onCommonDialogConfirm()
        }
      ]
    };
    this.refs.dcustomConfirm.show(options);
  }

  _onCommonDialogConfirm() {
    //TODO 调用后台接口
    this.refs.dcustomConfirm.hide();
  }

  //checkbox item点击事件
  _checkBoxItemOnPress({ index }) {
    this.state.checkBoxGroupStatus[index].isChecked = !this.state
      .checkBoxGroupStatus[index].isChecked;
    this.setState({ reRenderCheckBoxGroups: true });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    justifyContent: "flex-start",
    flexDirection: "column"
  },
  commonDialogBtnContentText: {
    color: "#F12E49",
    fontSize: 16,
    textAlign: "center",
    textAlignVertical: "center"
  },
  commonDialogContentText: {
    fontSize: 14,
    paddingLeft: 20,
    paddingRight: 12,
    color: "#666666"
  },
  commonDialogButton: {
    backgroundColor: "white",
    borderTopWidth: 1,
    height: 46,
    flex: 1,
    paddingLeft: 0,
    marginLeft: 0,
    marginRight: 0,
    paddingRight: 0,
    borderTopColor: "#F0F0F0"
  },
  feedbackPhoneContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  feedbackPhoneImg: { marginLeft: 15, height: 15, width: 15, marginRight: 11 },
  feedbackPhoneTip: {
    // flex: 1,
    marginLeft: 15,
    marginTop: 7.5,
    color: "#CCCCCC",
    fontSize: 12
  },
  feedbackCommitDisable: {
    borderRadius: 6,
    height: 42,
    position: "absolute",
    bottom: 20,
    left: 30,
    right: 30,
    backgroundColor: "#DDDDDD",
    justifyContent: "center",
    alignItems: "center"
  },
  feedbackCommitEnable: {
    borderRadius: 6,
    height: 42,
    position: "absolute",
    bottom: 20,
    left: 30,
    right: 30,
    backgroundColor: "#F12E49",
    justifyContent: "center",
    alignItems: "center"
  },
  feedbackCommitTextDisable: {
    color: "#BBBBBB",
    fontSize: 16
  },
  feedbackCommitTextEnable: {
    color: "white",
    fontSize: 16
  },
  loginOutStyle: {
    height: 39,
    marginLeft: 14,
    marginRight: 14,
    marginBottom: 21,
    borderRadius: 3,
    backgroundColor: "#F12E49",
    alignItems: "center",
    justifyContent: "center"
  },
  loginOutTextStyle: {
    color: "white",
    textAlign: "center"
  },
  backButtonStyle: { marginLeft: 20, width: 50 },
  divider: { height: 1, width: "100%", backgroundColor: "#E5E5E5" },
  feedbackPhoneDiver: {
    height: 1,
    marginLeft: 15,
    marginRight: 15,
    width: "100%",
    backgroundColor: "#E5E5E5"
  },
  feedbackTypeStyle: {
    marginLeft: 15,
    marginTop: 17,
    marginBottom: 11,
    color: "#333333",
    fontSize: 14
  },
  checkBoxGroup: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start"
  },
  checkBox: {},
  feedbackTextInputTips: { position: "absolute", bottom: 5, right: 5 },
  feedbackTextInputContainer: {
    borderRadius: 5,
    borderColor: "#E7E7E7",
    borderWidth: 1,
    margin: 15
  },
  feedbackTextInput: {
    height: 90,
    textAlignVertical: "top",
    color: "#666666",
    marginBottom: 10
  },
  button: {
    marginBottom: 30,
    width: 260,
    alignItems: "center",
    backgroundColor: "#2196F3"
  },
  buttonText: {
    padding: 20,
    color: "white"
  }
});