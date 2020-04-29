import React from 'react';
import {
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    Image,
    Dimensions,
    FlatList,
    Text,
    InteractionManager
} from 'react-native';
import { Divider, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { BaomoiText } from '../StyledText';
import moment from 'moment/min/moment-with-locales'
import BannerAd from '../Ads/BannerAd';
import FastImage from 'react-native-fast-image';

var { width, height } = Dimensions.get('window');

moment.locale('vi');
const defaultImg = 'https://homestaymatch.com/images/no-image-available.png'

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

class FeaturedPost extends React.PureComponent {

    navigate = () => {
        requestAnimationFrame(() => {
            if(!this.props.shouldPushAnotherScreen){
                this.props.navigation.navigate("Article", {
                    Article: this.props.item
                })
            } else {
                this.props.navigation.push("Article", {
                    Article: this.props.item
                })
            }
        })
    }

    navigateOtherPosts = (item) => {
        requestAnimationFrame(() => {
            this.props.navigation.navigate("Article", {
                            Article: item
                        })
        })
    }

    render(){
        const item = this.props.item
        const {textColor, backgroundColor, textSizeRatio } = this.props.UI
        const index = this.props.index
        return(
            <View style={{backgroundColor: backgroundColor}}>
                <TouchableWithoutFeedback
                    onPress={this.navigate}
                >
                    <View>
                        <View style={{flexDirection: "row", justifyContent: 'space-between', padding: 10, alignItems: "center"}}>
                            <View style={{flexDirection: 'row', alignItems:'center'}}>
                                <View style={{backgroundColor: 'red', width: 8, height: 8, borderRadius: 4, marginBottom: 3}}></View>
                                <BaomoiText style={{fontWeight: "bold",marginLeft:5, color: textColor, fontSize: 15}}>TIÊU ĐIỂM</BaomoiText>
                            </View>
                            <Icon
                                name='angle-right'
                                type='font-awesome'
                                color='#696969'
                            />
                        </View>
                        <View style={{marginTop: 5}}>
                            <FastImage
                                source={{uri: item.thumb || defaultImg, priority: FastImage.priority.normal}}
                                style= {{height: 180, width: width, backgroundColor: '#DCDCDC'}}
                            />
                            <View style={{padding: 10}}>
                                <View style={{flexDirection: "row", alignItems:'center'}}>

                                    {
                                      (item.taxonomy_source[0])?
                                         <BaomoiText style={{color: '#C0C0C0', fontSize: 14}}>{item.taxonomy_source[0].name} - {moment(item.modified).fromNow().replace("trước", "").replace("một", "1")}</BaomoiText>
                                      :
                                          <BaomoiText style={{color: '#C0C0C0', fontSize: 14}}>{moment(item.modified).fromNow().replace("trước", "").replace("một", "1")}</BaomoiText>
                                    }
                                    <Comments numberOfComments={item.total_comments.approved}/>
                                </View>
                                <BaomoiText style={{fontSize: 22, fontWeight: 'bold', color: textColor, lineHeight: 32 }}>{item.title.plaintitle}</BaomoiText>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                <View style={{padding: 10}}>
                    <FlatList
                        data={item.otherFeaturedPosts}
                        renderItem={({ item, index }) =>
                            <TouchableWithoutFeedback
                                onPress={() => this.navigateOtherPosts(item)}
                                key={item.id}
                            >
                                <View style={{flexDirection: "row", marginBottom: 3, alignItems: "flex-start"}}>
                                    <Icon
                                        type="entypo"
                                        name="dot-single"
                                    />
                                <BaomoiText style={{fontSize: 16, lineHeight: 24, textAlign: "justify", color: '#696969', marginLeft: 5,flex: 1, flexWrap: 'wrap'}}>{item.title.plaintitle}</BaomoiText>
                                </View>
                            </TouchableWithoutFeedback>
                        }
                        keyExtractor={item => item.id.toString()}
                    />
                </View>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        UI: state.UI
    }
}

export default connect(mapStateToProps)(FeaturedPost)