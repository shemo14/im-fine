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
    Textarea,
    Picker, Form
} from 'native-base'
import lightStyles from '../../assets/styles/light'
import darkStyles from '../../assets/styles/dark'
import COLORS from '../consts/colors'
import i18n from '../../locale/i18n'
import {NavigationEvents} from "react-navigation";
import themeImages from '../consts/Images'
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;


class Complaint extends Component {
    constructor(props){
        super(props);
        this.state = {
            compAdd:''
        }
    }


    static navigationOptions = () => ({
        drawerLabel:  i18n.t('sendComplaint')  ,
        drawerIcon: (<Image source={require('../../assets/images/light_mode/warning.png')} style={{width:20 , height:20}} resizeMode={'contain'} /> )
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
                                <Text style={{ fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', fontSize: 15 , color: colors.labelFont }}>{ i18n.t('complaint') }</Text>
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
                                <Text style={{ fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans', fontSize: 15 , color: colors.labelFont , alignSelf:'center'}}>{ i18n.t('writeCompTo') }</Text>
                                <Form style={{ width: '100%',  marginTop: 20 }}>

                                    <View style={{  borderWidth: 0, height: 45,marginTop: 10, padding: 5, flexDirection: 'row'  , backgroundColor:colors.activeBG }}>
                                        <Item style={{ alignSelf: 'flex-start', borderBottomWidth: 0, top: -18, marginTop: 0 ,position:'absolute', width:'88%', paddingHorizontal: 5 }} bordered>
                                            <Input placeholderTextColor={colors.darkBackground} placeholder={ i18n.t('compAdd') + '...'} onChangeText={(compAdd) => this.setState({compAdd})} style={{ width: '100%', color: colors.labelFont, textAlign: I18nManager.isRTL ? 'right' : 'left', fontSize: 15, top: 15 }} />
                                        </Item>
                                    </View>
                                    <View style={{  borderWidth: 0,  height: 170,marginTop: 10, padding: 5, flexDirection: 'row'  , backgroundColor:colors.activeBG }}>
                                        <Item style={{ alignSelf: 'flex-start', borderBottomWidth: 0, top: -18, marginTop: 0 ,position:'absolute', width:'88%', paddingHorizontal: 5 }} bordered>
                                            <Textarea placeholderTextColor={colors.darkBackground} placeholder={ i18n.t('writeComp') + '...'} style={{ width: '100%', color: colors.labelFont, textAlign: I18nManager.isRTL ? 'right' : 'left', fontSize: 15, top: 15 , height:'100%' , paddingVertical:10}}/>
                                        </Item>
                                    </View>
                                </Form>

                                <View style={{ bottom: 25, flex: 1, alignSelf: 'center', alignItems: 'center', position: 'absolute' }}>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('home')} style={{ backgroundColor: colors.orange, width: 60, height: 60, transform: [{ rotate: '45deg'}], alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                                        <Image source={require('../../assets/images/dark_mode/tick.png')} style={{ height: 40, width: 40, transform: [{ rotate: '-45deg'}] }} resizeMode={'contain'} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </Content>
            </Container>
        );
    }
}

export default Complaint;
