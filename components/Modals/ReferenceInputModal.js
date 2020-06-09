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
    TextInput
} from 'react-native';
import {
    Avatar,
    Card,
    Icon,
    Button,
    Divider,
    Badge,
    FormValidationMessage
} from 'react-native-elements';
import axios from 'axios';
import { updateUserData } from '../../store/actions/sessionActions';
import { connect } from 'react-redux';
import { api_url, acf_url } from '../../constants/API.js';

class ReferenceInputModal extends React.PureComponent {
    constructor(props){
        super(props)
        this.state ={
            text:''
        }
        this.cancelTokenSource = axios.CancelToken.source()
    }

    onSubmit = () => {

        if(this.state.text.length < 4) return

        this.setState({text: ''})

        const user = this.props.user

        axios({
            method: "GET",
            url: acf_url + "users?shareToken=" + this.state.text
        }, {
            cancelToken: this.cancelTokenSource.token
        })
        .then(res => {
            if(res.data[0]){
                if(res.data[0].id == user.id || user.acf.hasEnteredReferenceCode){
                    this.setState({text : ''})
                    Alert.alert('Không thành công!')
                }
                else this.proceedValidCode(res.data[0])
            }else {
                this.setState({text : ''})
                Alert.alert('Mã không hợp lệ!')
            }
        })
        .catch(err => {
            console.log("referenceInputSearch:" + err.message);
        })
    }

    proceedValidCode = async (codeOwner) => {
        Alert.alert('Thành công!')
        await this.addXuAndExpForBoth(codeOwner.id, this.props.user.id)

        const data = new FormData()
        data.append("fields[hasEnteredReferenceCode]", 'true')

        axios({
            method: "POST",
            url: acf_url + "users/" + this.props.user.id,
            headers: {'Authorization': 'Bearer ' + this.props.userToken},
            data: data
        }, {
            cancelToken: this.cancelTokenSource.token
        })
        .then(res => {
            const id_data = new FormData()
            id_data.append("owner_id", codeOwner.id.toString())
            id_data.append("user_id", this.props.user.id.toString())

            axios({
                method: "POST",
                url: api_url + "invited_friend",
                data: id_data
            }, {
                cancelToken: this.cancelTokenSource.token
            })
            .then(resource => {
                this.props.updateUser(this.props.user.id)
            })
            .catch(err => {
                console.log("InvitedFriends:" + err.message);
            })

        })
        .catch(err => {
            console.log("HasEnterReference:" + err.message);
        })
    }

    addXuAndExpForBoth = async (userId1, userId2) => {
        //user1

        axios({
            method: "GET",
            url: api_url + "add_exp?ammount=10&id=" + userId1.toString(),
        }, {
            cancelToken: this.cancelTokenSource.token
        })
        axios({
            method: "GET",
            url: api_url + "add_xu?ammount=5&id=" + userId1.toString(),
        }, {
            cancelToken: this.cancelTokenSource.token
        })

        //user2
        axios({
            method: "GET",
            url: api_url + "add_exp?ammount=10&id=" + userId2.toString(),
        }, {
            cancelToken: this.cancelTokenSource.token
        })
        axios({
            method: "GET",
            url: api_url + "add_xu?ammount=2&id=" + userId2.toString(),
        }, {
            cancelToken: this.cancelTokenSource.token
        })
    }

    componentWillUnmount() {
        this.cancelTokenSource && this.cancelTokenSource.cancel()
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
                <View style={{backgroundColor: "#fff", borderRadius: 5, height: 330, width: 320, justifyContent: "space-between", paddingBottom: 5}}>
                    <View style={{flexDirection: "column"}}>
                        <View style={{flexDirection: "row", borderRadius: 5,  borderBottomWidth: 1, borderBottomColor: '#B8B8B8', alignItems: "center", height: 35, backgroundColor:"#ffffff"}}>
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
                                <Text style={{color: "black", marginLeft: 3}}>Nhập mã giới thiệu</Text>
                            </View>
                            <View style={{flex: 1}}></View>
                        </View>
                        <View style={{padding: 15}}>
                            <View style={{width: 114*1.8, height: 40*1.8, alignSelf: "center", justifyContent: 'center'}}>
                                <Icon
                                    name='email-variant'
                                    type='material-community'
                                    color='#f46c6c'
                                    size={90}
                                />
                            </View>
                            <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                                <View style={{flex:1, backgroundColor: '#B8B8B8', height: 1}}></View>
                                <View style={{flex:3, alignItems: "center"}}>
                                    <Text style={{ fontSize: 15, opacity: 0.8}}>Điền mã giới thiệu</Text>
                                </View>
                                <View style={{flex:1, backgroundColor: '#B8B8B8', height: 1}}></View>
                            </View>
                            <TextInput
                                  style={{  height: 50,
                                            marginVertical: 10,
                                            marginHorizontal: -15,
                                            borderBottomWidth: 1,
                                            fontSize: 16,
                                            borderBottomColor: '#B8B8B8',
                                            justifyContent:'center',
                                            alignItems:'center',
                                            alignSelf:'center'}}
                                  onChangeText={(text) => this.setState({text: text})}
                                  autoFocus={true}
                                  value={this.state.text}
                                  placeholder='Mã giới thiệu'
                                  placeholderTextColor='#B8B8B8'
                            />
                            <Button
                                buttonStyle={{  backgroundColor: '#C14450',
                                                marginHorizontal: 30,
                                                marginTop: 10,
                                                borderRadius: 5,
                                            }}
                                title="Áp dụng"
                                onPress={this.onSubmit}
                            />

                            {(Platform.OS == 'android') && <Text style={{fontStyle: "italic", textAlign: "center", marginTop: 10}}>Nhập mã để được cộng 2 XU và 10 EXP</Text>
                            }

                        </View>


                    </View>
                </View>
            </View>
            </Modal>
        )
    }
}

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

export default connect(mapStateToProps, mapDispatchToProps)(ReferenceInputModal)