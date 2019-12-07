import {Dimensions , I18nManager , Platform, AsyncStorage} from "react-native";
import colors from '../../src/consts/colors'

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

let COLORS = colors.lightColors;

const styles = ({
    bBLR0:{
        borderBottomLeftRadius:0
    },
    flex0:{
        flex:0
    },
    flex1:{
        flex:1
    },
    mT70:{
        marginTop:70
    },
    mt15:{
        marginTop:15
    },
    mt90:{
        marginTop:90
    },
    mv10:{
        marginVertical:10
    },
    mv35:{
        marginVertical:35
    },
    mv5:{
        marginVertical:5
    },
    mr20:{
        marginRight:20
    },
    mr10:{
        marginRight:10
    },
    t15:{
        top:15
    },
    mb10:{
        marginBottom:10
    },
    mb5:{
        marginBottom:5
    },
    mb20:{
        marginBottom:20
    },
    mb25:{
        marginBottom:25
    },
    mb15:{
        marginBottom:15
    },
    mh10:{
        marginHorizontal:10
    },
    mt45:{
        marginTop:45
    },
    mt10:{
        marginTop:10
    },
    ml15:{
        marginLeft:15
    },
    mt30:{
        marginTop:30
    },
    mtt50:{
        marginTop:'50%'
    },
    ph23:{
        paddingHorizontal:23
    },
    ph25:{
        paddingHorizontal:25
    },
    pl20:{
        paddingLeft:20
    },
    p20:{
        padding:20
    },
    pr2:{
        paddingRight:2
    },
    p10:{
        padding:10
    },
    ph10:{
        paddingHorizontal:10
    },
    pv20:{
        paddingVertical:20
    },
    pv10:{
        paddingVertical:10
    },
    flexGrow:{
        flexGrow: 1
    },
    contentBackground: {
        // backgroundColor: '#fff5dd',
        flex: 1,
    },
    plateformMarginTop:{
        marginTop:Platform.OS === 'ios' ? 20 : 40,
    },
    keyboardAvoid: {
        width:'100%',
        height: null,
        flex: 1
    },
    headerCheck: {
        marginRight:10 ,
        top:7
    },
    paymentImg: {
        width:'100%' ,
        height:200 ,
        marginBottom:45
    },
    mapView: {
        flex: 1 ,
        width:'100%' ,
        height:350
    },
    mapMarker: {
        width: 35,
        height: 35
    },
    dropArrow: {
        right:5,
        width:20 ,
        height:20,
        position:'absolute'
    },
    offer: {
        alignSelf: 'center',
        width:'91%',
        margin: 7,
        paddingLeft:20 ,
        borderBottomRightRadius:5
    },
    langSetting: {
        color:COLORS.mediumgray  ,
        fontSize:16 ,
        position:'absolute' ,
        backgroundColor:'#fff' ,
        zIndex:1 ,
        width:'92.5%'
    },
    sweetImg: {
        width:80 ,
        height:80,
        flex:0,
        alignSelf:'flex-end'
    },
    orderTabs: {
        flexDirection:'row' ,
        justifyContent:'space-between' ,
        alignItems:'center' ,
        marginTop:20
    },
    btnWidth: {
        marginTop:50 ,
        width:180
    },
    aSFS:{
        alignSelf:'flex-start'
    },
    transform:{
        transform: I18nManager.isRTL ? [{rotateY : '0deg'}] : [{rotateY : '-180deg'}]
    },
    directionColumn:{
        flexDirection:'column',
    },
    directionColumnCenter:{
        justifyContent:'center' ,
        alignItems:'center' ,
        flexDirection:'column'
    },
    directionRow:{
        flexDirection:'row',
    },
    directionRowCenter:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    },
    directionRowSpace:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    },
    headerTitle:{
        top:10  ,
        right:15
    },
    whiteBg:{
        marginTop:Platform.OS === 'ios' ?100 : 80,
        alignSelf:'center' ,
        height : height-80 ,
        width:'83%' ,
        backgroundColor:COLORS.white
    },
    whiteForm:{
        width: '100%' ,
        height:'100%' ,
        flex:1 ,
        flexDirection:'column' ,
        justifyContent:'space-between' ,
        paddingVertical:30,
    },
    w100:{
        width:'100%'
    },
    h100:{
        height:'100%'
    },
    productContainer:{
        alignItems:'center'  ,
        marginVertical:10
    },
    touchProduct:{
        alignSelf: 'center',
        flex: 1,
        margin: 7
    },
    orderProduct:{
        alignSelf: 'center' ,
        width:'45%',
        margin: 7
    },
    scrollSweet:{
        marginTop:10 ,
        marginBottom:20
    },
    counterStyle:{
        color: COLORS.labelBackground ,
        fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans'
    },
    checkBox:{
        borderWidth:1 ,
        borderColor:'#5a4b6c' ,
        marginRight:20,
        paddingRight:2
    },
    agreeText:{
        color:'#fff' ,
        fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans'
    },
    termsText:{
        fontFamily: I18nManager.isRTL ? 'tajawalBold' : 'openSansBold'
    },
    imageBackgroundStyle: {
        width,
        height: '100%',
        flex: 1,
        alignItems: 'center',
        backgroundColor:'#0A8EBB'
    },
    imageBackground: {
        width: null,
        height: null,
        flex: 1,
    },
    logoStyle: {
        width: 180,
        height: 150,
        marginTop: (height*20)/100
    },
    inputMarginTop:{
        marginTop:35
    },

    inputMarginBottom:{
        marginBottom:35
    },
    regMarker:{
        width:20 ,
        height:20 ,
        position:'absolute' ,
        right:10 ,
        zIndex:1 ,
        top:'40%'
    },

    modalStyle:{
        flex: 1 ,
        backgroundColor:'#fff' ,
        padding:20 ,
        position:'absolute' ,
        width:'100%',
        borderRadius:25,
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center'
    },
    // Login Screen Styles
    authBack:{
        height:45 ,
        width:45 ,
        position:'absolute' ,
        zIndex:1 ,
        top:30
    },
    loginFormContainerStyle: {
        width: '100%',
        // height: (height*60)/100,
        alignItems: 'center',
        padding: 10,
        justifyContent: 'center'
    },
    itemView : {
        borderRadius: 1,
        borderWidth: 1,
        height: 50,
        padding: 5,
        flexDirection: 'row',
        borderColor: COLORS.white
    },
    loginItem : {
        borderBottomWidth: 0,
        top: -20,
        marginTop: 0,
        position:'absolute',
        width:'88%',
        paddingHorizontal: 10,
    },
    label:{
        top:15,
        backgroundColor: COLORS.labelBackground,
        alignSelf: 'flex-start',
        fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans',
        fontSize: I18nManager.isRTL ? 15 :14,
        color: COLORS.white,
        paddingRight: 5,
        paddingLeft:5,
        paddingTop:0
    },
    input:{
        width: 200,
        color: COLORS.lightgray,
        textAlign: I18nManager.isRTL ?  'right':'left',
        fontSize: 15,
        top: 20,
        fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans',
    },
    img:{
        width: 25,
        height: 25,
        right: 15,
        top: 10,
        position: 'absolute',
        flex: 1
    },
    forgetVisitor:{
        flexDirection: 'row',
        marginTop: 17,
        width: '100%',
        justifyContent: 'flex-end',
    },
    forget:{
        color: COLORS.white,
        fontSize: 16,
        fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans',
        textAlign: 'right'
    },
    visitor:{
        color: COLORS.white,
        fontSize: 16,
        fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans',
        marginTop: 25,
        textAlign:'center'
    },
    loginBtn:{
        borderRadius: 2,
        width: 150,
        height: 35,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center' ,
        backgroundColor: COLORS.orange
    },
    createAcc:{
        borderRadius: 5,
        width: 130,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center' ,
        backgroundColor: 'transparent',
        borderColor:'#fff',
        borderWidth:1,
        marginTop: 25,
    },
    loginBtnContainer: {
        marginTop: 30
    },
    btnTxt:{
        color: '#472d35',
        fontSize:16,
        fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans',
    },
    quesBtn:{
        color:'#fff' ,
        fontSize:14,
        fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans',
    },
    registerBtn:{
        backgroundColor:'transparent' ,
        borderColor:'#0fd1fa' ,
        borderWidth:1,
        borderTopRightRadius:30 ,
        width:'40%' ,
        height:45 ,
        justifyContent:'center' ,
        alignItems:'center',
        borderLeftWidth:0,
        borderBottomWidth:0
    },
    registerTxt:{
        color:'#0fd1fa' ,
        fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans' ,
        fontSize:16
    },
    btnParent:{
        flexDirection:'row' ,
        marginTop: 20,
        height:45
    },
    inValidBorder: {
        borderColor: '#0fd1fa',
    },
    authTitle:{
        color:COLORS.white,
        fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans' ,
        textAlign:'center',
        marginTop:-20
    },
    authDesc:{
        color:COLORS.lightgray,
        fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans' ,
        textAlign:'center',
        marginBottom:45
    },
    homecontent:{
        zIndex: -99,
        marginTop: -90,
    },
    header : {
        zIndex: 9999999,
        height: 60,
        marginVertical: 5,
        backgroundColor: 'transparent',
        borderBottomWidth:0,
        paddingLeft: 0,
        paddingRight: 0
    },
    headerView : {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15
    },
    animatedHeader:{
        height: 80 ,
        marginTop:-50 ,
        alignItems:'center'
    },
    headerMenu:{
        width: 25,
        height: 25,
    },
    headerText:{
        color:COLORS.white,
        fontFamily: I18nManager.isRTL ? 'tajawalBold' : 'openSansBold' ,
        fontSize:15
    },
    inputView : {
        borderRadius: 35,
        borderWidth: 1,
        borderColor: '#ddd',
        height: 45,
        padding: 5,
        flexDirection: 'row',
        marginHorizontal: 15,
        backgroundColor: '#F6F6F6',
        marginTop:Platform.OS === 'ios' ?30 : 10,
        marginBottom:10
    },
    inputItem :{
        borderBottomWidth: 0,
        width:'100%',
        paddingHorizontal: 10
    },
    modalInput:{
        alignSelf: 'center',
        backgroundColor: 'transparent',
        color: '#acabae',
        fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans',
        paddingBottom:0,
        textAlign: I18nManager.isRTL ?'right' : 'left',
        fontSize:14,
        paddingRight:25
    },
    type:{
        color: COLORS.white,
        fontSize: 15,
        fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans',
    },
    oldPrice:{
        color:COLORS.mediumgray ,
        fontSize:14 ,
        textDecorationLine: 'line-through',
        fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans',
    },
    starStyle:{
        color: '#f0aa0b',
        marginHorizontal: 2
    },
    btnImg:{
        width:20 ,
        height:20 ,
        marginRight:5
    },
    ques:{
        color: COLORS.boldgray,
        fontSize: 14,
        fontFamily: I18nManager.isRTL ? 'tajawalBold' : 'openSansBold',
    },
    prodDet:{
        alignItems:'center'  ,
        marginVertical:10
    },
    pack:{
        justifyContent:'space-between',
        paddingHorizontal:15 ,
        paddingVertical:7
    },
    check:{
        color: COLORS.mediumgray,
        fontSize: 14,
        fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans'
    },
    scrollText:{
        backgroundColor:'#00000099' ,
        position:'absolute' ,
        zIndex:1 ,
        width:'80%' ,
        bottom:10 ,
        alignSelf:'center' ,
        justifyContent: 'center' ,
        alignItems:'center',
        padding:7 ,
        paddingVertical:2
    },
    overBg:{
        backgroundColor:'#00000077' ,
        position:'absolute' ,
        zIndex:1 ,
        width:'100%' ,
        top:0 ,
        alignSelf:'center' ,
        textAlign: 'center' ,
        height:'100%'
    },
    scrollImg:{
        width:110 ,
        height:150 ,
        borderRadius:15
    },
    scrollParent:{
        marginHorizontal:7 ,
        borderRadius:15
    },
    scrollParent2:{
        backgroundColor:'#fff',
        width:150,
        borderRadius:5,
        borderBottomRightRadius:20,
        alignItems:'center',
        padding:10,
        marginHorizontal:7
    },
    scrollImg2:{
        width:60 ,
        height:60 ,
        borderRadius:Platform.OS === 'ios' ?25 :50,
        marginBottom:10,
    },
    orangeCircle:{
        width:75 ,
        height:75 ,
        position:'absolute',
        right:0,
        top:0
    },
    count:{
        backgroundColor:'#e4f1f7' ,
        borderRadius:15 ,
        width:80 ,
        marginVertical:10
    },
    flatContainer:{
        flexDirection: 'row',
        justifyContent: 'center' ,
        marginBottom:30 ,
        marginTop:10,
        paddingHorizontal:10,
        flexWrap:'wrap'
    },
    eventdoteStyle:{
        backgroundColor:'#e6e6e6',
        borderRadius: 50,
        width: 10,
        height: 10,
        left: Platform.OS === 'ios' ? 0 : 9,
        bottom:Platform.OS === 'ios' ? '-11%' : '-33%',
    },
    eventactiveDot:{
        borderRadius: 50,
        borderWidth: 2,
        borderColor: COLORS.labelBackground,
        backgroundColor: COLORS.labelBackground,
        width: 10,
        height: 10,
        left: Platform.OS === 'ios' ? 0 : 9,
        bottom:Platform.OS === 'ios' ? '-11%' : '-33%',
    },
    eventdoteStyle2:{
        backgroundColor:'#e6e6e6',
        borderRadius: 50,
        width: 10,
        height: 10,
        left:Platform.OS === 'ios' ? 0 : 9,
        bottom:Platform.OS === 'ios' ? '70%' : '15%',
    },
    eventactiveDot2:{
        borderRadius: 50,
        borderWidth: 2,
        borderColor: COLORS.labelBackground,
        backgroundColor: COLORS.labelBackground,
        width: 10,
        height: 10,
        left: Platform.OS === 'ios' ? 0 : 9,
        bottom:Platform.OS === 'ios' ? '70%' : '15%'
    },
    eventswiper:{
        width: '101%',
        height: 300,
        top:0,
    },
    eventswiper2:{
        width: '101%',
        height: 565,
        top:0,
    },
    swiperimageEvent : {
        width: '100%',
        height: '100%',
        borderBottomRightRadius: 170,
        overflow:'hidden',
        marginBottom:15
    },
    headImg : {
        width: '100%',
        height: '100%',
        borderBottomLeftRadius: 170,
        overflow:'hidden',
        marginBottom:15
    },
    swiperimageEvent2 : {
        width: '100%',
        height: 250,
        borderBottomRightRadius: 170,
        overflow:'hidden',
        marginBottom:10
    },
    headerBtn:{
        width:45,
        height:45 ,
        justifyContent:'center' ,
        alignItems:'center',
        marginTop: 27,
    },
    rightHeaderIcon:{
        fontSize: 40,
        color:COLORS.white ,
        width:45 ,
        height:45,
        position:'absolute' ,
        right:15
    },
    leftHeaderIcon:{
        fontSize: 25,
        width:45 ,
        position:'absolute' ,
        left:-17
    },
    cartBtn:{
        borderRadius: 5,
        height: 40,
        width:200,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center' ,
        backgroundColor: COLORS.darkRed,
        flexDirection:'row',
        marginVertical: 7
    },
    searchImg : {
        width: 20,
        height: 20,
        right: 15,
        top: 11,
        position: 'absolute',
        flex: 1
    },

    footer:{
        backgroundColor: '#EAEAEA' ,
        height:69
    },
    footerTab:{
        backgroundColor: '#EAEAEA',
        width: width ,
        flexDirection: 'row',
        justifyContent: 'space-between' ,
    },
    activeDot:{
        width:8,
        height:8,
        borderRadius:50,
        backgroundColor:COLORS.labelBackground,
        marginVertical:5
    },
    profileImg:{
        width:'100%',
        height:90,
        borderRadius:Platform.OS === 'ios' ? 25 : 50,
    },
    profileImgParent:{
        width:90,
        height:90,
        borderRadius:50,
        borderWidth:5,
        borderColor:'#ffffff66',
        marginTop:(height * 25)/100,
        alignSelf:'center',
        overflow:'hidden',
        marginBottom:10,
    },
    opacityView:{
        width:'100%' ,
        height:90 ,
        position:'absolute' ,
        zIndex:1 ,
        backgroundColor:'#ffffff8c'
    },
    mandob:{
        width:50,
        height:50,
        borderRadius:50,
        borderWidth:2,
        borderColor:'#beddec',
        marginTop:10,
        alignSelf:'center',
        overflow:'hidden',
        marginRight:15
    },
    line:{
        borderWidth:.5 ,
        borderColor:'#e6e6e6' ,
        width:'100%' ,
        marginVertical:20
    },
    upload:{
        position:'absolute' ,
        zIndex:1 ,
        alignSelf:'center' ,
        top:25 ,
        width: 35,
        height: 35
    },
    activeTab:{
        backgroundColor:'#ffffff66',
        width:'50%',
        height:35,
        justifyContent:'center',
        alignItems:'center'
    },
    normalTab:{
        width:'50%',
        height:35,
        justifyContent:'center',
        alignItems:'center'

    },
    activeTabText:{
        color: COLORS.white,
        fontSize: 15,
        fontFamily: I18nManager.isRTL ? 'tajawalBold' : 'openSansBold',
        textAlign:'center',
    },
    normalTabText:{
        color: COLORS.white,
        fontSize: 15,
        fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans',
        textAlign:'center',

    },
    availableProduct:{
        flexDirection:'row' ,
        backgroundColor:'#e9f4f9' ,
        width:'100%' ,
        justifyContent:'center' ,
        alignItems:'center' ,
        padding:7 ,
        marginVertical:10
    },
    tklfa:{
        flexDirection:'row' ,
        justifyContent:'flex-start' ,
        paddingHorizontal:15 ,
        width:'100%',
        borderLeftWidth:5 ,
        height:35,
        alignItems:'center'
    },
    counterParent:{
        flexDirection:'row' ,
        width:'100%' ,
        justifyContent:'center' ,
        alignItems:'center'  ,
        marginVertical:7
    },
    countText:{
        fontSize: 15,
        fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans',
        backgroundColor:COLORS.labelBackground ,
        marginHorizontal:15 ,
        width:70 ,
        height:30,
        lineHeight:30 ,
        borderRadius:15 ,
        textAlign: 'center',
        color:COLORS.white,
        overflow:'hidden'
    },
    doneStyle:{
        backgroundColor:COLORS.white ,
        width:50 ,
        height:33,
        borderRadius:15 ,
        justifyContent:'center',
        alignItems:'center'
    },
    desc:{
        paddingHorizontal:15 ,
        width:'100%' ,
        justifyContent:'center' ,
        alignItems:'flex-start' ,
        marginBottom:10
    },
    error:{
        width:22,
        height:22
    },
    notiBlock:{
        backgroundColor:'#fff' ,
        paddingHorizontal:20 ,
        paddingVertical:15 ,
        borderRadius:15 ,
        marginBottom:15,
    },
    notiBorder:{
        width:5,
        height:'110%',
        top:11,
        position:'absolute',
        left:0,
        backgroundColor:COLORS.labelBackground,
        borderRadius:5
    },
    discount:{
        width:30 ,
        height:30,
        position:'absolute',
        right:10,
        top:10
    },
    curvedImg:{
        width:'101%',
        borderBottomRightRadius:300 ,
        overflow:'hidden',
        height:270
    },
    catPicker:{
        borderWidth: 1,
        borderColor: 'transparent',
        backgroundColor:'transparent',
        height: 30,
        borderRadius: 25,
        width:'100%',
        padding: 0,
        flexDirection: 'row' ,
    },
    pickerLabel:{
        width: undefined,
        backgroundColor: 'transparent',
        color: COLORS.mediumgray ,
        fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans',
        fontWeight: 'normal',
        marginLeft:0,
        fontSize:5,
        textAlign: I18nManager.isRTL ?'right' : 'left',
    },
    delAcc:{
        backgroundColor:'#f2f2f2',
        width:'100%',
        justifyContent:'center',
        alignItems:'center',
        padding:13 ,
        marginVertical:15
    },
    finishOrder:{
        marginTop:Platform.OS === 'ios' ? 100 : 80 ,
        alignSelf:'center' ,
        height : height-80 ,
        width:'83%' ,
        backgroundColor:COLORS.white,
        overflow:'hidden'
    },
    orderdoteStyle:{
        backgroundColor:'#e6e6e6',
        borderRadius: 50,
        width: 10,
        height: 10,
        left: 0,
        bottom:-5
    },
    orderactiveDot:{
        borderRadius: 50,
        borderWidth: 2,
        borderColor: COLORS.labelBackground,
        backgroundColor: COLORS.labelBackground,
        width: 10,
        height: 10,
        left: 0,
        bottom:-5
    },

    itemPicker : {
        borderWidth: 1,
        borderColor:COLORS.mediumgray,
        height: 45,
        marginTop: 25,
        borderRadius: 3,
        width: '100%',
        padding: 5,
        flexDirection: 'row' ,
        textAlign: I18nManager.isRTL ?'right' : 'left',
    },
    picker:{
        width: undefined,
        backgroundColor: 'transparent',
        color: COLORS.mediumgray ,
        fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans',
        fontWeight: 'normal',
        marginLeft:10,
    },
    pickerImg:{
        width: 20,
        height: 20,
        right: 10,
        position:'absolute'
    },
    labelItem:{
        backgroundColor: '#fff',
        alignSelf: 'flex-start',
        fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans',
        color:COLORS.mediumgray,
        fontSize:14 ,
        top:-5,
        paddingRight: 5,
        paddingLeft:5,
        left:5,
    },
    textArea:{
        marginTop:0 ,
        color: COLORS.mediumgray ,
        paddingVertical:15  ,
        paddingLeft:15  ,
        paddingRight:15  ,
        height:100 ,
        fontFamily: I18nManager.isRTL ? 'tajawal' : 'openSans',
        fontSize:14,
        borderWidth: 1,
        borderColor:COLORS.mediumgray,
        borderRadius: 0,
        width: '100%',
        flexDirection: 'row' ,
        textAlign: I18nManager.isRTL ?'right' : 'left',
    },
    touchPlus:{
        borderWidth:1 ,
        borderColor:COLORS.labelBackground ,
        borderRadius:3
    },
    touchMinus:{
        borderWidth:1 ,
        borderColor:COLORS.mediumgray ,
        borderRadius:3
    },
    plus:{
        fontSize:20 ,
        color:COLORS.labelBackground
    },
    minus:{
        fontSize:20 ,
        color:COLORS.mediumgray
    },

    evaluateModal:{
        width: '110%',
        position: 'absolute',
        bottom: -18,
        backgroundColor: '#fff',
        alignSelf: 'center' ,
        borderTopRightRadius:25  ,
        borderTopLeftRadius:25,
        padding:25,
        height:height-100
    },

    sliderParent:{
        width: '100%',
        marginTop: 20
    },
    slider:{
        transform: Platform.OS === 'ios' ? I18nManager.isRTL ? [{rotateY : '0deg'}] : [{rotateY : '0deg'}] : I18nManager.isRTL ? [{rotateY : '-180deg'}] : [{rotateY : '0deg'}]
    },
    range:{
        flexDirection: 'column',
        justifyContent: 'center',
        marginTop: 5,
        alignItems: 'center',
        marginBottom:20
    },
    closeImgTouch:{
        position:'absolute',
        right:15,
        top:-25
    },
    closeImg:{
        width:50,
        height:50,
    },
    emoji:{
        width:70,
        height:70,
        marginBottom:10
    },
    quesCheckBox:{
        borderColor:COLORS.labelBackground ,
        marginRight:20,
        paddingRight:2,
    },
    verticalLine:{
        borderWidth:.5,
        borderColor:'#fff',
        marginHorizontal:15
    },
    arrowIcon:{
        fontSize:30,
        color:COLORS.mediumgray,
        alignSelf:'flex-end',
        top:-3
    },
    orangeCircleItem:{
        width:75 ,
        height:75 ,
        position:'absolute',
        left:-5,
        top:-7
    },
    acorrHeader:{
        flexDirection: "row",
        paddingTop: 10,
        paddingHorizontal: 10,
        justifyContent: "space-between",
        alignItems: "center" ,
        backgroundColor: "#fff" ,
        marginBottom: 7
    },
    acorrContent:{
        backgroundColor: "#fff",
        padding: 15,
        marginTop:-7,
        marginBottom: 7,
        borderTopWidth:.5,
        borderColor:'#e6e6e6'
    },
    accordion:{
        borderWidth:0 ,
        marginHorizontal:14,
        marginTop:5
    },
    drawerCont:{
        textAlign: I18nManager.isRTL ?'right' : 'left',
        alignItems:'flex-start',
        padding:15
    },
    drawerParent:{
        flexDirection:'column',
        alignItems:'flex-start',
        justifyContent:'flex-start',
        width:'100%'
    },
    activeLink:{
        backgroundColor:'#e6f2f8',
        width:'100%',
        flexDirection:'row',
        padding:10,
        borderRadius:7,
        marginBottom:10
    },
    disabledLink:{
        backgroundColor:'transparent',
        width:'100%',
        flexDirection:'row',
        padding:10,
        borderRadius:7,
        marginBottom:10
    },
    menuImg:{
        width: 22,
        height: 22,
        marginRight:15
    },
    menuScroll:{
        height:260 ,
        width:'100%'
    },
    activeFoot:{
        color:COLORS.labelBackground ,
        fontSize:14 ,
        borderBottomWidth:3 ,
        borderBottomColor:COLORS.labelBackground ,
        paddingBottom:0
    },
    footImg:{
        width: 24,
        height: 24
    }
});

export default styles;
