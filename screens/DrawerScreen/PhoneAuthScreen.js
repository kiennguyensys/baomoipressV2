import React, { Component } from 'react'
import {
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  View,
  Text,
  TextInput,
  Alert,
  Platform
} from 'react-native'
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import { connect } from 'react-redux';
import { signInWithPhoneNumber, checkAccountExisting, updateUserPhoneToken, updateUserPhoneNumber, updateUserData } from '../../store/actions/sessionActions';
import BackIcon from '../../components/BackIcon';
import { customFont } from '../../constants/Fonts';

class PhoneAuthScreen extends Component {
    state = {
        phone: '',
        countryCode: '+84',
        expirationTimer: 120,
        verificationCode: '',
        verificationId: null,
        signInButtonThemeColor: '#E9E9E9'
    }

    componentDidMount() {
        this.authListener = firebase.auth().onAuthStateChanged(user => {
            if (user) {
                const isLinkingAccount = this.props.navigation.getParam("isLinking")

                if(isLinkingAccount) {
                    this.processAccountLinking(user.uid)
                }
                else {
                    Alert.alert("Đăng nhập thành công!")
                    this.props.signInWithPhoneNumber(this.state.countryCode + this.state.phone, user.uid, "Guest")

                    requestAnimationFrame(() => {
                        this.props.navigation.pop()
                    })
                }

                firebase.auth().signOut()

            }
        });
    }

    startExpirationTimer = () => {
        this.interval = setInterval(
            () => this.setState( prevState => ({ expirationTimer: prevState.expirationTimer - 1 })),
            1000
        );
    }

    componentWillUnmount() {
        this.authListener()
        if(this.interval) clearInterval(this.interval);
    }

    componentDidUpdate(){
        if(this.state.expirationTimer === 0){
            clearInterval(this.interval);
            Alert.alert("Xin thử lại nếu không nhận được mã xác nhận")
            this.setState({ expirationTimer: 120, verificationId: null })
        }
    }

