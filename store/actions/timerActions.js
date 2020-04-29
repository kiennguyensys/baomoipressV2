export const SET_ADVERTISING_TIMER = 'SET_ADVERTISING_TIMER';
export const STOP_ADVERTISING_TIMER = 'STOP_ADVERTISING_TIMER';
export const COUNT_TO_ADVERTISING = 'COUNT_TO_ADVERTISING';
export const SHOW_INTERSTITIAL_AD = 'SHOW_INTERSTITIAL_AD';
export const HIDE_INTERSTITIAL_AD = 'HIDE_INTERSTITIAL_AD';

export const SET_ARTICLE_READING_TIMER = 'SET_ARTICLE_READING_TIMER';
export const STOP_ARTICLE_READING_TIMER = 'STOP_ARTICLE_READING_TIMER';
export const COUNT_TO_READING_REWARD = 'COUNT_TO_READING_REWARD';
export const REWARD_READING_EXP = 'REWARD_READING_EXP';
import { AsyncStorage } from 'react-native';
import axios from 'axios';
import { api_url } from '../../constants/API.js';

export const startAdvertisingTimer = (minutesToAdvertising) => {
    return dispatch => {
        const interval = setInterval(() => dispatch(checkAdvertisingCounting(minutesToAdvertising)), 1000);
        dispatch(setAdvertisingTimer(interval))
    }
}

export const setAdvertisingTimer = (interval) => {
    return {
        type: SET_ADVERTISING_TIMER,
        payload: {
            advertisingInterval: interval
        }
    }
}


export const stopAdvertisingTimer = (interval) => {
    clearInterval(interval)

    return {
        type: STOP_ADVERTISING_TIMER
    }
}

export const checkAdvertisingCounting = (minutesToAdvertising) => {
    return (dispatch, getState) => {
        const { advertisingTimer } = getState().timer;
        if((advertisingTimer % (minutesToAdvertising * 60)) === 0) {
            dispatch(showInterstitialAd())
        }

        dispatch(countToAdvertising());
    }
}

export const countToAdvertising = () => {
    return {
        type: COUNT_TO_ADVERTISING
    }
}

export const showInterstitialAd = () => {
    return {
        type: SHOW_INTERSTITIAL_AD
    }
}

export const hideInterstitialAd = () => {
    return {
        type: HIDE_INTERSTITIAL_AD
    }
}

export const checkPreviousSessionReadingCounting = () => {
    return async dispatch => {
        const previousCounting = await AsyncStorage.getItem('articleReadingSeconds')

        if(previousCounting) {
            dispatch(startArticleReadingTimer(Number.parseInt(previousCounting)))
        } else {
            dispatch(startArticleReadingTimer(1))
        }
    }
}

export const startArticleReadingTimer = (previousReadingCounting) => {
    return dispatch => {
        const interval = setInterval(() => dispatch(checkReadingCounting(3)), 1000);

        dispatch(setArticleReadingTimer(interval, previousReadingCounting))
    }
}

export const setArticleReadingTimer = (interval, previousReadingCounting) => {
    return {
        type: SET_ARTICLE_READING_TIMER,
        payload: { articleReadingInterval: interval, articleReadingTimer: previousReadingCounting || 1 }
    }
}

export const saveCurrentReadingCounting = () => {
    return (dispatch, getState) => {
        var { articleReadingTimer } = getState().timer
        if(articleReadingTimer > 1000) articleReadingTimer = 1

        AsyncStorage.setItem('articleReadingSeconds', articleReadingTimer.toString())
    }
}

export const stopArticleReadingTimer = (interval) => {
    clearInterval(interval)
    return {
        type: STOP_ARTICLE_READING_TIMER
    }
}

export const checkReadingCounting = (minutesToReward) => {
    return (dispatch, getState) => {
        const { articleReadingTimer } = getState().timer;
        if((articleReadingTimer % (minutesToReward * 60)) === 0) {
            dispatch(rewardReadingExp())
        }

        dispatch(countToReadingReward());
    }
}

export const countToReadingReward = () => {
    return {
        type: COUNT_TO_READING_REWARD
    }
}

export const rewardReadingExp = () => {
    return (dispatch, getState) => {
        const { user } = getState().session

        if(user.id) {
             axios({
                 method: "GET",
                 url: api_url + 'add_exp?ammount=1&action_type=reading&id=' + user.id.toString()
             })
        }
    }
}


