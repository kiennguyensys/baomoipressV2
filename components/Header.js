import React from 'react';
import {
    Image,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Button,
    TouchableHighlight,
    Dimensions,
    SafeAreaView,
    StatusBar
} from 'react-native';
import {
    Icon,
    Avatar
} from 'react-native-elements';
import { connect } from 'react-redux';
import logo from '../assets/images/logo-press.png';
import FastImage from 'react-native-fast-image';

const {width} = Dimensions.get('window')


class Header extends React.Component {
    constructor(props) {
        super(props);
    }

    openDrawer = () => {
        requestAnimationFrame(() => {
            this.props.navigation.openDrawer()
        })
    }

    openSearch = () => {
        requestAnimationFrame(() => {
            this.props.navigation.navigate("Search", { UI: this.props.UI })
        })
    }


    render(){
        const UI = this.props.UI
        return(
            <SafeAreaView
                style={{
                    flexDirection: "row",
                    height: 50,
                    backgroundColor: UI.backgroundColor,
                    borderBottomWidth: (this.props.shouldHaveDivider) ? 1 : 0,
                    borderBottomColor: '#e0e0e0'
                }}
                elevation={(this.props.shouldHaveDivider) ? 5 : 0}
            >
                <TouchableOpacity style={{flex: 1, alignItems:'center', justifyContent:'center'}} onPress={this.openDrawer}>
                {this.props.user.custom_avatar ?
                    <FastImage
                        style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: '#DCDCDC' }}
                        source={{uri: this.props.user.custom_avatar}}
                        resizeMode={FastImage.resizeMode.cover}
                    /> :
                    <Icon
                    name='user'
                    type='feather'
                    size={22}
                    color='#696969'
                    />
                }
                </TouchableOpacity>
                <View
                    style={{ flex:3, alignItems: 'center', justifyContent: "center" }}
                >
                    <Image
                    source={logo}
                    style={{ height: 70 , width: 70, resizeMode:'contain' }}
                    />
                </View>
                <TouchableOpacity style={{flex: 1, alignItems:'center', justifyContent:'center'}} onPress={this.openSearch}>
                    <Icon
                    name='search'
                    size={25}
                    color='#696969'
                    />
                </TouchableOpacity>
            </SafeAreaView>
        )
    }
}

const mapStateToProps = (state) => {
    return{
        UI: state.UI,
        user: state.session.user
    }
}

export default connect(mapStateToProps)(Header)