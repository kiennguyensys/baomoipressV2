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

class Article3PicsAd extends React.PureComponent {
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
        const { textColor, backgroundColor } = this.props.UI

        return(
            <View style={{flex: 1, flexDirection: 'column', paddingHorizontal: 10, paddingVertical: 20, backgroundColor: backgroundColor}}>
                {(this.state.data) ?
                    <View style={{flex:1}}>
                        <TouchableWithoutFeedback style={{flex: 2 }} onPress={() => this.openWebView(this.state.data.adURL)}>
                            <View style={{flexDirection: "row", marginBottom: 7}}>
                                    <FastImage
                                        source={{uri: this.state.data.imageURL || defaultImg}}
                                        style= {{flex:1, height: 90, borderRadius: 5, backgroundColor: '#DCDCDC'}}
                                    />
                                    <FastImage
                                        source={{uri: this.state.data.imageURL2 || defaultImg}}
                                        style= {{flex:1, height: 90, marginLeft: 5, borderRadius: 5, backgroundColor: '#DCDCDC'}}
                                    />
                                    <FastImage
                                        source={{uri: this.state.data.imageURL3 || defaultImg}}
                                        style= {{flex:1, height: 90, marginLeft: 5, borderRadius: 5, backgroundColor: '#DCDCDC'}}
                                    />
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback style={{flex: 1 }} onPress={() => this.openWebView(this.state.data.adURL)}>
                            <View>
                                <BaomoiText style={{fontSize: 17 ,fontWeight: 'bold', color: textColor, lineHeight: 25}} numberOfLines={3}>{this.state.data.title}</BaomoiText>
                                <View style={{flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                                    <View style={{borderRadius: 5, borderWidth: 1, width: 40, padding: 2, borderColor: '#C0C0C0', alignItems: "center", justifyContent: "center"}}>
                                        <Text style={{fontSize: 10, color: '#C0C0C0'}}>Tài Trợ</Text>
                                    </View>
                                    <Text style={{color: '#C0C0C0', fontSize: 13}}>  {this.state.data.sponsorName}</Text>
                                </View>

                            </View>

                        </TouchableWithoutFeedback>
                    </View> :
                    <Image style={{height: 130, width: screenWidth - 20, borderRadius: 5, alignSelf: 'center'}} source={loadingSource} resizeMode='cover'/>
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
)(Article3PicsAd)
