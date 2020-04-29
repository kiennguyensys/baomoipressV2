import {
    SIGN_IN,
    SIGN_OUT,
    START_PROCESSING_USER_DATA
} from '../actions/sessionActions.js'

const initState = {user: {}, token: {}, isProcessingUserData: false}

export const sessionReducer = (state = initState, action) => {

    if(action.type === START_PROCESSING_USER_DATA) {
        return {
            ...state,
            isProcessingUserData: true
        }
    }

    if(action.type === SIGN_IN){
        return {
            ...state,
            user: action.payload.data,
            token: action.payload.token,
            isProcessingUserData: false
        }
    }

    if(action.type === SIGN_OUT) return initState

    return state
}