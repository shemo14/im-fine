import React, { Component } from 'react';
import {Image, View, Text, TouchableOpacity, ImageBackground, AsyncStorage ,I18nManager  , Share} from 'react-native';
import {Container, Content} from 'native-base';
import { DrawerItems } from 'react-navigation-drawer';
import {connect} from "react-redux";
import i18n from '../../locale/i18n'
import lightStyles from '../../assets/styles/light'
import darkStyles from '../../assets/styles/dark'
import COLORS from '../consts/colors'
import themeImages from '../consts/Images'

class CustomDrawer extends Component {
    constructor(props){
        super(props);
        this.state={
            user: [],
            lang: 'en',
            site_social: []
        }
    }


    onShare = async () => {
        try {
            const result = await Share.share({
                message:
                    'React Native | A framework for building native apps using React',
            })

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };


    render(){
        let styles  = lightStyles;
        let images  = themeImages.lightImages;
        let colors  = COLORS;

        if (this.props.theme == 'dark') {
            styles = darkStyles;
            images = themeImages.darkImages;
            colors = colors.darkColors
        }else {
            styles = lightStyles;
            images = themeImages.lightImages;
            colors = colors.lightColors
        }


        return(
            <Container style={{ overflow: 'visible', backgroundColor: colors.darkBackground }}>
                <Content contentContainerStyle={{ flexGrow: 1 }}>
                    <View>
                        <View style={{ alignItems: 'center', marginTop: 60 , justifyContent:'center' }}>
                            <ImageBackground source={images.bg_for_pic} style={{ width: 120, height: 120, alignItems: 'center', justifyContent: 'center' , alignSelf:'center' , left:5 }}>
                                <TouchableOpacity style={{ height: 85, width: 85, borderRadius: 50, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', right: 5, top: -3 }}>
                                    <Image source={{ uri: this.props.user.image }} style={{ width: 100, height: 100, }} resizeMode={'cover'} />
                                </TouchableOpacity>
                            </ImageBackground>
                        </View>
                        <Text style={{ color: colors.menuColor, fontFamily: I18nManager.isRTL ? 'tajawalBold' : 'openSansBold', textAlign: 'center', fontSize: 15}}>{ this.props.user.name }</Text>
                        <Text style={{ color: colors.menuColor, fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', textAlign: 'center', fontSize: 15}}>{ this.props.user.mobile }</Text>
                        <View style={{marginTop:10}}>
                            <DrawerItems
                                {...this.props}

                                onItemPress={
                                    (route, focused) => {
                                        if (route.route.key === 'logout') {
                                            // this.logout()
                                        }else {
                                            route.route.key === 'shareApp' ? this.onShare(): this.props.navigation.navigate(route.route.key)
                                        }
                                    }
                                }

                                activeBackgroundColor='transparent' inactiveBackgroundColor='transparent' activeLabelStyle={{color:colors.menuColor}}
                                labelStyle={{color: colors.menuColor ,
                                    fontSize:14 ,
                                    marginLeft: 0 ,
                                    marginRight: 0 ,
                                    marginBottom:10 ,
                                    marginTop:10  ,
                                    fontWeight: 'normal',
                                    fontFamily: I18nManager.isRTL ? 'tajawalBold' : 'openSansBold',}} iconContainerStyle ={{marginHorizontal:20}}
                                itemStyle  = {{ marginTop:0 , paddingTop:0,}}  />
                        </View>
                    </View>
                </Content>
            </Container>
        );
    }
}

const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    drawerHeader: {
        height: 125,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ccdeca',
        marginTop: 60,
    },
    drawerImage: {
        height: 200,
        width: 550,
        position: 'relative',
        left: -10,
    },
    profileImage: {
        height: 80,
        width: 80,
        borderRadius: 75,
        borderWidth: 3,
        borderColor: '#639d57'
    },
    profileContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    usernameText:{
        color: '#9f9f9f',
        fontWeight: 'bold',
        fontSize: 20,
        height: 25,
        textAlign: 'center'
    },
    authContainer:{
        flexDirection:'row',
        marginTop: 10,
        alignItems: 'center'
    },
    logout:{
        color: '#fff',
    },
    logoutImage: {
        width: 20,
        height: 20,
        marginRight: 5
    },
    logoutContainer:{
        flex: 1,
        flexDirection:'row',
        flexWrap: 'wrap',
        alignSelf: 'flex-end'
    },
};

const mapStateToProps = ({ lang, profile }) => {
    return {
        lang: lang.lang,
        user: profile.user
    };
};


export default connect(mapStateToProps, {  })(CustomDrawer);