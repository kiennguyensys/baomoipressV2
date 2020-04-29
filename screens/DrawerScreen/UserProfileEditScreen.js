import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, AsyncStorage, Platform, DatePickerAndroid, SafeAreaView, TextInput, Dimensions, ActivityIndicator, Alert } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import axios from 'axios';
import DatePicker from '../../components/DatePicker';
import DateFormat from 'dateformat';
import { connect } from 'react-redux';
import { updateUserData, updateUserFbToken, checkAccountExisting, updateUserAvatar } from '../../store/actions/sessionActions';
import BackIcon from '../../components/BackIcon'
import { Icon } from 'react-native-elements';
import { api_url, acf_url } from '../../constants/API.js';
import { LoginManager, AccessToken, GraphRequest, GraphRequestManager } from "react-native-fbsdk";
import ImagePicker from 'react-native-image-picker';
import FastImage from 'react-native-fast-image';
const defaultImg = 'https://www.ucsusa.org/sites/default/files/2019-09/no_photo_avatar.png'
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/yankeesim/upload';

class UserProfileEditScreen extends React.Component {
    constructor(props) {
        super(props)
        const acf = this.props.user.acf
        this.state = {
            birth_date: acf.birth_date,
            age: acf.age,
            gender: acf.gender || "Nam",
            location: acf.location,
            hobbyChoices: [],
            so_thich: acf.so_thich || "Nghe nhạc",
            user_email: acf.custom_email,
            isUpdating: false,
            user_name: this.props.user.name
        }
    }


    componentDidMount() {
        this.props.updateUser(this.props.user.id)
        this.getHobbyChoices()
    }

    static navigationOptions = ({navigation}) => {
        return {
            tabBarVisible: false,
            headerShown: false
        }
    }

    getHobbyChoices = () => {
        axios({
            method: "GET",
            url: api_url + "get_hobby_choices",
        })
        .then(res => {
            this.setState({ hobbyChoices: res.data })
        })
        .catch(err => console.log(err))
    }

    handleSubmit = () => {
        this.setState({ isUpdating: true })
        const nameData = new FormData()
        nameData.append("name", this.state.user_name)

        axios({
            method: "POST",
            url: api_url + "users/" + this.props.user.id,
            headers: {'Authorization': 'Bearer ' + this.props.userToken},
            data: nameData
        })
        .catch(err => console.log(err))

        const acfData = new FormData()
        acfData.append("fields[birth_date]", this.state.birth_date || "Chưa cập nhật")
        acfData.append("fields[age]", this.state.age)
        acfData.append("fields[gender]", this.state.gender)
        acfData.append("fields[so_thich]", this.state.so_thich)
        acfData.append("fields[custom_email]", this.state.user_email || "Chưa cập nhật")
        acfData.append("fields[location]", this.state.location || "Chưa cập nhật")

        axios({
            method: "POST",
            url: acf_url + "users/" + this.props.user.id,
            headers: {'Authorization': 'Bearer ' + this.props.userToken},
            data: acfData
        })
        .then(res => {
            Alert.alert('Đã lưu!')
            this.setState({ isUpdating: false })
            this.props.updateUser(this.props.user.id)
        })
        .catch(err => console.log(err))

    }

    handleSelectedDate = (newDate) => {
        this.setState({ birth_date: DateFormat(newDate, "dd-mm-yyyy") })
        this.setState({ age: this.getAge(newDate) })
    }

    getAge = (dateString) => {
        let today = new Date();
        let birthDate = new Date(dateString);
        let age = today.getFullYear() - birthDate.getFullYear();
        let m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        return age;
    }

