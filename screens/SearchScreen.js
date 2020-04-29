import React from 'react';
import {
    Image,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    Button,
    TouchableHighlight,
    TextInput,
    FlatList,
    ActivityIndicator,
    Dimensions,
    Linking,
    ScrollView
} from 'react-native';
import {Icon, SearchBar, Divider} from 'react-native-elements';
import { BaomoiText } from '../components/StyledText';
import BackIcon from '../components/BackIcon'
import { connect } from 'react-redux';
import moment from 'moment/min/moment-with-locales'
const defaultImg = 'https://homestaymatch.com/images/no-image-available.png'
import axios from 'axios';
import FastImage from 'react-native-fast-image';
import Ads from '../components/Ads/Ads';
import { api_url } from '../constants/API.js';
import { NavigationEvents } from 'react-navigation';
import { Viewport } from '@skele/components';
import ContentLoader from 'react-native-easy-content-loader';
moment.locale('vi')
const width = Dimensions.get('window').width

class SearchScreen extends React.Component{
  _onEndReachedCalledDuringMomentum = true
  _numberOfAds = 0
  _adsOrderArray = []
  _newestAdOrder = null

  constructor(props){
    super(props);
    this.state={
      text:'',
      animating: false,
      page: 1,
      results:[],
      trendings: [],
      isCurrentFocused: false
    }
  }


  static navigationOptions = ({ navigation }) => {
    const {params = {}} = navigation.state;
    const { textColor, backgroundColor } = params.UI

    return{
      title: "Search",
      header: () => (
              <View
                style={{
                  flexDirection: "row",
                  height: 50,
                  backgroundColor: backgroundColor,
                  justifyContent: 'center'
                }}>
                <BackIcon style={{flex :1, width: 50, height:50, justifyContent: 'center', alignItems: 'center'}}
                          onPress={() => {
                                    navigation.goBack()
                                }}
                />
                <View style={{flex: 4, justifyContent:'center'}}>
                  <TextInput
                  style={{height:50, color : textColor, borderBottomColor: '#C0C0C0', borderBottomWidth: 0.5}}
                  onChangeText={(text) => params.ChangeText(text)}
                  value={params.text}
                  onSubmitEditing={() => params.onSubmit(params.text)}
                  placeholder='Tìm kiếm'
                  placeholderTextColor={textColor}
                  autoFocus={true}
                  />
                </View>
                <TouchableOpacity style={{flex: 1, justifyContent:'center'}} onPress={()=>params.clear()}>
                  <Icon
                    name='clear'
                    size={24}
                    color='#696969'
                  />
                </TouchableOpacity>
              </View>
      )

    }
  }

  componentDidMount() {
      this.cancelTokenSource = axios.CancelToken.source()
      this.props.navigation.setParams({onSubmit: this.onSubmit, ChangeText: this.ChangeText, text: '', clear:this.clear});
      this.requestAdNumber()
      this.fetchTrendings()
  }

  listEmptyTrendings = () => (
      <ContentLoader
          title={false}
          pRows={3}
          pHeight={[20, 20, 20]}
          primaryColor="rgb(224,224,224)"
          pWidth={["100%","100%","100%"]}
      />
  )

  fetchTrendings = () => {
      axios.get(api_url + "get_trending_hear", {
          cancelToken: this.cancelTokenSource.token
      })
      .then(res => res.data)
      .then(json => this.setState({
          trendings : json
      }))
      .catch(err => console.log(err))
  }

  componentWillUnmount() {
      this.cancelTokenSource && this.cancelTokenSource.cancel()
 }

  ChangeText = (text) =>{
      this.props.navigation.setParams({onSubmit: this.onSubmit, ChangeText: this.ChangeText, text: text, clear:this.clear});
  }

  clear = () => {
      this.props.navigation.setParams({onSubmit: this.onSubmit, ChangeText: this.ChangeText, text: '', clear:this.clear});
  }

  onSubmit = (text) => {
      if(!this.state.animating && text.length) {
          this.setState({animating: true, page: 1, results: []}, () => {
              this.fetchPosts(text)
          })
      }
  }

