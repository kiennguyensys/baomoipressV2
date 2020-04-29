import React from 'react';
import { Text, View, Linking, AsyncStorage, Keyboard, ScrollView, TextInput, Dimensions, WebView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, TouchableNativeFeedback, Platform, Share, Image, Modal, Animated, Switch, InteractionManager, ActivityIndicator, RefreshControl } from 'react-native';
import HTML from 'react-native-render-html';
import AuthorSubscription from './AuthorSubscription';
import { connect } from 'react-redux';
import {
    toggleLightMode,
    toggleDarkMode,
    resizeToSmallText,
    resizeToMediumText,
    resizeToLargeText
} from '../../store/actions/UIActions.js'
import {Icon, Divider} from 'react-native-elements';
import BackIcon from '../BackIcon'
import TouchableNativeOS from '../TouchableNativeOS'
import moment from 'moment/min/moment-with-locales'
import axios from 'axios';
import { Viewport } from '@skele/components';
import { BaomoiText } from '../StyledText';
import { customFont } from '../../constants/Fonts.js'
import { api_url } from '../../constants/API.js';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
moment.locale('vi');

HEADER_MAX_HEIGHT = 100;
HEADER_MIN_HEIGHT = 50;

class ArticleHeader extends React.Component {
    constructor(props){
       super(props)
       this.state = {
           scrollY: new Animated.Value(0),
           TopViewHeight: 100,
           settingModalVisible: false,
       }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.cancelTokenSource = axios.CancelToken.source()
        })
    }

    alterChildren = (node) => {
        if (node.name === 'iframe') {
            delete node.attribs.width;
            delete node.attribs.height;
        }
        return node.children;
    }

    navigateBack = () => {
        requestAnimationFrame(() => {
           this.props.navigation.goBack()
        })
    }

    componentWillUnmount() {
        this.cancelTokenSource && this.cancelTokenSource.cancel()
    }

    resizeToSmallText = () => {
        this.props.resizeToSmallText()
        AsyncStorage.setItem("textSize", "small")
    }

    resizeToMediumText = () => {
        this.props.resizeToMediumText()
        AsyncStorage.setItem("textSize", "medium")
    }

    resizeToLargeText = () => {
        this.props.resizeToLargeText()
        AsyncStorage.setItem("textSize", "large")
    }

    switchMode = (newVal) => {
        if (newVal){
            this.props.toggleDarkMode()
            AsyncStorage.setItem("theme", "dark")
        }
        else {
            this.props.toggleLightMode()
            AsyncStorage.setItem("theme", "light")
        }
    }

    handleOnScroll = (e) => {
    }


    render(){

      const { textColor, backgroundColor, textSizeRatio, isDarkMode } = this.props.UI

      return(
        <View >
          <Animated.View style={{
                                  position:'absolute',
                                  right: 0,
                                  left: 0,
                                  height: 40,
                                  zIndex: 1,
                                  backgroundColor: backgroundColor,
                                  alignItems:'center',
                                  flexDirection: "row",
                                  flex: 1,
                                  borderBottomWidth: 0.5,
                                  borderBottomColor: '#e0e0e0'
                                  }}>
              <View style={{flex: 1, alignItems:'center', justifyContent: 'center'}}>
                <BackIcon style={{justifyContent: 'center', overflow: 'hidden', width: 40, height: 40, borderRadius : 40/2}} onPress={this.navigateBack} />
              </View>
              <Animated.View style={{opacity: (this.props.article && this.props.article.format === 'video') ? 1 : this.props.headerSource, flex: 5}}>
                { (this.props.article) && <AuthorSubscription taxonomy_source={this.props.article.taxonomy_source[0]} onHeader={true} navigation={this.props.navigation}/> }
              </Animated.View>

              <TouchableOpacity style={{flex:1, alignItems: 'center', justifyContent: 'center'}} onPress={()=>this.setState({settingModalVisible: true})} >
                        <Icon
                          name='dots-three-vertical'
                          type='entypo'
                          size={22}
                          color='#696969'
                          style={{marginRight: 5}}
                        />


                <Modal
                   transparent={true}
                   visible={this.state.settingModalVisible}
                   onRequestClose={() => {}}
                   >
                    <TouchableOpacity style={{backgroundColor: 'rgba(0,0,0,0.5)',flex: 1, alignItems:'flex-end'}} onPress={()=>this.setState({settingModalVisible: false})} activeOpacity={1}>
                             <View style={{
                                           height: 180,
                                           width: 180,
                                           backgroundColor: 'white',
                                           justifyContent:'center',
                                           marginTop: 50,
                                           marginRight: 10,
                                           borderRadius: 10
                                         }}>
                                  <View style={{flexDirection:'row', height: 90}}>
                                      <TouchableOpacity style={{flex:1, borderRightColor:'#696969',borderRightWidth: 1, alignItems:'center', justifyContent:'center'}} onPress={this.resizeToSmallText}>
                                        <BaomoiText style={{fontSize: 12}}>Aa</BaomoiText>
                                      </TouchableOpacity>
                                      <TouchableOpacity style={{flex:1, borderRightColor:'#696969',borderRightWidth: 1, alignItems:'center', justifyContent:'center'}} onPress={this.resizeToMediumText}>
                                        <BaomoiText style={{fontSize: 16}}>Aa</BaomoiText>
                                      </TouchableOpacity>
                                      <TouchableOpacity style={{flex:1, alignItems:'center', justifyContent:'center'}} onPress={this.resizeToLargeText}>
                                        <BaomoiText style={{fontSize: 20, fontWeight: '500'}}>Aa</BaomoiText>
                                      </TouchableOpacity>
                                  </View>
                                  <Divider style={{backgroundColor:'#696969'}}/>
                                  <View style={{flexDirection:'row', height: 90, alignItems:'center', justifyContent:'space-between', padding: 5}}>
                                  <BaomoiText style={{fontSize: 16}}>Đọc ban đêm</BaomoiText>
                                  <Switch
                                      onValueChange={this.switchMode}
                                      value={isDarkMode}
                                  />
                                  </View>

                              </View>

                    </TouchableOpacity>
                </Modal>
              </TouchableOpacity>
          </Animated.View>

        </View>


        );
    }
};

const mapStateToProps = (state) => {
    return {
        UI: state.UI,
        user: state.session.user
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        toggleLightMode: () => {dispatch(toggleLightMode())},
        toggleDarkMode: () => {dispatch(toggleDarkMode())},
        resizeToSmallText : () => {dispatch(resizeToSmallText())},
        resizeToMediumText : () => {dispatch(resizeToMediumText())},
        resizeToLargeText : () => {dispatch(resizeToLargeText())},
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ArticleHeader)


