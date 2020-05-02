import { api_url, auth_url, acf_url } from '../../constants/API.js';
import { AsyncStorage } from 'react-native';
import axios from 'axios';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';

export const SIGN_IN = 'SIGN_IN';
export const SIGN_OUT = 'SIGN_OUT';
export const START_PROCESSING_USER_DATA = 'START_PROCESSING_USER_DATA';

//add user session actions
export const checkAuth = () => {
    return async dispatch => {
        var userToken = await AsyncStorage.getItem('userToken');
        var user = JSON.parse(await AsyncStorage.getItem('user'));

        if(user) {
            axios({
                method: "POST",
                url: auth_url + 'token/validate',
                headers: {'Authorization': 'Bearer ' + userToken},
            })
                .then((res) => {
                    if(res.status != 200){
                        dispatch(signOut())
                        dispatch(checkAuth())
                    }
                    else dispatch(updateUserData(user.id))
                })
                .catch(err => {
                    console.log(err)
                    dispatch(signOut())
                    dispatch(checkAuth())
                })
        } else {
            // get default token for registration
            axios.post(auth_url + 'token', {
                username: 'creator',
                password: 'creatorOfbaomoi.press',
                email: 'creator@gmail.com',
            })
                .then((response) => {
                    let userToken = response.data.token
                    AsyncStorage.setItem('userToken', userToken)
               })
                .catch((err) => {
                    console.log(err.response.data);
                });
        }
    }
}

export const checkAccountExisting = (accountToken, accountType) => {
//check whether account is linking
    if(accountType == "facebook"){
        return axios({
            method: "GET",
            url: api_url + "users?fbToken=" + accountToken
        })
            .then(res => {
                if(res.data.length){
                    //get main account
                    res.data[0].username = res.data[0].email.split('@')[0]
                    return res.data[0]
                } else {
                    return false
                }
            })
            .catch(err => {
                console.log(err.message);
            })
    }
    else if (accountType == "phoneNumber"){
        return axios({
            method: "GET",
            url: api_url + "users?phoneToken=" + accountToken
        })
            .then(res => {
                if(res.data.length){
                    //get main account
                    res.data[0].username = res.data[0].email.split('@')[0]
                    return res.data[0]
                } else {
                    return false
                }
            })
            .catch(err => {
                console.log(err.message);
            })
    }
    else return null
}

export const signInWithFB = (FBdata) => {
    return async dispatch => {
        dispatch(startProcessingUserData())
        var result = await getAccountAvailable(FBdata.id, FBdata.name, "facebook")
        if(result) {
            await updateStorageUserToken(result.username)
            //update only when main account type is facebook
            if(result.email.includes("facebook")) await postProcessWithFB(result.id, FBdata)
            dispatch(updateUserData(result.id))
        }
    }
}

export const signInWithPhoneNumber = (phoneNumber, id, name) => {
    return async dispatch => {
        dispatch(startProcessingUserData())
        firebase.auth().signOut() // signOut to prevent auto-signIn when editing number in Profile
        var result = await getAccountAvailable(id, name, "phoneNumber")
        if(result) {
            await updateStorageUserToken(result.username)
            //update only when main account type is phoneNumber
            if(result.email.includes("mobile")) {
                await updateUserPhoneToken(result.id, result.username)
                await updateUserPhoneNumber(result.id, phoneNumber)
            }
            dispatch(updateUserData(result.id))
        }
    }
}

const getAccountAvailable = async(id, name, accountType) => {
    const account = await checkAccountExisting(id, accountType)
    if(account) return account

    const userToken = await AsyncStorage.getItem('userToken')

    var generated_email
    if(accountType == "facebook") generated_email = id.toString() + "@facebook.com"
    if(accountType == "phoneNumber") generated_email = id.toString() + "@mobile.com"

    const account_data = {
        email: generated_email,
        username: id.toString(),
        name: name,
        password: id.toString() + "@press",
        roles: 'contributor'
    }
    return axios({
        method: "POST",
        url: api_url + 'users',
        headers: {'Authorization': 'Bearer ' + userToken},
        data: account_data
    })
        .then(res => {
            // NEW ACCOUNT
            return res.data
        })
        .catch(err => {
            console.log(err.response.data.code)
            return false
        })
}

const updateStorageUserToken = async(id) => {
    return axios.post(auth_url + 'token', {
        username: id,
        password: id.toString() + "@press"
    })
        .then((response) => {
            AsyncStorage.setItem('userToken', response.data.token)
            return response.data.token
        })
        .catch((err) => {
            console.log(err.response.data);
            return false
        });
}

