import React from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  View,
  Image,
  Alert,
  AsyncStorage,
  ImageBackground,
  Platform
} from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import splashLogo from '../assets/images/logo-splash.png';
import moment from 'moment/min/moment-with-locales'
import { connect } from 'react-redux';
import { api_url, acf_url } from '../constants/API.js';
import { checkAuth } from '../store/actions/sessionActions';
import { checkUI } from '../store/actions/UIActions';
import Ads from '../components/Ads/Ads.js';
import axios from 'axios';

class SplashScreen extends React.Component {

    constructor(props) {
        super(props);
        this.checkInternetConnection()
        this.state = { shouldShowAdBeforeNavigating: false }
    }

    checkInternetConnection = () => {
        this.netInfoListener = NetInfo.addEventListener(state => {
            if(!state.isConnected) Alert.alert("Vui lòng kiểm tra lại kết nối mạng")
            if(state.isConnected && state.isInternetReachable) this.preHandleTasks()
        });
    }

    preHandleTasks = async () => {
        this.cancelTokenSource = axios.CancelToken.source()
        this.props.checkAuth()
        this.props.checkUI()
        this.checkCustomSplashAd()
        this.checkCachedPosts()
    }

    checkCustomSplashAd = () => {
        axios.get(acf_url + "quangcao?filter[meta_query][0][key]=adPosition&filter[meta_query][0][value]=" + "Khởi động" + "&filter[meta_query][1][key]=platformOS&filter[meta_query][1][value]=" + Platform.OS.toString() + "&filter[meta_query][2][key]=AdType&filter[meta_query][2][value]=Custom", {
            cancelToken: this.cancelTokenSource.token
        })
        .then(res => {
            if(res.data.length) {
                this.setState({ shouldShowAdBeforeNavigating: true })
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

    checkCachedPosts = async() => {
        let isDataCached = JSON.parse(await AsyncStorage.getItem('isDataCached'));
        const date = moment().format('LL');

        if(isDataCached && isDataCached[date]) {
            //Today's data has been cached
            setTimeout(() => {
                if(!this.state.shouldShowAdBeforeNavigating)
                    this.props.navigation.navigate("HomeScreen")
            }, 2000)

        } else {
            this.getMenus(true)
        }
    }

    getMenus = (shouldCachePosts) => {
          axios.get(api_url.split('wp/v2/')[0] + "menus/v1/menus/menu-chinh", {
              cancelToken: this.cancelTokenSource.token,
          })
          .then(async(res) => {
              const menuItems = res.data.items
              const titleItems = menuItems.map(item => item.title)
              const slugItems = menuItems.map(item => (item.child_items) ? item.child_items.map(child => child.slug) : item.slug)
              const categories = await Promise.all(slugItems.map(async (item) => {
                  const idArr = await this.getCategories(item);
                  return idArr;
              }));

              AsyncStorage.setItem("tabCategories", JSON.stringify(categories.slice(0, 15)))
              AsyncStorage.setItem("tabTitles", JSON.stringify(titleItems.slice(0, 15)))

              if( shouldCachePosts ) this.cachingPosts(categories)
          })
          .catch(err => {
              if(axios.isCancel(err)){
                  return
              }else{
                  console.log(err)
              }
          })

    }

    getCategories = (slugs) => {
        return axios.get(api_url + "categories?slug=" + slugs.toString(), {
            cancelToken: this.cancelTokenSource.token,
        })
        .then(res => {
            if(res.data.length) {
                const category_id_arr = res.data.map(category => category.id)
                return category_id_arr
            }
        })
        .catch(err => {
            if(axios.isCancel(err)){
                return null
            }else{
                console.log(err)
            }
        })
    }


    cachingPosts = async(categories) => {
        const date = moment().format('LL');

        axios.all([
            axios.get(api_url + "posts?meta_key=ht_featured&meta_value=on&per_page=4",{
                cancelToken: this.cancelTokenSource.token
            }),
            axios.get(api_url + "posts?meta_key=ht_featured&meta_value=off&per_page=10",{
                cancelToken: this.cancelTokenSource.token
            }),
            axios.get(api_url + "posts?filter[post_format]=post-format-video&per_page=10",{
                cancelToken: this.cancelTokenSource.token
            }),
            axios.get(api_url + "posts?categories="+ categories[0].toString() +"&per_page=10",{
                cancelToken: this.cancelTokenSource.token
            }),
            axios.get(api_url + "posts?categories="+ categories[1].toString() +"&per_page=10",{
                cancelToken: this.cancelTokenSource.token
            }),
            axios.get(api_url + "posts?categories="+ categories[2].toString() +"&per_page=10",{
                cancelToken: this.cancelTokenSource.token
            }),
            axios.get(api_url + "posts?categories="+ categories[3].toString() +"&per_page=10",{
                cancelToken: this.cancelTokenSource.token
            }),

        ])
            .then(axios.spread(async(featuredPostRes, articlesRes, videosRes, tab0Res, tab1Res, tab2Res, tab3Res) => {
                const featuredPost = featuredPostRes.data[0]
                featuredPost.otherFeaturedPosts = [featuredPostRes.data[1], featuredPostRes.data[2], featuredPostRes.data[3]]

                let isDataCached = {}
                isDataCached[date] = "true"

                AsyncStorage.setItem('VideoScreen', JSON.stringify(videosRes.data))
                AsyncStorage.setItem('Tab0', JSON.stringify(tab0Res.data))
                AsyncStorage.setItem('Tab1', JSON.stringify(tab1Res.data))
                AsyncStorage.setItem('Tab2', JSON.stringify(tab2Res.data))
                AsyncStorage.setItem('Tab3', JSON.stringify(tab3Res.data))
                await AsyncStorage.setItem('HomeScreen', JSON.stringify([featuredPost, ...articlesRes.data]))

                let dt = new Date()
                dt = dt.toString()
                const obj = { HomeScreen: dt, Tab0: dt, Tab1: dt, Tab2: dt, Tab3: dt, VideoScreen: dt }
                AsyncStorage.setItem('latestCachedTime', JSON.stringify(obj))

                AsyncStorage.setItem('isDataCached', JSON.stringify(isDataCached))
                    .then(data => {
                        //caching done! Switching to HomeScreen
                        if(!this.state.shouldShowAdBeforeNavigating)
                            this.props.navigation.navigate("HomeScreen")

                    })
                    .catch(asyncErr => console.log("asyncStorage set Cached Posts :" + asyncErr.toString()))

            }))
            .catch(err => {
                if(axios.isCancel(err)) {
                    return
                } else {
                    console.log(err)
                }
            })
    }

    findNotificationArticle = (slug) => {
        axios.get(api_url + "posts?slug=" + slug.toString())
            .then(res => {
                if(res.data[0]){
                    requestAnimationFrame(() => {
                        this.props.navigation.navigate("Article", {
                            Article: res.data[0]
                        })
                    })
                }
            })
            .catch(err => console.log(err))
    }


    componentWillUnmount() {
        this.netInfoListener()
        this.cancelTokenSource && this.cancelTokenSource.cancel()
    }

    // Render any loading content that you like here
    render() {
        return(
                <ImageBackground source={splashLogo} style={styles.image}>
                    <Ads adPosition="Khởi động" navigation={this.props.navigation} shouldHideDivider />
                </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    image:{
        resizeMode: "contain",
        flex: 1,
    }
})

const mapStateToProps = (state) => {
    return {
        UI: state.UI,
        session: state.session
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        checkAuth: () => {dispatch(checkAuth())},
        checkUI: () => {dispatch(checkUI())}
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen)
