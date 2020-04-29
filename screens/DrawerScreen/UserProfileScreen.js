import React from 'react';
import { Text, Platform, View, AsyncStorage, StyleSheet, TouchableOpacity, Picker, ScrollView, SafeAreaView } from 'react-native';
import { Avatar, Card, Icon, Button } from 'react-native-elements';
import { connect } from 'react-redux';
import BackIcon from '../../components/BackIcon'
import { api_url } from '../../constants/API.js';
import { updateUserAvatar } from '../../store/actions/sessionActions';
import ImagePicker from 'react-native-image-picker';

const defaultImg = 'https://www.ucsusa.org/sites/default/files/2019-09/no_photo_avatar.png'
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/yankeesim/upload';


class UserProfileScreen extends React.PureComponent {

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
                        borderBottomColor: '#C0C0C0'
                        }}
                    >
                        <BackIcon style={{flex: 1, width: 50, height:50, alignItems: 'center', justifyContent: 'center'}}
                                  onPress={() => {
                                            navigation.goBack()
                                            navigation.openDrawer()
                                        }}
                        />
                        <View style={{flex: 4, alignItems: "center"}}><Text style={{fontSize: 20, fontWeight: "bold", color: textColor}}>Hồ Sơ</Text></View>
                        <View style={{flex: 1}}></View>

                    </SafeAreaView>
            )
        }
    }

    updateAvatar = () => {
        const options = {
            title: 'Select Avatar',
            storageOptions: { skipBackup: true, path: 'images', cameraRoll: true, waitUntilSaved: true },
        };

        ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                let base64Img = `data:image/jpg;base64,${response.data}`;

                let dataObj = {
                    "file": base64Img,
                    "upload_preset": "avatar_file",
                }

                fetch(CLOUDINARY_URL, {
                    body: JSON.stringify(dataObj),
                    headers: {
                        'content-type': 'application/json'
                    },
                    method: 'POST',
                }).then(async r => {
                    let data = await r.json()
                    this.props.updateUserAvatar(data.url)
                }).catch(err => console.log(err))
            }
        });
    }

    render(){
        const {user} = this.props
        return(
            <View style={styles.container}>
                <View style={styles.avatar_name_email}>
                    {user.avatar_urls &&
                        <TouchableOpacity onPress={this.updateAvatar}>
                            <Avatar
                                overlayContainerStyle={styles.avatar}
                                large
                                width={100}
                                rounded
                                source={{uri: user.custom_avatar || defaultImg}}
                            />
                        </TouchableOpacity>
                    }
                    <View style={styles.name_email}>
                        <Text style={styles.name}>{user.name || "No info"}</Text>
                    </View>
                </View>
                <View style={styles.usersConfig}>
                    <View style={styles.XuAndExp}>
                        <View style={styles.menuItem}>
                            <Text style={styles.menuItemText}>Xu</Text>
                            <Text style={{color: "#ffb040", fontSize: 35}}>{user.xu}</Text>
                        </View>
                        <View style={{ backgroundColor: "#949494", height: 100, width: 2}}></View>
                        <View style={styles.menuItem}>
                            <Text style={styles.menuItemText}>Exp</Text>
                            <Text style={{color: "#ffb040", fontSize: 35}}>{user.exp || "0"}</Text>
                        </View>
                    </View>
                    <ScrollView>
                        <View style={styles.userInfo}>
                            <Text style={{fontSize: 20,}}>Tên</Text>
                            <Text style={{fontSize: 20, color: '#696969'}}>{user.name}</Text>
                        </View>
                        <View style={styles.userInfo}>
                            <Text style={{fontSize: 20,}}>Email</Text>
                            <Text style={{fontSize: 20, color: '#696969'}}>{user.user_email || "No info"}</Text>
                        </View>
                        <View style={styles.userInfo}>
                            <Text style={{fontSize: 20,}}>Ngày Sinh</Text>
                            <Text style={{fontSize: 20, color: '#696969'}}>{user.birth_date || "No info"}</Text>
                        </View>
                        <View style={styles.userInfo}>
                            <Text style={{fontSize: 20,}}>Giới Tính</Text>
                            <Text style={{fontSize: 20, color: '#696969'}}>{user.gender || "No info"}</Text>
                        </View>
                        <View style={styles.userInfo}>
                            <Text style={{fontSize: 20,}}>Số điện thoại</Text>
                            <Text style={{fontSize: 20, color: '#696969'}}>{user.mobile_number || "No Info"}</Text>
                        </View>
                        <View style={styles.userInfo}>
                            <Text style={{fontSize: 20,}}>Sở thích</Text>
                            <Text style={{fontSize: 20, color: '#696969'}}>{user.so_thich || "No Info"}</Text>
                        </View>
                        <Button
                            style={{ marginTop: 10 }}
                            buttonStyle={styles.button}
                            title="Chỉnh sửa"
                            onPress={() => this.props.navigation.navigate("UserProfileEdit", { UI: this.props.UI })}
                        />
                    </ScrollView>
                </View>
            </View>
        )
    }
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f3f3f3"
    },
    avatar_name_email: {
        padding: 10,
        backgroundColor: 'white',
        height: 110,
        flexDirection: "row",
        alignItems: "center",
        flex: 1
    },
    avatar: {
        margin: 10,
        backgroundColor: "white",
    },
    name_email: {
        padding: 10,
    },
    name:{
        fontSize: 30,
    },
    email:{
        fontSize: 17,
    },
    usersConfig:{
        marginTop: 4,
        flex: 5,
    },
    XuAndExp:{
        borderColor: "white",
        backgroundColor: "white",
        borderStyle: "solid",
        borderRadius: 10,
        borderWidth: 3,
        flexDirection: "row",
        marginHorizontal: 10,
        marginVertical: 10,
    },
    menuItem:{
        alignItems: "center",
        flex: 1,
        padding: 10,
        flexDirection: "column",
        backgroundColor: "white",
    },
    menuItemText:{
        fontSize: 30,
    },
    userInfo:{
        justifyContent: "space-between",
        padding: 10,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        height: 55,
    },
    button:{
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: '#e12f28',
        marginHorizontal: 10
    }
})

const mapStateToProps = (state) => {
    return {
        UI: state.UI,
        user: state.session.user
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateUserAvatar: (path) => {dispatch(updateUserAvatar(path))}
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileScreen)