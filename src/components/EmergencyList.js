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

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

class EmergencyList extends Component {
    constructor(props){
        super(props);
        this.state = {
            selectedId:0
        }
    }

    checkRadio(selectedId){
        this.setState({ selectedId });
    }

    async componentWillMount(){
        await Permissions.askAsync(Permissions.CONTACTS);

        const { data } = await Contacts.getContactsAsync({
            fields: [Contacts.Fields.PhoneNumbers],
        });

        if (data.length > 0) {
            const contact = data;
            console.log(contact);
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
                        <View style={{ marginTop: 10, backgroundColor: colors.lightBackground, borderTopColor: '#ddd', borderTopWidth: 1}}>
                            <View style={{width: 0, height: 0, backgroundColor: 'transparent', borderStyle: 'solid', borderLeftWidth: 50, borderTopWidth: 50, borderLeftColor: 'transparent', borderTopColor: colors.darkBackground, right: 0, position: 'absolute', top: -1 }} />
                            <View style={{ flex: 1, height: 10, width: '100%' }}/>
                            <View style={{ width: 1, height: 70, backgroundColor: '#ddd', transform: [{ rotate: '45deg'}], left: -26, top: -21, alignSelf: 'flex-end' }} />
                            <View style={{ marginTop: -40, height: height-125 , paddingHorizontal:20 }}>

                                <TouchableOpacity onPress={ () => this.checkRadio(1)} style={{ flexDirection: 'row', justifyContent:'space-between' , alignItems:'center' ,  borderBottomColor: '#f0e2c0', borderBottomWidth: 1 , paddingVertical:15}}>
                                    <View style={{ flexDirection: 'row', justifyContent:'center' , alignItems:'center'}}>
                                        <View style={{ height: 60, width: 60, borderRadius: 50, borderWidth: 2, overflow: 'hidden', borderColor: '#9f8f75', justifyContent: 'center', alignItems: 'center' }}>
                                            <Image source={images.person_two} resizeMode={'contain'} style={{ width: 80, height: 80 }} />
                                        </View>
                                        <Text style={{ color: colors.labelFont, fontFamily: I18nManager.isRTL ? 'tajawalBold' : 'openSansBold', fontSize: 15 , marginLeft:10 }}>اوامر الشركة</Text>
                                    </View>
                                    <Radio onPress={ () => this.checkRadio(1)} selected={this.state.selectedId == 1 ? true : false}  color={colors.labelFont} selectedColor={colors.orange} style={{borderColor:colors.orange ,
                                        paddingRight:Platform.OS === 'ios' ?3:2,
                                        left:0,}} />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={ () => this.checkRadio(2)} style={{ flexDirection: 'row', justifyContent:'space-between' , alignItems:'center' ,  borderBottomColor: '#f0e2c0', borderBottomWidth: 1 , paddingVertical:15}}>
                                    <View style={{ flexDirection: 'row', justifyContent:'center' , alignItems:'center'}}>
                                        <View style={{ height: 60, width: 60, borderRadius: 50, borderWidth: 2, overflow: 'hidden', borderColor: '#9f8f75', justifyContent: 'center', alignItems: 'center' }}>
                                            <Image source={images.person_two} resizeMode={'contain'} style={{ width: 80, height: 80 }} />
                                        </View>
                                        <Text style={{ color: colors.labelFont, fontFamily: I18nManager.isRTL ? 'tajawalBold' : 'openSansBold', fontSize: 15 , marginLeft:10 }}>اوامر الشركة</Text>
                                    </View>
                                    <Radio onPress={ () => this.checkRadio(2)} selected={this.state.selectedId == 2 ? true : false}  color={colors.labelFont} selectedColor={colors.orange} style={{borderColor:colors.orange ,
                                        paddingRight:Platform.OS === 'ios' ?3:2,
                                        left:0,}} />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={ () => this.checkRadio(3)} style={{ flexDirection: 'row', justifyContent:'space-between' , alignItems:'center' ,  borderBottomColor: '#f0e2c0', borderBottomWidth: 1 , paddingVertical:15}}>
                                    <View style={{ flexDirection: 'row', justifyContent:'center' , alignItems:'center'}}>
                                        <View style={{ height: 60, width: 60, borderRadius: 50, borderWidth: 2, overflow: 'hidden', borderColor: '#9f8f75', justifyContent: 'center', alignItems: 'center' }}>
                                            <Image source={images.person_two} resizeMode={'contain'} style={{ width: 80, height: 80 }} />
                                        </View>
                                        <Text style={{ color: colors.labelFont, fontFamily: I18nManager.isRTL ? 'tajawalBold' : 'openSansBold', fontSize: 15 , marginLeft:10 }}>اوامر الشركة</Text>
                                    </View>
                                    <Radio onPress={ () => this.checkRadio(3)} selected={this.state.selectedId == 3 ? true : false}  color={colors.labelFont} selectedColor={colors.orange} style={{borderColor:colors.orange ,
                                        paddingRight:Platform.OS === 'ios' ?3:2,
                                        left:0,}} />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={ () => this.checkRadio(4)} style={{ flexDirection: 'row', justifyContent:'space-between' , alignItems:'center' ,  borderBottomColor: '#f0e2c0', borderBottomWidth: 1 , paddingVertical:15}}>
                                    <View style={{ flexDirection: 'row', justifyContent:'center' , alignItems:'center'}}>
                                        <View style={{ height: 60, width: 60, borderRadius: 50, borderWidth: 2, overflow: 'hidden', borderColor: '#9f8f75', justifyContent: 'center', alignItems: 'center' }}>
                                            <Image source={images.person_two} resizeMode={'contain'} style={{ width: 80, height: 80 }} />
                                        </View>
                                        <Text style={{ color: colors.labelFont, fontFamily: I18nManager.isRTL ? 'tajawalBold' : 'openSansBold', fontSize: 15 , marginLeft:10 }}>اوامر الشركة</Text>
                                    </View>
                                    <Radio onPress={ () => this.checkRadio(4)} selected={this.state.selectedId == 4 ? true : false}  color={colors.labelFont} selectedColor={colors.orange} style={{borderColor:colors.orange ,
                                        paddingRight:Platform.OS === 'ios' ?3:2,
                                        left:0,}} />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={ () => this.checkRadio(5)} style={{ flexDirection: 'row', justifyContent:'space-between' , alignItems:'center' ,  borderBottomColor: '#f0e2c0', borderBottomWidth: 1 , paddingVertical:15}}>
                                    <View style={{ flexDirection: 'row', justifyContent:'center' , alignItems:'center'}}>
                                        <View style={{ height: 60, width: 60, borderRadius: 50, borderWidth: 2, overflow: 'hidden', borderColor: '#9f8f75', justifyContent: 'center', alignItems: 'center' }}>
                                            <Image source={images.person_two} resizeMode={'contain'} style={{ width: 80, height: 80 }} />
                                        </View>
                                        <Text style={{ color: colors.labelFont, fontFamily: I18nManager.isRTL ? 'tajawalBold' : 'openSansBold', fontSize: 15 , marginLeft:10 }}>اوامر الشركة</Text>
                                    </View>
                                    <Radio onPress={ () => this.checkRadio(5)} selected={this.state.selectedId == 5 ? true : false}  color={colors.labelFont} selectedColor={colors.orange} style={{borderColor:colors.orange ,
                                        paddingRight:Platform.OS === 'ios' ?3:2,
                                        left:0,}} />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={ () => this.checkRadio(6)} style={{ flexDirection: 'row', justifyContent:'space-between' , alignItems:'center' ,  borderBottomColor: '#f0e2c0', borderBottomWidth: 1 , paddingVertical:15}}>
                                    <View style={{ flexDirection: 'row', justifyContent:'center' , alignItems:'center'}}>
                                        <View style={{ height: 60, width: 60, borderRadius: 50, borderWidth: 2, overflow: 'hidden', borderColor: '#9f8f75', justifyContent: 'center', alignItems: 'center' }}>
                                            <Image source={images.person_two} resizeMode={'contain'} style={{ width: 80, height: 80 }} />
                                        </View>
                                        <Text style={{ color: colors.labelFont, fontFamily: I18nManager.isRTL ? 'tajawalBold' : 'openSansBold', fontSize: 15 , marginLeft:10 }}>اوامر الشركة</Text>
                                    </View>
                                    <Radio onPress={ () => this.checkRadio(6)} selected={this.state.selectedId == 6 ? true : false}  color={colors.labelFont} selectedColor={colors.orange} style={{borderColor:colors.orange ,
                                        paddingRight:Platform.OS === 'ios' ?3:2,
                                        left:0,}} />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={ () => this.checkRadio(7)} style={{ flexDirection: 'row', justifyContent:'space-between' , alignItems:'center' ,  borderBottomColor: '#f0e2c0', borderBottomWidth: 1 , paddingVertical:15}}>
                                    <View style={{ flexDirection: 'row', justifyContent:'center' , alignItems:'center'}}>
                                        <View style={{ height: 60, width: 60, borderRadius: 50, borderWidth: 2, overflow: 'hidden', borderColor: '#9f8f75', justifyContent: 'center', alignItems: 'center' }}>
                                            <Image source={images.person_two} resizeMode={'contain'} style={{ width: 80, height: 80 }} />
                                        </View>
                                        <Text style={{ color: colors.labelFont, fontFamily: I18nManager.isRTL ? 'tajawalBold' : 'openSansBold', fontSize: 15 , marginLeft:10 }}>اوامر الشركة</Text>
                                    </View>
                                    <Radio onPress={ () => this.checkRadio(7)} selected={this.state.selectedId == 7 ? true : false}  color={colors.labelFont} selectedColor={colors.orange} style={{borderColor:colors.orange ,
                                        paddingRight:Platform.OS === 'ios' ?3:2,
                                        left:0,}} />
                                </TouchableOpacity>


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

export default EmergencyList;
