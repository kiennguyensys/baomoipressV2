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
import {
    Avatar,
    Card,
    Icon,
    Button,
    Divider,
    Badge
} from 'react-native-elements';
import { connect } from 'react-redux';
import FastImage from 'react-native-fast-image';
import axios from 'axios';
import BackIcon from '../../components/BackIcon'
import { api_url } from '../../constants/API.js';
import { customFont } from '../../constants/Fonts.js';
import dateformat from 'dateformat';
import Timeline from 'react-native-timeline-flatlist'


class NotificationScreen extends React.Component {

    constructor(){
        super()
        this.renderDetail = this.renderDetail.bind(this)
        this.renderTime = this.renderTime.bind(this)
        this.state = { data: undefined }
      }

    static navigationOptions = ({navigation}) => {
        return {
            tabBarVisible: false,
            headerShown: false
        }
    }


    componentDidMount() {
        this.cancelTokenSource = axios.CancelToken.source()
        this.getNotificationPosts()
    }

    getNotificationPosts = () => {
        axios.get(api_url + "notification?per_page=10",{
            cancelToken: this.cancelTokenSource.token
        })
        .then(res => {
            const newArrayWithIcons = res.data.map(item => {
                item.icon = require('../../assets/images/newspaper.png')
                return item
            })
            this.setState({ data: newArrayWithIcons })
        })
        .catch(err => console.log(err))
    }

    componentWillUnmount() {
        this.cancelTokenSource && this.cancelTokenSource.cancel()
    }

    renderTime(rowData, sectionID, rowID) {


        return (
          <View>
            {timeBox}
          </View>
        )
      }

    renderDetail(rowData, sectionID, rowID) {
        let title = <Text style={[styles.title]}>{rowData.acf.author}</Text>
        let time = dateformat(rowData.date, "h:MM TT")
        let date = dateformat(rowData.date, "dd-mm")
        var desc = null
        if(rowData.title && rowData.acf.thumb)
          desc = (
            <TouchableOpacity style={styles.descriptionContainer} onPress={() => this.props.navigation.navigate("NotificationDetail", { Article: rowData, UI: this.props.UI })}>
              {title}
              <FastImage source={{uri: rowData.acf.thumb}} style={styles.image}/>
              <Text style={[styles.textDescription, { color: this.props.UI.textColor }]}>{rowData.title.plaintitle}</Text>
              <View style={styles.timeBox}>
                  <Text style={[styles.timeText]}>{time}</Text>
                  <Text style={[styles.dateText]}>{date}</Text>
              </View>

            </TouchableOpacity>
          )

        return (
          <View style={{ flex:1, margin: 10 }}>
            {desc}
          </View>
        )
      }

    render(){
        const { textColor, backgroundColor } = this.props.UI
        return(
            <SafeAreaView style={[styles.container, { backgroundColor: backgroundColor }]}>
                <View
                    style={{
                        height: 50,
                        flexDirection: "row",
                        alignItems:'center',
                        backgroundColor: backgroundColor,
                        borderBottomWidth: 1,
                        borderBottomColor: '#e0e0e0',
                    }}
                >
                    <BackIcon style={{flex: 1, width: 50, height:50, alignItems: 'center', justifyContent: 'center'}}
                              onPress={() => {
                                        this.props.navigation.goBack()
                                    }}
                    />
                    <View style={{flex: 3, alignItems: "center"}}><Text style={{fontSize: 20, color: textColor }}>Thông báo</Text></View>
                    <View style={{flex:1}} />
                </View>

                {!this.state.data &&
                 <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ActivityIndicator size="large" />
                 </View>
                }
                <Timeline
                  //..other props
                  lineColor="#C0C0C0"
                  innerCircle={'icon'}
                  circleSize={24}
                  iconStyle={styles.icon}
                  data={this.state.data}
                  renderDetail={this.renderDetail}
                  listViewContainerStyle={[styles.listViewContainer ]}
                  showTime={false}
                />
            </SafeAreaView>
        )
    }
}

const styles = {
    container: {
        flex: 1
    },
    listViewContainer: {
        margin: 10
    },
    descriptionContainer: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#C0C0C0",
        borderRadius: 5,
        padding: 10,
        justifyContent: 'center'
    },
    textDescription: {
        fontSize: 17,
        fontWeight: 'bold',
        fontFamily: customFont,
        lineHeight: 25
    },
    image: {
        marginVertical: 10,
        backgroundColor: '#DCDCDC',
        height: 150,
    },
    title: {
        fontSize: 16,
        color: "#696969"
    },
    timeBox: {
        flex: 1,
        flexDirection: 'row',
        height: 30,
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 10
    },
    timeText: {
        fontSize: 14,
        color: "#C0C0C0",
    },
    dateText: {
        fontSize: 14,
        color: "#C0C0C0",
    },
    icon: {
        width: 24,
        height: 24,
        borderRadius: 24/2
    }
}

const mapStateToProps = (state) => {
    return {
        UI: state.UI
    }
}

export default connect(mapStateToProps)(NotificationScreen)
