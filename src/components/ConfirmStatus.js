import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity, Animated, I18nManager, Dimensions, FlatList, Slider} from "react-native";
import {Container, Content, Header, Left, Right, Body, Button, Icon, Item, Label, Input} from 'native-base'
import lightStyles from '../../assets/styles/light'
import darkStyles from '../../assets/styles/dark'
import COLORS from '../consts/colors'
import i18n from '../../locale/i18n'
import {NavigationEvents} from "react-navigation";
import themeImages from '../consts/Images'
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;


class ConfirmStatus extends Component {
    constructor(props){
        super(props);
        this.state = {
            type: 1,
            isTimePickerVisible: false,
            startTime: '',
            endTime: '',
            tfTime: '',
            timeType: 'start',
            fadeAnim: new Animated.Value(-55),
            availabel: 0,
            search: '',
            refreshed: false,
            mapRegion: [],
            location: '',
            startRecord: false,
            finishRecord: false,
            resetRecord: false,
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

        const statusImg = this.props.navigation.state.params.image;

        return (
            <Container style={{ backgroundColor: colors.darkBackground }}>
                <NavigationEvents onWillFocus={() => this.onFocus()} />
                <Header style={[styles.header , styles.plateformMarginTop]} noShadow>
                    <View style={[styles.headerView  , styles.animatedHeader ,{ backgroundColor: colors.darkBackground }]}>
                        <Right style={styles.flex0}>
                            <TouchableOpacity onPress={() => this.props.navigation.openDrawer()} style={{ flexDirection: 'row', marginTop: 20 }}>
                                <Image source={images.drawer} style={{ width: 25, height: 25, marginTop: 35, marginHorizontal: 8 }} resizeMode={'contain'} />
                                <Image source={images.logo_tittle} style={{ width: 90, height: 90 }} resizeMode={'contain'} />
                            </TouchableOpacity>
                        </Right>
                        <Body style={[styles.headerText , styles.headerTitle]}></Body>
                        <Left style={styles.flex0}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('notFine')} style={{ marginTop: 20 }}>
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
                            <View style={{ marginTop: -40, height: height-125 }}>
                                <View style={{ marginTop: 100, alignItems: 'center', flex: 1, alignSelf: 'center' }}>
                                    <View style={{ height: 120, width: 120, borderRadius: 80, borderWidth: 2, overflow: 'hidden', borderColor: colors.border, justifyContent: 'center', alignItems: 'center' }}>
                                        <Image source={statusImg} resizeMode={'contain'} style={{ width: 80, height: 80 }} />
                                    </View>
                                    <Text style={{ fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', color: colors.labelFont, marginTop: 10 }}>{ i18n.t('confirmSendStatus') }</Text>

                                    <Button onPress={() => this.props.navigation.navigate('DrawerNavigator')} style={{ backgroundColor: colors.orange, width: 150, height: 35, marginTop: 40, alignItems: 'center', justifyContent: 'center' }} >
                                        <Text style={{ fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', color: colors.labelFont, textAlign: 'center'}}>{ i18n.t('backHome') }</Text>
                                    </Button>
                                </View>
                            </View>
                        </View>
                    </View>
                </Content>
            </Container>
        );
    }
}

export default ConfirmStatus;