    updateAvatar = () => {
        const options = {
            title: 'Tải ảnh',
            cancelButtonTitle: 'Huỷ',
            takePhotoButtonTitle: 'Chụp ảnh...',
            chooseFromLibraryButtonTitle: 'Chọn ảnh từ thư viện...',
            storageOptions: { skipBackup: true, path: 'images', cameraRoll: true, waitUntilSaved: true },
        };

        ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                let base64Img = 'data:' + response.type + ';base64,' + response.data;

                Alert.alert("Đang tải ảnh", "Vui lòng đợi khoảng 10s để hệ thống cập nhật")

                let formData = new FormData()
                formData.append("file", base64Img)
                formData.append("upload_preset", "avatar_file")

                fetch(CLOUDINARY_URL, {
                    body: formData,
                    method: 'POST',
                }).then(async r => {
                    let data = await r.json()
                    this.props.updateUserAvatar(data.url)
                }).catch(err => console.log(err))

                // axios({
                //     method: "POST",
                //     url: api_url + 'media',
                //     headers: {
                //         'Authorization': 'Bearer ' + this.props.userToken,
                //         'Content-Disposition': 'attachment; filename="' + response.fileName + '"',
                //         'Content-Type': response.type
                //     },
                //     data: base64Img
                // })
                // .then((res) => {
                //     console.log(res.data)
                // })
                // .catch(err => {
                //     console.log(err.message);
                // })

            }
        });
    }

    PhoneLinking = () => {
        this.props.navigation.navigate("PhoneAuth", {
            isLinking: "true",
            UI: this.props.UI
        })
    }

    FacebookLinking = () => {
        LoginManager.logInWithPermissions(["public_profile"]).then(
            result => {
                if (result.isCancelled) {
                    console.log("Login cancelled");
                } else {
                    console.log(
                        "Login success with permissions: " +
                            result.grantedPermissions.toString()
                    );
                    this.FBGraphRequest('id, name, picture.type(large)', this.FBLoginCallback);
                }
            })
            .catch(
                error => {
                    console.log("Login fail with error: " + error);
                }
            );
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

    FBLoginCallback = async(error, result) => {
        if (error) {
          console.log(error.errorMessage);
        } else {
            const existingAccount = await checkAccountExisting(result.id, "facebook")
            if(!existingAccount) {
                Alert.alert('Tài khoản đã được liên kết');
                await updateUserFbToken(this.props.user.id, result.id)
                this.props.updateUser(this.props.user.id)
            } else Alert.alert('Tài khoản đã tồn tại')
        }
    }

    render(){
        const { user } = this.props
        const { textColor, backgroundColor } = this.props.UI
        return(
            <SafeAreaView
            style={{ flex: 1 }}
                >
                <View
                    style={{
                        height: 50,
                        flexDirection: "row",
                        alignItems:'center',
                        backgroundColor: backgroundColor
                    }}
                >
                    <BackIcon style={{flex: 1, width: 50, height:50, alignItems: 'center', justifyContent: 'center'}}
                              onPress={() => {
                                        this.props.navigation.goBack()
                                    }}
                    />
                    <View style={{flex: 3, alignItems: "center"}}><Text style={{fontSize: 20, fontWeight: "bold", color: textColor }}>Cập nhật Hồ Sơ</Text></View>
                    <TouchableOpacity style={styles.saveBtn} onPress={this.handleSubmit}>
                    {this.state.isUpdating ?
                        <ActivityIndicator /> :
                        <Text style={{ fontSize: 18, fontWeight:'bold', color: 'red' }}>Lưu</Text>
                        }
                    </TouchableOpacity>
                </View>

                <ScrollView>
                    <View style={[styles.container, { backgroundColor: backgroundColor }]}>

                            <Text style={[styles.titleText, { color: textColor }]}>GENERAL INFORMATION</Text>

                            <View style={styles.profileSection}>
                                <View style={styles.photoView}>
                                    <Text style={{ color: textColor }}>Profile Photo</Text>
                                    <TouchableOpacity style={styles.photo} onPress={this.updateAvatar}>
                                        <FastImage
                                            style={styles.image}
                                            source={{uri: user.custom_avatar || defaultImg}}
                                            resizeMode={FastImage.resizeMode.cover}
                                        />
                                        <Icon name='camera' type="evilicon" size={40} iconStyle={styles.photoIcon}/>
                                    </TouchableOpacity>
                                    <View style={styles.rankView}>
                                    <Text style={styles.rankText}>{user.exp_rank ? user.exp_rank.post.post_title : "No information"}</Text>
                                    </View>

                                </View>

                                <View style={styles.memberView}>
                                    <View style={styles.nameInputView}>
                                        <View style={{ flex: 1, alignItems: 'center' }}>
                                            <Text style={[styles.labelText, { color: textColor, marginLeft: 0 }]}>Tên</Text>
                                            <TextInput placeholder={user.name || 'Điền tên'} onChangeText={(text) => this.setState({user_name: text})} style={[styles.formInput, { width: 150, marginLeft: 120 }]} placeholderTextColor="#949494"/>
                                        </View>

                                        <View style={{ flex: 1 }} />
                                    </View>

                                    <View style={styles.XuAndExp}>
                                        <View style={styles.rewardItem}>
                                            <Text style={[styles.rewardItemText, { color: textColor} ]}>Xu</Text>
                                            <Text style={{color: "#ffb040", fontSize: 20}}>{user.xu}</Text>
                                        </View>
                                        <View style={{ backgroundColor: "#949494", height: 50, width: 2}}></View>
                                        <View style={styles.rewardItem}>
                                            <Text style={[styles.rewardItemText, { color: textColor }]}>Exp</Text>
                                            <Text style={{color: "#ffb040", fontSize: 20}}>{user.exp || "0"}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <ModalDropdown options={['Nam', 'Nữ']} defaultValue={("Giới tính: " + this.state.gender || "Chọn giới tính") + ".."}
                                style={styles.selectBtnView}
                                textStyle={styles.selectBtnText}
                                dropdownStyle={styles.dropDown}
                                dropdownTextStyle={styles.dropDownText}
                                onSelect={(itemIndex, itemValue) =>
                                this.setState({gender: itemValue})
                              }
                            />

                            <ModalDropdown
                                defaultValue={("Sở thích: " + this.state.so_thich || 'Chọn sở thích') + ".."}
                                style={styles.selectBtnView}
                                textStyle={styles.selectBtnText}
                                dropdownStyle={styles.dropDown}
                                dropdownTextStyle={styles.dropDownText}
                                onSelect={(itemIndex, itemValue) =>
                                          this.setState({so_thich: itemValue})
                                         }
                                options={this.state.hobbyChoices}
                            />

                            <DatePicker date={this.state.birth_date} handleSelectedDate={this.handleSelectedDate}/>

                            <View style={[styles.selectBtnView, { height: (Platform.OS == 'ios') ? 30 : 42 }]}>
                                <TextInput
                                    style={[styles.selectBtnText, { marginLeft: (Platform.OS == 'android') ? -5 : 0 }]}
                                    placeholder={"Địa chỉ: " + (user.acf.location || '...')}
                                    onChangeText={text => this.setState({ location: text })}
                                    placeholderTextColor="#949494"

                                    />
                            </View>
                    </View>

                    <View style={[styles.container, { backgroundColor: backgroundColor }]}>
                            <Text style={[styles.labelText, { color: textColor }]}>Email</Text>
                            <TextInput placeholder={user.acf.custom_email || 'Điền email'} onChangeText={(text) => this.setState({user_email: text})} style={styles.formInput} placeholderTextColor="#949494"/>

                            <Text style={[styles.labelText, { color: textColor }]}>Số điện thoại</Text>
                            {!user.email.includes("mobile") ?
                            <TouchableOpacity onPress={this.PhoneLinking} style={[styles.selectBtnView, { marginBottom: 0 }]}>
                                <Text style={styles.selectBtnText}>{(user.acf.phoneNumber) ? user.acf.phoneNumber + " / Nhấp vào để thay đổi" : "Nhấp vào để liên kết"}</Text>
                            </TouchableOpacity> :
                            <View style={[styles.selectBtnView, { marginBottom: 0 }]}>
                                <Text style={styles.selectBtnText}>{user.acf.phoneNumber}</Text>
                            </View>
                            }

                            <Text style={[styles.labelText, { color: textColor }]}>Tài khoản Facebook</Text>
                            {!user.email.includes("facebook") ?
                            <TouchableOpacity onPress={this.FacebookLinking} style={[styles.selectBtnView, { marginBottom: 10 }]}>
                                <Text style={styles.selectBtnText}>{user.acf.fbToken && "Đã liên kết, nhấp vào để thay đổi" || "Nhấp vào để liên kết"}</Text>
                            </TouchableOpacity> :
                            <View style={[styles.selectBtnView, { marginBottom: 10 } ]}>
                                <Text style={styles.selectBtnText}>{user.name}</Text>
                            </View>
                            }

                            <Text style={{color: '#696969', marginHorizontal: 10, fontSize: 16, lineHeight: 24, marginBottom: 20, marginLeft: 10}}>Lưu ý: bạn cần điền đầy đủ thông tin trước khi thực hiện đổi quà</Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    saveBtn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    labelText: {
        fontSize: 20,
        marginVertical: 10,
        marginLeft: 10
    },
    formInput: {
        marginLeft: 10,
        fontSize: 18,
        borderBottomWidth: 1,
        color: '#949494',
        borderBottomColor: '#D9D8D9',
        paddingTop: (Platform.OS == 'android') ? -10 : 0,
        paddingBottom: 10,
    },
    inputText: {
        color: '#949494'
    },
    container: {
        marginTop: 5,
        paddingHorizontal: 20,
    },
    profileSection: {
        flexDirection: 'row',
        height: 200,
    },
    titleText: {
        marginVertical: 10,
        fontWeight: '500',
        fontSize: 14
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 60,
        opacity: 0.7,
        backgroundColor: '#DCDCDC'
    },
    photoView: {
        flex:1,
    },
    photo: {
        marginTop: 10,
        width: 120,
        height: 120,
        justifyContent: 'center'
    },
    photoIcon: {
        position: 'absolute',
        bottom: 40,
        color: '#fff'
    },
    memberView: {
        padding: 10,
        flex: 2,
    },
    rewardSection: {
        marginTop: 10,
    },
    nameInputView:{
        flexDirection: "row",
        alignItems: 'center'
    },
    XuAndExp:{
        borderRadius: 10,
        flexDirection: "row",
        marginVertical: 10,
        alignItems: 'center'
    },
    rewardItem:{
        alignItems: "center",
        flex: 1,
        padding: 10,
        flexDirection: "column",
    },
    rewardItemText:{
        fontSize: 20,
    },
    rankView:{
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        borderColor: "#949494",
        borderWidth: 1,
        paddingVertical: 3,
    },
    rankText: {
        color: "#ffb040",
        fontSize: 16,
    },
    selectBtnView: {
        borderBottomWidth: 1,
        borderColor: '#D9D8D9',
        height: 30,
        marginHorizontal: 10,
        marginBottom: 20
    },
    selectBtnText: {
        fontSize: 18,
        color: '#949494'
    },
    dropDown: {
        width: Dimensions.get('window').width - 60,
        height: 80,
    },
    dropDownText: {
        fontSize: 16
    }
})

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
        updateUserAvatar: (path) => {dispatch(updateUserAvatar(path))}
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(UserProfileEditScreen)