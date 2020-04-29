import React, { Component } from 'react';
import { AsyncStorage, Alert, View, Platform, NativeModules } from 'react-native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/messaging';
import { Notifications } from 'react-native-notifications';
import { notif_topic_name } from '../constants/API.js';

export default class App extends Component {
    constructor(props) {
        super(props);

        //local notification
        Notifications.events().registerNotificationOpened((notification, completion, action) => {
            const slug = notification.payload.userInfo.slug
            if(slug && slug.length) this.props.onPressArticle(slug)
            completion();
        });
    }

    async componentDidMount() {
        await this.registerAppWithFCM()
        this.checkPermission();
        this.createRemoteMessageListeners()
    };

    async registerAppWithFCM() {
        if(Platform == 'ios' && !firebase.messaging().isRegisteredForRemoteNotifications)
            return firebase.messaging().registerForRemoteNotifications()
    }

    async checkPermission() {
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            this.getToken();
        }
        else {
            this.requestPermission();
        }
    }

    async requestPermission() {
        try {
            await firebase.messaging().requestPermission();
            // User has authorised
            this.getToken();
        } catch (error) {
            console.log(error)
            // User has rejected permissions
            console.log('permission refused!');
        }
    }

    async getToken() {
        let fcmToken = await AsyncStorage.getItem('fcmToken');

        if (!fcmToken) {
            if (Platform.OS == 'ios') fcmToken = await NativeModules.FCM.getToken()
            else fcmToken = await firebase.messaging().getToken()

            console.log('fcmToken: ', fcmToken);
            if (fcmToken) {
                // user has a device token
                await AsyncStorage.setItem('fcmToken', fcmToken);
                //subscribe to news topic
                await firebase.messaging().subscribeToTopic(notif_topic_name);
                //finally push token to user database
            }
        }
    }

    async createRemoteMessageListeners() {
        this.messageListener = firebase.messaging().onMessage(async message => {
            const data = message.data

            Notifications.postLocalNotification({
                body: data.body,
                title: data.title,
                sound: "chime.aiff",
                silent: false,
                link: data.link || '',
                userInfo: { slug: data.slug }
            });
        });

        this.backgroundListener = firebase.messaging().onNotificationOpenedApp(remoteMessage => {
            if(remoteMessage) {
                const slug = remoteMessage.data.slug
                if(slug && slug.length){
                    this.props.onPressArticle(slug)
                }
            }
        });

        this.initialListener = firebase.messaging()
            .getInitialNotification()
            .then(remoteMessage => {
                if(remoteMessage) {
                    const slug = remoteMessage.data.slug
                    if(slug && slug.length){
                        this.props.onPressArticle(slug)
                    }
                }
            });

        this.headlessListener = firebase.messaging().setBackgroundMessageHandler(async remoteMessage => {
            console.log('Message handled in the background!', remoteMessage);
        });
    }

    render () {
        return <View></View>
    }
}