import React from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    SafeAreaView,
    ActivityIndicator,
    AsyncStorage,
    FlatList,
    Modal,
    TouchableHighlight,
    Alert,
    Share,
    Platform,
    Clipboard
} from 'react-native';
import {
    Avatar,
    Card,
    Icon,
    Button,
    Divider,
    Badge
} from 'react-native-elements';
import { acf_url } from '../../constants/API.js';
import { updateUserData } from '../../store/actions/sessionActions';
import { connect } from 'react-redux';
import { ShareDialog } from 'react-native-fbsdk';
import { customFont } from '../../constants/Fonts.js';

import axios from 'axios';

const share_tit = 'Cùng đọc tin tức hot nhất từ Báo mới Press, mã giới thiệu của mình là: '
const baomoi_app_url = 'https://play.google.com/store/apps/details?id=app.baomoi.press'

class UserShareTokenModal extends React.PureComponent {
    state = {
        shareToken: ''
    }

    componentDidMount() {
        this.cancelTokenSource = axios.CancelToken.source()
    }

    componentWillUnmount() {
        this.cancelTokenSource && this.cancelTokenSource.cancel()
    }

    componentDidUpdate(prevProps) {
        if(this.props.visible != prevProps.visible) this.getShareToken()

    }

    getShareToken = () => {
        const user = this.props.user

        if(user) {
            if(user.acf.shareToken) {
                this.setState({shareToken : user.acf.shareToken})
            }else {
                this.generateNewShareToken(user)
            }
        }
    }

    generateNewShareToken = (user) => {
        const new_token = user.id.toString() + this.AlphabetGenerate(5)

        const data = new FormData()
        data.append("fields[shareToken]", new_token)

        axios({
            method: "POST",
            url: acf_url + 'users/' + user.id,
            headers: {'Authorization': 'Bearer ' + this.props.userToken},
            data: data
        }, {
            cancelToken: this.cancelTokenSource.token
        })
        .then(res => {
            this.setState({shareToken : new_token})
            this.props.updateUser(this.props.user.id)
        })
        .catch(err => {
            console.log("referenceShare:" + err.message);
        })
    }

    AlphabetGenerate = (len) => {
        var text = "";

        var charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

        for (var i = 0; i < len; i++)
        text += charset.charAt(Math.floor(Math.random() * charset.length));

        return text;
    }

    onShare = () => {
        const shareLinkContent = {
            contentType: 'link',
            contentUrl: baomoi_app_url,
            contentDescription: share_tit + this.state.shareToken,
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
                }
            },
            function(error) {
                console.log('Share fail with error: ' + error);
            }
        );
    }


    onClipboard = () => {
        Clipboard.setString(this.state.shareToken)

        Alert.alert(
           'Clipboard',
           'Đã sao chép!'
        )
    }

    render(){
        return(
          <Modal
              animationType="fade"
              transparent={true}
              visible={this.props.visible}
              onRequestClose={() => this.props.setModalVisible(!this.props.visible)}
          >
            <View style={{alignItems: "center", justifyContent:"center", flex:1, backgroundColor: 'rgba(0,0,0,0.5)'}}

            >
                <View style={{backgroundColor: "#fff", borderRadius: 5, height: 380, width: 320, justifyContent: "space-between", paddingBottom: 5, overflow:'hidden'}}>
                    <View style={{flexDirection: "column"}}>
                        <View style={{flexDirection: "row", borderRadius: 5, borderBottomWidth: 1, borderBottomColor: '#B8B8B8', alignItems: "center", height: 35, backgroundColor:"#ffffff"}}>
                            <View style={{flex: 1, alignItems: "flex-start"}}>
                                <Icon
                                    name='close'
                                    type='evilicon'
                                    size={30}
                                    color="black"
                                    onPress={() => this.props.setModalVisible(!this.props.visible, null)}
                                />
                            </View>
                            <View style={{flex: 2, alignItems: "center"}}>
                                <Text style={{color: "black", marginLeft: 3}}>Chia sẻ App</Text>
                            </View>
                            <View style={{flex: 1}}></View>
                        </View>
                        <View style={{padding: 15}}>
                            <View style={{width: 114*2, height: 40*2, alignSelf: "center", marginTop: 10}}>
                                <Icon
                                    name='medal'
                                    type='material-community'
                                    color='#f46c6c'
                                    size={80}
                                />
                            </View>
                            <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 30}}>
                                <View style={{flex:1, backgroundColor: 'black', height: 0.5, opacity: 0.5}}></View>
                                <View style={{flex:3, alignItems: "center"}}>
                                    <Text style={{ fontSize: 15, opacity: 0.8}}>Mã giới thiệu của bạn</Text>
                                </View>
                                <View style={{flex:1, backgroundColor: 'black', height: 0.5, opacity: 0.5}}></View>
                            </View>
                            <View style={{marginTop: 20,
                                          marginHorizontal: -30,
                                          borderRadius: 6,
                                          justifyContent:'space-between',
                                          alignItems:'center'}}>
                                <View style={{
                                                flexDirection: 'row'}} >
                                    <Text style={{fontSize: 18, fontFamily: customFont, color: '#696969', marginRight: 5}}>{this.state.shareToken}</Text>
                                    <Icon
                                        name='content-copy'
                                        type='material-community'
                                        color='#696969'
                                        size={30}
                                        onPress={this.onClipboard}
                                    />
                                </View>
                                <Button
                                    buttonStyle={{  backgroundColor: '#C14450',
                                                    width: 150,
                                                    height: 50,
                                                    marginTop: 10,
                                                    borderRadius: 5,
                                                }}
                                    title="Chia sẻ"
                                    onPress={this.onShare}
                                />
                            </View>
                            <View>
                                <Text style={{fontStyle: "italic", textAlign: "center", fontSize: 15, lineHeight: 22, marginTop: 15}}>Chia sẻ để mời bạn bè cùng đọc tin tức hot nhất từ Báo mới Press</Text>
                            </View>
                        </View>


                    </View>
                </View>
            </View>
          </Modal>
        )
    }
};

styles = StyleSheet.create({
    container:{
        flex: 1,
        padding: 10,
        backgroundColor: "#f3f3f3",
    }
})

const mapStateToProps = (state) => {
    return {
        user: state.session.user,
        userToken: state.session.token
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateUser: (id) => {dispatch(updateUserData(id))},
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserShareTokenModal)