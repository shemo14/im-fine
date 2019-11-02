import axios from 'axios';
import CONST from '../consts'
import {Toast} from "native-base";
import {AsyncStorage} from "react-native";


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
                duration: 3000
            });
        }).catch(() => {
            Toast.show({
                text: 'لم يتم التعديل بعد , الرجاء المحاوله مره اخري',
                type: "danger",
                duration: 3000
            });
        })
    }
}


export const logout = (data) => {
    return (dispatch) => {
        // axios({
        //     url: CONST.url + 'logout',
        //     method: 'POST',
        //     headers: {Authorization: data.token },
        //     }).then(response => {
        //         AsyncStorage.clear();
        //         dispatch({type: 'logout'})
        //     }
        // )

        AsyncStorage.clear();
    }
}

