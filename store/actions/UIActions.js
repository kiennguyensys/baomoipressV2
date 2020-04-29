import { AsyncStorage } from 'react-native';
export const TOGGLE_LIGHT_MODE = 'TOGGLE_LIGHT_MODE';
export const TOGGLE_DARK_MODE = 'TOGGLE_DARK_MODE';
export const SMALL_TEXT_SIZE = 'SMALL_TEXT_SIZE';
export const MEDIUM_TEXT_SIZE = 'MEDIUM_TEXT_SIZE';
export const LARGE_TEXT_SIZE = 'LARGE_TEXT_SIZE';

//add UI action

export const checkUI = () => {
    return async dispatch => {
        const theme = await AsyncStorage.getItem("theme")
        const textSize = await AsyncStorage.getItem("textSize")

        if(theme && theme === 'dark') dispatch(toggleDarkMode())
        if(textSize){
            if(textSize === "small") dispatch(resizeToSmallText())
            if(textSize === "medium") dispatch(resizeToMediumText())
            if(textSize === "large") dispatch(resizeToLargeText())
        }
    }
}
export const toggleLightMode = () => {
    return {
        type: TOGGLE_LIGHT_MODE
    }
}

export const toggleDarkMode = () => {
    return {
        type: TOGGLE_DARK_MODE
    }
}

export const resizeToSmallText = () => {
    return {
        type: SMALL_TEXT_SIZE
    }
}

export const resizeToMediumText = () => {
    return {
        type: MEDIUM_TEXT_SIZE
    }
}

export const resizeToLargeText = () => {
    return {
        type: LARGE_TEXT_SIZE
    }
}

