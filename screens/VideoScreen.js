import React from 'react';
import {Text, View, FlatList, ActivityIndicator, ScrollView, InteractionManager, AsyncStorage} from 'react-native';
import axios from 'axios';
import Articles from '../components/News/Articles';
import moment from 'moment/min/moment-with-locales'
import Header from '../components/Header.js';
import { connect } from 'react-redux';
import BannerAd from '../components/Ads/BannerAd';
import { api_url } from '../constants/API.js';
import ContentLoader from 'react-native-easy-content-loader';
import InterstitialAd from '../components/Ads/InterstitialAd';
import { Viewport } from '@skele/components';
import { NavigationEvents } from 'react-navigation';

class VideoListScreen extends React.Component{
  _scrollPosition = 0
  _onEndReachedCalledDuringMomentum = true
  _numberOfAds = 0
  _adsOrderArray = []
  _newestAdOrder = null


  constructor(props) {
    super(props)
    this.state={
        articles: [],
        page: 0,
        refreshing: true,
        isScrollDown: false,
        isCurrentFocused: false
    }
    this.cancelTokenSource = axios.CancelToken.source()
  }
  // static navigationOptions = ({navigation}) => {
  //     return {
  //         title: "Video",
  //         header: <Header navigation={navigation}/>
  //     }
  // }
  componentDidMount() {
      InteractionManager.runAfterInteractions(async() => {
          await this.requestAdNumber()
          this.getCachedData()
      })
  }

    requestAdNumber = () => {
        const adPosition = "List Video"

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
      let cached_data = JSON.parse(await AsyncStorage.getItem('VideoScreen'));
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
          this.fetchVideos()
      }
  }

  preventStaleCachedData = (lastTime) => {
      const current = new Date()
      const diffTime = Math.abs(current - lastTime);
      const diffMinutes = Math.ceil(diffTime / (1000 * 60));

      if(diffMinutes > 30) {
          this.handleRefresh()
          AsyncStorage.setItem('latestCachedTime', current.toString())
      }
  }

  preventStaleCachedData = (latestCachedTime) => {
      const current = new Date()
      const lastTime = new Date(latestCachedTime.VideoScreen)
      const diffTime = Math.abs(current - lastTime);
      const diffMinutes = Math.ceil(diffTime / (1000 * 60));

      if(diffMinutes > 30) {
          this.handleRefresh()
          latestCachedTime.VideoScreen = current.toString()
          AsyncStorage.setItem('latestCachedTime', JSON.stringify(latestCachedTime))
      }
  }


  fetchVideos = () => {
      if(this.state.refreshing) {
          axios.get(api_url + "posts?filter[post_format]=post-format-video&per_page=10", {
              cancelToken: this.cancelTokenSource.token
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
              }, () => this.saveCachedData())
          })
          .catch(err => {
              if(axios.isCancel(err)){
                  return
              }else{
                  console.log(err)
              }
          })
      } else {
          axios.get(api_url + "posts?filter[post_format]=post-format-video&orderby=date&order=desc&before=" + this.state.latestPostDate + "&per_page=10&page=" + this.state.page,{
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
              if(axios.isCancel(err)) {
                  return
              } else {
                  console.log(err)
              }
          })
      }
  }

  componentWillUnmount() {
      this.saveCachedData()
      this.cancelTokenSource && this.cancelTokenSource.cancel()
  }

  saveCachedData = async() => {
      let cached_data = JSON.parse(await AsyncStorage.getItem('VideoScreen'));

      if(cached_data) {
          const array_max_length = this.state.articles.length > 50 ? 50 : this.state.articles.length
          cached_data = this.state.articles.slice(0, array_max_length)

          AsyncStorage.setItem('VideoScreen', JSON.stringify(cached_data))
      }
  }

  handleRefresh = () => {
      this.setState({
              refreshing: true,
              page: 0,
          },
          () => this.fetchVideos()
      );
  }

  handleLoadMore = () => {
      if(!this._onEndReachedCalledDuringMomentum){
          this.setState({
              page: this.state.page + 1,
          }, () => this.fetchVideos())

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

    listEmptyComponent = () => (
        <ContentLoader
            listSize={3}
            pRows={3}
            title={false}
            pHeight={[200, 10, 20]}
            pWidth={['100%', 100, '100%']}
        />
    )

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



  render() {
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
                    extraData={this.state.articles}
                    renderItem={({ item, index }) => <Articles item={item} navigation={this.props.navigation} position="List Video" index={index} isCurrentFocused={this.state.isCurrentFocused} />}
                    keyExtractor={item => item.id.toString()}
                    initialNumToRender={5}
                    removeClippedSubviews={true}
                    updateCellsBatchingPeriod={30}
                    refreshing={this.state.refreshing}
                    onRefresh={this.handleRefresh}
                    ListEmptyComponent={this.listEmptyComponent}
                    onEndReached={() => this.handleLoadMore()}
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

export default connect(mapStateToProps)(VideoListScreen)