export const updateUserFbToken = async(userID, id) => {
    const userToken = await AsyncStorage.getItem('userToken')
    const token_data = new FormData()
    token_data.append("fields[fbToken]", id)
    return axios({
        method: "POST",
        url: acf_url + 'users/' + userID,
        headers: {'Authorization': 'Bearer ' + userToken},
        data: token_data
    })
        .catch(error => console.log(error))
}

export const updateUserPhoneToken = async(userID, id) => {
    const userToken = await AsyncStorage.getItem('userToken')
    const token_data = new FormData()
    token_data.append("fields[phoneToken]", id)

    return axios({
        method: "POST",
        url: acf_url + 'users/' + userID,
        headers: {'Authorization': 'Bearer ' + userToken},
        data: token_data
    })
        .catch(error => console.log(error))
}

export const updateUserPhoneNumber = async(userID, phoneNumber) => {
    const userToken = await AsyncStorage.getItem('userToken')
    const phone_data = new FormData()
    phone_data.append("fields[phoneNumber]", phoneNumber)

    return axios({
        method: "POST",
        url: acf_url + 'users/' + userID,
        headers: {'Authorization': 'Bearer ' + userToken},
        data: phone_data
    })
        .catch(error => console.log(error))
}

const postProcessWithFB = async(userID, FBdata) => {
    const userToken = await AsyncStorage.getItem('userToken')

    updateUserFbToken(userID, FBdata.id)

    const avatar_data = new FormData()
    avatar_data.append("avatar_url", FBdata.picture.data.url)
    await axios({
        method: "POST",
        url: api_url + 'update_user_avatar',
        headers: {'Authorization': 'Bearer ' + userToken},
        data: avatar_data
    })
        .catch(error => console.log(error))

    const fbDisplayName_data = new FormData()
    fbDisplayName_data.append("name", FBdata.name)
    return axios({
        method: "POST",
        url: api_url + 'users/' + userID,
        headers: {'Authorization': 'Bearer ' + userToken},
        data: fbDisplayName_data
    })
        .catch(error => console.log(error))
}

export const updateUserAvatar = (path) => {
    return async dispatch => {
        const userToken = await AsyncStorage.getItem('userToken')
        var user = JSON.parse(await AsyncStorage.getItem('user'));

        const avatar_data = new FormData()
        avatar_data.append("avatar_url", path)
        axios({
            method: "POST",
            url: api_url + 'update_user_avatar',
            headers: {'Authorization': 'Bearer ' + userToken},
            data: avatar_data
        })
            .then(res  => dispatch(updateUserData(user.id)))
            .catch(error => console.log(error))
    }
}

export const updateUserData = (userID) => {
    return async dispatch => {
        const userToken = await AsyncStorage.getItem('userToken')

        axios({
            method: "GET",
            url: api_url + 'users/' + userID,
            headers: {'Authorization': 'Bearer ' + userToken},
        })
              .then(async(res) => {
                  dispatch(signIn(res.data, userToken))
                  await AsyncStorage.setItem('user', JSON.stringify(res.data))
                  pushFCMTokenToServer()

              })
              .catch(err => console.log(err))
    }
}

const pushFCMTokenToServer = async() => {
    let user = JSON.parse(await AsyncStorage.getItem('user'));
    let userToken = await AsyncStorage.getItem('userToken');
    let fcmToken = await AsyncStorage.getItem('fcmToken');

    if(user && fcmToken) {
        const data = new FormData()
        data.append("fields[fcmToken]", fcmToken)
        axios({
            method: "POST",
            url: acf_url + 'users/' + user.id,
            headers: {'Authorization': 'Bearer ' + userToken},
            data: data
        })
        .then((res) => {
            if(res.status == 200) {
                console.log("push fcmToken successfullly")
            }
        })
        .catch(err => {
            console.log("pushToken failed:" + err.message);
        })
    }
}

export const startProcessingUserData = () => {
    return {
        type: START_PROCESSING_USER_DATA
    }
}

export const signIn = (data, token) => {
    return {
        type: SIGN_IN,
        payload: { data, token }
    }
}

export const signOut = () => {
    AsyncStorage.removeItem('user')
    AsyncStorage.removeItem('userToken')

    return {
        type: SIGN_OUT
    }
}


