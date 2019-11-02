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
    Picker, Form, CheckBox, Toast
} from 'native-base'
import lightStyles from '../../assets/styles/light'
import darkStyles from '../../assets/styles/dark'
import COLORS from '../consts/colors'
import i18n from '../../locale/i18n'
import {NavigationEvents} from "react-navigation";
import themeImages from '../consts/Images'
import Modal from "react-native-modal";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import axios from 'axios'
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;


class EditProfile extends Component {
    constructor(props){
        super(props);
        this.state = {
            phoneStatus: 0,
            passwordStatus: 0,
            phone: '',
            password: '',
            token: '',
            base64: null,
            userId: null,
            isLoaded: false,
            mapRegion: [],
            location: '',
            checked: false,
            isModalVisible: false
        }
    }

    validate = () => {
        let isError = false;
        let msg = '';

        if (this.state.phone.length <= 0 || this.state.phone.length !== 10) {
            isError = true;
            msg = i18n.t('phoneValidation');
        }else if (this.state.password.length <= 0) {
            isError = true;
            msg = i18n.t('passwordRequired');
        }
        if (msg != ''){
            Toast.show({
                text: msg,
                type: "danger",
                duration: 3000
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
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            alert('صلاحيات تحديد موقعك الحالي ملغاه');
        }else {
            const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({});
            const userLocation = { latitude, longitude };
            this.setState({  mapRegion: userLocation });
        }

        let getCity = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';
        getCity += this.state.mapRegion.latitude + ',' + this.state.mapRegion.longitude;
        getCity += '&key=AIzaSyCJTSwkdcdRpIXp2yG7DfSRKFWxKhQdYhQ&language=ar&sensor=true';

        try {
            const { data } = await axios.get(getCity);
            console.log('data' + data)
            this.setState({ location: data.results[0].formatted_address });
        } catch (e) {
            console.log(e);
        }
    }


    onFocus(){

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
                <NavigationEvents onWillFocus={() => this.onFocus()} />
                <Header style={[styles.header , styles.plateformMarginTop]} noShadow>
                    <View style={[styles.headerView  , styles.animatedHeader ,{ backgroundColor: colors.darkBackground }]}>
                        <Right style={styles.flex0}>
                            <TouchableOpacity onPress={() => this.props.navigation.openDrawer()} style={{ flexDirection: 'row', marginTop: 20 }}>
                                <Text style={{ fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', fontSize: 15 , color: colors.labelFont }}>{ i18n.t('editProfile') }</Text>
                            </TouchableOpacity>
                        </Right>
                        <Body style={[styles.headerText , styles.headerTitle]}></Body>
                        <Left style={styles.flex0}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('profile')} style={{ marginTop: 20 }}>
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
                                <View style={{ alignItems: 'center', marginTop: -50 }}>
                                    <ImageBackground source={images.bg_for_pic} style={{ width: 100, height: 100, alignItems: 'center', justifyContent: 'center' }}>
                                        <TouchableOpacity onPress={this._pickImage} style={{ alignSelf: 'center' }}>
                                            {image == null ?
                                                (<Image source={images.upload_photo} style={{ width: 30, height: 30, alignSelf: 'center', right: 5, bottom: 8 }} />) :
                                                (<Image source={{ uri: image }} style={{ width: 100, height: 100, alignSelf: 'center', right: 5, bottom: 8, borderRadius: 50 }} />)
                                            }
                                        </TouchableOpacity>
                                    </ImageBackground>
                                </View>
                                <Form style={{ width: '100%', paddingHorizontal: 40, marginTop: 20 }}>
                                    <View style={{ borderRadius: 3, borderWidth: 1, borderColor: colors.labelFont, height: 45,marginTop: 10, padding: 5, flexDirection: 'row'  }}>
                                        <Item style={{ alignSelf: 'flex-start', borderBottomWidth: 0, top: -18, marginTop: 0 ,position:'absolute', width:'88%', paddingHorizontal: 5 }} bordered>
                                            <Label style={{ top:5, paddingRight: 10, paddingLeft: 10, backgroundColor: colors.lightBackground, alignSelf: 'flex-start', color: colors.labelFont, fontSize: 14, position: 'absolute' }}>{ i18n.t('username') }</Label>
                                            <Input placeholderTextColor={'#e5d7bb'} placeholder={ i18n.t('username') + '...'} onChangeText={(name) => this.setState({name})} style={{ width: '100%', color: colors.labelFont, textAlign: I18nManager.isRTL ? 'right' : 'left', fontSize: 15, top: 15 }} />
                                        </Item>
                                        <Image source={images.user} style={{ height: 22, width: 22, right: 15, top: 9, position: 'absolute', flex: 1 }} resizeMode={'contain'} />
                                    </View>

                                    <View style={{ borderRadius: 3, borderWidth: 1, borderColor: colors.labelFont, height: 45, marginTop: 20, padding: 5, flexDirection: 'row'  }}>
                                        <Item style={{ alignSelf: 'flex-start', borderBottomWidth: 0, top: -18, marginTop: 0 ,position:'absolute', width:'88%', paddingHorizontal: 5 }} bordered>
                                            <Label style={{ top:5,  paddingRight: 10, paddingLeft: 10, backgroundColor: colors.lightBackground, alignSelf: 'flex-start', color: colors.labelFont, fontSize: 14, position: 'absolute' }}>{ i18n.t('phoneNumber') }</Label>
                                            <Input placeholderTextColor={'#e5d7bb'} placeholder={ i18n.t('phoneNumber') + '...'} onChangeText={(phone) => this.setState({phone})} keyboardType={'number-pad'} style={{ width: '100%', color: colors.labelFont, textAlign: I18nManager.isRTL ? 'right' : 'left', fontSize: 15, top: 15 }}  />
                                        </Item>
                                        <Image source={images.iphone} style={{ height: 22, width: 22, right: 15, top: 9, position: 'absolute', flex: 1 }} resizeMode={'contain'} />
                                    </View>

                                    <View style={{ borderRadius: 3, borderWidth: 1, borderColor: colors.labelFont, height: 45, marginTop: 20, padding: 5, flexDirection: 'row'  }}>
                                        <Item style={{ alignSelf: 'flex-start', borderBottomWidth: 0, top: -18, marginTop: 0 ,position:'absolute', width:'88%', paddingHorizontal: 5 }} bordered>
                                            <Label style={{ top:5,  paddingRight: 10, paddingLeft: 10, backgroundColor: colors.lightBackground, alignSelf: 'flex-start', color: colors.labelFont, fontSize: 14, position: 'absolute' }}>{ i18n.t('email') }</Label>
                                            <Input placeholderTextColor={'#e5d7bb'} placeholder={ i18n.t('email') + '...'} onChangeText={(phone) => this.setState({phone})} keyboardType={'number-pad'} style={{ width: '100%', color: colors.labelFont, textAlign: I18nManager.isRTL ? 'right' : 'left', fontSize: 15, top: 15 }}  />
                                        </Item>
                                        <Image source={images.mail} style={{ height: 22, width: 22, right: 15, top: 9, position: 'absolute', flex: 1 }} resizeMode={'contain'} />
                                    </View>

                                    <View style={{ borderRadius: 3, borderWidth: 1, borderColor: colors.labelFont, height: 45, marginTop: 20, padding: 5, flexDirection: 'row'  }}>
                                        <Item style={{ alignSelf: 'flex-start', borderBottomWidth: 0, top: -18, marginTop: 0 ,position:'absolute', width:'88%', paddingHorizontal: 5 }} bordered>
                                            <Label style={{ top:5,  paddingRight: 10, paddingLeft: 10, backgroundColor: colors.lightBackground, alignSelf: 'flex-start', color: colors.labelFont, fontSize: 14, position: 'absolute' }}>{ i18n.t('location') }</Label>
                                            <Input value={this.state.location} disabled placeholderTextColor={'#e5d7bb'} placeholder={ i18n.t('location') + '...'} onChangeText={(phone) => this.setState({phone})} keyboardType={'number-pad'} style={{ width: '100%', color: colors.labelFont, textAlign: I18nManager.isRTL ? 'right' : 'left', fontSize: 15, top: 15 }}  />
                                        </Item>
                                        <Image source={images.location} style={{ height: 22, width: 22, right: 15, top: 9, position: 'absolute', flex: 1 }} resizeMode={'contain'} />
                                    </View>
                                </Form>

                                <View style={{ bottom: 25, flex: 1, alignSelf: 'center', alignItems: 'center', position: 'absolute' }}>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('profile')} style={{ backgroundColor: colors.orange, width: 60, height: 60, transform: [{ rotate: '45deg'}], alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                                        <Image source={require('../../assets/images/dark_mode/tick.png')} style={{ height: 40, width: 40, transform: [{ rotate: '-45deg'}] }} resizeMode={'contain'} />
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </View>
                    </View>
                </Content>
                <Modal onBackdropPress={()=> this.setState({ isModalVisible : false })} isVisible={this.state.isModalVisible}>
                    <View style={{ height, width: '115%', backgroundColor: colors.darkBackground, right: 20 }}>
                        <TouchableOpacity onPress={() => this.setState({ isModalVisible: !this.state.isModalVisible })} style={{ height: 45, width: 45, right: 35, position: 'absolute', flex: 1, }}>
                            <Image source={images.cross} style={{ width: 25, height: 25, margin: 20,}} resizeMode={'contain'}/>
                        </TouchableOpacity>

                        <View style={{ marginTop: 80, height: height-80, backgroundColor: colors.lightBackground, borderTopColor: '#ddd', borderTopWidth: 1}}>
                            <View style={{width: 0, height: 0, backgroundColor: 'transparent', borderStyle: 'solid', borderLeftWidth: 80, borderTopWidth: 80, borderLeftColor: 'transparent', borderTopColor: colors.darkBackground, right: 0, position: 'absolute', top: -1 }} />
                            <View style={{ width: 1, height: 90, backgroundColor: '#ddd', transform: [{ rotate: '45deg'}], right: 47, position: 'absolute', top: -13 }} />
                            <Image source={images.small_logo} style={{ width: 120, height: 120, alignSelf: 'center', marginTop: -55 }} resizeMode={'contain'}/>
                            <View style={{ padding: 25 }}>
                                <Text style={{ color: colors.labelFont, fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', fontSize: 16, lineHeight: 22 }}>
                                    هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى، حيث يمكنك أن تولد مثل هذا النص أو العديد من النصوص الأخرى إضافة إلى زيادة عدد الحروف التى يولدها التطبيق.
                                    إذا كنت تحتاج إلى عدد أكبر من الفقرات يتيح لك مولد النص العربى زيادة عدد الفقرات كما تريد، النص لن يبدو مقسما ولا يحوي أخطاء لغوية، مولد النص العربى مفيد لمصممي المواقع على وجه الخصوص، حيث يحتاج العميل فى كثير من الأحيان أن يطلع على صورة حقيقية لتصميم الموقع.
                                    ومن هنا وجب على المصمم أن يضع نصوصا مؤقتة على التصميم ليظهر للعميل الشكل كاملاً،دور مولد النص العربى أن يوفر على المصمم عناء البحث عن نص بديل لا علاقة له بالموضوع الذى يتحدث عنه التصميم فيظهر بشكل لا يليق.
                                </Text>
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

export default EditProfile;
