import {
    SET_ADVERTISING_TIMER,
    STOP_ADVERTISING_TIMER,
    COUNT_TO_ADVERTISING,
    SHOW_INTERSTITIAL_AD,
    HIDE_INTERSTITIAL_AD,
    SET_ARTICLE_READING_TIMER,
    STOP_ARTICLE_READING_TIMER,
    COUNT_TO_READING_REWARD,
} from '../actions/timerActions.js';
import { AsyncStorage } from 'react-native';

const initState = {
    advertisingInterval: null,
    advertisingTimer: 1,
    shouldShowInterstitialAd: false,
    articleReadingInterval: null,
    articleReadingTimer: 1
}

export const timerReducer = (state = initState, action) => {
    if(action.type === SET_ADVERTISING_TIMER){
        return {
            ...state,
            advertisingInterval: action.payload.advertisingInterval
        }
    }

    if(action.type === STOP_ADVERTISING_TIMER){
        return {
            ...state,
            advertisingInterval: null,
            advertisingTimer: 1
        }
    }

    if(action.type === COUNT_TO_ADVERTISING){
        return {
            ...state,
            advertisingTimer: state.advertisingTimer + 1
        }
    }

    if(action.type === SHOW_INTERSTITIAL_AD){
        return {
            ...state,
            shouldShowInterstitialAd: true
        }
    }

    if(action.type === HIDE_INTERSTITIAL_AD){
        return {
            ...state,
            shouldShowInterstitialAd: false
        }
    }

    if(action.type === SET_ARTICLE_READING_TIMER){
        return {
            ...state,
            articleReadingInterval: action.payload.articleReadingInterval,
            articleReadingTimer: action.payload.articleReadingTimer
        }
    }

    if(action.type === STOP_ARTICLE_READING_TIMER){
        return {
            ...state,
            articleReadingInterval: null,
            articleReadingTimer: 1
        }
    }

    if(action.type === COUNT_TO_READING_REWARD){
        return {
            ...state,
            articleReadingTimer: state.articleReadingTimer + 1
        }
    }

    return state
}

