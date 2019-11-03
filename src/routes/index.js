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
import NotFine from "../components/NotFine";
import VideoRecorder from "../components/VideoRecorder";
import ConfirmStatus from "../components/ConfirmStatus";
import Settings from "../components/Settings";
import EmergencyList from "../components/EmergencyList";
import Profile from "../components/Profile";
import EditProfile from "../components/EditProfile";
import ShareApp from "../components/ShareApp";
import Complaint from "../components/Complaint";
import InitScreen from "../components/InitScreen";

const width = Dimensions.get('window').width;
const CustomDrawerContentComponent = (props) => (<CustomDrawer { ...props }/>);
const DrawerNavigator = createDrawerNavigator({
    home: Home,
    profile: Profile,
    complaint: Complaint,
    shareApp: ShareApp,
    settings: Settings,
}, {
    nitialRouteName: 'home',
    drawerPosition: I18nManager.isRTL ? 'right' : 'left',
    contentComponent: CustomDrawerContentComponent,
    drawerOpenRoute: 'DrawerOpen',
    drawerType: 'back',
    drawerCloseRoute: 'DrawerClose',
    gesturesEnabled: false,
    drawerToggleRoute: 'DrawerToggle',
    drawerWidth: (width*70)/100
});

const appStack = createStackNavigator({
    DrawerNavigator: {
        screen: DrawerNavigator,
        navigationOptions: {
            header: null,
            gesturesEnabled: false
        }
    },
    shareApp: {
        screen: ShareApp,
        navigationOptions: {
            header: null,
        }
    },
    editProfile: {
        screen: EditProfile,
        navigationOptions: {
            header: null,
        }
    },
    profile: {
        screen: Profile,
        navigationOptions: {
            header: null,
        }
    },
    notFine: {
        screen: NotFine,
        navigationOptions: {
            header: null,
        }
    },
    inbox: {
        screen: Inbox,
        navigationOptions: {
            header: null,
        }
    },
    emergencyList: {
        screen: EmergencyList,
        navigationOptions: {
            header: null,
        }
    },
    VideoRecorder: {
        screen: VideoRecorder,
        navigationOptions: {
            header: null,
        }
    },
    settings: {
        screen: Settings,
        navigationOptions: {
            header: null,
        }
    },
    complaint: {
        screen: Complaint,
        navigationOptions: {
            header: null,
        }
    },
    confirmStatus: {
        screen: ConfirmStatus,
        navigationOptions: {
            header: null,
        }
    },
});
const authStack = createStackNavigator({
    init: {screen: InitScreen, navigationOptions: {header: null}},
    login: {screen: Login, navigationOptions: {header: null}},
    activeCode: {screen: ActiveCode, navigationOptions: {header: null}},
    register: {screen: Register, navigationOptions: {header: null}},
    loginOrRegister: {screen: LoginOrRegister, navigationOptions: {header: null}},
});

const AppNavigator = createSwitchNavigator({
    auth: authStack,
    app: appStack,
});

export default createAppContainer(AppNavigator);