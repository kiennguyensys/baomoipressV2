import React from 'react';
import {
  Text,
  View,
  Linking,
  Dimensions,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
  Modal,
  Image,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import WebView from 'react-native-webview';
import {Icon, Divider} from 'react-native-elements';
import axios from 'axios';
import VideoArticle from '../News/Video';
import { BaomoiText } from '../StyledText';
import { connect } from 'react-redux';
import moment from 'moment/min/moment-with-locales'
import Video from 'react-native-video';
import FastImage from 'react-native-fast-image';
import { api_url } from '../../constants/API.js';
import CommentList from './CommentList.js';
import ContentLoader from 'react-native-easy-content-loader';
import Ads from '../Ads/Ads';
import { Viewport } from '@skele/components';

moment.locale('vi');
const defaultImg = 'https://homestaymatch.com/images/no-image-available.png'
const loadingVideoPoster = 'https://i.ytimg.com/vi/f0ELmJi56T0/maxresdefault.jpg'

const screenWidth = Dimensions.get('window').width;

/**
 * Adds links to text with without HTML tags
 * 'This will turn into a link: http://www.facebook.com'
 * Use HTMLView for actual HTML.
 */

const VideoContent = React.memo(props => {
    if(props.src){
        return (
            <WebView
                  useWebKit={true}
                  style={{ flex:1, overflow: 'hidden', opacity: 0.99 }}
                  allowsFullscreenVideo={true}
                  source={{uri: props.src+"?autoplay=1" }}
                  startInLoadingState={true}
              />
        )
    }
    else return null
})

class VideoPlay extends React.PureComponent {
    constructor(){
      super()
      this.state= {
        paused: false,
        otherVideos : [],
      }
    }

    componentDidMount () {
      this.cancelTokenSource = axios.CancelToken.source()
      this.blurSubscription =
        this.props.navigation.addListener(
          'willBlur',
          () => {
              this.handlePlayAndPause()
          }
        )

      this.fetchVideos()
    }

    componentWillUnmount () {
      this.blurSubscription.remove()
      this.cancelTokenSource && this.cancelTokenSource.cancel()
    }

    getUri = (content) => {
        const { width } = Dimensions.get('window');
        // Check if nested content is a plain string
        if (typeof content.content.plaintext === 'string') {
          var result;
          // Split the content on space characters
          var words = content.content.plaintext.split(/\s/);

          // Loop through the words
          var contents = words.map((word,i) => {

            if (word.includes('youtube.com')){
                result = word.replace('src=', '').replace(new RegExp('"', 'g'), '')
            }

            if (word.includes('mp4=')) {
                const string = word.replace(new RegExp('mp4=', 'g'), '')
                              .replace("][/video]",'')
                              .replace(new RegExp('"', 'g'), '')
                result = string
            }

          });

          return result
        // The nested content was something else than a plain string
        // Return the original content wrapped in a <Text> component
        } else {
            console.log("can't find video source")
            return null
        }
    }

    fetchVideos = async() => {
       let Articles = []

       await axios.get(api_url + "posts?filter[post_format]=post-format-video&per_page=20",{
           cancelToken: this.cancelTokenSource.token
       })
       .then(res => res.data)
       .then(json => {
           json = json.filter((item, index) => item.id !== this.props.article.id)
           let new_index, new_article
           const max_length = (json.length >= 10) ? 10 : json.length
           while(Articles.length < max_length){
               new_index = Math.floor(Math.random() * json.length)
               new_article = json[new_index]
               json.splice(new_index, 1)
               Articles.push(new_article)
            }
       })

       this.setState({otherVideos : Articles})
     }

    handlePlayAndPause = () => {
        this.setState(prevState => ({
            paused: !prevState.paused
        }));
    }

    renderLoading = () => (
        <View style={{width: screenWidth, height: (screenWidth*9/16), backgroundColor: 'black', alignItems: 'center', justifyContent: 'center'}}>
            <ActivityIndicator size="large" />
        </View>
    )

    renderItem = ({item, index}) => (


        <View>
            <View style={{ borderBottomWidth: 1 , borderColor: '#e0e0e0'}}>
                 <View style={{ height: 130}}>
                     <TouchableWithoutFeedback
                         onPress={() => this.changeVideo(item)}
                         style={{flex: 1}}
                     >
                         <View style={{flex: 1, flexDirection: "row", alignItems:'center'}}>
                             <View style={{flex: 2}}>
                                 <View style={{flexDirection: "row", alignItems:'center'}}>
                                     {
                                       (item.taxonomy_source[0])?
                                          <BaomoiText style={{color: '#C0C0C0', fontSize: 14}}>{item.taxonomy_source[0].name} - {moment(item.modified).fromNow().replace("trước", "").replace("một", "1")}</BaomoiText>
                                       :
                                           <BaomoiText style={{color: '#C0C0C0', fontSize: 14}}>{moment(item.modified).fromNow().replace("trước", "").replace("một", "1")}</BaomoiText>
                                     }

                                     {
                                       (item.total_comments.approved !== 0)?
                                       <View style={{flexDirection: "row", alignItems: 'center', alignSelf: 'center'}}>
                                           <BaomoiText style={{fontSize: 14, color: '#C0C0C0'}}>- {item.total_comments.approved}</BaomoiText>
                                           <Icon name='comment' type="evilicon" color='#C0C0C0' size={14}/>
                                       </View> : <View></View>
                                     }
                                 </View>
                                 <BaomoiText style={{fontSize: 18,fontWeight: 'bold', lineHeight: 26.5, color: this.props.UI.textColor}}>{item.title.plaintitle}</BaomoiText>
                             </View>
                             <View style={{height: 90, flex: 1, justifyContent:'flex-end'}}>
                                 <FastImage
                                     source={{uri :item.thumb || defaultImg}}
                                     style={{flex: 1, marginLeft: 5, borderRadius: 5, backgroundColor: 'black'}}
                                     />
                                 <View style={{position:'absolute', opacity:0.8, left: 5}}>
                                   <Icon
                                       size={40}
                                       name='play-circle'
                                       type='material-community'
                                       color='white'
                                   />
                                 </View>
                             </View>
                         </View>
                     </TouchableWithoutFeedback>
                 </View>
            </View>
            {(index == 1) &&
             <Ads adPosition="Video đề xuất thứ 2" navigation={this.props.navigation} isCurrentFocused={this.props.isCurrentFocused} />
            }
            {(index == 5) &&
             <Ads adPosition="Video đề xuất thứ 6" navigation={this.props.navigation} isCurrentFocused={this.props.isCurrentFocused} />
            }
            {(index == 9) &&
             <Ads adPosition="Video đề xuất thứ 10" navigation={this.props.navigation} isCurrentFocused={this.props.isCurrentFocused} />
            }
        </View>

     )

  changeVideo = (item) => {
      this.props.updateArticle(item)
  }

    listEmptyComponent = () => (
        <ContentLoader
            reverse
            title={false}
            avatar
            aShape='square'
            aSize={90}
            listSize={3}
            pRows={3}
            pWidth={[50, 180, 180]}
            containerStyles={{ alignItems: 'center', height: 140 }}
        />
    )

  render() {
      const { textColor, backgroundColor, textSizeRatio, highLightColor } = this.props.UI
    return (
           <View style={styles.container}>
                <View style={styles.videoContainer}>
                <VideoContent src={this.getUri(this.props.article)} paused={this.state.paused} handlePlay={this.handlePlayAndPause}/>
                </View>
                      <ScrollView style={{flex:1, padding: 10, backgroundColor: backgroundColor}} ref={ref => this.props.setScrollViewRef(ref)}>

                              {this.props.article &&
                                <View>
                                  <BaomoiText style={{color: '#C0C0C0', fontSize: 16*textSizeRatio, marginBottom: 5}}>{this.props.article.taxonomy_source[0].name} - {moment(this.props.article.modified).fromNow().replace("trước", "").replace("một", "1")}</BaomoiText>
                                  <BaomoiText style={{fontSize: 18*textSizeRatio, lineHeight: 26.5*textSizeRatio, fontWeight: 'bold', color: textColor}}>{this.props.article.title.plaintitle}</BaomoiText>
                                </View>
                               }
                              <Divider style={{marginTop: 10, marginBottom: 10}}/>
                              <BaomoiText style={{fontSize: 16 * textSizeRatio,color: highLightColor, marginBottom: 15, fontWeight:'500'}}>TIN KHÁC</BaomoiText>
                              <Viewport.Tracker>
                                <FlatList
                                  data={this.state.otherVideos}
                                  extraData={this.state.otherVideos}
                                  renderItem={this.renderItem}
                                  ListEmptyComponent={this.listEmptyComponent}
                                  keyExtractor={(item, index) => item.id.toString()}
                                  />
                              </Viewport.Tracker>
                              <CommentList article={this.props.article} updateArticle={this.props.updateArticle} navigation={this.props.navigation} setModalVisible={this.props.setCommentModalVisible} />
                      </ScrollView>
           </View>
    );
  }

}

const mapStateToProps = (state) => {
    return{
        UI: state.UI,
    }
}

export default connect(mapStateToProps)(VideoPlay)

const styles = StyleSheet.create({
   container: {
      marginTop: 40,
      flex: 1,
      justifyContent: 'center',
   },
   videoContainer: {
      width: screenWidth,
      height : screenWidth *9/16,
   }
});
