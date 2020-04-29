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
} from 'react-native';
import { connect } from 'react-redux';
import { Avatar, Card, Icon, Button, Divider, Badge } from 'react-native-elements';
import Sources from '../../components/Sources';
import axios from 'axios';
import BackIcon from '../../components/BackIcon';
import { api_url } from '../../constants/API.js';

class FollowingScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state={
            data: []
        }
        this.cancelTokenSource = axios.CancelToken.source()
    }

    componentDidMount() {
        console.log(this.props.user.subscribed)
        this.setState({data: Object.values(this.props.user.subscribed)})
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
                            borderBottomColor: '#e0e0e0',

                        }}
                    >
                        <BackIcon style={{flex: 1, width: 50, height:50, alignItems: 'center', justifyContent: 'center'}}
                                  onPress={() => {
                                            navigation.goBack()
                                            navigation.openDrawer()
                                        }}
                        />
                        <View style={{flex: 4, alignItems: "center"}}><Text style={{fontSize: 20, fontWeight: "bold", color: textColor}}>Theo dõi</Text></View>
                        <View style={{flex: 1}}></View>
                    </SafeAreaView>
            )
        }
    }

    componentWillUnmount() {
        this.cancelTokenSource && this.cancelTokenSource.cancel()
    }

    render(){
        return(
            <View style={{flex: 1, backgroundColor: this.props.UI.backgroundColor}}>
                <FlatList
                    data={this.state.data}
                    extraData={this.state.data}
                    renderItem={({ item, index }) => <Sources item={item} navigation={this.props.navigation} index={index}/>}
                    ListEmptyComponent={() => (<Text style={{ padding: 10, color: this.props.UI.textColor, fontSize: 16 }}> Theo dõi các nguồn tin để cập nhật nhiều bài viết mới nhất </Text>)}
                    keyExtractor={item => item}
                />
            </View>
        )
    }
};

const mapStateToProps = (state) => {
    return {
        UI: state.UI,
        user: state.session.user
    }
}

export default connect(mapStateToProps)(FollowingScreen)