import React from 'react';
import {
    Image,
    Platform,
    ScrollView,
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    FlatList,
    SafeAreaView,
    Button,
    TouchableHighlight,
    Dimensions,
    AsyncStorage,
    ActivityIndicator,
    InteractionManager
} from 'react-native';

import { ListItem, List, Tile, Card, Divider, Icon } from 'react-native-elements'
import Articles from '../../components/News/Articles';
import { connect } from 'react-redux';
import axios from 'axios';
import moment from 'moment/min/moment-with-locales'
import { api_url } from '../../constants/API.js';
import ContentLoader from 'react-native-easy-content-loader';
import Ads from '../../components/Ads/Ads.js';
import HotEvent from '../../components/News/HotEvent';
import { Viewport } from '@skele/components';
import { NavigationEvents } from 'react-navigation';
import NotifService from '../../components/NotifService';

var { width, height } = Dimensions.get('window');

const ITEM_HEIGHT = 200
class HomeScreen extends React.Component {
    _scrollPosition = 0
    _onEndReachedCalledDuringMomentum = true
    _numberOfAds = 0
    _adsOrderArray = []
    _newestAdOrder = null

    constructor(props) {
        super(props);
        this.state = {
            refreshing: true,
            articles: [],
            page: 0,
            isScrollDown: false,
            isCurrentFocused: false
        }
        this.cancelTokenSource = axios.CancelToken.source()
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(async() => {
            await this.requestAdNumber()
            this.getCachedData()
        })
    }

    listEmptyComponent = () => (
        <View>
            <ContentLoader
                tHeight={10}
                tWidth={100}
                pRows={6}
                pHeight={[200, 10, 30, 10, 10, 10]}
                pWidth={[width - 20, 100, width - 20]}
                containerStyles={{ marginVertical: 20 }}
            />
            <ContentLoader
                reverse
                avatar
                aShape='square'
                aSize={100}
                listSize={2}
                pRows={3}
                pWidth={[50, 200, 200]}
            />
        </View>
    )

