import axios from 'axios';
import CONST from '../consts'
import {Toast} from "native-base";
import {AsyncStorage, I18nManager} from "react-native";


export const profile = (id, lang) => {
    return (dispatch) => {
        axios({
            method: 'POST',
            url: CONST.url + 'profile',
            data: {id, lang}
        }).then(response => {
            const data = response.data.data;
            dispatch({type: 'profile_data', data})
        })
    }
}


export const updateProfile = (data) => {
    return (dispatch) => {
        axios({
            url: CONST.url + 'update_profile',
            method: 'POST',
            headers: {Authorization: data.token },
            data: {
            name: data.name,
            phone: data.phone,
            country_id: data.country_id,
            image: data.image,
            email: data.email,
            desc: data.desc,
            type: data.type,
            lang: data.lang,
        }}).then(response => {
            if (response.data.status == 200) {
                const data = response.data.data;
                dispatch({type: 'update_profile', data})
            }
            Toast.show({
                text: response.data.msg,
                type: response.data.status == 200 ? "success" : "danger",
                duration: 3000,
				textStyle   	: {
					color       	: "white",
					fontFamily  	: I18nManager.isRTL ? 'tajawal' : 'openSans',
					textAlign   	: 'center'
				}
            });
        }).catch(() => {
            Toast.show({
                text: 'لم يتم التعديل بعد , الرجاء المحاوله مره اخري',
                type: "danger",
                duration: 3000,
				textStyle   	: {
					color       	: "white",
					fontFamily  	: I18nManager.isRTL ? 'tajawal' : 'openSans',
					textAlign   	: 'center'
				}
            });
        })
    }
}


export const logout = (user_id) => {
    return (dispatch) => {
        axios({
            url: CONST.url + 'logout',
            method: 'POST',
            data: { user_id }
            }).then(response => {
			    AsyncStorage.multiRemove(['token', 'auth', 'profile'])
                dispatch({type: 'logout'})
            }
        ).catch(e => {
			AsyncStorage.multiRemove(['token', 'auth', 'profile'])
			dispatch({type: 'logout'})
        })
    }
}

