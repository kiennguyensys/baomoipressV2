import React from 'react';
import {
    Image,
    Platform,
    ScrollView,
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
import Header from '../../components/Header';
import axios from 'axios';
import moment from 'moment/min/moment-with-locales';
import { connect } from 'react-redux';
import Articles from '../../components/News/Articles';
import { api_url } from '../../constants/API.js';
import ContentLoader from 'react-native-easy-content-loader';
import { Viewport } from '@skele/components';
import { NavigationEvents } from 'react-navigation';

class OtherCategoriesScreens extends React.PureComponent {
    _scrollPosition = 0
    _onEndReachedCalledDuringMomentum = true
    _numberOfAds = 0
    _adsOrderArray = []
    _newestAdOrder = null

    state = {
            categories:  [],
            refreshing: true,
            loading: false,
            page: 0,
            y: 0,
            isScrollDown: false,
            isCurrentFocused: false,
        }

    componentDidMount() {
        InteractionManager.runAfterInteractions(async() => {
            this.cancelTokenSource = axios.CancelToken.source()
            const categories = JSON.parse(await AsyncStorage.getItem('tabCategories'))
            const routeName = this.props.navigation.state.routeName
            const index = parseInt(routeName.split('Tab')[1])

            this.setState({categories : categories[index], routeName: routeName }, async() => {
                await this.requestAdNumber()
                this.getCachedData()
            })
        });
    }

    requestAdNumber = () => {
        const adPosition = "List Chuyên mục " + this.state.routeName.split("Tab")[1]

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
        let cached_data = JSON.parse(await AsyncStorage.getItem(this.state.routeName));
        let latestCachedTime = JSON.parse(await AsyncStorage.getItem('latestCachedTime'));
        if(cached_data && cached_data.length != 0) {

            const articlesWithAds = cached_data.map((item, index) => {
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

        if(latestCachedTime[this.state.routeName]){
            const lastTime = new Date(latestCachedTime[this.state.routeName])
            const diffTime = Math.abs(current - lastTime);
            const diffMinutes = Math.ceil(diffTime / (1000 * 60));

            if(diffMinutes > 30) {
                this.handleRefresh()
                latestCachedTime[this.state.routeName] = current.toString()
                AsyncStorage.setItem('latestCachedTime', JSON.stringify(latestCachedTime))
            }
        } else {
            latestCachedTime[this.state.routeName] = current.toString()
            AsyncStorage.setItem('latestCachedTime', JSON.stringify(latestCachedTime))
        }
    }


    fetchNews = () => {
        if(this.state.refreshing){
            axios.get(api_url + "posts?categories=" + this.state.categories.toString() + "&per_page=10", {
                cancelToken: this.cancelTokenSource.token,
            })
            .then(res => {
                const articlesWithAds = res.data.map((item, index) => {
                    if(index % 6 == 0) {
                        item.acf.randomAdsOrder = this.getAdsOrder()
                    }
                    return item
                })

                this.setState({
                    articles: articlesWithAds,
                    refreshing: false,
                    latestPostDate: res.data[res.data.length - 1].date
                }, ()  => this.saveCachedData())
            })
            // .then(json => console.log(json))
            .catch(err => {
                if(axios.isCancel(err)){
                    return
                }else{
                    console.log(err)
                }
            })
        } else {
            axios.get(api_url + "posts?categories=" + this.state.categories.toString() + "&orderby=date&order=desc&before=" + this.state.latestPostDate + "&per_page=20&page=" + this.state.page, {
                cancelToken: this.cancelTokenSource.token,
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
                    articles: [...this.state.articles,...articlesWithAds],
                    refreshing: false,
                })
            })
            // .then(json => console.log(json))
            .catch(err => {
                if(axios.isCancel(err)){
                    return
                }else{
                    console.log(err)
                }
            })
        }

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

    componentWillUnmount() {
        this.saveCachedData()
        this.cancelTokenSource && this.cancelTokenSource.cancel()
    }

    saveCachedData = async() => {
        let cached_data = JSON.parse(await AsyncStorage.getItem(this.state.routeName));

        const array_max_length = this.state.articles.length > 50 ? 50 : this.state.articles.length
        cached_data = this.state.articles.slice(0, array_max_length)

        AsyncStorage.setItem(this.state.routeName.toString(), JSON.stringify(cached_data))

    }

    renderItem = ({ item, index }) => ( <Articles item={item} navigation={this.props.navigation} position={"List chuyên mục " + this.state.routeName.split("Tab")[1]} isCurrentFocused={this.state.isCurrentFocused} index={index} />);

    listEmptyComponent = () => (
        <ContentLoader
            reverse
            avatar
            aShape='square'
            aSize={90}
            listSize={5}
            title={false}
            pRows={3}
            pWidth={[50, 200, 200]}
            containerStyles={{ alignItems: 'center', height: 140 }}
        />
    )

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

    render(){
        return(
           <View style={{flex: 1, backgroundColor: this.props.UI.backgroundColor}}>
                <NavigationEvents
                    onDidFocus={payload => this.setState({ isCurrentFocused: true })}
                    onDidBlur={payload => this.setState({ isCurrentFocused: false })}
                />

                <Viewport.Tracker>
                     <FlatList
                         onScroll={this.handleOnScroll}
                         data={this.state.articles}
                         extraData={this.state}
                         scrollEventThrottle={16}
                         initialNumToRender={5}
                         removeClippedSubviews={true}
                         windowSize={15}
                         renderItem={this.renderItem}
                         keyExtractor={this.keyExtractor}
                         refreshing={this.state.refreshing}
                         ListEmptyComponent={this.listEmptyComponent}
                         onRefresh={this.handleRefresh}
                         onEndReached={this.handleLoadMore}
                         onEndReachedThreshold={0.5}
                         onMomentumScrollBegin={() => { this._onEndReachedCalledDuringMomentum = false; }}
                     />
                </Viewport.Tracker>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        UI: state.UI
    }
}

export default connect(mapStateToProps)(OtherCategoriesScreens)