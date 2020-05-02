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
} from 'react-native';
//import { Notifications } from 'expo';
//import * as Facebook from 'expo-facebook';
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
import logo from '../../assets/images/logo-press.png';
import { connect } from 'react-redux';
import { signInWithFB } from '../../store/actions/sessionActions';
import { api_url, auth_url } from '../../constants/API.js';
import { customFont } from '../../constants/Fonts.js';
import { LoginManager, AccessToken, GraphRequest, GraphRequestManager } from "react-native-fbsdk";

class SignInModal extends React.PureComponent {
    constructor(props){
        super(props)
        this.state ={
            loading: false,
        }
    }

    FBLoginCallback = async(error, result) => {

        if (error) {
          alert(error.errorMessage);

          //console.log(error.errorMessage);
        } else {
          Alert.alert('Đăng nhập thành công!');
          this.props.signInWithFB(result)
        }
    }

    FBGraphRequest = async(fields, callback) => {
      const accessData = await AccessToken.getCurrentAccessToken();
      // Create a graph request asking for user information
      const infoRequest = new GraphRequest('/me', {
        accessToken: accessData.accessToken,
        parameters: {
          fields: {
            string: fields
          }
        }
      }, callback);
      // Execute the graph request created above
      new GraphRequestManager().addRequest(infoRequest).start();
    }


    FBLogin = async() => {
        this.props.setModalVisible(!this.props.visible)

        if(this.props.isProcessingUserData){
            Alert.alert("Dữ liệu đang được cập nhật! Vui lòng chờ trong giây lát")
        } else {

            LoginManager.logInWithPermissions(["public_profile"]).then(
                result => {
                    if (result.isCancelled) {
                        //console.log("Login cancelled");
                    } else {
                        // console.log(
                        //     "Login success with permissions: " +
                        //         result.grantedPermissions.toString()
                        // );
                        this.FBGraphRequest('id, name, picture.type(large)', this.FBLoginCallback);
                    }
                })
                .catch(
                    error => {
                        Alert.alert("Lỗi xảy ra, vui lòng thử lại lúc khác")
                    }
                );
        }
    }

    PhoneAuthLogin = () => {
        this.props.setModalVisible(false)
        if(!this.props.isProcessingUserData){
            this.props.navigation.navigate("PhoneAuth", { UI: this.props.UI })
        } else {
            Alert.alert("Dữ liệu đang được cập nhật! Vui lòng chờ trong giây lát")
        }
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
                <View style={{backgroundColor: "#fff" , borderRadius: 5, height: 390, width: 320, justifyContent: "space-between", paddingBottom: 5, opacity: 2, overflow: 'hidden'}}>
                    <View style={{flexDirection: "column"}}>
                        <View style={{flexDirection: "row", borderBottomWidth: 1, borderBottomColor: '#B8B8B8', alignItems: "center", height: 35, borderRadius: 5, backgroundColor:"#ffffff"}}>
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
                                <Text style={{color: "black", marginLeft: 3}}>Đăng nhập</Text>
                            </View>
                            <View style={{flex: 1}}></View>
                        </View>
                        <View style={{padding: 15}}>
                            <View style={{width: 114*1.4, height: 40*1.4, alignSelf: "center", marginTop: 10, justifyContent: 'center'}}>
                                <Image
                                    source={logo}
                                    style={{ width: 80*1.4, height: 80*1.4, alignSelf: 'center' }}
                                    resizeMode="contain"
                                />
                            </View>
                            <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 30}}>
                                <View style={{flex:1, backgroundColor: 'black', height: 0.5, opacity: 0.5}}></View>
                                <View style={{flex:2, alignItems: "center"}}>
                                    <Text style={{ fontSize: 15, opacity: 0.8}}>ĐĂNG NHẬP BẰNG</Text>
                                </View>
                                <View style={{flex:1, backgroundColor: 'black', height: 0.5, opacity: 0.5}}></View>
                            </View>
                            <View>
                                <Button
                                    containerViewStyle={{marginTop: 10}}
                                    backgroundColor="#4a6da7"
                                    buttonStyle={{borderRadius: 6.5, marginHorizontal: -15}}
                                    raised
                                    icon={{name: 'facebook-official', type: "font-awesome", reverse: true}}
                                    title='Đăng nhập bằng facebook'
                                    loading={this.state.loading}
                                    onPress={this.FBLogin}
                                />
                                <Button
                                    containerViewStyle={{marginTop: 10}}
                                    backgroundColor="red"
                                    buttonStyle={{borderRadius: 6.5, marginHorizontal: -15}}
                                    raised
                                    icon={{name: 'phone', type: "font-awesome", reverse: true}}
                                    title='Đăng nhập bằng SMS'
                                    onPress={this.PhoneAuthLogin}
                                />

                            </View>
                            <View>
                                <Text style={{ fontStyle: 'normal', fontFamily: customFont, fontSize: 15, lineHeight: 22,textAlign: "center", marginTop: 20}}>Đăng nhập để trải nghiệm đầy đủ các tính năng của ứng dụng và để lại những bình luận hay</Text>
                            </View>
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
        UI: state.UI,
        isProcessingUserData: state.session.isProcessingUserData
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        signInWithFB: (data) => {dispatch(signInWithFB(data))},
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignInModal)