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
    Dimensions
} from 'react-native';
import { BaomoiText } from '../StyledText';
import { Divider, Icon } from 'react-native-elements';
import Moment from 'moment';
import { connect } from 'react-redux';
import { Viewport } from '@skele/components';
import Ads from '../Ads/Ads.js';
import RecommendedArticle from './RecommendedArticle'
import { api_url } from '../../constants/API.js';
import axios from 'axios';
import moment from 'moment/min/moment-with-locales'
import ContentLoader from 'react-native-easy-content-loader';

const defaultImg ='https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png';



const screenWidth = Dimensions.get('window').width;
const videoHeightRatio = 9/16;
moment.locale('vi');

const shuffle = (array) => {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
    }

    return array;
}

const Placeholder = () =>
  <View />

const VAAdsWithPlaceholder =
  Viewport.Aware(
    Viewport.WithPlaceholder(Ads, Placeholder)
  )



class RecommendedList extends React.PureComponent{
  constructor(props){
    super(props);
    this.state = {
      Articles : [],
    }
  }

  componentDidMount(){
    this.cancelTokenSource = axios.CancelToken.source()
    if(this.props.article.format === 'video') this.fetchVideos()
    else this.fetchArticles()
  }

  fetchVideos = () => {

    axios.get(api_url + "posts?filter[post_format]=post-format-video&per_page=10",{
        cancelToken: this.cancelTokenSource.token
    })
    .then(res => res.data)
    .then(json => {

      while(this.state.Articles.length < 5){

        var is_duplicated = false;
        var new_article = json[Math.floor(Math.random() * json.length)]
        this.state.Articles.forEach((article) => {
          if(article.id === new_article.id || this.props.article.id === new_article.id) is_duplicated = true
        })
        if(!is_duplicated)
       this.setState({
        Articles: this.state.Articles.concat(new_article),
        })

      }
    })

  }

  fetchArticles = async() => {
      let Articles = []
      const tag_length = this.props.article.tags.length;

      if(tag_length != 0){
          const first_tag = Math.floor(Math.random() * tag_length);
          let second_tag = Math.floor(Math.random() * tag_length);
          while(second_tag == first_tag && tag_length > 1) second_tag = Math.floor(Math.random() * tag_length)

          axios.get(api_url + "posts?tags="+ this.props.article.tags[first_tag].toString() + "," + this.props.article.tags[second_tag].toString(),{
              cancelToken: this.cancelTokenSource.token
          })
              .then(res => res.data)
              .then(json => {
                  json = json.filter((item, index) => item.id !== this.props.article.id)

                  if(json.length > 0){
                      const first_article_index = Math.floor(Math.random() * json.length)
                      const first_article = json[first_article_index]
                      Articles.push(first_article)

                      if(json.length > 1){
                          json.splice(first_article_index, 1)
                          const second_article_index = Math.floor(Math.random() * json.length)
                          const second_article = json[second_article_index]
                          Articles.push(second_article)
                      }
                  }
              })
              .catch(err => console.log(err))
      }

      //fill posts up to 10 items
      await axios.get(api_url + "posts?per_page=40",{
          cancelToken: this.cancelTokenSource.token
      })
          .then(res => res.data)
          .then(json => {
              json = json.filter((item, index) => item.id !== this.props.article.id)
              Articles.map((article, index) => {
                  json = json.filter((item, index) => item.id !== article.id)
              })

              let new_index, new_article

              while(Articles.length < 10) {
                  new_index = Math.floor(Math.random() * json.length)
                  new_article = json[new_index]
                  json.splice(new_index, 1)
                  Articles.push(new_article)
              }

          })
          .catch(err => console.log(err))

      this.setState({Articles : Articles})
  }

  shuffle = (array) => {
      var currentIndex = array.length, temporaryValue, randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
      }

      return array;
  }


  componentWillUnmount() {
     this.cancelTokenSource && this.cancelTokenSource.cancel()
  }

  listEmptyComponent = () => (
      <ContentLoader
          reverse
          title={false}
          avatar
          aShape='square'
          aSize={90}
          listSize={10}
          pRows={3}
          pWidth={[50, 180, 180]}
          containerStyles={{ alignItems: 'center', height: 140 }}
      />
  )

  renderItem = ({item, index}) => {
      return(
          <View>
            <RecommendedArticle item={item} navigation={this.props.navigation}/>
            {(index == 1) &&
             <Ads adPosition="Tin đề xuất thứ 2" navigation={this.props.navigation} isCurrentFocused={this.props.isCurrentFocused} />
            }
            {(index == 5) &&
             <Ads adPosition="Tin đề xuất thứ 6" navigation={this.props.navigation} isCurrentFocused={this.props.isCurrentFocused} />
            }
            {(index == 9) &&
             <Ads adPosition="Tin đề xuất thứ 10" navigation={this.props.navigation} isCurrentFocused={this.props.isCurrentFocused} />
            }
          </View>
      )
  }

    render(){
        return(
            <View style={{padding: 10}}>
                <View>
                    <BaomoiText style={{fontSize: 16* this.props.UI.textSizeRatio, color:this.props.UI.highLightColor, marginBottom: 15, fontWeight:'500'}}>TIN KHÁC</BaomoiText>
                    <FlatList
                        data={this.state.Articles}
                        extraData={this.state}
                        renderItem={this.renderItem}
                        initialNumToRender={5}
                        windowSize={15}
                        keyExtractor={(item, index) => item.id.toString()}
                        ListEmptyComponent={this.listEmptyComponent}
                    />
                </View>
            </View>
        )
    }
}

const mapStateToProps = (state)=>{
    return{
        UI: state.UI,
    }
}

export default connect(mapStateToProps)(RecommendedList)
