import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';
import { UIReducer } from './reducers/UIReducer.js';
import { sessionReducer } from './reducers/sessionReducer.js';
import { timerReducer } from './reducers/timerReducer.js';


export const store = createStore(
    combineReducers({UI: UIReducer, session: sessionReducer, timer: timerReducer}),
    composeWithDevTools(applyMiddleware(thunkMiddleware))
)