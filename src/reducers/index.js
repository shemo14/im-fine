import { combineReducers } from 'redux';
import lang from './LangReducer';
import auth from './AuthReducer';
import profile from './ProfileReducer';
import theme from './ThemeReducer';

export default combineReducers({
    lang,
    auth,
    profile,
    theme,
});