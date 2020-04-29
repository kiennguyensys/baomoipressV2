import React, { Component } from 'react';
import { Platform, Text, View, Image, Animated, StyleSheet, Dimensions, TouchableOpacity, Easing, SafeAreaView } from 'react-native';
import { createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator, BottomTabBar} from 'react-navigation-tabs';
import ArticleScreen from '../../screens/ArticleScreen';
import TabBarIcon from '../TabBarIcon';

import SearchScreen from '../../screens/SearchScreen';
import { Icon } from 'react-native-elements';
import UserProfile from '../../screens/DrawerScreen/UserProfileScreen';
import VideoScreen from '../../screens/VideoScreen';
import CustomBottomTabBar from '../CustomBottomTabBar';
import UserProfileEdit from '../../screens/DrawerScreen/UserProfileEditScreen';
import HomeTabNavigator from './HomeTabNavigator';
import Header from '../Header.js';
import FollowingScreen from '../../screens/DrawerScreen/FollowingScreen';
import WebViewScreen from '../../screens/WebViewScreen';
import SourceScreen from '../../screens/SourceScreen';
import NotificationScreen from '../../screens/DrawerScreen/NotificationScreen';
import NotificationDetail from '../../screens/DrawerScreen/NotificationsDetail';
import TermsScreen from '../../screens/DrawerScreen/TermsScreen';
import ExchangeGiftsScreen from '../../screens/DrawerScreen/ExchangeGiftsScreen';
import ExchangeHistoryScreen from '../../screens/DrawerScreen/ExchangeHistoryScreen';
import NotificationsDetail from '../../screens/DrawerScreen/NotificationsDetail';
import PhoneAuthScreen from '../../screens/DrawerScreen/PhoneAuthScreen';
import { ShareDialog } from 'react-native-fbsdk';

var { width, height } = Dimensions.get('window');
const baomoi_app_url = (Platform.OS == 'android') ? 'https://play.google.com/store/apps/details?id=app.baomoi.press' : ''

const ArticleStack = createStackNavigator({
  Article: ArticleScreen,
}, {
  headerMode: 'screen',
  defaultNavigationOptions: {
    gestureEnabled: true
  }
});

const HomeStack = createStackNavigator({
  Home: {
      screen: HomeTabNavigator,
      navigationOptions: ({ navigation }) => ({
        header: () => <Header navigation={navigation} shouldHaveDivider={false}/>
      }),
  },
  Article: {
      screen: ArticleScreen,
      navigationOptions: {
          gestureEnabled: true,
      }
  },
  Search: SearchScreen,
  WebView: WebViewScreen,
  UserProfile: UserProfile,
  UserProfileEdit: UserProfileEdit,
  Following: FollowingScreen,
  Notifications: NotificationScreen,
  NotificationDetail: NotificationDetail,
  ExchangeGifts: ExchangeGiftsScreen,
  Source: SourceScreen,
  Terms: TermsScreen,
  PhoneAuth: PhoneAuthScreen,
  ExchangeHistory: ExchangeHistoryScreen
}, {
  headerMode: 'screen',
});

HomeStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }
  return {
    tabBarLabel: 'Home',
    tabBarIcon: ({ focused }) => {
      var footerHeight;
      if (focused) {
        footerHeight = 1;
        opacity = 1;
      } else {
        footerHeight = 0;
        opacity = 0.7;
      }

      var styles = StyleSheet.create({
        tab: {
          flexGrow: 1,
          alignItems: 'stretch',
          justifyContent: 'center'
        },
        labelFooter: {
          height: footerHeight,
          backgroundColor: 'red'
        }
      });
      return (
        <View style={styles.tab}>
          <Text style={{color: 'white', opacity: opacity, fontSize: 20, fontWeight: "bold"}}>Home</Text>
          <View style={styles.labelFooter}/>
        </View>
      );
    },
    tabBarVisible,
    animationEnabled: false,
    transitionSpec: {
        duration: 0,
	    timing: 0
    }
  }
};

const VideoStack = createStackNavigator({
  Video: {
      screen: VideoScreen,
      navigationOptions: ({ navigation }) => ({
        header: () => <Header navigation={navigation} shouldHaveDivider={true}/>,
      }),
  },
  Article: ArticleScreen,
  Search: SearchScreen,
  UserProfile: UserProfile,
  UserProfileEdit: UserProfileEdit,
}, {
  headerMode: 'screen',
});


