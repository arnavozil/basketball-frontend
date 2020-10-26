import { combineReducers } from 'redux';
import allPlayerReducer from './allPlayerReducer';
import createMatchReducer from './createMatchReducer';
import {
    playerUpdateReducer,
    matchUpdateReducer
} from './playerUpdateReducer';

const rootReducer = combineReducers({
    allPlayers: allPlayerReducer,
    createMatch: createMatchReducer,
    updateUser: playerUpdateReducer,
    updateMatch: matchUpdateReducer
});

export default rootReducer;