    requestAdNumber = () => {
        const adPosition = "List Tìm Kiếm"

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


  fetchPosts = (text) => {
      const str = text.replace(" ", "-")

      axios.get(api_url + "posts?search=" + str +"&per_page=10&page=" + this.state.page, {
          cancelToken: this.cancelTokenSource.token
      })
          .then(res => res.data)
          .then(json => {
              const previousDataLength = this.state.results.length

              const articlesWithAds = json.map((item, index) => {
                  if((previousDataLength + index) % 6 == 0) {
                      item.acf.randomAdsOrder = this.getAdsOrder()
                  }
                  return item
              })

              this.setState({
                  results: [...this.state.results, ...articlesWithAds],
                  animating: false,
              })
          })
          .catch(err => console.log(err))
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


  _renderTrendingItems = ({ item, index }) => (
                <TouchableOpacity   style={styles.trendings} key={index}
                                    onPress={() => this.onSubmit(item.title)}>

                                    <Text style={{color: this.props.UI.textColor}}>#{item.title}</Text>

                </TouchableOpacity>
        )

  _renderItem = ({ item , index}) => (
      <View>
        <View style={{ height: 130, backgroundColor: this.props.UI.backgroundColor}}>
            <TouchableWithoutFeedback
                onPress={() =>
                    requestAnimationFrame(() => {
                        this.props.navigation.push("Article", {
                            Article: item,
                            isVideo: (item.format === 'video') ? true : false
                        })
                    })
                }
                style={{flex: 1}}
            >
                <View style={{ flex: 1 }}>
                    <View style={{flex: 1, flexDirection: "row", alignItems:'center'}}>
                        <View style={{flex: 2}}>
                            <View style={{flexDirection: "row", alignItems:'center'}}>
                                {
                                  (item.taxonomy_source[0])?
                                     <BaomoiText style={{color: '#C0C0C0', fontSize: 14}}>{item.taxonomy_source[0].name} - {moment(item.modified).fromNow().replace("trước", "").replace("một", "1")}</BaomoiText>
                                  :
                                      <BaomoiText style={{color: '#C0C0C0', fontSize: 14}}>{moment(item.modified).fromNow().replace("trước", "").replace("một", "1")}</BaomoiText>
                                }
                                <View style={{justifyContent:'center'}}>
                                    {
                                      (item.total_comments.approved !== 0)?
                                      <View style={{flexDirection: "row", alignItems: "center"}}>
                                          <Text style={{fontSize: 12, color: '#C0C0C0'}}> - {item.total_comments.approved}</Text>
                                          <Icon containerStyle={{marginTop: -2}} name='comment' type="evilicon" color='#C0C0C0' size={20}/>
                                      </View> : <View></View>
                                    }
                                 </View>
                            </View>
                            <BaomoiText style={{fontSize: 17, lineHeight: 25, fontWeight: '500', color: this.props.UI.textColor}}>{item.title.plaintitle}</BaomoiText>
                        </View>
                        <FastImage
                            source={{uri :item.thumb || defaultImg}}
                            style={{height: 90, flex: 1, marginLeft: 5, borderRadius: 5, backgroundColor: '#DCDCDC'}}
                        />
                    </View>
                    <Divider style={{ backgroundColor: '#e0e0e0'}} />
                </View>
            </TouchableWithoutFeedback>
          </View>
          {(index % 6 == 0) &&
           <Ads navigation={this.props.navigation} adPosition="List Tìm Kiếm" isCurrentFocused={this.state.isCurrentFocused} randomAdsOrder={item.acf.randomAdsOrder} />
          }
      </View>
  )

  handleLoadMore = () => {
      if(!this._onEndReachedCalledDuringMomentum){
          const {params = {}} = this.props.navigation.state;
          if(params.text) this.setState({page: this.state.page + 1}, () => {
              this.fetchPosts(params.text)
          })

          this._onEndReachedCalledDuringMomentum = true;
      }
  }

  render(){
    const { textColor, backgroundColor, highLightColor } = this.props.UI
    return(
            <View style={{flex: 1,  backgroundColor: backgroundColor }}>
                    <NavigationEvents
                        onDidFocus={payload => this.setState({ isCurrentFocused: true })}
                        onDidBlur={payload => this.setState({ isCurrentFocused: false })}
                      />

                    <View style={{ backgroundColor: backgroundColor}}>
                        <Text style={{marginLeft: 10, marginTop: 10, color: highLightColor }}>TÌM NHANH</Text>
                        <FlatList
                           horizontal={false}
                           
                           data={this.state.trendings}
                           keyExtractor={(item, index) => index.toString()}
                           ListEmptyComponent={this.listEmptyTrendings}
                           renderItem={this._renderTrendingItems}
                           />
                     </View>

                     <View style={{ paddingHorizontal: 10, backgroundColor: backgroundColor}}>
                         {this.state.animating && <View style={{ padding: 10 }}><ActivityIndicator size="large" /></View>}
                         <Viewport.Tracker>
                            <FlatList
                                  data={this.state.results}
                                  renderItem={this._renderItem}
                                  keyExtractor={(item, index) => item.id.toString()}
                                  initialNumToRender={5}
                                  removeClippedSubviews={true}
                                  windowSize={15}
                                  onEndReached={() => this.handleLoadMore()}
                                  onEndReachedThreshold={0.5}
                                  onMomentumScrollBegin={() => { this._onEndReachedCalledDuringMomentum = false; }}
                              />
                           </Viewport.Tracker>
                     </View>
              </View>
    )
  }

}

const styles = StyleSheet.create({
     trendings: {
         height: 30,
         justifyContent: 'center',
         alignItems:'center',
         marginHorizontal:10,
         marginTop: 10,
         borderWidth: 0.5,
         borderColor: '#C0C0C0',
         borderRadius: 5,
         overflow: 'hidden'
      },
  })

const mapStateToProps = (state) => {
    return {
        UI: state.UI
    }
}

export default connect(mapStateToProps)(SearchScreen)