import React, { Component } from "react";
import { Image} from "react-native";
import i18n from '../../locale/i18n'
import styles from "../../assets/styles";


class ShareApp extends Component {
    constructor(props){
        super(props);

        this.state={

        }
    }

    static navigationOptions = () => ({
        drawerLabel:  i18n.t('shareApp')  ,
        drawerIcon: (<Image source={require('../../assets/images/light_mode/share.png')} style={{width:20 , height:20}} resizeMode={'contain'} /> )
    })


    render() {
        return false
    }
}

export default ShareApp;