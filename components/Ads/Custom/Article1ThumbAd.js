import React, { Component } from 'react';
import axios from 'axios';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    FlatList,
    SafeAreaView,
    Dimensions,
    TouchableWithoutFeedback
} from 'react-native';
import { ListItem, List, Tile, Card, Divider, Icon, Badge } from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import { BaomoiText } from '../../StyledText';
import { connect } from 'react-redux';
import { acf_url } from '../../../constants/API.js';
const screenWidth = Dimensions.get('window').width
const defaultImg = 'https://homestaymatch.com/images/no-image-available.png'
const loadingSource = require('../../../assets/images/large-banner-default.jpg')

class Article1ThumbAd extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.ads
        }
    }

    openWebView = (link) => {
        this.props.navigation.navigate("WebView", { uri: link })
    }

    render() {
        // return null
        const UI = this.props.UI
        return(
            <View style={{height: 130, justifyContent: 'center'}}>
                {this.state.data ? (
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => this.openWebView(this.state.data.adURL)}
                        style={{padding: 10, flex: 1}}
                    >
                        <View style={{flex: 1, flexDirection: "row", alignItems:'center'}}>
                            <View style={{flex: 2}}>
                                <View style={{flexDirection: "row", alignItems: "center"}}>
                                    <View style={{borderRadius: 5, borderWidth: 1, width: 40, borderColor: '#C0C0C0', alignItems: "center", justifyContent: "center"}}>
                                        <Text style={{fontSize: 10, color: '#C0C0C0'}}>Tài Trợ</Text>
                                    </View>
                                    <Text style={{color: '#C0C0C0', fontSize: 13}}> {this.state.data.sponsorName}</Text>
                                </View>
                                <BaomoiText style={{fontSize: 18,fontWeight: '500', color: UI.textColor, marginTop: 5}}>{this.state.data.title}</BaomoiText>

                            </View>
                            <FastImage
                                source={{uri :this.state.data.imageURL || defaultImg}}
                                style={{height: 90, flex: 1, marginLeft: 5, borderRadius: 5}}
                            />
                        </View>
                    </TouchableOpacity>
                    ) :
                    <Image style={{height: 110, width: screenWidth - 20, borderRadius: 5, alignSelf: 'center'}} source={loadingSource} resizeMode='cover'/>
                }
            </View>
            )
    }
    render(){
        const { textColor, backgroundColor } = this.props.UI

        return(
                <TouchableWithoutFeedback
                    onPress={() => this.openWebView(this.state.data.adURL)}
                >
                    <View style={{flex: 1, flexDirection: "column", paddingVertical: 20, backgroundColor: backgroundColor }}>
                        {(this.state.data) ?
                        <View style={{flex: 1}}>
                            <View style={{alignItems: 'center', justifyContent:'center'}}>
                                <FastImage
                                  style={{ width: screenWidth - 20, height: 250, borderRadius: 5, overflow: 'hidden', overlayColor: backgroundColor, backgroundColor: 'black'}}
                                  source={{ uri: this.state.data.imageURL || defaultImg }}
                                  />
                            </View>
                            <View style={{marginLeft: 10, marginTop: 5}}>
                                <BaomoiText style={{fontSize: 17, fontWeight: 'bold', lineHeight: 25, color: textColor}}>{this.state.data.title}</BaomoiText>
                                <View style={{flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                                    <View style={{borderRadius: 5, borderWidth: 1, width: 40, borderColor: '#C0C0C0', alignItems: "center", justifyContent: "center", padding: 2}}>
                                        <Text style={{fontSize: 10, color: '#C0C0C0'}}>Tài Trợ</Text>
                                    </View>
                                    <Text style={{color: '#C0C0C0', fontSize: 13}}>  {this.state.data.sponsorName}</Text>
                                </View>

                            </View>
                        </View> :
                        <Image style={{height: 250, width: screenWidth - 20, borderRadius: 5, alignSelf: 'center'}} source={loadingSource} resizeMode='cover'/>
                        }
                    </View>
                </TouchableWithoutFeedback>
        )


    }


}

const mapStateToProps = (state) => {
    return {
        UI: state.UI
    }
}

export default connect(
    mapStateToProps
)(Article1ThumbAd)

