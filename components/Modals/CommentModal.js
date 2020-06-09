import React from 'react';
import { Text, View,Keyboard,TextInput, Dimensions, WebView, StyleSheet, TouchableOpacity, TouchableHighlight, Platform,Image,Modal, Alert} from 'react-native';
import { BaomoiText } from '../StyledText';
import SignInModal from './SignInModal'
import {Icon} from 'react-native-elements';
import { connect } from 'react-redux';
import axios from 'axios';
import { api_url } from '../../constants/API.js';
import { ShareDialog } from 'react-native-fbsdk';
import Ads from '../Ads/Ads.js';
import FastImage from 'react-native-fast-image';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

class CommentModal extends React.PureComponent{
  constructor(){
    super()
    this.textInput = null
    this.state = {
      signInVisible : false,
      text: '',
      keyboardHeight: 0,
    }
  }

  componentDidMount() {
    this.cancelTokenSource = axios.CancelToken.source()
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow.bind(this),
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide.bind(this),
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    this.cancelTokenSource && this.cancelTokenSource.cancel()
  }

  componentDidUpdate(prevProps) {
      if((prevProps.modalVisible !== this.props.modalVisible) && this.props.modalVisible) {
          this.textInput.blur();

          setTimeout(() => {
            this.textInput.focus();
          }, 100);
      }
  }

  _keyboardDidShow(e) {
    this.setState({ keyboardHeight: e.endCoordinates.height })
  }

  _keyboardDidHide() {
    this.setState({ keyboardHeight: 0 })
  }

  setSignInModalVisible = (visible) => {
    this.setState({signInVisible : visible})
  }

  submitComment = () => {
      if(this.state.text.split(" ").length >= 3)
      {

          this.setState({text: ''}, () => this.props.setModalVisible(false, 0))

          axios({
              method: 'POST',
              url: api_url + "comments",
              data: {
                post: this.props.article.id,
                content: this.state.text,
                parent : this.props.commentParent
              },
              headers: {'Authorization': 'Bearer ' + this.props.userToken},
          },{
              cancelToken: this.cancelTokenSource.token
          })
          .then(res => {
              Alert.alert('Thành công! Bình luận đang được duyệt')
              this.props.updateArticle()
          })
          .catch(err => console.log(err))

          axios({
              method: "GET",
              url: api_url + "add_exp?ammount=1&action_type=comments&id=" + this.props.user.id.toString(),
          },{
              cancelToken: this.cancelTokenSource.token
          })

      } else Alert.alert('Bình luận quá ngắn')
  }

