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
    Linking,
    Alert,
    Modal,
    Platform
} from 'react-native';
import { connect } from 'react-redux';
import { Avatar, Card, Icon, Button, Divider, Badge } from 'react-native-elements';
import axios from 'axios';
import MenuItemNoBadge from './MenuItemNoBadge';
import MenuItemWithBadge from './MenuItemWithBadge';
import SignInModal from '../Modals/SignInModal.js';
import ReferenceInputModal from '../Modals/ReferenceInputModal.js';
import UserShareTokenModal from '../Modals/UserShareTokenModal.js';
import { api_url, acf_url } from '../../constants/API.js';
import { signOut, checkAuth, updateUserData } from '../../store/actions/sessionActions';
import FastImage from 'react-native-fast-image';
import AdMobRewardedAd from '../Ads/Admob/AdmobRewardedAd';

const defaultImg = 'https://www.ucsusa.org/sites/default/files/2019-09/no_photo_avatar.png'
const FB = 'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=410408676429078&height=200&width=200&ext=1555596027&hash=AeRSIiZ4P4tf_hA_'

class SideBar extends React.Component {
    constructor() {
        super()
        this.state = {
            signInModalVisible: false,
            userShareModalVisible: false,
            referenceInputModalVisible: false,
            rewardedAd : null,
            shouldShowRewardedAd: false,
            loading: false
        }
        this.cancelTokenSource = axios.CancelToken.source()
    }

    componentDidMount(){
        this.requestRewardedAd()
    }

    componentDidUpdate(prevProps){
        const prevUser = prevProps.user
        const user = this.props.user

        if(prevUser.id !== user.id && user.name === 'Guest') {
            setTimeout(() => {
                requestAnimationFrame(() => {
                    this.props.navigation.navigate("UserProfileEdit")
                })
                Alert.alert('Hãy cập nhật tên và avatar để bình luận')
            }, 2000)
        }
    }

    handleAvatarPress = () => {
        if(this.checkLogedIn()){
            this.props.navigation.navigate("UserProfileEdit", { UI: this.props.UI })
        }
    }

    openWebView = (link) => {
        this.props.navigation.navigate("WebView", { uri: link })
    }

    rewardedVideoCallBack = (rewarded) => {
        this.setState({ shouldShowRewardedAd: false })
        axios({
            method: "GET",
            url: api_url + "add_xu?action_type=watch_rewarded_ads&ammount="+ this.state.rewardedAd.videoRewardedXu +"&id=" + this.props.user.id.toString(),
        }, {
            cancelToken: this.cancelTokenSource.token
        })
            .then(res => {
                this.props.updateUser(this.props.user.id)
                Alert.alert("Xem video nhận thưởng", "Bạn đã nhận được " + this.state.rewardedAd.videoRewardedXu + " xu")
            })
    }

    rewardedAdClick = () => {
        if(!this.props.user.id) this.setState({ signInModalVisible: true })
        else if(!this.props.user.rewarded_ads_should_enable) Alert.alert("Lượt của bạn đã hết", "Cần khoảng " + this.state.rewardedAd.minutesTillNextTurnVideo + " phút giữa mỗi lượt xem video" )
        else {
            Alert.alert(
               "Xem clip kiếm xu",
               "Xem clip để kiếm " + this.state.rewardedAd.videoRewardedXu + " xu. Bạn có đồng ý?",
              [
                {
                  text: "Huỷ",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel"
                },
                { text: "OK", onPress: () => this.setState({ shouldShowRewardedAd: true }) }
              ],
              { cancelable: false }
            )
        }
    }

    requestRewardedAd = () => {
        axios.get(acf_url + "quangcao?filter[meta_query][0][key]=adPosition&filter[meta_query][0][value]=" + "Xem Video Nhận Thưởng" + "&filter[meta_query][1][key]=platformOS&filter[meta_query][1][value]=" + Platform.OS.toString(), {
            cancelToken: this.cancelTokenSource.token
        })
        .then(res => {
            if(res.data.length) {
                let ads = res.data;
                this.setState({ rewardedAd: ads[0].acf })
            }
        })
        .catch(err => {
            if(axios.isCancel(err)){
                return
            } else {
                console.log(err)
            }
        })
    }


    handleExchangeGiftsPress = () => {
        if(this.checkLogedIn()){
            this.props.navigation.navigate("ExchangeGifts", {
                xu: this.props.user.xu || "0",
                UI: this.props.UI
            })
        }
    }

    handleNotificationPress = () => {
        this.props.navigation.navigate("Notifications", { UI: this.props.UI })
    }

