import React, { Component } from "react";
import {
	View,
	Image,
	TouchableOpacity,
	I18nManager,
	Dimensions,
	AsyncStorage,
	ImageBackground,
	Text
} from "react-native";
import {
	Container,
	Content,
	Form,
	Item,
	Input,
	Label,
	Button,
	Toast,
	CheckBox,
	Picker,
	Right,
	Body,
	Left, Header
} from 'native-base'
import lightStyles from '../../assets/styles/light'
import darkStyles from '../../assets/styles/dark'
import COLORS from '../consts/colors'
import i18n from '../../locale/i18n'
import { connect } from 'react-redux';
import {DoubleBounce} from "react-native-loader";
import {NavigationEvents} from "react-navigation";
import themeImages from '../consts/Images'
import axios from 'axios';
import CONST from '../consts'
import {Notifications} from "expo";
import * as Permissions from "expo-permissions";

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;


class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            phone: '',
            countryCode: null,
            loader: true,
            countries: [],
            deviceId: '',
            userId: null,
            isSubmitted: false
        }
    }

    async componentWillMount(){
        axios.get(CONST.url + 'codes').then(response => {
            this.setState({ countries: response.data.data, loader: false })
        })

        const { status: existingStatus } = await Permissions.getAsync(
            Permissions.NOTIFICATIONS
        );

        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            return;
        }

        const deviceId = await Notifications.getExpoPushTokenAsync();
        this.setState({ deviceId, userId: null });

        // AsyncStorage.setItem('deviceID', deviceId);
    }

    validate = () => {
        let isError = false;
        let msg = '';

        if (this.state.phone.length <= 0 || this.state.phone.length !== 10) {
            isError = true;
            msg = i18n.t('phoneValidation');
        } else if(this.state.countryCode == null){
            isError = true;
            msg = i18n.t('countryValidation');
        }
        if (msg != ''){
            Toast.show({
                text: msg,
                type: "danger",
                style : {textAlign : 'center' ,  fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans'} ,
                duration: 3000
            });
        }
        return isError;
    };

    renderSubmit(colors){
        if (this.state.isSubmitted){
            return(
                <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
                    <DoubleBounce size={20} color={colors.orange} />
                </View>
            )
        }

        return (
            <View style={{ marginTop: 150, flex: 1, alignSelf: 'center', alignItems: 'center', }}>
                <TouchableOpacity onPress={() => this.onLoginPressed()} style={{ backgroundColor: colors.orange, width: 60, height: 60, transform: [{ rotate: '45deg'}], alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                    <Image source={require('../../assets/images/dark_mode/tick.png')} style={{ height: 40, width: 40, transform: [{ rotate: '-45deg'}] }} resizeMode={'contain'} />
                </TouchableOpacity>
            </View>
        );
    }

    onLoginPressed() {
        const err = this.validate();
        if (!err){
            this.setState({ isSubmitted: true });
            axios.post(CONST.url + 'sign-in', { phone: this.state.phone, country_code: this.state.countryCode, lang: this.props.lang, device_id: this.state.deviceId }).then(response => {
                if(response.data.status == 200){
                    this.setState({ isSubmitted: false });
                    this.props.navigation.navigate('activeCode', { data: response.data.data, code: response.data.extra.code });
                }else{
                    this.setState({ isSubmitted: false });
                    Toast.show({
                        text: response.data.msg,
                        type: "danger",
                        duration: 3000
                    });
                }
            })
        }
    }

    onFocus(){

    }

    renderLoader(colors){
        if (this.state.loader){
            return(
                <View style={{ alignItems: 'center', justifyContent: 'center', height: height , alignSelf:'center' , backgroundColor: colors.darkBackground , width:'100%' , position:'absolute' , zIndex:1  }}>
                    <DoubleBounce size={20} color={COLORS.lightColors.orange} />
                </View>
            );
        }
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
				<Header style={[styles.header , styles.plateformMarginTop, { height: 30 }]} noShadow>
					<View style={[styles.headerView  , styles.animatedHeader ,{ backgroundColor: colors.darkBackground }]}>
						<Right style={styles.flex0}>
							<TouchableOpacity onPress={() => this.props.navigation.openDrawer()} style={{ flexDirection: 'row', marginTop: 20 }}>
								<Text style={{ fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', fontSize: 15 , color: colors.labelFont }} />
							</TouchableOpacity>
						</Right>
						<Body style={[styles.headerText , styles.headerTitle]} />
						<Left style={styles.flex0}>
							<TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ marginTop: 20 }}>
								<Image source={images.back} style={{ width: 25, height: 25, margin: 5, marginTop: 15, transform: I18nManager.isRTL ? [{rotateY : '0deg'}] : [{rotateY : '-180deg'}] }} resizeMode={'contain'} />
							</TouchableOpacity>
						</Left>
					</View>
				</Header>
                <Content contentContainerStyle={{ flexGrow: 1 }}>
					<ImageBackground source={images.bg_splash} resizeMode={'cover'} style={styles.imageBackgroundStyle}>
                        { this.renderLoader(colors) }
                        <View style={styles.contentBackground}>
                            <View style={{ alignItems: 'center', marginTop: 40 }}>
                                <Image resizeMode={'contain'} source={images.big_logo} style={{ width: 120, height: 120, alignSelf: 'center' }} />
                            </View>
                            <Form style={{ width: '100%', paddingHorizontal: 40, marginTop: 40 }}>
                                <View>
                                    <Item style={[styles.itemPicker, { borderColor: colors.labelFont }]} regular >
                                        <Picker
                                            mode="dropdown"
                                            style={[styles.picker, { color: colors.labelFont, width: (width*70)/100 } ]}
											textStyle={{ color: colors.labelFont }}
                                            selectedValue={this.state.countryCode}
                                            onValueChange={(value) => this.setState({ countryCode: value })}
                                        >
                                            <Picker.Item label={ i18n.t('selectCity') } value={null} />
                                            {
                                                this.state.countries.map((country, i) => (
                                                    <Picker.Item key={i} label={country.title} value={country.code} />
                                                ))
                                            }
                                        </Picker>
                                        <Image source={images.right_wight_arrow_drop} style={styles.pickerImg} resizeMode={'contain'} />
                                    </Item>
                                </View>
                                <View style={{ borderRadius: 3, borderWidth: 1, borderColor: colors.labelFont, height: 45, marginTop: 20, padding: 5, flexDirection: 'row'  }}>
                                    <Item style={{ alignSelf: 'flex-start', borderBottomWidth: 0, top: -18, marginTop: 0 ,position:'absolute', width:'88%', paddingHorizontal: 5 }} bordered>
                                        <Label style={{ top:5,  paddingRight: 10, paddingLeft: 10, backgroundColor: colors.darkBackground, alignSelf: 'flex-start', color: colors.labelFont, fontSize: 14, position: 'absolute' }}>{ i18n.t('phoneNumber') }</Label>
                                        <Input placeholderTextColor={'#e5d7bb'} placeholder={ i18n.t('phoneNumber') + '...'} onChangeText={(phone) => this.setState({phone})} keyboardType={'number-pad'} style={{ width: '100%', color: colors.labelFont, textAlign: I18nManager.isRTL ? 'right' : 'left', fontSize: 15, top: 15 }}  />
                                    </Item>
                                    <Image source={images.phone} style={{ height: 22, width: 22, right: 15, top: 9, position: 'absolute', flex: 1 }} resizeMode={'contain'} />
                                </View>
                            </Form>

                            { this.renderSubmit(colors) }
                        </View>
                    </ImageBackground>
                </Content>
            </Container>
        );
    }
}

const mapStateToProps = ({ theme, lang }) => {
    return {
        theme: theme.theme,
        lang: lang.lang,
    };
};

export default connect(mapStateToProps, {  })(Login);