VideoStack.navigationOptions = ({ navigation }) => {

  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }
  return {
    tabBarLabel: 'Video',
    tabBarIcon: ({ focused }) => {
      var footerHeight, opacity;

      if (focused ) {
        footerHeight = 1;
        opacity = 1;
      } else {
        footerHeight = 0;
        opacity = 0.7;
      }

      var styles = StyleSheet.create({
        tab: {
          alignItems: 'stretch',
          justifyContent: 'center',
          flexGrow: 1,
        },
        labelFooter: {
          height: footerHeight,
          backgroundColor: 'red'
        }
      });
      return (
        <View style={styles.tab}>
          <Text style={{color: 'white', opacity: opacity, fontSize: 20, fontWeight: "bold"}}>Video</Text>
          <View style={styles.labelFooter}/>
        </View>
    )
    },
    tabBarVisible,
    animationEnabled: false,
    transitionSpec: {
        duration: 0,
	    timing: 0
    }
  }
};



const TAB_BAR_OFFSET = (Platform.OS == 'android') ? 38 : 38;

class TabBarComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      offset: new Animated.Value(0),
      animating: false,
      left: new Animated.Value(width/2),
      bottom: new Animated.Value(30),
      bottomCenter: new Animated.Value(30),
      shouldRenderExpandedScreen: false
    };
  }

  componentDidUpdate(prevProps) {

    const oldState = prevProps.navigation.state;
    const oldRoute = oldState.routes[oldState.index];

    if(oldRoute.index === undefined) {
        this.props.navigation.navigate("Home")
        return
    }

    var oldParams = oldRoute.routes[oldRoute.index].params;
    if(oldState.index === 0)
    {
        const oldRouteChild = oldRoute.routes[oldRoute.index]
        oldParams = oldRouteChild.routes[oldRouteChild.index].params;
    }
    const wasVisible = !oldParams || oldParams.visible;



    const newState = this.props.navigation.state;
    const newRoute = newState.routes[newState.index];

    if(newRoute.index === undefined) {
        this.props.navigation.navigate("Home")
        return
    }
    var newParams = newRoute.routes[newRoute.index].params;

    if(newState.index === 0)
    {
        const newRouteChild = newRoute.routes[newRoute.index]
        newParams = newRouteChild.routes[newRouteChild.index].params;
    }

    const isVisible = !newParams || newParams.visible;
    const isClickedHomeBtn = newState.routes[1].params.onClickBtn;
    const wasClickedHomeBtn = oldState.routes[1].params.onClickBtn;

    if (wasVisible && !isVisible && !isClickedHomeBtn) {
      requestAnimationFrame(() => {
         Animated.timing(this.state.offset, { toValue: TAB_BAR_OFFSET, duration: 500, useNativeDriver: true}).start();
      })
    } else if (isVisible && !wasVisible) {
      requestAnimationFrame(() => {
         Animated.timing(this.state.offset, { toValue: 0, duration: 500, useNativeDriver: true}).start();
      })
    }

    if(!wasClickedHomeBtn && isClickedHomeBtn && isVisible) requestAnimationFrame(this.animating)
    if(wasClickedHomeBtn && !isClickedHomeBtn) this.setState({ shouldRenderExpandedScreen: false })
  }

  animating = () => {

    this.setState({
      left:  new Animated.Value(width/2),
      right: new Animated.Value(width/2),
      bottom: new Animated.Value(30),
      bottomCenter:new Animated.Value(30),
      shouldRenderExpandedScreen: true })


    requestAnimationFrame(() => {
      Animated.timing(this.state.left, {
        toValue: width/2 + 100,
        duration: 300,
        easing: Easing.linear,
      }).start();

      Animated.timing(this.state.right, {
        toValue: width/2 - 150,
        duration: 300,
        easing: Easing.linear,
      }).start();

      Animated.timing(this.state.bottom, {
        toValue: -150,
        duration: 300,
        easing: Easing.linear,
      }).start();
      Animated.timing(this.state.bottomCenter, {
        toValue: -250,
        duration: 300,
        easing: Easing.linear,
      }).start();


    })

  }

  onShareApp = () => {
      const shareLinkContent = {
          contentType: 'link',
          contentUrl: baomoi_app_url,
          contentDescription: 'Cùng đọc tin tức hot và được cộng xu từ Báo mới Press. Bình chọn app tại đây: ',
      };

      // Share the link using the share dialog.

      ShareDialog.canShow(shareLinkContent).then(
          function(canShow) {
              if (canShow) {
                  return ShareDialog.show(shareLinkContent);
              }
          }
      ).then(
          function(result) {
              if (result.isCancelled) {
                  console.log('Share cancelled');
              } else {
                  console.log('Share success');
              }
          },
          function(error) {
              console.log('Share fail with error: ' + error);
          }
      );
  }

  render() {

    const blackScreen = (this.state.shouldRenderExpandedScreen) ? <View style={styles.overlayscreen}></View> : <View></View>
    const expandedView = (this.state.shouldRenderExpandedScreen) ?
                                    <Animated.View>
                                        <Animated.View style={{
                                                                    transform: [{ translateY: this.state.bottom}, { translateX: this.state.right }],
                                                                     position:'absolute',
                                                                     zIndex: 2
                                                                    }}>
                                          <TouchableOpacity onPress={()=> this.props.navigation.navigate('Notifications') } style={{alignItems: 'center', width: 70, height: 70, borderRadius: 70/2}}>
                                            <View style={styles.IconView}>
                                                <Icon name={"notifications"} size={25} color={"#fff"} style={styles.buttonIcon}  />
                                            </View>
                                            <Text style={styles.iconText}>Thông báo</Text>
                                          </TouchableOpacity>

                                        </Animated.View>

                                        <Animated.View style={{
                                                               transform: [{ translateY: this.state.bottom }, { translateX: this.state.left }],
                                                               position:'absolute',
                                                               zIndex: 2
                                                               }}>
                                           <TouchableOpacity onPress={this.onShareApp} style={{alignItems: 'center', width: 70, height: 70, borderRadius: 70/2}}>
                                             <View style={styles.IconView}>
                                                <Icon name={"share"} size={20} color={"#fff"} style={styles.buttonIcon}  />
                                             </View>
                                             <Text style={styles.iconText}>Chia sẻ</Text>
                                           </TouchableOpacity>
                                        </Animated.View>

                                        <Animated.View style={{
                                                                    transform: [{ translateY: this.state.bottomCenter }],
                                                                    left: width/2-30,
                                                                    position:'absolute',
                                                                    zIndex: 2,

                                                                    }}>
                                          <TouchableOpacity onPress={()=> this.props.navigation.openDrawer()} style={{alignItems: 'center',width: 70, height: 70, borderRadius: 70/2}}>
                                            <View style={styles.IconView}>
                                                <Icon
                                                    type="material-community"
                                                    name="coin"
                                                    color="#fff"
                                                    size={30}
                                                    style={styles.buttonIcon}
                                                />
                                            </View>
                                            <Text style={styles.iconText}>Xu</Text>
                                          </TouchableOpacity>
                                        </Animated.View>
                                </Animated.View> : <Animated.View></Animated.View>
    return (
        <SafeAreaView>
            {blackScreen}
            {expandedView}
            <BottomTabBar {...this.props} style={[styles.container, { transform: [{ translateY: this.state.offset }] }]}/>
        </SafeAreaView>
    );
  }
}

const styles = {
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: 'black',
    height: 38,
    zIndex: 1
  },
  overlayscreen:{
    backgroundColor:'black',
    opacity: 0.8,
    width: width,
    height:height-70,
    right: 0,
    bottom: 0,
    justifyContent:'center',
    zIndex: 0,
    position:'absolute'
},
    buttonIcon: {
      textAlign: "center",
    },
    IconView:{
      backgroundColor:'#CC0000',
       width: 40,
       height:40,
       borderRadius: 40/2,
       justifyContent:'center',

    },
    iconText: {
      fontSize: 12,
      color: '#fff',
      fontWeight: 'bold',
    }
};

export default createBottomTabNavigator({
    Home: HomeStack,
    MultiBar: {
        screen: () => null,
        navigationOptions: ({navigation}) => ({
            tabBarIcon: () => (
                <CustomBottomTabBar navigation={navigation}/>
            )
        }),
        params: {
            navigationDisabled: true
        }
    }, Video: VideoStack

}, {
  tabBarComponent: props =>
    <TabBarComponent
      {...props}
    />,
    tabBarOptions: {
    showLabel: false,

  },

});