    handleSubscribedPressed = () => {
        if(this.checkLogedIn()){
            this.props.navigation.navigate("Following", { UI: this.props.UI })
        }
    }

    handleNavigationPressed = (navigationDesination) => {
        if(navigationDesination == "UserProfileEdit") {
            this.handleAvatarPress()
        }
        else if(navigationDesination == "Following") {
            this.handleSubscribedPressed()
        }else if (navigationDesination == "Notifications") {
            this.handleNotificationPress()
        }else if (navigationDesination == "ExchangeGifts") {
            this.handleExchangeGiftsPress()
        }
    }

    sendEmail = () => {
        const url = "mailto:app.baomoi.press@gmail.com"
        Linking.canOpenURL(url)
        .then((supported) => {
            if (!supported) {
                console.log("Can't handle url: " + url);
            } else {
                Linking.openURL(url)
            }
        })
        .catch((err) => console.error('An error occurred', err));
    }

   openStore = () => {
        const baomoi_app_url = (Platform.OS == 'android') ? 'market://details?id=app.baomoi.press' : 'itms-apps://itunes.apple.com/us/app/id1499212944?mt=8'

        Linking.canOpenURL(baomoi_app_url)
        .then((supported) => {
            if (!supported) {
                console.log("Can't handle url: " + baomoi_app_url);
            } else {
                return Linking.openURL(baomoi_app_url);
            }
        })
        .catch((err) => console.error('An error occurred', err));
    }


    checkLogedIn = () => {
        if(this.props.user.id){
            return true
        }else{
            this.setSignInModalVisible(!this.state.signInModalVisible)
            return false
        }
    }

    logOut = () => {
        this.props.logOut()
        this.props.checkAuth()
    }

    setSignInModalVisible = (visible) => {
        this.setState({
            signInModalVisible: visible,
        });
    }

    setReferenceInputModalVisible = (visible) => {
        this.setState({
            referenceInputModalVisible: visible,
        });
    }

    setUserShareModalVisible = (visible) => {
        this.setState({
            userShareModalVisible: visible,
        });
    }

    setLoading = (isLoading) => {
        this.setState({
            loading: isLoading
        })
    }

    showAlert = (title, msg) => {
     Alert.alert(
        title,
        msg,
        [
          {text: 'OK', onPress: () => {}},
          { onDismiss: () => {} }
        ],
        { cancelable: false }
     )
   }

    render(){
        const {user} = this.props
        const { textColor, backgroundColor } = this.props.UI

        TopNavigator = (props) => {
            const {name, type, color, content, navigationDesination, size} = props
            return(
                        <TouchableOpacity
                            style={{flex: 1, alignItems: "center", justifyContent: "space-around"}}
                            onPress={() => {
                                this.handleNavigationPressed(navigationDesination)
                            }}
                        >
                            <View style={{borderWidth: 1, borderColor: textColor, borderRadius: 50, height: 45, width: 45, justifyContent:"center"}}>
                                <Icon
                                    name={name}
                                    type={type}
                                    color={color}
                                    size={size}
                                />
                            </View>
                            <Text style={{color: "#52607b"}}>{content}</Text>
                        </TouchableOpacity>
            )
        }
        return(
                    <View style={{backgroundColor: backgroundColor, flex: 1, padding: 10}}>
                        <View style={{flexDirection: "row", backgroundColor: '#dd273e', marginHorizontal: -10, marginTop: -10, height: 100, alignItems: "flex-end", justifyContent: 'space-between', overflow: 'hidden'}}>
                            {user.id ? (
                                <TouchableOpacity
                                    onPress={() => {
                                        this.handleNavigationPressed("UserProfileEdit")
                                    }}
                                    activeOpacity={0.5}
                                >
                                    <View style={{flexDirection: "row", paddingLeft: 5, paddingBottom: 5}}>
                                        <FastImage
                                            style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: '#DCDCDC' }}
                                            source={{uri: user.custom_avatar || defaultImg }}
                                            resizeMode={FastImage.resizeMode.cover}
                                        />
                                    <View style={{justifyContent: "center", alignItems: "flex-start"}}>
                                            <Text style={{color: "white", fontSize: 20,}}>{user.name}</Text>
                                            <Badge containerStyle={{ backgroundColor: "#dd273e", borderColor: "white", borderWidth: 1}}>
                                                <Text style={{color: "#f4d644"}}>{user.exp_rank ? user.exp_rank.post.post_title : "No information"}</Text>
                                            </Badge>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ) : (!this.props.isProcessingUserData ? (

                                <TouchableOpacity
                                    onPress={() => this.setSignInModalVisible(!this.state.signInModalVisible)}
                                >
                                    <View style={{flexDirection: "row", alignItems: "center"}}>
                                        <Icon
                                            name='user'
                                            type='feather'
                                            reverse
                                            color="#a6122b"
                                        />
                                        <Button onPress={() => this.setSignInModalVisible(!this.state.signInModalVisible)} buttonStyle={{width: 100, padding: 0, marginLeft: -15}} setLoading={this.setLoading} loading={this.state.loading} title="Đăng nhập" backgroundColor="#dd273e" textStyle={{fontSize: 20}} />
                                    </View>
                                </TouchableOpacity>

                            ) : (
                                <TouchableOpacity
                                    onPress={() => this.setSignInModalVisible(!this.state.signInModalVisible)}
                                >
                                    <View style={{flexDirection: "row", alignItems: "center"}}>
                                        <Icon
                                            name='user'
                                            type='feather'
                                            reverse
                                            color="#a6122b"
                                        />
                                        <ActivityIndicator />
                                    </View>
                                </TouchableOpacity>


                            ))}

