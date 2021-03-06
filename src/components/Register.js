import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity, ImageBackground, I18nManager, Dimensions, ScrollView, AsyncStorage} from "react-native";
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
// import { connect } from 'react-redux';
// import { userLogin, profile } from '../actions'
import {DoubleBounce} from "react-native-loader";
import {NavigationEvents} from "react-navigation";
import {connect} from "react-redux";
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import themeImages from '../consts/Images'
import axios from 'axios'
import Modal from "react-native-modal";
import CONST from "../consts";

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;


class Register extends Component {
    constructor(props){
        super(props);
        this.state = {
            phoneStatus: 0,
            passwordStatus: 0,
            name: '',
            phone: '',
            email: '',
            password: '',
            token: '',
            base64: null,
            lat: null,
            lng: null,
            countryCode: null,
            deviceId: null,
            userId: null,
            isLoaded: false,
            mapRegion: [],
            countries: [],
            terms: '',
            location: '',
            checked: false,
            isModalVisible: false,
            isSubmitted: false
        }
    }

    validate = () => {
        let isError = false;
        let msg = '';

        if (this.state.name === '') {
            isError = true;
            msg = i18n.t('nameValidation');
        }else if (this.state.phone.length <= 0 || this.state.phone.length !== 10) {
            isError = true;
            msg = i18n.t('phoneRequired');
        }else if (this.state.checked ===  false) {
            isError = true;
            msg = i18n.t('checkedRequired');
        }else if (this.state.location.length <= 0) {
            isError = true;
            msg = i18n.t('locationRequired');
        }else if(this.state.countryCode == null){
            isError = true;
            msg = i18n.t('countryValidation');
        }

        if (msg != ''){
            Toast.show({
                text: msg,
                type: "danger",
                duration: 3000,
				textStyle   	: {
					color       	: "white",
					fontFamily  	: I18nManager.isRTL ? 'tajawal' : 'openSans',
					textAlign   	: 'center'
				}
            });
        }
        return isError;
    };

    askPermissionsAsync = async () => {
        await Permissions.askAsync(Permissions.CAMERA);
        await Permissions.askAsync(Permissions.CAMERA_ROLL);
    };

