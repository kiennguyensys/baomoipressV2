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
    Dimensions,
    WebView,
    Linking
} from 'react-native';
import { connect } from 'react-redux';
import { Avatar, Card, Icon, Button, Divider, Badge } from 'react-native-elements';
import Sources from '../../components/Sources';
import axios from 'axios';
import VND50K from "../../assets/images/50kVND.jpg"
import VND100K from "../../assets/images/100kVND.jpg"
import VND200K from "../../assets/images/200kVND.jpg"
import VND500K from "../../assets/images/500kVND.jpg"
import USD50 from "../../assets/images/50USD.jpg"
import USD100 from "../../assets/images/100USD.jpg"
import ExchangeGiftsModal from '../../components/Modals/ExchangeGiftsModal';
import BackIcon from '../../components/BackIcon'
import { api_url } from '../../constants/API.js';

const {width} = Dimensions.get("window")

class ExchangeGiftsScreen extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state ={
            modalVisible: false,
            value: null,
            coin: undefined,
        }
    }

    componentDidMount() {
        this.cancelTokenSource = axios.CancelToken.source()
    }

    setModalVisible = (visible, value, coin) => {
        this.setState({
            modalVisible: visible,
            value: value,
            coin : coin
        });
    }

    openWebView = (link) => {
        this.props.navigation.navigate("WebView", { uri: link })
    }

    static navigationOptions = ({navigation}) => {
        const { params = {} } = navigation.state
        const { textColor, backgroundColor } = params.UI

        return {
            tabBarVisible: false,
            header: () => (
                    <SafeAreaView
                        style={{
                        height: 50,
                        flexDirection: "row",
                        backgroundColor: backgroundColor,
                        alignItems:'center',
                        borderBottomWidth: 1,
                        borderBottomColor: '#e0e0e0'
                        }}
                    >
                        <BackIcon style={{flex: 1, width: 50, height:50, alignItems: 'center', justifyContent: 'center'}}
                                  onPress={() => {
                                            navigation.goBack()
                                            navigation.openDrawer()
                                        }}
                        />
                        <View style={{flex: 3, alignItems: "center"}}><Text style={{fontSize: 20, color: textColor, fontWeight: 'bold' }}>Đổi quà</Text></View>
                        <View style={{flex: 1}}></View>
                    </SafeAreaView>
            )
        }
    }

    componentWillUnmount() {
        this.cancelTokenSource && this.cancelTokenSource.cancel()
    }

    render(){
        const {Width} = Dimensions.get('window')
        Rules = (props) => {
            return(
                <View style={{flexDirection: "row", marginTop: 15}}>
                    <Icon
                        name={props.name}
                        type={props.type}
                        color="#01969a"
                        size={35}
                    />
                    <Text style={{marginLeft: 10, fontSize: 15, flex: 1, flexWrap: 'wrap'}}>{props.content}</Text>
                </View>
            )
        }

        Cards = (props) => {
            if(props.value !== "50 USD" && props.value !== "100 USD"){
                return(
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => this.setModalVisible(!this.state.modalVisible, props.value, props.coin)}
                    >
                        <Image
                            style={{height: (width/2-15)/2.217, width: width/2-15}}
                            source={props.source}
                        />
                    </TouchableOpacity>
                )
            }else{
                return(
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => this.openWebView("https://baomoi.press/doc-bao-nhan-qua")}
                    >
                        <Image
                            style={{height: (width/2-15)/2.217, width: width/2-15}}
                            source={props.source}
                        />
                    </TouchableOpacity>
                )
            }

        }
        return(
                <ScrollView style={{flex: 1, backgroundColor: this.props.UI.backgroundColor}}>
                    <View style={{paddingBottom: 10}}>
                        {this.state.modalVisible && <ExchangeGiftsModal visible={this.state.modalVisible} value={this.state.value} coin={this.state.coin} setModalVisible={this.setModalVisible} navigation={this.props.navigation}/>}
                        <View style={{backgroundColor: "#dd273e", height: 110, alignItems: "center", justifyContent: "center"}}>
                            <Text style={{color: "white", fontSize: 25}}>Mời bạn ngay</Text>
                            <Text style={{color: "white", fontSize: 25}}>Nhận quà mỏi tay</Text>
                        </View>
                        <View style={{backgroundColor:"white", padding: 10, marginTop: 15}}>
                            <Text style={{fontSize: 20.5, fontWeight: "bold"}}>Thông tin của bạn</Text>
                            <View style={{ height: 110, alignItems: "center", justifyContent:"center", flexDirection: "row"}}>
                                <View style={{ flex:1, alignItems: "center", justifyContent: "center"}}>
                                    <Text style={{color: "#01969a", fontSize: 30, fontWeight: "bold"}}>{ (this.props.user.invitedFriends) ? this.props.user.invitedFriends.length : "0" }</Text>
                                    <Text style={{color: "black", fontSize: 20}}>Bạn bè đã mời ></Text>
                                </View>
                                <View style={{ backgroundColor: "#949494", height: 90, width: 2}}></View>
                                <View style={{ flex:1, alignItems: "center", justifyContent: "center"}}>
                                    <Text style={{color: "#01969a", fontSize: 30, fontWeight: "bold"}}>{this.props.user.xu}</Text>
                                    <View style={{flexDirection: "row", alignItems: "center"}}>
                                        <Icon
                                            type="material-community"
                                            name="coin"
                                            color="#01969a"
                                            size={25}
                                        />
                                        <Text style={{color: "black", fontSize: 20}}> Xu thưởng ></Text>
                                    </View>

                                </View>
                            </View>
                        </View>
                        <View style={{backgroundColor:"white", padding: 10, marginTop: 15}}>
                            <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                                <Text style={{fontSize: 19.5, fontWeight: "bold"}}>THỂ LỆ HƯỚNG DẪN</Text>
                                <TouchableOpacity onPress={() => this.openWebView('https://baomoi.press/the-le-huong-dan-kiem-xu-tren-app')}>
                                    <Text style={{color: "#00b990"}}>Chi tiết ></Text>
                                </TouchableOpacity>
                            </View>
                            <Rules
                                name="people"
                                type="simple-line-icon"
                                content="Mời bạn bè cài đặt và đăng nhập lần đầu tiên thành công trên ứng dụng báo mới."
                            />
                            <Rules
                                name="star-circle-outline"
                                type="material-community"
                                content="Nhập mã giới thiệu thành công người giới thiệu được +5 xu, người nhập mã được +2 xu"
                            />
                            <Rules
                                name="present"
                                type="simple-line-icon"
                                content="Dùng xu để đổi lấy các phần thưởng hấp dẫn, mỗi phần thưởng được đổi 1 lần/ngày."
                            />
                        </View>
                        <View style={{backgroundColor:"white", padding: 10, marginTop: 15}}>
                            <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                                <Text style={{fontSize: 19.5, fontWeight: "bold"}}>PHẦN THƯỞNG</Text>
                                <TouchableOpacity
                                    activeOpacity={0.5}
                                    onPress={() => this.props.navigation.navigate("ExchangeHistory", { UI: this.props.UI })}
                                >
                                    <Text style={{color: "#00b990"}}>Lịch sử đổi thưởng ></Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 5}}>
                                <Cards source={VND50K} value="50000 VND" coin={500}/>
                                <Cards source={VND100K} value="100000 VND" coin={1000}/>
                            </View>

                            <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 5}}>
                                <Cards source={VND200K} value="200000 VND" coin={1600}/>
                                <Cards source={VND500K} value="500000 VND" coin={4000}/>
                            </View>

                            <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 5}}>
                                <Cards source={USD50} value="50 USD"/>
                                <Cards source={USD100} value="100 USD"/>
                            </View>

                        </View>
                        <View style={{backgroundColor:"white", padding: 10, marginTop: 15}}>
                            <View style={{flexDirection: "row", marginTop: 10}}>
                                <Icon
                                    name="mail"
                                    type="entypo"
                                    color="#01969a"
                                    size={35}
                                />
                                <View>
                                    <Text style={{marginLeft: 10, fontSize: 15, flex: 1, flexWrap: 'wrap'}}>Chăm sóc khách hàng</Text>
                                    <View style={{flexDirection: "row", alignItems: "center"}}>
                                        <Text style={{marginLeft: 10, fontSize: 15, fontWeight: "bold"}}>app.baomoi.press@gmail.com</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        UI: state.UI,
        user: state.session.user
    }
}

export default connect(mapStateToProps)(ExchangeGiftsScreen)