import {createAppContainer, createSwitchNavigator} from "react-navigation";
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import React from "react";
import { Dimensions, I18nManager } from "react-native";
import Login from '../components/Login'
import LoginOrRegister from '../components/LoginOrRegister'
import Register from "../components/Register";
import ActiveCode from "../components/ActiveCode";
import Home from "../components/Home";
import CustomDrawer from "./CustomDrawer";
import Inbox from "../components/Inbox";

const width = Dimensions.get('window').width;
const CustomDrawerContentComponent = (props) => (<CustomDrawer { ...props }/>);
const DrawerNavigator = createDrawerNavigator({
    home: Home,
}, {
    nitialRouteName: 'home',
    drawerPosition: I18nManager.isRTL ?'right' : 'left',
    contentComponent: CustomDrawerContentComponent,
    drawerOpenRoute: 'DrawerOpen',
    drawerType: 'back',
    drawerCloseRoute: 'DrawerClose',
    gesturesEnabled: false,
    drawerToggleRoute: 'DrawerToggle',
    drawerWidth: (width*70)/100
});

const appStack = createStackNavigator({
    inbox: {
        screen: Inbox,
        navigationOptions: {
            header: null,
        }
    },
    DrawerNavigator: {
        screen: DrawerNavigator,
        navigationOptions: {
            header: null,
            gesturesEnabled: false
        }
    },
});
const authStack = createStackNavigator({
    activeCode: {screen: ActiveCode, navigationOptions: {header: null}},
    login: {screen: Login, navigationOptions: {header: null}},
    register: {screen: Register, navigationOptions: {header: null}},
    loginOrRegister: {screen: LoginOrRegister, navigationOptions: {header: null}},
});

const AppNavigator = createSwitchNavigator({
    app: appStack,
    auth: authStack,
});

export default createAppContainer(AppNavigator);