    static navigationOptions = ({
        navigation
    }) => {
        const { params = {} } = navigation.state
        const { textColor, backgroundColor } = params.UI
        return {
            tabBarVisible: false,
            header: () => (
                    <SafeAreaView
                        style={{
                        height: 50,
                        flexDirection: "row",
                        backgroundColor: "white",
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
                        <View style={{flex: 4, alignItems: "center"}}><Text style={{fontSize: 20, fontWeight: "bold" }}>Đăng nhập bằng SMS</Text></View>
                        <View style={{flex: 1}}></View>
                    </SafeAreaView>
            )
        }
    }

  processAccountLinking = async(uid) => {
      const result = await checkAccountExisting(uid, "phoneNumber")
      if(result) Alert.alert("Tài khoản đã được sử dụng")
      else {
          await updateUserPhoneToken(this.props.user.id, uid)
          await updateUserPhoneNumber(this.props.user.id, this.state.countryCode + this.state.phone)
          Alert.alert('Tài khoản đã được liên kết')
          this.props.updateUserData(this.props.user.id)
          this.props.navigation.goBack()
      }
  }

  validatePhoneNumber = () => {
    var regexp = /^\+[0-9]?()[0-9](\s|\S)(\d[0-9]{8,16})$/
    return regexp.test(this.state.countryCode + this.state.phone)
  }

  onChangeVerificationCode = (verificationCode) => {
      this.setState({ verificationCode })
      if((verificationCode.length == 6) && this.state.verificationId) {
          this.setState({ signInButtonThemeColor: 'red' })
      }
      if((verificationCode !== 6) && (this.state.signInButtonThemeColor === 'red' )) {
          this.setState({ signInButtonThemeColor: '#E9E9E9' })
      }
  }

  handleSendCode = () => {
    // Request to send OTP
    if (this.validatePhoneNumber()) {
      firebase
        .auth()
        .verifyPhoneNumber(this.state.countryCode + this.state.phone, 120)
        .on('state_changed', (phoneAuthSnapshot) => {
            if(phoneAuthSnapshot.state === firebase.auth.PhoneAuthState.CODE_SENT){
                return Promise.resolve()
            }

            if(phoneAuthSnapshot.state === firebase.auth.PhoneAuthState.AUTO_VERIFIED){
                return Promise.resolve()
            }

            if(phoneAuthSnapshot.state === firebase.auth.PhoneAuthState.ERROR) {
                Alert.alert("Lỗi xảy ra! Xin vui lòng thử lại lúc khác")
                alert(phoneAuthSnapshot.error)
                return Promise.reject(
                    new Error('Code not sent!')
                );
            }

            if(phoneAuthSnapshot.state === firebase.auth.PhoneAuthState.AUTO_VERIFIED_TIMEOUT) {
                Alert.alert("Mã xác nhận hết hạn! Xin vui lòng thử lại")
                return Promise.reject()
            }
        })
        .then((phoneAuthSnapshot) => {
            if(phoneAuthSnapshot.state === firebase.auth.PhoneAuthState.AUTO_VERIFIED){

                this.setState({ verficationId: phoneAuthSnapshot.verificationId })
                this.setState({ verificationCode: phoneAuthSnapshot.code })

                const provider = firebase.auth.PhoneAuthProvider;
                const authCredential = provider.credential( phoneAuthSnapshot.verificationId, phoneAuthSnapshot.code );

                firebase.auth().signInWithCredential(authCredential);
            } else {
                this.setState({ verificationId: phoneAuthSnapshot.verificationId })
            }

            this.startExpirationTimer()
        }, (error) => {
          Alert.alert("Lỗi xảy ra, xin thử lại lúc khác")
        });
    } else {
      Alert.alert('Số điện thoại không hợp lệ!')
    }
  }

  handleVerifyCode = async() => {
    // Request for OTP verification
    const { verificationCode, verificationId } = this.state
    if (verificationCode.length == 6) {
      if(!verificationId) Alert.alert('Bạn cần gửi mã xác thực trước')
      else {
        const provider = firebase.auth.PhoneAuthProvider;
        const authCredential = provider.credential( verificationId, verificationCode );

        await firebase.auth().signInWithCredential(authCredential);

      }
    } else {
      Alert.alert('Hãy nhập mã OTP 6 chữ số')
    }
  }

  render() {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: 'white' }]}>
        <View style={styles.title}>
            <View style={{ flex: 1, height: 1, backgroundColor: '#696969', marginRight: 10 }} />
            <Text style={styles.titleText} multiline>Đăng nhập bằng SMS</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: '#696969', marginLeft: 10 }} />
        </View>

        <View style={styles.InputView}>
            <TextInput
                style={styles.countryCodeInput}
                keyboardType='phone-pad'
                value={this.state.countryCode}
                onChangeText={countryCode => {
                  this.setState({ countryCode })
                }}
                maxLength={4}

              />

            <TextInput
                style={styles.phoneNumberInput}
                placeholder='Nhập SĐT'
                placeholderTextColor='#C0C0C0'
                keyboardType='phone-pad'
                value={this.state.phone}
                onChangeText={phone => {
                  this.setState({ phone })
                }}
                maxLength={15}
              />

            <TouchableOpacity
                style={styles.sendCodeButton}
                onPress={
                  !this.state.confirmResult && this.handleSendCode
                }>
                <Text style={styles.sendCodeTitle}>
                {(this.state.expirationTimer === 120) ? "Gửi" : (this.state.expirationTimer + "s")}
                </Text>
             </TouchableOpacity>



        </View>

        <View style={styles.InputView}>
            <TextInput
              style={styles.verificationInput}
              placeholder='Nhập mã xác nhận'
              placeholderTextColor='#C0C0C0'
              value={this.state.verificationCode}
              keyboardType='numeric'
              onChangeText={this.onChangeVerificationCode}
              maxLength={6}
            />
        </View>

        <TouchableOpacity
            style={[styles.themeButton, { marginTop: 20, backgroundColor: this.state.signInButtonThemeColor }]}
            onPress={
                this.handleVerifyCode
            }>
            <Text style={styles.themeButtonTitle}>
              Đăng nhập
            </Text>
         </TouchableOpacity>

        {(Platform.OS === 'android') &&
         <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <Text style={styles.autoVerificationHint}>Lưu ý:</Text>
            <Text style={[styles.autoVerificationHint, { marginTop: 10, color: '#696969' }]}>Một số thiết bị có thể tự động xác nhận mã OTP nên bạn sẽ không cần nhập</Text>
         </View>
        }

      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  title: {
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    margin: 20,
  },
  titleText: {
    color: '#C0C0C0',
    flex: 2,
    textAlign: 'center',
    fontSize: 16
  },
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  InputView: {
    flexDirection: 'row',
    margin: 20,
    borderWidth: 1,
    borderColor: '#E9E9E9',
    borderRadius: 30,
  },
  countryCodeInput: {
    color: '#696969',
    flex: 1,
    height: (Platform.OS == 'ios') ? 30 : 40,
    justifyContent: 'center',
    borderRightColor: '#696969',
    borderRightWidth: 1,
    margin: 10,
    textAlign: 'center',
    fontSize: 16
  },
  phoneNumberInput: {
    flex: 3,
    height: (Platform.OS == 'ios') ? 30 : 40,
    margin: 10,
    justifyContent: 'center',
    fontSize: (Platform.OS == 'ios') ? 16 : 16,
    borderRightColor: '#696969',
    borderRightWidth: 1,
  },
  verificationInput: {
    flex: 1,
    justifyContent: 'center',
    height: (Platform.OS == 'ios') ? 30 : 40,
    marginVertical: 10,
    marginLeft: 20,
    fontSize: (Platform.OS == 'ios') ? 16 : 16,
  },
  sendCodeButton: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sendCodeTitle: {
    textAlign: 'center',
    color: 'red',
    fontSize: 18,
  },
  themeButton: {
    width: '90%',
    height: (Platform.OS == 'ios') ? 50 : 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E9E9E9',
    borderRadius: 30
  },
  themeButtonTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff'
  },
  autoVerificationHint: {
    fontSize: 17,
    color: 'red',
    fontFamily: customFont,
    marginTop: 40,
    marginHorizontal: 20,
    lineHeight: 25
  }
})

const mapStateToProps = (state) => {
    return {
        user: state.session.user
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        signInWithPhoneNumber: (phoneNumber, id, name) => {dispatch(signInWithPhoneNumber(phoneNumber, id, name))},
        updateUserData: (id) => {dispatch(updateUserData(id))}
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
// )(PhoneAuthScreen)
)(PhoneAuthScreen)