    _pickImage = async () => {
        this.askPermissionsAsync();

        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
            base64:true
        });

        if (!result.cancelled) {
            this.setState({ userImage: result.uri ,base64:result.base64});
        }
    };

    async componentWillMount() {

		axios.get(CONST.url + 'codes').then(response => {
			this.setState({ countries: response.data.data, loader: false })
		});

		axios.post(CONST.url + 'terms', { lang: this.props.lang }).then(response => {
			this.setState({ terms: response.data.data.terms, })
		});

        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            return;
        }else {
            const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({});
            const userLocation = { latitude, longitude };
            this.setState({
                lat : latitude ,
                lng : longitude
            });
            this.setState({  mapRegion: userLocation });
        }

        let getCity = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';
        getCity += this.state.mapRegion.latitude + ',' + this.state.mapRegion.longitude;
        getCity += '&key=AIzaSyCJTSwkdcdRpIXp2yG7DfSRKFWxKhQdYhQ&language=ar&sensor=true';

        try {
            const { data } = await axios.get(getCity);
            this.setState({ location: data.results[0].formatted_address });
        } catch (e) {
            console.log(e);
        }
    }


    onLoginPressed() {
        const err = this.validate();
        if (!err){
            this.setState({ isSubmitted: true });

			AsyncStorage.getItem('fcmToken').then(device_id => {
				console.log('device_id____', device_id);
				axios.post(CONST.url + 'sign-up', {
					phone: this.state.phone,
					name: this.state.name,
					country_code: this.state.countryCode,
					email :this.state.email,
					image : this.state.base64,
					lang: this.props.lang ,
					device_id,
					lat : this.state.lat,
					lng : this.state.lng,
					address : this.state.location,
				}).then(response => {
					if(response.data.status == 200){
						this.setState({ isSubmitted: false });
						this.props.navigation.navigate('activeCode', { data: response.data.data, code: response.data.extra.code, device_id, register: true });
					}else{
						this.setState({ isSubmitted: false });
						Toast.show({
							text: response.data.msg,
							type: "danger",
							duration: 3000,
							textStyle   	: {
								color       	: "white",
								fontFamily  	: I18nManager.isRTL ? 'tajawal' : 'openSans',
								textAlign   	: 'center'
							}
						});
					}
				}).catch(error => {
					console.log('error_', error.message)
				});
            });
        }
    }


    render_submit(colors){
        if (this.state.isSubmitted){
            return(
                <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
                    <DoubleBounce size={20} color={colors.orange} />
                </View>
            )
        }

        return (
            <View style={{ bottom: 25, flex: 1, alignSelf: 'center', alignItems: 'center', position: 'absolute' }}>
                <TouchableOpacity onPress={()=>{this.onLoginPressed()}} style={{ backgroundColor: colors.orange, width: 60, height: 60, transform: [{ rotate: '45deg'}], alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                    <Image source={require('../../assets/images/dark_mode/tick.png')} style={{ height: 40, width: 40, transform: [{ rotate: '-45deg'}] }} resizeMode={'contain'} />
                </TouchableOpacity>
            </View>
        );

    }

    render() {
        let styles  = lightStyles;
        let images  = themeImages.lightImages;
        let image   = this.state.userImage;
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
                {/*<NavigationEvents onWillFocus={() => this.onFocus()} />*/}
				<Header style={[styles.header , styles.plateformMarginTop, { height: 30 }]} noShadow>
					<View style={[styles.headerView  , styles.animatedHeader ,{ backgroundColor: colors.darkBackground }]}>
						<Right style={styles.flex0}>
							<TouchableOpacity onPress={() => this.props.navigation.openDrawer()} style={{ flexDirection: 'row', marginTop: 20 }}>
								<Text style={{ fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', color: colors.labelFont }} />
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
                    <View style={styles.contentBackground}>
                        <View style={{ alignItems: 'center', marginTop: 10 }}>
                            <ImageBackground source={images.bg_for_pic} style={{ width: 100, height: 100, alignItems: 'center', justifyContent: 'center' }}>
                                <TouchableOpacity onPress={this._pickImage} style={{ alignSelf: 'center' }}>
                                    {image == null ?
                                        (<Image source={images.upload_photo} style={{ width: 30, height: 30, alignSelf: 'center', right: 5, bottom: 8 }} />) :
                                        (<Image source={{ uri: image }} style={{ width: 100, height: 100, alignSelf: 'center', right: 5, bottom: 8, borderRadius: 50 }} />)
                                    }
                                </TouchableOpacity>
                            </ImageBackground>
                        </View>
                        <Form style={{ width: '100%', paddingHorizontal: 40, marginTop: 10 }}>
                            <View style={{ borderRadius: 3, borderWidth: 1, borderColor: colors.labelFont, height: 45,marginTop: 10, padding: 5, flexDirection: 'row'  }}>
                                <Item style={{ alignSelf: 'flex-start', borderBottomWidth: 0, top: -18, marginTop: 0 ,position:'absolute', width:'88%', paddingHorizontal: 5 }} bordered>
                                    <Label style={{ top:5, paddingRight: 10, fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', paddingLeft: 10, backgroundColor: colors.darkBackground, alignSelf: 'flex-start', color: colors.labelFont, position: 'absolute' }}>{ i18n.t('username') }</Label>
                                    <Input value={this.state.name} placeholderTextColor={'#e5d7bb'} placeholder={ i18n.t('username') + '...'} onChangeText={(name) => this.setState({name})} style={{ width: '100%', color: colors.labelFont, fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', textAlign: I18nManager.isRTL ? 'right' : 'left', top: 15 }} />
                                 </Item>
                                <Image source={images.user} style={{ height: 22, width: 22, right: 15, top: 9, position: 'absolute', flex: 1 }} resizeMode={'contain'} />
                            </View>
                            <View>
                                <Item style={[styles.itemPicker, { borderColor: colors.labelFont }]} regular >
                                    <Picker
										textStyle={{ color: colors.labelFont, fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', }}
                                        mode="dropdown"
                                        style={[styles.picker, { color: colors.labelFont } ]}
                                        placeholderStyle={{ color: "#e5d7bb" }}
                                        placeholderIconColor="#fff"
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
                                    <Label style={{ top:5, fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', paddingRight: 10, paddingLeft: 10, backgroundColor: colors.darkBackground, alignSelf: 'flex-start', color: colors.labelFont, position: 'absolute' }}>{ i18n.t('phoneNumber') }</Label>
                                    <Input value={this.state.phone}  placeholderTextColor={'#e5d7bb'} placeholder={ i18n.t('phoneNumber') + '...'} onChangeText={(phone) => this.setState({phone})} keyboardType={'number-pad'} style={{ width: '100%', color: colors.labelFont, fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', textAlign: I18nManager.isRTL ? 'right' : 'left', top: 15 }}  />
                                 </Item>
                                <Image source={images.phone} style={{ height: 22, width: 22, right: 15, top: 9, position: 'absolute', flex: 1 }} resizeMode={'contain'} />
                            </View>

                            <View style={{ borderRadius: 3, borderWidth: 1, borderColor: colors.labelFont, height: 45, marginTop: 20, padding: 5, flexDirection: 'row'  }}>
                                <Item style={{ alignSelf: 'flex-start', borderBottomWidth: 0, top: -18, marginTop: 0 ,position:'absolute', width:'88%', paddingHorizontal: 5 }} bordered>
                                    <Label style={{ top:5, fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', paddingRight: 10, paddingLeft: 10, backgroundColor: colors.darkBackground, alignSelf: 'flex-start', color: colors.labelFont, position: 'absolute' }}>{ i18n.t('email') }</Label>
                                    <Input  value={this.state.email} placeholderTextColor={'#e5d7bb'} placeholder={ i18n.t('email') + '...'} onChangeText={(email) => this.setState({email})} style={{ width: '100%', color: colors.labelFont, fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', textAlign: I18nManager.isRTL ? 'right' : 'left', top: 15 }}  />
                                 </Item>
                                <Image source={images.email} style={{ height: 22, width: 22, right: 15, top: 9, position: 'absolute', flex: 1 }} resizeMode={'contain'} />
                            </View>

                            <View style={{ borderRadius: 3, borderWidth: 1, borderColor: colors.labelFont, height: 45, marginTop: 20, padding: 5, flexDirection: 'row'  }}>
                                <Item style={{ alignSelf: 'flex-start', borderBottomWidth: 0, top: -18, marginTop: 0 ,position:'absolute', width:'88%', paddingHorizontal: 5 }} bordered>
                                    <Label style={{ top:5, fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', paddingRight: 10, paddingLeft: 10, backgroundColor: colors.darkBackground, alignSelf: 'flex-start', color: colors.labelFont, position: 'absolute' }}>{ i18n.t('location') }</Label>
                                    <Input value={(this.state.location).substring(1, 30) + '...'} disabled placeholderTextColor={'#e5d7bb'} placeholder={ i18n.t('location') + '...'} onChangeText={(phone) => this.setState({phone})} keyboardType={'number-pad'} style={{ width: '100%', fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', color: colors.labelFont, textAlign: I18nManager.isRTL ? 'right' : 'left', top: 15 }}  />
                                 </Item>
                                <Image source={images.location} style={{ height: 22, width: 22, right: 15, top: 9, position: 'absolute', flex: 1 }} resizeMode={'contain'} />
                            </View>
                        </Form>

                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <TouchableOpacity onPress={() => this.setState({ checked: !this.state.checked })} style={[ styles.inputMarginTop ,styles.directionRow]}>
                                <CheckBox onPress={() => this.setState({ checked: !this.state.checked })} checked={this.state.checked} color={colors.orange} style={styles.checkBox} />
                                <Text style={[styles.agreeText, { color: colors.labelFont, fontSize: 16 }]}>{ i18n.t('agreeTo') } <Text onPress={() => this.setState({ isModalVisible: !this.state.isModalVisible })} style={[styles.termsText, { color: colors.orange, fontSize: 16 }]}>{ i18n.t('terms') }</Text></Text>
                            </TouchableOpacity>
                        </View>

                        { this.render_submit(colors) }
                    </View>
                </Content>
                <Modal onBackdropPress={()=> this.setState({ isModalVisible : false })} isVisible={this.state.isModalVisible}>
                    <View style={{ height, width: '115%', backgroundColor: colors.darkBackground, right: 20 }}>
                        <TouchableOpacity onPress={() => this.setState({ isModalVisible: !this.state.isModalVisible })} style={{ height: 45, width: 45, right: 35, position: 'absolute', flex: 1, }}>
                            <Image source={images.cross} style={{ width: 25, height: 25, margin: 20,}} resizeMode={'contain'}/>
                        </TouchableOpacity>

                        <View style={{ marginTop: 80, height: height-80, backgroundColor: colors.lightBackground, borderTopColor: '#ddd', borderTopWidth: 1}}>
                            <View style={{width: 0, height: 0, backgroundColor: 'transparent', borderStyle: 'solid', borderLeftWidth: 80, borderTopWidth: 80, borderLeftColor: 'transparent', borderTopColor: colors.darkBackground, right: 0, position: 'absolute', top: -1 }} />
                            <View style={{ width: 1, height: 90, backgroundColor: '#ddd', transform: I18nManager.isRTL ? [{ rotate: '45deg'}] : [{ rotate: '-45deg'}], right: 47, position: 'absolute', top: -13 }} />
                            <Image source={images.small_logo} style={{ width: 120, height: 120, alignSelf: 'center', marginTop: -55 }} resizeMode={'contain'}/>
                            <View style={{ padding: 25 }}>
								<ScrollView>
                                    <Text style={{ color: colors.labelFont, fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', fontSize: 16, lineHeight: 22, textAlign: 'center' }}> { this.state.terms } </Text>
                                </ScrollView>
                            </View>
                        </View>
                        <View style={{ bottom: 30, flex: 1, alignSelf: 'center', alignItems: 'center', position: 'absolute' }}>
                            <TouchableOpacity onPress={() => this.setState({ isModalVisible: !this.state.isModalVisible })} style={{ backgroundColor: colors.orange, width: 60, height: 60, transform: [{ rotate: '45deg'}], alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                                <Image source={require('../../assets/images/dark_mode/tick.png')} style={{ height: 40, width: 40, transform: [{ rotate: '-45deg'}] }} resizeMode={'contain'} />
                            </TouchableOpacity>
                        </View>
                    </View>

                </Modal>
            </Container>
        );
    }
}

const mapStateToProps = ({ theme, lang }) => {
    return {
        theme: theme.theme,
		lang: lang.lang
    };
};

export default connect(mapStateToProps, {  })(Register);
