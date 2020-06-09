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
    Linking,
} from 'react-native';
import { ListItem, List, Tile, Card, Divider, Icon, Badge } from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import { BaomoiText } from '../../StyledText';
import { connect } from 'react-redux';
import { acf_url } from '../../../constants/API.js';
const screenWidth = Dimensions.get('window').width
const defaultImg = 'https://homestaymatch.com/images/no-image-available.png'
const loadingSource = require('../../../assets/images/large-banner-default.jpg')

class Article1PicAd extends React.PureComponent {
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
                                    <View style={{borderRadius: 5, borderWidth: 1, width: 40, borderColor: '#C0C0C0', alignItems: "center", justifyContent: "center", padding: 2}}>
                                        <Text style={{fontSize: 10, color: '#C0C0C0'}}>Tài Trợ</Text>
                                    </View>
                                    <Text style={{color: '#C0C0C0', fontSize: 13}}> {this.state.data.sponsorName}</Text>
                                </View>
                                <BaomoiText style={{fontSize: 17,fontWeight: 'bold', color: UI.textColor, lineHeight: 25, marginTop: 5}}>{this.state.data.title}</BaomoiText>

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

}

const mapStateToProps = (state) => {
    return {
        UI: state.UI
    }
}

export default connect(
    mapStateToProps
)(Article1PicAd)
