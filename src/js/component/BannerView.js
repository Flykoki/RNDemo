import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  PanResponder,
  Image,
  ScrollView
} from "react-native";
import PropTypes from "prop-types";
const screenWidth = Dimensions.get("window").width;
const scrollStep = 5 * 1000; //banner轮播时间间隔

export default class BannerView extends Component {
  startAutoScroll = false;
  constructor(props) {
    super(props);
    let banner = [1, 2, 3];
    this.state = {
      circleWrapperWidth: 0, //banner小圆点宽度
      currentPage: 0, //当前显示图片下标
      autoScroll: this.props.autoScroll ? this.props.autoScroll : true,
      data: this.props.data ? this.props.data : banner //banner图片数组
    };
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      // 要求成为响应者：
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        // 开始手势操作。给用户一些视觉反馈，让他们知道发生了什么事情！
        // gestureState.{x,y} 现在会被设置为0
        console.log("lfj panresponder grant");
      },
      onPanResponderMove: (evt, gestureState) => {
        console.log(
          "lfj panresponder move",
          gestureState.moveY,
          gestureState.moveX
        );

        // 最近一次的移动距离为gestureState.move{X,Y}
        // 从成为响应者开始时的累计手势移动距离为gestureState.d{x,y}
        // let margin = gestureState.moveY - this.state.pageY;
        // let index = Math.floor(margin / 16);
        // index =
        //   index > -1
        //     ? index < rightIndex.length
        //       ? index
        //       : rightIndex.length - 1
        //     : 0;
        // margin = index * 16 - 17;
        // this.setState({
        //   pressed: true,
        //   currentLetter: rightIndex[index].title,
        //   currentIndex: index,
        //   position:
        //     margin > -17
        //       ? margin > this.state.height - 33
        //         ? this.state.height - 33
        //         : margin
        //       : -17
        // });
        // this.props.onScroll(index);
      },

      onPanResponderTerminationRequest: (evt, gestureState) => false,
      onPanResponderRelease: (evt, gestureState) => {},
      onPanResponderTerminate: (evt, gestureState) => {
        // 另一个组件已经成为了新的响应者，所以当前手势将被取消。
        console.log("lfj panresponder terminate");
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // 返回一个布尔值，决定当前组件是否应该阻止原生组件成为JS响应者
        // 默认返回true。目前暂时只支持android。
        return true;
      }
    });
  }

  componentDidMount() {
    if (this.state.autoScroll) {
      this._startTimer();
    }
  }
  //启动定时器轮播
  _startTimer = () => {
    this.timer = setInterval(() => {
      var currentPage =
        ++this.state.currentPage == this.state.data.length
          ? 0
          : this.state.currentPage;
      this &&
        this.scrollView &&
        this.scrollView.scrollTo({
          x: currentPage * screenWidth,
          y: 0,
          animated: true
        });

      this.setState({ currentPage: currentPage });
    }, scrollStep);
  };
  render() {
    return (
      <View
        // {...this._panResponder.panHandlers}
        style={[styles.banner, this.props.style]}
      >
        <ScrollView
          ref={f => (this.scrollView = f)}
          horizontal={true}
          {...this.props}
          onScrollBeginDrag={e => this._handleScrollBegin(e)}
          onScrollEndDrag={e => this._handleScrollEnd(e)}
          // 当一帧滚动结束
          onMomentumScrollEnd={e => this._onAnimationEnd(e)}
          //   onScroll={e => this._onScroll(e)}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          onStartShouldSetPanResponderCapture={e => true}
          onStartShouldSetPanResponder={e => true}
          onMoveShouldSetPanResponder={e => true}
          onMoveShouldSetPanResponderCapture={e => true}
          onPanResponderTerminationRequest={e => false}
        >
          {this._renderBannerItems()}
        </ScrollView>
        <View
          style={[
            styles.circleWrapperStyle,
            { left: this.state.circleWrapperWidth }
          ]}
          onLayout={e => this._onCircleWrapperLayout(e)}
        >
          {this._renderCircle()}
        </View>
      </View>
    );
  }
  //  当一帧滚动结束的时候调用
  _onAnimationEnd(e) {
    // 1.求出水平方向的偏移量
    var offSetX = e.nativeEvent.contentOffset.x;

    // 2.求出当前的页数
    var currentPage = Math.floor(Math.ceil(offSetX) / Math.floor(screenWidth));

    // 3.更新状态机,重新绘制UI
    this.setState({
      currentPage: currentPage
    });
  }

  //开始拖拽
  _handleScrollBegin = e => {
    clearInterval(this.timer);
  };
  //停止拖拽
  _handleScrollEnd = e => {
    if (this.state.autoScroll) {
      this._startTimer();
    }
  };
  //banner滑动时候
  _onScroll = e => {
    var x = e.nativeEvent.contentOffset.x;
    console.log("lfj onScroll", x, screenWidth, e.nativeEvent);
    if (x % screenWidth === 0) {
      this.setState({ currentPage: x / screenWidth });
    }
  };

  //获取banner底部小红点宽度
  _onCircleWrapperLayout = event => {
    let { x, y, width, height } = event.nativeEvent.layout;
    this.setState({
      circleWrapperWidth: (screenWidth - Math.round(width)) / 2
    });
  };

  //渲染banner item
  _renderBannerItems = () => {
    return this.state.data.map((item, index) => {
      return (
        <TouchableOpacity
          style={{ width: screenWidth }}
          activeOpacity={1}
          onPress={() => {
            this.props.onBannerItemPress
              ? this.props.onBannerItemPress(item, index)
              : console.warn("banner item on press", item, index);
          }}
        >
          <Image
            style={styles.banner}
            source={
              item.banner
                ? { uri: item.banner }
                : require("../../res/img/app_strategy_banner.png")
            }
            resizeMode={"stretch"}
          />
        </TouchableOpacity>
      );
    });
  };
  //绘制圆点
  _renderCircle = () => {
    return this.state.data.map((item, i) => {
      return (
        <Text
          key={`item${i}`}
          style={
            i === this.state.currentPage
              ? styles.bannerItemShow
              : styles.bannerItemHide
          }
        >
          •
        </Text>
      );
    });
  };
}

BannerView.propTypes = {
  data: PropTypes.array, //banner图片 require('url')形式
  autoScroll: PropTypes.bool, //banner 是否自动轮播
  onBannerItemPress: PropTypes.func, //banner item 点击事件回调
  style: PropTypes.object //banner样式
};

const styles = StyleSheet.create({
  banner: {
    width: screenWidth,
    height: 172
  },
  bannerItemShow: { fontSize: 40, color: "red" },
  bannerItemHide: { fontSize: 40, color: "grey" },
  circleWrapperStyle: {
    flexDirection: "row",
    padding: 0,
    backgroundColor: "transparent",
    bottom: 0,
    position: "absolute"
  }
});
