import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Dimensions,
    SafeAreaView,
    TouchableOpacity
} from 'react-native';
import HTML from 'react-native-render-html'
import { Avatar, Card, Icon, Button, Divider, Badge } from 'react-native-elements';
import { connect } from 'react-redux';
import WebView from 'react-native-webview';
import BackIcon from '../../components/BackIcon';
import { customFont } from '../../constants/Fonts.js';

const screenWidth = Dimensions.get('window').width

class NotificationsDetail extends Component {
    constructor(props){
      super(props)
      this.state={noti : this.props.navigation.getParam("Article", "ERR")}
    }

    static navigationOptions = ({navigation}) => {
        const { params = {} } = navigation.state
        const { textColor, backgroundColor } = params.UI

        return {
            tabBarVisible: false,
            header: () => (
                    <SafeAreaView
                        style={{
                            height: 50,
                            flexDirection: "row",
                            backgroundColor: backgroundColor,
                            alignItems:'center',
                            borderBottomWidth: 1,
                            borderBottomColor: '#e0e0e0',

                        }}
                    >
                        <BackIcon style={{flex: 1, width: 50, height:50, alignItems: 'center', justifyContent: 'center'}}
                                  onPress={() => {
                                            navigation.goBack()
                                        }}
                        />
                        <View style={{flex: 5}}></View>
                    </SafeAreaView>
            )
        }
    }

    openWebView = (link) => {
        this.props.navigation.navigate("WebView", { uri: link })
    }

    render() {
        const { textColor, backgroundColor, textSizeRatio } = this.props.UI
        return (
            <ScrollView style={[styles.container, {backgroundColor: backgroundColor}]}>
            <Text style={{fontFamily: customFont, fontSize: 24*textSizeRatio, lineHeight: 35*textSizeRatio, color: textColor, fontWeight:'bold', marginBottom: 10}}>{this.state.noti.title.plaintitle}</Text>
            <HTML
              alterChildren = { (node) => {
                  if (node.name === 'iframe') {
                      delete node.attribs.width;
                      delete node.attribs.height;
                  }
                  return node.children;
              }}
              html={this.state.noti.content.plaintext.replace(/(?:\r\n|\r|\n)/g, '<bl></bl>')}
              imagesMaxWidth={Dimensions.get('window').width}
              onLinkPress={(event, href)=>{
                this.openWebView(href)
              }}
              ignoredStyles={['width', 'height', 'max-width']}
              staticContentMaxWidth={Dimensions.get('window').width}
              tagsStyles={{ img: { marginLeft: -10 }, bl: { height: 10 }, blockquote: { marginLeft: 50 }, i: { fontSize: 19 * textSizeRatio, fontFamily: customFont }, em: { textAlign: 'center', fontSize: 16 * textSizeRatio, fontStyle: 'normal', lineHeight: 23.5 * textSizeRatio, fontFamily: customFont, color: '#696969' }, a: { fontSize: 19 * textSizeRatio, fontFamily: customFont } }}

              baseFontStyle={{fontSize: 20*textSizeRatio, lineHeight: 29*textSizeRatio, fontFamily: customFont, color:textColor }}/>
            </ScrollView>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10
    }
})

const htmlRenderers = {
    iframe: (htmlAttribs, children, convertedCSSStyles, passProps) => (
            <WebView
                source={{uri: htmlAttribs.src}}
                style={{width: screenWidth, height: screenWidth*9/16, overflow: 'hidden', opacity: 0.99, marginLeft: -10 }}
            />

    )
}

const mapStateToProps = (state) => {
    return {
        UI: state.UI
    }
}

export default connect(mapStateToProps)(NotificationsDetail)