                            <View>
                                <View>
                                    <SignInModal visible={this.state.signInModalVisible} setModalVisible={this.setSignInModalVisible} navigation={this.props.navigation} setLoading={this.setLoading} />
                                    <ReferenceInputModal visible={this.state.referenceInputModalVisible} setModalVisible={this.setReferenceInputModalVisible} navigation={this.props.navigation} />
                                    <UserShareTokenModal visible={this.state.userShareModalVisible} setModalVisible={this.setUserShareModalVisible} navigation={this.props.navigation} />
                                </View>
                                <TouchableOpacity style={{alignSelf: "flex-end", marginBottom: 7, paddingRight: 10 }}
                                                  onPress={() => this.props.navigation.closeDrawer()}>
                                    <Icon
                                        name='close'
                                        type='evilicon'
                                        size={30}
                                        color="white"
                                        underlayColor="#e12f28"
                                    />
                                </TouchableOpacity>
                                <View style={{backgroundColor:"#3a5685", height: 50, width: 150, marginBottom: 5, borderTopLeftRadius: 60, borderBottomLeftRadius: 60, alignItems: "flex-start", paddingLeft: 12, justifyContent: "space-around" }}>
                                    <Text style={{color: "white", fontSize: 12 }}>MỜI BẠN, KHUI QUÀ</Text>
                                    {user ? (
                                        <View style={{flexDirection: "row", alignItems: "center"}}>
                                            <Icon
                                                type="material-community"
                                                name="coin"
                                                color="#49b253"
                                            />
                                            <Text style={{color: "white", marginLeft: 5}}>Xu: </Text>
                                            <Text style={{color: "#49b253"}}>{ user.xu || "0" }</Text>
                                        </View>
                                    ) : (
                                        <View style={{flexDirection: "row", alignItems: "center"}}>
                                            <Icon
                                                type="material-community"
                                                name="coin"
                                                color="#49b253"
                                            />
                                            <Text style={{color: "white", marginLeft: 5}}>Xu: </Text>
                                            <Text style={{color: "#49b253"}}>0</Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        </View>
                        <ScrollView>
                            <View style={{padding: 10, paddingHorizontal: -5, flexDirection: "row"}}>
                                <TopNavigator name='ios-people' type='ionicon' color='#f37f58' size={40} content="Theo dõi" navigationDesination="Following"/>
                                <TopNavigator name='ios-notifications' type='ionicon' color='#abbaff' size={40} content="Thông báo" navigationDesination="Notifications"/>
                                <TopNavigator name='present' type='simple-line-icon' color='#ffcd57' size={32} content="Đổi quà" navigationDesination="ExchangeGifts" />
                            </View>
                            <Divider style={{ backgroundColor: '#e0e0e0', height: 1}} />
                            <View style={{marginTop: 10}}>
                                <View style={{flexDirection: "row"}}>
                                    <View style={{backgroundColor: "#fc5656", height: 18, width: 5}}></View>
                                    <Text style={{color: textColor, marginLeft: 10, fontSize: 18, fontWeight: "bold"}}>Nhiệm vụ kiếm xu</Text>
                                </View>
                                {(this.props.user.acf && !this.props.user.acf.hasEnteredReferenceCode) &&
                                <TouchableOpacity onPress={() => this.setReferenceInputModalVisible(!this.state.referenceInputModalVisible) }>
                                    <MenuItemNoBadge name="email-variant" type="material-community" color="#f46c6c" content="Nhập mã giới thiệu" textColor={textColor} hot={(Platform.OS == 'ios') ? 'HOT' : '+2xu'} />
                                </TouchableOpacity>
                                }
                                <TouchableOpacity onPress={() => { if(this.checkLogedIn()) this.setUserShareModalVisible(!this.state.userShareModalVisible) }}>
                                    <MenuItemNoBadge name="medal" type="material-community" color="#f46c6c" content={"Chia sẻ app" + ((Platform.OS == 'android') ? " kiếm tiền" : " cho bạn bè")} textColor={textColor} hot='HOT'/>
                                </TouchableOpacity>
                                {this.state.rewardedAd &&
                                 <TouchableOpacity
                                    onPress={this.rewardedAdClick}>

                                    <AdMobRewardedAd unitID={this.state.rewardedAd.adID} rewardedCallback={this.rewardedVideoCallBack} shouldShowRewardedAd={this.state.shouldShowRewardedAd} />

                                    <View
                                        style={{ opacity: (!this.props.user.rewarded_ads_should_enable) ? 0.6 : 1 }}
                                    >
                                        <MenuItemNoBadge name="smartphone" type="feather" color="#768cb1" content="Xem clip kiếm thêm xu" textColor={textColor} hot={false}/>
                                    </View>
                                </TouchableOpacity>
                                }
                            </View>
                            {(Platform.OS == 'android') &&
                                <View style={{marginTop: 25}}>
                                    <View style={{flexDirection: "row"}}>
                                        <View style={{backgroundColor: "#fc5656", height: 18, width: 5}}></View>
                                        <Text style={{color: textColor, marginLeft: 10, fontSize: 18, fontWeight: "bold"}}>Nhiệm vụ hằng ngày</Text>
                                    </View>
                                    <MenuItemWithBadge name='comments-o' type='font-awesome' color='#f4d644' content="Bình luận được duyệt" textColor={textColor} exp="+1Exp" backgroundColor={backgroundColor}/>
                                    <MenuItemWithBadge name='book' type='octicon' color='#f46c6c' content="Đọc bài báo 3 phút" textColor={textColor} exp="+1Exp" backgroundColor={backgroundColor}/>
                                    <MenuItemWithBadge name='ios-people' type='ionicon' color='#f46c6c' content="Chia sẻ bài viết(facebook)" textColor={textColor} exp="+5Exp" backgroundColor={backgroundColor}/>
                                    <MenuItemWithBadge name='md-mail-open' type='ionicon' color='#ea5251' content="Mời bạn bè cài đặt app" textColor={textColor} exp="+10Exp" backgroundColor={backgroundColor}/>
                                </View>
                            }
                            <View style={{marginTop: 25}}>
                                <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate("Terms", { UI: this.props.UI })}
                                >
                                    <View style={{ height: 50, justifyContent: "space-between"}}>
                                        <View></View>
                                        <Text style={{color: textColor, fontSize: 18}} >Điều khoản sử dụng</Text>
                                        <Divider style={{ backgroundColor: '#e0e0e0', height: 1}} />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ height: 50, justifyContent: "space-between"}}>
                                    <View></View>
                                    <Text style={{color: textColor, fontSize: 18}} onPress={this.openStore} >Bình chọn báo mới</Text>
                                    <Divider style={{ backgroundColor: '#e0e0e0', height: 1}} />
                                </TouchableOpacity>
                                <TouchableOpacity style={{ height: 50, justifyContent: "space-between"}}>
                                    <View></View>
                                    <Text style={{color: textColor, fontSize: 18}} onPress={this.sendEmail} >Gửi email góp ý</Text>
                                    <Divider style={{ backgroundColor: '#e0e0e0', height: 1 }} />
                                </TouchableOpacity>
                                {user.id &&
                                    <View style={{ height: 50, justifyContent: "space-between"}}>
                                        <View></View>
                                        <TouchableOpacity onPress={this.logOut}><Text style={{color: textColor, fontSize: 18, }}>Đăng xuất</Text></TouchableOpacity>
                                        <View></View>
                                    </View>
                                }
                            </View>
                        </ScrollView>
                    </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        UI: state.UI,
        user: state.session.user,
        userToken: state.session.token,
        isProcessingUserData: state.session.isProcessingUserData
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateUser: (id) => {dispatch(updateUserData(id))},
        logOut: () => {dispatch(signOut())},
        checkAuth: () => {dispatch(checkAuth())}
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SideBar)