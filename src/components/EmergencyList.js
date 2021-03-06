import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity, Platform, I18nManager, Dimensions, FlatList, Slider} from "react-native";
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
    Picker,
    Radio,
    Toast
} from 'native-base'
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
import Contact from './Contact'


const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

let selectedContacts = [];

class EmergencyList extends Component {
    constructor(props){
        super(props);
        this.state = {
            selectedId:0,
            contacts: [],
            loader: false,
			selectedContacts
        }
    }

	static navigationOptions = () => ({
		drawerLabel:  i18n.t('emergencyList')  ,
		drawerIcon: (<Image source={require('../../assets/images/light_mode/emergency_side.png')} style={{width:22 , height:22}} resizeMode={'contain'} /> )
	});

	pushSelectedChecks(id){
		selectedContacts.push(id);
        this.setState({ selectedContacts })
    }

	pullSelectedChecks(id){
		for( let i = 0; i < selectedContacts.length; i++){
			if ( selectedContacts[i] === id) {
				selectedContacts.splice(i, 1);
			}
		}

		this.setState({ selectedContacts  })
    }

    addToEmergencyList(){
		const userId = this.props.auth.data.id;
		axios.post(CONST.url + 'add-to-emergency', { id: userId, users: selectedContacts, lang: this.props.lang }).then(response => {
		   if(response.data.status === 200)
           {
               Toast.show({
                   text: response.data.msg,
                   type: "success",
                   duration: 3000,
				   textStyle   	: {
					   color       	: "white",
					   fontFamily  	: I18nManager.isRTL ? 'tajawal' : 'openSans',
					   textAlign   	: 'center'
				   }
               });
           }
		})
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

            if(contacts.length > 0)
            {
                for (let i=0; i < (contacts).length; i++){

                    let number = '';
                    if (contacts[i].phoneNumbers)
                        if( contacts[i].phoneNumbers  !== undefined)
                        {
                            number = contacts[i].phoneNumbers[0].number;

                            number = number.replace(/ +/g, "");
                            number = number.replace(/^\+[0-9]{1,3}/,'');
                            number = number.replace(/^0+/, '');

                            if (number >= 10)
                                phoneNumbers[i] = number
                        }

                }

				const userId = this.props.auth.data.id;
                axios.post(CONST.url + 'contacts', { id: userId, phones: phoneNumbers, lang: this.props.lang }).then(response => {
                    this.setState({ contacts: response.data.data, loader: false })
                    if ((response.data.data).length > 0){
                        (response.data.data).map((contact) => {
                            if(contact.is_emergency){
                                this.pushSelectedChecks(contact.id);
                            }
                        })
                    }else{
                        this.setState({ loader: false });
                        Toast.show({
                            text: 'No Contacts',
                            type: "danger",
                            duration: 3000,
							textStyle   	: {
								color       	: "white",
								fontFamily  	: I18nManager.isRTL ? 'tajawal' : 'openSans',
								textAlign   	: 'center'
							}
                        });
                    }
                }).error(error => {
                    console.log(error.message)
                });

            }else{
                Toast.show({
                    text: 'No Contacts',
                    type: "danger",
                    duration: 3000,
					textStyle   	: {
						color       	: "white",
						fontFamily  	: I18nManager.isRTL ? 'tajawal' : 'openSans',
						textAlign   	: 'center'
					}
                });
            }

        }else{
            this.setState({ loader: false });
            Toast.show({
                text: 'No Contacts',
                type: "danger",
                duration: 3000,
				textStyle   	: {
					color       	: "white",
					fontFamily  	: I18nManager.isRTL ? 'tajawal' : 'openSans',
					textAlign   	: 'center'
				}
            });
        }
    }

    onFocus(){
        this.componentWillMount()
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

        console.log(this.state.selectedContacts)


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
                            <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ marginTop: 20 }}>
                                <Image source={images.back} style={{ width: 25, height: 25, margin: 5, marginTop: 15, transform: I18nManager.isRTL ? [{rotateY : '0deg'}] : [{rotateY : '-180deg'}] }} resizeMode={'contain'} />
                            </TouchableOpacity>
                        </Left>
                    </View>
                </Header>
                <Content style={{ backgroundColor: colors.darkBackground, marginTop: -25 }} contentContainerStyle={{ flexGrow: 1 }}>
                    <View>
                        <View style={{ marginTop: 10, backgroundColor: colors.lightBackground, borderTopColor: colors.pageBorder, borderTopWidth: 1}}>
                            <View style={{width: 0, height: 0, backgroundColor: 'transparent', borderStyle: 'solid', borderLeftWidth: 50, borderTopWidth: 50, borderLeftColor: 'transparent', borderTopColor: colors.darkBackground, right: 0, position: 'absolute', top: -1 }} />
                            <View style={{ flex: 1, height: 10, width: '100%' }}/>
                            <View style={{ width: 1, height: 70, backgroundColor: colors.pageBorder, transform: I18nManager.isRTL ? [{ rotate: '45deg'}] : [{ rotate: '-45deg'}], left: -26, top: -21, alignSelf: 'flex-end' }} />
                            <View style={{ marginTop: -40, height: height-125 }}>
                                { this.renderLoader(colors) }
                                <View style={{ marginHorizontal: 20 }}>
									{
										this.state.contacts.map((contact, i) => {
										    return (
												<Contact  pullSelectedChecks={(id) => this.pullSelectedChecks(id)} pushSelectedChecks={(id) => this.pushSelectedChecks(id)} key={i} data={contact}  />
											)
                                        })
									}
                                </View>
                            </View>
                        </View>
                    </View>
                </Content>

				<View style={{ bottom: 30, flex: 1, alignSelf: 'center', alignItems: 'center', position: 'absolute' }}>
					<TouchableOpacity  onPress={() => this.addToEmergencyList()} style={{ backgroundColor: colors.orange, width: 60, height: 60, transform: [{ rotate: '45deg'}], alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
						<Image source={require('../../assets/images/dark_mode/add_button.png')} style={{ height: 40, width: 40, transform: [{ rotate: '-45deg'}] }} resizeMode={'contain'} />
					</TouchableOpacity>
				</View>

                {/*{*/}
                    {/*(this.state.selectedContacts).length > 0 ?*/}
                    {/*(*/}
                        {/**/}
                    {/*) :*/}
                    {/*( <View style={{ bottom: 30, flex: 1, alignSelf: 'center', alignItems: 'center', position: 'absolute' }}>*/}
                        {/*<TouchableOpacity  onPress={ () => this.checkRadio(0)}  style={{ backgroundColor: '#ddd', width: 60, height: 60, transform: [{ rotate: '45deg'}], alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>*/}
                            {/*<Image source={require('../../assets/images/dark_mode/trash.png')} style={{ height: 40, width: 40, transform: [{ rotate: '-45deg'}] }} resizeMode={'contain'} />*/}
                        {/*</TouchableOpacity>*/}
                    {/*</View>*/}
                    {/*)*/}
                {/*}*/}


            </Container>
        );
    }
}

const mapStateToProps = ({ lang, profile, theme, auth }) => {
    return {
        lang: lang.lang,
        user: profile.user,
        theme: theme.theme,
		auth: auth.user,
    };
};

export default connect(mapStateToProps, {})(EmergencyList);
