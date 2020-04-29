import React from 'react';
import { Text, View, Linking, AsyncStorage, Keyboard, ScrollView, TextInput, Dimensions, WebView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, TouchableNativeFeedback, Platform, Share, Image, Modal, Animated, Switch, InteractionManager, ActivityIndicator, RefreshControl } from 'react-native';

import ArticleHeader from '../components/ArticleContent/ArticleHeader';
import AuthorSubscription from '../components/ArticleContent/AuthorSubscription';
import CommentModal from '../components/Modals/CommentModal';
import StandardArticle from '../components/ArticleContent/StandardArticle';
import VideoPlay from '../components/ArticleContent/VideoPlay'
import { connect } from 'react-redux';
import { Viewport } from '@skele/components';
import { NavigationEvents } from 'react-navigation';
import moment from 'moment/min/moment-with-locales'
import axios from 'axios';
import { BaomoiText } from '../components/StyledText';
import { customFont } from '../constants/Fonts.js'
import { api_url } from '../constants/API.js';
import { checkPreviousSessionReadingCounting, saveCurrentReadingCounting, stopArticleReadingTimer } from '../store/actions/timerActions.js';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
moment.locale('vi');

class ArticleScreen extends React.Component {
    _isMounted = false;
    _timer = null;
    constructor(props){
       super(props)

       this._scrollView = null

       this.state = {
           Article: undefined,
           scrollY: new Animated.Value(0),
           refreshing: false,
           TopViewHeight: 100,
           settingModalVisible: false,
           commentModalVisible: false,
           commentParent: 0,
           isCurrentFocused: false,
       }
    }


