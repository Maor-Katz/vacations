import {combineReducers} from 'redux'
import {date} from './date';
import {saveUser} from './user';
import {newVac} from './newVacation';


export const allReducers = combineReducers({
    date,
    saveUser,
    newVac

});