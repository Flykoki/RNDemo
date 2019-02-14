import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Modal,
  CheckBox,
  Text,
  TextInput,
  Dimensions,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  StatusBar
} from "react-native";

const width = Dimensions.get("window").width;

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
    this.state = { feedbackContentText: "", feedbackPhoneNum: "" };
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="white" />

        <Text style={styles.feedbackTypeStyle}>请选择意见反馈类型</Text>

        <View style={styles.divider} />

        <View style={styles.checkBoxGroup}>
          <View style={{ flex: 1, marginLeft: 15, marginTop: 15 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <CheckBox style={{ borderWidth: 1 }} />
              <Text>服务体验</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <CheckBox style={{ borderWidth: 1 }} />
              <Text>其他</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <CheckBox style={{ borderWidth: 1 }} />
              <Text>车源供应业务</Text>
            </View>
          </View>
          <View style={{ flex: 1, marginTop: 15 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <CheckBox style={{ borderWidth: 1 }} />
              <Text>使用操作</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <CheckBox style={{ borderWidth: 1 }} />
              <Text>4S金融业务</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <CheckBox style={{ borderWidth: 1 }} />
              <Text>金融分销业务</Text>
            </View>
          </View>
        </View>

        <TextInput
          style={styles.feedbackTextInput}
          placeholder={"请输入您的意见反馈内容"}
          multiline={true}
          blurOnSubmit={false}
          maxLength={500}
          selectionColor={"#CCCCCC "}
          onChangeText={text => this.setState({ feedbackContentText: text })}
          value={this.state.feedbackContentText}
        />

        <View style={styles.feedbackPhoneContainer}>
          <Image
            style={styles.feedbackPhoneImg}
            source={require("../../res/img/app_feedback_icon_phone.png")}
          />
          <TextInput
            style={{ blurOnSubmit: false, color: "#666666" }}
            multiline={true}
            blurOnSubmit={false}
            keyboardType={"numeric"}
            selectionColor={"#CCCCCC "}
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
          style={styles.feedbackCommit}
          underlayColor="#DDDDDD"
          onPress={() =>
            console.warn(
              this.state.feedbackContentText,
              this.state.feedbackPhoneNum
            )
          }
        >
          <Text style={styles.feedbackCommitText}>提交</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    justifyContent: "flex-start",
    flexDirection: "column"
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
  feedbackCommit: {
    borderRadius: 6,
    height: 42,
    position: "absolute",
    bottom: 20,
    left: 30,
    right: 30,
    // backgroundColor: "#DDDDDD",
    backgroundColor: "#F12E49",
    justifyContent: "center",
    alignItems: "center"
  },
  feedbackCommitText: {
    color: "#BBBBBB",
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
  feedbackTextInput: {
    height: 90,
    textAlignVertical: "top",
    borderColor: "#E7E7E7",
    color: "#666666",
    borderRadius: 5,
    borderWidth: 1,
    margin: 15
  }
});