    static navigationOptions = ({navigation}) => {
        return {
            title: "Article",
            tabBarVisible: false,
            headerShown: false,
            gestureDirection: 'horizontal'
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this._isMounted = true;
            this.cancelTokenSource = axios.CancelToken.source()
            this.setState({ Article: this.props.navigation.getParam('Article') }, () => {
                this.updateArticle() //prevent staled data
                this.getReadingTimer()
            })
        })
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (this.state.Article !== nextState.Article ||
                this.state.TopViewHeight !== nextState.TopViewHeight || this.state.settingModalVisible !== nextState.settingModalVisible ||
                this.state.commentModalVisible !== nextState.commentModalVisible || this.state.commentParent !== nextState.commentParent ||
                this.state.isCurrentFocused !== nextState.isCurrentFocused ||
                this.props.user !== nextProps.user || this.props.UI !== nextProps.UI || this.props.articleReadingInterval !== nextProps.articleReadingInterval)
    }

    getReadingTimer = () => {
        if(!this.props.articleReadingInterval){
            this.props.checkPreviousSessionReadingCounting()
            this._timer = true
        }
    }

    setCommentModalVisible = (visible, parent) => {
        if(this._isMounted) this.setState({commentModalVisible: visible, commentParent: parent})
    }

    handleRefresh = () => {
        this.setState({ refreshing: true })
        this.updateArticle()
    }

    updateArticle = (article) => {
        if(article) this.setState({Article : article})
        else {
            axios.get(api_url + "posts/" + this.state.Article.id.toString(), {
                cancelToken: this.cancelTokenSource.token
            })
                .then(res => this.setState({Article: res.data, refreshing: false }))
                .catch(err => console.log(err))
        }
    }

    setScrollViewRef = (ref) => {
        this._scrollView = ref
    }

    scrollToEnd = () => {
        const articleFormat = this.state.Article.format
        if(articleFormat === 'standard') this._scrollView.getNode().scrollToEnd()
        if(articleFormat === 'video') this._scrollView.scrollToEnd()
    }

    componentWillUnmount() {
      // use intervalId from the state to clear the interval

        this._isMounted = false;
        if(this._timer) {
            this.props.saveCurrentReadingCounting()
            this.props.stopArticleReadingTimer(this.props.articleReadingInterval)
        }

        this.cancelTokenSource && this.cancelTokenSource.cancel()
    }

    render(){
      const headerSource = this.state.scrollY.interpolate({
        inputRange: [0, this.state.TopViewHeight-10, this.state.TopViewHeight -9],
        outputRange: [0, 0 , 1],
        extrapolate: 'clamp',
      })
      const { textColor, backgroundColor, textSizeRatio, isDarkMode } = this.props.UI

      return(
        <View style={{backgroundColor: backgroundColor, flexDirection:'column', flex: 1}}>
            <NavigationEvents
                onDidFocus={payload => this.setState({ isCurrentFocused: true })}
                onDidBlur={payload => this.setState({ isCurrentFocused: false })}
              />

            <ArticleHeader headerSource={headerSource} navigation={this.props.navigation} article={this.state.Article} />

            {(!this.state.Article && !this.props.navigation.getParam('isVideo')) && <View style={{ flex: 1, justifyContent: 'center' }}><ActivityIndicator size="large" /></View>}

            {(this.state.Article && this.state.Article.format === 'standard') &&
             <Viewport.Tracker>
               <Animated.ScrollView ref={ref => this.setScrollViewRef(ref)} style={{ backgroundColor: backgroundColor , marginTop: 40}}
                                scrollEventThrottle={16}
                                onScroll={Animated.event(
                                [{nativeEvent: {contentOffset: {y: this.state.scrollY}}}],
                                )}>


                    <View onLayout={(event) => {
                                      var {x, y, width, height} = event.nativeEvent.layout;
                                      this.setState({TopViewHeight : height})
                                    }} >
                        <View style={{padding: 10}}>
                          <Text style={{fontSize: 24*textSizeRatio, fontFamily: customFont, lineHeight: 35*textSizeRatio, fontWeight: 'bold', color: textColor, marginBottom: 5}}>{this.state.Article.title.plaintitle}</Text>


                          <AuthorSubscription taxonomy_source={this.state.Article.taxonomy_source[0]} onHeader={false} moment={moment(this.state.Article.modified).fromNow().replace("trước", "").replace("một", "1")} navigation={this.props.navigation}/>
                        </View>
                     </View>
                    <StandardArticle navigation={this.props.navigation} article={this.state.Article} setCommentModalVisible={this.setCommentModalVisible} isCurrentFocused={this.state.isCurrentFocused} />
               </Animated.ScrollView>
             </Viewport.Tracker>
            }

            {(!this.state.Article && this.props.navigation.getParam('isVideo')) &&
             <View style={{ flex: 1 }}>
                <View style={{position: 'absolute', top: 40-1, backgroundColor:'black', width: screenWidth, height: screenWidth * 9/16 + 1, alignItems:'center', justifyContent:'center'}}>
                    <ActivityIndicator size="small" />
                </View>
             </View>
            }

            {(this.state.Article && this.state.Article.format === 'video') &&
              <VideoPlay setScrollViewRef={this.setScrollViewRef} navigation={this.props.navigation} article={this.state.Article} updateArticle={this.updateArticle} setCommentModalVisible={this.setCommentModalVisible} isCurrentFocused={this.state.isCurrentFocused} />
            }

            <CommentModal article={this.state.Article} updateArticle={this.updateArticle} commentParent={this.state.commentParent} modalVisible={this.state.commentModalVisible} setModalVisible={this.setCommentModalVisible} scrollToEnd={this.scrollToEnd} navigation={this.props.navigation} isCurrentFocused={this.state.isCurrentFocused} />
        </View>

        );
    }
};

const mapStateToProps = (state) => {
    return {
        UI: state.UI,
        user: state.session.user,
        articleReadingInterval: state.timer.articleReadingInterval,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        checkPreviousSessionReadingCounting: () => {dispatch(checkPreviousSessionReadingCounting())},
        saveCurrentReadingCounting: () => {dispatch(saveCurrentReadingCounting())},
        stopArticleReadingTimer: (interval) => {dispatch(stopArticleReadingTimer(interval))}
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ArticleScreen)


