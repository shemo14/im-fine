import React, { Component } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Platform,
    I18nManager,
    Dimensions,
    FlatList,
    Slider,
    ImageBackground
} from "react-native";
import {
    Container,
    Content,
    Header,
    Left,
    Right,
    Body,
    Icon,
    Item,
    Label,
    Input,
    Switch,
    Picker
} from 'native-base'
import lightStyles from '../../assets/styles/light'
import darkStyles from '../../assets/styles/dark'
import COLORS from '../consts/colors'
import i18n from '../../locale/i18n'
import {NavigationEvents} from "react-navigation";
import themeImages from '../consts/Images'
import {connect} from "react-redux";
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;


class Profile extends Component {
    constructor(props){
        super(props);
        this.state = {
            user : null,
        }
    }


    componentWillMount()
    {
        console.log(this.props.user);
    }


    static navigationOptions = () => ({
        drawerLabel:  i18n.t('profile')  ,
        drawerIcon: (<Image source={require('../../assets/images/light_mode/User.png')} style={{width:20 , height:20}} resizeMode={'contain'} /> )
    })



    onFocus(){

    }

    render() {
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

        return (
            <Container style={{ backgroundColor: colors.darkBackground }}>
                <NavigationEvents onWillFocus={() => this.onFocus()} />
                <Header style={[styles.header , styles.plateformMarginTop]} noShadow>
                    <View style={[styles.headerView  , styles.animatedHeader ,{ backgroundColor: colors.darkBackground }]}>
                        <Right style={styles.flex0}>
                            <TouchableOpacity onPress={() => this.props.navigation.openDrawer()} style={{ flexDirection: 'row', marginTop: 20 }}>
                                <Text style={{ fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', fontSize: 15 , color: colors.labelFont }}>{ i18n.t('profile') }</Text>
                            </TouchableOpacity>
                        </Right>
                        <Body style={[styles.headerText , styles.headerTitle]}></Body>
                        <Left style={styles.flex0}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('home')} style={{ marginTop: 20 }}>
                                <Image source={images.back} style={{ width: 25, height: 25, margin: 5, marginTop: 15 }} resizeMode={'contain'} />
                            </TouchableOpacity>
                        </Left>
                    </View>
                </Header>
                <Content style={{ backgroundColor: colors.darkBackground, marginTop: -25 }} contentContainerStyle={{ flexGrow: 1 }}>
                    <View>
                        <View style={{ marginTop: 10, backgroundColor: colors.lightBackground, borderTopColor: '#ddd', borderTopWidth: 1}}>
                            <View style={{width: 0, height: 0, backgroundColor: 'transparent', borderStyle: 'solid', borderLeftWidth: 50, borderTopWidth: 50, borderLeftColor: 'transparent', borderTopColor: colors.darkBackground, right: 0, position: 'absolute', top: -1 }} />
                            <View style={{ flex: 1, height: 10, width: '100%' }}/>
                            <View style={{ width: 1, height: 70, backgroundColor: '#ddd', transform: [{ rotate: '45deg'}], left: -26, top: -21, alignSelf: 'flex-end' }} />
                            <View style={{ marginTop: -40, height: height-125 , paddingHorizontal:20 }}>
                                <View style={{ alignItems: 'center', marginTop: -50 , justifyContent:'center' }}>
                                    <ImageBackground source={images.bg_for_pic} style={{ width: 120, height: 120, alignItems: 'center', justifyContent: 'center' , alignSelf:'center' , left:5 }}>
                                        <TouchableOpacity style={{ height: 85, width: 85, borderRadius: 50, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', right: 5, top: -3 }}>
                                            <Image source={{uri: this.props.user.image}} style={{ width: 100, height: 100, }} resizeMode={'cover'} />
                                        </TouchableOpacity>
                                    </ImageBackground>
                                </View>
                                <Text style={{ color: colors.menuColor, fontFamily: I18nManager.isRTL ? 'tajawalBold' : 'openSansBold', textAlign: 'center', fontSize: 15}}>{this.props.user.name}</Text>


                                <View style={{flexDirection:'row' , alignItems:'center' , marginTop:50}}>
                                    <Image source={images.iphone} style={{ width: 25, height: 25 , marginRight:15}} resizeMode={'contain'} />
                                    <Text style={{ fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', fontSize: 15 , color: colors.labelFont }}>{this.props.user.phone}</Text>
                                </View>

                                <View style={{flexDirection:'row' , alignItems:'center' , marginVertical:10}}>
                                    <Image source={images.mail} style={{ width: 25, height: 25 , marginRight:15 }} resizeMode={'contain'} />
                                    <Text style={{ fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', fontSize: 15 , color: colors.labelFont }}>{this.props.user.email}</Text>
                                </View>

                                <View style={{flexDirection:'row' , alignItems:'center'}}>
                                    <Image source={images.loc} style={{ width: 25, height: 25 , marginRight:15}} resizeMode={'contain'} />
                                    <Text style={{ fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', fontSize: 15 , color: colors.labelFont }}>
                                        {this.props.user.address}
                                     </Text>
                                </View>


                                <View style={{backgroundColor:'#ad9bc1' , height:.5 , width:'100%' , marginVertical:20}}/>

                            </View>
                        </View>
                    </View>
                </Content>
                <View style={{ bottom: 30, flex: 1, alignSelf: 'center', alignItems: 'center', position: 'absolute' }}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('editProfile')} style={{ backgroundColor: colors.orange, width: 60, height: 60, transform: [{ rotate: '45deg'}], alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                        <Image source={require('../../assets/images/dark_mode/edit.png')} style={{ height: 30, width: 30, transform: [{ rotate: '-45deg'}] }} resizeMode={'contain'} />
                    </TouchableOpacity>
                </View>
            </Container>
        );
    }
}

const mapStateToProps = ({ theme ,lang , profile}) => {
    return {
        theme: theme.theme,
        lang   : lang.lang,
        user      : profile.user,
    };
};

export default connect(mapStateToProps, {  })(Profile);


