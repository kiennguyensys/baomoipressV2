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
    Alert
} from 'react-native';
import { connect } from 'react-redux';
import { updateUserData } from '../../store/actions/sessionActions';
import {
    Avatar,
    Card,
    Icon,
    Button,
    Divider,
    Badge,
    FormValidationMessage
} from 'react-native-elements';
import Sources from '../Sources';
import gmobile from '../../assets/images/ExchangeGiftsScreen/icon-Gmobile.jpg';
import mobiphone from '../../assets/images/ExchangeGiftsScreen/icon-mobiphone.jpg';
import vietnammobi from '../../assets/images/ExchangeGiftsScreen/icon-vietnammobi.png';
import viettel from '../../assets/images/ExchangeGiftsScreen/icon-viettel.png';
import vinaphone from '../../assets/images/ExchangeGiftsScreen/icon-vinaphone.png';
import { api_url } from '../../constants/API.js';
import axios from 'axios';
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

class ExchangeGiftsModal extends React.Component {
    constructor(props){
        super(props)
        this.state={
            modalVisible: this.props.visible,
            selectedCarrier: null,
            loading: false,
            buttonTitle: "Gửi yêu cầu"
        }
    }

    setSelectedCarrier = (name) => {
        this.setState({
            selectedCarrier: name
        })
    }

    handleSubmit = async() => {
        if(this.state.buttonTitle === "Cập nhật hồ sơ") {
            this.props.setModalVisible(!this.state.modalVisible, null)
            this.props.navigation.goBack()
            this.props.navigation.navigate("UserProfileEdit")
            return
        }

        let user = this.props.user

        const current_xu = parseInt(user.xu, 10)

        if(current_xu < this.props.coin) {
            Alert.alert("Xu của bạn không đủ để thực hiện giao dịch")

        }
        else if(!user.acf.birth_date ||
                !user.acf.gender ||
                !user.acf.so_thich ||
                !user.acf.location || user.acf.location.length == 0 ||
                !user.acf.phoneNumber ||
                !user.acf.custom_email || user.acf.custom_email.length == 0) {
            this.setState({
                buttonTitle: "Cập nhật hồ sơ"
            })
            Alert.alert("Bạn cần cập nhật đầy đủ hồ sơ để thực hiện giao dịch")
        }
        else if(this.state.selectedCarrier !== null){
            this.setState({
                loading: true,
            }, async() => {
                const data = new FormData()

                data.append("fields[carrier]", this.state.selectedCarrier)
                data.append("fields[price]", this.props.value)
                data.append("title", user.name)
                data.append("fields[userID]", user.id)
                data.append("fields[requestStatus]", "Pending")
                data.append("fields[report]", "null")
                data.append("status", "publish")
                // console.log(data);
                axios({
                    method: "POST",
                    url: api_url + "cardrequests",
                    headers: {'Authorization': 'Bearer ' + this.props.userToken},
                    data: data
                })
                .then(res => {
                    if(res.status == 201){
                        this.setState({
                            loading: false,
                            buttonTitle: "Gửi yêu cầu thành công!"
                        })

                        axios({
                            method: "GET",
                            url: api_url + "add_xu?ammount=-"+ this.props.coin.toString() + '&id=' + user.id.toString(),
                        })
                        .then(() => {
                            this.props.updateUser(this.props.user.id)
                        })
                    }
                })
                .catch(err => console.log(err))
            })
        }else{
            Alert.alert("Xin hãy chọn nhà mạng")
        }



    }

    render(){

        Carrier = (props) => {
            return(
                <Image source={props.source} style={{height: 55, width: 55, borderWidth: 1, borderColor: "#dadada", borderRadius: 55/2}}/>
            )
        }

        return(
            <Modal
                animationType="fade"
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => this.props.setModalVisible(!this.state.modalVisible, null)}
            >
            <View style={{alignItems: "center", justifyContent:"center", flex:1, backgroundColor: 'rgba(0,0,0,0.5)'}}
            >
                <View style={{backgroundColor: "#edefee" ,height: 260, width: 320, overflow: 'hidden', borderRadius: 5, justifyContent: "space-between", paddingBottom: 5, opacity: 2}}>
                    <View>
                        <View style={{flexDirection: "row", alignItems: "center", height: 35, justifyContent: "space-between", backgroundColor:"#555358"}}>
                            <Icon
                                name='close'
                                type='evilicon'
                                size={30}
                                color="white"
                                onPress={() => this.props.setModalVisible(!this.state.modalVisible, null)}
                            />
                        </View>

                        <View style={{backgroundColor:"white", height: 30, width: 320, alignItems: "center", justifyContent: "center"}}>
                            <Text style={{color: "#325340", fontSize: 16}}>Chọn nhà mạng</Text>
                            <View style={{width: 100, height: 2, backgroundColor: "#325340", marginTop: 2 }}></View>
                        </View>

                        <View style={{backgroundColor: "white", paddingBottom: 5, paddingTop: 5}}>
                            <FlatList
                                scrollEnabled={false}
                                data={Carriers}
                                extraData={this.state.selectedCarrier}
                                horizontal={true}
                                renderItem={({item}) =>
                                    <TouchableOpacity

                                        onPress={() => this.setSelectedCarrier(item.name)}
                                        style={{backgroundColor: this.props.UI.backgroundColor}}
                                        underlayColor="white"
                                        activeOpacity={0.5}
                                    >
                                      {
                                        (item.name === this.state.selectedCarrier)?
                                            <Image source={item.source} style={{marginLeft: 7.5 ,height: 55, width: 55, borderWidth: 1, borderColor: "#75aee5", borderRadius: 55/2}}/>
                                        :
                                            <Image source={item.source} style={{marginLeft: 7.5 ,height: 55, width: 55, borderWidth: 1, borderColor: "#dadada", borderRadius: 55/2}}/>
                                      }

                                    </TouchableOpacity>

                                }
                                keyExtractor={item => item.name}
                            />

                        </View>
                    </View>
                    <View style={{alignItems: "center", justifyContent: "space-between", width: 320}}>
                        <Text style={{ marginTop: 10, color: '#325340', fontSize: 15}}>{"Xu cần đổi: " + this.props.coin }</Text>
                        <Text style={{ marginVertical: 10, color: '#325340', fontSize: 15}}>{"Nhà mạng: " + (this.state.selectedCarrier || "Không") }</Text>

                        <Button buttonStyle={{backgroundColor: "#e12f28", width: 300, marginBottom: 10, borderRadius: 5}} title={this.state.buttonTitle} onPress={this.handleSubmit} loading={this.state.loading}/>
                    </View>
                </View>
            </View>
            </Modal>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        UI: state.UI,
        user: state.session.user,
        userToken: state.session.token
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateUser: (id) => {dispatch(updateUserData(id))},
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ExchangeGiftsModal)