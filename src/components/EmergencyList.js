import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity, Platform, I18nManager, Dimensions, FlatList, Slider} from "react-native";
import { Container, Content, Header, Left, Right, Body, Icon, Item, Label, Input, Switch, Picker, Radio } from 'native-base'
import lightStyles from '../../assets/styles/light'
import darkStyles from '../../assets/styles/dark'
import COLORS from '../consts/colors'
import i18n from '../../locale/i18n'
import {NavigationEvents} from "react-navigation";
import themeImages from '../consts/Images'
import * as Contacts from 'expo-contacts';
import * as Permissions from 'expo-permissions';
import {DoubleBounce} from "react-native-loader";
import {connect} from "react-redux";
import CONST from '../consts';
import axios from 'axios'


const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

class EmergencyList extends Component {
    constructor(props){
        super(props);
        this.state = {
            selectedId:0,
            contacts: [],
            loader: false
        }
    }

    checkRadio(selectedId){
        this.setState({ selectedId });
    }

    renderLoader(colors){
        if (this.state.loader){
            return(
                <View style={{ alignItems: 'center', justifyContent: 'center', height: (height-100) , alignSelf:'center' , backgroundColor: colors.darkBackground , width:'100%' , position:'absolute' , zIndex:1  }}>
                    <DoubleBounce size={20} color={COLORS.lightColors.orange} />
                </View>
            );
        }
    }

    async componentWillMount(){
        this.setState({ loader: true });
        await Permissions.askAsync(Permissions.CONTACTS);

        const { data } = await Contacts.getContactsAsync({
            fields: [Contacts.Fields.PhoneNumbers],
        });
        let phoneNumbers = [];

        if (data.length > 0) {
            const contacts = data;

            for (let i=0; i < (contacts).length; i++){
                let number = '';
                if ((contacts[i].phoneNumbers).length > 0)
                    number = ((contacts[i].phoneNumbers)[0]).number;

                number = number.replace(/ +/g, "");
                number = number.replace(/^\+[0-9]{1,3}/,'');
                number = number.length < 10 ? '0' + number : number;

                if (number >= 10)
                    phoneNumbers[i] = number
            }

            axios.post(CONST.url + 'contacts', { id: this.props.user.id, phones: phoneNumbers, lang: this.props.lang }).then(response => {
                this.setState({ contacts: response.data.data, loader: false })
            })
        }
    }

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

        console.log(this.state.contacts);

        return (
            <Container style={{ backgroundColor: colors.darkBackground }}>
                <NavigationEvents onWillFocus={() => this.onFocus()} />
                <Header style={[styles.header , styles.plateformMarginTop]} noShadow>
                    <View style={[styles.headerView  , styles.animatedHeader ,{ backgroundColor: colors.darkBackground }]}>
                        <Right style={styles.flex0}>
                            <TouchableOpacity onPress={() => this.props.navigation.openDrawer()} style={{ flexDirection: 'row', marginTop: 20 }}>
                                <Text style={{ fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', fontSize: 15 , color: colors.labelFont }}>{ i18n.t('emergencyList') }</Text>
                            </TouchableOpacity>
                        </Right>
                        <Body style={[styles.headerText , styles.headerTitle]}></Body>
                        <Left style={styles.flex0}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('settings')} style={{ marginTop: 20 }}>
                                <Image source={images.back} style={{ width: 25, height: 25, margin: 5, marginTop: 15 }} resizeMode={'contain'} />
                            </TouchableOpacity>
                        </Left>
                    </View>
                </Header>
                <Content style={{ backgroundColor: colors.darkBackground, marginTop: -25 }} contentContainerStyle={{ flexGrow: 1 }}>
                    <View>
                        <View style={{ marginTop: 10, backgroundColor: colors.lightBackground, borderTopColor: colors.pageBorder, borderTopWidth: 1}}>
                            <View style={{width: 0, height: 0, backgroundColor: 'transparent', borderStyle: 'solid', borderLeftWidth: 50, borderTopWidth: 50, borderLeftColor: 'transparent', borderTopColor: colors.darkBackground, right: 0, position: 'absolute', top: -1 }} />
                            <View style={{ flex: 1, height: 10, width: '100%' }}/>
                            <View style={{ width: 1, height: 70, backgroundColor: colors.pageBorder, transform: [{ rotate: '45deg'}], left: -26, top: -21, alignSelf: 'flex-end' }} />
                            <View style={{ marginTop: -40, height: height-125 , paddingHorizontal:20 }}>
                                { this.renderLoader(colors) }

                                {
                                    this.state.contacts.map((contact, i)=>(
                                        <TouchableOpacity key={i} onPress={ () => this.checkRadio(1)} style={{ flexDirection: 'row', justifyContent:'space-between' , alignItems:'center' ,  borderBottomColor: '#ad9bc1', borderBottomWidth: 1 , paddingVertical:15}}>
                                            <View style={{ flexDirection: 'row', justifyContent:'center' , alignItems:'center'}}>
                                                <View style={{ height: 60, width: 60, borderRadius: 50, borderWidth: 2, overflow: 'hidden', borderColor: '#9f8f75', justifyContent: 'center', alignItems: 'center' }}>
                                                    <Image source={{ uri: contact.image }} resizeMode={'contain'} style={{ width: 80, height: 80 }} />
                                                </View>
                                                <Text style={{ color: colors.labelFont, fontFamily: I18nManager.isRTL ? 'tajawalBold' : 'openSansBold', fontSize: 15 , marginLeft:10 }}>{ contact.name }</Text>
                                            </View>
                                            <Radio onPress={ () => this.checkRadio(1)} selected={contact.is_emergency}  color={colors.labelFont} selectedColor={colors.orange} style={{borderColor:colors.orange ,
                                                paddingRight:Platform.OS === 'ios' ?3:2,
                                                left:0,}} />
                                        </TouchableOpacity>
                                    ))
                                }

                            </View>
                        </View>
                    </View>
                </Content>

                {
                    this.state.selectedId == 0 ?
                    (
                        <View style={{ bottom: 30, flex: 1, alignSelf: 'center', alignItems: 'center', position: 'absolute' }}>
                            <TouchableOpacity  style={{ backgroundColor: colors.orange, width: 60, height: 60, transform: [{ rotate: '45deg'}], alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                                <Image source={require('../../assets/images/dark_mode/add_button.png')} style={{ height: 40, width: 40, transform: [{ rotate: '-45deg'}] }} resizeMode={'contain'} />
                            </TouchableOpacity>
                        </View>
                    ) :
                    ( <View style={{ bottom: 30, flex: 1, alignSelf: 'center', alignItems: 'center', position: 'absolute' }}>
                        <TouchableOpacity  onPress={ () => this.checkRadio(0)}  style={{ backgroundColor: colors.orange, width: 60, height: 60, transform: [{ rotate: '45deg'}], alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                            <Image source={require('../../assets/images/dark_mode/trash.png')} style={{ height: 40, width: 40, transform: [{ rotate: '-45deg'}] }} resizeMode={'contain'} />
                        </TouchableOpacity>
                    </View>
                    )
                }


            </Container>
        );
    }
}

const mapStateToProps = ({ lang, profile, theme }) => {
    return {
        lang: lang.lang,
        user: profile.user,
        theme: theme.theme
    };
};

export default connect(mapStateToProps, {})(EmergencyList);
