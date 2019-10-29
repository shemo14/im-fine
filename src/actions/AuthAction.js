import axios from 'axios';
import { AsyncStorage } from 'react-native';
import CONST from '../consts';

export const userLogin = ({phone, password, token}, lang) => {
    return (dispatch) => {
        dispatch({type: 'user_login'});

        axios.post( CONST.url + 'login', {phone, password, device_id: token, lang})
            .then(response => handelLogin(dispatch, response.data))
            .catch(error => console.warn(error.data));
    };
};


export const tempAuth = () => {
    return (dispatch) => {
        dispatch({type: 'temp_auth'});
    };
};


const handelLogin = (dispatch, data) => {
    if (data.status != 200){
        loginFailed(dispatch, data)
    }else{
        loginSuccess(dispatch, data)
    }
};


const loginSuccess = (dispatch, data) => {
    AsyncStorage.setItem('token', JSON.stringify(data.data.token))
        .then(() => dispatch({type: 'login_success', data }));

    dispatch({type: 'login_success', data});
};

const loginFailed = (dispatch, error) => {
    dispatch({type: 'login_failed', error});
}
