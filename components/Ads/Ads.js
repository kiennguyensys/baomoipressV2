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
    Platform
} from 'react-native';
import { ListItem, List, Tile, Card, Divider, Icon, Badge } from 'react-native-elements';
import { connect } from 'react-redux';
import { acf_url } from '../../constants/API.js';
import Admob from './Admob.js';
import Facebook from './Facebook.js';
import CustomAd from './CustomAd.js';


class Ads extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            ads: undefined
        }
        this.getAD()
    }

    shuffle = (length) => {
        let randomIndex = Math.floor(Math.random() * length);
        return randomIndex;
    }

    getAD = () => {
        this.cancelTokenSource = axios.CancelToken.source()
        axios.get(acf_url + "quangcao?filter[meta_query][0][key]=adPosition&filter[meta_query][0][value]=" + this.props.adPosition + "&filter[meta_query][1][key]=platformOS&filter[meta_query][1][value]=" + Platform.OS.toString(), {
            cancelToken: this.cancelTokenSource.token
        })
        .then(res => {
            if(res.data.length) {
                let ads = res.data[0];
                if(res.data.length > 1) {
                    if(this.props.randomAdsOrder !== undefined) {
                        ads = res.data[this.props.randomAdsOrder]
                    }
                    else ads = res.data[this.shuffle(res.data.length)] //random
                }

                this.setState({ ads: ads.acf })
            }
        })
        .catch(err => {
            if(axios.isCancel(err)){
                return
            } else {
                console.log(err)
            }
        })
    }

    componentWillUnmount() {
        this.cancelTokenSource && this.cancelTokenSource.cancel()
    }

    render() {
        const ads = this.state.ads

        if(ads) {
            const { adType } = ads
            if(adType == "Admob") return (
                <View>
                    <Admob ads={ads} shouldHideSpaceAround={this.props.shouldHideSpaceAround} />
                    {!this.props.shouldHideDivider &&
                     <Divider style={{ backgroundColor: '#e0e0e0'}} />
                    }
                </View>
            )

            if(adType == "Facebook") return (
                <View>
                    <Facebook ads={ads} isCurrentFocused={this.props.isCurrentFocused || false} shouldHideSpaceAround={this.props.shouldHideSpaceAround} />
                    {!this.props.shouldHideDivider &&
                     <Divider style={{ backgroundColor: '#e0e0e0'}} />
                    }
                </View>
            )

            if(adType == "Custom") return (
                <View>
                    <CustomAd ads={ads} navigation={this.props.navigation} shouldHideSpaceAround={this.props.shouldHideSpaceAround} />
                    {!this.props.shouldHideDivider &&
                     <Divider style={{ backgroundColor: '#e0e0e0'}} />
                    }
                </View>
            )

        } else return <View />
    }

}

const mapStateToProps = (state) => {
    return {
        UI: state.UI
    }
}

export default connect(
    mapStateToProps
)(Ads)
