import React from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    FlatList,
    SafeAreaView,
    Dimensions
} from 'react-native';
import Video from './Video';
import FeaturedPost from './FeaturedPost';
import Post3Pic from './Post3Pic';
import Post1Pic from './Post1Pic';
import { ListItem, List, Tile, Card, Divider, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { BaomoiText } from '../StyledText';
import moment from 'moment/min/moment-with-locales'
import Ads from '../Ads/Ads.js';
import axios from 'axios';

const defaultImg ='https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png';
var { width, height } = Dimensions.get('window');
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

const Post = React.memo(props => {
    const item = props.item
    const index = props.index
    const position = props.position
    const navigation = props.navigation
    const shouldPushAnotherScreen = props.shouldPushAnotherScreen

    if(item.format === "video"){
        // post with video format
        return <Video item={item} index={index} shouldPushAnotherScreen={shouldPushAnotherScreen} navigation={navigation} />
    }else{
        if((item.featured_post == "on") && (item.otherFeaturedPosts) && (position === "List Trang Chủ")){
            if(index === 0){
                return (
                        <FeaturedPost item={item} index={index} navigation={navigation} shouldPushAnotherScreen={shouldPushAnotherScreen} />
                )

            }else{
                // return null after first render of featured post
                return null
            }
        }else{
            if (item.content.images.length >= 3){
                // post with more than 3 pic
                return <Post3Pic item={item} index={index} navigation={navigation} shouldPushAnotherScreen={shouldPushAnotherScreen} />
            }else {
                // post with less than 3 pic
                return <Post1Pic item={item} index={index} navigation={navigation} shouldPushAnotherScreen={shouldPushAnotherScreen} />
            }
        }

    }
})

class Articles extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            numberOfComments: this.props.item.total_comments ? this.props.item.total_comments.approved : 0
        }
    }

    componentWillUnmount() {
        this.cancelTokenSource && this.cancelTokenSource.cancel()
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(this.props.item !== nextProps.item){
            return true
        }
        if(this.props.isCurrentFocused !== nextProps.isCurrentFocused){
            return true
        }
        return false
    }

    render() {
        const item = this.props.item
        const index = this.props.index
        const position = this.props.position
        const randomAdsOrder = item.acf.randomAdsOrder
        const shouldPushAnotherScreen = this.props.shouldPushAnotherScreen || false //From Source Screen
        const { textColor, backgroundColor } = this.props.UI

        return(
            <View>
                <Post item={item} index={index} navigation={this.props.navigation} shouldPushAnotherScreen={shouldPushAnotherScreen} position={position} />

                <Divider style={{ backgroundColor: '#e0e0e0'}} />

                {(index % 6 == 0) &&
                 <Ads navigation={this.props.navigation} randomAdsOrder={randomAdsOrder} preTriggerRatio={0} adPosition={position} isCurrentFocused={this.props.isCurrentFocused} />
                }
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        UI: state.UI
    }
}

export default connect(mapStateToProps)(Articles)