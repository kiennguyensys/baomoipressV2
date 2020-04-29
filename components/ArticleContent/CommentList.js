import React from 'react';
import { BaomoiText } from '../StyledText';
import { customFont } from '../../constants/Fonts.js';
import {
    Image,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    FlatList,
    TextInput,
    Dimensions,
    Alert
} from 'react-native';
import { Avatar, Divider } from 'react-native-elements';
import axios from 'axios';
import { api_url } from '../../constants/API.js';
import { connect } from 'react-redux';
import moment from 'moment/min/moment-with-locales'
moment.locale('vi');
import HTML from 'react-native-render-html';
import SignInModal from '../Modals/SignInModal';
import FastImage from 'react-native-fast-image';

class CommentList extends React.PureComponent{
    _isMounted = false;
    state = {comments: [], page: 1, signInVisible: false}

  componentDidMount(){
    this.cancelTokenSource = axios.CancelToken.source()
    this._isMounted = true;
    if(this.props.article.total_comments.approved > 0) this.fetchComment()
  }

  fetchComment = () => {
    axios.get(api_url + "comments?post="+this.props.article.id.toString() + '&per_page=10&page=' + this.state.page, {
        cancelToken: this.cancelTokenSource.token
    })
    .then(res => {
      if(this._isMounted) this.setState({comments : [...this.state.comments, ...res.data] })
    })
    .catch(err => console.log(err))
  }

  renderComment = ({item, index}) => {
    if(item.parent == 0) return this.renderThreadedComments({item, index})
    else return null
  }

  renderThreadedComments = ({item, index}) => {
    const childs = this.state.comments.filter(obj => obj.parent == item.id)
        return(
          <View>
              {this.commentView(item)}
              {(childs.length > 0) ?
                <FlatList
                   listKey={item.id}
                   style={styles.child}
                   data={childs}
                   keyExtractor={(childItem, childIndex) => childItem.id.toString()}
                   renderItem={this.renderThreadedComments}
                 /> : <View></View>}
          </View>
        );

  }

    setSignInModalVisible = (visible) => {
        this.setState({signInVisible : visible})
    }


    handleOpenModal = (item, e) => {
        if(this.props.user.id && this.props.user.custom_avatar.length && (this.props.user.name !== "Guest")){
            this.props.setModalVisible(true, item.id)
        } else if(this.props.user.id){
            Alert.alert(
              'Thông báo',
              'Cần cập nhật tên và avatar để bình luận',
              [
                {text: 'OK', onPress: () => this.props.navigation.navigate("UserProfileEdit", { UI: this.props.UI })},
              ],
              {cancelable: false},
            )
        } else {
            this.setState({signInVisible: true})
        }
    }

  openWebView = (link) => {
      this.props.navigation.navigate("WebView", { uri: link })
  }

  commentView = (item) => {
    return (
            <View style={styles.container}>

              <SignInModal visible={this.state.signInVisible} setModalVisible={this.setSignInModalVisible} navigation={this.props.navigation} />


              <FastImage
                source={{uri: item.custom_avatar || item.author_avatar_urls['96']}}
                style={styles.image}
                resizeMode={FastImage.resizeMode.cover}
              />

              <View style={styles.content}>

                  <HTML
                    html={item.content.rendered + '<info>'+ item.author_name + ' - '+ moment(item.date).fromNow().replace("trước", "").replace("một", "1") + '</info>'}
                    imagesMaxWidth={Dimensions.get('window').width-20}
                    onLinkPress={(event, href)=>{
                      this.openWebView(href)
                    }}
                    ignoredStyles={['width', 'height', 'max-width']}
                    tagsStyles={{info:{fontSize: 12*this.props.UI.textSizeRatio, color:'#808080'}, p: {margin: 0}}}
                    baseFontStyle={{fontSize: 18*this.props.UI.textSizeRatio, fontFamily: customFont, color: this.props.UI.textColor}}/>

                    <TouchableOpacity style={{marginTop:5 }} onPress={()=> this.handleOpenModal(item)}>
                      <Text style={{color: '#808080', fontSize: 14}}>Trả lời</Text>
                    </TouchableOpacity>

              </View>
            </View>

      );
  }

  handleLoadMore = () => {
      this.setState({
          page: this.state.page + 1,
      }, () => this.fetchComment())
  }

  componentDidUpdate(prevProps) {
        if((this.props.article.id !== prevProps.article.id) || (this.props.article.total_comments.approved !== prevProps.article.total_comments.approved) || (this.props.UI !== prevProps.UI)) {
            this.setState({
                comments : [],
                page: 1,
            }, () => this.fetchComment())
        }
  }

  componentWillUnmount() {
     this._isMounted = false;
     this.cancelTokenSource && this.cancelTokenSource.cancel()
  }

  render(){
    return(
        <View>
            {
            (this.state.comments.length != 0) ?
              <View style={{padding: 10}}>
                <BaomoiText style={{fontSize : 18, marginTop: 20, color: this.props.UI.highLightColor }}>Bình luận mới nhất</BaomoiText>
                 <FlatList
                      style={styles.root}
                      data={this.state.comments}
                      extraData={this.state.comments}
                      keyExtractor={(item, index) => item.id.toString()}
                      removeClippedSubviews={true}
                      windowSize={16}
                      initialNumToRender={5}
                      renderItem={this.renderComment}
                      onEndReached={this.handleLoadMore}
                      onEndReachedThreshold={0.2}
                    />
                  </View> : <View></View>
                      }
        </View>

    )
  }
}

const styles = StyleSheet.create({
  root: {
    marginTop:10,
  },
  child:{
    marginTop:10,
    marginLeft: 20
  },
  container: {
    paddingLeft: 19,
    paddingRight: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  content: {
    marginLeft: 10,
    flex: 1,
    alignItems:'flex-start'
  },
  contentHeader: {

    marginBottom: 6,
    justifyContent:'center'
  },
  image:{
    width:30,
    height:30,
    borderRadius:5,
    marginLeft:5
  },
  time:{
    color:"#808080",
    marginLeft: 10,
  },
  name:{
    fontSize:16,
    fontWeight:"bold",
  },
  dot:{
    width:1,
    height:1,
    backgroundColor: '#696969',
    marginLeft: 5,
  }
});

const mapStateToProps = (state) => {
    return {
        UI: state.UI,
        user: state.session.user,
        userToken: state.session.token
    }
}

export default connect(
    mapStateToProps
)(CommentList)
