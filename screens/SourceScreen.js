import React from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    SafeAreaView,
    ActivityIndicator,
    AsyncStorage,
    FlatList,
    InteractionManager
} from 'react-native';
import { connect } from 'react-redux';
import BackIcon from '../components/BackIcon'
import { Avatar, Card, Icon, Button, Divider, Badge } from 'react-native-elements';
import axios from 'axios';
import Articles from '../components/News/Articles';
import { api_url } from '../constants/API.js';
import ContentLoader from 'react-native-easy-content-loader';
import { Viewport } from '@skele/components';
import { NavigationEvents } from 'react-navigation';

const defaultImg = 'https://homestaymatch.com/images/no-image-available.png'

class SourceScreen extends React.Component {
    _onEndReachedCalledDuringMomentum = true
    _numberOfAds = 0
    _adsOrderArray = []
    _newestAdOrder = null

    constructor(props) {
        super(props)
        this.state = {
            articles: [],
            page: 1,
            isCurrentFocused: false
        }
    }

    static navigationOptions = ({navigation}) => {
        return {
            tabBarVisible: false,
            headerShown: false
        }
    }


    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.cancelTokenSource = axios.CancelToken.source()
            this.setState({ source: this.props.navigation.getParam("source")}, async() => {
                await this.requestAdNumber()
                this.fetchNews()
            })
        });
    }

    requestAdNumber = () => {
        const adPosition = "List Tin Cùng Nguồn"

        return axios.get(api_url + "quangcao?filter[meta_query][0][key]=adPosition&filter[meta_query][0][value]=" + adPosition + "&filter[meta_query][1][key]=platformOS&filter[meta_query][1][value]=" + Platform.OS.toString() +"&per_page=1", {
            cancelToken: this.cancelTokenSource.token
        })
        .then(res => {
            if(res.data.length) {
                this._numberOfAds = res.headers["x-wp-total"]
                for( let i = 1 ; i <= this._numberOfAds; i++ ) {
                    this._adsOrderArray.push(i)
                }
            }
            return res.data.length
        })
        .catch(err => {
            if(axios.isCancel(err)){
                return
            } else {
                console.log(err)
                return
            }
        })
    }

    fetchNews = () => {
        axios.get(api_url + "posts?filter[taxonomy]=source&per_page=10&page="+this.state.page+"&filter[term]=" + this.state.source.slug, {
            cancelToken: this.cancelTokenSource.token
        })
        .then(res => {
            const previousDataLength = this.state.articles.length

            const articlesWithAds = res.data.map((item, index) => {
                if((previousDataLength + index) % 6 == 0) {
                    item.acf.randomAdsOrder = this.getAdsOrder()
                }
                return item
            })

            this.setState({
                articles: [...this.state.articles, ...articlesWithAds],
            })
        })
        .catch(err => {
            if(axios.isCancel(err)){
                return
            }else{
                console.log(err)
            }
        })
    }

    getAdsOrder = () => {
        if(this._numberOfAds < 2) return undefined
        let newIndex = Math.floor(Math.random() * this._adsOrderArray.length)
        let newOrder = this._adsOrderArray[newIndex]

        if(this._adsOrderArray.length == this._numberOfAds) {
            while(newOrder === this._newestAdOrder) {
                newIndex = Math.floor(Math.random() * this._adsOrderArray.length)
                newOrder = this._adsOrderArray[newIndex]
            }
        }

        this._adsOrderArray.splice(newIndex, 1)

        if(this._adsOrderArray.length == 0) {
            this._newestAdOrder = newOrder
            for( let i = 1 ; i <= this._numberOfAds; i++ ) {
                this._adsOrderArray.push(i)
            }
        }
        console.log(newOrder - 1)

        return newOrder - 1
    }


    _renderItem = ({ item, index }) => <Articles item={item} position="List Tin Cùng Nguồn" shouldPushAnotherScreen={true} isCurrentFocused={this.state.isCurrentFocused} navigation={this.props.navigation} index={index} />

    handleLoadMore = () => {
        if(!this._onEndReachedCalledDuringMomentum){
            this.setState({
                page: this.state.page + 1,
            }, () => this.fetchNews())

            this._onEndReachedCalledDuringMomentum = true;
        }
    }

    listEmptyComponent = () => (
        <ContentLoader
            reverse
            avatar
            aShape='square'
            aSize={90}
            title={false}
            listSize={6}
            pRows={3}
            pWidth={[50, 200, 200]}
            containerStyles={{ alignItems: 'center', height: 140 }}
        />
    )

    componentWillUnmount() {
        this.cancelTokenSource && this.cancelTokenSource.cancel()
    }


    render(){
        const {source} = this.state
        const { backgroundColor } = this.props.UI
        return(
            <SafeAreaView style={{flex: 1, backgroundColor: backgroundColor}}>
                <View
                    style={{
                        height: 50,
                        flexDirection: "row",
                        backgroundColor: this.props.UI.backgroundColor,
                        alignItems:'center',
                        borderBottomWidth: 1,
                        borderBottomColor: '#e0e0e0',
                    }}
                >
                    <BackIcon style={{flex: 1, width: 50, height:50, alignItems: 'center', justifyContent: 'center'}}
                              onPress={() => {
                                        this.props.navigation.goBack()
                                    }}
                    />
                    <View style={{flex: 4, alignItems: "center"}}><Text style={{fontSize: 20, fontWeight: "bold", color: this.props.UI.textColor}}>{source && source.name}</Text></View>
                    <View style={{flex: 1}}></View>
                </View>
               <NavigationEvents
                   onDidFocus={payload => this.setState({ isCurrentFocused: true })}
                   onDidBlur={payload => this.setState({ isCurrentFocused: false })}
                 />
                <Viewport.Tracker>
                    <FlatList
                        initialNumToRender={5}
                        data={this.state.articles}
                        extraData={this.state.articles}
                        keyExtractor={item => item.id.toString()}
                        renderItem={this._renderItem}
                        onEndReached={this.handleLoadMore}
                        removeClippedSubviews={true}
                        windowSize={15}
                        ListEmptyComponent={this.listEmptyComponent}
                        onEndReachedThreshold={0.5}
                        onMomentumScrollBegin={() => { this._onEndReachedCalledDuringMomentum = false; }}
                    />
                </Viewport.Tracker>
            </SafeAreaView>
        )
    }
};

const mapStateToProps = (state) => {
    return {
        UI: state.UI
    }
}

export default connect(mapStateToProps)(SourceScreen)