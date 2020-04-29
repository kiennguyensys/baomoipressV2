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
import { connect } from 'react-redux';
import Sources from '../../components/Sources';
import BackIcon from '../../components/BackIcon'
import axios from 'axios';
import gmobile from '../../assets/images/ExchangeGiftsScreen/icon-Gmobile.jpg';
import mobiphone from '../../assets/images/ExchangeGiftsScreen/icon-mobiphone.jpg';
import vietnammobi from '../../assets/images/ExchangeGiftsScreen/icon-vietnammobi.png';
import viettel from '../../assets/images/ExchangeGiftsScreen/icon-viettel.png';
import vinaphone from '../../assets/images/ExchangeGiftsScreen/icon-vinaphone.png';
import dateFormat from 'dateformat';
import { api_url } from '../../constants/API.js';

const Carriers = [
    {
        name: "Gmobile",
        source: gmobile
    },
    {
        name: "Mobiphone",
        source: mobiphone
    },
    {
        name: "Vietnammobi",
        source: vietnammobi
    },
    {
        name: "Viettel",
        source: viettel
    },
    {
        name: "Vinaphone",
        source: vinaphone
    },
]

class ExchangeHistoryScreen extends React.PureComponent {
    constructor(){
        super()
        this.state={
            data: []
        }
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
                                        }}
                        />
                        <View style={{flex: 4, alignItems: "center"}}><Text style={{fontSize: 20, fontWeight: "bold", color: textColor}}>Lịch sử đổi quà</Text></View>
                        <View style={{flex: 1}}></View>

                    </SafeAreaView>
            )
        }
    }

    componentDidMount(){
        this.getCardData()
    }

    getCardData = async() => {
        this.cancelTokenSource = axios.CancelToken.source()

        axios({
            method: "GET",
            url: api_url + "cardrequests?filter[meta_key]=userID&filter[meta_value]="+ this.props.user.id.toString() +"&status=publish",
            headers: {'Authorization': 'Bearer ' + this.props.userToken},
            cancelToken: this.cancelTokenSource.token
        })
        .then(res => this.setState({data: res.data}))
        .catch(err => {
            if(axios.isCancel(err)){
                return
            }else{
                console.log(err)
            }
        })
    }

    componentWillUnmount() {
        this.cancelTokenSource && this.cancelTokenSource.cancel()
    }

    render(){
        CardRequest = (props) => {
            const {date, id,} = props.data
            const {cardCode, carrier, price, requestStatus, seriesNumber} = props.data.acf
            var carrierPic
            Carriers.forEach(item => {
                if(carrier == item.name){
                    carrierPic = item.source
                }
            })
            return(
                <View style={{
                    marginBottom: 10,
                    backgroundColor: "white",
                    padding: 10,
                    borderWidth: 0.5,
                    borderColor: "#dadada",
                    borderRadius: 9,
                }}>
                    <View style={{flexDirection: "row", justifyContent: "flex-start", alignItems: "center"}}>
                        <Image source={carrierPic} style={{height: 55, width: 55, borderWidth: 1, borderColor: "#dadada"}}/>
                        <View style={{marginLeft: 10, justifyContent: "space-between", height: 55}}>
                            <Text style={{fontSize: 19}}>{carrier}</Text>
                            <Text style={{fontSize: 19, fontWeight: "bold"}}>{price}</Text>
                        </View>
                    </View>
                    <View style={{marginTop: 10}}>
                        <View style={{flex: 1, justifyContent: "flex-start"}}>
                            <Divider/>
                        </View>
                        <View style={{flex: 2, justifyContent: "center"}}>
                            <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                                <Text style={{fontSize: 20}}>Mã nạp:</Text>
                                {(requestStatus == "Đã duyệt")?
                                    <Text style={{fontSize: 20, fontWeight: "bold"}}>{cardCode}</Text>
                                    :
                                    <Text style={{fontSize: 20}}>********</Text>
                                }
                            </View>
                            <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                                <Text style={{fontSize: 20}}>Số seri:</Text>
                                {(requestStatus == "Đã duyệt")?
                                    <Text style={{fontSize: 20, fontWeight: "bold"}}>{seriesNumber}</Text>
                                    :
                                    <Text style={{fontSize: 20}}>********</Text>
                                }
                            </View>
                        </View>
                        <View style={{flex: 1, justifyContent: "flex-end"}}>
                            <Divider/>
                        </View>
                    </View>
                    <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10}}>
                        <View style={{backgroundColor: "#ecf4ff", flex: 6, alignItems: "center", justifyContent: "center", height: 29}}>
                            <Text style={{color: "#4d90e1", fontSize: 20}}>{dateFormat(date, "dd-mm-yyyy")}</Text>
                        </View>
                        <View style={{flex: 0.4}}></View>
                        {(requestStatus == "Đã duyệt")?
                            <TouchableOpacity
                                onPress={() => Clipboard.setString("*100*" + cardCode + "#")}
                                activeOpacity={0.5}
                                style={{flex: 6, height: 29}}
                            >
                                <View style={{backgroundColor: "#ecf4ff", alignItems: "center", justifyContent: "center", height: 29}}>
                                    <Text style={{color: "#4d90e1", fontSize: 20}}>Nạp ngay</Text>
                                </View>
                            </TouchableOpacity>
                            :
                            <View style={{flex: 6, height: 29}}>
                                {(requestStatus == "Bị từ chối")?
                                    <TouchableOpacity
                                        onPress={() => Alert.alert("Yêu cầu của bạn đã bị từ chối do vi phạm điều khoản thanh toán", "Bạn muốn phản hồi vui lòng liên hệ về mail baomoi.press@gmail.com")}
                                        activeOpacity={0.5}
                                    >
                                        <View style={{backgroundColor: "#e0272d", alignItems: "center", justifyContent: "center", height: 29}}>
                                            <Text style={{color: "white", fontSize: 20}}>{requestStatus}</Text>
                                        </View>
                                    </TouchableOpacity>
                                    :
                                    <View style={{backgroundColor: "#e0272d", alignItems: "center", justifyContent: "center", height: 29}}>
                                        <Text style={{color: "white", fontSize: 20}}>{requestStatus}</Text>
                                    </View>
                                }
                            </View>
                        }
                    </View>
                </View>
            )
        }
        return(
                    <View style={[styles.container, {backgroundColor: this.props.UI.backgroundColor}]}>
                        <FlatList
                            data={this.state.data}
                            extraData={this.state.data}
                            renderItem={({ item, index }) => <CardRequest data={item}/>}
                            keyExtractor={item => item.id.toString()}
                            ListEmptyComponent={() => (<Text style={{ margin: 10, color: this.props.UI.textColor, fontSize: 16 }}> Tích xu để đổi những phần quà hấp dẫn </Text>)}
                        />
                    </View>
        )
    }
};

const styles = StyleSheet.create({
    container:{
        flex: 1,
        padding: 10,
        backgroundColor: "#f3f3f3",
    }
})

const mapStateToProps = (state) => {
    return {
        UI: state.UI,
        user: state.session.user,
        userToken: state.session.token
   }
}

export default connect(mapStateToProps)(ExchangeHistoryScreen)