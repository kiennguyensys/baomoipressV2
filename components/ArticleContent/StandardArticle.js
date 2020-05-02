import React from 'react';
import { Text, View, Linking, AsyncStorage, Keyboard, ScrollView, TextInput, Dimensions, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, TouchableNativeFeedback, Platform, Share, Image, Modal, Animated, Switch, InteractionManager, ActivityIndicator, RefreshControl } from 'react-native';
import HTML from 'react-native-render-html';
import WebView from 'react-native-webview';
import CommentList from './CommentList';
import RecommendedList from './RecommendedList';
import { connect } from 'react-redux';
import {Icon, Divider} from 'react-native-elements';
import moment from 'moment/min/moment-with-locales'
import axios from 'axios';
import { BaomoiText } from '../StyledText';
import Ads from '../Ads/Ads.js';
import { NavigationEvents } from 'react-navigation';
import { customFont } from '../../constants/Fonts.js'
import { api_url } from '../../constants/API.js';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
moment.locale('vi');

class StandardArticle extends React.Component {
    constructor(props){
       super(props)
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.cancelTokenSource = axios.CancelToken.source()
        })
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(this.props.UI !== nextProps.UI) this.triggerHTMLUpdate()

        return true
    }

    openWebView = (link) => {
        this.props.navigation.navigate("WebView", { uri: link })
    }


    alterChildren = (node) => {
        if (node.name === 'iframe') {
            delete node.attribs.width;
            delete node.attribs.height;
        }
        return node.children;
    }

    alterData = (node) => {
        let { parent, data } = node;
        if (parent && parent.name === 'img') {
            // Texts elements are always children of wrappers, this is why we check the tag
            // with "parent.name" and not "name"
            return data.toUpperCase();
        }
        // Don't return anything (eg a falsy value) for anything else than the <h1> tag so nothing is altered
    }

    getMiddleContentPosition = () => {
        const string = this.props.article.content.plaintext
        if(string.length){
            var middle_position = Math.floor(string.length /2)
            var match = /\r|\n/.exec(string.slice(middle_position));
            return (middle_position + match.index)
        } else return 0
    }

    componentWillUnmount() {
        this.cancelTokenSource && this.cancelTokenSource.cancel()
    }

    triggerHTMLUpdate = () => {
        if(this.props.article.format !== 'video' && this.props.article.content.plaintext.length) {
            const newArticle = this.props.article
            newArticle.excerpt.custom_excerpt = newArticle.excerpt.custom_excerpt + "<span />"
            const first_half_content = newArticle.content.plaintext.slice(0, this.getMiddleContentPosition()) + "<span />"
            const second_half_content = newArticle.content.plaintext.slice(this.getMiddleContentPosition()) + "<span />"
            newArticle.content.plaintext = first_half_content + second_half_content
            this.setState({ Article: newArticle })
        }
    }

    htmlRenderers = {
        iframe: (htmlAttribs, children, convertedCSSStyles, passProps) => (
                <WebView
                    source={{uri: htmlAttribs.src}}
                    style={{width: screenWidth, height: screenWidth*9/16, overflow: 'hidden', opacity: 0.99, marginLeft: -10 }}
                />
        )
    }


    render(){
      const { textColor, backgroundColor, textSizeRatio, isDarkMode } = this.props.UI

      return(
              <View>
                    <View style={{marginTop: 10, paddingHorizontal: 10 }}>

                          <HTML
                            html={this.props.article.excerpt.custom_excerpt}
                            imagesMaxWidth={Dimensions.get('window').width-20}
                            onLinkPress={(event, href)=>{
                              Linking.openURL(href)
                            }}
                            ignoredStyles={['width', 'height', 'max-width']}
                            renderers={this.htmlRenderers}
                            staticContentMaxWidth={Dimensions.get('window').width-20}
                            tagsStyles={styles.tags}
                            baseFontStyle={{fontSize: 20*textSizeRatio, fontWeight: 'bold', fontFamily: customFont, color:textColor, lineHeight: 29*textSizeRatio }}/>


                          <View style={{height: 15}}></View>

                          <HTML
                            alterChildren = {this.alterChildren}
                            html={this.props.article.content.plaintext.slice(0, this.getMiddleContentPosition()).replace(/(?:\r\n|\r|\n)/g, '<bl></bl>')}
                            imagesMaxWidth={screenWidth}
                            onLinkPress={(event, href)=>{
                              this.openWebView(href)
                            }}
                            ignoredStyles={['width', 'height', 'max-width']}
                            renderers={this.htmlRenderers}
                            staticContentMaxWidth={screenWidth}
                            tagsStyles={{ img: { marginLeft: -10 }, i: { fontSize: 19 * textSizeRatio, fontFamily: customFont }, em: { textAlign: 'center', fontSize: 16 * textSizeRatio, fontStyle: 'normal', lineHeight: 23.5 * textSizeRatio, fontFamily: customFont, color: '#696969' }, a: { fontSize: 19 * textSizeRatio, fontFamily: customFont}, blockquote: { backgroundColor: this.props.UI.blockquoteColor, padding: 10, paddingLeft: 30, marginHorizontal: -10 }, bl: { height: 10 }}}
                            baseFontStyle={{fontSize: 20*textSizeRatio, fontFamily: customFont, color:textColor, lineHeight: 29*textSizeRatio }}/>
                          <Ads
                             adPosition="Giữa bài viết"
                             navigation={this.props.navigation}
                             isCurrentFocused={this.props.isCurrentFocused}
                             shouldHideDivider
                          />

                          <HTML
                            alterChildren = {this.alterChildren}
                            html={this.props.article.content.plaintext.slice(this.getMiddleContentPosition()).replace(/(?:\r\n|\r|\n)/g, '<bl></bl>')}
                            imagesMaxWidth={screenWidth}
                            onLinkPress={(event, href)=>{
                              this.openWebView(href)
                            }}
                            ignoredStyles={['width', 'height', 'max-width']}
                            renderers={this.htmlRenderers}
                            staticContentMaxWidth={screenWidth}
                            tagsStyles={{ img: { marginLeft: -10 }, i: { fontSize: 19 * textSizeRatio, fontFamily: customFont }, em: { textAlign: 'center', fontSize: 16 * textSizeRatio, fontStyle: 'normal', lineHeight: 23.5 * textSizeRatio, fontFamily: customFont, color: '#696969' }, a: { fontSize: 19 * textSizeRatio, fontFamily: customFont }, blockquote: { backgroundColor: this.props.UI.blockquoteColor, padding: 10, paddingLeft: 30, marginHorizontal: -10 }, bl: { height: 10 } }}
                            baseFontStyle={{fontSize: 20*textSizeRatio, fontFamily: customFont, color:textColor, lineHeight: 29*textSizeRatio }}/>

                    </View>

                    <View style={{flexDirection: 'row', marginBottom: 10, justifyContent: 'flex-end', padding: 10 }}>
                          <BaomoiText style={{ fontSize: 16*textSizeRatio, marginLeft: 5, fontWeight: 'bold', color: "#696969" }}>{"Nguồn: "}</BaomoiText>

                          <TouchableOpacity
                            onPress={() => {
                                requestAnimationFrame(() => {
                                  this.props.navigation.navigate("Source", {
                                      source: this.props.article.taxonomy_source[0]
                                  })
                                })
                            }}>
                              <BaomoiText style={{ fontSize: 16*textSizeRatio, color: "#696969" }}>{this.props.article.taxonomy_source[0].name + " "}</BaomoiText>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => Linking.openURL(this.props.article.source_link)}>
                              <BaomoiText style={{ fontSize: 16*textSizeRatio, color: "#696969" }}>- Link gốc</BaomoiText>
                          </TouchableOpacity>
                    </View>

                    <Ads
                       adPosition="Cuối bài viết"
                       navigation={this.props.navigation}
                       isCurrentFocused={this.props.isCurrentFocused}
                       shouldHideDivider
                    />

                    <Divider style={{ backgroundColor: '#e0e0e0', height: 15, marginTop: 10}} />

                    <RecommendedList article={this.props.article} navigation={this.props.navigation} isCurrentFocused={this.props.isCurrentFocused} />

                    <CommentList article={this.props.article} navigation={this.props.navigation} setModalVisible={this.props.setCommentModalVisible} />
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

export default connect(
    mapStateToProps
)(StandardArticle)