    requestAdNumber = () => {
        const adPosition = "List Trang Chủ"

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

    getCachedData = async() => {
        let cached_data = JSON.parse(await AsyncStorage.getItem('HomeScreen'));
        let latestCachedTime = JSON.parse(await AsyncStorage.getItem('latestCachedTime'));
        if(cached_data.length != 0) {
            const articlesData = cached_data
            const articlesWithAds = articlesData.map((item, index) => {
                if(index % 6 == 0) {
                    item.acf.randomAdsOrder = this.getAdsOrder()
                }
                return item
            })

            this.setState({
                articles: articlesWithAds,
                refreshing: false,
                latestPostDate: cached_data[cached_data.length - 1].date
            })

            if(latestCachedTime) this.preventStaleCachedData(latestCachedTime)
        } else {
            this.fetchNews()
        }
    }

    preventStaleCachedData = (latestCachedTime) => {
        const current = new Date()
        const lastTime = new Date(latestCachedTime.HomeScreen)
        const diffTime = Math.abs(current - lastTime);
        const diffMinutes = Math.ceil(diffTime / (1000 * 60));

        if(diffMinutes > 30) {
            this.handleRefresh()
            latestCachedTime.HomeScreen = current.toString()
            AsyncStorage.setItem('latestCachedTime', JSON.stringify(latestCachedTime))
        }
    }

    fetchNews = () => {

        // Home
            if(this.state.refreshing){
                axios.all([
                    axios.get(api_url + "posts?meta_key=ht_featured&meta_value=on&per_page=4",{
                        cancelToken: this.cancelTokenSource.token
                    }),
                    axios.get(api_url + "posts?per_page=10",{
                        cancelToken: this.cancelTokenSource.token
                    })
                ])
                .then(axios.spread((featuredPostRes, articlesRes) => {
                    let featuredPost = featuredPostRes.data[0]
                    featuredPost.otherFeaturedPosts = [featuredPostRes.data[1], featuredPostRes.data[2], featuredPostRes.data[3]]

                    articlesRes.data = articlesRes.data.filter((item, index) => item.id !== featuredPost.id)

                    const articlesData = [featuredPost, ...articlesRes.data]
                    const articlesWithAds = articlesData.map((item, index) => {
                        if(index % 6 == 0) {
                            item.acf.randomAdsOrder = this.getAdsOrder()
                        }
                        return item
                    })
                    this.setState({
                        articles: articlesWithAds,
                        refreshing: false,
                        latestPostDate : articlesRes.data[articlesRes.data.length - 1].date
                    }, ()  => this.saveCachedData())
                }))
                .catch(err => {
                    if(axios.isCancel(err)){
                        return
                    }else{
                        console.log(err)
                    }
                })
            } else {
                axios.get(api_url + "posts?exclude=" + this.state.articles[0].id + "&orderby=date&order=desc&before=" + this.state.latestPostDate + "&per_page=20&page=" + this.state.page,{
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
                        articles: [...this.state.articles, ...articlesWithAds]
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
    }


    findNotificationArticle = (slug) => {
        axios.get(api_url + "posts?slug=" + slug,{
            cancelToken: this.cancelTokenSource.token
        })
        .then(res => {
                if(res.data[0]){
                    requestAnimationFrame(() => {
                        this.props.navigation.push("Article", {
                                           Article: res.data[0]
                        })
                    })
                }
        })
        .catch(err => console.log(err))
    }

    componentWillUnmount() {
        this.saveCachedData()
        this.cancelTokenSource && this.cancelTokenSource.cancel()
    }

    saveCachedData = async() => {
        let cached_data = JSON.parse(await AsyncStorage.getItem('HomeScreen'));
        if(cached_data) {
            const array_max_length = this.state.articles.length > 50 ? 50 : this.state.articles.length

            cached_data = this.state.articles.slice(0, array_max_length)

            AsyncStorage.setItem('HomeScreen', JSON.stringify(cached_data))
        }
    }

    handleOnScroll = (e) => {
        if(this._scrollPosition != 0){
           if(this._scrollPosition > e.nativeEvent.contentOffset.y && this.state.isScrollDown) {
             this.props.navigation.setParams({ visible: true })
             this.setState({isScrollDown : false})
           }
           if(this._scrollPosition < e.nativeEvent.contentOffset.y && !this.state.isScrollDown) {
             this.props.navigation.setParams({ visible: false })
             this.setState({isScrollDown : true})
           }
        }
        this._scrollPosition =  e.nativeEvent.contentOffset.y

    }

    renderItem = ({ item, index }) => ( <Articles item={item} navigation={this.props.navigation} position="List Trang Chủ" isCurrentFocused={this.state.isCurrentFocused} index={index} /> );

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

        return newOrder - 1
    }

    headerComponent = () => <HotEvent navigation={this.props.navigation} />;

    keyExtractor = (item, index) => item.id.toString()

    handleRefresh = () => {
        this.setState({
            refreshing: true,
            page: 0
        },
            () => this.fetchNews()
        );
    }

    handleLoadMore = () => {
        if(!this._onEndReachedCalledDuringMomentum){
            this.setState({
                page: this.state.page + 1,
            }, () => this.fetchNews())

            this._onEndReachedCalledDuringMomentum = true;
        }
    }

    onPressArticleNotif = (slug) => {
        this.findNotificationArticle(slug)
    }


    render() {
        return(
                    <View style={{
                      flex: 1,
                      backgroundColor: this.props.UI.backgroundColor
                    }}>
                        <NavigationEvents
                           onDidFocus={payload => this.setState({ isCurrentFocused: true })}
                           onDidBlur={payload => this.setState({ isCurrentFocused: false })}
                        />

                        <NotifService onPressArticle={this.onPressArticleNotif} />

                        <Ads navigation={this.props.navigation} adPosition="Giữa ứng dụng" isCurrentFocused={this.state.isCurrentFocused} shouldHideDivider />

                        <Viewport.Tracker>
                            <FlatList
                                ListHeaderComponent={this.headerComponent}
                                onScroll={this.handleOnScroll}
                                scrollEventThrottle={16}
                                initialNumToRender={5}
                                removeClippedSubviews={true}
                                data={this.state.articles}
                                extraData={this.state}
                                renderItem={this.renderItem}
                                keyExtractor={this.keyExtractor}
                                refreshing={this.state.refreshing}
                                onRefresh={this.handleRefresh}
                                windowSize={15}
                                ListEmptyComponent={this.listEmptyComponent}
                                onEndReached={this.handleLoadMore}
                                onEndReachedThreshold={0.5}
                                onMomentumScrollBegin={() => { this._onEndReachedCalledDuringMomentum = false; }}

                            />
                        </Viewport.Tracker>
                  </View>
        )
    }
}

const style = StyleSheet.create({
    categories:{
        backgroundColor: 'white',
        padding: 10,
    },
    featuredPost:{
        padding: 10,
        backgroundColor: "white",
    },
    featuredPostTitle:{
        fontSize: 30,
    },
    selectedCategory:{
        backgroundColor: 'white',
        padding: 10,
    },
})

const mapStateToProps = (state) => {
    return {
        UI: state.UI
    }
}

export default connect(mapStateToProps)(HomeScreen)