    handleOpenModal = () => {
        if(this.props.user.id && this.props.user.custom_avatar.length && (this.props.user.name !== "Guest")){
            this.props.setModalVisible(true, 0)
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

    onShare = () => {
        const shareLinkContent = {
            contentType: 'link',
            contentUrl: this.props.article.link,
            contentDescription: 'Cùng đọc tin tức hot và được cộng xu từ Báo mới Press',
        };

        // Share the link using the share dialog.

        ShareDialog.canShow(shareLinkContent).then(
            function(canShow) {
                if (canShow) {
                    return ShareDialog.show(shareLinkContent);
                }
            }
        ).then(
            function(result) {
                if (result.isCancelled) {
                    console.log('Share cancelled');
                } else {
                    console.log('Share success');
                    axios({
                        method: "GET",
                        url: api_url + 'add_exp?ammount=5&action_type=social_sharing&id=' + this.props.user.id.toString(),
                    }, {
                        cancelToken: this.cancelTokenSource.token
                    })
                }
            },
            function(error) {
                console.log('Share fail with error: ' + error);
            }
        );
    }


  render(){
    let adPosition;
    if(this.props.article)
        adPosition = (this.props.article && this.props.article.format === 'video') ? "Hộp Bình Luận Video" : "Hộp Bình Luận Bài Viết"

    return (
      <View >

          {this.props.article &&
          <Ads adPosition={adPosition} navigation={this.props.navigation} isCurrentFocused={this.props.isCurrentFocused} shouldHideDivider shouldHideSpaceAround />
          }

          <View style={styles.BottomView}>
            <View style={{flex: 1, alignItems: 'center'}}>
              {
                (this.props.user.id) ?
                <FastImage
                    style={{width: 30, height: 30, borderRadius: 2, borderWidth:1, borderColor: '#99CCFF'}}
                    source={{uri : this.props.user.custom_avatar || this.props.user.avatar_urls['96']}}
                    resizeMode={FastImage.resizeMode.cover}
                /> :
                <Icon
                  name='pencil'
                  type='evilicon'
                  size={30}
                  color='#696969'
                  />
              }

            </View>
            <View style={{flex : 3}}>
              <TouchableOpacity style={styles.commentButton} onPress={this.handleOpenModal}>
                <Text style={{color: '#C0C0C0', fontSize: 14}}>Nhập bình luận ...</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={{flex : 1, alignItems:'flex-start'}} onPress={() => this.props.scrollToEnd()}>
                <View style={{marginRight: 10}}>
                    <Icon
                      name='comment'
                      type='octicon'
                      size={25}
                      color='#696969'
                      />
                </View>
                <View style={{width: 20, height: 20, backgroundColor:'red', borderRadius: 20/2, justifyContent:'center', left: 15, top: -5,
                               position:'absolute'}}>
                  <Text style={{color: 'white', textAlign:'center', fontSize: 8, fontWeight:'bold'}}>{this.props.article && this.props.article.total_comments.approved}</Text>
                </View>


            </TouchableOpacity>

            <TouchableOpacity style={{flex : 1, alignItems:'flex-start'}} onPress={this.onShare}>
                <View>
                    <Icon
                      name='share-2'
                      type='feather'
                      color='#696969'
                      size={25}
                    />
                </View>

            </TouchableOpacity>



          </View>

          <Modal
             transparent={true}
             visible={this.props.modalVisible}
             onRequestClose={() => this.props.setModalVisible(false, 0)}
             >
            <View>
                 <TouchableOpacity style={{
                   backgroundColor:'black',
                   opacity: 0.7,
                   height: screenHeight - this.state.keyboardHeight- (Platform.OS == "ios" ? 150 : 170)}}
                   onPress={() => this.props.setModalVisible(false, 0)}>

                 </TouchableOpacity>
                 <View style={{
                     height: 150,
                     backgroundColor: 'white',
                     justifyContent:'center',
                     padding: 10,
                   }}>

                    <View style={{flex: 3}}>
                      <TextInput
                        style={{height: 80, backgroundColor:'#C0C0C0', borderRadius: 5, padding: 5}}
                        onChangeText={(text) => this.setState({text: text})}
                        ref={(input) => { this.textInput = input; }}
                        value={this.state.text}
                        textAlignVertical={'top'}
                        multiline={true}
                        placeholder='Lời bình luận hay được ưu tiên hiển thị'
                        placeholderTextColor='#606060'
                      />
                    </View>

                    <View style={{flex: 1, flexDirection: 'row', alignItems:'center', marginBottom: 5}}>
                      <View style={{flex : 3, alignItems:'flex-start', justifyContent:'center'}}>
                        <Text style={{color: '#606060', fontSize: 12}}>Bình luận không nói tục, chửi bậy</Text>
                      </View>
                      <View style={{flex : 1, alignItems:'center'}}>
                       <TouchableHighlight
                        style={{marginLeft: 20, width: 70, height:30, borderRadius:5, backgroundColor: 'red',
                                alignItems:'center', justifyContent:'center',marginRight: 10}}
                         onPress={() => {
                           this.submitComment()
                         }}>
                            <BaomoiText style={{color: 'white', fontSize:10, fontWeight:'bold'}}>PHÁT BIỂU</BaomoiText>
                        </TouchableHighlight>
                      </View>
                    </View>

                 </View>
            </View>
          </Modal>

          <SignInModal visible={this.state.signInVisible} setModalVisible={this.setSignInModalVisible} navigation={this.props.navigation} />

      </View>

    )

  }
}




const styles = StyleSheet.create({
  BottomView:{
    height: 40,
    alignItems: 'center',
    flexDirection: 'row',
    borderTopColor: '#e0e0e0',
    justifyContent:'center',
    borderTopWidth: 0.5
  },
  commentButton:{
    marginLeft: 10,
    height: 30,
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
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
)(CommentModal)
