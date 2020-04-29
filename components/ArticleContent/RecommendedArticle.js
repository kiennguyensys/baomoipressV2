import React from 'react';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    FlatList,
    SafeAreaView,
    Dimensions,
    InteractionManager
} from 'react-native';
import { BaomoiText } from '../StyledText';
import { Divider, Icon } from 'react-native-elements';
import Moment from 'moment';
import { connect } from 'react-redux';
import axios from 'axios';
import FastImage from 'react-native-fast-image';
import moment from 'moment/min/moment-with-locales'
const defaultImg = 'https://homestaymatch.com/images/no-image-available.png'


const screenWidth = Dimensions.get('window').width;
const videoHeightRatio = 9/16;
moment.locale('vi');


class RecommendedArticle extends React.PureComponent{

  componentDidMount(){
    this.cancelTokenSource = axios.CancelToken.source()
  }

  navigate = () => {
      requestAnimationFrame(() => {
          this.props.navigation.push("Article", {
                            Article: this.props.item,
                            isVideo: (this.props.item.format === 'video') ? true : false,
          })
      })
  }

  componentWillUnmount() {

     this.cancelTokenSource && this.cancelTokenSource.cancel()
  }
  render(){

    const item = this.props.item
    const { textColor, backgroundColor } = this.props.UI

    if(item.content.images.length >= 3)
        return(
            <View>
                <View style={{flex: 1, flexDirection: 'column', paddingHorizontal: 10, paddingVertical: 20, backgroundColor: backgroundColor}}>
                    <TouchableWithoutFeedback style={{flex: 2}} onPress={this.navigate}>
                        <View style={{flexDirection: "row", marginBottom: 7}}>
                                <FastImage
                                    source={{uri: item.content.images[0] || defaultImg}}
                                    style= {{flex:1, height: 90, borderRadius: 5, backgroundColor: '#DCDCDC'}}
                                />
                                <FastImage
                                    source={{uri: item.content.images[1] || defaultImg}}
                                    style= {{flex:1, height: 90, marginLeft: 5, borderRadius: 5, backgroundColor: '#DCDCDC'}}
                                />
                                <FastImage
                                    source={{uri: item.content.images[2] || defaultImg}}
                                    style= {{flex:1, height: 90, marginLeft: 5, borderRadius: 5, backgroundColor: '#DCDCDC'}}
                                />
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback style={{flex: 1 }} onPress={this.navigate}>
                        <View>
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
                            <BaomoiText style={{fontSize: 17 ,fontWeight: 'bold', color: textColor, lineHeight: 25}} numberOfLines={3}>{item.title.plaintitle}</BaomoiText>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <Divider style={{ backgroundColor: '#e0e0e0'}} />
            </View>
        )
    else return(
        <TouchableWithoutFeedback
            onPress={this.navigate}
        >
            <View>
                  <View style={{flex: 1, flexDirection: "row", alignItems:'center', padding: 10, height: 130}}>
                      <View style={{flex: 2}}>
                          <View style={{flexDirection: "row", alignItems:'center'}}>
                              {
                                (item.taxonomy_source[0])?
                                   <BaomoiText style={{color: '#C0C0C0', fontSize: 15}}>{item.taxonomy_source[0].name} - {moment(item.modified).fromNow().replace("trước", "").replace("một", "1")}</BaomoiText>
                                :
                                    <BaomoiText style={{color: '#C0C0C0', fontSize: 15}}>{moment(item.modified).fromNow().replace("trước", "").replace("một", "1")}</BaomoiText>
                              }
                              <View style={{justifyContent:'center'}}>
                                  {
                                    (item.total_comments.approved !== 0)?
                                    <View style={{flexDirection: "row", alignItems: "center"}}>
                                        <Text style={{fontSize: 12, color: '#c0c0c0'}}> - {item.total_comments.approved}</Text>
                                        <Icon containerStyle={{marginTop: -2}} name='comment' type="evilicon" color='#c0c0c0' size={20}/>
                                    </View> : <View></View>
                                  }
                               </View>
                          </View>
                          <BaomoiText style={{fontSize: 17, lineHeight: 25, fontWeight: 'bold', color: textColor}}>{item.title.plaintitle}</BaomoiText>
                      </View>
                      <FastImage
                          source={{uri :item.thumb || defaultImg}}
                          style={{height: 90, flex: 1, marginLeft: 5, borderRadius: 5, backgroundColor: '#DCDCDC'}}
                      />
                  </View>

                <Divider style={{ backgroundColor: '#e0e0e0'}} />
            </View>

        </TouchableWithoutFeedback>
    )

    }
}

const mapStateToProps = (state)=>{
    return{
        UI: state.UI
    }
}

export default connect(mapStateToProps)(RecommendedArticle)