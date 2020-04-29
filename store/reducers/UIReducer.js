import {
    TOGGLE_LIGHT_MODE,
    TOGGLE_DARK_MODE,
    SMALL_TEXT_SIZE,
    MEDIUM_TEXT_SIZE,
    LARGE_TEXT_SIZE,
} from '../actions/UIActions.js';

const initState = {
    textSizeRatio: 1,
    backgroundColor: 'white',
    textColor: 'black',
    highLightColor: '#006666',
    blockquoteColor: '#D3D3D3',
    isDarkMode: 'false'
}

export const UIReducer = (state = initState, action) => {

    if(action.type === TOGGLE_LIGHT_MODE){
        return {
            ...state,
            backgroundColor: 'white',
            textColor: 'black',
            highLightColor: '#006666',
            blockquoteColor: '#D3D3D3',
            isDarkMode: false
        }
    }

    if(action.type === TOGGLE_DARK_MODE){
        return {
            ...state,
            backgroundColor: '#404040',
            textColor: '#D0D0D0',
            highLightColor: '#03BFB4',
            blockquoteColor: '#696969',
            isDarkMode: true
        }
    }

    if(action.type === SMALL_TEXT_SIZE){
        return {
            ...state,
            textSizeRatio: 0.8
        }
    }

    if(action.type === MEDIUM_TEXT_SIZE){
        return {
            ...state,
            textSizeRatio: 1
        }
    }

    if(action.type === LARGE_TEXT_SIZE){
        return {
            ...state,
            textSizeRatio: 1.2
        }
    }

    return state
}