import React from 'react';
import {
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    Image,
    Dimensions,
    InteractionManager
} from 'react-native';
import { Divider, Icon } from 'react-native-elements';
import { connect } from 'react-redux'
import { BaomoiText } from '../StyledText';
import moment from 'moment/min/moment-with-locales'
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

class Post1Pic extends React.PureComponent {
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

    render(){
        const item = this.props.item
        const { textColor, backgroundColor } = this.props.UI
        const index = this.props.index

        return(
            <View style={{padding: 10, height: 130, backgroundColor: backgroundColor}}>
                <TouchableWithoutFeedback
                    onPress={this.navigate}
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
                                <Comments numberOfComments={item.total_comments.approved}/>
                            </View>
                            <BaomoiText style={{fontSize: 17 ,fontWeight: 'bold', color: textColor, lineHeight: 25 }}>{item.title.plaintitle}</BaomoiText>
                        </View>
                        <FastImage
                            source={{uri :item.thumb || defaultImg}}
                            style={{height: 90, flex: 1, marginLeft: 5, borderRadius: 5, backgroundColor: '#DCDCDC'}}
                        />
                    </View>
                </TouchableWithoutFeedback>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        UI: state.UI
    }
}

export default connect(mapStateToProps)(Post1Pic)