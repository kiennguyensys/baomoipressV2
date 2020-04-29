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
import axios from 'axios';
import FastImage from 'react-native-fast-image';
import { api_url } from '../constants/API.js';

const defaultImg = 'https://matthewsenvironmentalsolutions.com/images/com_hikashop/upload/thumbnails/400x400/not-available.png'

class Sources extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            source: {},
            allSources: [],
            user:{},
            img: defaultImg,
        }
    }

    componentDidMount(){
        this.cancelTokenSource = axios.CancelToken.source()
        axios.all([
            axios.get(api_url + "source/" + this.props.item, {
                cancelToken: this.cancelTokenSource.token
            }),
            axios.get(api_url + "get_source_logo", {
                cancelToken: this.cancelTokenSource.token
            })
        ])
        .then(axios.spread((sourceRes, allSourcesRes) => {
            this.setState({
                source: sourceRes.data,
                allSources: allSourcesRes.data
            }, () => {
                const source_array = this.state.allSources.filter(e => e.title.toUpperCase() === this.state.source.name.toUpperCase())
                if(source_array.length != 0) this.setState({img : source_array[0].img})
            })
        }))
        .catch(err => {
            if(axios.isCancel(err)){
                return
            }else{
                console.log(err)
            }
        })

        AsyncStorage.getItem('user')
        .then(res => {
            if(res){
                const user = JSON.parse(res)
                this.setState({
                    user: user
                })
            }
        })
    }

    componentWillUnmount() {
        this.cancelTokenSource && this.cancelTokenSource.cancel()
    }

    render(){
        const { source } = this.state
        const { textColor, backgroundColor } = this.props.UI
        return(
            <View style={{ backgroundColor: backgroundColor, paddingHorizontal: 5}}>
                {source !== {} &&
                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate("Source", {
                            source: this.state.source,
                            UI: this.props.UI
                        })}
                    >
                        <View style={{justifyContent: "space-between"}}>
                            <View></View>
                            <View style={{marginTop: 10, marginBottom: 10, flexDirection: "row", alignItems: "center"}}>
                                <View style={{height: 36 , width: 36, borderRadius: 36/2, alignItems:'center', justifyContent:'center'}}>
                                      <FastImage
                                      source={{uri: this.state.img || defaultImg}}
                                      resizeMode={FastImage.resizeMode.contain}
                                      style={{width: 36, height: 36, borderRadius: 36/2}}
                                      />
                                </View>
                                <Text style={{color: textColor, fontWeight: "bold", fontSize: 17, marginLeft: 10}}>{this.state.source.name}</Text>
                            </View>
                            <Divider style={{ backgroundColor: '#e0e0e0', height: 1}} />
                        </View>
                    </TouchableOpacity>
                }
            </View>
        )
    }
};

const mapStateToProps = (state) => {
    return{
        UI: state.UI
    }
}

export default connect(mapStateToProps)(Sources)