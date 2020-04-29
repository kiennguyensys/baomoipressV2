import React from 'react';
import {
    TouchableWithoutFeedback,
    View,
    Image,
    Dimensions,
    StyleSheet,
    InteractionManager,
} from 'react-native';
import { Divider, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { BaomoiText } from '../StyledText';
import moment from 'moment/min/moment-with-locales'
import BannderAd from '../Ads/BannerAd';
import FastImage from 'react-native-fast-image';
var { width, height } = Dimensions.get('window');
moment.locale('vi');
const defaultImg = 'https://www.egidegypt.com/wp-content/uploads/2019/12/no-image.png'

const Comments = React.memo(props => {
    if(props.numberOfComments != 0){
        return(
                <View style={{flexDirection: "row", alignItems: "center"}}>
                <BaomoiText style={{color: '#C0C0C0', fontSize: 15}}> - {props.numberOfComments} </BaomoiText>
                <Icon containerStyle={{marginTop: -2}} name='comment' type="evilicon" color='#C0C0C0' size={20}/>
                </View>
        )
    }else{
        return null;
    }
})

class Video extends React.PureComponent {

    navigate = () => {
        requestAnimationFrame(() => {
            if(!this.props.shouldPushAnotherScreen){
                this.props.navigation.navigate("Article", {
                    Article: this.props.item,
                    isVideo: true
                })
            } else {
                this.props.navigation.push("Article", {
                    Article: this.props.item,
                    isVideo: true
                })
            }
        })
    }

    render(){
        const item = this.props.item
        const { textColor, backgroundColor } = this.props.UI
        const index = this.props.index
        return(
                <TouchableWithoutFeedback
                    activeOpacity={1}
                    onPress={this.navigate}
                >
                    <View style={{flex: 1, flexDirection: "column", paddingVertical: 20, backgroundColor: backgroundColor }}>
                          <View style={{alignItems: 'center', justifyContent:'center'}}>
                              <FastImage
                                key={index}
                                style={{ width: width - 20, height: (width-20) * 9/16, borderRadius: 5, overflow: 'hidden', overlayColor: backgroundColor, backgroundColor: 'black'}}
                                source={{ uri: item.thumb || defaultImg }}
                                />
                              <View style={{position:'absolute', opacity:0.8}}>
                                <Icon
                                    size={70}
                                    name='play-circle'
                                    type='material-community'
                                    color='white'
                                />
                              </View>
                          </View>
                        <View style={{marginLeft: 10}}>
                            <View style={{flexDirection: "row", alignItems:'center', marginTop: 8, justifyContent:'flex-start'}}>
                                {
                                  (item.taxonomy_source[0])?
                                     <BaomoiText style={{color: '#C0C0C0', fontSize: 14}}>{item.taxonomy_source[0].name} - {moment(item.modified).fromNow().replace("trước", "").replace("một", "1")}</BaomoiText>
                                  :
                                      <BaomoiText style={{color: '#C0C0C0', fontSize: 14}}>{moment(item.modified).fromNow().replace("trước", "").replace("một", "1")}</BaomoiText>
                                }
                                <Comments numberOfComments={item.total_comments.approved}/>
                            </View>
                            <BaomoiText style={{fontSize: 17, fontWeight: 'bold', lineHeight: 25, color: textColor}}>{item.title.plaintitle}</BaomoiText>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
        )


    }
}

const mapStateToProps = (state) => {
    return {
        UI: state.UI
    }
}

export default connect(mapStateToProps)(Video)